import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Calendar,
  Edit2,
  Save,
  X,
  Key,
  Building,
  GraduationCap,
  School,
  BookOpen,
  Briefcase,
  AlertCircle,
  Phone,
  CreditCard,
  Layers,
  CheckCircle2,
  Shield,
  Smartphone,
  Globe,
  Award,
  Clock,
  Bell,
  BookMarked,
  UserCheck,
  Eye,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import CreatorLayout from "../components/CreatorLayout";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatorProfile = () => {
  const { axios, createrToken } = useAppContext();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_no: "",
    aadhar: "",
    designation: "",
    category: "",
    college: "",
    faculty: "",
    school: "",
    department: "",
    programme: "",
    discipline: "",
    programId: "",
    programName: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch creator profile
  useEffect(() => {
    fetchCreatorProfile();
    fetchNotifications();
  }, []);

  const fetchCreatorProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/creater/profile", {
        headers: { createrToken },
      });
      
      if (response.data.success && response.data.profile) {
        const data = response.data.profile;
        setProfileData(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          mobile_no: data.mobile_no || "",
          aadhar: data.aadhar || "",
          designation: data.designation || "",
          category: data.category || "",
          college: data.college || "GM University",
          faculty: data.faculty || "",
          school: data.school || "",
          department: data.department || "",
          programme: data.programme || "",
          discipline: data.discipline || "",
          programId: data.programId || "",
          programName: data.programName || "",
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/creater/notifications", {
        headers: { createrToken },
      });
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/creater/notifications/${id}/read`, {}, {
        headers: { createrToken },
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put("/api/creater/notifications/read-all", {}, {
        headers: { createrToken },
      });
      fetchNotifications();
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // Handle notification click - Navigate to Edit CD page with course data
  const handleNotificationClick = async (notification) => {
    // Mark as read first
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    // Check if it's a course assignment notification
    if (notification.type === "course_assignment" && notification.data) {
      const { courseCode, courseTitle, programCode, programName, semester } = notification.data;
      
      // Navigate to Edit CD page with state
      navigate("/creator/edit-cd", {
        state: {
          prefillData: {
            courseCode: courseCode,
            courseTitle: courseTitle,
            programCode: programCode,
            programName: programName,
            semester: semester,
            notificationId: notification._id
          }
        }
      });
    } else if (notification.type === "approval") {
      // For approval notifications, navigate to PD history
      toast.success("Your document was approved! You can view it in history.");
      navigate("/creator/pd-history");
    } else if (notification.type === "rejection") {
      // For rejection notifications, navigate to Edit PD page to make changes
      toast.info("Please review the feedback and resubmit your document.");
      navigate("/creator/create-pd");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put("/api/creater/profile", formData, {
        headers: { createrToken },
      });
      
      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        fetchCreatorProfile();
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await axios.put("/api/creater/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, {
        headers: { createrToken },
      });
      
      if (response.data.success) {
        toast.success("Password updated successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        throw new Error(response.data.message || "Failed to update password");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "course_assignment":
        return <BookMarked size={16} className="text-blue-500" />;
      case "approval":
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "rejection":
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading && !profileData) {
    return (
      <CreatorLayout>
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#BF1A1A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </CreatorLayout>
    );
  }

  return (
    <CreatorLayout>
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-50 py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 flex items-center gap-2 sm:gap-3">
                  <div className="p-2 bg-red-50 rounded-xl">
                    <User className="text-[#BF1A1A]" size={24} />
                  </div>
                  Creator Profile
                </h1>
                <p className="text-stone-500 text-sm mt-2 ml-1">
                  Manage your account and view notifications
                </p>
              </div>
              {!isEditing && activeTab === "profile" && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#BF1A1A] text-white rounded-xl hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 sm:gap-6">
            {/* Sidebar - Profile Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden sticky top-6">
                {/* Cover Image Area */}
                <div className="h-24 bg-gradient-to-r from-[#BF1A1A] to-red-600"></div>
                
                {/* Profile Image */}
                <div className="relative px-6 pb-4">
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#BF1A1A] to-red-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : "C"}
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="px-6 pb-6 text-center pt-12">
                  <h2 className="text-xl font-bold text-stone-800">
                    {formData.name || "Creator User"}
                  </h2>
                  <p className="text-sm text-[#BF1A1A] font-medium mt-1">
                    {formData.designation || "Faculty Member"}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-3 text-xs text-stone-500">
                    <Clock size={12} />
                    <span>
                      {profileData?.createdAt ? `Joined ${new Date(profileData.createdAt).toLocaleDateString()}` : "Member"}
                    </span>
                  </div>
                  {formData.programId && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                      <span className="text-[11px] text-emerald-700 font-medium">{formData.programId}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="border-t border-stone-100 px-6 py-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <p className="text-xs text-stone-400 mb-1">Programme</p>
                      <p className="text-sm font-semibold text-stone-700 truncate">
                        {formData.programme?.split(' ')[0] || "N/A"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-stone-400 mb-1">Department</p>
                      <p className="text-sm font-semibold text-stone-700 truncate">
                        {formData.department?.split(' ')[0] || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="border-t border-stone-100 p-3 space-y-1.5">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                      activeTab === "profile"
                        ? "bg-red-50 text-[#BF1A1A]"
                        : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <User size={18} />
                    <span>Profile Information</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                      activeTab === "notifications"
                        ? "bg-red-50 text-[#BF1A1A]"
                        : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <Bell size={18} />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                      activeTab === "security"
                        ? "bg-red-50 text-[#BF1A1A]"
                        : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <Shield size={18} />
                    <span>Security Settings</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                {/* Edit Mode Banner */}
                {isEditing && activeTab === "profile" && (
                  <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-amber-700">
                      <AlertCircle size={16} />
                      <span className="text-xs sm:text-sm font-medium">You are in edit mode</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                      >
                        <X size={14} />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#BF1A1A] text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <Save size={14} />
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  {/* Profile Information Tab */}
                  {activeTab === "profile" && (
                    <div className="space-y-6">
                      {/* Personal Details Section */}
                      <div>
                        <h3 className="text-base font-semibold text-stone-800 mb-4 flex items-center gap-2">
                          <div className="p-1.5 bg-red-50 rounded-lg">
                            <User size={16} className="text-[#BF1A1A]" />
                          </div>
                          Personal Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                              Full Name
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent transition-all text-sm"
                              />
                            ) : (
                              <p className="text-stone-800 font-medium">{formData.name || "—"}</p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                              Email Address
                            </label>
                            <p className="text-stone-800 flex items-center gap-2">
                              <Mail size={14} className="text-stone-400" />
                              {formData.email || "—"}
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                              Mobile Number
                            </label>
                            {isEditing ? (
                              <input
                                type="tel"
                                name="mobile_no"
                                value={formData.mobile_no}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent transition-all text-sm"
                                placeholder="Enter mobile number"
                              />
                            ) : (
                              <p className="text-stone-800 flex items-center gap-2">
                                <Smartphone size={14} className="text-stone-400" />
                                {formData.mobile_no || "—"}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                              Designation
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent transition-all text-sm"
                                placeholder="e.g., Professor, HOD"
                              />
                            ) : (
                              <p className="text-stone-800 flex items-center gap-2">
                                <Briefcase size={14} className="text-stone-400" />
                                {formData.designation || "—"}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                              Category
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent transition-all text-sm"
                                placeholder="Teaching/Non-Teaching"
                              />
                            ) : (
                              <p className="text-stone-800 flex items-center gap-2">
                                <Layers size={14} className="text-stone-400" />
                                {formData.category || "—"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Institutional Affiliation Section */}
                      <div className="pt-4 border-t border-stone-100">
                        <h3 className="text-base font-semibold text-stone-800 mb-4 flex items-center gap-2">
                          <div className="p-1.5 bg-emerald-50 rounded-lg">
                            <Building size={16} className="text-emerald-600" />
                          </div>
                          Institutional Affiliation
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                              College / University
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="college"
                                value={formData.college}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent transition-all text-sm"
                              />
                            ) : (
                              <p className="text-stone-800 flex items-center gap-2">
                                <Globe size={14} className="text-stone-400" />
                                {formData.college || "GM University"}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                              Faculty
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="faculty"
                                value={formData.faculty}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent transition-all text-sm"
                              />
                            ) : (
                              <p className="text-stone-800 flex items-center gap-2">
                                <GraduationCap size={14} className="text-stone-400" />
                                {formData.faculty || "—"}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                              School
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="school"
                                value={formData.school}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent transition-all text-sm"
                              />
                            ) : (
                              <p className="text-stone-800 flex items-center gap-2">
                                <School size={14} className="text-stone-400" />
                                {formData.school || "—"}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                              Department
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent transition-all text-sm"
                              />
                            ) : (
                              <p className="text-stone-800 flex items-center gap-2">
                                <BookOpen size={14} className="text-stone-400" />
                                {formData.department || "—"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Programme Details Section */}
                      <div className="pt-4 border-t border-stone-100">
                        <h3 className="text-base font-semibold text-stone-800 mb-4 flex items-center gap-2">
                          <div className="p-1.5 bg-amber-50 rounded-lg">
                            <Award size={16} className="text-amber-600" />
                          </div>
                          Programme Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                              Programme
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="programme"
                                value={formData.programme}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent transition-all text-sm"
                              />
                            ) : (
                              <p className="text-stone-800">{formData.programme || "—"}</p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                              Discipline
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="discipline"
                                value={formData.discipline}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent transition-all text-sm"
                              />
                            ) : (
                              <p className="text-stone-800">{formData.discipline || "—"}</p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                              Program ID
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="programId"
                                value={formData.programId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent transition-all text-sm font-mono"
                              />
                            ) : (
                              <p className="text-stone-800 font-mono text-sm">{formData.programId || "—"}</p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                              Program Name
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="programName"
                                value={formData.programName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent transition-all text-sm"
                              />
                            ) : (
                              <p className="text-stone-800">{formData.programName || "—"}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === "notifications" && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-stone-800 flex items-center gap-2">
                          <div className="p-1.5 bg-blue-50 rounded-lg">
                            <Bell size={16} className="text-blue-600" />
                          </div>
                          All Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        {notifications.length === 0 ? (
                          <div className="text-center py-12">
                            <Bell size={48} className="mx-auto text-stone-300 mb-3" />
                            <p className="text-stone-500">No notifications yet</p>
                            <p className="text-xs text-stone-400 mt-1">
                              When you receive course assignments, they will appear here
                            </p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                !notif.isRead
                                  ? "bg-blue-50/30 border-blue-200"
                                  : "bg-white border-stone-200 hover:bg-stone-50"
                              }`}
                              onClick={() => handleNotificationClick(notif)}
                            >
                              <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                  {getNotificationIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm font-semibold text-stone-800">
                                      {notif.title}
                                    </p>
                                    {!notif.isRead && (
                                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                                    )}
                                  </div>
                                  <p className="text-xs text-stone-600 mt-1">
                                    {notif.message}
                                  </p>
                                  {notif.data?.courseCode && (
                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-stone-500">
                                      <span className="flex items-center gap-1">
                                        <BookMarked size={11} />
                                        Course: {notif.data.courseCode}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock size={11} />
                                        Semester: {notif.data.semester}
                                      </span>
                                      {notif.data.programCode && (
                                        <span className="flex items-center gap-1">
                                          <GraduationCap size={11} />
                                          Program: {notif.data.programCode}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  <p className="text-[10px] text-stone-400 mt-2">
                                    {formatTime(notif.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === "security" && (
                    <div>
                      <h3 className="text-base font-semibold text-stone-800 mb-4 flex items-center gap-2">
                        <div className="p-1.5 bg-red-50 rounded-lg">
                          <Shield size={16} className="text-[#BF1A1A]" />
                        </div>
                        Security Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                          <p className="text-xs text-amber-700 flex items-center gap-2">
                            <AlertCircle size={14} />
                            For security, please enter your current password before setting a new one
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData((prev) => ({
                                ...prev,
                                currentPassword: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent transition-all text-sm"
                            placeholder="Enter your current password"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  newPassword: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent transition-all text-sm"
                              placeholder="Min 6 characters"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  confirmPassword: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent transition-all text-sm"
                              placeholder="Confirm your new password"
                            />
                          </div>
                        </div>

                        <button
                          onClick={handlePasswordUpdate}
                          disabled={loading}
                          className="mt-4 px-5 py-2.5 bg-[#BF1A1A] text-white rounded-xl hover:bg-red-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                        >
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Updating...
                            </>
                          ) : (
                            <>
                              <Key size={16} />
                              Update Password
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
};

export default CreatorProfile;