import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";

const SOCIALS = [
  {
    href: "https://www.linkedin.com/company/insure-itgroupcorp./posts/?feedView=all",
    Icon: FaLinkedin,
    iconClass: "text-blue-700 group-hover:text-white group-active:text-white",
    bgClass: "bg-gradient-to-br from-blue-50 to-blue-100",
    hoverClass: "group-hover:from-blue-500 group-hover:to-blue-600",
    label: "LinkedIn",
    testId: "sidebar-linkedin",
  },
  {
    href: "https://www.instagram.com/insureitgroup/",
    Icon: FaInstagram,
    iconClass: "text-pink-600 group-hover:text-white group-active:text-white",
    bgClass: "bg-gradient-to-br from-pink-50 to-purple-100",
    hoverClass: "group-hover:from-pink-500 group-hover:to-purple-600",
    label: "Instagram",
    testId: "sidebar-instagram",
  },
  {
    href: "https://www.facebook.com/insureitgroup",
    Icon: FaFacebook,
    iconClass: "text-blue-600 group-hover:text-white group-active:text-white",
    bgClass: "bg-gradient-to-br from-blue-50 to-blue-100",
    hoverClass: "group-hover:from-blue-600 group-hover:to-blue-700",
    label: "Facebook",
    testId: "sidebar-facebook",
  },
];

export default function SocialSidebar() {
  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 lg:hidden">
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-full backdrop-blur-md bg-white/30 border border-white/55 shadow-lg">
        {SOCIALS.map(({ href, Icon, iconClass, bgClass, hoverClass, label, testId }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            data-testid={testId}
            className={`group w-8 h-8 flex items-center justify-center rounded-full ${bgClass} ${hoverClass} bg-gradient-to-br border border-white/60 shadow-sm active:scale-90 transition-all duration-300`}
          >
            <Icon className={`w-3.5 h-3.5 transition-colors duration-300 ${iconClass}`} />
          </a>
        ))}
      </div>
    </div>
  );
}
