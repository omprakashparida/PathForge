import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Roadmap from '../pages/Roadmap';
import VerifyOTP from '../pages/VerifyOTP';
import ForgotPassword from "../pages/ForgotPassword";
import ForgotVerifyOTP from "../pages/ForgotVerifyOTP";
import ResetPassword from "../pages/ResetPassword";

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
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;