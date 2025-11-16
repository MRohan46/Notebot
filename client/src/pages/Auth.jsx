import React, { useState, useEffect } from 'react';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowRight, Github, Chrome } from 'lucide-react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { LoginAPI, signupAPI } from '../utils/APIroutes';
import useGetUserData from '../hooks/useGetUserData';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { userData, loading, error } = useGetUserData();

  useEffect(() => {
    if (!loading && userData) {
      navigate("/app/home");
    }
  }, [loading, userData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const route = isLogin ? LoginAPI : signupAPI;
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { fullName: formData.name, email: formData.email, password: formData.password };

      const response = await axios.post(route, payload, { withCredentials: true });

      alert(isLogin ? "Login successful!" : "Account created successfully!");
      if(response.data.success){
        navigate("/app/home");
      }
    } catch (err) {
      console.error("Auth error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ background: '#0A0A1F', color: '#F5F5F5' }}>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }} />
        </div>

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl"
             style={{ background: 'radial-gradient(circle, #00FFFF, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl"
             style={{ background: 'radial-gradient(circle, #A020F0, transparent)' }} />

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-4 mb-8">
            <Sparkles size={48} style={{ color: '#00FFFF' }} className="drop-shadow-[0_0_20px_rgba(0,255,255,0.8)]" />
            <h1 className="text-5xl font-bold">NoteBot</h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 leading-tight"
              style={{
                background: 'linear-gradient(135deg, #00FFFF, #A020F0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            Transform Your Learning Experience
          </h2>
          
          <p className="text-xl leading-relaxed mb-8" style={{ color: '#8C8CA8' }}>
            Join thousands of students using AI to study smarter. Generate summaries, 
            create quizzes, and master any subject faster than ever.
          </p>

          <div className="space-y-4">
            {[
              'AI-powered summaries in seconds',
              'Automatic quiz generation',
              'Smart keyword extraction',
              'Cross-platform sync'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: '#00FFFF', boxShadow: '0 0 8px rgba(0,255,255,0.8)' }} />
                <span style={{ color: '#F5F5F5' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Sparkles size={36} style={{ color: '#00FFFF' }} className="drop-shadow-[0_0_12px_rgba(0,255,255,0.6)]" />
            <h1 className="text-3xl font-bold">NoteBot</h1>
          </div>

          {/* Form Card */}
          <div 
            className="rounded-2xl p-8 md:p-10"
            style={{
              background: '#181836',
              border: '1px solid rgba(0,255,255,0.2)',
              boxShadow: '0 0 40px rgba(0,255,255,0.1)'
            }}>
            
            {/* Toggle Tabs */}
            <div className="flex gap-2 mb-8 p-1 rounded-lg" style={{ background: '#0A0A1F' }}>
              <button
                onClick={() => setIsLogin(true)}
                className="flex-1 py-3 rounded-lg font-semibold transition-all duration-300"
                style={{
                  background: isLogin ? '#00FFFF' : 'transparent',
                  color: isLogin ? '#0A0A1F' : '#8C8CA8',
                  boxShadow: isLogin ? '0 0 20px rgba(0,255,255,0.4)' : 'none'
                }}>
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className="flex-1 py-3 rounded-lg font-semibold transition-all duration-300"
                style={{
                  background: !isLogin ? '#00FFFF' : 'transparent',
                  color: !isLogin ? '#0A0A1F' : '#8C8CA8',
                  boxShadow: !isLogin ? '0 0 20px rgba(0,255,255,0.4)' : 'none'
                }}>
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#8C8CA8' }}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User 
                      size={20} 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2"
                      style={{ color: '#8C8CA8' }} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required={!isLogin}
                      className="w-full pl-12 pr-4 py-3 rounded-lg outline-none transition-all"
                      style={{
                        background: '#0A0A1F',
                        color: '#F5F5F5',
                        border: '2px solid transparent'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#A020F0'}
                      onBlur={(e) => e.target.style.borderColor = 'transparent'}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#8C8CA8' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail 
                    size={20} 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    style={{ color: '#8C8CA8' }} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg outline-none transition-all"
                    style={{
                      background: '#0A0A1F',
                      color: '#F5F5F5',
                      border: '2px solid transparent'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#A020F0'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#8C8CA8' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock 
                    size={20} 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    style={{ color: '#8C8CA8' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3 rounded-lg outline-none transition-all"
                    style={{
                      background: '#0A0A1F',
                      color: '#F5F5F5',
                      border: '2px solid transparent'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#A020F0'}
                    onBlur={(e) => e.target.style.borderColor = 'transparent'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    style={{ color: '#8C8CA8' }}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded"
                      style={{ accentColor: '#00FFFF' }}
                    />
                    <span style={{ color: '#8C8CA8' }}>Remember me</span>
                  </label>
                  <button 
                    type="button"
                    className="transition-colors hover:text-cyan-400"
                    style={{ color: '#00FFFF' }}>
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: isLoading ? 'linear-gradient(90deg, #00FFFF, #A020F0)' : '#00FFFF',
                  color: '#0A0A1F',
                  boxShadow: '0 0 30px rgba(0,255,255,0.4)'
                }}>
                {isLoading ? (
                  'Processing...'
                ) : (
                  <>
                    {isLogin ? 'Login' : 'Create Account'}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px" style={{ background: '#8C8CA8' }} />
              <span className="text-sm" style={{ color: '#8C8CA8' }}>OR</span>
              <div className="flex-1 h-px" style={{ background: '#8C8CA8' }} />
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button
                className="w-full py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                style={{
                  background: 'transparent',
                  border: '2px solid #8C8CA8',
                  color: '#F5F5F5'
                }}>
                <Chrome size={20} />
                Continue with Google
              </button>

              <button
                className="w-full py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                style={{
                  background: 'transparent',
                  border: '2px solid #8C8CA8',
                  color: '#F5F5F5'
                }}>
                <Github size={20} />
                Continue with GitHub
              </button>
            </div>

            {/* Terms */}
            {!isLogin && (
              <p className="text-xs text-center mt-6 leading-relaxed" style={{ color: '#8C8CA8' }}>
                By creating an account, you agree to our{' '}
                <button className="transition-colors hover:text-cyan-400" style={{ color: '#00FFFF' }}>
                  Terms of Service
                </button>{' '}
                and{' '}
                <button className="transition-colors hover:text-cyan-400" style={{ color: '#00FFFF' }}>
                  Privacy Policy
                </button>
              </p>
            )}
          </div>

          {/* Footer Text */}
          <p className="text-center mt-6" style={{ color: '#8C8CA8' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold transition-colors hover:text-cyan-400"
              style={{ color: '#00FFFF' }}>
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: #00FFFF #181836;
        }
        
        *::-webkit-scrollbar {
          width: 8px;
        }
        
        *::-webkit-scrollbar-track {
          background: #181836;
        }
        
        *::-webkit-scrollbar-thumb {
          background: #00FFFF;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default Auth;