import { useState } from "react";
import ProfileLayout from "./ProfileLayout";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ProfileSettings = () => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    // Simulation of update
    setTimeout(() => {
      toast.success("Profile updated successfully");
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <ProfileLayout>
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl font-display mb-2">Settings</h1>
          <p className="text-muted-foreground font-light">Update your personal information and security settings.</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-12 max-w-xl">
          {/* Personal Info Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-display border-b border-border pb-4">Personal Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Full Name</label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="rounded-none border-t-0 border-x-0 border-b-border focus-visible:ring-0 focus-visible:border-black transition-all px-0" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Email Address</label>
                <Input 
                  value={formData.email} 
                  disabled
                  className="rounded-none border-t-0 border-x-0 border-b-border bg-transparent opacity-50 px-0 cursor-not-allowed" 
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-display border-b border-border pb-4">Security</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Current Password</label>
                <Input 
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={formData.currentPassword} 
                  onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                  className="rounded-none border-t-0 border-x-0 border-b-border focus-visible:ring-0 focus-visible:border-black transition-all px-0" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">New Password</label>
                <Input 
                  type="password"
                  placeholder="New password"
                  value={formData.newPassword} 
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  className="rounded-none border-t-0 border-x-0 border-b-border focus-visible:ring-0 focus-visible:border-black transition-all px-0" 
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isUpdating}
            className="w-full sm:w-auto px-12 h-12 rounded-none uppercase tracking-[0.2em] text-[10px]"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </ProfileLayout>
  );
};

export default ProfileSettings;
