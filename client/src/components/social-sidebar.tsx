import { useState } from "react";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";

const SOCIALS = [
  {
    href: "https://www.linkedin.com/company/insure-itgroupcorp./posts/?feedView=all",
    Icon: FaLinkedin,
    color: "text-blue-700",
    bg: "bg-white",
    label: "LinkedIn",
    testId: "sidebar-linkedin",
  },
  {
    href: "https://www.instagram.com/insureitgroup/",
    Icon: FaInstagram,
    color: "text-pink-600",
    bg: "bg-white",
    label: "Instagram",
    testId: "sidebar-instagram",
  },
  {
    href: "https://www.facebook.com/insureitgroup",
    Icon: FaFacebook,
    color: "text-blue-600",
    bg: "bg-white",
    label: "Facebook",
    testId: "sidebar-facebook",
  },
];

export default function SocialSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 lg:hidden">
      <motion.button
        layout
        onClick={() => setOpen((p) => !p)}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="flex items-center backdrop-blur-md bg-white/30 border border-white/55 shadow-lg rounded-full overflow-visible"
        style={{ padding: "5px" }}
        aria-label="Social media links"
      >
        {SOCIALS.map(({ href, Icon, color, bg, label, testId }, i) => (
          <motion.a
            key={label}
            layout
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            data-testid={testId}
            onClick={(e) => e.stopPropagation()}
            animate={open ? { x: 0, marginLeft: i === 0 ? 0 : 6 } : { x: 0, marginLeft: i === 0 ? 0 : -10 }}
            transition={{ type: "spring", stiffness: 320, damping: 30, delay: open ? i * 0.04 : 0 }}
            className={`w-7 h-7 flex items-center justify-center rounded-full ${bg} border border-white/80 shadow-sm active:scale-90 transition-transform shrink-0 relative`}
            style={{ zIndex: SOCIALS.length - i }}
          >
            <Icon className={`w-3.5 h-3.5 ${color}`} />
          </motion.a>
        ))}
      </motion.button>
    </div>
  );
}
