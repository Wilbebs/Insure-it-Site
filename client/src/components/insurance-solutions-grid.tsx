import { motion } from "framer-motion";
import { Car, House, Heart, UserCheck, Building, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useCarouselImages } from "@/hooks/use-carousel-images";

// Insurance solution types configuration
const insuranceSolutions = [
  {
    icon: Car,
    title: "Auto Insurance",
    subtitle: "Comprehensive Vehicle Protection",
    description: "Drive with confidence knowing you're covered on every journey",
    color: "from-blue-500 to-blue-600",
    key: "auto" as const
  },
  {
    icon: House,
    title: "Home Insurance",
    subtitle: "Protect Your Most Valuable Asset",
    description: "Your sanctuary deserves the best protection available",
    color: "from-green-500 to-green-600",
    key: "home" as const
  },
  {
    icon: Heart,
    title: "Life Insurance",
    subtitle: "Secure Your Family's Future",
    description: "Peace of mind for life's most important moments",
    color: "from-red-500 to-red-600",
    key: "life" as const
  },
  {
    icon: UserCheck,
    title: "Health Insurance",
    subtitle: "Quality Healthcare Coverage",
    description: "Access quality medical care with trusted provider networks",
    color: "from-purple-500 to-purple-600",
    key: "health" as const
  },
  {
    icon: Building,
    title: "Commercial Insurance",
    subtitle: "Business Protection Solutions",
    description: "Safeguard your operations with specialized coverage",
    color: "from-orange-500 to-orange-600",
    key: "commercial" as const
  }
];

export default function InsuranceSolutionsGrid() {
  const [, setLocation] = useLocation();
  
  // Fetch carousel images from Firebase
  const { data: carouselImages, isLoading: imagesLoading } = useCarouselImages();
  
  // Merge base solution data with Firebase images
  const solutions = insuranceSolutions.map(solution => ({
    ...solution,
    image: carouselImages?.carouselImages?.[solution.key] || `https://via.placeholder.com/600x400?text=${solution.title.replace(' ', '+')}`
  }));

  const getRoutePath = (title: string) => {
    return `/${title.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const handleCardClick = (title: string) => {
    setLocation(getRoutePath(title));
  };

  return (
    <section className="bg-gradient-to-r from-primary/10 via-blue-50 to-primary/10 py-12 sm:py-16" data-testid="insurance-solutions-grid">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-2 sm:mb-4">Our Insurance Solutions</h2>
          <p className="text-muted-foreground text-lg">Comprehensive coverage for every need</p>
        </div>
        
        {imagesLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              
              return (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => handleCardClick(solution.title)}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover-lift"
                  data-testid={`solution-card-${solution.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {/* Background Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img 
                      src={solution.image} 
                      alt={solution.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    
                    {/* Icon */}
                    <div className="absolute top-4 left-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${solution.color} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Title on Image */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white drop-shadow-lg mb-1">{solution.title}</h3>
                      <p className="text-sm text-white/90 drop-shadow-lg font-medium">{solution.subtitle}</p>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {solution.description}
                    </p>
                    
                    <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Hover effect border */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl transition-colors duration-300"></div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}