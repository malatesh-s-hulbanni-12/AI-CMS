import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Edit2,
  Save,
  X,
  Key,
  Bell,
  Globe,
  Moon,
  Sun,
  Building,
  GraduationCap,
  School,
  BookOpen,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { useAppContext } from "../../admin/context/AppContext";
import AdminLayout from "../../admin/components/AdminLayout";

const AdminProfile = () => {
  const { adminData, updateAdminProfile, axios } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    faculty: "",
    school: "",
    department: "",
    programme: "",
    discipline: "",
    college: "",
    designation: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    notifications: true,
    language: "English",
  });

  // Load admin data from context when available
  useEffect(() => {
    if (adminData) {
      setFormData({
        name: adminData.name || "",
        email: adminData.email || "",
        faculty: adminData.faculty || "",
        school: adminData.school || "",
        department: adminData.department || "",
        programme: adminData.programme || "",
        discipline: adminData.discipline || "",
        college: adminData.college || "GM University",
        designation: adminData.designation || "Administrator",
      });
      
      if (adminData.preferences) {
        setPreferences({
          theme: adminData.preferences.theme || "light",
          notifications: adminData.preferences.notifications !== false,
          language: adminData.preferences.language || "English",
        });
      }
    }
  }, [adminData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/api/admin/profile`;
      
      const response = await axios.put(apiUrl, formData);
      
      if (response.data.success) {
        updateAdminProfile(formData);
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/api/admin/change-password`;
      
      const response = await axios.put(apiUrl, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      if (response.data.success) {
        setSuccessMessage("Password updated successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceUpdate = async () => {
    try {
      setLoading(true);
      
      const apiUrl = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/api/admin/preferences`;
      
      const response = await axios.put(apiUrl, preferences);
      
      if (response.data.success) {
        updateAdminProfile({ preferences });
        setSuccessMessage("Preferences updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update preferences");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!adminData) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-600">Loading profile...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-800 flex items-center gap-3">
              <User className="text-amber-600" size={32} />
              Admin Profile
            </h1>
            <p className="text-stone-500 mt-2">Manage your account settings and preferences</p>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <Save size={20} />
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden sticky top-6">
                {/* Profile Summary */}
                <div className="p-6 text-center border-b border-stone-200">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-lg">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : "A"}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-stone-800">
                    {formData.name || "Admin User"}
                  </h2>
                  <p className="text-sm text-amber-600 font-medium mt-1">
                    {formData.designation || "Administrator"}
                  </p>
                  <p className="text-xs text-stone-500 mt-2 flex items-center justify-center gap-1">
                    <Calendar size={12} />
                    {adminData?.createdAt ? `Joined ${new Date(adminData.createdAt).toLocaleDateString()}` : "Joined N/A"}
                  </p>
                </div>

                {/* Navigation Tabs */}
                <div className="p-4 space-y-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                      activeTab === "profile"
                        ? "bg-amber-50 text-amber-700 font-medium"
                        : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <User size={18} />
                    <span>Profile Information</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                      activeTab === "security"
                        ? "bg-amber-50 text-amber-700 font-medium"
                        : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <Key size={18} />
                    <span>Security</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("preferences")}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                      activeTab === "preferences"
                        ? "bg-amber-50 text-amber-700 font-medium"
                        : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <Bell size={18} />
                    <span>Preferences</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
                {activeTab === "profile" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-stone-800">
                        Profile Information
                      </h3>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          disabled={loading}
                        >
                          <Edit2 size={16} />
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                            disabled={loading}
                          >
                            <X size={16} />
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white hover:bg-amber-700 rounded-lg transition-colors"
                            disabled={loading}
                          >
                            <Save size={16} />
                            {loading ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-stone-900">{formData.name || "Not set"}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Email Address
                        </label>
                        <p className="text-stone-900 flex items-center gap-2">
                          <Mail size={16} className="text-stone-400" />
                          {formData.email || "Not set"}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Designation
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-stone-900 flex items-center gap-2">
                            <Briefcase size={16} className="text-stone-400" />
                            {formData.designation || "Not set"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          College
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="college"
                            value={formData.college}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-stone-900 flex items-center gap-2">
                            <Building size={16} className="text-stone-400" />
                            {formData.college || "Not set"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Faculty
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="faculty"
                            value={formData.faculty}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-stone-900 flex items-center gap-2">
                            <GraduationCap size={16} className="text-stone-400" />
                            {formData.faculty || "Not specified"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          School
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="school"
                            value={formData.school}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-stone-900 flex items-center gap-2">
                            <School size={16} className="text-stone-400" />
                            {formData.school || "Not specified"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Department
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-stone-900 flex items-center gap-2">
                            <BookOpen size={16} className="text-stone-400" />
                            {formData.department || "Not specified"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Programme
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="programme"
                            value={formData.programme}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-stone-900">{formData.programme || "Not specified"}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          Discipline
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="discipline"
                            value={formData.discipline}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-stone-900">{formData.discipline || "Not specified"}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div>
                    <h3 className="text-xl font-semibold text-stone-800 mb-6">
                      Security Settings
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
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
                          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
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
                          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Enter new password (min 6 characters)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
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
                          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <button
                        onClick={handlePasswordUpdate}
                        disabled={loading}
                        className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "preferences" && (
                  <div>
                    <h3 className="text-xl font-semibold text-stone-800 mb-6">
                      Preferences
                    </h3>
                    <div className="space-y-5">
                      <div className="flex items-center justify-between py-3 border-b border-stone-100">
                        <div className="flex items-center gap-3">
                          {preferences.theme === "light" ? (
                            <Sun size={20} className="text-amber-600" />
                          ) : (
                            <Moon size={20} className="text-stone-600" />
                          )}
                          <div>
                            <p className="font-medium text-stone-800">Theme</p>
                            <p className="text-sm text-stone-500">
                              Choose your preferred theme
                            </p>
                          </div>
                        </div>
                        <select
                          value={preferences.theme}
                          onChange={(e) =>
                            setPreferences((prev) => ({
                              ...prev,
                              theme: e.target.value,
                            }))
                          }
                          className="px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-stone-100">
                        <div className="flex items-center gap-3">
                          <Bell size={20} className="text-amber-600" />
                          <div>
                            <p className="font-medium text-stone-800">
                              Notifications
                            </p>
                            <p className="text-sm text-stone-500">
                              Receive email notifications
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.notifications}
                            onChange={(e) =>
                              setPreferences((prev) => ({
                                ...prev,
                                notifications: e.target.checked,
                              }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <Globe size={20} className="text-amber-600" />
                          <div>
                            <p className="font-medium text-stone-800">
                              Language
                            </p>
                            <p className="text-sm text-stone-500">
                              Select your preferred language
                            </p>
                          </div>
                        </div>
                        <select
                          value={preferences.language}
                          onChange={(e) =>
                            setPreferences((prev) => ({
                              ...prev,
                              language: e.target.value,
                            }))
                          }
                          className="px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                        </select>
                      </div>

                      <button
                        onClick={handlePreferenceUpdate}
                        disabled={loading}
                        className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? "Saving..." : "Save Preferences"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;