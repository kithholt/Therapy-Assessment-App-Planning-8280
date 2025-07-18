import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSurvey } from '../context/SurveyContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import UserInfoForm from '../components/UserInfoForm';

const { FiChevronLeft, FiChevronRight, FiCheck, FiAlertCircle, FiUser } = FiIcons;

const SurveyTaker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { surveys, submitSurveyResponse, currentUser, updateUserInfo } = useSurvey();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [survey, setSurvey] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [isUserInfoComplete, setIsUserInfoComplete] = useState(!!currentUser?.name && !!currentUser?.email);

  useEffect(() => {
    const foundSurvey = surveys.find(s => s.id === id);
    if (foundSurvey) {
      setSurvey(foundSurvey);
    } else {
      navigate('/surveys');
    }
  }, [id, surveys, navigate]);

  useEffect(() => {
    setIsUserInfoComplete(!!currentUser?.name && !!currentUser?.email);
  }, [currentUser]);

  if (!survey) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <SafeIcon icon={FiAlertCircle} className="text-4xl text-therapy-400 mb-4" />
          <p className="text-therapy-600">Survey not found</p>
        </div>
      </div>
    );
  }

  const currentQuestion = survey.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;
  const canProceed = answers[currentQuestion.id] !== undefined;

  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      if (isUserInfoComplete) {
        handleSubmit();
      } else {
        setShowUserForm(true);
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (showUserForm) {
      setShowUserForm(false);
      return;
    }
    
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleUserInfoSubmit = (data) => {
    updateUserInfo(data.name, data.email);
    handleSubmit();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = submitSurveyResponse(survey.id, answers);
      navigate('/results', { state: { response } });
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-therapy-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-therapy-800">{survey.title}</h1>
          <span className="text-sm text-therapy-500">
            {showUserForm ? 'Final Step' : `${currentQuestionIndex + 1} of ${survey.questions.length}`}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-therapy-200 rounded-full h-2">
          <motion.div
            className="bg-primary-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: showUserForm ? '100%' : `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Question or User Form */}
      <AnimatePresence mode="wait">
        {showUserForm ? (
          <motion.div
            key="user-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-therapy-200 p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary-100 rounded-full">
                <SafeIcon icon={FiUser} className="text-lg text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-therapy-800">Your Information</h2>
                <p className="text-sm text-therapy-600">
                  Please provide your details to complete the assessment
                </p>
              </div>
            </div>
            
            <UserInfoForm 
              onSubmit={handleUserInfoSubmit}
              initialData={currentUser}
              buttonText="Complete Assessment"
            />
          </motion.div>
        ) : (
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-therapy-200 p-8"
          >
            <h2 className="text-xl font-semibold text-therapy-800 mb-6">
              {currentQuestion.text}
            </h2>

            {currentQuestion.type === 'scale' && (
              <div className="space-y-3">
                {currentQuestion.scale.labels.map((label, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(currentQuestion.scale.min + index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      answers[currentQuestion.id] === currentQuestion.scale.min + index
                        ? 'border-primary-600 bg-primary-50 text-primary-800'
                        : 'border-therapy-200 hover:border-therapy-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{label}</span>
                      <span className="text-sm text-therapy-500">
                        {currentQuestion.scale.min + index}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 && !showUserForm}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
            currentQuestionIndex === 0 && !showUserForm
              ? 'bg-therapy-100 text-therapy-400 cursor-not-allowed'
              : 'bg-white text-therapy-600 hover:bg-therapy-50 border border-therapy-200'
          }`}
        >
          <SafeIcon icon={FiChevronLeft} />
          <span>Previous</span>
        </button>

        {!showUserForm && (
          <button
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
              !canProceed || isSubmitting
                ? 'bg-therapy-100 text-therapy-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>{isLastQuestion ? 'Continue' : 'Next'}</span>
                <SafeIcon icon={FiChevronRight} />
              </>
            )}
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default SurveyTaker;