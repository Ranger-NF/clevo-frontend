import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthFormProps {
  userType: 'citizen' | 'recycler' | 'authority';
  onBack: () => void;
  onAuth: () => void;
}

const AuthForm = ({ userType, onBack, onAuth }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { toast } = useToast();

  const userTypeConfig = {
    citizen: {
      title: 'Citizen Portal',
      color: 'citizen-green',
      description: 'Access your eco-friendly waste management dashboard'
    },
    recycler: {
      title: 'Recycler Dashboard',
      color: 'recycler-blue',
      description: 'Manage pickup slots and coordinate waste collection'
    },
    authority: {
      title: 'Authority Panel',
      color: 'authority-purple',
      description: 'Monitor and analyze waste management operations'
    }
  };

  const config = userTypeConfig[userType];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Show backend integration message
    toast({
      title: "Authentication Ready",
      description: "Connect Supabase integration to enable authentication features.",
    });

    // For demo purposes, proceed to dashboard
    setTimeout(() => {
      onAuth();
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-eco-light/5 to-secondary/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Selection
        </Button>

        <Card className="shadow-2xl border-0 bg-gradient-to-br from-card to-muted/30">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className={`w-16 h-16 mx-auto rounded-full bg-${config.color}/10 flex items-center justify-center`}>
              <div className={`w-8 h-8 rounded-full bg-${config.color}`}></div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                {config.title}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {config.description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-eco-primary to-eco-secondary text-white hover:scale-105 transition-all duration-300 py-3"
                size="lg"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-muted-foreground hover:text-foreground"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;