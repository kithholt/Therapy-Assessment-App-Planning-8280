import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiInfo } = FiIcons;

const EmailConsentCheckbox = ({ checked, onChange, id = "email-consent" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="flex items-start space-x-3 p-4 bg-therapy-50 rounded-lg border border-therapy-200"
    >
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-primary-600 border-therapy-300 rounded focus:ring-primary-500"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="font-medium text-therapy-700">
          Subscribe to newsletter
        </label>
        <p className="text-therapy-500">
          I agree to receive helpful mental health resources, tips, and occasional updates. 
          You can unsubscribe at any time.
        </p>
      </div>
    </motion.div>
  );
};

export default EmailConsentCheckbox;