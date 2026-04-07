"use client";

import { useState, useEffect, useReducer, useRef } from "react";
import { MessageCircle, X, ChevronDown, ChevronLeft, ChevronRight, Send, Upload, FileText, Trash2, CheckCircle2 } from "lucide-react";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "./theme-provider";
import type { ConversationContext, ConversationAction, ConversationState, PolicyType, ContactMethod, QuestionGroup } from "@/lib/conversation-types";
import { initialConversationContext } from "@/lib/conversation-types";
import { coreQuestions, coreQuestionGroups, policyQuestionFlows } from "@/lib/policy-questions";
import { validatePolicyDocument, formatFileSize } from "@/lib/file-upload";
import { apiRequest } from "@/lib/queryClient";
const elizabethPhoto = "/images/elizabeth_photo.webp";
const usaFlagIcon = "/images/usa_flag.png";
const spainFlagIcon = "/images/spain_flag.png";

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
    case 'SET_POLICY_TYPES':
      return {
        ...state,
        policyTypes: action.policyTypes
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
  health: ['health', 'medical', 'doctor', 'hospital', 'prescription', 'coverage plan', 'individual plan', 'family plan'],
  commercial: ['commercial', 'business', 'company', 'liability', 'workers comp', 'professional'],
  flood: ['flood', 'flooding', 'water damage', 'storm surge', 'hurricane water']
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

function CopyLink({ href, copyText, children, className }: {
  href: string;
  copyText: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleClick = () => {
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <a href={href} onClick={handleClick} className={`relative inline-flex items-center gap-0.5 transition-all duration-200 ${copied ? "text-green-500 no-underline" : ""} ${className ?? ""}`}>
      {copied ? (
        <>
          <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Copied!</span>
        </>
      ) : children}
    </a>
  );
}

function renderMessageText(text: string): React.ReactNode {
  const pattern = /(\d{3}-\d{3}-\d{4}|[\w.+-]+@[\w.-]+\.[a-z]{2,})/gi;
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    if (/^\d{3}-\d{3}-\d{4}$/.test(part)) {
      return (
        <CopyLink
          key={i}
          href={`tel:+1${part.replace(/-/g, "")}`}
          copyText={part.replace(/-/g, "")}
          className="font-semibold underline underline-offset-2 hover:opacity-80"
        >
          {part}
        </CopyLink>
      );
    }
    if (/^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i.test(part)) {
      return (
        <CopyLink
          key={i}
          href={`mailto:${part}`}
          copyText={part}
          className="font-semibold underline underline-offset-2 hover:opacity-80 break-all"
        >
          {part}
        </CopyLink>
      );
    }
    return part;
  });
}

export default function ChatBot() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
  const [typedBubble, setTypedBubble] = useState("");
  const [socialOpen, setSocialOpen] = useState(false);
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
    { type: 'health' as PolicyType, label: t.chatbot.healthInsurance },
    { type: 'commercial' as PolicyType, label: t.chatbot.commercialInsurance },
    { type: 'flood' as PolicyType, label: t.chatbot.floodInsurance },
  ];

  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: t.chatbot.welcomeMessage }
  ]);
  const [showPolicySelection, setShowPolicySelection] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [showQuestions, setShowQuestions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [convState, dispatch] = useReducer(conversationReducer, initialConversationContext);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inApplicationFlow, setInApplicationFlow] = useState(false);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [groupFormValues, setGroupFormValues] = useState<Record<string, string>>({});
  const [simpleFormValues, setSimpleFormValues] = useState({ firstName: '', lastName: '', email: '', phone: '' });

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

  useEffect(() => {
    if (!showWelcomeBubble) {
      setTypedBubble("");
      return;
    }
    const fullText = t.chatbot.welcomeBubble;
    setTypedBubble("");
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedBubble(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 38);
    return () => clearInterval(interval);
  }, [showWelcomeBubble, t.chatbot.welcomeBubble]);

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
    } else if (convState.state === 'collectingPolicySpecific' && convState.policyTypes.length > 0) {
      // For now, we only show specific questions for the first selected type if any
      // In the future, we can loop through all selected types
      return policyQuestionFlows[convState.policyTypes[0]].groups;
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
    return coreQuestionGroups.length + (convState.policyTypes.length > 0 ? policyQuestionFlows[convState.policyTypes[0]].groups.length : 0);
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
      formData.append("policyType", convState.policyTypes.join(', '));

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
        setShowPolicySelection(true);
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
        router.push('/');
        setTimeout(() => {
          document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(link);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsExpanded(false);
  };

  const handlePolicyTypeSelection = (insuranceType: { type: PolicyType; label: string }) => {
    const isSelected = convState.policyTypes.includes(insuranceType.type);
    const nextTypes = isSelected
      ? convState.policyTypes.filter(t => t !== insuranceType.type)
      : [...convState.policyTypes, insuranceType.type];

    dispatch({ type: 'SET_POLICY_TYPES', policyTypes: nextTypes });
  };

  const handleStartApplication = () => {
    if (convState.policyTypes.length === 0) return;

    setShowPolicySelection(false);
    const selectedLabels = INSURANCE_TYPES
      .filter(it => convState.policyTypes.includes(it.type))
      .map(it => it.label)
      .join(', ');

    setMessages(prev => [...prev, { type: 'user', text: selectedLabels }]);

    setInApplicationFlow(true);
    setSimpleFormValues({ firstName: '', lastName: '', email: '', phone: '' });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: language === 'es'
          ? 'Por favor complete su informacion de contacto y nos pondremos en contacto con usted muy pronto.'
          : 'Please fill in your contact information and we will be in touch very soon.'
      }]);
      playMessageSound();
      dispatch({ type: 'TRANSITION_STATE', state: 'collectingCore' });
    }, 800);
  };

  const handleSimpleFormSubmit = async () => {
    const { firstName, lastName, email, phone } = simpleFormValues;
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      toast({ title: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", `${firstName.trim()} ${lastName.trim()}`);
      formData.append("emailAddress", email.trim());
      formData.append("phoneNumber", phone.trim());
      formData.append("policyType", convState.policyTypes.join(', '));

      await apiRequest('POST', '/api/contact', formData);

      dispatch({ type: 'TRANSITION_STATE', state: 'submitted' });
      addBotMessage(t.chatbot.submittedMsg);
      toast({ title: t.chatbot.submitApplication, description: t.chatbot.submittedMsg });

      localStorage.removeItem('policyConversation');
      setTimeout(() => {
        setInApplicationFlow(false);
        dispatch({ type: 'RESET_CONVERSATION' });
        setSimpleFormValues({ firstName: '', lastName: '', email: '', phone: '' });
        setShowPolicySelection(true);
      }, 3000);
    } catch {
      toast({ title: "Submission Failed", description: "Please try again or contact us directly.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
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
        const isSelected = convState.policyTypes.includes(detectedPolicy);
        if (!isSelected) {
          dispatch({ type: 'SET_POLICY_TYPES', policyTypes: [...convState.policyTypes, detectedPolicy] });
        }
      }
      return;
    }

    if (convState.state === 'conversational') {
      const affirmative = ['yes', 'yeah', 'sure', 'ok', 'okay', 'apply', 'start', 'begin', 'let\'s do it', 'go ahead'];
      const isAffirmative = affirmative.some(word => userMessage.toLowerCase().includes(word));

      if (isAffirmative && convState.policyTypes.length > 0) {
        handleStartApplication();
        return;
      }
    }

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: t.chatbot.fallbackMsg,
        link: "/#connect"
      }]);
      playMessageSound();
    }, 800);
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
  const progressPercent = (() => {
    if (!convState.policyType) return 0;
    const totalGroups = getTotalGroupCount();
    if (totalGroups === 0) return 50;
    const completedGroups = getCompletedGroupCount();
    return Math.round(50 + (completedGroups / totalGroups) * 50);
  })();

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[65]"
            data-testid="chatbot-widget"
          >
          {!isExpanded ? (
            <motion.div layout transition={{ type: "spring", stiffness: 400, damping: 35 }} className="flex items-center gap-2">
              {/* Liz avatar — leftmost */}
              <div className="relative shrink-0">
                {/* Welcome bubble — flips side depending on whether social icons are open */}
                <AnimatePresence>
                  {showWelcomeBubble && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 4 }}
                      className={`absolute whitespace-nowrap z-20 ${socialOpen ? 'left-2' : 'right-2'}`}
                      style={{ bottom: 'calc(100% + 10px)' }}
                    >
                      <div
                        className="rounded-2xl p-[2px] shadow-xl"
                        style={{
                          background: 'conic-gradient(from var(--border-angle), #38bdf8, #2563eb, #818cf8, #a78bfa, #38bdf8)',
                          animation: 'border-rotate-slow 4s linear infinite',
                        }}
                      >
                        <div className="bg-white dark:bg-slate-800 rounded-[14px] px-5 py-3 min-h-[46px] flex items-center">
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {typedBubble}
                          </div>
                        </div>
                      </div>
                      {/* caret aligns with Liz: left when open (bubble extends right), right when closed */}
                      <span className={`absolute top-full border-[6px] border-transparent border-t-blue-400 ${socialOpen ? 'left-6' : 'right-6'}`} />
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
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "center 32%" }}
                    />
                  </div>
                  {hasNotification && !showWelcomeBubble && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      1
                    </span>
                  )}
                </button>
              </div>

              {/* Three colored dots — right of Liz, light frosted glass */}
              <motion.button
                onClick={() => setSocialOpen((p) => !p)}
                aria-label="Toggle social links"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.90 }}
                className="relative flex flex-col items-center justify-center gap-[4px] w-6 h-[44px] rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-md shrink-0"
              >
                {socialOpen ? (
                  <X className="w-3 h-3 text-white drop-shadow-sm" />
                ) : (
                  <>
                    <FaLinkedin style={{ width: 11, height: 11, color: "#0A66C2", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.25))" }} />
                    <FaInstagram style={{ width: 11, height: 11, color: "#E1306C", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.25))" }} />
                    <FaFacebook  style={{ width: 11, height: 11, color: "#1877F2", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.25))" }} />
                  </>
                )}
              </motion.button>

              {/* Icons — no AnimatePresence so layout collapse is instant on close */}
              {socialOpen && (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.75 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.14, ease: "easeOut" }}
                >
                  <a
                    href="https://www.linkedin.com/company/insure-itgroupcorp./posts/?feedView=all"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="LinkedIn" data-testid="chatbot-social-linkedin"
                    className="group w-14 h-14 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-md border-2 border-white/70 shadow-2xl hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-800 active:scale-90 shrink-0"
                  >
                    <FaLinkedin className="w-7 h-7 text-blue-700 group-hover:text-white transition-colors duration-300" />
                  </a>
                  <a
                    href="https://www.instagram.com/insureitgroup/"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="Instagram" data-testid="chatbot-social-instagram"
                    className="group w-14 h-14 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-md border-2 border-white/70 shadow-2xl hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 active:scale-90 shrink-0"
                  >
                    <FaInstagram className="w-7 h-7 text-pink-600 group-hover:text-white transition-colors duration-300" />
                  </a>
                  <a
                    href="https://www.facebook.com/insureitgroup"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="Facebook" data-testid="chatbot-social-facebook"
                    className="group w-14 h-14 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-md border-2 border-white/70 shadow-2xl hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-700 active:scale-90 shrink-0"
                  >
                    <FaFacebook className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </a>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="animated-border-panel rounded-3xl shadow-2xl w-[calc(100vw-2rem)] sm:w-[350px] md:w-[420px] h-[70dvh] sm:h-[600px]"
              data-testid="chatbot-expanded"
            >
              <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-[22px] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 sm:p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={LIZ_AVATAR}
                        alt="Liz - Insurance Assistant"
                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        style={{ objectPosition: "center 32%" }}
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
                  {convState.policyTypes.length > 0 && convState.state !== 'submitted' && convState.state !== 'idle' && (
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
                        className={`max-w-[80%] p-3 rounded-2xl ${msg.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 shadow-md'
                          }`}
                      >
                        <p className="text-sm">{renderMessageText(msg.text)}</p>
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

                  {/* Insurance Type Multi-Select */}
                  {showPolicySelection && convState.state === 'idle' && !isTyping && (
                    <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl shadow-md">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-3 leading-snug">{t.chatbot.selectType}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {INSURANCE_TYPES.map((insuranceType, idx) => {
                          const selected = (convState.policyTypes ?? []).includes(insuranceType.type);
                          return (
                            <motion.button
                              key={insuranceType.type}
                              onClick={() => handlePolicyTypeSelection(insuranceType)}
                              className={`relative p-3 rounded-xl transition-all font-semibold text-sm border-2 text-left ${
                                selected
                                  ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                                  : 'bg-gray-50 dark:bg-slate-600 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-slate-500 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-slate-500'
                              }`}
                              whileTap={{ scale: 0.95 }}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.06 }}
                              data-testid={`select-${insuranceType.type}-insurance`}
                            >
                              {selected && (
                                <CheckCircle2 className="w-3.5 h-3.5 absolute top-2 right-2 opacity-90" />
                              )}
                              <span className="block leading-tight pr-4">{insuranceType.label}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                      <AnimatePresence>
                        {(convState.policyTypes ?? []).length > 0 && (
                          <motion.button
                            key="continue-btn"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            onClick={handleStartApplication}
                            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2.5 rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                          >
                            {t.chatbot.continueBtn}
                            <span className="bg-white/20 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                              {(convState.policyTypes ?? []).length}
                            </span>
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-start gap-2">
                      <img
                        src={LIZ_AVATAR}
                        alt="Liz typing"
                        className="w-8 h-8 rounded-full object-cover"
                        style={{ objectPosition: "center 32%" }}
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

                  {/* Simple Contact Form */}
                  {convState.state === 'collectingCore' && !isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-slate-700 p-4 rounded-lg shadow-md space-y-3"
                      data-testid="simple-contact-form"
                    >
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400 border-b border-blue-100 dark:border-slate-600 pb-2">
                        {language === 'es' ? 'Su Informacion' : 'Your Information'}
                      </p>

                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder={language === 'es' ? 'Nombre' : 'First name'}
                          value={simpleFormValues.firstName}
                          onChange={(e) => setSimpleFormValues(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full p-2 text-sm border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                          data-testid="simple-first-name"
                        />
                        <input
                          type="text"
                          placeholder={language === 'es' ? 'Apellido' : 'Last name'}
                          value={simpleFormValues.lastName}
                          onChange={(e) => setSimpleFormValues(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full p-2 text-sm border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                          data-testid="simple-last-name"
                        />
                        <input
                          type="email"
                          placeholder="email@example.com"
                          value={simpleFormValues.email}
                          onChange={(e) => setSimpleFormValues(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full p-2 text-sm border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                          data-testid="simple-email"
                        />
                        <input
                          type="tel"
                          placeholder="305-555-1234"
                          value={simpleFormValues.phone}
                          onChange={(e) => setSimpleFormValues(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full p-2 text-sm border dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                          data-testid="simple-phone"
                        />
                      </div>

                      <button
                        onClick={handleSimpleFormSubmit}
                        disabled={isSubmitting}
                        className="animated-border-btn w-full text-white p-2.5 rounded-lg font-semibold disabled:bg-gray-400 overflow-hidden relative group transition-all duration-300 hover:scale-[1.02]"
                        data-testid="simple-submit-button"
                      >
                        <span className="relative z-10">{isSubmitting ? t.chatbot.submitting : t.chatbot.submitApplication}</span>
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
                      </button>
                    </motion.div>
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
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    data-testid="chatbot-send-button"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
