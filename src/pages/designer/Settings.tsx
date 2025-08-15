import React, { useState, useEffect } from "react";
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
import Button from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import { useSettingsStore } from "../../store/useSettingsStore";
import Spinner from "../../components/ui/Spinner";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id: string;
}

const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, id }) => {
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

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const isTabsList = (
    child: React.ReactNode
  ): child is React.ReactElement<TabsListProps> =>
    React.isValidElement(child) && child.type === TabsList;

  const isTabsTrigger = (
    child: React.ReactNode
  ): child is React.ReactElement<TabsTriggerProps> =>
    React.isValidElement(child) && child.type === TabsTrigger;

  return (
    <div>
      {React.Children.map(children, (child) => {
        if (isTabsList(child)) {
          return React.cloneElement(child, {
            children: React.Children.map(child.props.children, (trigger) => {
              if (isTabsTrigger(trigger)) {
                return React.cloneElement(trigger, {
                  onClick: () => setActiveTab(trigger.props.value),
                  active: activeTab === trigger.props.value,
                } as Partial<TabsTriggerProps>);
              }
              return trigger;
            }),
          } as Partial<TabsListProps>);
        }
        return null;
      })}
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement(child) &&
          (child.props as { value?: string }).value === activeTab
        ) {
          return child;
        }
        return null;
      })}
    </div>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

const TabsList: React.FC<TabsListProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`flex items-center justify-center p-1 bg-gray-100 rounded-md ${className}`}
    >
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  onClick?: () => void;
  active?: boolean;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  children,
  onClick,
  active,
}) => {
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

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

const TabsContent: React.FC<TabsContentProps> = ({
  children,
  className = "",
}) => {
  return <div className={className}>{children}</div>;
};

export default function SettingsPage() {
  const {
    user,
    fetchSettings,
    updateProfile,
    updateNotifications,
    updatePreferences,
    updatePassword,
    updateProfileImage,
    isLoading,
    isUpdating,
    error,
  } = useSettingsStore();

  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    bio: string;
    website: string;
  }>({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    website: "",
  });

  const [notifications, setNotifications] = useState<{
    emailNotifications: boolean;
    pushNotifications: boolean;
    projectDeadlines: boolean;
    clientMessages: boolean;
    paymentReminders: boolean;
    marketingEmails: boolean;
  }>({
    emailNotifications: false,
    pushNotifications: false,
    projectDeadlines: false,
    clientMessages: false,
    paymentReminders: false,
    marketingEmails: false,
  });

  const [preferences, setPreferences] = useState<{
    theme: string;
    language: string;
    timezone: string;
    currency: string;
    measurementUnit: string;
    defaultProjectDuration: string;
  }>({
    theme: "light",
    language: "en",
    timezone: "America/New_York",
    currency: "USD",
    measurementUnit: "inches",
    defaultProjectDuration: "14",
  });

  const [passwordFields, setPasswordFields] = useState<{
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (user) {
      setProfile({
        name: `${user.firstName} ${user.lastName || ""}`,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
        website: user.website || "",
      });

      setNotifications({
        emailNotifications: user.settings?.emailNotifications ?? false,
        pushNotifications: user.settings?.pushNotifications ?? false,
        projectDeadlines: user.settings?.projectDeadlines ?? false,
        clientMessages: user.settings?.clientMessages ?? false,
        paymentReminders: user.settings?.paymentReminders ?? false,
        marketingEmails: user.settings?.marketingEmails ?? false,
      });

      setPreferences({
        theme: user.settings?.theme ?? "light",
        language: user.settings?.language ?? "en",
        timezone: user.settings?.timezone ?? "America/New_York",
        currency: user.settings?.currency ?? "USD",
        measurementUnit: user.settings?.measurementUnit ?? "inches",
        defaultProjectDuration: user.settings?.defaultProjectDuration ?? "14",
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    const [firstName, ...lastNameParts] = profile.name.split(" ");
    const lastName = lastNameParts.join(" ") || "";
    await updateProfile({
      firstName,
      lastName,
      email: profile.email,
      address: profile.address,
      bio: profile.bio,
      website: profile.website,
      phone: profile.phone,
    });
  };

  const handleSaveNotifications = async () => {
    await updateNotifications(notifications);
  };

  const handleSavePreferences = async () => {
    await updatePreferences(preferences);
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

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p className="text-lg">Error: {error}</p>
        <p className="text-sm">Please try again later or contact support.</p>
      </div>
    );
  }

  if (!user) {
    return null;
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
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    className="p-1 px-2 border border-gray-300 rounded-md text-black/80"
                    value={profile.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    className="p-1 px-2 border border-gray-300 rounded-md text-black/80"
                    value={profile.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    className="p-1 px-2 border border-gray-300 rounded-md text-black/80"
                    value={profile.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    className="p-1 px-2 border border-gray-300 rounded-md text-black/80"
                    id="website"
                    value={profile.website}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProfile({ ...profile, website: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2 flex flex-col">
                <Label htmlFor="address">Business Address</Label>
                <Input
                  id="address"
                  className="p-1 px-2 border border-gray-300 rounded-md text-black/80"
                  value={profile.address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  className="p-1 px-2 border border-gray-300 rounded-md text-black/80"
                  value={profile.bio}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={isUpdating}
                className="bg-purple-600 text-white hover:bg-purple-700 py-2 px-6 rounded-md"
              >
                {isUpdating ? <Spinner /> : "Save Profile Changes"}
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
                    className="border border-gray-300 text-gray-700 hover:bg-gray-100 py-2 px-6 rounded-md"
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Spinner /> : "Upload New Picture"}
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

              <Button
                onClick={handleSaveNotifications}
                disabled={isUpdating}
                className="bg-purple-600 text-white hover:bg-purple-700 py-2 px-6 rounded-md"
              >
                {isUpdating ? <Spinner /> : "Save Notification Settings"}
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
                      <SelectItem value="cm">Centimeters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 flex flex-col">
                  <Label htmlFor="default-duration">
                    Default Project Duration (days)
                  </Label>
                  <Input
                    id="default-duration"
                    type="number"
                    className="p-1 px-2 border border-gray-300 rounded-md text-black/80"
                    value={preferences.defaultProjectDuration}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPreferences({
                        ...preferences,
                        defaultProjectDuration: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <Button
                onClick={handleSavePreferences}
                disabled={isUpdating}
                className="bg-purple-600 text-white hover:bg-purple-700 py-2 px-6 rounded-md"
              >
                {isUpdating ? <Spinner /> : "Save Preferences"}
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
                    {user?.plan === "premium" ? "Premium Plan" : "Free Plan"}
                  </h3>
                  <p className="text-sm text-purple-700">
                    {user?.plan === "premium"
                      ? "Unlimited clients, projects, and AI generations"
                      : "Limited features for free users."}
                  </p>
                  {user?.isSubActive && (
                    <Badge className="bg-green-100 text-green-700 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
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
                  <Button className="border border-gray-300 text-gray-700 hover:bg-gray-100">
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
                        <Badge className="text-green-600 border-green-600 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border border-current text-current">
                          {invoice.status}
                        </Badge>
                        <Button className="border border-gray-300 text-gray-700 hover:bg-gray-100">
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPasswordFields({
                          ...passwordFields,
                          confirmNewPassword: e.target.value,
                        })
                      }
                    />
                    <Button
                      onClick={handleUpdatePassword}
                      disabled={isUpdating}
                      className="bg-purple-600 text-white hover:bg-purple-700"
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
                    <Button className="border border-gray-300 text-gray-700 hover:bg-gray-100">
                      Enable 2FA
                    </Button>
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
                      <Badge className="text-green-600 border-green-600 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border border-current text-current">
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
                  <Button className="border border-gray-300 text-gray-700 hover:bg-gray-100">
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
                  <Button className="border border-gray-300 text-gray-700 hover:bg-gray-100">
                    Create Manual Backup
                  </Button>
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
                      <Button className="bg-red-600 text-white hover:bg-red-700">
                        Delete All Data
                      </Button>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Close your account and delete all associated data.
                      </p>
                      <Button className="bg-red-600 text-white hover:bg-red-700">
                        Delete Account
                      </Button>
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
