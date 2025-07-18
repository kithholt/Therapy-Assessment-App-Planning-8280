import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiFileText, FiChevronRight, FiCheck } = FiIcons;

const ResultsEmailPreview = ({ response, userEmail }) => {
  const getScoreColor = (level) => {
    const colors = {
      'Minimal': 'text-green-600',
      'Low': 'text-green-600',
      'Mild': 'text-yellow-600',
      'Moderate': 'text-orange-600',
      'High': 'text-red-600',
      'Severe': 'text-red-600'
    };
    return colors[level] || 'text-therapy-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-sm border border-therapy-200 p-6 space-y-4"
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary-100 rounded-full">
          <SafeIcon icon={FiMail} className="text-lg text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-therapy-800">Email Preview</h3>
          <p className="text-sm text-therapy-500">Results will be sent to: {userEmail}</p>
        </div>
      </div>

      <div className="border-t border-b border-therapy-100 py-4 space-y-3">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiFileText} className="text-therapy-400" />
          <span className="text-therapy-700 font-medium">Assessment: {response?.surveyTitle}</span>
        </div>
        
        <div className="flex items-start space-x-2">
          <SafeIcon icon={FiChevronRight} className="text-therapy-400 mt-1" />
          <div>
            <span className="text-therapy-700">Score: {response?.totalScore} - </span>
            <span className={`font-medium ${getScoreColor(response?.scoreRange?.level)}`}>
              {response?.scoreRange?.level}
            </span>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <SafeIcon icon={FiChevronRight} className="text-therapy-400 mt-1" />
          <span className="text-therapy-700">{response?.scoreRange?.description}</span>
        </div>
        
        <div className="flex items-start space-x-2">
          <SafeIcon icon={FiCheck} className="text-green-500 mt-1" />
          <span className="text-therapy-700">
            A copy of these results will also be sent to your therapist.
          </span>
        </div>
      </div>
      
      <div className="text-sm text-therapy-500 italic">
        Note: This is a preview of the email content. The actual email may include additional
        formatting and information.
      </div>
    </motion.div>
  );
};

export default ResultsEmailPreview;