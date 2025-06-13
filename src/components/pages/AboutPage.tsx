import React from 'react';
import { Zap, Users, Shield, Clock, Star, Award, Target, Globe, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Performance',
      description: 'Our tools are optimized for speed with client-side processing, ensuring instant results without server delays.'
    },
    {
      icon: Shield,
      title: 'Privacy & Security First',
      description: 'All file processing happens locally in your browser. Your sensitive data never leaves your device, ensuring complete privacy.'
    },
    {
      icon: Users,
      title: 'User-Centric Design',
      description: 'Every feature is designed based on real user feedback, creating intuitive interfaces that work for everyone.'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Access professional-grade tools anytime, anywhere, from any modern web browser without downloads or installations.'
    },
    {
      icon: Star,
      title: 'Professional Quality',
      description: 'Industry-standard algorithms and best practices ensure the highest quality results for all your digital tasks.'
    },
    {
      icon: Award,
      title: 'Completely Free',
      description: 'All tools are free to use with no hidden costs, subscriptions, or premium tiers. Quality tools for everyone.'
    }
  ];

  const stats = [
    { number: '500,000+', label: 'Files Processed Monthly' },
    { number: '50,000+', label: 'Active Users' },
    { number: '99.9%', label: 'Uptime Reliability' },
    { number: '5+', label: 'Professional Tools' }
  ];

  const team = [
    {
      name: 'Development Team',
      role: 'Full-Stack Engineers',
      description: 'Experienced developers specializing in web technologies, performance optimization, and user experience design.'
    },
    {
      name: 'Design Team',
      role: 'UI/UX Designers',
      description: 'Creative professionals focused on creating intuitive, accessible, and beautiful user interfaces.'
    },
    {
      name: 'Quality Assurance',
      role: 'Testing Specialists',
      description: 'Dedicated QA team ensuring every tool works flawlessly across all devices and browsers.'
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for perfection in every tool we create, continuously improving based on user feedback and technological advances.'
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Making professional-grade tools accessible to everyone, regardless of technical expertise or financial resources.'
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'Building a community of users who can rely on our tools for their daily digital tasks and professional needs.'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-8">
            <Zap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            About ToolZilla
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Empowering millions of users worldwide with professional-grade online tools that are fast, secure, and completely free.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 md:p-12 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              At ToolZilla, we believe that everyone deserves access to professional-quality digital tools without barriers. 
              Our mission is to democratize access to essential online utilities, making them free, fast, and secure for users worldwide.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-4">
                      <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-8">
              Our Story
            </h2>
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                ToolZilla was born from a simple observation: most online tools were either expensive, unreliable, or compromised user privacy. 
                In 2024, our team of passionate developers and designers came together with a vision to change this landscape.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                We started with a core principle: create tools that we ourselves would want to use. This meant prioritizing speed, 
                security, and simplicity above all else. Every tool we develop undergoes rigorous testing to ensure it meets our 
                high standards for performance and reliability.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Today, ToolZilla serves hundreds of thousands of users monthly, from students and professionals to businesses and 
                creative individuals. Our commitment remains unchanged: providing world-class tools that are accessible to everyone, 
                everywhere, at no cost.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 md:p-12 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Built with Modern Technology
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-center">
              ToolZilla leverages cutting-edge web technologies to deliver desktop-quality functionality directly in your browser. 
              Our commitment to modern standards ensures optimal performance, security, and compatibility across all devices.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Frontend Excellence</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    React 18 with TypeScript for type safety
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Tailwind CSS for responsive design
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Progressive Web App capabilities
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Optimized for Core Web Vitals
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Performance & Security</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Client-side processing for privacy
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    WebAssembly for high performance
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Service Workers for offline support
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    HTTPS encryption for all communications
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Commitment */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Commitment to You</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            We're dedicated to continuously improving ToolZilla based on your feedback and emerging technologies. 
            Your trust drives our innovation, and your success is our success.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-2">Continuous Innovation</h3>
              <p className="text-blue-100 text-sm">
                Regular updates with new tools and features based on user needs and technological advances.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-2">User-Centric Development</h3>
              <p className="text-blue-100 text-sm">
                Every feature is designed with user experience in mind, ensuring simplicity without sacrificing functionality.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-2">Transparent Communication</h3>
              <p className="text-blue-100 text-sm">
                Open communication about updates, changes, and future plans through our blog and community channels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;