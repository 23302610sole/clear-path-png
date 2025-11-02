import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const StudentLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { signInAsStudent, userType, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && userType === 'student') {
      navigate('/student');
    }
  }, [userType, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInAsStudent(credentials.email, credentials.password);
      navigate('/student');
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <GraduationCap className="w-6 h-6 text-primary" />
              Student Portal
            </CardTitle>
            <CardDescription>
              Log in with your student email to check your clearance status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-email">Student Email</Label>
                <Input
                  id="student-email"
                  type="email"
                  placeholder="Enter your student email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials(prev => ({ ...prev, email: e.target.value }))
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
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials(prev => ({ ...prev, password: e.target.value }))
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
      </div>
    </div>
  );
};

export default StudentLogin;
