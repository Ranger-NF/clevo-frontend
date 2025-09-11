import { Button } from "@/components/ui/button";
import clevoLogo from "@/assets/clevo-logo.svg";
import "./components.css";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  return (
    <div className="min-h-screen bg-[var(--primary-color)] flex flex-col items-center justify-center text-[var(--accent-color)] relative overflow-hidden">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="mb-8">
          <img
            src={clevoLogo}
            alt="Clevo Logo"
            className="w-48 h-auto mx-auto"
          />
          <h1 className="text-6xl title font-bold tracking-wide mb-2">clevo</h1>
          <p className="text-xl font-light title">
            Smart Waste Management Platform
          </p>
        </div>

        <Button
          onClick={onComplete}
          size="lg"
          className="bg-[var(--accent-color)] title text-[var(--primary-color)] px-8 py-3 text-lg font-medium transition-all duration-300 hover:scale-105"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default SplashScreen;
