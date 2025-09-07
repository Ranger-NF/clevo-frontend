import { Calendar, MapPin, Award, Recycle, Clock, CheckCircle, Loader2, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import { citizenApi, type Booking, type PickupSlot, type Reward } from '@/services/api';
import BookingSlotDialog from '@/components/BookingSlotDialog';

interface CitizenDashboardProps {
  onLogout: () => void;
}

const CitizenDashboard = ({ onLogout }: CitizenDashboardProps) => {
  const { toast } = useToast();
  
  // State management
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [slots, setSlots] = useState<PickupSlot[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<PickupSlot | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [showAvailableSlots, setShowAvailableSlots] = useState(false);

  // Calculated values
  const monthlyTarget = 500;
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const currentMonthBookings = bookings.filter(b => new Date(b.createdAt) >= startOfMonth);
  const currentMonthPoints = currentMonthBookings.reduce((sum, b) => sum + (b.wasteCategory.ecoPointsPerUnit * b.actualQuantity), 0);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [bookingsData, rewardsData, slotsData, totalPointsData] = await Promise.all([
          citizenApi.getBookings(),
          citizenApi.getAvailableRewards(),
          citizenApi.getSlots(),
          citizenApi.getTotalRewards()
        ]);
        
        setBookings(bookingsData);
        setRewards(rewardsData);
        setSlots(slotsData);
        setTotalPoints(totalPointsData);
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

  // Helper functions
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const handleRedeemReward = async (rewardId: number) => {
    try {
      await citizenApi.redeemReward({ rewardId });
      const newTotalPoints = await citizenApi.getTotalRewards();
      setTotalPoints(newTotalPoints);
      toast({
        title: "Success",
        description: "Reward redeemed successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to redeem reward",
        variant: "destructive",
      });
    }
  };

  const handleBookSlot = (slot: PickupSlot) => {
    setSelectedSlot(slot);
    setBookingDialogOpen(true);
  };

  const handleBookingSuccess = () => {
    // Refresh data after successful booking
    const fetchData = async () => {
      try {
        const [bookingsData, slotsData, totalPointsData] = await Promise.all([
          citizenApi.getBookings(),
          citizenApi.getSlots(),
          citizenApi.getTotalRewards()
        ]);
        
        setBookings(bookingsData);
        setSlots(slotsData);
        setTotalPoints(totalPointsData);
      } catch (err) {
        console.error('Failed to refresh data:', err);
      }
    };
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-eco-light/5 to-secondary/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-eco-primary" />
            <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

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
                <span className="text-2xl font-bold">{bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length}</span>
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
                <span className="text-2xl font-bold">{bookings.filter(b => b.status === 'COLLECTED').length}</span>
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
                <Button 
                  onClick={() => setShowAvailableSlots(!showAvailableSlots)}
                  className="eco-button w-full font-montserrat" 
                  size="lg"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {showAvailableSlots ? 'Hide Available Slots' : 'Find Available Slots'}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  {slots.length > 0 ? `${slots.length} slots available` : 'No slots available'}
                </p>
                
                {showAvailableSlots && slots.length > 0 && (
                  <div className="space-y-3 mt-4 max-h-64 overflow-y-auto">
                    {slots.map((slot) => {
                      const { date, time } = formatDateTime(slot.startTime);
                      const availableSpots = slot.capacity - slot.currentBookingsCount;
                      
                      return (
                        <div key={slot.id} className="p-3 border border-border rounded-lg bg-card/50">
                          <div className="flex justify-between items-start mb-2">
                            <div className="space-y-1">
                              <div className="font-medium">{slot.ward.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {date} at {time}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {availableSpots} spots left
                              </div>
                            </div>
                            <Button
                              onClick={() => handleBookSlot(slot)}
                              size="sm"
                              className="bg-eco-primary hover:bg-eco-primary/90 font-montserrat"
                              disabled={availableSpots <= 0}
                            >
                              {availableSpots <= 0 ? 'Full' : 'Book'}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {showAvailableSlots && slots.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No slots available at the moment
                  </div>
                )}
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
                  {bookings.slice(0, 3).map((booking) => {
                    const { date, time } = formatDateTime(booking.createdAt);
                    const points = booking.wasteCategory.ecoPointsPerUnit * booking.actualQuantity;
                    return (
                      <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{date} at {time}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{booking.wasteCategory.name} Waste</div>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant={booking.status === 'COLLECTED' ? 'default' : 'secondary'}>
                            {booking.status.toLowerCase()}
                          </Badge>
                          <div className="text-sm font-medium text-eco-primary">+{Math.round(points)} points</div>
                        </div>
                      </div>
                    );
                  })}
                  {bookings.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No bookings yet</p>
                  )}
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
                {rewards.map((reward) => (
                  <div key={reward.id} className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{reward.name}</h4>
                      <Badge variant="default">
                        {reward.points} pts
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      disabled={totalPoints < reward.points}
                      className="w-full"
                      variant={totalPoints >= reward.points ? "default" : "outline"}
                      onClick={() => handleRedeemReward(reward.id)}
                    >
                      {totalPoints >= reward.points ? 'Redeem' : 'Not Enough Points'}
                    </Button>
                  </div>
                ))}
                {rewards.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No rewards available</p>
                )}
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
                  <div className="text-2xl font-bold text-citizen-green">
                    {bookings.reduce((sum, b) => sum + b.actualQuantity, 0).toFixed(1)} kg
                  </div>
                  <div className="text-sm text-muted-foreground">Waste Recycled</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-recycler-blue">
                    {(bookings.reduce((sum, b) => sum + b.actualQuantity, 0) * 0.25).toFixed(1)} kg
                  </div>
                  <div className="text-sm text-muted-foreground">CO₂ Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-eco-accent">
                    {Math.floor(bookings.reduce((sum, b) => sum + b.actualQuantity, 0) * 0.64)}
                  </div>
                  <div className="text-sm text-muted-foreground">Trees Equivalent</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BookingSlotDialog
        slot={selectedSlot}
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default CitizenDashboard;