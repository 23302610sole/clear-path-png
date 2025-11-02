import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Building, Building2, FileCheck, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SchoolHighlights } from "@/components/SchoolHighlights";
import { Footer } from "@/components/Footer";

const Home = () => {
  const { userType, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && userType) {
      if (userType === 'student') {
        navigate('/student');
      } else if (userType === 'department') {
        navigate('/department');
      } else if (userType === 'admin') {
        navigate('/admin');
      }
    }
  }, [userType, loading, navigate]);


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              University Clearance System
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              University of Technology Papua New Guinea
            </p>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Streamline your clearance process. Students can check their clearance status 
              across all departments, while department officers can efficiently manage and 
              update student records.
            </p>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How the Clearance Process Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Our digital clearance system makes it easy for students to track their 
              clearance status and for departments to manage the process efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="text-center">
                <GraduationCap className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>For Students</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Log in to view your clearance status across all departments and download 
                  your final clearance certificate when ready.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Building className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Department Officers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Update student clearance status, manage department records, and send 
                  reminder notifications to students.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Building className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Multiple Departments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Library, ATCDI Library, AV Unit, Bookshop, The Catering Company, 
                  and all Academic Departments integrated.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <FileCheck className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Final Clearance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Generate and download your official clearance certificate once 
                  all departments have cleared you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Access Your Portal
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Select your role to proceed to the appropriate login page
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/student-login')}>
              <CardHeader className="text-center">
                <GraduationCap className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Student Portal</CardTitle>
                <CardDescription>
                  Check your clearance status
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" disabled={loading}>
                  Student Login
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/department-portal')}>
              <CardHeader className="text-center">
                <Building className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Department Portal</CardTitle>
                <CardDescription>
                  Manage student clearances
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" disabled={loading}>
                  Department Login
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/hall-residence')}>
              <CardHeader className="text-center">
                <Building2 className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Hall of Residence</CardTitle>
                <CardDescription>
                  Manage property & inspections
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" disabled={loading}>
                  Hall Portal
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin-login')}>
              <CardHeader className="text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Admin Portal</CardTitle>
                <CardDescription>
                  System administration
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" disabled={loading}>
                  Admin Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* School Highlights Carousel */}
      <SchoolHighlights />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;