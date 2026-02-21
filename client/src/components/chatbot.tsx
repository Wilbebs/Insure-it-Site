import { useState, useEffect, useReducer, useRef } from "react";
import { MessageCircle, X, ChevronDown, Send, Upload, FileText, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "./theme-provider";
import type { ConversationContext, ConversationAction, ConversationState, PolicyType, ContactMethod, QuestionGroup } from "@/lib/conversation-types";
import { initialConversationContext } from "@/lib/conversation-types";
import { coreQuestions, coreQuestionGroups, policyQuestionFlows } from "@/lib/policy-questions";
import { validatePolicyDocument, formatFileSize } from "@/lib/file-upload";
import { apiRequest } from "@/lib/queryClient";
import elizabethPhoto from "@assets/image_1764878433544.png";
import usaFlagIcon from "@assets/united_states_of_america_round_icon_64_(1)_1770501803978.png";
import spainFlagIcon from "@assets/spain_round_icon_64_1770501803977.png";

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

const LIZ_AVATAR = elizabethPhoto;

function conversationReducer(state: ConversationContext, action: ConversationAction): ConversationContext {
  switch (action.type) {
    case 'SELECT_POLICY':
      return {
        ...state,
        policyType: action.policyType
      };
    case 'UPDATE_CORE_INFO':
      return {
        ...state,
        coreInfo: {
          ...state.coreInfo,
          [action.field]: action.value
        }
      };
    case 'UPDATE_AUTO_DETAILS':
      return {
        ...state,
        autoDetails: { ...state.autoDetails, [action.field]: action.value }
      };
    case 'UPDATE_HOME_DETAILS':
      return {
        ...state,
        homeDetails: { ...state.homeDetails, [action.field]: action.value }
      };
    case 'UPDATE_LIFE_DETAILS':
      return {
        ...state,
        lifeDetails: { ...state.lifeDetails, [action.field]: action.value }
      };
    case 'UPDATE_COMMERCIAL_DETAILS':
      return {
        ...state,
        commercialDetails: { ...state.commercialDetails, [action.field]: action.value }
      };
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

const INSURANCE_PATTERNS = {
  auto: ['car', 'auto', 'vehicle', 'driver', 'driving', 'automobile'],
  home: ['home', 'house', 'property', 'homeowner', 'dwelling'],
  life: ['life', 'death', 'beneficiary', 'term', 'whole life'],
  commercial: ['commercial', 'business', 'company', 'liability', 'workers comp', 'professional']
};

function detectInsuranceIntent(message: string): PolicyType | null {
  const lower = message.toLowerCase();
  for (const [type, keywords] of Object.entries(INSURANCE_PATTERNS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return type as PolicyType;
    }
  }
  return null;
}

export default function ChatBot() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
  const { t, language, toggleLanguage } = useTranslation();

  const PRESET_QA = [
    { question: t.chatbot.q1, answer: t.chatbot.a1, link: "" },
    { question: t.chatbot.q2, answer: t.chatbot.a2, link: "/#connect" },
    { question: t.chatbot.q3, answer: t.chatbot.a3, link: "" },
  ];

  const INSURANCE_TYPES = [
    { type: 'auto' as PolicyType, label: t.chatbot.autoInsurance },
    { type: 'home' as PolicyType, label: t.chatbot.homeInsurance },
    { type: 'life' as PolicyType, label: t.chatbot.lifeInsurance },
    { type: 'commercial' as PolicyType, label: t.chatbot.commercialInsurance },
  ];

  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: t.chatbot.welcomeMessage }
  ]);
  const [showPolicySelection, setShowPolicySelection] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [showQuestions, setShowQuestions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [convState, dispatch] = useReducer(conversationReducer, initialConversationContext);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inApplicationFlow, setInApplicationFlow] = useState(false);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [groupFormValues, setGroupFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (inApplicationFlow) {
      localStorage.setItem('policyConversation', JSON.stringify(convState));
    }
  }, [convState, inApplicationFlow]);

  useEffect(() => {
    localStorage.removeItem('policyConversation');
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

  useEffect(() => {
    if (isVisible && !isExpanded) {
      setShowWelcomeBubble(true);
      const timer = setTimeout(() => {
        setShowWelcomeBubble(false);
      }, 10000);
      return () => clearTimeout(timer);
    } else {
      setShowWelcomeBubble(false);
    }
  }, [isVisible, isExpanded]);

  const handleExpand = () => {
    setIsExpanded(true);
    setHasNotification(false);
    setShowWelcomeBubble(false);
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
    }, 800);
  };

  const handleQuestionClick = (qa: typeof PRESET_QA[0]) => {
    setMessages(prev => [...prev, { type: 'user', text: qa.question }]);
    setShowQuestions(false);
    addBotMessage(qa.answer, qa.link);
  };

  const getCurrentGroups = (): QuestionGroup[] => {
    if (convState.state === 'collectingCore') {
      return coreQuestionGroups;
    } else if (convState.state === 'collectingPolicySpecific' && convState.policyType) {
      return policyQuestionFlows[convState.policyType].groups;
    }
    return [];
  };

  const getCurrentGroup = (): QuestionGroup | null => {
    const groups = getCurrentGroups();
    if (currentGroupIndex < groups.length) {
      return groups[currentGroupIndex];
    }
    return null;
  };

  const getTotalGroupCount = (): number => {
    return coreQuestionGroups.length + (convState.policyType ? policyQuestionFlows[convState.policyType].groups.length : 0);
  };

  const getCompletedGroupCount = (): number => {
    if (convState.state === 'collectingCore') {
      return currentGroupIndex;
    } else if (convState.state === 'collectingPolicySpecific') {
      return coreQuestionGroups.length + currentGroupIndex;
    } else if (convState.state === 'collectingDocuments' || convState.state === 'reviewing' || convState.state === 'submitted') {
      return getTotalGroupCount();
    }
    return 0;
  };

  const handleGroupSubmit = () => {
    const currentGroup = getCurrentGroup();
    if (!currentGroup) return;

    const requiredFields = currentGroup.questions.filter(q => q.validation?.required);
    const missingRequired = requiredFields.filter(q => !groupFormValues[q.fieldKey]?.trim());
    if (missingRequired.length > 0) {
      toast({
        title: t.chatbot.requiredFields || "Required fields missing",
        description: missingRequired.map(q => q.text.replace("?", "")).join(", "),
        variant: "destructive"
      });
      return;
    }

    const filledValues = Object.entries(groupFormValues)
      .filter(([_, v]) => v.trim() !== '')
      .map(([k, v]) => {
        const q = currentGroup.questions.find(q => q.fieldKey === k);
        return q ? `${q.text.replace("What's your ", "").replace("?", "")}: ${v}` : `${k}: ${v}`;
      });
    
    const summaryText = filledValues.length > 0 ? filledValues.join(', ') : 'Skipped';
    setMessages(prev => [...prev, { type: 'user', text: summaryText }]);

    if (convState.state === 'collectingCore') {
      const savedFirstName = groupFormValues['firstName'] || '';
      
      for (const q of currentGroup.questions) {
        const value = groupFormValues[q.fieldKey] || '';
        if (value) {
          dispatch({ type: 'UPDATE_CORE_INFO', field: q.fieldKey as any, value });
        }
      }

      const groups = coreQuestionGroups;
      const nextGroupIndex = currentGroupIndex + 1;
      
      if (nextGroupIndex < groups.length) {
        setCurrentGroupIndex(nextGroupIndex);
        setGroupFormValues({});
        addBotMessage(groups[nextGroupIndex].title);
      } else {
        dispatch({ type: 'TRANSITION_STATE', state: 'reviewing' });
        setGroupFormValues({});
        const firstName = savedFirstName || convState.coreInfo.firstName || '';
        addBotMessage(t.chatbot.reviewMsg.replace('{name}', firstName));
      }
    }

    /* COMMENTED OUT — Policy-specific question collection (for later)
    else if (convState.state === 'collectingPolicySpecific' && convState.policyType) {
      const updateAction = convState.policyType === 'auto' ? 'UPDATE_AUTO_DETAILS' :
                          convState.policyType === 'home' ? 'UPDATE_HOME_DETAILS' :
                          convState.policyType === 'commercial' ? 'UPDATE_COMMERCIAL_DETAILS' :
                          'UPDATE_LIFE_DETAILS';

      for (const q of currentGroup.questions) {
        const value = groupFormValues[q.fieldKey] || '';
        if (value) {
          dispatch({ type: updateAction, field: q.fieldKey as any, value });
        }
      }

      const policyFlow = policyQuestionFlows[convState.policyType];
      if (!policyFlow) return;
      const nextGroupIndex = currentGroupIndex + 1;
      
      if (nextGroupIndex < policyFlow.groups.length) {
        setCurrentGroupIndex(nextGroupIndex);
        setGroupFormValues({});
        addBotMessage(policyFlow.groups[nextGroupIndex].title);
      } else {
        dispatch({ type: 'TRANSITION_STATE', state: 'collectingDocuments' });
        setGroupFormValues({});
        addBotMessage(t.chatbot.documentUploadMsg);
      }
    }
    */
  };

  const handleGroupFieldChange = (fieldKey: string, value: string) => {
    setGroupFormValues(prev => ({ ...prev, [fieldKey]: value }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const validation = validatePolicyDocument(file);
      if (!validation.valid) {
        toast({ title: "Invalid File", description: validation.error, variant: "destructive" });
        continue;
      }

      const newFile: UploadedFile = {
        file,
        uploading: true,
        progress: 0
      };
      setUploadedFiles(prev => [...prev, newFile]);

      try {
        const response = await apiRequest('POST', '/api/objects/upload', {});
        const { uploadURL } = await response.json();

        const uploadResponse = await fetch(uploadURL, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type
          }
        });

        if (!uploadResponse.ok) {
          throw new Error('Upload failed');
        }

        const objectURL = uploadURL.split('?')[0];

        setUploadedFiles(prev => prev.map(f => 
          f.file === file ? { ...f, uploading: false, progress: 100, url: objectURL } : f
        ));

        dispatch({ type: 'ADD_DOCUMENT', url: objectURL });
        
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
    addBotMessage(t.chatbot.reviewMsg);
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", `${convState.coreInfo.firstName || ''} ${convState.coreInfo.lastName || ''}`.trim());
      formData.append("emailAddress", convState.coreInfo.email || '');
      formData.append("phoneNumber", convState.coreInfo.phone || '');
      formData.append("policyType", convState.policyType || '');

      await apiRequest('POST', '/api/contact', formData);

      dispatch({ type: 'TRANSITION_STATE', state: 'submitted' });
      setMessages(prev => [...prev, { type: 'user', text: 'Submit' }]);
      addBotMessage(t.chatbot.submittedMsg);
      
      toast({ title: t.chatbot.submitApplication, description: t.chatbot.submittedMsg });
      
      localStorage.removeItem('policyConversation');
      setTimeout(() => {
        setInApplicationFlow(false);
        dispatch({ type: 'RESET_CONVERSATION' });
        setUploadedFiles([]);
        setCurrentGroupIndex(0);
        setGroupFormValues({});
      }, 3000);
    } catch (error) {
      toast({ title: "Submission Failed", description: "Please try again or contact us directly.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkClick = (link: string) => {
    if (!link) return;
    if (link === '/#connect' || link === 'open-quote') {
      setIsExpanded(false);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-quote-modal'));
      }, 300);
      return;
    }
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

  const handlePolicyTypeSelection = (insuranceType: { type: PolicyType; label: string }) => {
    setShowPolicySelection(false);
    setMessages(prev => [...prev, { type: 'user', text: insuranceType.label }]);
    
    dispatch({ type: 'SELECT_POLICY', policyType: insuranceType.type });
    setInApplicationFlow(true);
    setCurrentGroupIndex(0);
    setGroupFormValues({});
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: t.chatbot.startMsgShort.replace('{policy}', insuranceType.label).replace('{question}', coreQuestionGroups[0].title)
      }]);
      playMessageSound();
      dispatch({ type: 'TRANSITION_STATE', state: 'collectingCore' });
    }, 800);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue;
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInputValue("");
    setShowQuestions(false);

    const detectedPolicy = detectInsuranceIntent(userMessage);
    
    if (detectedPolicy && convState.state === 'idle') {
      const insuranceType = INSURANCE_TYPES.find(it => it.type === detectedPolicy);
      if (insuranceType) {
        setShowPolicySelection(false);
        
        dispatch({ type: 'SELECT_POLICY', policyType: detectedPolicy });
        setInApplicationFlow(true);
        setCurrentGroupIndex(0);
        setGroupFormValues({});
        
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, { 
            type: 'bot', 
            text: t.chatbot.startMsgShort.replace('{policy}', insuranceType.label).replace('{question}', coreQuestionGroups[0].title)
          }]);
          playMessageSound();
          dispatch({ type: 'TRANSITION_STATE', state: 'collectingCore' });
        }, 800);
      }
      return;
    }

    if (convState.state === 'conversational') {
      const affirmative = ['yes', 'yeah', 'sure', 'ok', 'okay', 'apply', 'start', 'begin', 'let\'s do it', 'go ahead'];
      const isAffirmative = affirmative.some(word => userMessage.toLowerCase().includes(word));
      
      if (isAffirmative && convState.policyType) {
        setInApplicationFlow(true);
        setCurrentGroupIndex(0);
        setGroupFormValues({});
        addBotMessage(t.chatbot.startMsgShort.replace('{policy}', convState.policyType).replace('{question}', coreQuestionGroups[0].title));
        dispatch({ type: 'TRANSITION_STATE', state: 'collectingCore' });
        return;
      }
    }

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
        if (matchedQA.question.toLowerCase().includes('types of insurance') || 
            matchedQA.question.toLowerCase().includes('tell me about')) {
          setShowPolicySelection(true);
        }
      } else {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: t.chatbot.fallbackMsg,
          link: "/#connect"
        }]);
      }
      playMessageSound();
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (inApplicationFlow && getCurrentGroup()) {
        return;
      }
      handleSendMessage();
    }
  };

  const currentGroup = getCurrentGroup();
  const progressPercent = getTotalGroupCount() > 0 ? Math.round((getCompletedGroupCount() / getTotalGroupCount()) * 100) : 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 right-6 z-[60]"
          data-testid="chatbot-widget"
        >
          {!isExpanded ? (
            <div className="relative">
              <AnimatePresence>
                {showWelcomeBubble && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute -top-[53px] right-[30px] whitespace-nowrap"
                  >
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl px-5 py-3 relative">
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {t.chatbot.welcomeBubble}
                      </div>
                      <div className="absolute bottom-0 right-3 w-4 h-4 bg-white dark:bg-slate-800 transform rotate-45 translate-y-2 shadow-md"></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleExpand}
                className="relative group"
                data-testid="chatbot-minimized-button"
              >
                <div className="animated-border-circle w-16 h-16 rounded-full overflow-hidden shadow-2xl transition-all hover:scale-110 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  <img 
                    src={LIZ_AVATAR}
                    alt="Chat with Liz"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {hasNotification && !showWelcomeBubble && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    1
                  </span>
                )}
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-[350px] sm:w-[420px] flex flex-col h-[600px]"
              data-testid="chatbot-expanded"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 flex flex-col rounded-t-3xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <img 
                      src={LIZ_AVATAR}
                      alt="Liz - Insurance Assistant"
                      className="w-10 h-10 rounded-full border-2 border-white object-cover object-top"
                    />
                    <div>
                      <h3 className="font-bold" style={{ transform: 'translateY(8px)' }}>{t.chatbot.title}</h3>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs opacity-90">{t.chatbot.subtitle}</p>
                        <button
                          onClick={toggleLanguage}
                          className="relative px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300" style={{ transform: 'translateY(-7.5px)' }}
                          data-testid="chatbot-language-toggle"
                          aria-label={t.nav.switchLang}
                        >
                          <span className="text-[10px] font-bold text-white flex items-center justify-center">
                            {language === "en" ? "EN" : "ES"}
                          </span>
                          <img
                            src={language === "en" ? usaFlagIcon : spainFlagIcon}
                            alt=""
                            aria-hidden="true"
                            className="absolute -top-1 -right-1 w-3.5 h-3.5 object-contain rounded-full drop-shadow-sm"
                          />
                        </button>
                      </div>
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
                
                {/* Progress Bar */}
                {convState.policyType && convState.state === 'collectingCore' && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{t.chatbot.applicationProgress}</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-800">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 shadow-md'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      {msg.link && msg.type === 'bot' && (
                        <button
                          onClick={() => handleLinkClick(msg.link!)}
                          className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                          data-testid="chatbot-message-link"
                        >
                          {t.chatbot.viewLink}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Insurance Type Selection Buttons */}
                {showPolicySelection && convState.state === 'idle' && !isTyping && (
                  <div className="bg-white dark:bg-slate-700 p-4 rounded-md shadow-md space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t.chatbot.selectType}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {INSURANCE_TYPES.map((insuranceType, idx) => (
                        <motion.button
                          key={insuranceType.type}
                          onClick={() => handlePolicyTypeSelection(insuranceType)}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white p-3 rounded-lg transition-all shadow-md hover:shadow-lg font-semibold text-sm"
                          whileHover={{ 
                            scale: 1.02
                          }}
                          whileTap={{
                            scale: insuranceType.type === 'auto' ? [1, 1.2, 0.85, 1.1, 1] : 
                                   insuranceType.type === 'home' ? [1, 0.8, 1.25, 0.9, 1] : 
                                   insuranceType.type === 'life' ? [1, 1.15, 1.15, 0.95, 1] :
                                   insuranceType.type === 'commercial' ? [1, 1.3, 0.85, 1.15, 1] :
                                   [1, 0.85, 1.2, 0.9, 1.1, 1],
                            rotate: insuranceType.type === 'auto' ? [0, 8, -8, 5, -5, 0] : 
                                   insuranceType.type === 'home' ? [0, -5, 5, -3, 3, 0] : 
                                   insuranceType.type === 'life' ? [0, 0, 0, 0] :
                                   insuranceType.type === 'commercial' ? [0, -10, 10, -6, 6, 0] :
                                   [0, 4, -4, 2, -2, 0],
                            y: insuranceType.type === 'auto' ? [0, -8, 4, -2, 0] :
                               insuranceType.type === 'home' ? [0, 6, -4, 2, 0] :
                               insuranceType.type === 'life' ? [0, -10, -10, 0] :
                               insuranceType.type === 'commercial' ? [0, -12, 6, -3, 0] :
                               [0, 5, -8, 3, 0],
                            transition: { 
                              duration: insuranceType.type === 'auto' ? 0.5 : 
                                       insuranceType.type === 'home' ? 0.6 : 
                                       insuranceType.type === 'life' ? 0.4 :
                                       insuranceType.type === 'commercial' ? 0.55 :
                                       0.65,
                              type: "spring",
                              stiffness: insuranceType.type === 'auto' ? 400 : 
                                        insuranceType.type === 'home' ? 250 : 
                                        insuranceType.type === 'life' ? 500 :
                                        insuranceType.type === 'commercial' ? 450 :
                                        300
                            }
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          data-testid={`select-${insuranceType.type}-insurance`}
                        >
                          {insuranceType.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start gap-2">
                    <img 
                      src={LIZ_AVATAR}
                      alt="Liz typing"
                      className="w-8 h-8 rounded-full object-cover object-top"
                    />
                    <div className="bg-white dark:bg-slate-700 p-3 rounded-2xl shadow-md">
                      <div className="flex gap-1">
                        <motion.div
                          className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Grouped Question Form - All fields in a group shown together */}
                {currentGroup && !isTyping && convState.state === 'collectingCore' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow-md space-y-3"
                    data-testid="question-group-form"
                  >
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400 border-b border-blue-100 dark:border-slate-600 pb-2">
                      {currentGroup.title}
                    </p>
                    
                    {currentGroup.questions.map((q) => (
                      <div key={q.id} className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                          {q.text}
                          {q.validation?.required && <span className="text-red-400 ml-0.5">*</span>}
                        </label>
                        
                        {q.type === 'select' ? (
                          <select
                            value={groupFormValues[q.fieldKey] || ''}
                            onChange={(e) => handleGroupFieldChange(q.fieldKey, e.target.value)}
                            className="w-full p-2 text-sm border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200"
                            data-testid={`group-field-${q.fieldKey}`}
                          >
                            <option value="">{t.chatbot.selectPlaceholder}</option>
                            {q.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={q.type === 'number' ? 'number' : 'text'}
                            value={groupFormValues[q.fieldKey] || ''}
                            onChange={(e) => handleGroupFieldChange(q.fieldKey, e.target.value)}
                            placeholder={q.placeholder || q.helperText || ''}
                            className="w-full p-2 text-sm border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                            data-testid={`group-field-${q.fieldKey}`}
                          />
                        )}
                      </div>
                    ))}
                    
                    <button
                      onClick={handleGroupSubmit}
                      className="w-full bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors mt-2"
                      data-testid="group-submit-button"
                    >
                      {t.chatbot.continueBtn}
                    </button>
                  </motion.div>
                )}

                {/* Document Upload UI */}
                {convState.state === 'collectingDocuments' && !isTyping && (
                  <div className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow-md space-y-4">
                    <label className="cursor-pointer block relative">
                      <div className="border-2 border-dashed border-blue-300 dark:border-blue-500 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors pointer-events-none">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t.chatbot.uploadDocuments}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t.chatbot.uploadFormats}</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        data-testid="file-upload-input"
                      />
                    </label>
                    
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        {uploadedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-600 rounded">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs truncate text-gray-700 dark:text-gray-200">{file.file.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.file.size)}</p>
                            </div>
                            {file.uploading && (
                              <div className="text-xs text-blue-500">{t.chatbot.uploading}</div>
                            )}
                            {file.url && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                            <button
                              onClick={() => handleRemoveFile(file)}
                              className="text-red-500 hover:text-red-700 z-10 relative"
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
                      className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-semibold relative z-10"
                      data-testid="continue-to-review"
                    >
                      {t.chatbot.continueReview}
                    </button>
                  </div>
                )}

                {/* Review & Submit UI */}
                {convState.state === 'reviewing' && !isTyping && (
                  <div className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow-md space-y-3">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">{t.chatbot.summaryTitle}</h3>
                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <div>
                        <span className="font-semibold">{t.chatbot.policyTypeLabel}</span> {convState.policyType}
                      </div>
                      <div>
                        <span className="font-semibold">{t.chatbot.nameLabel}</span> {convState.coreInfo.firstName} {convState.coreInfo.lastName}
                      </div>
                      <div>
                        <span className="font-semibold">{t.chatbot.emailLabel}</span> {convState.coreInfo.email}
                      </div>
                      <div>
                        <span className="font-semibold">{t.chatbot.phoneLabel}</span> {convState.coreInfo.phone}
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSubmitApplication}
                      disabled={isSubmitting}
                      className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400"
                      data-testid="submit-application"
                    >
                      {isSubmitting ? t.chatbot.submitting : t.chatbot.submitApplication}
                    </button>
                  </div>
                )}

                {/* Preset Questions */}
                {showQuestions && !isTyping && !inApplicationFlow && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{t.chatbot.quickActions}</p>
                    {PRESET_QA.map((qa, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuestionClick(qa)}
                        className="w-full text-left p-3 bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 rounded-lg border border-blue-200 dark:border-slate-600 text-sm text-blue-600 dark:text-blue-400 transition-colors"
                        data-testid={`chatbot-question-${idx}`}
                      >
                        {qa.question}
                      </button>
                    ))}
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input - ALWAYS shown at bottom */}
              <div className="p-4 bg-white dark:bg-slate-900 border-t dark:border-slate-700 flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={inApplicationFlow && currentGroup ? t.chatbot.useFormAbove : t.chatbot.typeMessage}
                  disabled={inApplicationFlow && currentGroup !== null}
                  className="flex-1 px-4 py-2 border dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                  data-testid="chatbot-input"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={inApplicationFlow && currentGroup !== null}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  data-testid="chatbot-send-button"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
