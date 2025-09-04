import { Calendar, MapPin, Clock, Users, Package, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface RecyclerDashboardProps {
  onLogout: () => void;
}

const RecyclerDashboard = ({ onLogout }: RecyclerDashboardProps) => {
  const mockSlots = [
    { id: 1, date: '2024-01-15', time: '10:00-12:00', location: 'Ward 5A', capacity: 20, booked: 15, status: 'active' },
    { id: 2, date: '2024-01-15', time: '14:00-16:00', location: 'Ward 5B', capacity: 25, booked: 8, status: 'active' },
    { id: 3, date: '2024-01-16', time: '09:00-11:00', location: 'Ward 5A', capacity: 30, booked: 25, status: 'full' },
  ];

  const mockBookings = [
    { id: 1, citizen: 'John Doe', address: '123 Green St', category: 'Recyclable', quantity: '5 kg', status: 'pending', time: '10:30 AM' },
    { id: 2, citizen: 'Jane Smith', address: '456 Eco Ave', category: 'Organic', quantity: '3 kg', status: 'collected', time: '11:15 AM' },
    { id: 3, citizen: 'Bob Wilson', address: '789 Leaf Rd', category: 'E-waste', quantity: '2 kg', status: 'pending', time: '12:00 PM' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-recycler-blue/5 to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Recycler Dashboard</h1>
            <p className="text-muted-foreground">Manage pickup slots and coordinate collections</p>
          </div>
          <Button onClick={onLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="text-recycler-blue w-5 h-5" />
                <span className="text-2xl font-bold text-recycler-blue">{mockSlots.filter(s => s.status === 'active').length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="text-citizen-green w-5 h-5" />
                <span className="text-2xl font-bold">{mockBookings.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Collections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertCircle className="text-eco-accent w-5 h-5" />
                <span className="text-2xl font-bold">{mockBookings.filter(b => b.status === 'pending').length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Collected Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Package className="text-authority-purple w-5 h-5" />
                <span className="text-2xl font-bold">{mockBookings.filter(b => b.status === 'collected').length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pickup Slots Management */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-recycler-blue" />
                      Pickup Slots
                    </CardTitle>
                    <CardDescription>Manage your scheduled pickup slots</CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-recycler-blue to-blue-600 text-white">
                    Create New Slot
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSlots.map((slot) => (
                    <div key={slot.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{slot.date} | {slot.time}</span>
                            </div>
                            <Badge variant={slot.status === 'active' ? 'default' : 'secondary'}>
                              {slot.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{slot.location}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Capacity: {slot.booked}/{slot.capacity} bookings
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Delete</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Today's Collections */}
            <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle>Today's Collections</CardTitle>
                <CardDescription>Bookings scheduled for collection</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Citizen</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.citizen}</TableCell>
                        <TableCell>{booking.address}</TableCell>
                        <TableCell>{booking.category}</TableCell>
                        <TableCell>{booking.quantity}</TableCell>
                        <TableCell>
                          <Badge variant={booking.status === 'collected' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {booking.status === 'pending' && (
                            <Button size="sm" variant="outline">
                              Mark Collected
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-6">
            <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>This month's statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Collections Completed</span>
                    <span className="font-medium">47/50</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-gradient-to-r from-citizen-green to-eco-secondary h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-recycler-blue">156 kg</div>
                    <div className="text-xs text-muted-foreground">Total Collected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-citizen-green">98%</div>
                    <div className="text-xs text-muted-foreground">On-Time Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
                <Button className="w-full" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Route Optimization
                </Button>
                <Button className="w-full" variant="outline">
                  <Package className="w-4 h-4 mr-2" />
                  Inventory Check
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecyclerDashboard;