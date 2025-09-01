import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, Download, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useClearanceData } from "@/hooks/useClearanceData";

const StudentDashboard = () => {
  const { studentProfile, signOut, loading, userType } = useAuth();
  const { clearanceData, loading: clearanceLoading, generateClearanceCertificate } = useClearanceData();
  const navigate = useNavigate();

  // Redirect if not authenticated as student
  useEffect(() => {
    if (!loading && (!studentProfile || userType !== 'student')) {
      navigate('/');
    }
  }, [studentProfile, userType, loading, navigate]);

  if (loading || clearanceLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!studentProfile) {
    return null;
  }

  const clearedCount = clearanceData.filter(item => item.status === "cleared").length;
  const totalCount = clearanceData.length;
  const progressPercentage = totalCount > 0 ? (clearedCount / totalCount) * 100 : 0;
  const isFullyCleared = clearedCount === totalCount && totalCount > 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "cleared":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "blocked":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "pending":
      default:
        return <Clock className="w-5 h-5 text-warning" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "cleared":
        return <Badge variant="default">Cleared</Badge>;
      case "blocked":
        return <Badge variant="destructive">Blocked</Badge>;
      case "pending":
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const handleDownloadCertificate = async () => {
    if (isFullyCleared) {
      await generateClearanceCertificate(studentProfile.id);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-foreground/10 p-3 rounded-full">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">{studentProfile.full_name}</h1>
              <p className="text-primary-foreground/80">ID: {studentProfile.student_id}</p>
              <p className="text-primary-foreground/80">{studentProfile.department} Department</p>
              <p className="text-primary-foreground/80">{studentProfile.email}</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleLogout}
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
              <Button
                onClick={handleDownloadCertificate}
                className="w-full"
                disabled={!isFullyCleared}
              >
                <Download className="w-4 h-4 mr-2" />
                {isFullyCleared ? 'Download Certificate' : 'Complete All Clearances First'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Department Status Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clearanceData.map((item, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <CardTitle className="text-lg">{item.department}</CardTitle>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
              </CardHeader>
              <CardContent>
                {item.notes && (
                  <div className="mb-3 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Notes:</p>
                    <p className="text-sm text-muted-foreground">{item.notes}</p>
                  </div>
                )}
                {item.status === "cleared" && item.cleared_at && (
                  <p className="text-sm text-muted-foreground">
                    Cleared on: {new Date(item.cleared_at).toLocaleDateString()}
                  </p>
                )}
                {item.cleared_by && (
                  <p className="text-sm text-muted-foreground">
                    Cleared by: {item.cleared_by}
                  </p>
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
              {clearanceData.filter(d => d.status === "blocked").length > 0 && (
                <p className="text-destructive font-medium">
                  • You have blocked clearances that need to be resolved manually with the respective departments.
                </p>
              )}
              {clearanceData.filter(d => d.status === "pending").length > 0 && (
                <p className="text-warning font-medium">
                  • Some departments are still processing your clearance. Please wait for updates.
                </p>
              )}
              {isFullyCleared && (
                <p className="text-success font-medium">
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