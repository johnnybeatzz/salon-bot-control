import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // or sessionStorage depending on where you store it
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full flex flex-col items-center">
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
