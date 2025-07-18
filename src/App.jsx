import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout/Layout';
import AuthRoute from './components/AuthRoute';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import Dashboard from './pages/Dashboard';
import SurveyList from './pages/SurveyList';
import SurveyTaker from './pages/SurveyTaker';
import Results from './pages/Results';
import PersonalityTest from './pages/PersonalityTest';
import { SurveyProvider } from './context/SurveyContext';
import FeedbackButton from './components/Feedback/FeedbackButton';
import questConfig from './config/questConfig';

function App() {
  return (
    <QuestProvider 
      apiKey={questConfig.APIKEY} 
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <SurveyProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={5000} />
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            <Route
              path="/*"
              element={
                <AuthRoute>
                  <Layout>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/surveys" element={<SurveyList />} />
                        <Route path="/survey/:id" element={<SurveyTaker />} />
                        <Route path="/personality-test" element={<PersonalityTest />} />
                        <Route path="/results" element={<Results />} />
                      </Routes>
                    </motion.div>
                    <FeedbackButton />
                  </Layout>
                </AuthRoute>
              }
            />
          </Routes>
        </Router>
      </SurveyProvider>
    </QuestProvider>
  );
}

export default App;