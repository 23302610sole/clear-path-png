import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, XCircle, Clock, Send, Info, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useClearanceData } from "@/hooks/useClearanceData";
import { useToast } from "@/hooks/use-toast";

const DEPARTMENT_INFO = {
  Library: {
    description: "The university library provides access to academic resources, books, journals, and study spaces.",
    services: ["Book borrowing", "Journal access", "Study rooms", "Research assistance"],
    contact: "library@university.edu",
    clearanceRequirements: "Return all borrowed books and clear any outstanding fines",
  },
  "SS&FC": {
    description: "Student Services & Fees Collection handles student welfare, activities, and fee management.",
    services: ["Student activities", "Fee collection", "Student welfare", "Event coordination"],
    contact: "ssfc@university.edu",
    clearanceRequirements: "Clear all outstanding fees and return any equipment borrowed for events",
  },
  Mess: {
    description: "The cafeteria/mess provides meals and dining services to students and staff.",
    services: ["Meal plans", "Dining services", "Catering", "Special dietary needs"],
    contact: "mess@university.edu",
    clearanceRequirements: "Clear all outstanding meal plan dues and return mess card",
  },
  "AV Unit": {
    description: "Audio-Visual Unit manages multimedia equipment and technical support for events.",
    services: ["Equipment rental", "Technical support", "Event setup", "Maintenance"],
    contact: "av@university.edu",
    clearanceRequirements: "Return all borrowed AV equipment in good condition",
  },
  Bookshop: {
    description: "The university bookshop supplies textbooks, stationery, and academic materials.",
    services: ["Textbooks", "Stationery", "Course materials", "Special orders"],
    contact: "bookshop@university.edu",
    clearanceRequirements: "Clear all outstanding book purchases and return any borrowed materials",
  },
  "Accounts Office": {
    description: "Accounts Office manages financial transactions, tuition, and financial aid.",
    services: ["Tuition payment", "Financial aid", "Receipts", "Fee waivers"],
    contact: "accounts@university.edu",
    clearanceRequirements: "Clear all outstanding tuition and fees",
  },
};

const DepartmentDetail = () => {
  const { department } = useParams<{ department: string }>();
  const { studentProfile, loading, userType } = useAuth();
  const { clearanceData, loading: clearanceLoading } = useClearanceData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = `${department} | Student Dashboard`;
  }, [department]);

  useEffect(() => {
    if (!loading && (!studentProfile || userType !== 'student')) {
      navigate('/');
    }
  }, [studentProfile, userType, loading, navigate]);

  if (loading || clearanceLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!studentProfile || !department) return null;

  const decodedDepartment = decodeURIComponent(department);
  const deptStatus = clearanceData.find(d => d.department === decodedDepartment);
  const deptInfo = DEPARTMENT_INFO[decodedDepartment as keyof typeof DEPARTMENT_INFO];

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "cleared":
        return <CheckCircle className="w-8 h-8 text-success" />;
      case "blocked":
        return <XCircle className="w-8 h-8 text-destructive" />;
      default:
        return <Clock className="w-8 h-8 text-warning" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "cleared":
        return <Badge variant="default" className="text-lg py-1 px-3">Cleared</Badge>;
      case "blocked":
        return <Badge variant="destructive" className="text-lg py-1 px-3">Blocked</Badge>;
      default:
        return <Badge variant="secondary" className="text-lg py-1 px-3">Pending</Badge>;
    }
  };

  const handleSubmitQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter your query",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // In a real implementation, this would send the query to the department
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Query Submitted",
        description: `Your query has been sent to ${decodedDepartment}. They will respond via email.`,
      });
      setQuery("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit query",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container max-w-4xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/student')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Department Header */}
        <Card className="mb-6 shadow-lg border-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(deptStatus?.status)}
                <div>
                  <CardTitle className="text-3xl">{decodedDepartment}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {deptInfo?.description || "Department information"}
                  </CardDescription>
                </div>
              </div>
              {getStatusBadge(deptStatus?.status)}
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="status" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status">Clearance Status</TabsTrigger>
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="query">Submit Query</TabsTrigger>
          </TabsList>

          <TabsContent value="status">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Your Clearance Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold">Current Status:</span>
                    {getStatusBadge(deptStatus?.status)}
                  </div>

                  {deptStatus?.notes && (
                    <div className="mb-4">
                      <p className="font-semibold mb-2">Department Notes:</p>
                      <p className="text-muted-foreground">{deptStatus.notes}</p>
                    </div>
                  )}

                  {deptStatus?.status === "cleared" && deptStatus.cleared_at && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Cleared on: {new Date(deptStatus.cleared_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      {deptStatus.cleared_by && (
                        <p className="text-sm text-muted-foreground">
                          Cleared by: {deptStatus.cleared_by}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {deptInfo && (
                  <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
                    <p className="font-semibold mb-2">Requirements for Clearance:</p>
                    <p className="text-muted-foreground">{deptInfo.clearanceRequirements}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Department Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {deptInfo ? (
                  <>
                    <div>
                      <h3 className="font-semibold mb-2">Services Offered:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {deptInfo.services.map((service, idx) => (
                          <li key={idx} className="text-muted-foreground">{service}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="font-semibold mb-1">Contact:</p>
                      <p className="text-muted-foreground">{deptInfo.contact}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">Department information not available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="query">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Submit a Query
                </CardTitle>
                <CardDescription>
                  Have a question or concern? Send it directly to {decodedDepartment}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="query">Your Query</Label>
                  <Textarea
                    id="query"
                    placeholder="Type your question or concern here..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <Button
                  onClick={handleSubmitQuery}
                  disabled={submitting || !query.trim()}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitting ? 'Submitting...' : 'Submit Query'}
                </Button>

                <p className="text-sm text-muted-foreground">
                  You will receive a response via email at {studentProfile.email}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DepartmentDetail;
