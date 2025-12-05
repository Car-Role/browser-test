import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Twitch,
  Gamepad2,
  ArrowRight,
  Loader2,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Users,
  Radio,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Tab component for switching between Sign Up and Log In
function AuthTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex bg-[#27272a]/50 rounded-xl p-1 mb-6">
      {['signup', 'login'].map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all',
            activeTab === tab
              ? 'bg-[#18181b] text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          )}
        >
          {tab === 'signup' ? 'Sign Up' : 'Log In'}
        </button>
      ))}
    </div>
  );
}

// Input component
function Input({ icon: Icon, type = 'text', placeholder, value, onChange, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
        <Icon className="w-5 h-5" />
      </div>
      <input
        type={isPassword && showPassword ? 'text' : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          'w-full pl-12 pr-12 py-3.5 rounded-xl bg-[#27272a]/50 border text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition-all',
          error ? 'border-red-500' : 'border-[#3f3f46]'
        )}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
}

// Divider with text
function Divider({ text }) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-[#27272a]" />
      <span className="text-sm text-zinc-500">{text}</span>
      <div className="flex-1 h-px bg-[#27272a]" />
    </div>
  );
}

// Role Selection Card
function RoleCard({ role, icon: Icon, title, description, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-6 rounded-2xl border text-left transition-all',
        selected
          ? 'bg-[#06B6D4]/10 border-[#06B6D4]/50 ring-2 ring-[#06B6D4]/30'
          : 'bg-[#18181b]/50 border-[#27272a] hover:border-[#3f3f46] hover:bg-[#18181b]'
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
            selected ? 'bg-[#06B6D4]/20' : 'bg-[#27272a]'
          )}
        >
          <Icon className={cn('w-6 h-6', selected ? 'text-[#06B6D4]' : 'text-zinc-400')} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">{title}</h3>
            <div
              className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                selected ? 'border-[#06B6D4] bg-[#06B6D4]' : 'border-zinc-600'
              )}
            >
              {selected && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div>
          </div>
          <p className="text-sm text-zinc-400 mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
}

// Sign Up Form
function SignUpForm({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!username.trim()) newErrors.username = 'Username is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          icon={User}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-400">{errors.username}</p>
        )}
      </div>
      <div>
        <Input
          icon={Mail}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
      </div>
      <div>
        <Input
          icon={Lock}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-[#06B6D4] hover:bg-[#0891B2] text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            Create Account
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}

// Log In Form
function LogInForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError('Please enter your email and password');
      return;
    }

    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
          {error}
        </div>
      )}
      <Input
        icon={Mail}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        icon={Lock}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex justify-end">
        <button type="button" className="text-sm text-[#06B6D4] hover:underline">
          Forgot password?
        </button>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-[#06B6D4] hover:bg-[#0891B2] text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Logging in...
          </>
        ) : (
          <>
            Log In
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}

// Twitch OAuth Button
function TwitchAuthButton({ onSuccess, label = 'Continue with Twitch' }) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full py-4 rounded-xl bg-[#9146FF] hover:bg-[#7c3aed] text-white font-semibold flex items-center justify-center gap-3 transition-all disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Twitch className="w-5 h-5" />
          {label}
        </>
      )}
    </button>
  );
}

// Role Selection Step
function RoleSelection({ onSelect }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (selectedRole) {
      onSelect(selectedRole);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
        >
          <Sparkles className="w-8 h-8 text-emerald-400" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to ViewerQ!</h2>
        <p className="text-zinc-400">How will you be using ViewerQ?</p>
      </div>

      <div className="space-y-4 mb-6">
        <RoleCard
          role="streamer"
          icon={Radio}
          title="I'm a Streamer"
          description="I want to play games with my viewers and manage queues"
          selected={selectedRole === 'streamer'}
          onClick={() => setSelectedRole('streamer')}
        />
        <RoleCard
          role="viewer"
          icon={Users}
          title="I'm a Viewer"
          description="I want to join games with my favorite streamers"
          selected={selectedRole === 'viewer'}
          onClick={() => setSelectedRole('viewer')}
        />
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedRole}
        className={cn(
          'w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all',
          selectedRole
            ? 'bg-[#06B6D4] hover:bg-[#0891B2] text-white'
            : 'bg-[#27272a] text-zinc-600 cursor-not-allowed border border-transparent'
        )}
      >
        Continue
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

// Main Auth Component
function Auth() {
  const [step, setStep] = useState('auth'); // 'auth' | 'role'
  const [activeTab, setActiveTab] = useState('signup');

  const handleAuthSuccess = () => {
    setStep('role');
  };

  const handleRoleSelect = (role) => {
    // Navigate to appropriate setup flow
    window.location.hash = role === 'streamer' ? '#streamer-setup' : '#viewer-setup';
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans flex flex-col">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[40vw] h-[40vw] bg-[#06B6D4]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[30vw] h-[30vw] bg-[#06B6D4]/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-[#06B6D4] to-[#0891B2] rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">ViewerQ</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          {step === 'auth' ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <div className="p-8 rounded-2xl bg-[#18181b]/80 border border-[#27272a] backdrop-blur-sm">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {activeTab === 'signup' ? 'Create your account' : 'Welcome back'}
                  </h1>
                  <p className="text-zinc-400">
                    {activeTab === 'signup'
                      ? 'Start playing with your community'
                      : 'Log in to continue'}
                  </p>
                </div>

                <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Twitch OAuth - Primary */}
                <TwitchAuthButton
                  onSuccess={handleAuthSuccess}
                  label={activeTab === 'signup' ? 'Sign up with Twitch' : 'Log in with Twitch'}
                />

                <Divider text="or" />

                {/* Email/Password Form */}
                {activeTab === 'signup' ? (
                  <SignUpForm onSuccess={handleAuthSuccess} />
                ) : (
                  <LogInForm onSuccess={handleAuthSuccess} />
                )}

                {/* Terms */}
                {activeTab === 'signup' && (
                  <p className="text-xs text-zinc-500 text-center mt-6">
                    By signing up, you agree to our{' '}
                    <a href="#" className="text-[#06B6D4] hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-[#06B6D4] hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                )}
              </div>

              {/* Back to home */}
              <div className="text-center mt-6">
                <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
                  ← Back to home
                </a>
              </div>
            </motion.div>
          ) : (
            <RoleSelection key="role" onSelect={handleRoleSelect} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Auth;
