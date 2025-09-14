import { Users, Recycle, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserTypeSelectionProps {
  onUserTypeSelect: (userType: "citizen" | "recycler" | "authority") => void;
}

const UserTypeSelection = ({ onUserTypeSelect }: UserTypeSelectionProps) => {
  const userTypes = [
    {
      type: "citizen" as const,
      title: "Citizen",
      description:
        "Book waste pickup slots, earn eco-points, and redeem rewards",
      icon: Users,
      bgColor: "bg-gradient-to-br from-citizen-green/10 to-eco-light/20",
      iconColor: "text-citizen-green",
      features: [
        "Book Pickup Slots",
        "Track Bookings",
        "Earn Eco-Points",
        "Redeem Rewards",
      ],
    },
    {
      type: "recycler" as const,
      title: "Recycler",
      description: "Manage pickup slots and coordinate waste collection",
      icon: Recycle,
      bgColor: "bg-gradient-to-br from-recycler-blue/10 to-blue-100/50",
      iconColor: "text-recycler-blue",
      features: [
        "Manage Pickup Slots",
        "View Ward Bookings",
        "Update Collection Status",
        "Track Performance",
      ],
    },
    {
      type: "authority" as const,
      title: "Authority",
      description: "Monitor waste management and analyze environmental data",
      icon: Shield,
      bgColor: "bg-gradient-to-br from-authority-purple/10 to-purple-100/50",
      iconColor: "text-authority-purple",
      features: [
        "User Management",
        "Analytics Dashboard",
        "Ward Management",
        "Policy Oversight",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--accent-color)] flex items-center justify-center p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your Role
          </h2>
          <p className="text-xl text-white">
            Select how you'd like to participate in our eco-friendly platform
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {userTypes.map((userType, index) => {
            const Icon = userType.icon;

            return (
              <Card
                key={userType.type}
                className={`user-type-card ${userType.bgColor}`}
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => onUserTypeSelect(userType.type)}
              >
                <div className="space-y-6">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 mx-auto rounded-full bg-accent shadow-lg flex items-center justify-center ${userType.iconColor}`}
                  >
                    <Icon size={32} />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {userType.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {userType.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {userType.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${userType.iconColor.replace("text-", "bg-")}`}
                        ></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-eco-primary to-eco-secondary text-white hover:scale-105 transition-all duration-300"
                    size="lg"
                  >
                    Continue as {userType.title}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;
