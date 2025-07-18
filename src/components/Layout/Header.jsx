import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import { useSurvey } from '../../context/SurveyContext';
import * as FiIcons from 'react-icons/fi';

const { FiActivity, FiUser, FiBell, FiSettings } = FiIcons;

const Header = () => {
  const { currentUser } = useSurvey();
  
  return (
    <motion.header 
      className="bg-white shadow-sm border-b border-therapy-200 px-6 py-4"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiActivity} className="text-primary-600 text-2xl" />
          <h1 className="text-xl font-bold text-therapy-800">TherapyAssess</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-therapy-600 hover:text-primary-600 transition-colors">
            <SafeIcon icon={FiBell} className="text-xl" />
          </button>
          <button className="p-2 text-therapy-600 hover:text-primary-600 transition-colors">
            <SafeIcon icon={FiSettings} className="text-xl" />
          </button>
          <div className="flex items-center space-x-2 bg-therapy-100 px-3 py-2 rounded-lg">
            <SafeIcon icon={FiUser} className="text-therapy-600" />
            <span className="text-sm font-medium text-therapy-700">
              {currentUser.name || "Anonymous User"}
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;