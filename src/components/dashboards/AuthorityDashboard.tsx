import {
  BarChart3,
  Users,
  MapPin,
  Trash2,
  Award,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import {
  authorityApi,
  type User,
  type Ward,
  type WasteCategory,
} from "@/services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import WardForm from "../addWard";
import WasteCategoryForm from "../addWasteCategories";

interface AuthorityDashboardProps {
  onLogout: () => void;
}

const AuthorityDashboard = ({ onLogout }: AuthorityDashboardProps) => {
  const { toast } = useToast();

  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [wasteCategories, setWasteCategories] = useState<WasteCategory[]>([]);
  const [dashboardData, setDashboardData] = useState<any>({
    wasteTrend: null,
    wasteByType: null,
    wasteByRegion: null,
    ecoPointsDistribution: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showWardForm, setShowWardForm] = useState(false);
  const [showWasteCategoryForm, setShowWasteCategoryForm] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          usersData,
          wardsData,
          wasteCategoriesData,
          wasteTrend,
          wasteByType,
          wasteByRegion,
          ecoPointsDistribution,
        ] = await Promise.all([
          authorityApi.listUsers(),
          authorityApi.listWards(),
          authorityApi.listWasteCategories(),
          authorityApi.getWasteTrend(),
          authorityApi.getWasteByType(),
          authorityApi.getWasteByRegion(),
          authorityApi.getEcoPointsDistribution(),
        ]);

        setUsers(usersData);
        setWards(wardsData);
        setWasteCategories(wasteCategoriesData);
        setDashboardData({
          wasteTrend,
          wasteByType,
          wasteByRegion,
          ecoPointsDistribution,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // User management functions
  const handleActivateUser = async (userId: string) => {
    try {
      const updatedUser = await authorityApi.activateUser(userId);
      setUsers(users.map((user) => (user.id === userId ? updatedUser : user)));
      toast({
        title: "Success",
        description: "User activated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to activate user",
        variant: "destructive",
      });
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      const updatedUser = await authorityApi.deactivateUser(userId);
      setUsers(users.map((user) => (user.id === userId ? updatedUser : user)));
      toast({
        title: "Success",
        description: "User deactivated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to deactivate user",
        variant: "destructive",
      });
    }
  };

  // Chart colors
  const COLORS = ["#115132", "#8fbc8f", "#228b22"];

  // Mock chart data (replace with real data from API)
  const chartData = {
    wasteByType: [
      { name: "Plastic", value: 30, amount: 150 },
      { name: "Paper", value: 25, amount: 120 },
      { name: "Glass", value: 20, amount: 80 },
      { name: "Metal", value: 15, amount: 60 },
      { name: "Organic", value: 10, amount: 40 },
    ],
    wasteTrend: [
      { month: "Jan", collected: 400, recycled: 380 },
      { month: "Feb", collected: 450, recycled: 420 },
      { month: "Mar", collected: 380, recycled: 360 },
      { month: "Apr", collected: 520, recycled: 480 },
      { month: "May", collected: 600, recycled: 570 },
      { month: "Jun", collected: 650, recycled: 620 },
    ],
    wardPerformance: [
      { ward: "Central Ward", collections: 45, efficiency: 94 },
      { ward: "North Ward", collections: 38, efficiency: 89 },
      { ward: "South Ward", collections: 52, efficiency: 96 },
      { ward: "East Ward", collections: 41, efficiency: 87 },
      { ward: "West Ward", collections: 48, efficiency: 92 },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <span className="ml-2 text-accent/70">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  const activeUsers = users.filter((user) => user.active);
  const monthlyWaste =
    chartData.wasteTrend[chartData.wasteTrend.length - 1]?.collected || 0;
  const totalEcoPoints = users.reduce(
    (sum, user) => sum + Math.random() * 0,
    0,
  ); // Mock calculation

  // Add this refresh function (or modify your existing fetchData function)
  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        usersData,
        wardsData,
        wasteCategoriesData,
        wasteTrend,
        wasteByType,
        wasteByRegion,
        ecoPointsDistribution,
      ] = await Promise.all([
        authorityApi.listUsers(),
        authorityApi.listWards(),
        authorityApi.listWasteCategories(),
        authorityApi.getWasteTrend(),
        authorityApi.getWasteByType(),
        authorityApi.getWasteByRegion(),
        authorityApi.getEcoPointsDistribution(),
      ]);

      setUsers(usersData);
      setWards(wardsData);
      setWasteCategories(wasteCategoriesData);
      setDashboardData({
        wasteTrend,
        wasteByType,
        wasteByRegion,
        ecoPointsDistribution,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold font-montserrat text-white">
              Authority Dashboard
            </h1>
            <p className="text-white/70">
              Monitor and analyze waste management operations
            </p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-primary"
          >
            Logout
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/90 backdrop-blur-sm border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-accent">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="text-accent w-5 h-5" />
                <span className="text-2xl font-bold text-accent">
                  {users.length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/90 backdrop-blur-sm border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-accent/70">
                Active Wards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MapPin className="text-accent w-5 h-5" />
                <span className="text-2xl font-bold text-accent">
                  {wards.length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/90 backdrop-blur-sm border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-accent/70">
                Monthly Waste (kg)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Trash2 className="text-accent w-5 h-5" />
                <span className="text-2xl font-bold text-accent">
                  {monthlyWaste}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/90 backdrop-blur-sm border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-accent/70">
                Eco-Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Award className="text-accent w-5 h-5" />
                <span className="text-2xl font-bold text-accent">
                  {Math.round(totalEcoPoints)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Waste Distribution Chart */}
            <Card className="bg-card/90 backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent font-montserrat">
                  <BarChart3 className="w-5 h-5" />
                  Waste Distribution by Category
                </CardTitle>
                <CardDescription>Current month breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.wasteByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.wasteByType.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Waste Collection Trends */}
            <Card className="bg-card/90 backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent font-montserrat">
                  <TrendingUp className="w-5 h-5" />
                  Waste Collection Trends
                </CardTitle>
                <CardDescription>
                  Monthly collection and recycling rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.wasteTrend}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#CDE253"
                      opacity={0.3}
                    />
                    <XAxis dataKey="month" stroke="#CDE253" />
                    <YAxis stroke="#CDE253" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#115132",
                        border: "1px solid #CDE253",
                        borderRadius: "8px",
                        color: "#CDE253",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="collected"
                      stroke="#CDE253"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="recycled"
                      stroke="#115132"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ward Performance Table */}
            <Card className="bg-card/90 backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle className="text-accent font-montserrat">
                  Ward Performance
                </CardTitle>
                <CardDescription>
                  Collection efficiency by region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.wardPerformance}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="black"
                      opacity={0.3}
                    />
                    <XAxis dataKey="ward" stroke="#CDE253" />
                    <YAxis stroke="black" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#115132",
                        border: "1px solid #CDE253",
                        borderRadius: "8px",
                        color: "#CDE253",
                      }}
                    />
                    <Bar dataKey="collections" fill="#CDE253" />
                    <Bar dataKey="efficiency" fill="#115132" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Management Panel */}
          <div className="space-y-6">
            <Card className="bg-card/90 backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle className="text-accent font-montserrat">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-primary font-montserrat"
                  variant="default"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button
                  className="w-full border-accent text-accent hover:bg-accent hover:text-primary"
                  variant="outline"
                  onClick={() => setShowWardForm(true)}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Add Ward
                </Button>
                <Button
                  className="w-full border-accent text-accent hover:bg-accent hover:text-primary"
                  variant="outline"
                  onClick={() => setShowWasteCategoryForm(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Add Waste Category
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/90 backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle className="text-accent font-montserrat">
                  Recent User Activity
                </CardTitle>
                <CardDescription>
                  Latest user registrations and status changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.slice(0, 5).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 border border-accent/20 rounded"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-accent text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-accent/70">{user.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={user.active ? "default" : "secondary"}
                          className={
                            user.active ? "bg-accent text-primary" : ""
                          }
                        >
                          {user.active ? "Active" : "Inactive"}
                        </Badge>
                        {user.active ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeactivateUser(user.id)}
                            className="text-xs border-accent/50 text-accent/70 hover:bg-accent hover:text-primary"
                          >
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleActivateUser(user.id)}
                            className="text-xs border-accent text-accent hover:bg-accent hover:text-primary"
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/90 backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle className="text-accent font-montserrat">
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-accent/70">API Status</span>
                    <span className="font-medium text-accent">Online</span>
                  </div>
                  <div className="w-full bg-accent/20 rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">
                      {activeUsers.length}
                    </div>
                    <div className="text-xs text-accent/70">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">99.9%</div>
                    <div className="text-xs text-accent/70">Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <WardForm
        open={showWardForm}
        onOpenChange={setShowWardForm}
        onSuccess={refreshData}
      />

      <WasteCategoryForm
        open={showWasteCategoryForm}
        onOpenChange={setShowWasteCategoryForm}
        onSuccess={refreshData}
      />
    </div>
  );
};

export default AuthorityDashboard;
