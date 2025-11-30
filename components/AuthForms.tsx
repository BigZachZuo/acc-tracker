
import React, { useState } from 'react';
import { loginUser, registerUser, checkEmailExists, sendVerificationCode, verifyUserOtp } from '../services/storageService';
import Input from './Input';
import Button from './Button';
import { User } from '../types';

interface AuthFormsProps {
  onLogin: (user: User) => void;
  toggleMode: () => void;
  isRegistering: boolean;
}

type AuthStep = 'EMAIL' | 'VERIFY' | 'DETAILS';

const AuthForms: React.FC<AuthFormsProps> = ({ onLogin, toggleMode, isRegistering }) => {
  const [step, setStep] = useState<AuthStep>('EMAIL');
  
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [username, setUsername] = useState('');
  
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when switching modes
  const handleToggleMode = () => {
    setStep('EMAIL');
    setError('');
    setOtpInput('');
    setGeneratedOtp(null);
    toggleMode();
  };

  // Step 1: Send Code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const emailExists = await checkEmailExists(email);

      if (isRegistering && emailExists) {
        setError('This email is already registered. Please login.');
        setIsLoading(false);
        return;
      }

      if (!isRegistering && !emailExists) {
        setError('No account found with this email. Please register.');
        setIsLoading(false);
        return;
      }

      const code = await sendVerificationCode(email);
      setGeneratedOtp(code); // Store code (if local) or status flag
      setStep('VERIFY');
    } catch (err) {
      console.error(err);
      setError('Connection error or invalid email. Please try again.');
    }
    setIsLoading(false);
  };

  // Step 2: Verify Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    let isValid = false;

    // Local/Admin Backdoor check
    if (generatedOtp && generatedOtp !== "SENT_VIA_EMAIL") {
       isValid = otpInput === generatedOtp;
    } else {
       // Real Supabase verification
       isValid = await verifyUserOtp(email, otpInput);
    }

    if (!isValid) {
      setError('Invalid verification code. Please try again.');
      setIsLoading(false);
      return;
    }

    // Code matches
    if (isRegistering) {
      setStep('DETAILS'); // Move to username entry
      setIsLoading(false);
    } else {
      // Login directly
      try {
        const result = await loginUser(email);
        if (result.success && result.user) {
          onLogin(result.user);
        } else {
          setError(result.message || 'Login failed');
        }
      } catch (err) {
        setError('Login error occurred.');
      }
      setIsLoading(false);
    }
  };

  // Step 3: Complete Registration (Only for Register mode)
  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username.trim()) {
      setError('Username is required.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await registerUser(email, username);
      if (result.success) {
        // Auto login
        const loginResult = await loginUser(email);
        if (loginResult.success && loginResult.user) {
          onLogin(loginResult.user);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Registration failed.');
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 animate-fade-in-up mt-20">
      <div className="text-center mb-8 flex flex-col items-center">
        <img 
          src="/assets/ui/logo.png" 
          alt="Assetto Corsa Competizione" 
          className="h-16 w-auto object-contain mb-4"
        />
        <h2 className="text-xl font-bold text-white tracking-widest uppercase">Tracker<span className="text-red-500">Pro</span></h2>
        <p className="text-slate-400 mt-2">
          {isRegistering ? 'Create your driver profile' : 'Welcome back, driver'}
        </p>
      </div>

      {/* Step 1: Email Input */}
      {step === 'EMAIL' && (
        <form onSubmit={handleSendCode} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            autoFocus
          />
          {error && <div className="text-red-500 text-sm text-center font-bold">{error}</div>}
          <Button type="submit" className="w-full py-3 text-lg" isLoading={isLoading}>
            {isLoading ? 'Sending...' : 'Get Verification Code'}
          </Button>
        </form>
      )}

      {/* Step 2: OTP Verification */}
      {step === 'VERIFY' && (
        <form onSubmit={handleVerifyCode} className="space-y-6 animate-fade-in">
          <div className="text-center text-slate-400 text-sm mb-4">
            We sent a code to <span className="text-white font-bold">{email}</span>
            {generatedOtp === "SENT_VIA_EMAIL" && <p className="text-xs text-slate-500 mt-1">(Check your spam folder)</p>}
          </div>
          <Input
            label="Verification Code / Password"
            type="text"
            placeholder="12345678"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
            className="text-center tracking-[0.2em] font-mono text-xl"
            maxLength={30}
            autoFocus
            disabled={isLoading}
          />
          {error && <div className="text-red-500 text-sm text-center font-bold">{error}</div>}
          <Button type="submit" className="w-full py-3 text-lg" isLoading={isLoading}>
            Verify & {isRegistering ? 'Continue' : 'Login'}
          </Button>
          <button 
            type="button" 
            onClick={() => setStep('EMAIL')}
            className="w-full text-slate-500 text-sm hover:text-white"
          >
            Change Email
          </button>
        </form>
      )}

      {/* Step 3: Username (Register Only) */}
      {step === 'DETAILS' && (
        <form onSubmit={handleCompleteRegistration} className="space-y-6 animate-fade-in">
          <div className="bg-green-900/20 border border-green-900/50 text-green-400 p-3 rounded text-center text-sm mb-4">
             ✓ Email Verified
          </div>
          <Input
            label="Driver Name (Username)"
            placeholder="e.g. MaxVerstappen33"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            disabled={isLoading}
          />
          {error && <div className="text-red-500 text-sm text-center font-bold">{error}</div>}
          <Button type="submit" className="w-full py-3 text-lg" isLoading={isLoading}>
            Complete Registration
          </Button>
        </form>
      )}

      <div className="mt-6 text-center pt-6 border-t border-slate-700">
        <p className="text-slate-500 text-sm">
          {isRegistering ? "Already have an account?" : "New to the grid?"}{' '}
          <button onClick={handleToggleMode} className="text-red-500 hover:text-red-400 font-bold ml-1">
            {isRegistering ? 'Login here' : 'Register here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForms;
