import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Roadmap from '../pages/Roadmap';
import Coach from '../pages/Coach';
import Resources from '../pages/Resources';
import VerifyOTP from '../pages/VerifyOTP';
import ForgotPassword from "../pages/ForgotPassword";
import ForgotVerifyOTP from "../pages/ForgotVerifyOTP";
import ResetPassword from "../pages/ResetPassword";

// Unknown URL: never show a blank screen. Logged-in users land on their
// dashboard; everyone else lands on the marketing page. (A dead token still
// ends up at /login — the API interceptor bounces expired sessions there.)
function CatchAll() {
  const loggedIn = !!localStorage.getItem('accessToken');
  return <Navigate to={loggedIn ? '/dashboard' : '/'} replace />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/coach" element={<Coach />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/forgot-verify-otp"
          element={<ForgotVerifyOTP />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* Must stay last: catches every unknown URL */}
        <Route path="*" element={<CatchAll />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
