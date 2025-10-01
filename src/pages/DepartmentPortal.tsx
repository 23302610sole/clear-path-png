import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DEPARTMENTS } from "@/lib/supabase";
import { Building, ArrowLeft } from "lucide-react";

const DepartmentPortal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6 shadow-md">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-4 text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">Department Portal</h1>
          <p className="text-primary-foreground/90 mt-2">
            Select your department to access the clearance management system
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEPARTMENTS.map((dept) => (
            <Card
              key={dept.code}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/department-login/${dept.code}`)}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Building className="w-8 h-8 text-primary" />
                  <CardTitle className="text-xl">{dept.name}</CardTitle>
                </div>
                <CardDescription>Code: {dept.code}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Access {dept.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DepartmentPortal;
