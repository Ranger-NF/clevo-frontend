import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import clevoLogo from '@/assets/clevo-logo.jpg';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen splash-gradient flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full border border-white/20 animate-pulse-gentle"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 rounded-full border border-white/30 animate-pulse-gentle"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 rounded-full border border-white/25 animate-pulse-gentle"></div>
      </div>

      <div className="text-center space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="mb-8 animate-slide-up">
          <img 
            src={clevoLogo} 
            alt="Clevo Logo" 
            className="w-48 h-auto mx-auto mb-4 rounded-lg shadow-2xl"
          />
          <h1 className="text-6xl font-bold tracking-wide mb-2">CLEVO</h1>
          <p className="text-xl text-white/90 font-light">
            Smart Waste Management Platform
          </p>
        </div>

        {showContent && (
          <div className="animate-slide-up space-y-6">
            <p className="text-lg text-white/80 max-w-md mx-auto leading-relaxed">
              Connecting Citizens, Recyclers, and Authorities for a cleaner tomorrow
            </p>
            
            <Button 
              onClick={onComplete}
              size="lg"
              className="bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm px-8 py-3 text-lg font-medium transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/20 to-transparent"></div>
    </div>
  );
};

export default SplashScreen;