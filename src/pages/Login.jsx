
import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-salon-50 to-salon-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-salon-800">Salon Bot</h1>
          <p className="text-salon-600 mt-2">AI Customer Support Control Panel</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
