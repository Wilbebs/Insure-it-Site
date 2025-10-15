import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const testimonials = [
  {
    name: "Maria Garcia",
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    rating: 5,
    text: "Switching to Insure-it Group was the best decision for our family. They found us better coverage at a lower price, and the personal service is unmatched. Highly recommend!",
    insurance: "Auto & Home Insurance"
  },
  {
    name: "James Thompson",
    location: "Orlando, FL",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    rating: 5,
    text: "After my accident, Insure-it Group made the claims process so easy. They handled everything and kept me informed every step of the way. True professionals who actually care.",
    insurance: "Auto Insurance"
  },
  {
    name: "Jennifer Lee",
    location: "Tampa, FL",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    rating: 5,
    text: "As a small business owner, finding the right commercial insurance was challenging until I met the team at Insure-it. They took time to understand my needs and got me excellent coverage.",
    insurance: "Commercial Insurance"
  },
  {
    name: "Robert Martinez",
    location: "Jacksonville, FL",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    rating: 5,
    text: "I've been with Insure-it Group for 8 years now. They've always been there when I needed them, and their rates are incredibly competitive. A truly family-oriented company.",
    insurance: "Life & Health Insurance"
  },
  {
    name: "Sarah Williams",
    location: "Fort Lauderdale, FL",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    rating: 5,
    text: "When Hurricane season hit, Insure-it Group was proactive in reviewing my home coverage. Their attention to detail gave me peace of mind during a stressful time. Grateful for their service!",
    insurance: "Home Insurance"
  },
  {
    name: "David Chen",
    location: "Tallahassee, FL",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    rating: 5,
    text: "The team helped me understand all my life insurance options without any pressure. They made sure I got the right policy for my family's future. Can't thank them enough!",
    insurance: "Life Insurance"
  }
];

export default function Testimonials() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50" ref={ref} data-testid="testimonials-section">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">What Our Clients Say</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Don't just take our word for it. Hear from thousands of satisfied Florida families and businesses we've protected.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="insurance-card p-6 rounded-2xl hover-lift"
              data-testid={`testimonial-${index}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-lg">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
              
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-primary font-semibold">{testimonial.insurance}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
