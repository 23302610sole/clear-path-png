import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock, 
  LogOut, 
  Building2,
  FileText,
  Users
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useClearanceData } from "@/hooks/useClearanceData";
import { useToast } from "@/hooks/use-toast";

const DepartmentDashboard = () => {
  const { departmentProfile, signOut, loading, userType } = useAuth();
  const { clearanceData, loading: clearanceLoading, updateClearanceStatus, sendReminderEmail } = useClearanceData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [clearanceNotes, setClearanceNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'cleared' | 'blocked'>('pending');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not authenticated as department user
  useEffect(() => {
    if (!loading && (!departmentProfile || userType !== 'department')) {
      navigate('/');
    }
  }, [departmentProfile, userType, loading, navigate]);

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

  if (!departmentProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Department profile not found</CardTitle>
            <CardDescription>
              We couldn't load your department profile. Please try again or sign out.
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

  const filteredStudents = clearanceData.filter((record: any) =>
    record.student?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.student?.student_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = clearanceData.filter((s: any) => s.status === "pending").length;
  const clearedCount = clearanceData.filter((s: any) => s.status === "cleared").length;
  const blockedCount = clearanceData.filter((s: any) => s.status === "blocked").length;

  const updateStudentStatus = async (studentId: string, status: 'pending' | 'cleared' | 'blocked') => {
    if (!departmentProfile) return;
    
    setUpdatingStatus(true);
    try {
      await updateClearanceStatus(studentId, departmentProfile.department, status, clearanceNotes);
      setSelectedStudent(null);
      setClearanceNotes("");
      setSelectedStatus('pending');
    } catch (error) {
      // Error handled in hook
    } finally {
      setUpdatingStatus(false);
    }
  };

  const sendReminder = async (studentId: string) => {
    await sendReminderEmail(studentId);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "cleared":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "blocked":
        return <XCircle className="w-4 h-4 text-destructive" />;
      case "pending":
      default:
        return <Clock className="w-4 h-4 text-warning" />;
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-foreground/10 p-3 rounded-full">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">{departmentProfile.department}</h1>
              <p className="text-primary-foreground/80">Officer: {departmentProfile.full_name}</p>
              <p className="text-primary-foreground/80">{departmentProfile.email}</p>
            </div>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clearanceData.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-success flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Cleared
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{clearedCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-warning flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{pendingCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-destructive flex items-center">
                <XCircle className="w-4 h-4 mr-2" />
                Blocked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{blockedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by student ID or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Student Management */}
        <Tabs defaultValue="students" className="w-full">
          <TabsList>
            <TabsTrigger value="students">Student Records</TabsTrigger>
            <TabsTrigger value="update">Update Status</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <div className="space-y-4">
              {filteredStudents.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No students found matching your search.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredStudents.map((record: any) => (
                  <Card key={record.student?.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {getStatusIcon(record.status)}
                            {record.student?.full_name}
                          </CardTitle>
                          <CardDescription>
                            Student ID: {record.student?.student_id} | Department: {record.student?.department}
                            {record.student?.clearance_reason && (
                              <span className="ml-2 text-primary font-medium">
                                • {record.student.clearance_reason.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(record.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {record.notes && (
                          <div className="p-3 bg-muted rounded-md">
                            <p className="text-sm font-medium">Notes:</p>
                            <p className="text-sm text-muted-foreground">{record.notes}</p>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <div>
                            {record.cleared_at && (
                              <span>Cleared: {new Date(record.cleared_at).toLocaleDateString()}</span>
                            )}
                            {record.cleared_by && (
                              <span> by {record.cleared_by}</span>
                            )}
                          </div>
                          <div className="space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedStudent(record);
                                setClearanceNotes(record.notes || "");
                                setSelectedStatus(record.status);
                              }}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Update
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sendReminder(record.student?.id)}
                            >
                              <Mail className="w-4 h-4 mr-1" />
                              Remind
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="update">
            {selectedStudent ? (
              <Card>
                <CardHeader>
                  <CardTitle>Update Student Status</CardTitle>
                  <CardDescription>
                    Updating clearance status for {selectedStudent.student?.full_name} (ID: {selectedStudent.student?.student_id})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="status">Clearance Status</Label>
                        <Select value={selectedStatus} onValueChange={(value: 'pending' | 'cleared' | 'blocked') => setSelectedStatus(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="cleared">Cleared</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {(departmentProfile.department === 'Accounts Office' || departmentProfile.department === 'Mess') && (
                        <div>
                          <Label htmlFor="amount_owing">Amount Owing</Label>
                          <Input
                            id="amount_owing"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            defaultValue={selectedStudent.amount_owing || ''}
                          />
                        </div>
                      )}

                      {(departmentProfile.department === 'Library' || departmentProfile.department === 'Bookshop') && (
                        <div>
                          <Label htmlFor="books_outstanding">Books Outstanding</Label>
                          <Input
                            id="books_outstanding"
                            type="number"
                            placeholder="0"
                            defaultValue={selectedStudent.books_outstanding || 0}
                          />
                        </div>
                      )}

                      {departmentProfile.department === 'AV Unit' && (
                        <div>
                          <Label htmlFor="equipment_outstanding">Equipment Outstanding</Label>
                          <Input
                            id="equipment_outstanding"
                            placeholder="List equipment..."
                            defaultValue={selectedStudent.equipment_outstanding || ''}
                          />
                        </div>
                      )}

                      {departmentProfile.department === 'Mess' && (
                        <div>
                          <Label htmlFor="date_of_cancellation">Date of Cancellation</Label>
                          <Input
                            id="date_of_cancellation"
                            type="date"
                            defaultValue={selectedStudent.date_of_cancellation || ''}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any additional notes..."
                        value={clearanceNotes}
                        onChange={(e) => setClearanceNotes(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button 
                        onClick={() => updateStudentStatus(selectedStudent.student?.id, selectedStatus)}
                        className="flex-1"
                        disabled={updatingStatus}
                      >
                        {updatingStatus ? 'Updating...' : 'Update Status'}
                      </Button>
                      <Button 
                        onClick={() => setSelectedStudent(null)}
                        variant="outline"
                        className="flex-1"
                        disabled={updatingStatus}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Student</CardTitle>
                  <CardDescription>
                    Choose a student from the "Student Records" tab to update their clearance status.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DepartmentDashboard;