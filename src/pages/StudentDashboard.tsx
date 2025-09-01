import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle, Download, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Department {
  id: string;
  name: string;
  description: string;
  status: "cleared" | "pending" | "outstanding";
  lastUpdated?: string;
  remarks?: string;
}

const StudentDashboard = () => {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "library",
      name: "Library",
      description: "Book returns and library fines",
      status: "cleared",
      lastUpdated: "2024-01-15",
    },
    {
      id: "computer-science",
      name: "Computer Science Department",
      description: "Academic records and equipment returns",
      status: "pending",
      lastUpdated: "2024-01-10",
      remarks: "Pending lab equipment return verification",
    },
    {
      id: "ssfc",
      name: "SS&FC",
      description: "Student services and facilities",
      status: "cleared",
      lastUpdated: "2024-01-12",
    },
    {
      id: "mess",
      name: "Mess",
      description: "Dining hall and meal plan clearance",
      status: "outstanding",
      lastUpdated: "2024-01-08",
      remarks: "Outstanding meal plan balance of K150",
    },
    {
      id: "av-unit",
      name: "AV Unit",
      description: "Audio-visual equipment returns",
      status: "cleared",
      lastUpdated: "2024-01-14",
    },
    {
      id: "bookshop",
      name: "Bookshop",
      description: "Book purchases and returns",
      status: "cleared",
      lastUpdated: "2024-01-13",
    },
    {
      id: "accounts",
      name: "Accounts Office",
      description: "Financial clearance and final approval",
      status: "pending",
      lastUpdated: "2024-01-09",
      remarks: "Waiting for all department clearances",
    },
  ]);

  const { toast } = useToast();

  const clearedCount = departments.filter(dept => dept.status === "cleared").length;
  const totalCount = departments.length;
  const progressPercentage = (clearedCount / totalCount) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "cleared":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "outstanding":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "cleared":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Cleared</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "outstanding":
        return <Badge variant="destructive">Outstanding</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleDownloadClearance = () => {
    if (progressPercentage === 100) {
      toast({
        title: "Downloading clearance certificate",
        description: "Your clearance certificate is being generated...",
      });
      // TODO: Implement PDF generation
    } else {
      toast({
        title: "Clearance incomplete",
        description: "You must clear all departments before downloading your certificate.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Student Clearance Dashboard</h1>
            <p className="text-primary-foreground/80">Welcome back, Student ID: 12345678</p>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleLogout}
            className="text-primary bg-primary-foreground hover:bg-primary-foreground/90"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Clearance Progress</span>
              <span className="text-2xl font-bold">{clearedCount}/{totalCount}</span>
            </CardTitle>
            <CardDescription>
              Track your clearance status across all university departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progressPercentage} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{clearedCount} departments cleared</span>
                <span>{progressPercentage.toFixed(0)}% complete</span>
              </div>
              {progressPercentage === 100 && (
                <Button 
                  onClick={handleDownloadClearance} 
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Final Clearance Certificate
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Department Status Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <Card key={department.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(department.status)}
                    <CardTitle className="text-lg">{department.name}</CardTitle>
                  </div>
                  {getStatusBadge(department.status)}
                </div>
                <CardDescription className="text-sm">
                  {department.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {department.remarks && (
                  <div className="mb-3 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Remarks:</p>
                    <p className="text-sm text-muted-foreground">{department.remarks}</p>
                  </div>
                )}
                {department.lastUpdated && (
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(department.lastUpdated).toLocaleDateString()}
                  </p>
                )}
                {department.status === "outstanding" && (
                  <div className="mt-3">
                    <Button variant="outline" size="sm" className="w-full">
                      Contact Department
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {departments.filter(d => d.status === "outstanding").length > 0 && (
                <p className="text-red-600 font-medium">
                  • You have outstanding issues that need to be resolved manually with the respective departments.
                </p>
              )}
              {departments.filter(d => d.status === "pending").length > 0 && (
                <p className="text-yellow-600 font-medium">
                  • Some departments are still processing your clearance. Please wait for updates.
                </p>
              )}
              {progressPercentage === 100 && (
                <p className="text-green-600 font-medium">
                  • Congratulations! All departments have cleared you. You can now download your final clearance certificate.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;