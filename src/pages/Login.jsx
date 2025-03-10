import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full flex flex-col items-center">
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
