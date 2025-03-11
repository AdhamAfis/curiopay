"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, ArrowRight, Shield, Brain, LineChart, Image as ImageIcon, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Head from "next/head";

const benefits = [
  {
    name: "Open Source",
    role: "MIT License",
    content: "Full access to source code. Deploy locally, modify, and contribute back to the community.",
    icon: "OS"
  },
  {
    name: "Privacy First",
    role: "Your Data, Your Control",
    content: "Local deployment option, secure API key storage, and complete control over your financial data.",
    icon: "PF"
  },
  {
    name: "AI Powered",
    role: "Choose Your LLM",
    content: "Integrate with your preferred LLM provider for personalized financial insights and advice.",
    icon: "AI"
  }
];

// Add screenshot gallery data
const screenshots = [
  {
    title: "Dashboard Overview",
    description: "Get a complete view of your finances with our intuitive dashboard",
    image: "/screenshots/dashboard.png" // Updated path
  },
  {
    title: "AI-Powered Insights",
    description: "Receive personalized financial advice through our AI integration",
    image: "/screenshots/ai-insights.png" // Updated path
  },
  {
    title: "LLM Provider Selection",
    description: "Choose from 9 different LLM providers for AI-powered financial insights",
    image: "/screenshots/llm-providers.png" // Updated path
  },
  {
    title: "LLM Chat",
    description: "Chat with your LLM provider to get personalized financial advice",
    image: "/screenshots/llm-chat.png" // Updated path
  },
];

const faqs = [
  {
    question: "What makes CurioPay different?",
    answer: "CurioPay combines modern budget tracking with AI-powered insights through Local Language Model (LLM) providers. It's completely open-source, privacy-focused, and offers local deployment options."
  },
  {
    question: "Which LLM providers are supported?",
    answer: "We support a wide range of LLM providers including Groq, Ollama, Deepseek, Gemini, Anthropic, OpenAI, Azure, Mistral, and Cohere. This gives you the flexibility to choose the AI model that best suits your needs."
  },
  {
    question: "Can I deploy it locally?",
    answer: "Yes! CurioPay is designed for easy local deployment. We provide a setup script that automates the installation process, requiring just Node.js, npm, Docker."
  },
  {
    question: "How can I contribute?",
    answer: "We welcome contributions of all kinds! You can fork the repository, submit pull requests, report bugs, suggest features, or help with documentation. Every contribution counts!"
  }
];

const stats = [
  { label: "LLM Providers", value: "9", prefix: "" },
  { label: "Core Features", value: "10+", prefix: "" },
  { label: "License", value: "MIT", prefix: "" },
  { label: "Cost", value: "Free", prefix: "100% " }
];

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const nextScreenshot = () => {
    setCurrentScreenshot((prev) => (prev + 1) % screenshots.length);
  };

  const prevScreenshot = () => {
    setCurrentScreenshot((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* SEO Meta Tags */}
      <Head>
        <title>CurioPay - Open Source Budget Tracking with AI Insights</title>
        <meta name="description" content="Privacy-focused budget tracking with AI-powered insights. Forever free, completely open source." />
        <meta name="keywords" content="budget tracking, financial management, open source, AI, privacy" />
        <meta property="og:title" content="CurioPay - Open Source Budget Tracking" />
        <meta property="og:description" content="Privacy-focused budget tracking with AI-powered insights. Forever free, completely open source." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://curiopay.vercel.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CurioPay - Open Source Budget Tracking" />
        <meta name="twitter:description" content="Privacy-focused budget tracking with AI-powered insights. Forever free, completely open source." />
      </Head>
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-md' 
          : 'bg-background/80 backdrop-blur-sm'
      } border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-2" />
              <h1 className="text-xl sm:text-2xl font-bold text-primary">
                CurioPay
              </h1>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/features">
              <motion.span 
                className="text-sm font-medium hover:text-primary transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Features
              </motion.span>
            </Link>
            <Link href="/docs">
              <motion.span 
                className="text-sm font-medium hover:text-primary transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Documentation
              </motion.span>
            </Link>
            <Link href="/blog">
              <motion.span 
                className="text-sm font-medium hover:text-primary transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Blog
              </motion.span>
            </Link>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2 sm:gap-4 items-center"
          >
            <motion.a
              href="https://github.com/adhamafis/curiopay"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <GitHubLogoIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline text-secondary-foreground text-xs sm:text-sm">Star on GitHub</span>
              <span className="sm:hidden text-secondary-foreground text-xs">Star</span>
            </motion.a>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1" 
                onClick={toggleMobileMenu}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                  <line x1="4" x2="20" y1="12" y2="12"></line>
                  <line x1="4" x2="20" y1="6" y2="6"></line>
                  <line x1="4" x2="20" y1="18" y2="18"></line>
                </svg>
              </Button>
            </div>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button variant="ghost" className="text-sm">
                    Login
                  </Button>
                </motion.div>
              </Link>
              <Link href="/register">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button className="text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                    Get Started
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Mobile Navigation Menu with animation */}
        <motion.div 
          initial={false}
          animate={{ 
            height: mobileMenuOpen ? 'auto' : 0,
            opacity: mobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden bg-background/95 border-b"
        >
          <div className="px-4 py-3 space-y-1">
            <Link href="/features" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-secondary/50">
              Features
            </Link>
            <Link href="/docs" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-secondary/50">
              Documentation
            </Link>
            <Link href="/blog" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-secondary/50">
              Blog
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full justify-center text-sm mb-2">
                    Login
                  </Button>
                </Link>
              </div>
              <Link href="/register" className="w-full">
                <Button className="w-full justify-center text-sm bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section - Enhanced with more animation and visual appeal */}
      <section 
        className="pt-28 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-background to-secondary/20"
        itemScope
        itemType="https://schema.org/WebPage"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-grid-blue-500/[0.03] bg-[size:32px] [mask-image:radial-gradient(white,transparent_85%)]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-white/30 backdrop-blur-3xl [mask-image:radial-gradient(transparent,white_50%)]" />
        </div>
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"
          animate={{ 
            y: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
          animate={{ 
            y: [0, -40, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative inline-block mb-4 sm:mb-6"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.02, 1],
                    rotate: [0, 1, -1, 0]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute -inset-2 rounded-xl bg-blue-500/10 blur-xl"
                />
                <div className="relative">
                  <h1 
                    className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground"
                    itemProp="headline"
                  >
                    100% Free & <br />
                    <span className="text-primary bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 text-transparent">Open Source</span>
                  </h1>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-center justify-center lg:justify-start gap-2 mb-4"
              >
                <span className="text-lg sm:text-xl text-muted-foreground">Where</span>
                <span className="font-semibold text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Curiosity</span>
                <span className="text-lg sm:text-xl text-muted-foreground">meets</span>
                <span className="font-semibold text-lg sm:text-xl bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">Payments</span>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto lg:mx-0 px-4 sm:px-0"
                itemProp="description"
              >
                Privacy-focused budget tracking with AI-powered insights. Forever free, completely open source.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 max-w-2xl mx-auto lg:mx-0"
              >
                <p className="text-blue-800 dark:text-blue-200 text-sm sm:text-base flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  <span><strong>Now Supporting 9 LLM Providers!</strong> Including Groq, Ollama, DeepSeek, Gemini, Anthropic, OpenAI, Azure, Mistral, and Cohere.</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8 max-w-2xl mx-auto lg:mx-0"
              >
                <p className="text-yellow-800 dark:text-yellow-200 text-sm sm:text-base">
                  ⚠️ <strong>Important:</strong> While we offer a demo for preview purposes, we strongly recommend local deployment for actual use. The demo should NOT be used for real financial data. Your financial privacy matters - deploy locally to keep your data under your control.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
              >
                <Link href="/register" className="w-full sm:w-auto">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <ShimmerButton className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 shadow-lg">
                      Get Started <ArrowRight className="w-5 h-5 inline-block ml-2" />
                    </ShimmerButton>
                  </motion.div>
                </Link>
                <a 
                  href="https://github.com/adhamafis/curiopay"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="w-full sm:w-auto"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2 hover:bg-secondary/50">
                      <GitHubLogoIcon className="w-5 h-5 inline-block mr-2" />
                      View on GitHub
                    </Button>
                  </motion.div>
                </a>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="hidden lg:block relative"
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-muted">
                <div className="absolute top-0 left-0 right-0 h-8 bg-muted flex items-center px-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 text-xs text-muted-foreground">CurioPay Demo</div>
                </div>
                <div className="pt-8">
                  {!isMounted ? (
                    <div className="w-full aspect-video bg-muted animate-pulse flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                  ) : (
                    <iframe
                      src="https://drive.google.com/file/d/1CRqOTKQQ96kuANcnQ-1mIuy5FceSuhkt/preview?embedded=true"
                      className="w-full aspect-video"
                      style={{ border: 'none' }}
                      allowFullScreen
                      loading="eager"
                      title="CurioPay Demo Video"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Watch how CurioPay helps you manage your finances with AI-powered insights
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced with more visual appeal */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 sm:p-6 rounded-xl bg-card hover:bg-card/80 border shadow-sm transition-colors"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-1 sm:mb-2"
                >
                  {stat.prefix}{stat.value}
                </motion.div>
                <div className="text-sm sm:text-base text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION: Screenshot Gallery */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-blue-500/[0.03] bg-[size:32px] [mask-image:radial-gradient(white,transparent_85%)]" />
        </div>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              See CurioPay in <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Action</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the intuitive interface and powerful features that make financial management a breeze
            </p>
          </motion.div>
          
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl overflow-hidden border shadow-2xl bg-card relative"
            >
              {/* Screenshot Browser Frame */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-muted flex items-center px-4 z-10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-xs text-muted-foreground">CurioPay - {screenshots[currentScreenshot].title}</div>
              </div>
              
              {/* Screenshot Content */}
              <div className="pt-10 relative">
                {!isMounted ? (
                  <div className="w-full aspect-[16/9] bg-muted animate-pulse flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-lg">
                    {/* Placeholder for actual screenshots */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/30">
                      <div className="text-center p-8 max-w-md">
                        <ImageIcon className="w-16 h-16 mx-auto mb-4 text-blue-500/50" />
                        <h3 className="text-xl font-bold mb-2">{screenshots[currentScreenshot].title}</h3>
                        <p className="text-muted-foreground">{screenshots[currentScreenshot].description}</p>
                      </div>
                    </div>
                    
                    {/* Responsive image that maintains aspect ratio */}
                    <div className="relative w-full h-auto aspect-[3024/1646]">
                      <Image 
                        src={screenshots[currentScreenshot].image}
                        alt={screenshots[currentScreenshot].title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Navigation Controls */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="rounded-full w-10 h-10 bg-background/80 backdrop-blur-sm shadow-lg"
                  onClick={prevScreenshot}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="rounded-full w-10 h-10 bg-background/80 backdrop-blur-sm shadow-lg"
                  onClick={nextScreenshot}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Screenshot Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {screenshots.map((_, index) => (
                  <Button 
                    key={index} 
                    variant="ghost" 
                    size="icon" 
                    className={`w-3 h-3 rounded-full p-0 ${index === currentScreenshot ? 'bg-primary' : 'bg-muted'}`}
                    onClick={() => setCurrentScreenshot(index)}
                  />
                ))}
              </div>
            </motion.div>
            
            {/* Caption */}
            <div className="text-center mt-6">
              <p className="text-muted-foreground">
                <span className="font-medium">{currentScreenshot + 1}/{screenshots.length}:</span> {screenshots[currentScreenshot].description}
              </p>
            </div>
            
            {/* Call to Action */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-8"
            >
              <Link href="/register">
                <Button variant="outline" className="gap-2 group">
                  <span>Experience it yourself</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20"
        aria-labelledby="features-heading"
        itemScope
        itemType="https://schema.org/ItemList"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 
              id="features-heading" 
              className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4"
              itemProp="name"
            >
              Core Features
            </h2>
            <meta itemProp="itemListOrder" content="Unordered" />
            <p className="text-lg sm:text-xl text-muted-foreground">Everything included, no premium features or hidden costs</p>
          </motion.div>
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 sm:mb-12 bg-card/50 p-1 rounded-lg">
              <TabsTrigger value="features" className="text-sm sm:text-base flex items-center gap-1 sm:gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600">
                <LineChart className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                <span>Features</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="text-sm sm:text-base flex items-center gap-1 sm:gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-sm sm:text-base flex items-center gap-1 sm:gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600">
                <Brain className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                <span>AI Integration</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="features">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {[
                  {
                    title: "Enhanced Dashboard",
                    description: "Modern, paginated interface for expense and income listings with real-time updates",
                    badge: "Core",
                    icon: <LineChart className="w-10 h-10 text-blue-500" aria-hidden="true" />
                  },
                  {
                    title: "Intelligent Chat",
                    description: "Advanced chat with Markdown support for better financial assistance",
                    badge: "AI",
                    icon: <Brain className="w-10 h-10 text-purple-500" aria-hidden="true" />
                  },
                  {
                    title: "Smart Categories",
                    description: "Robust validation for categories and payment methods with informative feedback",
                    badge: "Core",
                    icon: <LineChart className="w-10 h-10 text-blue-500" aria-hidden="true" />
                  },
                  {
                    title: "Budget Alerts",
                    description: "Get notified via in-app notifications and email when you exceed your budget",
                    badge: "Core",
                    icon: <LineChart className="w-10 h-10 text-blue-500" aria-hidden="true" />
                  },
                  {
                    title: "Recurring Expenses",
                    description: "Set automatic tracking for recurring payments and subscriptions",
                    badge: "Core",
                    icon: <LineChart className="w-10 h-10 text-blue-500" aria-hidden="true" />
                  },
                  {
                    title: "API Access",
                    description: "Full API documentation available at /api-docs for developers",
                    badge: "Dev",
                    icon: <GitHubLogoIcon className="w-10 h-10 text-green-500" aria-hidden="true" />
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    itemScope
                    itemProp="itemListElement"
                    itemType="https://schema.org/ListItem"
                  >
                    <meta itemProp="position" content={`${index + 1}`} />
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-primary/10 rounded-md">
                        {feature.icon}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <h3 
                      className="text-xl font-semibold mb-2"
                      itemProp="name"
                    >
                      {feature.title}
                    </h3>
                    <p 
                      className="text-muted-foreground"
                      itemProp="description"
                    >
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="security">
              <Card className="border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Privacy-First Approach</CardTitle>
                      <CardDescription>Your data stays under your control</CardDescription>
                    </div>
                    <Shield className="w-12 h-12 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="space-y-2 p-4 rounded-lg bg-blue-50/50 border border-blue-100"
                    >
                      <h4 className="font-semibold flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-blue-700" />
                        </div>
                        Local Deployment
                      </h4>
                      <p className="text-sm text-gray-600">Deploy on your own infrastructure with our easy setup script</p>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="space-y-2 p-4 rounded-lg bg-blue-50/50 border border-blue-100"
                    >
                      <h4 className="font-semibold flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-blue-700" />
                        </div>
                        Secure Storage
                      </h4>
                      <p className="text-sm text-gray-600">API keys stored securely in your browser</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="ai">
              <Card className="border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Multiple LLM Providers</CardTitle>
                      <CardDescription>Choose your preferred AI provider for financial insights</CardDescription>
                    </div>
                    <Brain className="w-12 h-12 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h4 className="font-semibold">Supported Providers</h4>
                      <div className="flex flex-wrap gap-4">
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 p-2 rounded-lg border bg-card shadow-sm"
                        >
                          <Image src="/groq.svg" alt="Groq" width={24} height={24} className="w-6 h-6" />
                          <span className="text-sm font-medium">Groq</span>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 p-2 rounded-lg border bg-card shadow-sm"
                        >
                          <Image src="/ollama.png" alt="Ollama" width={24} height={24} className="w-6 h-6" />
                          <span className="text-sm font-medium">Ollama</span>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 p-2 rounded-lg border bg-card shadow-sm"
                        >
                          <Image src="/deepseek.svg" alt="DeepSeek" width={24} height={24} className="w-6 h-6" />
                          <span className="text-sm font-medium">DeepSeek</span>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 p-2 rounded-lg border bg-card shadow-sm"
                        >
                          <Image src="/gemini.svg" alt="Gemini" width={24} height={24} className="w-6 h-6" />
                          <span className="text-sm font-medium">Gemini</span>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 p-2 rounded-lg border bg-card shadow-sm"
                        >
                          <Image src="/anthropic.svg" alt="Anthropic" width={24} height={24} className="w-6 h-6" />
                          <span className="text-sm font-medium">Anthropic</span>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 p-2 rounded-lg border bg-card shadow-sm"
                        >
                          <Image src="/openai.svg" alt="OpenAI" width={24} height={24} className="w-6 h-6" />
                          <span className="text-sm font-medium">OpenAI</span>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 p-2 rounded-lg border bg-card shadow-sm"
                        >
                          <Image src="/azure.svg" alt="Azure" width={24} height={24} className="w-6 h-6" />
                          <span className="text-sm font-medium">Azure</span>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 p-2 rounded-lg border bg-card shadow-sm"
                        >
                          <Image src="/mistral.svg" alt="Mistral" width={24} height={24} className="w-6 h-6" />
                          <span className="text-sm font-medium">Mistral</span>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 p-2 rounded-lg border bg-card shadow-sm"
                        >
                          <Image src="/cohere.svg" alt="Cohere" width={24} height={24} className="w-6 h-6" />
                          <span className="text-sm font-medium">Cohere</span>
                        </motion.div>
                      </div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h4 className="font-semibold">Key Features</h4>
                      <div className="space-y-4">
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="p-4 rounded-lg border bg-card/80"
                        >
                          <h5 className="font-medium mb-1 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                              <Brain className="w-3 h-3 text-purple-700" />
                            </div>
                            Model Selection
                          </h5>
                          <p className="text-sm text-muted-foreground">Choose from various models for each provider based on your needs</p>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="p-4 rounded-lg border bg-card/80"
                        >
                          <h5 className="font-medium mb-1 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                              <Shield className="w-3 h-3 text-blue-700" />
                            </div>
                            Secure API Keys
                          </h5>
                          <p className="text-sm text-muted-foreground">Your API keys are stored securely in your browser, never on our servers</p>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="p-4 rounded-lg border bg-card/80"
                        >
                          <h5 className="font-medium mb-1 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                              <LineChart className="w-3 h-3 text-green-700" />
                            </div>
                            Financial Insights
                          </h5>
                          <p className="text-sm text-muted-foreground">Get personalized financial advice and insights from your preferred AI model</p>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="mt-8 text-center">
            <Link href="/api-docs" className="inline-flex items-center text-primary hover:text-primary/90">
              <span className="text-lg">View API Documentation</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Why CurioPay?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">Built with privacy, flexibility, and community in mind</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full hover:shadow-xl transition-all border bg-card">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="p-3 rounded-xl bg-primary/10"
                      >
                        {benefit.icon === "OS" && <GitHubLogoIcon className="w-6 h-6 text-primary" />}
                        {benefit.icon === "PF" && <Shield className="w-6 h-6 text-primary" />}
                        {benefit.icon === "AI" && <Brain className="w-6 h-6 text-primary" />}
                      </motion.div>
                      <div>
                        <CardTitle className="text-xl text-foreground">{benefit.name}</CardTitle>
                        <CardDescription className="text-primary/80">{benefit.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-lg">{benefit.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Guide Preview */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Quick Installation Guide
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Get up and running in minutes with our simple setup process
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">System Requirements</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Docker and Docker Compose</li>
                  <li>2GB RAM minimum</li>
                  <li>Any modern operating system</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Installation Steps</h3>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-card/50">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                      Clone the repository
                    </h4>
                    <div className="bg-black rounded-md p-3 overflow-x-auto">
                      <pre className="text-white text-sm font-mono">git clone https://github.com/adhamafis/curiopay.git</pre>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-card/50">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                      Run the setup script
                    </h4>
                    <div className="bg-black rounded-md p-3 overflow-x-auto">
                      <pre className="text-white text-sm font-mono">cd curiopay && chmod +x setup.sh && ./setup.sh</pre>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-card/50">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                      Configuration (Interactive)
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">The setup script will guide you through:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Environment variables setup</li>
                      <li>Database initialization</li>
                      <li>Optional services configuration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative rounded-xl overflow-hidden border shadow-lg bg-card"
            >
              <div className="absolute top-0 left-0 right-0 h-8 bg-muted flex items-center px-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-xs text-muted-foreground">Terminal</div>
              </div>
              <div className="pt-8 p-4 bg-black text-white font-mono text-sm">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-green-400">$ git clone https://github.com/adhamafis/curiopay.git</p>
                  <p className="text-white">Cloning into 'curiopay'...</p>
                  <p className="text-white">remote: Enumerating objects: 1242, done.</p>
                  <p className="text-white">remote: Counting objects: 100% (1242/1242), done.</p>
                  <p className="text-white">remote: Compressing objects: 100% (842/842), done.</p>
                  <p className="text-white">Receiving objects: 100% (1242/1242), 2.3 MiB | 5.2 MiB/s, done.</p>
                  <p className="text-white">Resolving deltas: 100% (624/624), done.</p>
                  <p className="text-green-400 mt-2">$ cd curiopay && chmod +x setup.sh && ./setup.sh</p>
                  <p className="text-blue-400">🚀 Setting up CurioPay development environment...</p>
                  <p className="text-blue-400">🔧 Configuring environment variables...</p>
                  <p className="text-white">Press Enter to use default values or input your own.</p>
                  <p className="text-blue-400">📦 Installing dependencies...</p>
                  <p className="text-blue-400">🔄 Setting up database...</p>
                  <p className="text-blue-400">🐳 Starting database container...</p>
                  <p className="text-green-400">✅ Database setup complete!</p>
                  <p className="text-blue-400">🚀 Starting all services...</p>
                  <p className="text-green-400">✅ Setup complete!</p>
                  <p className="text-blue-400">🌐 Application is running at http://localhost:3000</p>
                  <p className="text-blue-400">✨ Prisma Studio is available at http://localhost:5555</p>
                  <div className="mt-1 animate-pulse">▌</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="https://github.com/adhamafis/curiopay/blob/main/README.md" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="gap-2">
                <span>View Full Documentation</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">Everything you need to know about CurioPay</p>
          </motion.div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:text-primary text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-lg">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px]" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-6 sm:space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground">
              Join Our Open Source Community
            </h2>
            <p className="text-xl sm:text-2xl text-primary-foreground/80 max-w-2xl mx-auto px-4 sm:px-0">
              Help us build the future of privacy-focused financial management
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <ShimmerButton className="w-full sm:w-auto bg-background hover:bg-background/90 text-primary text-lg px-8 py-6 shadow-xl">
                    Get Started <ArrowRight className="w-5 h-5 inline-block ml-2" />
                  </ShimmerButton>
                </motion.div>
              </Link>
              <a 
                href="https://github.com/adhamafis/curiopay"
                target="_blank"
                rel="noopener noreferrer" 
                className="w-full sm:w-auto"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6">
                    <GitHubLogoIcon className="w-5 h-5 inline-block mr-2" />
                    Star on GitHub
                  </Button>
                </motion.div>
              </a>
            </motion.div>
          </motion.div>
          
          {/* Floating elements for visual interest */}
          <motion.div 
            className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-blue-400/20 blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 45, 0],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-blue-300/20 blur-xl"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -45, 0],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <p className="text-muted-foreground text-xs sm:text-sm">
                © 2025 Adham Said. All rights reserved.
              </p>
            </motion.div>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/disclaimer" className="hover:text-primary transition-colors">
                Disclaimer
              </Link>
            </div>

            <p className="text-xs text-center text-muted-foreground max-w-2xl">
              CurioPay is provided "as is" without warranty. Not a substitute for professional financial advice. 
              By using CurioPay, you agree to our Terms of Service and Privacy Policy. The demo environment should NOT be used for real financial data - please deploy locally for actual use.
            </p>

            <motion.a
              href="https://github.com/adhamafis/curiopay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <GitHubLogoIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.a>
          </div>
        </div>
      </footer>
    </div>
  );
}
