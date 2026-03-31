import { useState } from "react";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";

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
  const [pressed, setPressed] = useState(false);

  return (
    <div
      className="fixed right-0 bottom-4 sm:bottom-6 z-50 lg:hidden"
      style={{ marginBottom: "72px" }}
    >
      <motion.div
        animate={pressed ? { scale: 1.18 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onTapStart={() => setPressed(true)}
        onTap={() => setPressed(false)}
        onTapCancel={() => setPressed(false)}
        className="flex flex-col items-center gap-1.5 py-2 pl-2 pr-[5px] rounded-l-xl backdrop-blur-md bg-white/25 border border-r-0 border-white/50 shadow-md cursor-pointer"
        aria-label="Social media links"
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
            className="w-6 h-6 flex items-center justify-center rounded-full bg-white/70 border border-white/80 shadow-sm active:scale-90 transition-transform"
          >
            <Icon className={`w-3 h-3 ${color}`} />
          </a>
        ))}
      </motion.div>
    </div>
  );
}
