import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/use-auth';
import { PrivateRoute } from '@/components/private-route';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import LoginPage from '@/pages/login-page';
import SignupPage from '@/pages/signup-page';
import ActivityLogsPage from '@/pages/activity-logs-page';
import UsersPage from '@/pages/users-page';
import FormBuilderPage from '@/pages/form-builder-page';
import SettingsPage from '@/pages/settings-page';
import FileManagerPage from '@/pages/file-manager-page';

// Placeholder Dashboard
const Dashboard = () => (
  <div className="space-y-4">
    <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[
        { label: 'Total Users', value: '1,234' },
        { label: 'Active Sessions', value: '56' },
        { label: 'Forms Created', value: '12' },
        { label: 'Total Submissions', value: '432' }
      ].map((stat) => (
        <div key={stat.label} className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
          <p className="text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  </div>
);

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
