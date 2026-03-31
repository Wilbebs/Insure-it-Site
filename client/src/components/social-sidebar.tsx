import { useState } from "react";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SOCIALS = [
  {
    href: "https://www.linkedin.com/company/insure-itgroupcorp./posts/?feedView=all",
    Icon: FaLinkedin,
    color: "text-blue-700",
    label: "LinkedIn",
    testId: "sidebar-linkedin",
  },
  {
    href: "https://www.instagram.com/insureitgroup/",
    Icon: FaInstagram,
    color: "text-pink-600",
    label: "Instagram",
    testId: "sidebar-instagram",
  },
  {
    href: "https://www.facebook.com/insureitgroup",
    Icon: FaFacebook,
    color: "text-blue-600",
    label: "Facebook",
    testId: "sidebar-facebook",
  },
];

export default function SocialSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 lg:hidden">
      <motion.div
        layout
        onClick={() => setOpen((p) => !p)}
        animate={open ? { borderRadius: "999px" } : { borderRadius: "999px" }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="flex items-center backdrop-blur-md bg-white/30 border border-white/55 shadow-lg cursor-pointer overflow-hidden"
        style={{ borderRadius: "999px" }}
      >
        {/* Collapsed circle — always visible as the leading element */}
        <motion.div
          layout
          className="w-9 h-9 flex items-center justify-center shrink-0"
        >
          <Share2 className="w-4 h-4 text-slate-600" />
        </motion.div>

        {/* Expanded icons */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="icons"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="flex items-center gap-2 pr-3 overflow-hidden"
            >
              {SOCIALS.map(({ href, Icon, color, label, testId }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  data-testid={testId}
                  onClick={(e) => e.stopPropagation()}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white/70 border border-white/80 shadow-sm active:scale-90 transition-transform shrink-0"
                >
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
