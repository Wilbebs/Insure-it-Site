import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Car, Shield, Clock, Users, Phone, Check } from "lucide-react";

export default function AutoInsurance() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center mb-4 sm:mb-6 relative h-24">
              {/* Brick wall */}
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="brick-wall animate-impact-line" style={{ marginLeft: '85px' }}></div>
              </div>
              
              {/* Crash particles */}
              <div className="absolute inset-0 flex justify-center items-center" style={{ marginLeft: '75px' }}>
                <div className="crash-particle crash-particle-1"></div>
                <div className="crash-particle crash-particle-2"></div>
                <div className="crash-particle crash-particle-3"></div>
                <div className="crash-particle crash-particle-4"></div>
                <div className="crash-particle crash-particle-5"></div>
                <div className="crash-particle crash-particle-6"></div>
              </div>
              
              <Car className="w-16 h-16 sm:w-20 sm:h-20 text-primary animate-car-crash relative z-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 gradient-text leading-tight">
              Auto Insurance
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              Comprehensive vehicle protection with competitive rates and exceptional service. 
              Drive with confidence knowing you're covered on every journey.
            </p>
          </div>
        </div>
      </section>

      {/* Coverage Types */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-16 gradient-text">Coverage Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="insurance-card p-6 sm:p-8 rounded-2xl hover-lift">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">Liability Coverage</h3>
              <p className="text-muted-foreground mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Bodily Injury Protection</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Property Damage Coverage</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Legal Defense Costs</li>
              </ul>
            </div>

            <div className="insurance-card p-6 sm:p-8 rounded-2xl hover-lift">
              <Car className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">Collision Coverage</h3>
              <p className="text-muted-foreground mb-4">
                Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Accident Damage Repair</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Deductible Options</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Rental Car Coverage</li>
              </ul>
            </div>

            <div className="insurance-card p-6 sm:p-8 rounded-2xl hover-lift">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">Comprehensive Coverage</h3>
              <p className="text-muted-foreground mb-4">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Theft Protection</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Weather Damage</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Vandalism Coverage</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Benefits */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 gradient-text">Why Choose Our Auto Insurance?</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Clock className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">24/7 Claims Support</h3>
                    <p className="text-muted-foreground">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Roadside Assistance</h3>
                    <p className="text-muted-foreground">
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                      nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Multi-Policy Discounts</h3>
                    <p className="text-muted-foreground">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse 
                      cillum dolore eu fugiat nulla pariatur.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="/api/images/auto-consultation" 
                alt="Auto insurance consultation" 
                className="rounded-2xl shadow-2xl hover-lift"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Comprehensive Auto Protection</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="insurance-card p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Understanding Your Coverage Needs</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute 
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                deserunt mollit anim id est laborum.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque 
                laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi 
                architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas 
                sit aspernatur aut odit aut fugit.
              </p>
            </div>

            <div className="insurance-card p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">State Requirements & Legal Compliance</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium 
                voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint 
                occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt 
                mollitia animi, id est laborum et dolorum fuga.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum 
                soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat 
                facere possimus, omnis voluptas assumenda est.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}