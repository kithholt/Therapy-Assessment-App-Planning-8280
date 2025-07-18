import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiClipboard, FiUsers, FiBarChart3, FiHeart } = FiIcons;

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/surveys', icon: FiClipboard, label: 'Surveys' },
    { path: '/personality-test', icon: FiUsers, label: 'Personality Test' },
    { path: '/results', icon: FiBarChart3, label: 'Results' },
  ];

  return (
    <motion.aside 
      className="fixed left-0 top-16 h-full w-64 bg-white shadow-lg border-r border-therapy-200 z-40"
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-600'
                    : 'text-therapy-600 hover:bg-therapy-100 hover:text-therapy-800'
                }`}
              >
                <SafeIcon icon={item.icon} className="text-xl" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </nav>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <SafeIcon icon={FiHeart} className="text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">Wellness Tip</span>
          </div>
          <p className="text-xs text-primary-600">
            Regular self-assessment can help track your mental health journey and identify patterns.
          </p>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;