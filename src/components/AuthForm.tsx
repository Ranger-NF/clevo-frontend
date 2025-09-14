import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth';
import { authorityApi } from '@/services/api';

interface AuthFormProps {
  userType: 'citizen' | 'recycler' | 'authority';
  onBack: () => void;
  onAuth: () => void;
}

const AuthForm = ({ userType, onBack, onAuth }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phoneNumber: '',
    wardId: ''
  });
  const [wards, setWards] = useState<Array<{id: string; name: string; description: string}>>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userType === 'citizen' && !isLogin) {
      loadWards();
    }
  }, [userType, isLogin]);

  const loadWards = async () => {
    try {
      const wardsData = await authorityApi.listWards();
      setWards(wardsData);
    } catch (error) {
      // Silently fail - wards loading is not critical for auth
    }
  };

  const userTypeConfig = {
    citizen: {
      title: 'Citizen Portal',
      color: 'primary',
      description: 'Access your eco-friendly waste management dashboard'
    },
    recycler: {
      title: 'Recycler Dashboard', 
      color: 'primary',
      description: 'Manage pickup slots and coordinate waste collection'
    },
    authority: {
      title: 'Authority Panel',
      color: 'primary',
      description: 'Monitor and analyze waste management operations'
    }
  };

  const config = userTypeConfig[userType];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (isLogin) {
        await authService.login({
          username: formData.username,
          password: formData.password,
        });
      } else {
        const registerData: any = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: userType.toUpperCase() as 'CITIZEN' | 'RECYCLER' | 'AUTHORITY',
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
        };

        // Add wardId only for citizens
        if (userType === 'citizen' && formData.wardId) {
          registerData.wardId = formData.wardId;
        }

        await authService.register(registerData);
      }

      toast({
        title: "Success!",
        description: `${isLogin ? 'Logged in' : 'Registered'} successfully.`,
      });

      onAuth();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-accent hover:text-accent/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Selection
        </Button>

        <Card className="shadow-2xl border-0 bg-card/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-accent"></div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold font-montserrat text-primary">
                {config.title}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {config.description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required={!isLogin}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required={!isLogin}
                      />
                    </div>
                  </div>

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
                        required={!isLogin}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="pl-10"
                        required={!isLogin}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">
                      Address
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="address"
                        type="text"
                        placeholder="Enter your address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="pl-10"
                        required={!isLogin}
                      />
                    </div>
                  </div>

                  {/* Ward selection only for citizens */}
                  {userType === 'citizen' && (
                    <div className="space-y-2">
                      <Label htmlFor="ward" className="text-sm font-medium">
                        Ward
                      </Label>
                      <Select value={formData.wardId} onValueChange={(value) => handleInputChange('wardId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your ward" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border">
                          {wards.map((ward) => (
                            <SelectItem key={ward.id} value={ward.id}>
                              {ward.name} - {ward.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}

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
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-primary font-montserrat py-3 transition-all duration-300 hover:scale-105"
                size="lg"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
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