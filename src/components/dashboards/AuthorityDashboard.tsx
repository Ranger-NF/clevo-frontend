import { BarChart3, Users, MapPin, Trash2, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface AuthorityDashboardProps {
  onLogout: () => void;
}

const AuthorityDashboard = ({ onLogout }: AuthorityDashboardProps) => {
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', type: 'citizen', status: 'active', ward: 'Ward 5A' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', type: 'recycler', status: 'active', ward: 'Ward 5B' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', type: 'citizen', status: 'inactive', ward: 'Ward 5A' },
  ];

  const mockWards = [
    { id: '5A', name: 'Ward 5A', population: 15000, recyclers: 3, monthlyWaste: '2.5 tons', efficiency: 92 },
    { id: '5B', name: 'Ward 5B', population: 18000, recyclers: 4, monthlyWaste: '3.1 tons', efficiency: 87 },
    { id: '5C', name: 'Ward 5C', population: 12000, recyclers: 2, monthlyWaste: '1.8 tons', efficiency: 95 },
  ];

  const wasteCategories = [
    { name: 'Recyclable', percentage: 45, color: 'bg-citizen-green' },
    { name: 'Organic', percentage: 35, color: 'bg-eco-secondary' },
    { name: 'E-waste', percentage: 15, color: 'bg-recycler-blue' },
    { name: 'Hazardous', percentage: 5, color: 'bg-authority-purple' },
  ];

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
                <span className="text-2xl font-bold text-authority-purple">1,247</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Wards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MapPin className="text-recycler-blue w-5 h-5" />
                <span className="text-2xl font-bold">{mockWards.length}</span>
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
                <span className="text-2xl font-bold">7.4 tons</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">-8% reduction</p>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Eco-Points Distributed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Award className="text-eco-accent w-5 h-5" />
                <span className="text-2xl font-bold">45.2K</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">+15% increase</p>
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
                  {wasteCategories.map((category, index) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{category.name}</span>
                        <span className="font-medium">{category.percentage}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className={`${category.color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
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
                      <TableHead>Population</TableHead>
                      <TableHead>Recyclers</TableHead>
                      <TableHead>Monthly Waste</TableHead>
                      <TableHead>Efficiency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockWards.map((ward) => (
                      <TableRow key={ward.id}>
                        <TableCell className="font-medium">{ward.name}</TableCell>
                        <TableCell>{ward.population.toLocaleString()}</TableCell>
                        <TableCell>{ward.recyclers}</TableCell>
                        <TableCell>{ward.monthlyWaste}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant={ward.efficiency > 90 ? 'default' : 'secondary'}>
                              {ward.efficiency}%
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
                  {mockUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.type} • {user.ward}</div>
                      </div>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </div>
                  ))}
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