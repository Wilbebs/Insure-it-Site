import { motion } from "framer-motion";
import { Car, House, Heart, UserCheck, Building, ArrowRight, Check } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useLocation } from "wouter";

const insuranceCards = [
  {
    icon: Car,
    title: "Auto Insurance",
    subtitle: "Comprehensive Vehicle Protection",
    description: "Drive with confidence knowing you're covered on every journey",
    features: [
      "Collision & Comprehensive Coverage",
      "Liability Protection",
      "Uninsured Motorist Coverage",
      "Roadside Assistance"
    ],
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "from-blue-500 to-blue-600",
    route: "/auto-insurance"
  },
  {
    icon: House,
    title: "Home Insurance",
    subtitle: "Protect Your Most Valuable Asset",
    description: "Your sanctuary deserves the best protection available",
    features: [
      "Dwelling & Structure Coverage",
      "Personal Property Protection",
      "Liability Coverage",
      "Additional Living Expenses"
    ],
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "from-green-500 to-green-600",
    route: "/home-insurance"
  },
  {
    icon: Heart,
    title: "Life Insurance",
    subtitle: "Secure Your Family's Future",
    description: "Peace of mind for life's most important moments",
    features: [
      "Term Life Insurance",
      "Whole Life Coverage",
      "Universal Life Options",
      "Flexible Premium Plans"
    ],
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "from-red-500 to-red-600",
    route: "/life-insurance"
  },
  {
    icon: UserCheck,
    title: "Health Insurance",
    subtitle: "Quality Healthcare Coverage",
    description: "Access quality medical care with trusted provider networks",
    features: [
      "Individual & Family Plans",
      "Preventive Care Coverage",
      "Prescription Drug Benefits",
      "Emergency Services"
    ],
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "from-purple-500 to-purple-600",
    route: "/health-insurance"
  },
  {
    icon: Building,
    title: "Commercial Insurance",
    subtitle: "Business Protection Solutions",
    description: "Safeguard your operations with specialized coverage",
    features: [
      "General Liability Coverage",
      "Property Insurance",
      "Workers' Compensation",
      "Business Interruption"
    ],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "from-orange-500 to-orange-600",
    route: "/commercial-insurance"
  }
];

export default function InsuranceCardsFlow() {
  const [, setLocation] = useLocation();
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative" ref={ref} data-testid="insurance-cards-flow">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Our Insurance Solutions</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive coverage tailored to protect what matters most to you and your family
          </p>
        </motion.div>

        <div className="relative">
          {/* Flowing connector path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block" style={{ zIndex: 0 }}>
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {/* Connect cards with flowing path */}
            <path
              d="M 33% 12%, L 33% 30%, Q 33% 35%, 66% 35%, L 66% 45%, Q 66% 50%, 33% 50%, L 33% 65%, Q 33% 70%, 66% 70%, L 66% 82%"
              stroke="url(#pathGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              className="animate-dash"
            />
          </svg>

          {/* Cards Grid with 2 columns alternating pattern */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative" style={{ zIndex: 1 }}>
            {insuranceCards.map((card, index) => {
              const Icon = card.icon;
              
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  onClick={() => setLocation(card.route)}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover-lift"
                  data-testid={`insurance-card-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {/* Background Image with Overlay */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={card.image} 
                      alt={card.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* Icon Badge */}
                    <div className="absolute top-6 left-6">
                      <div className={`p-4 rounded-full bg-gradient-to-r ${card.color} shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    {/* Title Overlay on Image */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-2">{card.title}</h3>
                      <p className="text-sm text-white/95 drop-shadow-lg font-medium">{card.subtitle}</p>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-6">
                    <p className="text-muted-foreground mb-5 leading-relaxed">
                      {card.description}
                    </p>
                    
                    {/* Features List */}
                    <ul className="space-y-2 mb-6">
                      {card.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm" data-testid={`feature-${card.title.toLowerCase().replace(/\s+/g, '-')}-${idx}`}>
                          <Check className="text-primary mr-2 w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Learn More Link */}
                    <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all duration-300">
                      <span>Learn More</span>
                      <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
