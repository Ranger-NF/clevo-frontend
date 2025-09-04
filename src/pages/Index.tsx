import { useState } from 'react';
import SplashScreen from '@/components/SplashScreen';
import UserTypeSelection from '@/components/UserTypeSelection';
import AuthForm from '@/components/AuthForm';
import CitizenDashboard from '@/components/dashboards/CitizenDashboard';
import RecyclerDashboard from '@/components/dashboards/RecyclerDashboard';
import AuthorityDashboard from '@/components/dashboards/AuthorityDashboard';

type AppState = 'splash' | 'userSelection' | 'auth' | 'dashboard';
type UserType = 'citizen' | 'recycler' | 'authority';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);

  const handleSplashComplete = () => {
    setAppState('userSelection');
  };

  const handleUserTypeSelect = (userType: UserType) => {
    setSelectedUserType(userType);
    setAppState('auth');
  };

  const handleAuth = () => {
    setAppState('dashboard');
  };

  const handleBackToUserSelection = () => {
    setSelectedUserType(null);
    setAppState('userSelection');
  };

  const handleLogout = () => {
    setSelectedUserType(null);
    setAppState('userSelection');
  };

  // Render components based on current state
  switch (appState) {
    case 'splash':
      return <SplashScreen onComplete={handleSplashComplete} />;
    
    case 'userSelection':
      return <UserTypeSelection onUserTypeSelect={handleUserTypeSelect} />;
    
    case 'auth':
      return selectedUserType ? (
        <AuthForm 
          userType={selectedUserType} 
          onBack={handleBackToUserSelection}
          onAuth={handleAuth}
        />
      ) : null;
    
    case 'dashboard':
      switch (selectedUserType) {
        case 'citizen':
          return <CitizenDashboard onLogout={handleLogout} />;
        case 'recycler':
          return <RecyclerDashboard onLogout={handleLogout} />;
        case 'authority':
          return <AuthorityDashboard onLogout={handleLogout} />;
        default:
          return <UserTypeSelection onUserTypeSelect={handleUserTypeSelect} />;
      }
    
    default:
      return <SplashScreen onComplete={handleSplashComplete} />;
  }
};

export default Index;
