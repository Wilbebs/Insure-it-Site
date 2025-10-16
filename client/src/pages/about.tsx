import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Shield, Users, Award, Clock } from "lucide-react";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function About() {
  const [titleText, setTitleText] = useState("");
  const [lastParagraphText, setLastParagraphText] = useState("");
  const [signatureText, setSignatureText] = useState("");
  const [showCursor, setShowCursor] = useState(false);

  const fullTitle = "Our Story";
  const fullLastParagraph = "Today, 14 years later, we remain family-owned and family-focused. We've grown from that single office in Miami to serving thousands of clients statewide, but our mission has never changed: to treat every client like family and provide the kind of insurance coverage that brings true peace of mind.";
  const fullSignature = "From our family to yours—protecting Florida families, one policy at a time.";

  useEffect(() => {
    let titleIndex = 0;
    const titleInterval = setInterval(() => {
      if (titleIndex <= fullTitle.length) {
        setTitleText(fullTitle.slice(0, titleIndex));
        titleIndex++;
      } else {
        clearInterval(titleInterval);
        // Start typing the last paragraph after title is done
        let paragraphIndex = 0;
        const paragraphInterval = setInterval(() => {
          if (paragraphIndex <= fullLastParagraph.length) {
            setLastParagraphText(fullLastParagraph.slice(0, paragraphIndex));
            paragraphIndex++;
          } else {
            clearInterval(paragraphInterval);
            // Start typing the signature after paragraph is done
            let signatureIndex = 0;
            const signatureInterval = setInterval(() => {
              if (signatureIndex <= fullSignature.length) {
                setSignatureText(fullSignature.slice(0, signatureIndex));
                signatureIndex++;
              } else {
                clearInterval(signatureInterval);
                // Show blinking cursor when done
                setShowCursor(true);
              }
            }, 30);
          }
        }, 20);
      }
    }, 100);

    return () => clearInterval(titleInterval);
  }, []);

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
              A proud family-owned business serving Florida for 14 years. 
              Protecting what matters most to thousands of families and businesses across the Sunshine State.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-center mb-12 sm:mb-20">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800" 
                alt="Insure-it Group family team" 
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

          {/* Our Story Section */}
          <div className="insurance-card p-6 sm:p-10 rounded-2xl mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 gradient-text text-center min-h-[3rem]">
              {titleText}
              {titleText.length < fullTitle.length && <span className="animate-pulse">|</span>}
            </h2>
            <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Our journey began in 2011 with a simple dream and a small office in the heart of Miami. 
                What started as a family vision to help our local community find quality insurance coverage 
                has grown into something we're incredibly proud of—a trusted partner to thousands of families 
                across the entire state of Florida.
              </p>
              <p>
                We remember those early days vividly—sitting down with families at their kitchen tables, 
                listening to their concerns, understanding their needs, and working tirelessly to find them 
                the right protection. That personal touch, that genuine care for each client as if they were 
                part of our own family, became the foundation of everything we do.
              </p>
              <p>
                As word spread about our commitment to putting people first, we began expanding throughout 
                South Florida. Then came Central Florida, the Space Coast, the Panhandle, and eventually 
                every corner of the Sunshine State. From Miami to Jacksonville, Tampa to Orlando, Pensacola 
                to the Keys—we've had the honor of protecting what matters most to Florida families.
              </p>
              <p className="font-semibold text-foreground min-h-[8rem]">
                {lastParagraphText}
                {lastParagraphText.length > 0 && lastParagraphText.length < fullLastParagraph.length && <span className="animate-pulse">|</span>}
              </p>
              <p className="text-center italic text-primary pt-4">
                "{signatureText}
                {signatureText.length > 0 && signatureText.length < fullSignature.length && <span className="animate-pulse">|</span>}
                "{showCursor && <span className="typing-cursor">|</span>}
              </p>
            </div>
          </div>

          {/* Meet the Team Section */}
          <div className="mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12 text-center gradient-text">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Team Member 1 */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift" data-testid="team-member-sarah-johnson">
                <div className="aspect-square overflow-hidden relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                    alt="Sarah Johnson - CEO & Founder"
                    className="w-full h-full object-cover"
                  />
                  <a 
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 bg-white group-hover:bg-white rounded-full p-2 shadow-lg hover:!bg-primary hover:scale-110 transition-all duration-300 z-10"
                    data-testid="linkedin-sarah-johnson"
                  >
                    <FaLinkedin className="w-5 h-5 text-primary hover:text-white transition-colors duration-300" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Sarah Johnson</h3>
                  <p className="text-primary font-medium">CEO & Founder</p>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift" data-testid="team-member-michael-chen">
                <div className="aspect-square overflow-hidden relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                    alt="Michael Chen - Chief Insurance Officer"
                    className="w-full h-full object-cover"
                  />
                  <a 
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 bg-white group-hover:bg-white rounded-full p-2 shadow-lg hover:!bg-primary hover:scale-110 transition-all duration-300 z-10"
                    data-testid="linkedin-michael-chen"
                  >
                    <FaLinkedin className="w-5 h-5 text-primary hover:text-white transition-colors duration-300" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Michael Chen</h3>
                  <p className="text-primary font-medium">Chief Insurance Officer</p>
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift" data-testid="team-member-emily-rodriguez">
                <div className="aspect-square overflow-hidden relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                    alt="Emily Rodriguez - Senior Claims Manager"
                    className="w-full h-full object-cover"
                  />
                  <a 
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 bg-white group-hover:bg-white rounded-full p-2 shadow-lg hover:!bg-primary hover:scale-110 transition-all duration-300 z-10"
                    data-testid="linkedin-emily-rodriguez"
                  >
                    <FaLinkedin className="w-5 h-5 text-primary hover:text-white transition-colors duration-300" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Emily Rodriguez</h3>
                  <p className="text-primary font-medium">Senior Claims Manager</p>
                </div>
              </div>

              {/* Team Member 4 */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift" data-testid="team-member-david-thompson">
                <div className="aspect-square overflow-hidden relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                    alt="David Thompson - Customer Relations Director"
                    className="w-full h-full object-cover"
                  />
                  <a 
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 bg-white group-hover:bg-white rounded-full p-2 shadow-lg hover:!bg-primary hover:scale-110 transition-all duration-300 z-10"
                    data-testid="linkedin-david-thompson"
                  >
                    <FaLinkedin className="w-5 h-5 text-primary hover:text-white transition-colors duration-300" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">David Thompson</h3>
                  <p className="text-primary font-medium">Customer Relations Director</p>
                </div>
              </div>

              {/* Team Member 5 */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift" data-testid="team-member-lisa-patel">
                <div className="aspect-square overflow-hidden relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                    alt="Lisa Patel - Head of Underwriting"
                    className="w-full h-full object-cover"
                  />
                  <a 
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 bg-white group-hover:bg-white rounded-full p-2 shadow-lg hover:!bg-primary hover:scale-110 transition-all duration-300 z-10"
                    data-testid="linkedin-lisa-patel"
                  >
                    <FaLinkedin className="w-5 h-5 text-primary hover:text-white transition-colors duration-300" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Lisa Patel</h3>
                  <p className="text-primary font-medium">Head of Underwriting</p>
                </div>
              </div>

              {/* Team Member 6 */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift" data-testid="team-member-james-williams">
                <div className="aspect-square overflow-hidden relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                    alt="James Williams - Commercial Insurance Specialist"
                    className="w-full h-full object-cover"
                  />
                  <a 
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 bg-white group-hover:bg-white rounded-full p-2 shadow-lg hover:!bg-primary hover:scale-110 transition-all duration-300 z-10"
                    data-testid="linkedin-james-williams"
                  >
                    <FaLinkedin className="w-5 h-5 text-primary hover:text-white transition-colors duration-300" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">James Williams</h3>
                  <p className="text-primary font-medium">Commercial Insurance Specialist</p>
                </div>
              </div>

              {/* Team Member 7 */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift" data-testid="team-member-rachel-kim">
                <div className="aspect-square overflow-hidden relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                    alt="Rachel Kim - Life Insurance Advisor"
                    className="w-full h-full object-cover"
                  />
                  <a 
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 bg-white group-hover:bg-white rounded-full p-2 shadow-lg hover:!bg-primary hover:scale-110 transition-all duration-300 z-10"
                    data-testid="linkedin-rachel-kim"
                  >
                    <FaLinkedin className="w-5 h-5 text-primary hover:text-white transition-colors duration-300" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Rachel Kim</h3>
                  <p className="text-primary font-medium">Life Insurance Advisor</p>
                </div>
              </div>

              {/* Team Member 8 */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift" data-testid="team-member-robert-anderson">
                <div className="aspect-square overflow-hidden relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                    alt="Robert Anderson - Auto Insurance Expert"
                    className="w-full h-full object-cover"
                  />
                  <a 
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 bg-white group-hover:bg-white rounded-full p-2 shadow-lg hover:!bg-primary hover:scale-110 transition-all duration-300 z-10"
                    data-testid="linkedin-robert-anderson"
                  >
                    <FaLinkedin className="w-5 h-5 text-primary hover:text-white transition-colors duration-300" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Robert Anderson</h3>
                  <p className="text-primary font-medium">Auto Insurance Expert</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us Cards - Moved below team */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-20">
            <div className="text-center insurance-card p-6 rounded-2xl hover-lift">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 gradient-text">Family-Owned</h3>
              <p className="text-muted-foreground">14 years of family values & dedication</p>
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

          {/* Connect With Us Section */}
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 gradient-text">Connect With Us</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Follow us on social media for insurance tips, company updates, and Florida community news
            </p>
            <div className="flex justify-center gap-6 sm:gap-8">
              <a 
                href="https://www.linkedin.com/company/insure-itgroupcorp./posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                data-testid="social-linkedin"
              >
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl hover-lift transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-600">
                  <FaLinkedin className="w-12 h-12 sm:w-16 sm:h-16 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="mt-3 font-semibold text-muted-foreground group-hover:text-primary transition-colors">LinkedIn</p>
              </a>
              
              <a 
                href="https://www.instagram.com/insureitgroup/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                data-testid="social-instagram"
              >
                <div className="bg-gradient-to-br from-pink-50 to-purple-100 p-6 rounded-2xl hover-lift transition-all duration-300 group-hover:from-pink-500 group-hover:to-purple-600">
                  <FaInstagram className="w-12 h-12 sm:w-16 sm:h-16 text-pink-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="mt-3 font-semibold text-muted-foreground group-hover:text-pink-600 transition-colors">Instagram</p>
              </a>
              
              <a 
                href="https://www.facebook.com/insureitgroup"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                data-testid="social-facebook"
              >
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl hover-lift transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-700">
                  <FaFacebook className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="mt-3 font-semibold text-muted-foreground group-hover:text-blue-600 transition-colors">Facebook</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
