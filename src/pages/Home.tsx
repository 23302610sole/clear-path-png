import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Building, Users, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [studentCredentials, setStudentCredentials] = useState({ username: "", password: "" });
  const [departmentCredentials, setDepartmentCredentials] = useState({ username: "", password: "" });
  const { toast } = useToast();

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement student authentication with Supabase
    toast({
      title: "Login functionality coming soon",
      description: "Student authentication will be implemented with Supabase",
    });
  };

  const handleDepartmentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement department user authentication with Supabase
    toast({
      title: "Login functionality coming soon", 
      description: "Department user authentication will be implemented with Supabase",
    });
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
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Student Login</TabsTrigger>
                <TabsTrigger value="department">Department Login</TabsTrigger>
              </TabsList>

              <TabsContent value="student">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Portal</CardTitle>
                    <CardDescription>
                      Log in with your student credentials to check your clearance status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleStudentLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="student-username">Student ID</Label>
                        <Input
                          id="student-username"
                          placeholder="Enter your student ID"
                          value={studentCredentials.username}
                          onChange={(e) =>
                            setStudentCredentials(prev => ({ ...prev, username: e.target.value }))
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
                      <Button type="submit" className="w-full">
                        Login as Student
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="department">
                <Card>
                  <CardHeader>
                    <CardTitle>Department Portal</CardTitle>
                    <CardDescription>
                      Log in to manage student clearance records for your department
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleDepartmentLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="dept-username">Username</Label>
                        <Input
                          id="dept-username"
                          placeholder="Enter your username"
                          value={departmentCredentials.username}
                          onChange={(e) =>
                            setDepartmentCredentials(prev => ({ ...prev, username: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dept-password">Password</Label>
                        <Input
                          id="dept-password"
                          type="password"
                          placeholder="Enter your password"
                          value={departmentCredentials.password}
                          onChange={(e) =>
                            setDepartmentCredentials(prev => ({ ...prev, password: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Login as Department Officer
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;