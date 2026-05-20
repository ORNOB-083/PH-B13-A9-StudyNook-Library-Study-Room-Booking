'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { authClient } from '../../lib/auth-client';
import { FcGoogle } from 'react-icons/fc';
import { HiEye, HiEyeOff, HiArrowRight } from 'react-icons/hi';
import { MdEmail, MdLock } from 'react-icons/md';

function FloatingInput({ id, label, type = 'text', value, onChange, icon: Icon, extra }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`relative flex items-center gap-3 rounded-2xl px-5 pt-5 pb-4 border bg-white cursor-text transition-all duration-300 ${
          focused
            ? 'border-[#1D3557] shadow-md'
            : 'border-[#A8DADC]/50 hover:border-[#457B9D]/70 hover:shadow-sm'
        }`}
      >
        <Icon
          size={20}
          className={`shrink-0 transition-colors duration-300 mt-0.5 ${
            focused ? 'text-[#1D3557]' : 'text-[#457B9D]'
          }`}
        />
        <div className="flex-1 relative min-w-0">
          <motion.span
            animate={
              active
                ? { y: -14, scale: 0.75, color: focused ? '#1D3557' : '#457B9D' }
                : { y: 2, scale: 1, color: '#94a3b8' }
            }
            transition={{ type: 'spring', stiffness: 280, damping: 25 }}
            className="absolute left-0 text-sm font-medium pointer-events-none select-none origin-left"
          >
            {label}
          </motion.span>
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            required
            className="w-full bg-transparent text-base text-[#1D3557] outline-none pt-5 font-medium caret-[#1D3557]"
            placeholder=" "
          />
        </div>
        {extra && (
          <div className="shrink-0" onClick={e => e.stopPropagation()}>
            {extra}
          </div>
        )}
      </label>
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const cardRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: '/',
    });
    if (!error) {
      toast.success('Welcome back!');
      router.push('/');
    } else {
      setError(error.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    try {
      await authClient.signIn.social({ provider: 'google' });
    } catch {
      toast.error('Google login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden bg-gradient-to-br from-[#F1FAEE] via-[#A8DADC]/40 to-[#457B9D]/30">
        
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          top: '-10%', left: '-8%',
          background: 'radial-gradient(circle, rgba(69,123,157,0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          bottom: '-8%', right: '-6%',
          background: 'radial-gradient(circle, rgba(230,57,70,0.2) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />


      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformPerspective: 3000 }}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md rounded-3xl p-8 border border-[#A8DADC]/30 bg-white shadow-[0_30px_80px_rgba(29,53,87,0.2)] will-change-transform"
      >
        <div className="absolute top-0 left-8 right-8 h-[3px] rounded-b-full bg-gradient-to-r from-[#1D3557] via-[#E63946] to-[#A8DADC]" />

        <div className="text-center mb-8 mt-2">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gradient-to-br from-[#1D3557] to-[#457B9D] shadow-lg"
          >
            <span className="text-lg font-black text-white">SN</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-3xl font-extrabold text-[#1D3557] mb-1"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.32 }}
            className="text-[#457B9D] text-sm"
          >
            Sign in to your{' '}
            <span className="font-bold text-[#E63946]">StudyNook</span> account
          </motion.p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-5 px-4 py-3 rounded-2xl text-sm text-center font-medium bg-[#E63946]/10 border border-[#E63946]/20 text-[#E63946]"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-5">
          <FloatingInput
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            icon={MdEmail}
          />
          <FloatingInput
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            icon={MdLock}
            extra={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#457B9D] hover:text-[#1D3557] transition-colors"
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            }
          />

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-[#1D3557] to-[#457B9D] hover:shadow-[0_12px_32px_rgba(29,53,87,0.4)] transition-all duration-300 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In <HiArrowRight size={18} />
              </span>
            )}
          </motion.button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#A8DADC]/60" />
          <span className="text-xs text-[#457B9D] tracking-widest uppercase font-medium">or continue with</span>
          <div className="flex-1 h-px bg-[#A8DADC]/60" />
        </div>

        <motion.button
          onClick={handleGoogle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-3 border border-[#A8DADC] bg-white text-[#1D3557] py-3.5 rounded-2xl font-semibold text-sm hover:border-[#457B9D] hover:bg-[#F1FAEE] transition-all duration-300"
        >
          <FcGoogle size={20} />
          Continue with Google
        </motion.button>

        <p className="text-center text-sm text-[#457B9D] mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-[#E63946] hover:text-[#1D3557] transition-colors">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}