import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Palette, 
  Database, 
  Cloud, 
  ArrowRight, 
  Sparkles,
  Code,
  Layers,
  Rocket,
  Play,
  Cpu
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Create floating elements animation
    const createFloatingElements = () => {
      if (!heroRef.current) return;
      
      for (let i = 0; i < 20; i++) {
        const element = document.createElement('div');
        element.className = 'absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-30';
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        heroRef.current.appendChild(element);
        
        gsap.to(element, {
          y: `+=${Math.random() * 100 - 50}`,
          x: `+=${Math.random() * 100 - 50}`,
          opacity: Math.random() * 0.6 + 0.2,
          duration: Math.random() * 8 + 4,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
          delay: Math.random() * 2
        });
      }
    };

    // Hero entrance animation sequence
    tl.fromTo(heroRef.current, 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
    )
    .fromTo(titleRef.current,
      { opacity: 0, y: 100, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power4.out' },
      '-=0.8'
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      '-=0.5'
    );

    // Create floating elements after hero loads
    setTimeout(createFloatingElements, 500);

    // Continuous title animation
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        backgroundPosition: '200% center',
        duration: 8,
        repeat: -1,
        ease: 'none'
      });
    }

    // CTA button pulse animation
    if (ctaRef.current) {
      gsap.to(ctaRef.current, {
        boxShadow: '0 0 60px rgba(139, 92, 246, 0.8)',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }

    return () => {
      // Cleanup floating elements
      if (heroRef.current) {
        const floatingElements = heroRef.current.querySelectorAll('.absolute.w-2.h-2');
        floatingElements.forEach(el => el.remove());
      }
    };
  }, []);

  const features = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Frontend Builder',
      description: 'Drag & drop components to create beautiful UIs with real-time preview',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Backend Builder',
      description: 'Visual API designer with authentication, validation, and business logic',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'Database Designer',
      description: 'Design your database schema visually with relationships and constraints',
      gradient: 'from-teal-500 to-green-500'
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: 'One-Click Deploy',
      description: 'Deploy your full-stack application instantly to the cloud',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center max-w-7xl mx-auto relative"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center space-x-2 glass-card px-8 py-4 rounded-full mb-12 shadow-2xl"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-6 h-6 text-purple-400" />
            </motion.div>
            <span className="text-lg font-medium text-gray-700">AI-Powered Development</span>
          </motion.div>

          {/* BuildAI Brand Text */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 1, type: 'spring', stiffness: 150 }}
            className="mb-8"
          >
            <motion.h2
              className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{
                background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #14b8a6, #f59e0b, #ef4444, #8b5cf6)',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              BuildAI
            </motion.h2>
          </motion.div>

          {/* Enhanced Main Title */}
          <motion.div
            ref={titleRef}
            initial={{ opacity: 0, y: 100, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 1.2, type: 'spring', stiffness: 100 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight">
              <motion.span
                className="block bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
                style={{
                  backgroundSize: '200% 100%',
                  backgroundPosition: '0% center'
                }}
                animate={{
                  backgroundPosition: ['0% center', '200% center', '0% center']
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                Build and Deploy
              </motion.span>
              
              <motion.span
                className="block bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mt-4"
                style={{
                  backgroundSize: '300% 100%',
                  backgroundPosition: '0% center'
                }}
                animate={{
                  backgroundPosition: ['0% center', '300% center', '0% center']
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: 1
                }}
              >
                Full-Stack Apps
              </motion.span>
              
              <motion.span
                className="block text-white mt-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                Without Code
              </motion.span>
            </h1>
          </motion.div>

          {/* Subtitle with enhanced animations */}
          <motion.div
            ref={subtitleRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="mb-16"
          >
            <motion.p
              className="text-2xl md:text-3xl text-white/90 font-light leading-relaxed max-w-4xl mx-auto"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              Create and Deploy Applications with Visual Tools and AI Assistance
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.8 }}
              className="text-lg text-white/70 mt-6 max-w-3xl mx-auto leading-relaxed"
            >
              Build full-stack applications with our visual drag-and-drop interface. 
              Design frontends, create APIs, manage databases, and deploy everything with AI assistance.
            </motion.p>
          </motion.div>

          {/* Enhanced CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.8, type: 'spring', stiffness: 150 }}
          >
            <motion.button
              ref={ctaRef}
              onClick={() => navigate('/builder')}
              className="group relative px-12 py-6 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-3xl shadow-2xl transform transition-all duration-500 overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 80px rgba(139, 92, 246, 0.8)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                style={{ opacity: 0.3 }}
              />
              
              <span className="relative flex items-center space-x-3">
                <span>Start Building Now</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </span>
            </motion.button>
          </motion.div>

          {/* Floating Action Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2, duration: 1 }}
            className="absolute top-4 left-2 md:top-8 md:left-4 lg:top-16 lg:left-8 hidden md:block"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="glass-card p-2 md:p-3 lg:p-4 rounded-xl md:rounded-2xl shadow-xl"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <Code className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 text-purple-400" />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.4, duration: 1 }}
            className="absolute top-4 right-2 md:top-8 md:right-4 lg:top-16 lg:right-8 hidden md:block"
          >
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 5, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
              className="glass-card p-2 md:p-3 lg:p-4 rounded-xl md:rounded-2xl shadow-xl"
            >
              <motion.div
                animate={{ 
                  rotateY: [0, 180, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Database className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-400" />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.6, duration: 1 }}
            className="absolute bottom-4 left-2 md:bottom-12 md:left-4 lg:bottom-20 lg:left-8 hidden md:block"
          >
            <motion.div
              animate={{ 
                y: [0, -25, 0],
                rotate: [0, 10, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{ duration: 7, repeat: Infinity, delay: 2, ease: 'easeInOut' }}
              className="glass-card p-2 md:p-3 lg:p-4 rounded-xl md:rounded-2xl shadow-xl"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 15, -15, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Rocket className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 text-teal-400" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Additional Floating Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.8, duration: 1 }}
            className="absolute top-1/4 right-2 md:top-1/3 md:right-4 lg:right-8 hidden md:block"
          >
            <motion.div
              animate={{ 
                y: [0, -30, 0],
                x: [0, 10, 0],
                rotate: [0, -8, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 1.5, ease: 'easeInOut' }}
              className="glass-card p-2 md:p-3 rounded-lg md:rounded-xl shadow-lg"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              >
                <Layers className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-pink-400" />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4, duration: 1 }}
            className="absolute bottom-4 right-2 md:bottom-12 md:right-4 lg:bottom-20 lg:right-8 hidden md:block"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                x: [0, -15, 0],
                rotate: [0, 12, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 6, repeat: Infinity, delay: 3, ease: 'easeInOut' }}
              className="glass-card p-2 md:p-3 rounded-lg md:rounded-xl shadow-lg"
            >
              <motion.div
                animate={{ 
                  rotateX: [0, 360],
                  scale: [1, 1.4, 1]
                }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-yellow-400" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Additional corner icons for better distribution */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4.2, duration: 1 }}
            className="absolute top-1/2 left-2 md:left-4 lg:left-8 hidden md:block"
          >
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 5, repeat: Infinity, delay: 2.5, ease: 'easeInOut' }}
              className="glass-card p-2 md:p-3 rounded-lg md:rounded-xl shadow-lg"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 180, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                <Cpu className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-cyan-400" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16 lg:mb-20 px-4"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 md:mb-8">
              Everything You Need to Build
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed px-4">
              From concept to deployment, BuildAI provides all the tools you need to create modern applications
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.15, duration: 0.8, type: 'spring' }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -15, 
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5
                }}
                className="group perspective-1000 w-full"
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 10px 30px rgba(139, 92, 246, 0.1)',
                      '0 20px 60px rgba(139, 92, 246, 0.3)',
                      '0 10px 30px rgba(139, 92, 246, 0.1)'
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                >
                  <Card className="glass-card h-full p-4 md:p-6 lg:p-8 hover:glow-purple transition-all duration-500 border-white/20 transform-gpu overflow-hidden relative">
                    {/* Animated background gradient */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10"
                      animate={{
                        background: [
                          'linear-gradient(45deg, #8b5cf6, #3b82f6)',
                          'linear-gradient(45deg, #3b82f6, #14b8a6)',
                          'linear-gradient(45deg, #14b8a6, #8b5cf6)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    
                    {/* Icon with enhanced animations */}
                  <motion.div 
                    className={`w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 md:mb-6 lg:mb-8 text-white group-hover:scale-110 transition-transform duration-500 shadow-2xl`}
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.2,
                      boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)'
                    }}
                    transition={{ duration: 0.6 }}
                    animate={{
                      y: [0, -5, 0],
                      rotate: [0, 2, -2, 0]
                    }}
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                    }}
                  >
                    <div className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8">
                      {feature.icon}
                    </div>
                  </motion.div>
                  
                  {/* Text with subtle animations */}
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
                  >
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base lg:text-lg">
                    {feature.description}
                  </p>
                  </motion.div>
                  
                  {/* Floating particles inside card */}
                  <motion.div
                    className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-30"
                    animate={{
                      y: [0, -20, 0],
                      x: [0, 10, 0],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                  />
                  <motion.div
                    className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-40"
                    animate={{
                      y: [0, 15, 0],
                      x: [0, -8, 0],
                      opacity: [0.4, 0.9, 0.4]
                    }}
                    transition={{ duration: 5, repeat: Infinity, delay: index * 0.7 }}
                  />
                </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Demo Section */}
      <section className="relative py-16 md:py-24 lg:py-32 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16 lg:mb-20"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 md:mb-8 px-4">
              See BuildAI in Action
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed px-4">
              Watch how easy it is to build a complete application from scratch
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="glass-strong p-4 md:p-8 lg:p-12 rounded-2xl md:rounded-3xl border border-white/20 overflow-hidden">
              {/* Browser Frame */}
              <div className="bg-gray-800 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
                {/* Browser Header */}
                <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 bg-gray-900 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm md:text-lg text-gray-300 font-medium hidden sm:block">BuildAI Platform Demo</div>
                  <div className="w-8 md:w-20"></div>
                </div>

                {/* Demo Interface */}
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8 min-h-[300px] md:min-h-[400px] lg:min-h-[600px] relative">
                  {/* Left Sidebar */}
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="absolute left-2 md:left-4 lg:left-8 top-4 md:top-8 w-32 md:w-48 lg:w-56 space-y-2 md:space-y-4 hidden sm:block"
                  >
                    <motion.div 
                      className="bg-blue-500/20 border border-blue-400/30 rounded-lg md:rounded-xl p-2 md:p-4 backdrop-blur-sm"
                      whileHover={{ scale: 1.05, x: 10 }}
                    >
                      <div className="h-2 md:h-3 bg-blue-400 rounded mb-2 md:mb-3"></div>
                      <div className="h-1 md:h-2 bg-blue-300/60 rounded w-3/4"></div>
                    </motion.div>
                    <motion.div 
                      className="bg-purple-500/20 border border-purple-400/30 rounded-lg md:rounded-xl p-2 md:p-4 backdrop-blur-sm"
                      whileHover={{ scale: 1.05, x: 10 }}
                    >
                      <div className="h-2 md:h-3 bg-purple-400 rounded mb-2 md:mb-3"></div>
                      <div className="h-1 md:h-2 bg-purple-300/60 rounded w-2/3"></div>
                    </motion.div>
                    <motion.div 
                      className="bg-gray-500/20 border border-gray-400/30 rounded-lg md:rounded-xl p-2 md:p-4 backdrop-blur-sm"
                      whileHover={{ scale: 1.05, x: 10 }}
                    >
                      <div className="h-2 md:h-3 bg-gray-400 rounded mb-2 md:mb-3"></div>
                      <div className="h-1 md:h-2 bg-gray-300/60 rounded w-4/5"></div>
                    </motion.div>
                  </motion.div>

                  {/* Center Canvas */}
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 1, type: 'spring' }}
                    viewport={{ once: true }}
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <motion.div 
                      className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl min-w-[200px] md:min-w-[300px] lg:min-w-[400px]"
                      animate={{ 
                        boxShadow: [
                          '0 0 40px rgba(59, 130, 246, 0.5)',
                          '0 0 80px rgba(139, 92, 246, 0.8)',
                          '0 0 40px rgba(59, 130, 246, 0.5)'
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 mb-3 md:mb-6">
                        <div className="h-2 md:h-4 bg-white/60 rounded mb-2 md:mb-3"></div>
                        <div className="h-2 md:h-3 bg-white/40 rounded w-3/4 mb-2 md:mb-4"></div>
                        <div className="h-6 md:h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg md:rounded-xl"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 md:gap-4">
                        <motion.div 
                          className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-4"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="h-2 md:h-3 bg-white/50 rounded mb-2 md:mb-3"></div>
                          <div className="h-1 md:h-2 bg-white/30 rounded w-2/3"></div>
                        </motion.div>
                        <motion.div 
                          className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-4"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="h-2 md:h-3 bg-white/50 rounded mb-2 md:mb-3"></div>
                          <div className="h-1 md:h-2 bg-white/30 rounded w-3/4"></div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Right Sidebar */}
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="absolute right-8 top-8 w-56 space-y-4"
                  >
                    <motion.div 
                      className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 backdrop-blur-sm"
                      whileHover={{ scale: 1.05, x: -10 }}
                    >
                      <div className="h-3 bg-green-400 rounded mb-3"></div>
                      <div className="h-2 bg-green-300/60 rounded w-4/5"></div>
                    </motion.div>
                    <motion.div 
                      className="bg-orange-500/20 border border-orange-400/30 rounded-xl p-4 backdrop-blur-sm"
                      whileHover={{ scale: 1.05, x: -10 }}
                    >
                      <div className="h-3 bg-orange-400 rounded mb-3"></div>
                      <div className="h-2 bg-orange-300/60 rounded w-3/5"></div>
                    </motion.div>
                  </motion.div>

                  {/* Floating Play Button */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.5, type: 'spring' }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                  >
                    <motion.button
                      animate={{ 
                        boxShadow: [
                          '0 0 30px rgba(59, 130, 246, 0.5)',
                          '0 0 60px rgba(59, 130, 246, 0.8)',
                          '0 0 30px rgba(59, 130, 246, 0.5)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      onClick={() => navigate('/builder')}
                      className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
                    >
                      <Play className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 ml-0.5 md:ml-1" />
                    </motion.button>
                  </motion.div>

                  {/* Animated Connection Lines */}
                  <motion.svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    viewport={{ once: true }}
                  >
                    <motion.path
                      d="M 100 100 Q 300 50 500 100"
                      stroke="rgba(139, 92, 246, 0.3)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 2 }}
                    />
                  </motion.svg>

                  {/* Animated Dots */}
                  <motion.div
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3"
                  >
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-400 rounded-full"></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-purple-400 rounded-full"></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-teal-400 rounded-full"></div>
                  </motion.div>
                </div>
              </div>

              {/* Demo Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-8 md:mt-12 text-center px-4"
              >
                <p className="text-white/80 text-lg md:text-xl mb-4 md:mb-6">
                  Interactive drag-and-drop interface with real-time preview
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-8 text-sm md:text-lg text-white/60">
                  <motion.div 
                    className="flex items-center space-x-3"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-400 rounded-full"></div>
                    <span>Frontend Components</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-3"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-purple-400 rounded-full"></div>
                    <span>Backend Logic</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-3"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="w-3 h-3 md:w-4 md:h-4 bg-teal-400 rounded-full"></div>
                    <span>Database Design</span>
                  </motion.div>
                </div>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-16 md:py-24 lg:py-32 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center"
        >
          <Card className="glass-strong p-8 md:p-12 lg:p-16 rounded-2xl md:rounded-3xl relative overflow-hidden">
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 8, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            />
            
            <div className="relative z-10">
              <motion.div
                className="flex items-center justify-center mb-8"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-2xl">
                  <Rocket className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
                </div>
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 md:mb-8 px-4">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-white/80 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
                Join thousands of creators building the future with AI-powered no-code development
              </p>
              
              <motion.button
                onClick={() => navigate('/builder')}
                className="group px-8 md:px-10 lg:px-12 py-4 md:py-5 lg:py-6 text-lg md:text-xl font-bold bg-white text-purple-600 hover:bg-gray-50 rounded-2xl md:rounded-3xl shadow-2xl transform transition-all duration-500 overflow-hidden relative"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 60px rgba(255, 255, 255, 0.5)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.3 }}
                  style={{ opacity: 0.1 }}
                />
                
                <span className="relative flex items-center space-x-3">
                  <span>Get Started Free</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.div>
                </span>
              </motion.button>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  );
};