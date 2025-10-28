import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Building, Building2, Users, FileCheck, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SchoolHighlights } from "@/components/SchoolHighlights";
import { Footer } from "@/components/Footer";

const Home = () => {
  const [studentCredentials, setStudentCredentials] = useState({ email: "", password: "" });
  const [adminCredentials, setAdminCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { signInAsStudent, signInAsAdmin, userType, loading } = useAuth();
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

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInAsStudent(studentCredentials.email, studentCredentials.password);
      navigate('/student');
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInAsAdmin(adminCredentials.email, adminCredentials.password);
      navigate('/admin');
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

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
                <Users className="w-12 h-12 text-primary mx-auto mb-2" />
                <CardTitle>Multiple Departments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Library, Academic Departments, SS&FC, Mess, AV Unit, Bookshop, 
                  and Accounts Office all integrated.
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
          <div className="max-w-md mx-auto">
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="department">Department</TabsTrigger>
                <TabsTrigger value="hall">Hall</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>

              <TabsContent value="student">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Student Portal
                    </CardTitle>
                    <CardDescription>
                      Log in with your student email to check your clearance status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleStudentLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="student-email">Student Email</Label>
                        <Input
                          id="student-email"
                          type="email"
                          placeholder="Enter your student email"
                          value={studentCredentials.email}
                          onChange={(e) =>
                            setStudentCredentials(prev => ({ ...prev, email: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="student-password">Password</Label>
                        <Input
                          id="student-password"
                          type="password"
                          placeholder="Enter your password"
                          value={studentCredentials.password}
                          onChange={(e) =>
                            setStudentCredentials(prev => ({ ...prev, password: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading || loading}>
                        {isLoading ? 'Logging in...' : 'Login as Student'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="department">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Department Portal
                    </CardTitle>
                    <CardDescription>
                      Access the department selection portal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Click below to select your department and login with your staff credentials.
                    </p>
                    <Button 
                      className="w-full" 
                      onClick={() => navigate('/department-portal')}
                      disabled={loading}
                    >
                      Go to Department Portal
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hall">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Hall of Residence
                    </CardTitle>
                    <CardDescription>
                      Access the hall residence management portal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Manage property returns and conduct room inspections for students.
                    </p>
                    <Button 
                      className="w-full" 
                      onClick={() => navigate('/hall-residence')}
                      disabled={loading}
                    >
                      Go to Hall Portal
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="admin">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Admin Portal
                    </CardTitle>
                    <CardDescription>
                      Administrative access to oversee the entire system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Admin Email</Label>
                        <Input
                          id="admin-email"
                          type="email"
                          placeholder="Enter your admin email"
                          value={adminCredentials.email}
                          onChange={(e) =>
                            setAdminCredentials(prev => ({ ...prev, email: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-password">Password</Label>
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="Enter your password"
                          value={adminCredentials.password}
                          onChange={(e) =>
                            setAdminCredentials(prev => ({ ...prev, password: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading || loading}>
                        {isLoading ? 'Logging in...' : 'Login as Admin'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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