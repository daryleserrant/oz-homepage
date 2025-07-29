'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuthNavigation } from '../../lib/auth/useAuthNavigation';
import InteractiveConstellation from '../components/Invest/InteractiveConstellation';
import ModernKpiDashboard from '../components/ModernKpiDashboard';
import OZInvestmentReasons from '../components/OZInvestmentReasons';
import SlideContainer from '../components/SlideContainer';

export default function InvestPage() {
  const { navigateWithAuth } = useAuthNavigation();
  const containerRef = useRef(null);
  const marketSectionRef = useRef(null);
  const whyOzSectionRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.1]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  // Check if sections are in view for fade transitions
  const isMarketInView = useInView(marketSectionRef, { once: true, margin: "-100px" });
  const isWhyOzInView = useInView(whyOzSectionRef, { once: true, margin: "-100px" });

  // Track which section is currently visible on mobile using viewport midpoint
  useEffect(() => {
    const sections = [null, marketSectionRef, whyOzSectionRef]; // null for hero section

    const handleScroll = () => {
      const midPoint = window.scrollY + window.innerHeight / 2;
      let activeIndex = 0;

      sections.forEach((ref, idx) => {
        if (!ref) return; // Skip hero section
        const el = ref.current;
        if (!el) return;
        const { offsetTop, offsetHeight } = el;
        if (midPoint >= offsetTop && midPoint < offsetTop + offsetHeight) {
          activeIndex = idx;
        }
      });

      setCurrentSection(activeIndex);
    };

    // Run once to set initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleExploreOpportunities = () => {
    navigateWithAuth('/listings');
  };

  const handleCalculateBenefits = () => {
    navigateWithAuth('/tax-calculator');
  };

  // Dashboard functionality removed - keeping only the components used in invest page

  // Create slides for desktop
  const createSlides = (navigateToSlide) => [
    {
      id: "hero",
      title: "Invest With Impact",
      component: (
        <div className="relative h-screen flex items-center justify-center">
          {/* Interactive Constellation Background */}
          <div className="absolute inset-0 z-0">
            <InteractiveConstellation />
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span>Invest</span>{' '}
              <span className="text-primary">With Impact</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
              Discover tax-advantaged OZ opportunities nationwide
            </p>
            <motion.button
              className="px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/40 relative overflow-hidden group"
              onClick={handleExploreOpportunities}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                See OZ Listings
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.button>
          </div>
        </div>
      ),
    },
    {
      id: "market-overview",
      title: "Market Overview",
      component: (
        <div className="flex h-full w-full flex-col overflow-y-auto bg-white dark:bg-black">
          <div className="flex-1">
            <ModernKpiDashboard />
          </div>
          {/* Navigation hints */}
          <div className="fixed right-8 bottom-20 z-50 flex gap-4 text-center md:right-[calc(35%+2rem)] md:bottom-8 lg:right-[calc(30%+2rem)] xl:right-[calc(25%+2rem)]">
            <div
              className="flex cursor-pointer items-center gap-2 rounded-full bg-black/10 px-3 py-1.5 text-xs text-black/60 backdrop-blur-sm transition-all duration-300 hover:bg-black/20 md:px-4 md:py-2 md:text-sm dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20"
              onClick={() => navigateToSlide(0)}
            >
              <svg className="mt-1 h-4 w-4 flex-shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ animationDuration: "1.5s" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7 7 7" />
              </svg>
              <span className="leading-none">Back to hero</span>
            </div>
            <div
              className="flex cursor-pointer items-center gap-2 rounded-full bg-black/10 px-3 py-1.5 text-xs text-black/60 backdrop-blur-sm transition-all duration-300 hover:bg-black/20 md:px-4 md:py-2 md:text-sm dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20"
              onClick={() => navigateToSlide(2)}
            >
              <span>Investment reasons</span>
              <svg className="h-4 w-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ animationDuration: "1.5s" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "investment-reasons",
      title: "Why Invest in OZs",
      component: (
        <div className="flex h-full w-full flex-col overflow-y-auto bg-white dark:bg-black">
          <div className="flex-1">
            <OZInvestmentReasons />
          </div>
          {/* Navigation hints */}
          <div className="fixed right-8 bottom-20 z-50 flex gap-4 text-center md:right-[calc(35%+2rem)] md:bottom-8 lg:right-[calc(30%+2rem)] xl:right-[calc(25%+2rem)]">
            <div
              className="flex cursor-pointer items-center gap-2 rounded-full bg-black/10 px-3 py-1.5 text-xs text-black/60 backdrop-blur-sm transition-all duration-300 hover:bg-black/20 md:px-4 md:py-2 md:text-sm dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20"
              onClick={() => navigateToSlide(1)}
            >
              <svg className="mt-1 h-4 w-4 flex-shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ animationDuration: "1.5s" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7 7 7" />
              </svg>
              <span className="leading-none">Back to overview</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Mobile Layout - Always visible */}
      <div className="md:hidden">
        <div ref={containerRef} className="min-h-screen bg-white dark:bg-black text-[#1E293B] dark:text-white overflow-hidden scrollbar-hide pt-20">
          {/* Hero Section */}
          <section className="relative h-screen flex items-start justify-center pt-4 md:pt-0">
            {/* Interactive Constellation Background - Independent of scroll animations */}
            <motion.div 
              className="absolute inset-0 z-0"
              style={{ opacity: heroOpacity }}
            >
              <InteractiveConstellation />
            </motion.div>
            
            {/* Animated Content */}
            <motion.div
              className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20 md:mt-0"
              style={{ opacity: heroOpacity, scale: heroScale }}
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Invest
                </motion.span>{' '}
                <motion.span
                  className="text-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  With Impact
                </motion.span>
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                Discover tax-advantaged OZ opportunities nationwide
              </motion.p>
              <motion.button
                className="px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/40 relative overflow-hidden group"
                onClick={handleExploreOpportunities}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  See OZ Listings
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
            </motion.div>
          </section>
          
          {/* Market Overview Section */}
          <motion.section 
            ref={marketSectionRef}
            className="min-h-screen mt-8 md:mt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: isMarketInView ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <ModernKpiDashboard />
          </motion.section>

          {/* Mobile Section Divider - Only show on mobile */}
          <div className="relative py-8 mt-4 mb-6 md:hidden">
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-4">
              <div className="flex items-center space-x-4">
                <div className="h-px flex-1 bg-black/20 dark:bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-black/40 dark:bg-white/40 flex-shrink-0"></div>
                <div className="h-px flex-1 bg-black/20 dark:bg-white/20"></div>
              </div>
            </div>
          </div>

          {/* Why OZ Section */}
          <motion.section 
            ref={whyOzSectionRef}
            className="min-h-screen md:min-h-fit pb-12 md:pb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: isWhyOzInView ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <OZInvestmentReasons />
          </motion.section>

          {/* Progress indicators - Fixed position on right side */}
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30 flex flex-col space-y-3">
            <div className={`w-2 h-8 rounded-full transition-all duration-300 ${
              currentSection === 0 ? 'bg-primary opacity-100' : 'bg-black/20 dark:bg-white/20 opacity-60'
            }`}></div>
            <div className={`w-2 h-8 rounded-full transition-all duration-300 ${
              currentSection === 1 ? 'bg-primary opacity-100' : 'bg-black/20 dark:bg-white/20 opacity-60'
            }`}></div>
            <div className={`w-2 h-8 rounded-full transition-all duration-300 ${
              currentSection === 2 ? 'bg-primary opacity-100' : 'bg-black/20 dark:bg-white/20 opacity-60'
            }`}></div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Only visible on desktop */}
      <div className="hidden md:block pt-20">
        <SlideContainer slides={createSlides} />
      </div>
    </>
  );
}