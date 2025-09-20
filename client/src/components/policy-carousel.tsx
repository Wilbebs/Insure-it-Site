import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Car, House, Heart, UserCheck, Building, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

const policyTypes = [
  {
    icon: Car,
    title: "Auto Insurance",
    subtitle: "Comprehensive Vehicle Protection",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: House,
    title: "Home Insurance",
    subtitle: "Protect Your Most Valuable Asset",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Heart,
    title: "Life Insurance",
    subtitle: "Secure Your Family's Future",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "from-red-500 to-red-600"
  },
  {
    icon: UserCheck,
    title: "Health Insurance",
    subtitle: "Quality Healthcare Coverage",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Building,
    title: "Commercial Insurance",
    subtitle: "Business Protection Solutions",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
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
      }, 7000); // 7 seconds per slide

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
                  initial={false}
                  animate={{ 
                    opacity: isCenter ? 1 : 0.8,
                    scale: isCenter ? 1 : 0.9,
                    zIndex: isCenter ? 10 : 1
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  onClick={() => handleCardClick(policy.title)}
                  className={`relative w-80 h-64 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 ${
                    isCenter ? 'shadow-2xl' : 'shadow-lg'
                  }`}
                  data-testid={`policy-card-${policy.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {/* Background Image */}
                  <img 
                    src={policy.image} 
                    alt={policy.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300"></div>
                  
                  {/* Title Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                    <div className="transform group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-16 h-16 text-white mx-auto mb-4 drop-shadow-lg" />
                      <h3 className="text-3xl font-bold text-white drop-shadow-lg mb-2">{policy.title}</h3>
                      <p className="text-lg text-white/90 drop-shadow-lg font-medium">{policy.subtitle}</p>
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
          <div className="flex justify-center mt-8 mb-4 gap-3">
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