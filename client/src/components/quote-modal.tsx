import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Chatbot from "./chatbot";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-5xl w-full h-[90vh] max-h-[800px] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glass morphism container with rounded shape */}
              <div className="relative w-full h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 z-10 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 rounded-full p-3 transition-all hover:scale-110 shadow-lg"
                  data-testid="modal-close"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>

                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 px-10 py-8 rounded-t-[3rem]">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-4xl font-bold text-white text-center"
                  >
                    Get Your Free Quote
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/90 text-center mt-2 text-lg"
                  >
                    Chat with Liz, our AI assistant, to get started
                  </motion.p>
                </div>

                {/* Chatbot Integration - Full height chat interface */}
                <div className="h-[calc(100%-140px)] p-6 overflow-auto">
                  <div className="flex flex-col h-full">
                    {/* Placeholder for chatbot - will be enhanced */}
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                      <p className="text-center max-w-md">
                        Chat interface will open here. Click the Liz chatbot button at the bottom right to start your free quote!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
