import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PickupSlot, WasteCategory, BookingRequest } from "@/services/api";
import { citizenApi } from "@/services/api";

interface BookingSlotDialogProps {
  slot: PickupSlot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookingSuccess: () => void;
}

const BookingSlotDialog = ({
  slot,
  open,
  onOpenChange,
  onBookingSuccess,
}: BookingSlotDialogProps) => {
  const [wasteCategories, setWasteCategories] = useState<WasteCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [estimatedQuantity, setEstimatedQuantity] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadWasteCategories();
    }
  }, [open]);

  const loadWasteCategories = async () => {
    try {
      const categories = await citizenApi.listWasteCategories();
      setWasteCategories(categories);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load waste categories",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slot || !selectedCategoryId || !estimatedQuantity) return;

    setLoading(true);
    try {
      const booking: BookingRequest = {
        slotId: slot.id!,
        wasteCategoryId: selectedCategoryId,
        estimatedQuantity: parseFloat(estimatedQuantity),
      };

      await citizenApi.bookSlot(booking);

      toast({
        title: "Success!",
        description:
          "Slot booked successfully. You will receive a confirmation code.",
      });

      onBookingSuccess();
      onOpenChange(false);
      setSelectedCategoryId("");
      setEstimatedQuantity("");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to book slot",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!slot) return null;

  const selectedCategory = wasteCategories.find(
    (cat) => cat.id === selectedCategoryId,
  );
  const totalPoints = selectedCategory
    ? selectedCategory.ecoPointsPerUnit * parseFloat(estimatedQuantity || "0")
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-montserrat">
            Book Pickup Slot
          </DialogTitle>
          <DialogDescription>
            Book your slot with {slot.recycler.firstName}{" "}
            {slot.recycler.lastName} in {slot.ward.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Date & Time</p>
              <p className="font-medium">
                {new Date(slot.startTime).toLocaleDateString()} at{" "}
                {new Date(slot.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Spots</p>
              <p className="font-medium">
                {slot.capacity - slot.currentBookingsCount} left
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wasteCategory">Waste Category</Label>
              <Select
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select waste category" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border">
                  {wasteCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.ecoPointsPerUnit} points/kg)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Estimated Quantity (kg)</Label>
              <Input
                id="quantity"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="Enter weight in kg"
                value={estimatedQuantity}
                onChange={(e) => setEstimatedQuantity(e.target.value)}
                required
              />
            </div>

            {totalPoints > 0 && (
              <div className="p-3 bg-eco-light/20 border border-eco-primary/20 rounded-lg">
                <p className="text-sm font-medium text-eco-primary">
                  Estimated Eco Points: {totalPoints.toFixed(1)} points
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !selectedCategoryId || !estimatedQuantity}
                className="flex-1 bg-eco-primary hover:bg-eco-primary/90 font-montserrat"
              >
                {loading ? "Booking..." : "Book Slot"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingSlotDialog;
