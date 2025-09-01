import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Mail, CheckCircle, Clock, AlertTriangle, LogOut, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  studentId: string;
  name: string;
  department: string;
  status: "cleared" | "pending" | "outstanding";
  lastUpdated: string;
  remarks?: string;
  email?: string;
}

const DepartmentDashboard = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      studentId: "12345678",
      name: "John Doe",
      department: "Computer Science",
      status: "pending",
      lastUpdated: "2024-01-10",
      remarks: "Pending lab equipment return verification",
      email: "john.doe@student.unitech.ac.pg"
    },
    {
      id: "2", 
      studentId: "12345679",
      name: "Jane Smith",
      department: "Computer Science",
      status: "cleared",
      lastUpdated: "2024-01-15",
      email: "jane.smith@student.unitech.ac.pg"
    },
    {
      id: "3",
      studentId: "12345680", 
      name: "Bob Wilson",
      department: "Computer Science",
      status: "outstanding",
      lastUpdated: "2024-01-08",
      remarks: "Missing final project submission",
      email: "bob.wilson@student.unitech.ac.pg"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [updateForm, setUpdateForm] = useState({
    status: "",
    remarks: ""
  });

  const { toast } = useToast();

  // Current department (would be passed from authentication)
  const currentDepartment = "Computer Science Department";

  const filteredStudents = students.filter(student =>
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "cleared":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "outstanding":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "cleared":
        return <Badge className="bg-green-100 text-green-800">Cleared</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "outstanding":
        return <Badge variant="destructive">Outstanding</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const updatedStudents = students.map(student =>
      student.id === selectedStudent.id
        ? {
            ...student,
            status: updateForm.status as "cleared" | "pending" | "outstanding",
            remarks: updateForm.remarks,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : student
    );

    setStudents(updatedStudents);
    setSelectedStudent(null);
    setUpdateForm({ status: "", remarks: "" });

    toast({
      title: "Student record updated",
      description: `${selectedStudent.name}'s clearance status has been updated.`,
    });
  };

  const handleSendReminder = (student: Student) => {
    // TODO: Implement email reminder functionality
    toast({
      title: "Reminder sent",
      description: `Reminder email sent to ${student.name} at ${student.email}`,
    });
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const stats = {
    total: students.length,
    cleared: students.filter(s => s.status === "cleared").length,
    pending: students.filter(s => s.status === "pending").length,
    outstanding: students.filter(s => s.status === "outstanding").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Department Dashboard</h1>
            <p className="text-primary-foreground/80">{currentDepartment}</p>
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
        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Cleared</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.cleared}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.outstanding}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="w-full">
          <TabsList>
            <TabsTrigger value="students">Student Records</TabsTrigger>
            <TabsTrigger value="update">Update Status</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
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

            {/* Student List */}
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <Card key={student.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(student.status)}
                          {student.name}
                        </CardTitle>
                        <CardDescription>
                          Student ID: {student.studentId} | Department: {student.department}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(student.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {student.remarks && (
                        <div className="p-3 bg-muted rounded-md">
                          <p className="text-sm font-medium">Remarks:</p>
                          <p className="text-sm text-muted-foreground">{student.remarks}</p>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Last updated: {new Date(student.lastUpdated).toLocaleDateString()}</span>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedStudent(student);
                              setUpdateForm({
                                status: student.status,
                                remarks: student.remarks || ""
                              });
                            }}
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Update
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendReminder(student)}
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Remind
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="update">
            {selectedStudent ? (
              <Card>
                <CardHeader>
                  <CardTitle>Update Student Status</CardTitle>
                  <CardDescription>
                    Updating clearance status for {selectedStudent.name} (ID: {selectedStudent.studentId})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateStudent} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Clearance Status</Label>
                      <Select
                        value={updateForm.status}
                        onValueChange={(value) => setUpdateForm(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cleared">Cleared</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="outstanding">Outstanding</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="remarks">Remarks</Label>
                      <Textarea
                        id="remarks"
                        placeholder="Add any remarks or notes..."
                        value={updateForm.remarks}
                        onChange={(e) => setUpdateForm(prev => ({ ...prev, remarks: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">Update Status</Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setSelectedStudent(null);
                          setUpdateForm({ status: "", remarks: "" });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
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