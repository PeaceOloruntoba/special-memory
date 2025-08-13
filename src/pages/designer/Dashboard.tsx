import { useEffect } from "react";

import { FiUsers, FiTrendingUp, FiPlus, FiFileText } from "react-icons/fi";
import { IoSparklesOutline } from "react-icons/io5";
import { LuPalette } from "react-icons/lu";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/Card";

import { useDashboardStore } from "../../store/useDashboardStore";
import { useAuthStore } from "../../store/useAuthStore";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { BiCalendar } from "react-icons/bi";

export default function Dashboard() {
  const { stats, isLoading, error, fetchDashboardStats } = useDashboardStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user && (!stats || error) && !isLoading) {
      fetchDashboardStats();
    }
  }, [user, stats, isLoading, error, fetchDashboardStats]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    if (percentage === 0) return "0%";
    const sign = percentage > 0 ? "+" : "";
    return `${sign}${percentage.toFixed(0)}%`;
  };

  if (isLoading && !stats) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Spinner /> {/* Spinner used without className prop */}
          <p className="text-xl text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 min-h-screen">
        <p className="text-xl text-red-500 mb-4">Error: {error}</p>
        <Button
          onClick={fetchDashboardStats}
          className="bg-purple-600 text-white hover:bg-purple-700 h-10 px-4 py-2 rounded-md font-medium"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 min-h-screen">
        <p className="text-xl text-gray-700 mb-4">
          No dashboard data available. Please try again.
        </p>
        <Button
          onClick={fetchDashboardStats}
          className="bg-purple-600 text-white hover:bg-purple-700 h-10 px-4 py-2 rounded-md font-medium"
        >
          Fetch Data
        </Button>
      </div>
    );
  }

  const activeClientsChangeText =
    stats.activeClients.changeFromLastMonth > 0
      ? `+${stats.activeClients.changeFromLastMonth} from last month`
      : stats.activeClients.changeFromLastMonth < 0
      ? `${stats.activeClients.changeFromLastMonth} from last month`
      : "No change from last month";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex-1">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Kunibi Fashion Studio
          </h1>
          <p className="text-gray-600">
            Your complete productivity platform for fashion design business
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Active Clients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Active Clients
              </CardTitle>
              <FiUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {stats.activeClients.currentMonthCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {activeClientsChangeText}
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Active Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Active Projects
              </CardTitle>
              <LuPalette className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {stats.activeProjects}
              </div>
              <p className="text-xs text-muted-foreground">3 due this week</p>{" "}
              {/* Example static text */}
            </CardContent>
          </Card>

          {/* Card 3: Patterns Created */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Patterns Created
              </CardTitle>
              <IoSparklesOutline className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {stats.patternsCreated}
              </div>
              <p className="text-xs text-muted-foreground">+12 this week</p>{" "}
              {/* Example static text */}
            </CardContent>
          </Card>

          {/* Card 4: Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Revenue
              </CardTitle>
              <FiTrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {formatCurrency(stats.revenue.currentMonth)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatPercentage(stats.revenue.changePercentage)} from last
                month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Action Card 1: Client Management */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex text-card-foreground items-center gap-2">
                <FiUsers className="h-5 w-5 text-blue-600" />
                Client Management
              </CardTitle>
              <CardDescription>
                Manage client information, measurements, and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="/clients">
                <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
                  <FiPlus className="h-4 w-4 mr-2" />
                  Add New Client
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Action Card 2: Pattern Designer */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex text-card-foreground items-center gap-2">
                <LuPalette className="h-5 w-5 text-purple-600" />
                Pattern Designer
              </CardTitle>
              <CardDescription>
                Create and edit patterns with our advanced design tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="/patterns">
                <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
                  <FiPlus className="h-4 w-4 mr-2" />
                  New Pattern
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Action Card 3: AI Pattern Generator */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex text-card-foreground items-center gap-2">
                <IoSparklesOutline className="h-5 w-5 text-pink-600" />
                AI Pattern Generator
              </CardTitle>
              <CardDescription>
                Generate patterns using AI based on your specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="/ai-patterns">
                <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
                  <IoSparklesOutline className="h-4 w-4 mr-2" />
                  Generate Pattern
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Upcoming Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex text-card-foreground items-center gap-2">
                <BiCalendar className="h-5 w-5 text-muted-foreground" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-card-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recent activity.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex text-card-foreground items-center gap-2">
                <FiFileText className="h-5 w-5 text-muted-foreground" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.upcomingDeadlines.length > 0 ? (
                  stats.upcomingDeadlines.map((deadline) => (
                    <div
                      key={deadline.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        deadline.priority === "high"
                          ? "bg-red-50 text-red-800"
                          : deadline.priority === "medium"
                          ? "bg-yellow-50 text-yellow-800"
                          : "bg-green-50 text-green-800"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-card-foreground">
                          {deadline.title} - {deadline.clientName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due by{" "}
                          {new Date(deadline.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded ${
                          deadline.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : deadline.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {deadline.priority.charAt(0).toUpperCase() +
                          deadline.priority.slice(1)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No upcoming deadlines.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
