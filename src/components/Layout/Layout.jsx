import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-therapy-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <motion.main 
          className="flex-1 ml-64 p-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;