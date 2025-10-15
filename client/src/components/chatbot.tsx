import { useState, useEffect, useReducer, useRef } from "react";
import { MessageCircle, X, ChevronDown, Send, Upload, FileText, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { ConversationContext, ConversationAction, ConversationState, PolicyType, ContactMethod } from "@/lib/conversation-types";
import { initialConversationContext } from "@/lib/conversation-types";
import { coreQuestions, policyQuestionFlows } from "@/lib/policy-questions";
import { validatePolicyDocument, formatFileSize } from "@/lib/file-upload";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  type: 'bot' | 'user' | 'system';
  text: string;
  link?: string;
}

interface UploadedFile {
  file: File;
  url?: string;
  uploading: boolean;
  progress: number;
  error?: string;
}

const LIZ_AVATAR = "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200";

const PRESET_QA = [
  {
    question: "What types of insurance do you offer?",
    answer: "We offer Auto Insurance, Home Insurance, Life Insurance, Health Insurance, and Commercial Insurance. Click below to learn more about each type:",
    link: "/#insurance-sections"
  },
  {
    question: "How can I get a quote?",
    answer: "You can get a free quote by filling out our contact form. Click here to get started:",
    link: "/#connect"
  },
  {
    question: "Apply for policy",
    answer: "I can help you apply for a policy right here! Just select which type of insurance you need, and I'll guide you through the process.",
    link: ""
  }
];

// Conversation state reducer
function conversationReducer(state: ConversationContext, action: ConversationAction): ConversationContext {
  switch (action.type) {
    case 'SELECT_POLICY':
      return {
        ...state,
        policyType: action.policyType,
        state: 'collectingCore',
        currentQuestionIndex: 0
      };
    case 'UPDATE_CORE_INFO':
      return {
        ...state,
        coreInfo: {
          ...state.coreInfo,
          [action.field]: action.value
        }
      };
    case 'UPDATE_AUTO_DETAILS': {
      const [parent, child] = action.field.includes('.') ? action.field.split('.') : [action.field, null];
      if (child) {
        // Handle nested fields like primaryVehicle.make
        const parentObj = (state.autoDetails as any)[parent] || {};
        return {
          ...state,
          autoDetails: {
            ...state.autoDetails,
            [parent]: { ...parentObj, [child]: action.value }
          }
        };
      }
      return {
        ...state,
        autoDetails: {
          ...state.autoDetails,
          [action.field]: action.value
        }
      };
    }
    case 'UPDATE_HOME_DETAILS': {
      const [parent, child] = action.field.includes('.') ? action.field.split('.') : [action.field, null];
      if (child) {
        const parentObj = (state.homeDetails as any)[parent] || {};
        return {
          ...state,
          homeDetails: {
            ...state.homeDetails,
            [parent]: { ...parentObj, [child]: action.value }
          }
        };
      }
      return {
        ...state,
        homeDetails: {
          ...state.homeDetails,
          [action.field]: action.value
        }
      };
    }
    case 'UPDATE_LIFE_DETAILS': {
      const [parent, child] = action.field.includes('.') ? action.field.split('.') : [action.field, null];
      if (child) {
        const parentObj = (state.lifeDetails as any)[parent] || {};
        return {
          ...state,
          lifeDetails: {
            ...state.lifeDetails,
            [parent]: { ...parentObj, [child]: action.value }
          }
        };
      }
      return {
        ...state,
        lifeDetails: {
          ...state.lifeDetails,
          [action.field]: action.value
        }
      };
    }
    case 'ADD_DOCUMENT':
      return {
        ...state,
        documents: [...state.documents, action.url]
      };
    case 'REMOVE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(url => url !== action.url)
      };
    case 'UPDATE_NOTES':
      return {
        ...state,
        notes: action.notes
      };
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1
      };
    case 'PREVIOUS_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1)
      };
    case 'TRANSITION_STATE':
      return {
        ...state,
        state: action.state
      };
    case 'RESET_CONVERSATION':
      return initialConversationContext;
    case 'LOAD_FROM_STORAGE':
      return action.context;
    default:
      return state;
  }
}

export default function ChatBot() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: 'Hi! I\'m Liz, your insurance assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [showQuestions, setShowQuestions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Conversation state management
  const [convState, dispatch] = useReducer(conversationReducer, initialConversationContext);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inPolicyFlow, setInPolicyFlow] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Persist conversation state to localStorage
  useEffect(() => {
    if (inPolicyFlow) {
      localStorage.setItem('policyConversation', JSON.stringify(convState));
    }
  }, [convState, inPolicyFlow]);

  // Load conversation state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('policyConversation');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.state !== 'idle' && parsed.state !== 'submitted') {
          dispatch({ type: 'LOAD_FROM_STORAGE', context: parsed });
          setInPolicyFlow(true);
        }
      } catch (e) {
        console.error('Failed to load conversation state:', e);
      }
    }
  }, []);

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const playMessageSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 600;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !isVisible) {
        setIsVisible(true);
        playNotificationSound();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  const handleExpand = () => {
    setIsExpanded(true);
    setHasNotification(false);
  };

  const handleMinimize = () => {
    setIsExpanded(false);
  };

  const addBotMessage = (text: string, link?: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { type: 'bot', text, link }]);
      playMessageSound();
    }, 1500);
  };

  const handleQuestionClick = (qa: typeof PRESET_QA[0]) => {
    setMessages(prev => [...prev, { type: 'user', text: qa.question }]);
    setShowQuestions(false);
    
    if (qa.question === "Apply for policy") {
      setInPolicyFlow(true);
      addBotMessage("Great! I'll help you apply for insurance. Which type of policy are you interested in?");
      dispatch({ type: 'TRANSITION_STATE', state: 'policySelection' });
    } else {
      addBotMessage(qa.answer, qa.link);
    }
  };

  const handlePolicySelection = (policyType: PolicyType) => {
    setMessages(prev => [...prev, { type: 'user', text: `${policyType.charAt(0).toUpperCase() + policyType.slice(1)} Insurance` }]);
    dispatch({ type: 'SELECT_POLICY', policyType });
    
    const policyName = policyType.charAt(0).toUpperCase() + policyType.slice(1);
    addBotMessage(`Perfect! Let's start with ${policyName} Insurance. ${coreQuestions[0].text}`);
  };

  const handleAnswerSubmit = (value: any, fieldKey: string) => {
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: String(value) }]);

    // Determine which detail type to update
    if (convState.state === 'collectingCore') {
      dispatch({ type: 'UPDATE_CORE_INFO', field: fieldKey as any, value });
      
      const nextIndex = convState.currentQuestionIndex + 1;
      if (nextIndex < coreQuestions.length) {
        dispatch({ type: 'NEXT_QUESTION' });
        addBotMessage(coreQuestions[nextIndex].text);
      } else {
        // Move to policy-specific questions
        dispatch({ type: 'TRANSITION_STATE', state: 'collectingPolicySpecific' });
        dispatch({ type: 'NEXT_QUESTION' });
        const policyFlow = policyQuestionFlows[convState.policyType!];
        addBotMessage(policyFlow.questions[0].text);
      }
    } else if (convState.state === 'collectingPolicySpecific') {
      const policyFlow = policyQuestionFlows[convState.policyType!];
      const currentQ = policyFlow.questions[convState.currentQuestionIndex - coreQuestions.length];
      
      // Update policy-specific details (reducer handles nested fields)
      if (convState.policyType === 'auto') {
        dispatch({ type: 'UPDATE_AUTO_DETAILS', field: fieldKey as any, value });
      } else if (convState.policyType === 'home') {
        dispatch({ type: 'UPDATE_HOME_DETAILS', field: fieldKey as any, value });
      } else {
        dispatch({ type: 'UPDATE_LIFE_DETAILS', field: fieldKey as any, value });
      }
      
      const nextLocalIndex = convState.currentQuestionIndex - coreQuestions.length + 1;
      if (nextLocalIndex < policyFlow.questions.length) {
        dispatch({ type: 'NEXT_QUESTION' });
        addBotMessage(policyFlow.questions[nextLocalIndex].text);
      } else {
        // Move to document upload
        dispatch({ type: 'TRANSITION_STATE', state: 'collectingDocuments' });
        addBotMessage("Great! Now, do you have any documents you'd like to upload? (Driver's license, current policy, etc.) You can upload PDF, DOC, DOCX, JPG, or PNG files.");
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const validation = validatePolicyDocument(file);
      if (!validation.valid) {
        toast({ title: "Invalid File", description: validation.error, variant: "destructive" });
        continue;
      }

      // Add file to uploading state
      const newFile: UploadedFile = {
        file,
        uploading: true,
        progress: 0
      };
      setUploadedFiles(prev => [...prev, newFile]);

      // Upload to server
      try {
        const formData = new FormData();
        formData.append('document', file);

        const response = await apiRequest('POST', '/api/policy-documents', formData);
        const result = await response.json();

        // Update file with URL
        setUploadedFiles(prev => prev.map(f => 
          f.file === file ? { ...f, uploading: false, progress: 100, url: result.url } : f
        ));

        // Add to conversation state
        dispatch({ type: 'ADD_DOCUMENT', url: result.url });
        
        toast({ title: "Document Uploaded", description: `${file.name} uploaded successfully!` });
      } catch (error) {
        setUploadedFiles(prev => prev.map(f =>
          f.file === file ? { ...f, uploading: false, error: 'Upload failed' } : f
        ));
        toast({ title: "Upload Failed", description: `Failed to upload ${file.name}`, variant: "destructive" });
      }
    }
  };

  const handleRemoveFile = (file: UploadedFile) => {
    if (file.url) {
      dispatch({ type: 'REMOVE_DOCUMENT', url: file.url });
    }
    setUploadedFiles(prev => prev.filter(f => f !== file));
  };

  const handleContinueToReview = () => {
    dispatch({ type: 'TRANSITION_STATE', state: 'reviewing' });
    setMessages(prev => [...prev, { type: 'user', text: 'Continue to review' }]);
    addBotMessage("Perfect! Let me summarize your application. Please review the information below and confirm if everything looks correct.");
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      // Prepare submission data
      const submissionData: any = {
        applicantName: convState.coreInfo.name,
        email: convState.coreInfo.email,
        phone: convState.coreInfo.phone,
        policyType: convState.policyType,
        preferredContactMethod: convState.coreInfo.preferredContactMethod,
        coreDetails: JSON.stringify(convState.coreInfo),
        documents: convState.documents,
        notes: convState.notes
      };

      // Add policy-specific details
      if (convState.policyType === 'auto') {
        submissionData.autoDetails = JSON.stringify(convState.autoDetails);
      } else if (convState.policyType === 'home') {
        submissionData.homeDetails = JSON.stringify(convState.homeDetails);
      } else if (convState.policyType === 'life') {
        submissionData.lifeDetails = JSON.stringify(convState.lifeDetails);
      }

      const response = await apiRequest('POST', '/api/policy-applications', submissionData);
      const result = await response.json();

      dispatch({ type: 'TRANSITION_STATE', state: 'submitted' });
      setMessages(prev => [...prev, { type: 'user', text: 'Submit application' }]);
      addBotMessage(`Congratulations! Your application has been submitted successfully. Your application ID is ${result.applicationId}. We'll contact you within 24 hours!`);
      
      toast({ title: "Application Submitted", description: "We'll be in touch soon!" });
      
      // Clear conversation state
      localStorage.removeItem('policyConversation');
      setTimeout(() => {
        setInPolicyFlow(false);
        dispatch({ type: 'RESET_CONVERSATION' });
        setUploadedFiles([]);
      }, 3000);
    } catch (error) {
      toast({ title: "Submission Failed", description: "Please try again or contact us directly.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentQuestion = () => {
    if (convState.state === 'collectingCore') {
      return coreQuestions[convState.currentQuestionIndex];
    } else if (convState.state === 'collectingPolicySpecific') {
      const policyFlow = policyQuestionFlows[convState.policyType!];
      return policyFlow.questions[convState.currentQuestionIndex - coreQuestions.length];
    }
    return null;
  };

  const handleLinkClick = (link: string) => {
    if (!link) return;
    if (link.startsWith('/#')) {
      const section = link.substring(2);
      if (window.location.pathname !== '/') {
        setLocation('/');
        setTimeout(() => {
          document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setLocation(link);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsExpanded(false);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue;
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInputValue("");

    const matchedQA = PRESET_QA.find(qa => {
      const questionWords = qa.question.toLowerCase().split(' ');
      const userWords = userMessage.toLowerCase().split(' ');
      return questionWords.some(word => userWords.includes(word)) || 
             userWords.some(word => questionWords.includes(word));
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      if (matchedQA) {
        setMessages(prev => [...prev, { type: 'bot', text: matchedQA.answer, link: matchedQA.link }]);
      } else {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: "Thanks for your question! For personalized assistance, please contact us at (555) 123-4567 or fill out our contact form.",
          link: "/#connect"
        }]);
      }
      playMessageSound();
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !inPolicyFlow) {
      handleSendMessage();
    }
  };

  const currentQuestion = getCurrentQuestion();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 right-6 z-50"
          data-testid="chatbot-widget"
        >
          {!isExpanded ? (
            <button
              onClick={handleExpand}
              className="relative group"
              data-testid="chatbot-minimized-button"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-2xl ring-4 ring-blue-500/50 hover:ring-blue-500 transition-all hover:scale-110">
                <img 
                  src={LIZ_AVATAR}
                  alt="Chat with Liz"
                  className="w-full h-full object-cover object-center scale-110"
                />
              </div>
              {hasNotification && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  1
                </span>
              )}
            </button>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl w-[350px] sm:w-[420px] overflow-hidden"
              data-testid="chatbot-expanded"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={LIZ_AVATAR}
                    alt="Liz - Insurance Assistant"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover object-center scale-110"
                  />
                  <div>
                    <h3 className="font-bold">Liz</h3>
                    <p className="text-xs opacity-90">Insurance Assistant</p>
                  </div>
                </div>
                <button
                  onClick={handleMinimize}
                  className="hover:bg-white/20 p-2 rounded-full transition-colors"
                  data-testid="chatbot-minimize-button"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="h-[450px] overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 shadow-md'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      {msg.link && msg.type === 'bot' && (
                        <button
                          onClick={() => handleLinkClick(msg.link!)}
                          className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                          data-testid="chatbot-message-link"
                        >
                          View →
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start gap-2">
                    <img 
                      src={LIZ_AVATAR}
                      alt="Liz typing"
                      className="w-8 h-8 rounded-full object-cover object-center scale-110"
                    />
                    <div className="bg-white p-3 rounded-2xl shadow-md">
                      <div className="flex gap-1">
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Policy Selection Buttons */}
                {convState.state === 'policySelection' && !isTyping && (
                  <div className="space-y-2">
                    {(['auto', 'home', 'life'] as PolicyType[]).map(policyType => (
                      <button
                        key={policyType}
                        onClick={() => handlePolicySelection(policyType)}
                        className="w-full p-4 bg-white hover:bg-blue-50 rounded-lg border-2 border-blue-500 text-blue-600 font-semibold transition-colors"
                        data-testid={`policy-select-${policyType}`}
                      >
                        {policyType.charAt(0).toUpperCase() + policyType.slice(1)} Insurance
                      </button>
                    ))}
                  </div>
                )}

                {/* Question Input UI */}
                {currentQuestion && !isTyping && (convState.state === 'collectingCore' || convState.state === 'collectingPolicySpecific') && (
                  <div className="bg-white p-4 rounded-lg shadow-md space-y-3">
                    <p className="text-sm font-semibold text-gray-700">{currentQuestion.text}</p>
                    {currentQuestion.helperText && (
                      <p className="text-xs text-gray-500">{currentQuestion.helperText}</p>
                    )}
                    
                    {currentQuestion.type === 'select' && (
                      <select
                        onChange={(e) => handleAnswerSubmit(e.target.value, currentQuestion.fieldKey)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        data-testid="question-select"
                      >
                        <option value="">Select...</option>
                        {currentQuestion.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                    
                    {currentQuestion.type === 'multiselect' && (
                      <div className="space-y-2">
                        {currentQuestion.options?.map(opt => (
                          <label key={opt} className="flex items-center gap-2">
                            <input type="checkbox" value={opt} className="rounded" />
                            <span className="text-sm">{opt}</span>
                          </label>
                        ))}
                        <button
                          onClick={() => {
                            const checked = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map((el: any) => el.value);
                            handleAnswerSubmit(checked, currentQuestion.fieldKey);
                          }}
                          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                          data-testid="question-multiselect-submit"
                        >
                          Continue
                        </button>
                      </div>
                    )}
                    
                    {currentQuestion.type === 'boolean' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAnswerSubmit(true, currentQuestion.fieldKey)}
                          className="flex-1 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                          data-testid="question-boolean-yes"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => handleAnswerSubmit(false, currentQuestion.fieldKey)}
                          className="flex-1 bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400"
                          data-testid="question-boolean-no"
                        >
                          No
                        </button>
                      </div>
                    )}
                    
                    {(currentQuestion.type === 'text' || currentQuestion.type === 'number') && (
                      <div className="flex gap-2">
                        <input
                          type={currentQuestion.type}
                          placeholder="Your answer..."
                          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = (e.target as HTMLInputElement).value;
                              handleAnswerSubmit(currentQuestion.type === 'number' ? parseFloat(value) : value, currentQuestion.fieldKey);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                          data-testid="question-text-input"
                        />
                        <button
                          onClick={(e) => {
                            const input = (e.currentTarget.previousSibling as HTMLInputElement);
                            const value = input.value;
                            handleAnswerSubmit(currentQuestion.type === 'number' ? parseFloat(value) : value, currentQuestion.fieldKey);
                            input.value = '';
                          }}
                          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                          data-testid="question-text-submit"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Document Upload UI */}
                {convState.state === 'collectingDocuments' && !isTyping && (
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-lg shadow-md space-y-3">
                      <label className="cursor-pointer block">
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                          <p className="text-sm text-gray-600">Click to upload documents</p>
                          <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileSelect}
                          className="hidden"
                          data-testid="file-upload-input"
                        />
                      </label>
                      
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          {uploadedFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <FileText className="w-4 h-4 text-blue-500" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs truncate">{file.file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.file.size)}</p>
                              </div>
                              {file.uploading && (
                                <div className="text-xs text-blue-500">Uploading...</div>
                              )}
                              {file.url && (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              )}
                              <button
                                onClick={() => handleRemoveFile(file)}
                                className="text-red-500 hover:text-red-700"
                                data-testid={`file-remove-${idx}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <button
                        onClick={handleContinueToReview}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-semibold"
                        data-testid="continue-to-review"
                      >
                        Continue to Review
                      </button>
                    </div>
                  </div>
                )}

                {/* Review & Submit UI */}
                {convState.state === 'reviewing' && !isTyping && (
                  <div className="bg-white p-4 rounded-lg shadow-md space-y-3">
                    <h3 className="font-bold text-gray-800">Application Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Policy Type:</span> {convState.policyType}
                      </div>
                      <div>
                        <span className="font-semibold">Name:</span> {convState.coreInfo.name}
                      </div>
                      <div>
                        <span className="font-semibold">Email:</span> {convState.coreInfo.email}
                      </div>
                      <div>
                        <span className="font-semibold">Phone:</span> {convState.coreInfo.phone}
                      </div>
                      <div>
                        <span className="font-semibold">Documents:</span> {convState.documents.length} uploaded
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSubmitApplication}
                      disabled={isSubmitting}
                      className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400"
                      data-testid="submit-application"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                )}

                {/* Preset Questions */}
                {showQuestions && !isTyping && !inPolicyFlow && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs text-gray-500 font-semibold">Quick Actions:</p>
                    {PRESET_QA.map((qa, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuestionClick(qa)}
                        className="w-full text-left p-3 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-600 transition-colors"
                        data-testid={`chatbot-question-${idx}`}
                      >
                        {qa.question}
                      </button>
                    ))}
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input (only for general chat, not policy flow) */}
              {!inPolicyFlow && (
                <div className="p-4 bg-white border-t flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    data-testid="chatbot-input"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                    data-testid="chatbot-send-button"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
