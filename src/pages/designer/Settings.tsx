import { useState, useEffect } from "react";
import {
  FaUser,
  FaBell,
  FaPalette,
  FaDatabase,
  FaCreditCard,
  FaShieldAlt,
  FaDownload,
} from "react-icons/fa";
import { toast } from "sonner";
import { useSettingsStore } from "../../store/useSettingsStore";

// --- Custom Components with Correct Styling ---

// Button component with explicit variants
const Button = ({
  children,
  onClick,
  disabled,
  variant = "primary",
  className = "",
  ...props
}) => {
  let styles = "py-2 px-4 rounded-md font-semibold transition-colors";
  if (variant === "primary") {
    styles += " bg-purple-600 text-white hover:bg-purple-700";
  } else if (variant === "outline") {
    styles += " border border-gray-300 text-gray-700 hover:bg-gray-100";
  } else if (variant === "destructive") {
    styles += " bg-red-600 text-white hover:bg-red-700";
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Badge component with explicit variants
const Badge = ({ children, variant = "default", className = "", ...props }) => {
  let styles =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  if (variant === "default") {
    styles += " bg-gray-100 text-gray-800";
  } else if (variant === "outline") {
    styles += " border border-current text-current";
  }
  return (
    <span className={`${styles} ${className}`} {...props}>
      {children}
    </span>
  );
};

// Custom Switch Component
const Switch = ({ checked, onCheckedChange, id }) => {
  return (
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={() => onCheckedChange(!checked)}
        />
        <div
          className={`block w-14 h-8 rounded-full transition-colors ${
            checked ? "bg-purple-600" : "bg-gray-600"
          }`}
        ></div>
        <div
          className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform ${
            checked ? "translate-x-full" : ""
          }`}
        ></div>
      </div>
    </label>
  );
};

// Custom Tabs Components (as provided, no changes needed)
const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <div>
      {children.map((child) => {
        if (child.type === TabsList) {
          return (
            <TabsList key="tab-list">
              {child.props.children.map((trigger) => {
                const value = trigger.props.value;
                return (
                  <TabsTrigger
                    key={value}
                    value={value}
                    onClick={() => setActiveTab(value)}
                    active={activeTab === value}
                  >
                    {trigger.props.children}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          );
        }
        return null;
      })}
      {children.map((child) => {
        if (child.type === TabsContent && child.props.value === activeTab) {
          return child;
        }
        return null;
      })}
    </div>
  );
};

const TabsList = ({ children, className }) => {
  return (
    <div
      className={`flex items-center justify-center p-1 bg-gray-100 rounded-md ${className}`}
    >
      {children}
    </div>
  );
};

const TabsTrigger = ({ children, value, onClick, active }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition-colors rounded-sm focus:outline-none ${
        active ? "bg-white text-gray-900 shadow" : "text-gray-600"
      }`}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, className }) => {
  return <div className={className}>{children}</div>;
};

// UI Components (assuming these are from your component library, e.g., Shadcn/UI)
// No changes here, assuming they are imported correctly.
const Card = ({ children }) => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
    {children}
  </div>
);
const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);
const CardDescription = ({ children }) => (
  <p className="text-sm text-muted-foreground">{children}</p>
);
const CardHeader = ({ children }) => (
  <div className="flex flex-col space-y-1.5 p-6">{children}</div>
);
const CardTitle = ({ children, className = "" }) => (
  <h3
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
  >
    {children}
  </h3>
);
const Input = ({ ...props }) => (
  <input
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    {...props}
  />
);
const Label = ({ children, ...props }) => (
  <label
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    {...props}
  >
    {children}
  </label>
);
const Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <SelectTrigger onClick={() => setOpen(!open)}>
        {children[0]}
      </SelectTrigger>
      {open && <SelectContent>{children[1]}</SelectContent>}
    </div>
  );
};
const SelectContent = ({ children }) => (
  <div className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
    {children}
  </div>
);
const SelectItem = ({ children, value, onClick }) => (
  <div
    onClick={onClick}
    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
  >
    {children}
  </div>
);
const SelectTrigger = ({ children, ...props }) => (
  <div
    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    {...props}
  >
    {children}
  </div>
);
const SelectValue = () => <span className="text-gray-900"></span>;
const Textarea = ({ ...props }) => (
  <textarea
    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    {...props}
  ></textarea>
);

export default function SettingsPage() {
  const {
    user,
    fetchSettings,
    updateProfileInfo,
    updatePassword,
    updateProfileImage,
    isLoading,
    isUpdating,
  } = useSettingsStore();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    website: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: false,
    pushNotifications: false,
    projectDeadlines: false,
    clientMessages: false,
    paymentReminders: false,
    marketingEmails: false,
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    timezone: "America/New_York",
    currency: "USD",
    measurementUnit: "inches",
    defaultProjectDuration: "14",
  });

  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Fetch user data from the store on component mount
  useEffect(() => {
    if (!user) {
      fetchSettings();
    }
  }, [user, fetchSettings]);

  // Update local state when the store's user object changes
  useEffect(() => {
    if (user) {
      setProfile({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: "", // Assuming this field is not in the current user data
        address: user.address || "",
        bio: user.bio || "",
        website: user.website || "",
      });

      setNotifications({
        emailNotifications: user.settings.emailNotifications,
        pushNotifications: user.settings.pushNotifications,
        projectDeadlines: user.settings.projectDeadlines,
        clientMessages: user.settings.clientMessages,
        paymentReminders: user.settings.paymentReminders,
        marketingEmails: user.settings.marketingEmails,
      });

      setPreferences({
        theme: user.settings.theme,
        language: user.settings.language,
        timezone: user.settings.timezone,
        currency: user.settings.currency,
        measurementUnit: user.settings.measurementUnit,
        defaultProjectDuration: user.settings.defaultProjectDuration,
      });
    }
  }, [user]);

  // Handle save actions
  const handleSaveProfile = async () => {
    const [firstName, ...lastNameParts] = profile.name.split(" ");
    const lastName = lastNameParts.join(" ") || "";
    await updateProfileInfo({
      firstName,
      lastName,
      email: profile.email,
      address: profile.address,
      bio: profile.bio,
      website: profile.website,
    });
  };

  const handleSaveNotifications = async () => {
    await updateProfileInfo({}, notifications);
  };

  const handleSavePreferences = async () => {
    await updateProfileInfo({}, preferences);
  };

  const handleUpdatePassword = async () => {
    const { currentPassword, newPassword, confirmNewPassword } = passwordFields;
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    await updatePassword(currentPassword, newPassword);
    setPasswordFields({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  const handleProfileImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await updateProfileImage(file);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-gray-700">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage your account and application preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaUser className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal and business information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) =>
                      setProfile({ ...profile, website: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <Button onClick={handleSaveProfile} disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Profile Changes"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Upload a professional photo for your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 overflow-hidden rounded-full flex items-center justify-center bg-purple-100">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="h-10 w-10 text-purple-600" />
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageUpload}
                  />
                  <Button
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                    variant="outline"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Uploading..." : "Upload New Picture"}
                  </Button>
                  <p className="text-sm text-gray-600">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaBell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about important events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications({
                        ...notifications,
                        emailNotifications: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications({
                        ...notifications,
                        pushNotifications: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="project-deadlines">Project Deadlines</Label>
                    <p className="text-sm text-gray-600">
                      Get reminded about upcoming project deadlines
                    </p>
                  </div>
                  <Switch
                    id="project-deadlines"
                    checked={notifications.projectDeadlines}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications({
                        ...notifications,
                        projectDeadlines: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="client-messages">Client Messages</Label>
                    <p className="text-sm text-gray-600">
                      Notifications for new client messages
                    </p>
                  </div>
                  <Switch
                    id="client-messages"
                    checked={notifications.clientMessages}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications({
                        ...notifications,
                        clientMessages: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="payment-reminders">Payment Reminders</Label>
                    <p className="text-sm text-gray-600">
                      Reminders for overdue payments
                    </p>
                  </div>
                  <Switch
                    id="payment-reminders"
                    checked={notifications.paymentReminders}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications({
                        ...notifications,
                        paymentReminders: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-gray-600">
                      Receive updates about new features and tips
                    </p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked: boolean) =>
                      setNotifications({
                        ...notifications,
                        marketingEmails: checked,
                      })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications} disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Notification Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaPalette className="h-5 w-5" />
                Application Preferences
              </CardTitle>
              <CardDescription>
                Customize your application experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value: string) =>
                      setPreferences({ ...preferences, theme: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value: string) =>
                      setPreferences({ ...preferences, language: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value: string) =>
                      setPreferences({ ...preferences, timezone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern Time
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={preferences.currency}
                    onValueChange={(value: string) =>
                      setPreferences({ ...preferences, currency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="measurement-unit">Measurement Unit</Label>
                  <Select
                    value={preferences.measurementUnit}
                    onValueChange={(value: string) =>
                      setPreferences({ ...preferences, measurementUnit: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inches">Inches</SelectItem>
                      <SelectItem value="centimeters">Centimeters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-duration">
                    Default Project Duration (days)
                  </Label>
                  <Input
                    id="default-duration"
                    type="number"
                    value={preferences.defaultProjectDuration}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        defaultProjectDuration: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSavePreferences} disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaCreditCard className="h-5 w-5" />
                Subscription & Billing
              </CardTitle>
              <CardDescription>
                Manage your subscription and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-purple-900">
                    {user?.plan} Plan
                  </h3>
                  <p className="text-sm text-purple-700">
                    {user?.plan === "Premium"
                      ? "Unlimited clients, projects, and AI generations"
                      : "Free trial active until ..."}
                  </p>
                  {user?.isSubActive && (
                    <Badge className="bg-green-100 text-green-700">
                      Active
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-900">$49</div>
                  <div className="text-sm text-purple-700">per month</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Payment Method</h4>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      VISA
                    </div>
                    <div>
                      <div className="font-medium">•••• •••• •••• 4242</div>
                      <div className="text-sm text-gray-600">Expires 12/25</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Billing History</h4>
                <div className="space-y-2">
                  {[
                    { date: "Jan 1, 2024", amount: "$49.00", status: "Paid" },
                    { date: "Dec 1, 2023", amount: "$49.00", status: "Paid" },
                    { date: "Nov 1, 2023", amount: "$49.00", status: "Paid" },
                  ].map((invoice, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{invoice.date}</div>
                        <div className="text-sm text-gray-600">
                          Premium Plan
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{invoice.amount}</div>
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          {invoice.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <FaDownload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaShieldAlt className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Change Password</h4>
                  <div className="space-y-3">
                    <Input
                      type="password"
                      placeholder="Current password"
                      value={passwordFields.currentPassword}
                      onChange={(e) =>
                        setPasswordFields({
                          ...passwordFields,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                    <Input
                      type="password"
                      placeholder="New password"
                      value={passwordFields.newPassword}
                      onChange={(e) =>
                        setPasswordFields({
                          ...passwordFields,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={passwordFields.confirmNewPassword}
                      onChange={(e) =>
                        setPasswordFields({
                          ...passwordFields,
                          confirmNewPassword: e.target.value,
                        })
                      }
                    />
                    <Button
                      onClick={handleUpdatePassword}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">
                    Two-Factor Authentication
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Active Sessions</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Current Session</div>
                        <div className="text-sm text-gray-600">
                          Chrome on MacOS • New York, NY
                        </div>
                      </div>
                      <Badge
                        className="text-green-600 border-green-600"
                        variant="outline"
                      >
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaDatabase className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Export, backup, or delete your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Export Data</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Download a copy of all your data including clients,
                    projects, and patterns.
                  </p>
                  <Button variant="outline">
                    <FaDownload className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Data Backup</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Your data is automatically backed up daily. Last backup:
                    Today at 3:00 AM
                  </p>
                  <Button variant="outline">Create Manual Backup</Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 text-red-600">
                    Danger Zone
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Delete all data permanently. This action cannot be
                        undone.
                      </p>
                      <Button variant="destructive">Delete All Data</Button>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Close your account and delete all associated data.
                      </p>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
