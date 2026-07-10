import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/use-auth';
import { PrivateRoute } from '@/components/private-route';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import LoginPage from '@/pages/login-page';
import SignupPage from '@/pages/signup-page';
import ActivityLogsPage from '@/pages/activity-logs-page';
import UsersPage from '@/pages/users-page';
import FormBuilderPage from '@/pages/form-builder-page';
import SettingsPage from '@/pages/settings-page';
import FileManagerPage from '@/pages/file-manager-page';

// Dynamic Dashboard
const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const session = await supabase.auth.getSession();
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${session.data.session?.access_token}` }
      });
      return res.data;
    }
  });

  if (isLoading) return <div>Loading dashboard...</div>;

  const dashboardStats = [
    { label: 'Total Users', value: stats?.stats?.totalUsers || 0 },
    { label: 'Active Users', value: stats?.stats?.activeUsers || 0 },
    { label: 'Forms Created', value: stats?.stats?.totalForms || 0 },
    { label: 'Total Submissions', value: stats?.stats?.totalSubmissions || 0 }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {stats?.recentActivities && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="rounded-xl border bg-card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivities.map((log: any) => (
                  <tr key={log.id} className="border-b last:border-0">
                    <td className="p-3">{log.user?.email || 'System'}</td>
                    <td className="p-3">{log.action}</td>
                    <td className="p-3 capitalize">{log.module}</td>
                    <td className="p-3">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/*" element={
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/forms" element={<FormBuilderPage />} />
                  <Route path="/logs" element={<ActivityLogsPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/files" element={<FileManagerPage />} />
                </Routes>
              </DashboardLayout>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
