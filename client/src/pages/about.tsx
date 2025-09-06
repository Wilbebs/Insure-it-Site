import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Shield, Users, Award, Clock } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 gradient-text leading-tight">
              About Insure-it Group
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your trusted partner in comprehensive insurance solutions. 
              We've been protecting what matters most to families and businesses for over two decades.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
                alt="Insurance professionals team meeting" 
                className="rounded-2xl shadow-2xl hover-lift"
              />
            </div>
            <div className="insurance-card p-8 rounded-2xl">
              <h2 className="text-4xl font-bold mb-6 gradient-text">Our Mission</h2>
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

          <div className="grid md:grid-cols-4 gap-8 mb-20">
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

          <div className="insurance-card p-8 rounded-2xl text-center">
            <h2 className="text-4xl font-bold mb-6 gradient-text">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
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
