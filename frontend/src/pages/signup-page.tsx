import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Loader2, Check } from 'lucide-react';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signUp(email, password);
      navigate('/login?signup=success');
    } catch (err: any) {
      setError(err.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 font-sans">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side info */}
        <div className="hidden lg:flex flex-col space-y-6 pr-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight">Start building your enterprise base.</h2>
          <ul className="space-y-4">
            {[
              'Enterprise RBAC & Permissions',
              'Advanced Audit Logs & Activity Tracking',
              'Dynamic Form Builder Engine',
              'Real-time Notification System'
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-zinc-400">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Check className="h-3 w-3 text-emerald-500" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Signup form */}
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden text-center space-y-2 mb-8">
            <Shield className="h-10 w-10 text-primary mx-auto mb-2" />
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
          </div>

          <Card className="border-white/5 bg-white/5 backdrop-blur-xl">
            <form onSubmit={handleSignup}>
              <CardHeader>
                <CardTitle className="text-white">Sign Up</CardTitle>
                <CardDescription className="text-zinc-400">Join the Base Application platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-300">Work Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" title="password" className="text-zinc-300">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                  <p className="text-[10px] text-zinc-500">Minimum 6 characters, must include numbers.</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Free Account'}
                </Button>
                <p className="text-sm text-zinc-500 text-center">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">Log in</Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
