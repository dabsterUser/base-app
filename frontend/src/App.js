import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import Login from './Login';
import Signup from './Signup';
import FormBuilder from './FormBuilder';
import Notifications from './Notifications';
import ActivityLogs from './ActivityLogs';
import UsersList from './UsersList';
import { Button } from './components/ui/button';
import { supabase } from './supabaseClient';
import { LogOut, LayoutDashboard, FileText, Users, Activity, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAuth } from './AuthContext';

const DashboardLayout = ({ children }) => {
  const { role } = useAuth();
  const handleLogout = () => supabase.auth.signOut();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col">
        <div className="flex items-center gap-2 font-bold text-xl mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            B
          </div>
          BaseApp
        </div>

        <nav className="flex-1 space-y-4">
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-4">
              Core
            </p>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start font-medium" asChild>
                <a href="/">
                  <LayoutDashboard className="w-4 h-4 mr-3 text-blue-500" />
                  Dashboard
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start font-medium">
                <FileText className="w-4 h-4 mr-3 text-orange-500" />
                My Forms
              </Button>
            </div>
          </div>

          {role === 'admin' && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-4">
                Administration
              </p>
              <div className="space-y-1 pl-2 border-l ml-4">
                <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                  <a href="/logs">
                    <Activity className="w-3.5 h-3.5 mr-3 text-indigo-500" />
                    Activity Logs
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                  <a href="/users">
                    <ShieldCheck className="w-3.5 h-3.5 mr-3 text-emerald-500" />
                    Users, Roles & Permissions
                  </a>
                </Button>
              </div>
            </div>
          )}
        </nav>

        <Button variant="outline" className="w-full justify-start mt-auto" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Manage your forms and view submissions.</p>
            </div>
            <Notifications />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<FormBuilder />} />
                    <Route path="/logs" element={<ActivityLogs />} />
                    <Route path="/users" element={<UsersList />} />
                  </Routes>
                </DashboardLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
