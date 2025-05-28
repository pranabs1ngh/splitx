import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginForm, RegisterForm } from '../components/AuthForms';
import Header from '../components/Header';

const Auth: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Check URL parameters for register=true
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('register') === 'true') {
      setIsRegistering(true);
    }
  }, [location.search]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen bg-background dark flex flex-col">
      <Header dark />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {isRegistering ? (
            <RegisterForm onSwitchToLogin={() => setIsRegistering(false)} />
          ) : (
            <LoginForm onSwitchToRegister={() => setIsRegistering(true)} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Auth;