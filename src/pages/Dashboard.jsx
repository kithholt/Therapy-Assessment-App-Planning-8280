import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSurvey } from '../context/SurveyContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClipboard, FiUsers, FiBarChart3, FiTrendingUp, FiCalendar, FiAward } = FiIcons;

const Dashboard = () => {
  const { surveys, getUserResponses } = useSurvey();
  const userResponses = getUserResponses();
  const recentResponses = userResponses.slice(-3);

  const stats = [
    {
      title: 'Available Surveys',
      value: surveys.length,
      icon: FiClipboard,
      color: 'bg-blue-500',
      trend: '+2 this month'
    },
    {
      title: 'Completed Assessments',
      value: userResponses.length,
      icon: FiBarChart3,
      color: 'bg-green-500',
      trend: `${userResponses.length > 0 ? '+' + userResponses.length : '0'} total`
    },
    {
      title: 'Personality Tests',
      value: '1',
      icon: FiUsers,
      color: 'bg-purple-500',
      trend: 'Big Five available'
    },
    {
      title: 'Progress Tracking',
      value: userResponses.length > 1 ? 'Active' : 'Start',
      icon: FiTrendingUp,
      color: 'bg-orange-500',
      trend: 'Track your journey'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-therapy-800 mb-2">Welcome to TherapyAssess</h1>
        <p className="text-therapy-600 text-lg">
          Your personal mental health assessment and tracking platform
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-therapy-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-therapy-600">{stat.title}</p>
                <p className="text-2xl font-bold text-therapy-800 mt-1">{stat.value}</p>
                <p className="text-xs text-therapy-500 mt-1">{stat.trend}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <SafeIcon icon={stat.icon} className="text-white text-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-therapy-200 p-6"
      >
        <h2 className="text-xl font-bold text-therapy-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/surveys"
            className="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors group"
          >
            <SafeIcon icon={FiClipboard} className="text-primary-600 text-xl group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-semibold text-therapy-800">Take Survey</h3>
              <p className="text-sm text-therapy-600">Complete a mental health assessment</p>
            </div>
          </Link>

          <Link
            to="/personality-test"
            className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
          >
            <SafeIcon icon={FiUsers} className="text-purple-600 text-xl group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-semibold text-therapy-800">Personality Test</h3>
              <p className="text-sm text-therapy-600">Discover your personality type</p>
            </div>
          </Link>

          <Link
            to="/results"
            className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
          >
            <SafeIcon icon={FiBarChart3} className="text-green-600 text-xl group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-semibold text-therapy-800">View Results</h3>
              <p className="text-sm text-therapy-600">Check your assessment history</p>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Recent Activity */}
      {recentResponses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-therapy-200 p-6"
        >
          <h2 className="text-xl font-bold text-therapy-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentResponses.map((response, index) => (
              <div key={response.id} className="flex items-center space-x-3 p-3 bg-therapy-50 rounded-lg">
                <SafeIcon icon={FiAward} className="text-primary-600" />
                <div className="flex-1">
                  <p className="font-medium text-therapy-800">{response.surveyTitle}</p>
                  <p className="text-sm text-therapy-600">
                    Score: {response.totalScore} - {response.scoreRange?.level}
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-xs text-therapy-500">
                  <SafeIcon icon={FiCalendar} className="text-xs" />
                  <span>{new Date(response.completedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;