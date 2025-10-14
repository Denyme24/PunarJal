'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, MessageCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BANGALORE_LOCATIONS = [
  'Whitefield',
  'Electronic City',
  'Koramangala',
  'Indiranagar',
  'JP Nagar',
  'Jayanagar',
  'BTM Layout',
  'HSR Layout',
  'Marathahalli',
  'Sarjapur Road',
  'Hebbal',
  'Yelahanka',
  'Banashankari',
  'Rajajinagar',
  'Malleshwaram',
  'Yeshwanthpur',
  'Peenya',
  'Bommanahalli',
  'Mahadevapura',
  'Dasarahalli',
  'RR Nagar',
  'Kengeri',
  'Hennur',
  'Bellandur',
  'MG Road',
];

const ORGANIZATION_TYPES = [
  'Hospital',
  'Hotel',
  'Restaurant',
  'Manufacturing Industry',
  'IT/Tech Company',
  'Educational Institution',
  'Shopping Mall',
  'Residential Complex',
  'Commercial Complex',
  'Food Processing Unit',
  'Pharmaceutical Company',
  'Textile Industry',
  'Other',
];

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<
    'Plant Operator' | 'Environmental Officer' | null
  >(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    organizationName: '',
    organizationEmail: '',
    organizationType: '',
    location: '',
    role: 'Plant Operator' as 'Plant Operator' | 'Environmental Officer',
    password: '',
    confirmPassword: '',
  });

  const { login, signup } = useAuth();
  const router = useRouter();

  const handleRoleSelect = (
    role: 'Plant Operator' | 'Environmental Officer'
  ) => {
    setSelectedRole(role);
    // Update signup data role when role is selected
    setSignupData({ ...signupData, role });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginData.email, loginData.password);
      toast.success('Login successful!');

      // Redirect to simulation page after login
      router.push('/simulation');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        organizationName: signupData.organizationName,
        organizationEmail: signupData.organizationEmail,
        organizationType: signupData.organizationType,
        location: signupData.location,
        role: signupData.role,
        password: signupData.password,
      });

      toast.success('Account created successfully!');

      // Redirect based on role
      if (signupData.role === 'Plant Operator') {
        router.push('/onboarding/plant-operator');
      } else {
        router.push('/onboarding/environmental-officer');
      }
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info('Google authentication coming soon!');
  };

  const handleForgotPassword = () => {
    toast.info('Password reset functionality coming soon!');
  };

  const handleHelpClick = () => {
    router.push('/ai-agos');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <motion.div
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      >
        {/* Left Side - Role Selection */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        >
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              onClick={handleBackToHome}
              variant="ghost"
              className="text-white hover:bg-white/10 p-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </motion.div>

          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
              <img
                src="/assets/logo.png"
                alt="PunarJal Logo"
                className="h-24 w-24"
              />
              <h1 className="text-4xl font-bold text-white">
                Welcome to PunarJal
              </h1>
            </div>
            <p className="text-lg text-gray-300">
              Smart Water Recovery & Reuse System
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Choose your role
            </h2>

            <div className="space-y-4">
              {/* Plant Operator Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 ${
                    selectedRole === 'Plant Operator'
                      ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/30'
                      : 'bg-gray-800/60 border-gray-700 hover:bg-gray-700/60'
                  }`}
                  onClick={() => handleRoleSelect('Plant Operator')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-lg transition-all duration-300 ${
                          selectedRole === 'Plant Operator'
                            ? 'bg-white/20 scale-110'
                            : 'bg-blue-600'
                        }`}
                      >
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                          <path d="M6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">
                          Plant Operator
                        </h3>
                        <p className="text-gray-300">
                          Monitor and control plant operations
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Environmental Officer Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 ${
                    selectedRole === 'Environmental Officer'
                      ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/30'
                      : 'bg-gray-800/60 border-gray-700 hover:bg-gray-700/60'
                  }`}
                  onClick={() => handleRoleSelect('Environmental Officer')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-lg transition-all duration-300 ${
                          selectedRole === 'Environmental Officer'
                            ? 'bg-white/20 scale-110'
                            : 'bg-blue-600'
                        }`}
                      >
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">
                          Environmental Officer
                        </h3>
                        <p className="text-gray-300">
                          Review compliance and environmental data
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Login/Signup Form */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Get Started
            </h2>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <TabsList className="grid w-full grid-cols-2 bg-gray-800/60">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-300"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-all duration-300"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
              </motion.div>

              {/* Login Tab */}
              <TabsContent value="login" className="mt-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'login' && (
                    <motion.form
                      key="login-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      onSubmit={handleLogin}
                      className="space-y-4"
                    >
                      {/* Email Field */}
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-white">
                          Email
                        </Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your email"
                          value={loginData.email}
                          onChange={e =>
                            setLoginData({
                              ...loginData,
                              email: e.target.value,
                            })
                          }
                          className="bg-gray-800/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                          required
                        />
                      </div>

                      {/* Password Field */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label
                            htmlFor="login-password"
                            className="text-white"
                          >
                            Password
                          </Label>
                          <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-sm text-blue-400 hover:text-blue-300"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <Input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={e =>
                              setLoginData({
                                ...loginData,
                                password: e.target.value,
                              })
                            }
                            className="bg-gray-800/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Login Button */}
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                      >
                        {isLoading ? 'Logging in...' : 'Login'}
                      </Button>

                      {/* Divider */}
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-slate-800 text-gray-400">
                            Or continue with
                          </span>
                        </div>
                      </div>

                      {/* Google Login Button */}
                      <Button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 py-3"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          <span>Google</span>
                        </div>
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup" className="mt-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'signup' && (
                    <motion.form
                      key="signup-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      onSubmit={handleSignup}
                      className="space-y-4"
                    >
                      {/* Organization Name */}
                      <div className="space-y-2">
                        <Label htmlFor="org-name" className="text-white">
                          Organization Name
                        </Label>
                        <Input
                          id="org-name"
                          placeholder="Enter your organization name"
                          value={signupData.organizationName}
                          onChange={e =>
                            setSignupData({
                              ...signupData,
                              organizationName: e.target.value,
                            })
                          }
                          className="bg-gray-800/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                          required
                        />
                      </div>

                      {/* Organization Type */}
                      <div className="space-y-2">
                        <Label htmlFor="org-type" className="text-white">
                          Organization Type
                        </Label>
                        <Select
                          value={signupData.organizationType}
                          onValueChange={value =>
                            setSignupData({
                              ...signupData,
                              organizationType: value,
                            })
                          }
                          required
                        >
                          <SelectTrigger className="bg-gray-800/60 border-gray-600 text-white">
                            <SelectValue placeholder="Select organization type" />
                          </SelectTrigger>
                          <SelectContent>
                            {ORGANIZATION_TYPES.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-white">
                          Location (Bangalore)
                        </Label>
                        <Select
                          value={signupData.location}
                          onValueChange={value =>
                            setSignupData({ ...signupData, location: value })
                          }
                          required
                        >
                          <SelectTrigger className="bg-gray-800/60 border-gray-600 text-white">
                            <SelectValue placeholder="Select your location" />
                          </SelectTrigger>
                          <SelectContent>
                            {BANGALORE_LOCATIONS.map(location => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-white">
                          Email
                        </Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={signupData.organizationEmail}
                          onChange={e =>
                            setSignupData({
                              ...signupData,
                              organizationEmail: e.target.value,
                            })
                          }
                          className="bg-gray-800/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                          required
                        />
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-white">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={signupData.password}
                            onChange={e =>
                              setSignupData({
                                ...signupData,
                                password: e.target.value,
                              })
                            }
                            className="bg-gray-800/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="confirm-password"
                          className="text-white"
                        >
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={signupData.confirmPassword}
                            onChange={e =>
                              setSignupData({
                                ...signupData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="bg-gray-800/60 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Signup Button */}
                      <Button
                        type="submit"
                        disabled={isLoading || !selectedRole}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                      >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Help Button - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1, ease: 'easeOut' }}
      >
        <Button
          onClick={handleHelpClick}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Need Help? Ask Aqua AI</span>
          </div>
        </Button>
      </motion.div>
    </motion.div>
  );
}
