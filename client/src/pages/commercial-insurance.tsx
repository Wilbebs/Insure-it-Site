import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Building, Shield, Users, Briefcase, AlertTriangle, Check } from "lucide-react";

export default function CommercialInsurance() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 bg-gradient-to-br from-orange-50 to-amber-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center mb-4 sm:mb-6">
              <Building className="w-16 h-16 sm:w-20 sm:h-20 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 gradient-text leading-tight">
              Commercial Insurance
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              Comprehensive business protection solutions tailored to your industry. 
              Safeguard your operations with our specialized commercial coverage.
            </p>
          </div>
        </div>
      </section>

      {/* Coverage Types */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-16 gradient-text">Business Protection Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="insurance-card p-6 sm:p-8 rounded-2xl hover-lift">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">General Liability</h3>
              <p className="text-muted-foreground mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Third-Party Injury Claims</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Property Damage Protection</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Legal Defense Costs</li>
              </ul>
            </div>

            <div className="insurance-card p-6 sm:p-8 rounded-2xl hover-lift">
              <Building className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">Property Insurance</h3>
              <p className="text-muted-foreground mb-4">
                Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Building Coverage</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Equipment Protection</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Business Interruption</li>
              </ul>
            </div>

            <div className="insurance-card p-6 sm:p-8 rounded-2xl hover-lift">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">Workers' Compensation</h3>
              <p className="text-muted-foreground mb-4">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Employee Injury Coverage</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Disability Benefits</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Return-to-Work Programs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-orange-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 gradient-text">Industry-Specific Solutions</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Briefcase className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Professional Liability</h3>
                    <p className="text-muted-foreground">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Cyber Liability</h3>
                    <p className="text-muted-foreground">
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                      nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Directors & Officers</h3>
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
                src="/api/images/commercial-building" 
                alt="Modern commercial office building" 
                className="rounded-2xl shadow-2xl hover-lift"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Commercial Insurance Essentials</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="insurance-card p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Risk Assessment and Management</h3>
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
              <h3 className="text-2xl font-bold mb-4">Claims Process and Support</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium 
                voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint 
                occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt 
                mollitia animi, id est laborum et dolorum fuga.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum 
                soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat 
                facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}