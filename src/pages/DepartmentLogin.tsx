import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { DEPARTMENTS } from "@/lib/supabase";
import { ArrowLeft, Building } from "lucide-react";

const DepartmentLogin = () => {
  const { departmentCode } = useParams<{ departmentCode: string }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signInAsDepartment, userType, loading } = useAuth();
  const navigate = useNavigate();

  const department = DEPARTMENTS.find(d => d.code === departmentCode);

  useEffect(() => {
    if (!loading && userType === 'department') {
      navigate('/department');
    }
  }, [userType, loading, navigate]);

  if (!department) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Department Not Found</CardTitle>
            <CardDescription>Invalid department code</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/department-portal')}>
              Back to Department Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInAsDepartment(email, password, departmentCode);
      navigate('/department');
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/department-portal')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portal
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Building className="w-8 h-8 text-primary" />
              <div>
                <CardTitle>{department.name} Login</CardTitle>
                <CardDescription>Department Code: {department.code}</CardDescription>
              </div>
            </div>
            <CardDescription className="mt-4">
              Enter your staff email and password to access the {department.name} clearance management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Staff Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your staff email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || loading}>
                {isLoading ? 'Logging in...' : `Login to ${department.name}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepartmentLogin;
