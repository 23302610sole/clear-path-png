import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const StudentProfile = () => {
  const { studentProfile, loading, userType } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    course_code: "",
    year_level: "",
    sponsor: "",
    home_address: "",
    forwarding_address: "",
    campus_hall: "",
    room_number: "",
    clearance_reason: "" as "discontinue" | "end_of_year" | "withdrawal" | "non_residence" | "exclusion" | "industrial" | "",
  });
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = 'Edit Profile | Student Dashboard';
  }, []);

  useEffect(() => {
    if (!loading && (!studentProfile || userType !== 'student')) {
      navigate('/');
    }
  }, [studentProfile, userType, loading, navigate]);

  useEffect(() => {
    if (studentProfile) {
      setFormData({
        full_name: studentProfile.full_name,
        phone: studentProfile.phone || "",
        email: studentProfile.email,
        course_code: studentProfile.course_code || "",
        year_level: studentProfile.year_level || "",
        sponsor: studentProfile.sponsor || "",
        home_address: studentProfile.home_address || "",
        forwarding_address: studentProfile.forwarding_address || "",
        campus_hall: studentProfile.campus_hall || "",
        room_number: studentProfile.room_number || "",
        clearance_reason: studentProfile.clearance_reason || "",
      });
    }
  }, [studentProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!studentProfile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('students')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          course_code: formData.course_code,
          year_level: formData.year_level,
          sponsor: formData.sponsor,
          home_address: formData.home_address,
          forwarding_address: formData.forwarding_address,
          campus_hall: formData.campus_hall,
          room_number: formData.room_number,
          clearance_reason: formData.clearance_reason || null,
        })
        .eq('id', studentProfile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      setTimeout(() => navigate('/student'), 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!studentProfile) return null;

  const initials = studentProfile.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container max-w-2xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/student')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toast({
                    title: "Coming Soon",
                    description: "Profile picture upload will be available soon",
                  })}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {studentProfile.student_id} • {studentProfile.department}
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course_code">Course Code</Label>
                  <Input
                    id="course_code"
                    name="course_code"
                    value={formData.course_code}
                    onChange={handleInputChange}
                    placeholder="e.g., CS101"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year_level">Year Level</Label>
                  <Input
                    id="year_level"
                    name="year_level"
                    value={formData.year_level}
                    onChange={handleInputChange}
                    placeholder="e.g., Year 1, Year 2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sponsor">Sponsor</Label>
                  <Input
                    id="sponsor"
                    name="sponsor"
                    value={formData.sponsor}
                    onChange={handleInputChange}
                    placeholder="Sponsor name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campus_hall">Campus Hall</Label>
                  <Input
                    id="campus_hall"
                    name="campus_hall"
                    value={formData.campus_hall}
                    onChange={handleInputChange}
                    placeholder="Hall name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room_number">Room Number</Label>
                  <Input
                    id="room_number"
                    name="room_number"
                    value={formData.room_number}
                    onChange={handleInputChange}
                    placeholder="Room number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="home_address">Home Address</Label>
                <Textarea
                  id="home_address"
                  name="home_address"
                  value={formData.home_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, home_address: e.target.value }))}
                  placeholder="Enter your home address"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="forwarding_address">Forwarding Address</Label>
                <Textarea
                  id="forwarding_address"
                  name="forwarding_address"
                  value={formData.forwarding_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, forwarding_address: e.target.value }))}
                  placeholder="Enter your forwarding address"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clearance_reason">Reason for Clearance</Label>
                <Select
                  value={formData.clearance_reason}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, clearance_reason: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="end_of_year">End of Year</SelectItem>
                    <SelectItem value="discontinue">Discontinue</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    <SelectItem value="non_residence">Non-Residence</SelectItem>
                    <SelectItem value="exclusion">Exclusion</SelectItem>
                    <SelectItem value="industrial">Industrial Attachment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/student')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;
