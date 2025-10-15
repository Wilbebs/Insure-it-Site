import { useState, useEffect } from "react";
import { MessageCircle, X, ChevronDown, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

interface Message {
  type: 'bot' | 'user';
  text: string;
  link?: string;
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
    question: "What areas do you serve in Florida?",
    answer: "We proudly serve the entire state of Florida! From Miami to Jacksonville, Tampa to Orlando, and everywhere in between. Learn more about us:",
    link: "/about"
  },
  {
    question: "How long have you been in business?",
    answer: "We're a proud family-owned business with 14 years of experience since 2011. Read our full story:",
    link: "/about"
  },
  {
    question: "Do you offer 24/7 support?",
    answer: "Yes! We provide 24/7 support to ensure you're covered whenever you need us most. Contact us anytime:",
    link: "/#connect"
  },
  {
    question: "What is Auto Insurance?",
    answer: "Our auto insurance protects you on the road with comprehensive coverage options. Learn more about our auto insurance:",
    link: "/auto-insurance"
  },
  {
    question: "What is Home Insurance?",
    answer: "We protect your home and belongings with customized coverage. Discover our home insurance options:",
    link: "/home-insurance"
  },
  {
    question: "What is Life Insurance?",
    answer: "Our life insurance provides financial security for your loved ones. Explore life insurance coverage:",
    link: "/life-insurance"
  },
  {
    question: "Do you offer Health Insurance?",
    answer: "Yes! We offer comprehensive health insurance plans for individuals and families. View health insurance options:",
    link: "/health-insurance"
  },
  {
    question: "What is Commercial Insurance?",
    answer: "We protect businesses with tailored commercial insurance solutions. Learn about business coverage:",
    link: "/commercial-insurance"
  },
  {
    question: "Who is your team?",
    answer: "Meet our dedicated team of insurance professionals who are here to help you. See our team:",
    link: "/about#team"
  },
  {
    question: "How do I file a claim?",
    answer: "Our claims process is simple and fast. Contact us immediately and we'll guide you through every step:",
    link: "/#connect"
  }
];

export default function ChatBot() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: 'Hi! I\'m Liz, your insurance assistant. How can I help you today? Choose a question below or type your own:' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [showQuestions, setShowQuestions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [, setLocation] = useLocation();

  // Simple notification sound using Web Audio API
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

  // Message received sound
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

  const handleQuestionClick = (qa: typeof PRESET_QA[0]) => {
    setMessages(prev => [
      ...prev,
      { type: 'user', text: qa.question }
    ]);
    setShowQuestions(false);
    
    // Show typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { type: 'bot', text: qa.answer, link: qa.link }
      ]);
      playMessageSound();
    }, 2000);
  };

  const handleLinkClick = (link: string) => {
    if (link.startsWith('/#')) {
      // Navigate to home page and scroll to section
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
      // Navigate to page
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

    // Simple matching for preset questions
    const matchedQA = PRESET_QA.find(qa => {
      const questionWords = qa.question.toLowerCase().split(' ');
      const userWords = userMessage.toLowerCase().split(' ');
      return questionWords.some(word => userWords.includes(word)) || 
             userWords.some(word => questionWords.includes(word));
    });

    // Show typing indicator
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
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

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
              className="bg-white rounded-2xl shadow-2xl w-[350px] sm:w-[400px] overflow-hidden"
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
              <div className="h-[400px] overflow-y-auto p-4 space-y-3 bg-gray-50">
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

                {/* Preset Questions */}
                {showQuestions && !isTyping && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs text-gray-500 font-semibold">Quick Questions:</p>
                    {PRESET_QA.slice(0, 6).map((qa, idx) => (
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
              </div>

              {/* Input */}
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
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
