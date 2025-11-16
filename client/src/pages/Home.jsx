import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Brain, FileText, ArrowRight, CheckCircle, Menu, X, MessageCircle } from 'lucide-react';
import useGetUserData from '../hooks/useGetUserData.js';


const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userData, loading, error } = useGetUserData();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: '#0A0A1F', color: '#F5F5F5' }}>
      {/* Navigation */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: isScrolled ? 'rgba(24, 24, 54, 0.95)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(0,255,255,0.2)' : 'none'
        }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={32} style={{ color: '#00FFFF' }} className="drop-shadow-[0_0_12px_rgba(0,255,255,0.6)]" />
            <span className="text-2xl font-bold tracking-wide">NoteBot</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('features')} className="transition-colors hover:text-cyan-400">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="transition-colors hover:text-cyan-400">
              How It Works
            </button>
            <button onClick={() => scrollToSection('pricing')} className="transition-colors hover:text-cyan-400">
              Pricing
            </button>
            <a href="/auth">
                <button 
                className="px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                style={{
                    background: '#00FFFF',
                    color: '#0A0A1F',
                    boxShadow: '0 0 20px rgba(0,255,255,0.4)'
                }}>
                {userData ? 'Go to App' : 'Get Started'}

                </button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-6 py-4 space-y-4" style={{ background: '#181836' }}>
            <button onClick={() => scrollToSection('features')} className="block w-full text-left py-2">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left py-2">
              How It Works
            </button>
            <button onClick={() => scrollToSection('pricing')} className="block w-full text-left py-2">
              Pricing
            </button>
            <button 
              className="w-full px-6 py-3 rounded-full font-semibold"
              style={{ background: '#00FFFF', color: '#0A0A1F' }}>
              {userData ? 'Go to App' : 'Get Started'}

            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Animated Background Grid */}
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
             style={{ background: 'radial-gradient(circle, #00FFFF, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
             style={{ background: 'radial-gradient(circle, #A020F0, transparent)' }} />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="inline-block px-4 py-2 rounded-full mb-6 animate-pulse"
               style={{ background: 'rgba(0,255,255,0.1)', border: '1px solid #00FFFF' }}>
            <span className="text-sm font-semibold" style={{ color: '#00FFFF' }}>
              ✨ AI-Powered Study Assistant
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              style={{
                background: 'linear-gradient(135deg, #00FFFF, #A020F0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            Transform Your Notes Into<br />Knowledge
          </h1>

          <p className="text-xl md:text-2xl mb-12 leading-relaxed" style={{ color: '#8C8CA8' }}>
            Upload your lectures, generate summaries, and create practice quizzes<br />
            with the power of artificial intelligence, Group with your Friends Together to discuss on Topics
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href={userData ? '/app/home' : '/auth'}>
                <button 
                className="px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                style={{
                    background: '#00FFFF',
                    color: '#0A0A1F',
                    boxShadow: '0 0 30px rgba(0,255,255,0.5)'
                }}>
                {userData ? 'Go to App' : 'Start Learning Now'}
                <ArrowRight size={20} />
                </button>
            </a>
          </div>

          <div className="mt-16 flex items-center justify-center gap-12 text-sm" style={{ color: '#8C8CA8' }}>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} style={{ color: '#00FFFF' }} />
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} style={{ color: '#00FFFF' }} />
              <span>Free Trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} style={{ color: '#00FFFF' }} />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful AI Features</h2>
            <p className="text-xl" style={{ color: '#8C8CA8' }}>
              Everything you need to study smarter, not harder
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain size={40} />,
                title: 'AI Summaries',
                description: 'Get concise, intelligent summaries of your lecture notes and study materials in seconds'
              },
              {
                icon: <Zap size={40} />,
                title: 'Quiz Generator',
                description: 'Automatically generate practice questions to test your understanding and retention'
              },
              {
                icon: <FileText size={40} />,
                title: 'Multi-Format Support',
                description: 'Upload PDFs, text files, presentations, or paste content directly'
              },
              {
                icon: <MessageCircle size={40} />,
                title: 'Temporary Chat',
                description: 'Create a Temporary Chat and ask your friends to join via a URL to discuss about the Topic'
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="rounded-lg p-8 transition-all duration-300 hover:scale-105 hover:translate-y-[-8px] group cursor-pointer"
                style={{
                  background: '#181836',
                  border: '1px solid rgba(0,255,255,0.2)'
                }}>
                <div 
                  className="mb-4 inline-block p-3 rounded-lg transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]"
                  style={{ background: 'rgba(0,255,255,0.1)', color: '#00FFFF' }}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p style={{ color: '#8C8CA8' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6" style={{ background: '#181836' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple 3-Step Process</h2>
            <p className="text-xl" style={{ color: '#8C8CA8' }}>
              From upload to mastery in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Content', description: 'Upload your lecture notes, slides, or paste text' },
              { step: '02', title: 'AI Processing', description: 'Our AI analyzes and structures your content' },
              { step: '03', title: 'Study & Master', description: 'Review summaries and test yourself with quizzes' }
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div 
                  className="text-6xl font-bold mb-4 opacity-20"
                  style={{ color: '#00FFFF' }}>
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p style={{ color: '#8C8CA8' }}>{item.description}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full">
                    <ArrowRight 
                      size={32} 
                      style={{ color: '#00FFFF' }}
                      className="opacity-30 -ml-16" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-xl" style={{ color: '#8C8CA8' }}>
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                features: ['5 AI Summaries/month', 'Basic Quiz Generation', 'Up to 10 saved sessions', 'Community Support']
              },
            ].map((plan, i) => (
              <div 
                key={i}
                className="rounded-lg p-8 transition-all duration-300 hover:scale-105"
                style={{
                  background: plan.featured ? 'linear-gradient(135deg, rgba(0,255,255,0.1), rgba(160,32,240,0.1))' : '#181836',
                  border: plan.featured ? '2px solid #00FFFF' : '1px solid rgba(140,140,168,0.3)',
                  boxShadow: plan.featured ? '0 0 40px rgba(0,255,255,0.3)' : 'none'
                }}>
                {plan.featured && (
                  <div className="text-center mb-4">
                    <span 
                      className="inline-block px-4 py-1 rounded-full text-sm font-bold"
                      style={{ background: '#00FFFF', color: '#0A0A1F' }}>
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span style={{ color: '#8C8CA8' }}>/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <CheckCircle size={20} style={{ color: '#00FFFF' }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="/auth">
                    <button 
                    className="w-full py-3 rounded-full font-bold transition-all duration-300 hover:scale-105"
                    style={{
                        background: plan.featured ? '#00FFFF' : 'transparent',
                        color: plan.featured ? '#0A0A1F' : '#F5F5F5',
                        border: plan.featured ? 'none' : '2px solid #8C8CA8'
                    }}>
                    {plan.featured ? 'Start Free Trial' : 'Get Started'}
                    </button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div 
          className="max-w-4xl mx-auto text-center rounded-2xl p-12 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #00FFFF, #A020F0)' }}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#0A0A1F' }}>
            Ready to Study Smarter?
          </h2>
          <p className="text-xl mb-8" style={{ color: '#0A0A1F', opacity: 0.8 }}>
            Join thousands of students already using NoteBot
          </p>
          <a href="/auth">
            <button 
                className="px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105"
                style={{
                background: '#0A0A1F',
                color: '#00FFFF',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                }}>
                
                {userData ? 'Go to App' : 'Get Started for Free'}

            </button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t" style={{ borderColor: '#181836' }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles size={28} style={{ color: '#00FFFF' }} />
            <span className="text-2xl font-bold">NoteBot</span>
          </div>
          <p style={{ color: '#8C8CA8' }}>
            © 2025 NoteBot. All rights reserved.
          </p>
        </div>
      </footer>

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
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default Home;