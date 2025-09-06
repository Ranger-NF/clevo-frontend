import { BarChart3, Users, MapPin, Trash2, Award, TrendingUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import { authorityApi, type User, type Ward, type WasteCategory } from '@/services/api';

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
    ecoPointsDistribution: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [usersData, wardsData, wasteCategoriesData, wasteTrend, wasteByType, wasteByRegion, ecoPointsDistribution] = await Promise.all([
          authorityApi.listUsers(),
          authorityApi.listWards(),
          authorityApi.listWasteCategories(),
          authorityApi.getWasteTrend(),
          authorityApi.getWasteByType(),
          authorityApi.getWasteByRegion(),
          authorityApi.getEcoPointsDistribution()
        ]);
        
        setUsers(usersData);
        setWards(wardsData);
        setWasteCategories(wasteCategoriesData);
        setDashboardData({
          wasteTrend,
          wasteByType,
          wasteByRegion,
          ecoPointsDistribution
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
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
      setUsers(users.map(user => user.id === userId ? updatedUser : user));
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
      setUsers(users.map(user => user.id === userId ? updatedUser : user));
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

  // Calculate statistics
  const activeUsers = users.filter(u => u.active);
  const totalEcoPoints = dashboardData.ecoPointsDistribution?.total || 0;
  const monthlyWaste = dashboardData.wasteTrend?.current || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-authority-purple/5 to-secondary/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-authority-purple" />
            <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-authority-purple/5 to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Authority Dashboard</h1>
            <p className="text-muted-foreground">Monitor and analyze waste management operations</p>
          </div>
          <Button onClick={onLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="text-authority-purple w-5 h-5" />
                <span className="text-2xl font-bold text-authority-purple">{users.length}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{activeUsers.length} active users</p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Wards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MapPin className="text-recycler-blue w-5 h-5" />
                <span className="text-2xl font-bold">{wards.length}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">All operational</p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Waste</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Trash2 className="text-eco-secondary w-5 h-5" />
                <span className="text-2xl font-bold">{monthlyWaste ? `${monthlyWaste} tons` : 'N/A'}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Eco-Points Distributed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Award className="text-eco-accent w-5 h-5" />
                <span className="text-2xl font-bold">{totalEcoPoints ? `${(totalEcoPoints / 1000).toFixed(1)}K` : 'N/A'}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total distributed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analytics Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Waste by Category */}
            <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-authority-purple" />
                  Waste Distribution by Category
                </CardTitle>
                <CardDescription>Monthly waste collection breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wasteCategories.slice(0, 4).map((category) => (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{category.name}</span>
                        <span className="font-medium">{category.ecoPointsPerUnit} pts/unit</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-citizen-green to-eco-secondary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(category.ecoPointsPerUnit * 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  {wasteCategories.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No waste categories found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ward Performance */}
            <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle>Ward Performance</CardTitle>
                <CardDescription>Efficiency metrics by ward</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ward</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Authority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wards.map((ward) => (
                      <TableRow key={ward.id}>
                        <TableCell className="font-medium">{ward.name}</TableCell>
                        <TableCell>{ward.description}</TableCell>
                        <TableCell>{ward.authority.firstName} {ward.authority.lastName}</TableCell>
                        <TableCell>N/A</TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {wards.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No wards found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Trend Chart Placeholder */}
            <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-citizen-green" />
                  Waste Collection Trends
                </CardTitle>
                <CardDescription>Monthly collection data over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-eco-light/20 to-recycler-blue/10 rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Interactive charts will be available with Supabase integration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Panel */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-authority-purple to-purple-600 text-white">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button className="w-full" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Create New Ward
                </Button>
                <Button className="w-full" variant="outline">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Add Waste Category
                </Button>
                <Button className="w-full" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Reports
                </Button>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.9s' }}>
              <CardHeader>
                <CardTitle>Recent User Activity</CardTitle>
                <CardDescription>Latest registrations and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-muted-foreground">{user.role.toLowerCase()} • {user.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.active ? 'default' : 'secondary'}>
                          {user.active ? 'active' : 'inactive'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => user.active ? handleDeactivateUser(user.id) : handleActivateUser(user.id)}
                        >
                          {user.active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No users found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '1.0s' }}>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Status</span>
                  <Badge className="bg-citizen-green text-white">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <Badge className="bg-citizen-green text-white">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Sessions</span>
                  <span className="text-sm font-medium">247</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;