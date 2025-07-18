import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import SafeIcon from '../../common/SafeIcon'
import { signUp } from '../../lib/supabase'
import * as FiIcons from 'react-icons/fi'

const { FiMail, FiLock, FiUser, FiUserPlus } = FiIcons

const SignUp = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await signUp(formData.email, formData.password, formData.name)
      toast.success('Account created successfully! Please sign in.')
      navigate('/signin')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-therapy-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-therapy-800">Create Account</h2>
          <p className="mt-2 text-therapy-600">Sign up to start your assessment journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-therapy-700">
              Full Name
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <SafeIcon icon={FiUser} className="text-therapy-400" />
              </div>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-therapy-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-therapy-700">
              Email Address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <SafeIcon icon={FiMail} className="text-therapy-400" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-therapy-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-therapy-700">
              Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <SafeIcon icon={FiLock} className="text-therapy-400" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-therapy-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Choose a password"
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <SafeIcon icon={FiUserPlus} className="mr-2" />
                Sign Up
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-therapy-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signin')}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default SignUp