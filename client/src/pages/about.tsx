import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Shield, Users, Award, Clock } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";

export default function About() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 gradient-text leading-tight">
              About Insure-it Group
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              Your trusted partner in comprehensive insurance solutions. 
              We've been protecting what matters most to families and businesses for over two decades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-center mb-12 sm:mb-20">
            <div>
              <img 
                src="/api/images/about-team" 
                alt="Insurance professionals team meeting" 
                className="rounded-2xl shadow-2xl hover-lift"
              />
            </div>
            <div className="insurance-card p-6 sm:p-8 rounded-2xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 gradient-text">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                At Insure-it Group, we believe that everyone deserves access to quality insurance coverage 
                that provides real protection and peace of mind. Our mission is to simplify the insurance 
                process while delivering personalized solutions that fit your unique needs and budget.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We take pride in building long-lasting relationships with our clients, providing expert 
                guidance, and being there when you need us most.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-20">
            <div className="text-center insurance-card p-6 rounded-2xl hover-lift">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 gradient-text">Trusted</h3>
              <p className="text-muted-foreground">Over 20 years of reliable service</p>
            </div>
            <div className="text-center insurance-card p-6 rounded-2xl hover-lift">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 gradient-text">Personal</h3>
              <p className="text-muted-foreground">Dedicated agents for every client</p>
            </div>
            <div className="text-center insurance-card p-6 rounded-2xl hover-lift">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 gradient-text">Award-Winning</h3>
              <p className="text-muted-foreground">Recognized for excellence</p>
            </div>
            <div className="text-center insurance-card p-6 rounded-2xl hover-lift">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 gradient-text">24/7 Support</h3>
              <p className="text-muted-foreground">Always here when you need us</p>
            </div>
          </div>

          {/* Meet the Team Section */}
          <div className="mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12 text-center gradient-text">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Team Member 1 */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift group" data-testid="team-member-sarah-johnson">
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                    alt="Sarah Johnson - CEO & Founder"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <a 
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    data-testid="linkedin-sarah-johnson"
                  >
                    <FaLinkedin className="w-16 h-16 text-white" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Sarah Johnson</h3>
                  <p className="text-primary font-medium">CEO & Founder</p>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift group" data-testid="team-member-michael-chen">
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                    alt="Michael Chen - Chief Insurance Officer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <a 
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    data-testid="linkedin-michael-chen"
                  >
                    <FaLinkedin className="w-16 h-16 text-white" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Michael Chen</h3>
                  <p className="text-primary font-medium">Chief Insurance Officer</p>
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift group" data-testid="team-member-emily-rodriguez">
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                    alt="Emily Rodriguez - Senior Claims Manager"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <a 
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    data-testid="linkedin-emily-rodriguez"
                  >
                    <FaLinkedin className="w-16 h-16 text-white" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Emily Rodriguez</h3>
                  <p className="text-primary font-medium">Senior Claims Manager</p>
                </div>
              </div>

              {/* Team Member 4 */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift group" data-testid="team-member-david-thompson">
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                    alt="David Thompson - Customer Relations Director"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <a 
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    data-testid="linkedin-david-thompson"
                  >
                    <FaLinkedin className="w-16 h-16 text-white" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">David Thompson</h3>
                  <p className="text-primary font-medium">Customer Relations Director</p>
                </div>
              </div>

              {/* Team Member 5 */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift group" data-testid="team-member-lisa-patel">
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                    alt="Lisa Patel - Head of Underwriting"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <a 
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    data-testid="linkedin-lisa-patel"
                  >
                    <FaLinkedin className="w-16 h-16 text-white" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Lisa Patel</h3>
                  <p className="text-primary font-medium">Head of Underwriting</p>
                </div>
              </div>

              {/* Team Member 6 */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift group" data-testid="team-member-james-williams">
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                    alt="James Williams - Commercial Insurance Specialist"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <a 
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    data-testid="linkedin-james-williams"
                  >
                    <FaLinkedin className="w-16 h-16 text-white" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">James Williams</h3>
                  <p className="text-primary font-medium">Commercial Insurance Specialist</p>
                </div>
              </div>

              {/* Team Member 7 */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift group" data-testid="team-member-rachel-kim">
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                    alt="Rachel Kim - Life Insurance Advisor"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <a 
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    data-testid="linkedin-rachel-kim"
                  >
                    <FaLinkedin className="w-16 h-16 text-white" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Rachel Kim</h3>
                  <p className="text-primary font-medium">Life Insurance Advisor</p>
                </div>
              </div>

              {/* Team Member 8 */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift group" data-testid="team-member-robert-anderson">
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                    alt="Robert Anderson - Auto Insurance Expert"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <a 
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    data-testid="linkedin-robert-anderson"
                  >
                    <FaLinkedin className="w-16 h-16 text-white" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Robert Anderson</h3>
                  <p className="text-primary font-medium">Auto Insurance Expert</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
