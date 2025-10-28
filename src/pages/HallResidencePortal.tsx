import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, LogOut, CheckCircle, XCircle, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const HallResidencePortal = () => {
  const { departmentProfile, signOut, loading, userType } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Property Return Form State
  const [propertyForm, setPropertyForm] = useState({
    mattress_returned: false,
    chair_returned: false,
    proxy_card_returned: false,
    key_returned: false,
    notes: "",
  });

  // Room Inspection Form State
  const [inspectionForm, setInspectionForm] = useState({
    lodge_name: "",
    lodge_number: "",
    flywire_status: "no_repair",
    flywire_notes: "",
    door_status: "no_repair",
    door_notes: "",
    lock_status: "no_repair",
    lock_notes: "",
    lights_status: "no_repair",
    lights_notes: "",
    ceiling_status: "no_repair",
    ceiling_notes: "",
    walls_status: "no_repair",
    walls_notes: "",
    light_switches_status: "no_repair",
    light_switches_notes: "",
    study_table_status: "no_repair",
    study_table_notes: "",
    power_points_status: "no_repair",
    power_points_notes: "",
  });

  useEffect(() => {
    if (!loading && (!departmentProfile || userType !== 'department')) {
      navigate('/');
    }
  }, [departmentProfile, userType, loading, navigate]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('full_name');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handlePropertySubmit = async () => {
    if (!selectedStudent) return;

    try {
      const { error } = await supabase
        .from('property_returns')
        .upsert({
          student_id: selectedStudent.id,
          ...propertyForm,
          verified_by: departmentProfile?.full_name,
          verification_date: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property return recorded successfully",
      });

      setSelectedStudent(null);
      setPropertyForm({
        mattress_returned: false,
        chair_returned: false,
        proxy_card_returned: false,
        key_returned: false,
        notes: "",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to record property return",
        variant: "destructive",
      });
    }
  };

  const handleInspectionSubmit = async () => {
    if (!selectedStudent) return;

    try {
      const { error } = await supabase
        .from('room_inspections')
        .upsert({
          student_id: selectedStudent.id,
          ...inspectionForm,
          sub_warden_approved: true,
          sub_warden_name: departmentProfile?.full_name,
          approval_date: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Room inspection recorded successfully",
      });

      setSelectedStudent(null);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to record room inspection",
        variant: "destructive",
      });
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!departmentProfile) return null;

  const filteredStudents = students.filter((student) =>
    student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.student_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground shadow-lg">
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Building2 className="w-8 h-8" />
                Hall of Residence Portal
              </h1>
              <p className="text-primary-foreground/80 mt-1">{departmentProfile.full_name}</p>
            </div>
            <Button variant="secondary" onClick={async () => { await signOut(); navigate('/'); }}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
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

        <Tabs defaultValue="property" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="property">Property Returns</TabsTrigger>
            <TabsTrigger value="inspection">Room Inspection</TabsTrigger>
          </TabsList>

          <TabsContent value="property">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Student</CardTitle>
                  <CardDescription>Choose a student to record property returns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredStudents.map((student) => (
                      <Button
                        key={student.id}
                        variant={selectedStudent?.id === student.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedStudent(student)}
                      >
                        {student.full_name} ({student.student_id})
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Property Return Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Return Checklist</CardTitle>
                  <CardDescription>
                    {selectedStudent ? `Recording for ${selectedStudent.full_name}` : "Select a student to begin"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedStudent ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="mattress"
                          checked={propertyForm.mattress_returned}
                          onCheckedChange={(checked) =>
                            setPropertyForm({ ...propertyForm, mattress_returned: checked as boolean })
                          }
                        />
                        <Label htmlFor="mattress">Mattress</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="chair"
                          checked={propertyForm.chair_returned}
                          onCheckedChange={(checked) =>
                            setPropertyForm({ ...propertyForm, chair_returned: checked as boolean })
                          }
                        />
                        <Label htmlFor="chair">Chair</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="proxy"
                          checked={propertyForm.proxy_card_returned}
                          onCheckedChange={(checked) =>
                            setPropertyForm({ ...propertyForm, proxy_card_returned: checked as boolean })
                          }
                        />
                        <Label htmlFor="proxy">Proxy Card</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="key"
                          checked={propertyForm.key_returned}
                          onCheckedChange={(checked) =>
                            setPropertyForm({ ...propertyForm, key_returned: checked as boolean })
                          }
                        />
                        <Label htmlFor="key">Room Key</Label>
                      </div>

                      <div>
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={propertyForm.notes}
                          onChange={(e) => setPropertyForm({ ...propertyForm, notes: e.target.value })}
                          placeholder="Any additional notes..."
                        />
                      </div>

                      <Button onClick={handlePropertySubmit} className="w-full">
                        Submit Property Return
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Please select a student from the list
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inspection">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Student</CardTitle>
                  <CardDescription>Choose a student to conduct room inspection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredStudents.map((student) => (
                      <Button
                        key={student.id}
                        variant={selectedStudent?.id === student.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedStudent(student)}
                      >
                        {student.full_name} ({student.student_id})
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Room Inspection Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Room Inspection</CardTitle>
                  <CardDescription>
                    {selectedStudent ? `Inspecting for ${selectedStudent.full_name}` : "Select a student to begin"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="max-h-[600px] overflow-y-auto">
                  {selectedStudent ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="lodge_name">Lodge Name</Label>
                          <Input
                            id="lodge_name"
                            value={inspectionForm.lodge_name}
                            onChange={(e) => setInspectionForm({ ...inspectionForm, lodge_name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lodge_number">Lodge Number</Label>
                          <Input
                            id="lodge_number"
                            value={inspectionForm.lodge_number}
                            onChange={(e) => setInspectionForm({ ...inspectionForm, lodge_number: e.target.value })}
                          />
                        </div>
                      </div>

                      {['flywire', 'door', 'lock', 'lights', 'ceiling', 'walls', 'light_switches', 'study_table', 'power_points'].map((item) => (
                        <div key={item} className="border-b pb-4">
                          <Label className="text-base capitalize">{item.replace('_', ' ')}</Label>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <Select
                              value={inspectionForm[`${item}_status` as keyof typeof inspectionForm] as string}
                              onValueChange={(value) => setInspectionForm({ ...inspectionForm, [`${item}_status`]: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="no_repair">No Repair Needed</SelectItem>
                                <SelectItem value="repair_needed">Repair Needed</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="Notes..."
                              value={inspectionForm[`${item}_notes` as keyof typeof inspectionForm] as string}
                              onChange={(e) => setInspectionForm({ ...inspectionForm, [`${item}_notes`]: e.target.value })}
                            />
                          </div>
                        </div>
                      ))}

                      <Button onClick={handleInspectionSubmit} className="w-full">
                        Submit Inspection
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Please select a student from the list
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HallResidencePortal;
