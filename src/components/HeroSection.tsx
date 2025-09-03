import { GraduationCap, Shield, FileCheck, Users } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="mb-8">
          <GraduationCap className="w-16 h-16 mx-auto text-primary mb-4" />
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            University Clearance System
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Streamline your graduation clearance process at University of Technology Papua New Guinea. 
            Track your progress across all departments and download your final clearance certificate.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6">
            <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
            <p className="text-muted-foreground">
              Secure login system for both students and department officers with role-based access control.
            </p>
          </div>
          
          <div className="text-center p-6">
            <FileCheck className="w-12 h-12 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
            <p className="text-muted-foreground">
              Monitor your clearance status across all university departments in real-time.
            </p>
          </div>
          
          <div className="text-center p-6">
            <Users className="w-12 h-12 mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Department Integration</h3>
            <p className="text-muted-foreground">
              All departments connected in one system for seamless clearance processing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};