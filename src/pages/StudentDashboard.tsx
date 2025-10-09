import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Clock, Download, LogOut, Edit, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useClearanceData } from "@/hooks/useClearanceData";

const StudentDashboard = () => {
  const { studentProfile, signOut, loading, userType } = useAuth();
  const { clearanceData, loading: clearanceLoading, generateClearanceCertificate } = useClearanceData();
  const navigate = useNavigate();

  // SEO: set page title
  useEffect(() => {
    document.title = 'Student Clearance Dashboard | Clearance Progress';
  }, []);

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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Profile not found</CardTitle>
            <CardDescription>
              We couldn't load your student profile. Please try again or sign out.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/')}>Go Home</Button>
              <Button onClick={async () => { await signOut(); navigate('/'); }}>Sign out</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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

  const initials = studentProfile.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground shadow-lg">
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-sm font-medium opacity-80">Student Dashboard</h2>
            <Button 
              variant="secondary" 
              onClick={handleLogout}
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
          
          {/* Profile Card - Clickable */}
          <div 
            className="cursor-pointer"
            onClick={() => navigate('/student/profile')}
          >
            <Card className="bg-background/95 backdrop-blur hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20 border-4 border-primary/20">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">{studentProfile.full_name}</h1>
                      <p className="text-muted-foreground font-medium">ID: {studentProfile.student_id}</p>
                      <p className="text-muted-foreground">{studentProfile.department} Department</p>
                      <p className="text-sm text-muted-foreground">{studentProfile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Edit className="w-5 h-5" />
                    <span className="text-sm font-medium">Edit Profile</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Progress Overview */}
        <Card className="mb-8 shadow-lg border-2 hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="flex items-center justify-between text-2xl">
              <span>Clearance Progress</span>
              <span className="text-3xl font-bold text-primary">{clearedCount}/{totalCount}</span>
            </CardTitle>
            <CardDescription className="text-base">
              Track your clearance status across all university departments
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <Progress value={progressPercentage} className="w-full h-3" />
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground">{clearedCount} departments cleared</span>
                  <span className="text-primary">{progressPercentage.toFixed(0)}% complete</span>
                </div>
              </div>
              <Button
                onClick={handleDownloadCertificate}
                className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                disabled={!isFullyCleared}
              >
                <Download className="w-5 h-5 mr-2" />
                {isFullyCleared ? 'Download Clearance Certificate' : 'Complete All Clearances First'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Department Status Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {clearanceData.map((item, index) => (
            <div
              key={index}
              className="cursor-pointer"
              onClick={() => navigate(`/student/department/${encodeURIComponent(item.department)}`)}
            >
              <Card className="relative hover:shadow-xl transition-all duration-300 hover:scale-[1.03] border-2 hover:border-primary/50 group h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(item.status)}
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {item.department}
                      </CardTitle>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {item.notes && (
                    <div className="mb-3 p-3 bg-muted/70 rounded-md border border-border/50">
                      <p className="text-sm font-medium">Notes:</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.notes}</p>
                    </div>
                  )}
                  {item.status === "cleared" && item.cleared_at && (
                    <p className="text-sm text-muted-foreground mb-1">
                      Cleared: {new Date(item.cleared_at).toLocaleDateString()}
                    </p>
                  )}
                  {item.cleared_by && (
                    <p className="text-sm text-muted-foreground mb-3">
                      By: {item.cleared_by}
                    </p>
                  )}
                  <div className="flex items-center justify-end text-sm text-primary font-medium mt-4 pt-3 border-t group-hover:translate-x-1 transition-transform">
                    View Details <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <Card className="shadow-lg border-2">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="text-xl">Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {clearanceData.filter(d => d.status === "blocked").length > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border-l-4 border-destructive">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-destructive font-medium">
                    You have blocked clearances. Click on the department card to view details and submit queries.
                  </p>
                </div>
              )}
              {clearanceData.filter(d => d.status === "pending").length > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border-l-4 border-warning">
                  <Clock className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-warning-foreground font-medium">
                    Some departments are processing your clearance. Check individual departments for requirements.
                  </p>
                </div>
              )}
              {isFullyCleared && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-success/10 border-l-4 border-success">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-success-foreground font-medium">
                    Congratulations! All departments have cleared you. Download your certificate above.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;