import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSurvey } from '../context/SurveyContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClock, FiPlay, FiTag, FiTrendingUp } = FiIcons;

const SurveyList = () => {
  const { surveys } = useSurvey();

  const categoryColors = {
    'Mental Health': 'bg-red-100 text-red-800',
    'Wellness': 'bg-green-100 text-green-800',
    'Personality': 'bg-purple-100 text-purple-800',
    'Default': 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-therapy-800 mb-2">Available Surveys</h1>
        <p className="text-therapy-600">
          Choose from our collection of validated mental health assessments
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {surveys.map((survey, index) => (
          <motion.div
            key={survey.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-therapy-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-therapy-800 mb-2 group-hover:text-primary-600 transition-colors">
                    {survey.title}
                  </h3>
                  <p className="text-therapy-600 text-sm mb-3">
                    {survey.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1 text-sm text-therapy-500">
                  <SafeIcon icon={FiClock} className="text-xs" />
                  <span>{survey.estimatedTime}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-therapy-500">
                  <SafeIcon icon={FiTrendingUp} className="text-xs" />
                  <span>{survey.questions.length} questions</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiTag} className="text-xs text-therapy-400" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    categoryColors[survey.category] || categoryColors.Default
                  }`}>
                    {survey.category}
                  </span>
                </div>
                
                <Link
                  to={`/survey/${survey.id}`}
                  className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors group"
                >
                  <SafeIcon icon={FiPlay} className="text-sm group-hover:translate-x-1 transition-transform" />
                  <span className="font-medium">Start</span>
                </Link>
              </div>
            </div>

            <div className="bg-therapy-50 px-6 py-3 border-t border-therapy-100">
              <div className="flex items-center justify-between text-xs text-therapy-500">
                <span>Scoring: {survey.scoring.ranges.length} levels</span>
                <span>Validated assessment</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200"
      >
        <h2 className="text-lg font-bold text-primary-800 mb-2">Assessment Information</h2>
        <p className="text-primary-700 text-sm mb-3">
          These assessments are based on validated psychological instruments. They are designed to provide 
          insights into your mental health status and should be used as a starting point for discussion 
          with mental health professionals.
        </p>
        <p className="text-primary-600 text-xs">
          <strong>Note:</strong> These tools are not diagnostic and should not replace professional medical advice.
        </p>
      </motion.div>
    </div>
  );
};

export default SurveyList;