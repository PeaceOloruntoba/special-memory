"use client";

import { useState, useEffect } from "react";
import { useAnalyticsStore } from "../../store/useAnalytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { useAuthStore } from "../../store/useAuthStore"; // Import useAuthStore

// Reverted to react-icons/bi imports as requested
import {
  BiAward,
  BiDollar,
  BiTargetLock,
  BiTime,
  BiTrendingDown,
  BiTrendingUp,
  BiUser,
} from "react-icons/bi";

// Custom ProgressBar Component
interface ProgressBarProps {
  value: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, className = "" }) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  return (
    <div
      className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}
    >
      <div
        className="h-full bg-black/90 transition-all duration-300 ease-in-out"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};

// Custom TabBar Component
interface TabBarProps {
  defaultValue: string;
  tabs: { value: string; label: string }[];
  children: React.ReactNode[];
}

const TabBar: React.FC<TabBarProps> = ({ defaultValue, tabs, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className="space-y-6">
      <div className="bg-gray-100 rounded-full p-1 flex justify-between">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              activeTab === tab.value
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children.map((child, index) => (
        <div
          key={tabs[index].value}
          className={`space-y-6 ${
            activeTab === tabs[index].value ? "block" : "hidden"
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const { analyticsData, isLoading, error, fetchAnalytics } =
    useAnalyticsStore();
  console.log(analyticsData);
  const { user } = useAuthStore(); // Get user from auth store to control data fetching
  const [timePeriod, setTimePeriod] = useState("6months"); // Default to 6 months as per original UI

  // Frontend mock data for Efficiency Metrics (since backend doesn't provide them)
  //   const efficiencyMetricsMock = {
  //     timeEfficiencyByProjectType: [
  //       { type: "Wedding Dress", avgHours: 45, efficiencyScore: 92 },
  //       { type: "Business Suit", avgHours: 28, efficiencyScore: 88 },
  //       { type: "Casual Dress", avgHours: 18, efficiencyScore: 95 },
  //       { type: "Evening Gown", avgHours: 35, efficiencyScore: 85 },
  //     ],
  //     resourceUtilization: {
  //       overall: 78,
  //       peak: 95,
  //       offPeak: 45,
  //     },
  //     qualityMetrics: {
  //       avgClientRating: 4.8,
  //       avgRevisions: 1.2,
  //       firstFitSuccessRate: 96,
  //     },
  //   };

  // Fetch data when component mounts or timePeriod/user changes
  useEffect(() => {
    if (user) {
      // Only fetch if user is authenticated
      fetchAnalytics(timePeriod);
    }
  }, [timePeriod, fetchAnalytics, user]);

  // Helper functions for formatting and displaying changes
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentageChange = (change: number) => {
    if (change === 0) return "0%";
    const sign = change > 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
  };

  const getTrendingIcon = (change: number) => {
    if (change > 0) return <BiTrendingUp className="h-3 w-3 mr-1" />;
    if (change < 0) return <BiTrendingDown className="h-3 w-3 mr-1" />;
    return null; // Or a neutral icon if change is 0
  };

  const getTrendingTextColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  if (isLoading && !analyticsData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
          <p className="text-xl text-gray-700">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error && !analyticsData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 min-h-screen">
        <p className="text-xl text-red-500 mb-4">Error: {error}</p>
        <button
          className="bg-black/90 text-white hover:bg-black/80 px-4 py-2 rounded-md cursor-pointer"
          onClick={() => fetchAnalytics(timePeriod)}
        >
          Retry
        </button>
      </div>
    );
  }

  // If no data is available after loading (e.g., empty state or initial fetch failed)
  if (!analyticsData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4 min-h-screen">
        <p className="text-xl text-gray-700">
          No analytics data available for this period. Try selecting a different
          period.
        </p>
      </div>
    );
  }

  // Destructure analyticsData directly as it's guaranteed to be not null here
  const { keyMetrics, revenueAnalysis, clientInsights, projectPerformance } =
    analyticsData;

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Track your business performance and insights
          </p>
        </div>
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BiDollar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(keyMetrics.totalRevenue)}
            </div>
            <div
              className={`flex items-center text-xs ${getTrendingTextColor(
                keyMetrics.totalRevenueChange
              )}`}
            >
              {getTrendingIcon(keyMetrics.totalRevenueChange)}
              {formatPercentageChange(keyMetrics.totalRevenueChange)} from last
              period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Clients
            </CardTitle>
            <BiUser className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keyMetrics.activeClients}</div>
            <div
              className={`flex items-center text-xs ${getTrendingTextColor(
                keyMetrics.activeClientsChange
              )}`}
            >
              {getTrendingIcon(keyMetrics.activeClientsChange)}
              {formatPercentageChange(keyMetrics.activeClientsChange)} from last
              period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projects Completed
            </CardTitle>
            <BiTargetLock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {keyMetrics.projectsCompleted}
            </div>
            <div
              className={`flex items-center text-xs ${getTrendingTextColor(
                keyMetrics.projectsCompletedChange
              )}`}
            >
              {getTrendingIcon(keyMetrics.projectsCompletedChange)}
              {formatPercentageChange(keyMetrics.projectsCompletedChange)} from
              last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Project Value
            </CardTitle>
            <BiAward className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(keyMetrics.avgProjectValue)}
            </div>
            <div
              className={`flex items-center text-xs ${getTrendingTextColor(
                keyMetrics.avgProjectValueChange
              )}`}
            >
              {getTrendingIcon(keyMetrics.avgProjectValueChange)}
              {formatPercentageChange(keyMetrics.avgProjectValueChange)} from
              last period
            </div>
          </CardContent>
        </Card>
      </div>

      <TabBar
        defaultValue="revenue"
        tabs={[
          { value: "revenue", label: "Revenue Analysis" },
          { value: "clients", label: "Client Insights" },
          { value: "projects", label: "Project Performance" },
          //   { value: "efficiency", label: "Efficiency Metrics" },
        ]}
      >
        {/* Revenue Analysis */}
        <div className="flex flex-col space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>
                  Revenue over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueAnalysis.monthlyTrend.length > 0 ? (
                    revenueAnalysis.monthlyTrend.map((data: any) => (
                      <div
                        key={`${data.month}-${data.year}`}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-16 text-sm font-medium">
                            {data.month} {data.year % 100}
                          </div>
                          <div className="flex-1">
                            <ProgressBar
                              value={
                                (data.revenue /
                                  Math.max(
                                    ...revenueAnalysis.monthlyTrend.map(
                                      (d: any) => d.revenue
                                    )
                                  )) *
                                100
                              }
                              className="h-2"
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex flex-col items-end text-black/90">
                            <span className="text-sm font-medium">
                              {formatCurrency(data.revenue)}
                            </span>
                            <span className="text-xs text-black/70">
                              {data.projectsCount} project
                              {data.projectsCount !== 1 ||
                              data.projectsCount !== 0
                                ? ""
                                : "s"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center">
                      No monthly revenue data available.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service Type</CardTitle>
                <CardDescription>
                  Breakdown of revenue by project type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueAnalysis.byServiceType.length > 0 ? (
                    revenueAnalysis.byServiceType.map((type: any) => (
                      <div key={type.type} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{type.type}</span>
                            <Badge className="border border-gray-300 bg-white text-gray-700 px-2 py-1 rounded-full text-xs">
                              {type.count} project
                              {type.count !== 1 || type.count !== 0 ? "" : "s"}
                            </Badge>
                          </div>
                          <span className="font-medium">
                            {formatCurrency(type.revenue)}
                          </span>
                        </div>
                        <ProgressBar value={type.percentage} className="h-2" />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center">
                      No revenue by service type data available.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Goals</CardTitle>
              <CardDescription>
                Track progress towards targets (This data is mocked on frontend)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Monthly Goal</span>
                    <span className="text-sm text-gray-600">
                      $8,400 / $10,000
                    </span>
                  </div>
                  <ProgressBar value={84} className="h-3" />
                  <p className="text-xs text-gray-600">
                    84% of monthly target achieved
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Yearly Goal</span>
                    <span className="text-sm text-gray-600">
                      $73,500 / $120,000
                    </span>
                  </div>
                  <ProgressBar value={61} className="h-3" />
                  <p className="text-xs text-gray-600">
                    61% of yearly target achieved
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Insights */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Acquisition</CardTitle>
                <CardDescription>
                  New clients acquired and project average
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <div className="text-2xl font-bold text-green-700">
                        {clientInsights.newClientsThisPeriod}
                      </div>
                      <div className="text-sm text-green-600">
                        New clients this period
                      </div>
                    </div>
                    <BiTrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold">
                        {clientInsights.avgProjectsPerClient.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-600">
                        Avg. projects per client
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold">
                        {/* Client retention is complex and will remain mocked for now or removed if not needed */}
                        92%{" "}
                        {/* Mocked on frontend, as complex backend tracking is needed */}
                      </div>
                      <div className="text-xs text-gray-600">
                        Client retention rate {/* Mocked on frontend */}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Clients</CardTitle>
                <CardDescription>
                  Clients by total project value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clientInsights.topClients.length > 0 ? (
                    clientInsights.topClients.map((client: any, index: any) => (
                      <div
                        key={client.id || index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-700">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-sm text-gray-600">
                              {client.projects} project
                              {client.projects !== 1 || client.projects !== 0
                                ? ""
                                : "s"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatCurrency(client.value)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center">
                      No top clients data available for this period.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Project Performance */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
                <CardDescription>
                  Current status of all projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectPerformance.statusDistribution.length > 0 ? (
                    projectPerformance.statusDistribution.map((status: any) => (
                      <div key={status.status} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{status.status}</span>
                          <span className="text-sm text-gray-600">
                            {status.count} projects
                          </span>
                        </div>
                        <ProgressBar
                          value={status.percentage}
                          className="h-2"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center">
                      No project status data available.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Timeline Performance</CardTitle>
                <CardDescription>On-time delivery statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <div className="text-2xl font-bold text-green-700">
                        {projectPerformance.timelinePerformance.onTimeDeliveryRate.toFixed(
                          1
                        )}
                        %
                      </div>
                      <div className="text-sm text-green-600">
                        On-time delivery rate
                      </div>
                    </div>
                    <BiTime className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold">
                        {projectPerformance.timelinePerformance.avgDaysToComplete.toFixed(
                          1
                        )}
                      </div>
                      <div className="text-xs text-gray-600">
                        Avg. days to complete
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold">
                        {projectPerformance.timelinePerformance.projectsDelayed}
                      </div>
                      <div className="text-xs text-gray-600">
                        Projects delayed
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Efficiency Metrics */}
        {/* <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Time Efficiency</CardTitle>
                <CardDescription>
                  Average time spent per project type (Mock Data)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {efficiencyMetricsMock.timeEfficiencyByProjectType.map(
                    (item) => (
                      <div key={item.type} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {item.type}
                          </span>
                          <span className="text-sm text-gray-600">
                            {item.avgHours}h avg
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ProgressBar
                            value={item.efficiencyScore}
                            className="h-2 flex-1"
                          />
                          <span className="text-xs text-gray-600">
                            {item.efficiencyScore}%
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>
                  Studio and equipment usage (Mock Data)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">
                      {efficiencyMetricsMock.resourceUtilization.overall}%
                    </div>
                    <div className="text-sm text-blue-600">
                      Studio utilization
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Peak hours (2-6 PM)</span>
                      <span>
                        {efficiencyMetricsMock.resourceUtilization.peak}%
                      </span>
                    </div>
                    <ProgressBar
                      value={efficiencyMetricsMock.resourceUtilization.peak}
                      className="h-2"
                    />
                    <div className="flex justify-between text-sm">
                      <span>Off-peak hours</span>
                      <span>
                        {efficiencyMetricsMock.resourceUtilization.offPeak}%
                      </span>
                    </div>
                    <ProgressBar
                      value={efficiencyMetricsMock.resourceUtilization.offPeak}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>
                  Client satisfaction and revisions (Mock Data)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">
                      {efficiencyMetricsMock.qualityMetrics.avgClientRating}
                    </div>
                    <div className="text-sm text-purple-600">
                      Avg. client rating
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold">
                        {efficiencyMetricsMock.qualityMetrics.avgRevisions}
                      </div>
                      <div className="text-xs text-gray-600">
                        Avg. revisions
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold">
                        {
                          efficiencyMetricsMock.qualityMetrics
                            .firstFitSuccessRate
                        }
                        %
                      </div>
                      <div className="text-xs text-gray-600">
                        First-fit success
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div> */}
      </TabBar>
    </div>
  );
}
