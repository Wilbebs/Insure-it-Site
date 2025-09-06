import { motion } from "framer-motion";
import { LucideIcon, Check } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface InsuranceSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  reversed: boolean;
  index: number;
}

export default function InsuranceSection({
  icon: Icon,
  title,
  description,
  features,
  image,
  imageAlt,
  reversed,
  index
}: InsuranceSectionProps) {
  const { ref, isVisible } = useScrollAnimation();
  
  const bgClass = index % 2 === 1 ? "bg-gradient-to-r from-blue-50 to-indigo-50" : "";

  return (
    <section className={`py-20 ${bgClass}`} ref={ref} data-testid={`insurance-section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className={`grid md:grid-cols-2 gap-12 items-center mb-32 ${reversed ? 'md:space-x-reverse' : ''}`}
        >
          <div className={reversed ? "order-1 md:order-2" : "order-2 md:order-1"}>
            <img 
              src={image} 
              alt={imageAlt} 
              className="rounded-2xl shadow-2xl hover-lift w-full h-[400px] object-cover"
              data-testid={`img-${title.toLowerCase().replace(/\s+/g, '-')}`}
            />
          </div>
          <div className={reversed ? "order-2 md:order-1" : "order-1 md:order-2"}>
            <div className="insurance-card p-8 rounded-2xl">
              <div className="flex items-center gap-4 mb-6">
                <Icon className="text-5xl text-primary" data-testid={`icon-${title.toLowerCase().replace(/\s+/g, '-')}`} />
                <h2 className="text-4xl font-bold gradient-text" data-testid={`title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {title}
                </h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed" data-testid={`description-${title.toLowerCase().replace(/\s+/g, '-')}`}>
                {description}
              </p>
              <ul className="space-y-3 text-foreground">
                {features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center" data-testid={`feature-${title.toLowerCase().replace(/\s+/g, '-')}-${featureIndex}`}>
                    <Check className="text-primary mr-3 w-5 h-5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
