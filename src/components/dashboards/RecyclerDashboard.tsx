import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Package,
  AlertCircle,
  Loader2,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import {
  recyclerApi,
  bookingApi,
  type PickupSlot,
  type Booking,
} from "@/services/api";
import SlotForm from "@/components/SlotForm";

interface RecyclerDashboardProps {
  onLogout: () => void;
}

const RecyclerDashboard = ({ onLogout }: RecyclerDashboardProps) => {
  const { toast } = useToast();

  const wardId = "f1ad1de7-a746-45a0-b061-7f707dcc8561";

  // State management
  const [slots, setSlots] = useState<PickupSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSlotForm, setShowSlotForm] = useState(false);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [slotsData, bookingsData] = await Promise.all([
        recyclerApi.getRecyclerSlots(),
        recyclerApi.getBookingsByWard(wardId),
      ]);

      setSlots(slotsData);
      setBookings(bookingsData);
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

  // Fetch data on component mount
  useEffect(() => {
    refreshData();
  }, [wardId, toast]);

  // Helper functions
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const getSlotStatus = (slot: PickupSlot) => {
    if (!slot.isActive) return "inactive";
    if (slot.currentBookingsCount >= slot.capacity) return "full";
    return "active";
  };

  // CRUD operations
  const handleDeleteSlot = async (slotId: string) => {
    try {
      await recyclerApi.deleteSlot(slotId);
      setSlots(slots.filter((slot) => slot.id !== slotId));
      toast({
        title: "Success",
        description: "Slot deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete slot",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBookingStatus = async (
    bookingId: string,
    status: string,
  ) => {
    try {
      await bookingApi.updateBookingStatus(bookingId, { status });
      setBookings(
        bookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: status as Booking["status"] }
            : booking,
        ),
      );
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const activeSlots = slots.filter((slot) => slot.isActive);
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "PENDING");
  const collectedBookings = bookings.filter((b) => b.status === "COLLECTED");

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

  return (
    <div className="min-h-screen bg-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold font-montserrat text-white">
              Recycler Dashboard
            </h1>
            <p className="text-white/70">
              Manage pickup slots and coordinate collections
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card
            className="dashboard-card animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Slots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="text-recycler-blue w-5 h-5" />
                <span className="text-2xl font-bold text-recycler-blue">
                  {activeSlots.length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card
            className="dashboard-card animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="text-citizen-green w-5 h-5" />
                <span className="text-2xl font-bold">{totalBookings}</span>
              </div>
            </CardContent>
          </Card>

          <Card
            className="dashboard-card animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Collections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertCircle className="text-eco-accent w-5 h-5" />
                <span className="text-2xl font-bold">
                  {pendingBookings.length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card
            className="dashboard-card animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Collected Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Package className="text-authority-purple w-5 h-5" />
                <span className="text-2xl font-bold">
                  {collectedBookings.length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pickup Slots Management */}
          <div className="lg:col-span-2 space-y-6">
            <Card
              className="dashboard-card animate-slide-up"
              style={{ animationDelay: "0.5s" }}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-recycler-blue" />
                      Pickup Slots
                    </CardTitle>
                    <CardDescription>
                      Manage your scheduled pickup slots
                    </CardDescription>
                  </div>
                  <Button
                    className="bg-accent hover:bg-accent/90 text-primary font-montserrat"
                    onClick={() => setShowSlotForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Slot
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {slots.map((slot) => {
                    const { date, time } = formatDateTime(slot.startTime);
                    const { time: endTime } = formatDateTime(slot.endTime);
                    const slotStatus = getSlotStatus(slot);

                    return (
                      <div
                        key={slot.id}
                        className="p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {date} | {time}-{endTime}
                                </span>
                              </div>
                              <Badge
                                variant={
                                  slotStatus === "active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {slotStatus}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {slot.ward.name}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Capacity: {slot.currentBookingsCount}/
                              {slot.capacity} bookings
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                slot.id && handleDeleteSlot(slot.id)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Today's Collections */}
            <Card
              className="dashboard-card animate-slide-up"
              style={{ animationDelay: "0.6s" }}
            >
              <CardHeader>
                <CardTitle>Today's Collections</CardTitle>
                <CardDescription>
                  Bookings scheduled for collection
                </CardDescription>
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
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">
                          {`${booking.citizen.firstName} ${booking.citizen.lastName}`}
                        </TableCell>
                        <TableCell>{booking.citizen.address}</TableCell>
                        <TableCell>{booking.wasteCategory.name}</TableCell>
                        <TableCell>{booking.estimatedQuantity} kg</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === "COLLECTED"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {booking.status.toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {booking.status === "PENDING" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUpdateBookingStatus(
                                  booking.id,
                                  "COLLECTED",
                                )
                              }
                            >
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
            <Card
              className="dashboard-card animate-slide-up"
              style={{ animationDelay: "0.7s" }}
            >
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
                    <div
                      className="bg-gradient-to-r from-citizen-green to-eco-secondary h-2 rounded-full"
                      style={{ width: "94%" }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-recycler-blue">
                      156 kg
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Collected
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-citizen-green">
                      98%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      On-Time Rate
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/*TODO: enbaling calender*/}
            {/*
            <Card
              className="dashboard-card animate-slide-up"
              style={{ animationDelay: "0.8s" }}
            >
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
                <Button className="w-full" variant="outline">
                  <Package className="w-4 h-4 mr-2" />
                  Inventory Check
                </Button>
              </CardContent>
            </Card>*/}
          </div>
        </div>
      </div>

      <SlotForm
        open={showSlotForm}
        onOpenChange={setShowSlotForm}
        onSuccess={refreshData}
      />
    </div>
  );
};

export default RecyclerDashboard;
