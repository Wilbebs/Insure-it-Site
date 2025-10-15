import { useState, useEffect } from "react";
import { MessageCircle, X, ChevronDown, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  type: 'bot' | 'user';
  text: string;
}

const PRESET_QA = [
  {
    question: "What types of insurance do you offer?",
    answer: "We offer Auto, Home, Life, Health, and Commercial insurance. Each policy is tailored to meet your specific needs and budget."
  },
  {
    question: "How can I get a quote?",
    answer: "You can get a free quote by clicking the 'GET PROTECTED NOW' button on our homepage or filling out the contact form. One of our agents will reach out within 24 hours."
  },
  {
    question: "What areas do you serve?",
    answer: "We proudly serve the entire state of Florida, from Miami to Jacksonville, Tampa to Orlando, and everywhere in between!"
  },
  {
    question: "How long have you been in business?",
    answer: "We're a family-owned business with 14 years of experience protecting Florida families and businesses since 2011."
  },
  {
    question: "Do you offer 24/7 support?",
    answer: "Yes! We provide 24/7 support to ensure you're covered whenever you need us most."
  }
];

export default function ChatBot() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: 'Hi! I\'m here to help. Choose a question below or type your own:' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [showQuestions, setShowQuestions] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !isVisible) {
        setIsVisible(true);
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
      { type: 'user', text: qa.question },
      { type: 'bot', text: qa.answer }
    ]);
    setShowQuestions(false);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInputValue("");

    // Simple matching for preset questions
    const matchedQA = PRESET_QA.find(qa => 
      qa.question.toLowerCase().includes(userMessage.toLowerCase()) ||
      userMessage.toLowerCase().includes(qa.question.toLowerCase().split(' ').slice(0, 3).join(' ').toLowerCase())
    );

    setTimeout(() => {
      if (matchedQA) {
        setMessages(prev => [...prev, { type: 'bot', text: matchedQA.answer }]);
      } else {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: "Thanks for your question! For personalized assistance, please contact us at (555) 123-4567 or fill out our contact form." 
        }]);
      }
    }, 500);
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
              className="relative bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
              data-testid="chatbot-minimized-button"
            >
              <MessageCircle className="w-7 h-7" />
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
                  <MessageCircle className="w-6 h-6" />
                  <div>
                    <h3 className="font-bold">Insure-it Assistant</h3>
                    <p className="text-xs opacity-90">We're here to help!</p>
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
                    </div>
                  </div>
                ))}

                {/* Preset Questions */}
                {showQuestions && (
                  <div className="space-y-2 pt-2">
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
