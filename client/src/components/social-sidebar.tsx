import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";

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
  return (
    <div
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 lg:hidden"
      aria-label="Social media links"
    >
      <div className="flex flex-col items-center gap-3 py-3.5 pl-3 pr-2 rounded-l-2xl backdrop-blur-md bg-white/30 border border-r-0 border-white/60 shadow-xl">
        {SOCIALS.map(({ href, Icon, color, label, testId }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            data-testid={testId}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/60 backdrop-blur-sm border border-white/70 shadow-sm active:scale-90 transition-transform hover:bg-white/80"
          >
            <Icon className={`w-3.5 h-3.5 ${color}`} />
          </a>
        ))}
      </div>
    </div>
  );
}
