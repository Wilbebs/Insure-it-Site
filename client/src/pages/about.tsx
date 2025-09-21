import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Shield, Users, Award, Clock } from "lucide-react";

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

          <div className="insurance-card p-6 sm:p-8 rounded-2xl text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 gradient-text">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Integrity</h3>
                <p className="text-muted-foreground">We conduct business with the highest ethical standards and transparency.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Excellence</h3>
                <p className="text-muted-foreground">We strive for excellence in every interaction and service we provide.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Innovation</h3>
                <p className="text-muted-foreground">We embrace technology and innovation to better serve our clients.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
