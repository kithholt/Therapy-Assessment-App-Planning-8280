import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMail, FiCheck } = FiIcons;

const UserInfoForm = ({ onSubmit, initialData = {}, buttonText = "Continue" }) => {
  const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: initialData.name || '',
      email: initialData.email || ''
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-sm border border-therapy-200 p-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-therapy-700 mb-1">
            Your Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SafeIcon icon={FiUser} className="text-therapy-400" />
            </div>
            <input
              id="name"
              type="text"
              className={`w-full pl-10 pr-4 py-2 border ${errors.name ? 'border-red-300' : 'border-therapy-300'} rounded-lg focus:ring-primary-500 focus:border-primary-500`}
              placeholder="Enter your full name"
              {...register('name', { 
                required: 'Name is required',
                minLength: { 
                  value: 2, 
                  message: 'Name must be at least 2 characters' 
                } 
              })}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-therapy-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SafeIcon icon={FiMail} className="text-therapy-400" />
            </div>
            <input
              id="email"
              type="email"
              className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-300' : 'border-therapy-300'} rounded-lg focus:ring-primary-500 focus:border-primary-500`}
              placeholder="Enter your email address"
              {...register('email', { 
                required: 'Email is required',
                pattern: { 
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                  message: 'Invalid email address' 
                } 
              })}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all ${
              !isValid || isSubmitting
                ? 'bg-therapy-100 text-therapy-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{buttonText}</span>
                <SafeIcon icon={FiCheck} />
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default UserInfoForm;