import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/use-auth';
import { PrivateRoute } from '@/components/private-route';

// Layout and Pages (Placeholders)
const Dashboard = () => <div className="p-8"><h1 className="text-3xl font-bold">Dashboard</h1></div>;
const Login = () => <div className="p-8"><h1>Login</h1></div>;
const Signup = () => <div className="p-8"><h1>Signup</h1></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            {/* Add other protected routes here */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
