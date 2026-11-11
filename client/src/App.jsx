import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { CropRecommendationPage } from './pages/CropRecommendationPage';
import { DiseaseDetectionPage } from './pages/DiseaseDetectionPage';
import { FertilizerAdvisoryPage } from './pages/FertilizerAdvisoryPage';
import { IrrigationAdvisoryPage } from './pages/IrrigationAdvisoryPage';
import { WeatherDashboardPage } from './pages/WeatherDashboardPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { MyCropsPage } from './pages/MyCropsPage';
import { CultivationGuidesPage } from './pages/CultivationGuidesPage';
import { AdvisoryHistoryPage } from './pages/AdvisoryHistoryPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Application Routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/crop-recommendation" element={<CropRecommendationPage />} />
            <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
            <Route path="/fertilizer-advisory" element={<FertilizerAdvisoryPage />} />
            <Route path="/irrigation-advisory" element={<IrrigationAdvisoryPage />} />
            <Route path="/weather" element={<WeatherDashboardPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/my-crops" element={<MyCropsPage />} />
            <Route path="/cultivation-guides" element={<CultivationGuidesPage />} />
            <Route path="/advisory-history" element={<AdvisoryHistoryPage />} />
            <Route path="/advisories/:id" element={<AdvisoryHistoryPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

