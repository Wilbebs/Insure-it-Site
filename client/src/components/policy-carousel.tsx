import { useState } from "react";
import { motion } from "framer-motion";
import { Car, House, Heart, UserCheck, Building, ArrowRight } from "lucide-react";
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

  const getRoutePath = (title: string) => {
    return `/${title.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const handleCardClick = (title: string) => {
    setLocation(getRoutePath(title));
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 via-blue-50 to-primary/10 py-8 overflow-hidden" data-testid="policy-carousel">
      <div className="container mx-auto px-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold gradient-text mb-2">Our Insurance Solutions</h2>
          <p className="text-muted-foreground">Comprehensive coverage for every need</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {policyTypes.map((policy, index) => {
            const Icon = policy.icon;
            
            return (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => handleCardClick(policy.title)}
                className="relative w-full h-48 rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                data-testid={`policy-card-${policy.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${policy.color} opacity-90`}></div>
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Main Content */}
                <div className="relative h-full p-6 text-white flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-8 h-8" />
                    <div>
                      <h3 className="text-lg font-bold">{policy.title}</h3>
                      <p className="text-xs opacity-90">{policy.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm mb-3 leading-relaxed">{policy.description}</p>
                    <div className="space-y-1">
                      {policy.features.slice(0, 2).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-xs">
                          <ArrowRight className="w-3 h-3 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Always visible call-to-action */}
                  <div className="group-hover:opacity-0 transition-opacity duration-300">
                    <p className="text-sm font-medium">Click to learn more</p>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}