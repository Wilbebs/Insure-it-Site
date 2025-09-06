import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Car, House, Heart, UserCheck, Building, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

const policyTypes = [
  {
    icon: Car,
    title: "Auto Insurance",
    subtitle: "Comprehensive Vehicle Protection",
    description: "Full coverage for your vehicle with competitive rates and excellent service.",
    features: ["Collision Coverage", "Liability Protection", "Roadside Assistance"],
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: House,
    title: "Home Insurance",
    subtitle: "Protect Your Most Valuable Asset",
    description: "Complete home protection including dwelling, personal property, and liability.",
    features: ["Dwelling Protection", "Personal Property", "Liability Coverage"],
    color: "from-green-500 to-green-600"
  },
  {
    icon: Heart,
    title: "Life Insurance",
    subtitle: "Secure Your Family's Future",
    description: "Flexible life insurance options to provide financial security for your loved ones.",
    features: ["Term Life", "Whole Life", "Universal Life"],
    color: "from-red-500 to-red-600"
  },
  {
    icon: UserCheck,
    title: "Health Insurance",
    subtitle: "Quality Healthcare Coverage",
    description: "Comprehensive health plans with access to top medical networks.",
    features: ["Individual Plans", "Family Coverage", "Preventive Care"],
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Building,
    title: "Commercial Insurance",
    subtitle: "Business Protection Solutions",
    description: "Tailored commercial coverage to protect your business operations.",
    features: ["General Liability", "Property Protection", "Workers' Comp"],
    color: "from-orange-500 to-orange-600"
  }
];

export default function PolicyCarousel() {
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % policyTypes.length);
      }, 5000); // 5 seconds per slide

      return () => clearInterval(timer);
    }
  }, [isPaused]);

  const getRoutePath = (title: string) => {
    return `/${title.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const handleCardClick = (title: string) => {
    setLocation(getRoutePath(title));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % policyTypes.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + policyTypes.length) % policyTypes.length);
  };

  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % policyTypes.length;
      cards.push({ ...policyTypes[index], originalIndex: index, position: i });
    }
    return cards;
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 via-blue-50 to-primary/10 py-8 overflow-hidden" data-testid="policy-carousel">
      <div className="container mx-auto px-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold gradient-text mb-2">Our Insurance Solutions</h2>
          <p className="text-muted-foreground">Comprehensive coverage for every need</p>
        </div>
        
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-primary rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            data-testid="carousel-prev"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-primary rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            data-testid="carousel-next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Container */}
          <div className="flex items-center justify-center gap-8 px-20 py-8">
            {getVisibleCards().map((policy, index) => {
              const Icon = policy.icon;
              const isCenter = policy.position === 1;
              
              return (
                <motion.div
                  key={`${policy.title}-${currentIndex}`}
                  initial={{ opacity: 0, scale: 0.8, x: 100 }}
                  animate={{ 
                    opacity: isCenter ? 1 : 0.7,
                    scale: isCenter ? 1 : 0.85,
                    x: 0,
                    zIndex: isCenter ? 10 : 1
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  onClick={() => handleCardClick(policy.title)}
                  className={`relative w-80 h-64 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 ${
                    isCenter ? 'shadow-2xl' : 'shadow-lg'
                  }`}
                  data-testid={`policy-card-${policy.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${policy.color} opacity-90`}></div>
                  <div className="absolute inset-0 bg-black/20"></div>
                  
                  {/* Main Content */}
                  <div className="relative h-full p-8 text-white flex flex-col justify-between">
                    <div className="flex items-center gap-4">
                      <Icon className="w-12 h-12" />
                      <div>
                        <h3 className="text-2xl font-bold">{policy.title}</h3>
                        <p className="text-sm opacity-90">{policy.subtitle}</p>
                      </div>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm mb-4 leading-relaxed">{policy.description}</p>
                      <div className="space-y-2">
                        {policy.features.slice(0, 3).map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm">
                            <ArrowRight className="w-4 h-4 mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Always visible call-to-action */}
                    <div className="group-hover:opacity-0 transition-opacity duration-300">
                      <p className="text-sm font-medium">Click to explore →</p>
                    </div>
                  </div>

                  {/* Center card highlight */}
                  {isCenter && (
                    <div className="absolute inset-0 ring-4 ring-white/30 rounded-2xl pointer-events-none"></div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-6 gap-3">
            {policyTypes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary scale-125 shadow-lg' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                data-testid={`carousel-indicator-${index}`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}