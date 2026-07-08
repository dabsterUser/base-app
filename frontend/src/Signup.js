import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setIsLoading(false);
    if (error) alert(error.message);
    else alert('Check your email for confirmation!');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white p-4 font-sans">
      <div className="w-full max-w-[400px] bg-[#1c1c1c] p-8 rounded-2xl border border-[#2e2e2e] shadow-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-2 text-white">Create an account</h1>
          <p className="text-sm text-gray-400">
            Enter your email below to create your account
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-200">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#262626] border-[#3a3a3a] text-white placeholder:text-gray-500 focus:ring-1 focus:ring-gray-400 h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" name="password" className="text-sm font-medium text-gray-200">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#262626] border-[#3a3a3a] text-white focus:ring-1 focus:ring-gray-400 h-11"
              required
            />
          </div>

          <Button
            className="w-full bg-[#f4f4f5] hover:bg-[#e4e4e7] text-black font-medium h-11 rounded-lg"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-400">Already have an account? </span>
          <Link to="/login" className="text-white hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
