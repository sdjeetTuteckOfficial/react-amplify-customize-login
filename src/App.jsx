import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';

const ProtectedRoute = () => {
  const { user, authStatus } = useAuthenticator((context) => [
    context.user,
    context.authStatus,
  ]);

  console.log('user>>>>>', user);
  console.log('authStatus>>>>>', authStatus);

  if (authStatus === 'configuring') {
    return <div>Loading...</div>; // Show a loading state while auth is being set up
  }

  return authStatus === 'authenticated' ? <Outlet /> : <Navigate to='/' />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
