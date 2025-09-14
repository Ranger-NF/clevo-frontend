import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { authorityApi, type WasteCategoryRequest } from "@/services/api";

interface WasteCategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const WasteCategoryForm = ({
  open,
  onOpenChange,
  onSuccess,
}: WasteCategoryFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<
    WasteCategoryRequest & { ecoPointsPerUnit: number }
  >({
    name: "",
    description: "",
    ecoPointsPerUnit: 0,
  });

  const { toast } = useToast();

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.ecoPointsPerUnit <= 0) {
      toast({
        title: "Error",
        description: "Eco points must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await authorityApi.addWasteCategory(formData);
      toast({
        title: "Success!",
        description: "Waste category created successfully",
      });
      onSuccess();
      onOpenChange(false);
      setFormData({
        name: "",
        description: "",
        ecoPointsPerUnit: 0,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create waste category",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setFormData({
      name: "",
      description: "",
      ecoPointsPerUnit: 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-montserrat text-primary">
            Add Waste Category
          </DialogTitle>
          <DialogDescription>
            Define a new category of waste for collection and tracking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter category name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter category description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ecoPoints">Eco Points per Unit</Label>
            <Input
              id="ecoPoints"
              type="number"
              placeholder="Enter eco points"
              value={formData.ecoPointsPerUnit}
              onChange={(e) =>
                handleInputChange("ecoPointsPerUnit", Number(e.target.value))
              }
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90 font-montserrat"
            >
              {loading ? "Creating..." : "Add Category"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WasteCategoryForm;
