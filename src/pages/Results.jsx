import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSurvey } from '../context/SurveyContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SafeIcon from '../common/SafeIcon';
import UserInfoForm from '../components/UserInfoForm';
import EmailConsentCheckbox from '../components/EmailConsentCheckbox';
import ResultsEmailPreview from '../components/ResultsEmailPreview';
import * as FiIcons from 'react-icons/fi';
import { format } from 'date-fns';

const { FiBarChart3, FiCalendar, FiTrendingUp, FiAward, FiDownload, FiEye, FiMail, FiSend } = FiIcons;

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getUserResponses, currentUser, updateUserInfo, sendResultsByEmail } = useSurvey();
  const userResponses = getUserResponses();
  const newResponse = location.state?.response;
  
  const [isUserFormComplete, setIsUserFormComplete] = useState(!!currentUser?.name && !!currentUser?.email);
  const [emailConsent, setEmailConsent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResultsSent, setIsResultsSent] = useState(false);

  const getScoreColor = (level) => {
    const colors = {
      'Minimal': 'text-green-600 bg-green-100',
      'Low': 'text-green-600 bg-green-100',
      'Mild': 'text-yellow-600 bg-yellow-100',
      'Moderate': 'text-orange-600 bg-orange-100',
      'High': 'text-red-600 bg-red-100',
      'Severe': 'text-red-600 bg-red-100'
    };
    return colors[level] || 'text-gray-600 bg-gray-100';
  };

  const getScoreIcon = (level) => {
    if (['Minimal', 'Low'].includes(level)) return FiTrendingUp;
    if (['Mild', 'Moderate'].includes(level)) return FiBarChart3;
    return FiAward;
  };

  const handleUserInfoSubmit = (data) => {
    updateUserInfo(data.name, data.email);
    setIsUserFormComplete(true);
    toast.success("Information saved successfully!");
  };

  const handleSendResults = async () => {
    if (!currentUser.name || !currentUser.email) {
      toast.error("Please provide your name and email first.");
      return;
    }
    
    setIsSending(true);
    try {
      const result = await sendResultsByEmail({
        response: newResponse,
        userInfo: currentUser,
        subscribeToNewsletter: emailConsent
      });
      
      if (result.success) {
        toast.success("Results sent successfully!");
        setIsResultsSent(true);
      } else {
        toast.error(result.message || "Failed to send results.");
      }
    } catch (error) {
      console.error("Error sending results:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  // Show new result first if available
  if (newResponse) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <ToastContainer position="top-right" autoClose={5000} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-therapy-200 p-8 text-center"
        >
          <SafeIcon icon={FiAward} className="text-4xl text-primary-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-therapy-800 mb-2">Assessment Complete</h1>
          <p className="text-therapy-600">Here are your results for {newResponse.surveyTitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-therapy-200 p-8"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-primary-600">{newResponse.totalScore}</span>
            </div>
            <h2 className="text-2xl font-bold text-therapy-800 mb-2">Your Score</h2>
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${getScoreColor(newResponse.scoreRange?.level)}`}>
              <SafeIcon icon={getScoreIcon(newResponse.scoreRange?.level)} className="mr-2" />
              <span className="font-semibold">{newResponse.scoreRange?.level}</span>
            </div>
          </div>

          <div className="bg-therapy-50 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-therapy-800 mb-2">Interpretation</h3>
            <p className="text-therapy-600">{newResponse.scoreRange?.description}</p>
          </div>

          {!isUserFormComplete && (
            <>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-therapy-800 mb-2">
                  Enter your information to receive results by email
                </h3>
                <p className="text-therapy-600 text-sm">
                  Your results will be sent to you and to your therapist
                </p>
              </div>
              
              <UserInfoForm 
                onSubmit={handleUserInfoSubmit}
                initialData={currentUser}
                buttonText="Save Information"
              />
            </>
          )}
          
          {isUserFormComplete && !isResultsSent && (
            <>
              <EmailConsentCheckbox 
                checked={emailConsent}
                onChange={() => setEmailConsent(!emailConsent)}
              />
              
              <ResultsEmailPreview 
                response={newResponse}
                userEmail={currentUser.email}
              />
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleSendResults}
                  disabled={isSending}
                  className={`flex items-center space-x-2 px-8 py-3 rounded-lg transition-all ${
                    isSending
                      ? 'bg-therapy-100 text-therapy-400 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiSend} />
                      <span>Send Results</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
          
          {isResultsSent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <SafeIcon icon={FiMail} className="text-green-600 text-2xl mb-2" />
              <h3 className="text-lg font-semibold text-green-800 mb-1">Results Sent Successfully!</h3>
              <p className="text-green-700 text-sm mb-4">
                Your results have been sent to {currentUser.email} and your therapist.
              </p>
              <button
                onClick={() => navigate('/surveys')}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Take Another Assessment
              </button>
            </motion.div>
          )}

          {!isResultsSent && (
            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate('/surveys')}
                className="px-6 py-2 text-primary-600 hover:text-primary-800 transition-colors"
              >
                Continue Without Sending
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-therapy-800 mb-2">Assessment Results</h1>
        <p className="text-therapy-600">Track your mental health journey over time</p>
      </motion.div>

      {userResponses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-therapy-200 p-12 text-center"
        >
          <SafeIcon icon={FiBarChart3} className="text-4xl text-therapy-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-therapy-800 mb-2">No Results Yet</h2>
          <p className="text-therapy-600 mb-6">
            Complete your first assessment to see your results here
          </p>
          <button
            onClick={() => window.location.href = '#/surveys'}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Take Your First Survey
          </button>
        </motion.div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-therapy-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-therapy-600">Total Assessments</p>
                  <p className="text-2xl font-bold text-therapy-800">{userResponses.length}</p>
                </div>
                <SafeIcon icon={FiBarChart3} className="text-2xl text-primary-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-therapy-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-therapy-600">Latest Score</p>
                  <p className="text-2xl font-bold text-therapy-800">
                    {userResponses[userResponses.length - 1]?.totalScore || 0}
                  </p>
                </div>
                <SafeIcon icon={FiTrendingUp} className="text-2xl text-green-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-therapy-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-therapy-600">Last Assessment</p>
                  <p className="text-2xl font-bold text-therapy-800">
                    {userResponses.length > 0 
                      ? format(new Date(userResponses[userResponses.length - 1].completedAt), 'MMM dd')
                      : 'Never'
                    }
                  </p>
                </div>
                <SafeIcon icon={FiCalendar} className="text-2xl text-blue-600" />
              </div>
            </motion.div>
          </div>

          {/* Results List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-therapy-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-therapy-800">Assessment History</h2>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-4 py-2 text-therapy-600 hover:text-primary-600 transition-colors">
                  <SafeIcon icon={FiDownload} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {userResponses.slice().reverse().map((response, index) => (
                <motion.div
                  key={response.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-therapy-50 rounded-lg hover:bg-therapy-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg border border-therapy-200">
                      <span className="font-bold text-therapy-800">{response.totalScore}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-therapy-800">{response.surveyTitle}</h3>
                      <p className="text-sm text-therapy-600">
                        {format(new Date(response.completedAt), 'MMM dd, yyyy • h:mm a')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(response.scoreRange?.level)}`}>
                      {response.scoreRange?.level}
                    </div>
                    <button className="p-2 text-therapy-600 hover:text-primary-600 transition-colors">
                      <SafeIcon icon={FiEye} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200"
      >
        <h3 className="font-bold text-primary-800 mb-2">Understanding Your Results</h3>
        <p className="text-primary-700 text-sm mb-3">
          Your assessment results provide valuable insights into your mental health status. 
          Regular monitoring can help you track changes over time and identify patterns.
        </p>
        <p className="text-primary-600 text-xs">
          <strong>Important:</strong> These results are for informational purposes only and should not 
          replace professional medical advice. If you're experiencing concerning symptoms, please 
          consult with a mental health professional.
        </p>
      </motion.div>
    </div>
  );
};

export default Results;