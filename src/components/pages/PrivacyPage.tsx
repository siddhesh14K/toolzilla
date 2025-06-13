import React from 'react';
import { Shield, Lock, Eye, Server, FileText, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const principles = [
    {
      icon: Lock,
      title: 'Local Processing Only',
      description: 'All file processing happens directly in your browser using client-side JavaScript. Your files never leave your device or get uploaded to our servers.'
    },
    {
      icon: Eye,
      title: 'Zero Data Collection',
      description: 'We don\'t track your usage patterns, collect personal information, or store any data about your activities on our platform.'
    },
    {
      icon: Server,
      title: 'No File Storage',
      description: 'Files are processed in real-time and immediately discarded from memory. Nothing is saved, cached, or stored on our servers.'
    },
    {
      icon: Shield,
      title: 'Secure Connections',
      description: 'All communications use HTTPS encryption with modern TLS protocols to protect your data in transit.'
    }
  ];

  const dataTypes = [
    {
      type: 'Files and Content',
      collected: false,
      description: 'Your uploaded files are processed entirely within your browser. We never have access to your files or their content.',
      retention: 'Not applicable - files never leave your device'
    },
    {
      type: 'Personal Information',
      collected: false,
      description: 'We do not collect names, email addresses, phone numbers, or any other personal identifiers.',
      retention: 'Not applicable - no personal data collected'
    },
    {
      type: 'Usage Analytics',
      collected: true,
      description: 'Anonymous usage statistics like page views and tool usage to improve our services. No personal identification possible.',
      retention: 'Aggregated data retained for 24 months for service improvement'
    },
    {
      type: 'Technical Information',
      collected: true,
      description: 'Basic technical data like browser type and screen resolution to ensure compatibility and optimize performance.',
      retention: 'Anonymized technical data retained for 12 months'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl mb-8">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your privacy is our highest priority. Learn how we protect your data and respect your privacy at every step.
          </p>
        </div>

        {/* Last Updated */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-12">
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div>
              <span className="text-blue-800 dark:text-blue-200 font-semibold text-lg">
                Last updated: January 15, 2025
              </span>
              <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                This policy is reviewed and updated regularly to ensure compliance with privacy regulations and best practices.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Principles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Our Privacy Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {principle.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Collection Overview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            What Data We Collect
          </h2>
          <div className="space-y-6">
            {dataTypes.map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {item.collected ? (
                      <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {item.type}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.collected 
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                      }`}>
                        {item.collected ? 'Limited Collection' : 'Not Collected'}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                      {item.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Data Retention:</strong> {item.retention}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-12">
          {/* How We Use Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              How We Use Information
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                The minimal information we collect is used exclusively for:
              </p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li><strong>Service Improvement:</strong> Understanding which tools are most popular helps us prioritize development efforts</li>
                <li><strong>Technical Optimization:</strong> Browser and device information helps us ensure compatibility and optimize performance</li>
                <li><strong>Security Monitoring:</strong> Detecting and preventing abuse, spam, or malicious activities</li>
                <li><strong>Analytics:</strong> Measuring website performance and user experience to identify areas for improvement</li>
              </ul>
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
                <p className="text-green-800 dark:text-green-200 font-medium">
                  <strong>Important:</strong> We never sell, rent, lease, or share your information with third parties for marketing purposes. 
                  Your data is never used for advertising targeting or profiling.
                </p>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Data Security Measures
            </h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                We implement comprehensive security measures to protect our platform and your privacy:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Technical Safeguards</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      HTTPS encryption with TLS 1.3
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Content Security Policy (CSP) headers
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Regular security audits and updates
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Secure hosting infrastructure
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Privacy by Design</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Client-side processing architecture
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      No server-side file storage
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Minimal data collection practices
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Anonymous analytics implementation
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Cookies and Local Storage */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Cookies and Local Storage
            </h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                We use minimal cookies and local storage to enhance your experience:
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Essential Cookies</h3>
                  <p className="text-sm">Required for basic website functionality, including theme preferences and security features.</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Preference Cookies</h3>
                  <p className="text-sm">Store your settings like dark/light mode and tool preferences for a better user experience.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics Cookies</h3>
                  <p className="text-sm">Anonymous usage statistics to help us improve our services (can be disabled in browser settings).</p>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Cookie Control:</strong> You can disable cookies in your browser settings. However, this may affect some website functionality. 
                  We respect Do Not Track signals and browser privacy settings.
                </p>
              </div>
            </div>
          </div>

          {/* Third-Party Services */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Third-Party Services
            </h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                We use select third-party services to provide and improve our platform:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Google Analytics</h3>
                  <p className="text-sm mb-2">Anonymous website usage analytics to understand user behavior and improve our services.</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Privacy Policy: <a href="https://policies.google.com/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Google Privacy Policy</a></p>
                </div>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Content Delivery Network</h3>
                  <p className="text-sm mb-2">CDN services to ensure fast loading times and reliable access worldwide.</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Used only for static asset delivery, no user data processed.</p>
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  <strong>Important:</strong> These services have their own privacy policies. We encourage you to review them. 
                  We only work with providers that meet our privacy and security standards.
                </p>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Your Privacy Rights
            </h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                You have comprehensive rights regarding your privacy and data:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Data Rights</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Right to access any data we have about you
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Right to correct inaccurate information
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Right to delete your data (where applicable)
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Right to data portability
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Control Options</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Use tools without creating accounts
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Clear browser data to remove preferences
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Opt out of analytics via browser settings
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Contact us with privacy concerns
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* International Users */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              International Users & Compliance
            </h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                We respect privacy laws worldwide and comply with major privacy regulations:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">GDPR</h3>
                  <p className="text-sm">European Union General Data Protection Regulation compliance</p>
                </div>
                <div className="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">CCPA</h3>
                  <p className="text-sm">California Consumer Privacy Act compliance</p>
                </div>
                <div className="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">PIPEDA</h3>
                  <p className="text-sm">Personal Information Protection and Electronic Documents Act (Canada)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Children's Privacy */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Children's Privacy Protection
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                We are committed to protecting children's privacy online. Our services are designed for general audiences 
                and are not specifically directed to children under 13 years of age.
              </p>
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  <strong>COPPA Compliance:</strong> We do not knowingly collect personal information from children under 13. 
                  If you are a parent or guardian and believe your child has provided us with personal information, 
                  please contact us immediately so we can take appropriate action.
                </p>
              </div>
            </div>
          </div>

          {/* Changes to Privacy Policy */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Changes to This Privacy Policy
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, 
                legal requirements, or other factors. When we make changes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We will update the "Last updated" date at the top of this policy</li>
                <li>For significant changes, we will provide prominent notice on our website</li>
                <li>We encourage you to review this policy periodically</li>
                <li>Continued use of our services after changes constitutes acceptance of the updated policy</li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Privacy Questions?</h2>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              If you have any questions about this Privacy Policy, our privacy practices, or how we handle your information, 
              we're here to help.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Email: privacy@toolzilla.com</span>
              </div>
              <p className="text-green-100 text-sm">
                We typically respond to privacy inquiries within 48 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;