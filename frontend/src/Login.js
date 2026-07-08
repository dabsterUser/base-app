import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) {
        alert(error.message);
    } else if (data.user) {
        navigate('/');
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) alert(error.message);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white p-4 font-sans">
      <div className="w-full max-w-[400px] bg-[#1c1c1c] p-8 rounded-2xl border border-[#2e2e2e] shadow-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-2 text-white">Login to your account</h1>
          <p className="text-sm text-gray-400">
            Enter your email below to login to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
            <div className="flex justify-between items-center">
              <Label htmlFor="password" name="password" className="text-sm font-medium text-gray-200">Password</Label>
              <a href="#" className="text-sm text-gray-200 hover:underline">Forgot your password?</a>
            </div>
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
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <Button
            variant="outline"
            className="w-full bg-transparent border-[#3a3a3a] hover:bg-[#262626] text-white font-medium h-11 rounded-lg"
            onClick={handleGoogleLogin}
            type="button"
          >
            Login with Google
          </Button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-gray-400">Don't have an account? </span>
          <Link to="/signup" className="text-white hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
