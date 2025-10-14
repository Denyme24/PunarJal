'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isSignup, setIsSignup] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { signup, login } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    organizationName: '',
    organizationEmail: '',
    organizationType: '',
    location: '',
    role: 'Plant Operator' as 'Plant Operator' | 'Environmental Officer',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignup) {
        // Signup validation
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }

        await signup({
          organizationName: formData.organizationName,
          organizationEmail: formData.organizationEmail,
          organizationType: formData.organizationType,
          location: formData.location,
          role: formData.role,
          password: formData.password,
        });

        toast.success('Account created successfully!');
      } else {
        // Login
        await login(formData.organizationEmail, formData.password);
        toast.success('Login successful!');
      }

      onClose();
      // Role-based onboarding redirect
      const next = isSignup
        ? formData.role === 'Plant Operator'
          ? '/onboarding/plant-operator'
          : '/onboarding/environmental-officer'
        : '/simulation';
      router.push(next);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      organizationName: '',
      organizationEmail: '',
      organizationType: '',
      location: '',
      role: 'Plant Operator',
      password: '',
      confirmPassword: '',
    });
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isSignup ? 'Create an Account' : 'Welcome Back'}
          </DialogTitle>
          <DialogDescription>
            {isSignup
              ? 'Sign up to start your wastewater treatment simulation'
              : 'Sign in to continue to your simulation'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {isSignup && (
            <>
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name *</Label>
                <Input
                  id="organizationName"
                  placeholder="Enter your organization name"
                  value={formData.organizationName}
                  onChange={e =>
                    handleChange('organizationName', e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationType">Organization Type *</Label>
                <Select
                  value={formData.organizationType}
                  onValueChange={value =>
                    handleChange('organizationType', value)
                  }
                  required
                >
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={value => handleChange('role', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plant Operator">
                      Plant Operator
                    </SelectItem>
                    <SelectItem value="Environmental Officer">
                      Environmental Officer
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (Bangalore) *</Label>
                <Select
                  value={formData.location}
                  onValueChange={value => handleChange('location', value)}
                  required
                >
                  <SelectTrigger>
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
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="organizationEmail">Organization Email *</Label>
            <Input
              id="organizationEmail"
              type="email"
              placeholder="organization@example.com"
              value={formData.organizationEmail}
              onChange={e => handleChange('organizationEmail', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={e => handleChange('password', e.target.value)}
              required
            />
          </div>

          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={e => handleChange('confirmPassword', e.target.value)}
                required
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Sign In'}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
            </span>{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-cyan-600 hover:text-cyan-700 font-semibold"
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
