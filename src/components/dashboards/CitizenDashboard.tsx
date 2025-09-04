import { Calendar, MapPin, Award, Recycle, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CitizenDashboardProps {
  onLogout: () => void;
}

const CitizenDashboard = ({ onLogout }: CitizenDashboardProps) => {
  const mockBookings = [
    { id: 1, date: '2024-01-15', time: '10:00 AM', status: 'confirmed', category: 'Recyclable', points: 25 },
    { id: 2, date: '2024-01-08', time: '2:00 PM', status: 'completed', category: 'Organic', points: 30 },
    { id: 3, date: '2024-01-01', time: '11:30 AM', status: 'completed', category: 'E-waste', points: 50 },
  ];

  const mockRewards = [
    { id: 1, name: 'Tree Sapling', points: 100, available: true },
    { id: 2, name: 'Eco Bag', points: 50, available: true },
    { id: 3, name: 'Plant Seeds Pack', points: 75, available: false },
  ];

  const totalPoints = 1250;
  const monthlyTarget = 500;
  const currentMonthPoints = 285;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-eco-light/5 to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Citizen Dashboard</h1>
            <p className="text-muted-foreground">Manage your eco-friendly waste pickups</p>
          </div>
          <Button onClick={onLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Eco-Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Award className="text-eco-accent w-5 h-5" />
                <span className="text-2xl font-bold text-eco-primary">{totalPoints}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{currentMonthPoints}/{monthlyTarget} points</span>
                  <span className="text-muted-foreground">{Math.round((currentMonthPoints/monthlyTarget) * 100)}%</span>
                </div>
                <Progress value={(currentMonthPoints/monthlyTarget) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="text-recycler-blue w-5 h-5" />
                <span className="text-2xl font-bold">{mockBookings.filter(b => b.status === 'confirmed').length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-citizen-green w-5 h-5" />
                <span className="text-2xl font-bold">{mockBookings.filter(b => b.status === 'completed').length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-citizen-green" />
                  Book Pickup Slot
                </CardTitle>
                <CardDescription>Schedule a new waste pickup for your location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="eco-button w-full" size="lg">
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Available Slots
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Next available slot: Today, 3:00 PM - 5:00 PM
                </p>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your latest waste pickup history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{booking.date} at {booking.time}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{booking.category} Waste</div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                        <div className="text-sm font-medium text-eco-primary">+{booking.points} points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rewards Sidebar */}
          <div className="space-y-6">
            <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-eco-accent" />
                  Available Rewards
                </CardTitle>
                <CardDescription>Redeem your eco-points</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRewards.map((reward) => (
                  <div key={reward.id} className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{reward.name}</h4>
                      <Badge variant={reward.available ? 'default' : 'secondary'}>
                        {reward.points} pts
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      disabled={!reward.available || totalPoints < reward.points}
                      className="w-full"
                      variant={reward.available && totalPoints >= reward.points ? "default" : "outline"}
                    >
                      {reward.available && totalPoints >= reward.points ? 'Redeem' : 'Not Available'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Environmental Impact */}
            <Card className="dashboard-card animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-citizen-green" />
                  Your Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-citizen-green">12.5 kg</div>
                  <div className="text-sm text-muted-foreground">Waste Recycled</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-recycler-blue">3.2 kg</div>
                  <div className="text-sm text-muted-foreground">CO₂ Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-eco-accent">8</div>
                  <div className="text-sm text-muted-foreground">Trees Equivalent</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;