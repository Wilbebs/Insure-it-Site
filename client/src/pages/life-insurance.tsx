import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Heart, Shield, TrendingUp, Users, Clock, Check } from "lucide-react";

export default function LifeInsurance() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-red-50 to-pink-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Heart className="w-20 h-20 text-primary" />
            </div>
            <h1 className="text-6xl font-bold mb-6 gradient-text leading-tight">
              Life Insurance
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Secure your family's financial future with comprehensive life insurance coverage. 
              Peace of mind for life's most important moments.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Types */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Life Insurance Options</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="insurance-card p-8 rounded-2xl hover-lift">
              <Clock className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">Term Life Insurance</h3>
              <p className="text-muted-foreground mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Affordable Premiums</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Flexible Terms</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Renewable Options</li>
              </ul>
            </div>

            <div className="insurance-card p-8 rounded-2xl hover-lift">
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">Whole Life Insurance</h3>
              <p className="text-muted-foreground mb-4">
                Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Cash Value Growth</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Guaranteed Premiums</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Lifetime Coverage</li>
              </ul>
            </div>

            <div className="insurance-card p-8 rounded-2xl hover-lift">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-4">Universal Life Insurance</h3>
              <p className="text-muted-foreground mb-4">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Premium Flexibility</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Investment Options</li>
                <li className="flex items-center"><Check className="w-4 h-4 text-primary mr-2" />Tax Advantages</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-red-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 gradient-text">Why Life Insurance Matters</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Users className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Family Financial Security</h3>
                    <p className="text-muted-foreground">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <TrendingUp className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Estate Planning Benefits</h3>
                    <p className="text-muted-foreground">
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                      nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Tax-Free Death Benefits</h3>
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
                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
                alt="Family protection and security" 
                className="rounded-2xl shadow-2xl hover-lift"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Understanding Life Insurance</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="insurance-card p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Determining Your Coverage Needs</h3>
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
              <h3 className="text-2xl font-bold mb-4">Beneficiaries and Claims Process</h3>
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