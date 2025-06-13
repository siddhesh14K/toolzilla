import React from 'react';
import { FileText, Scale, AlertTriangle, Clock, Shield, Users, Gavel } from 'lucide-react';

const TermsPage: React.FC = () => {
  const keyTerms = [
    {
      icon: Users,
      title: 'User Responsibilities',
      description: 'Use our tools lawfully and responsibly, respecting intellectual property and avoiding harmful activities.'
    },
    {
      icon: Shield,
      title: 'Service Availability',
      description: 'We strive for 99.9% uptime but cannot guarantee uninterrupted service due to maintenance or technical issues.'
    },
    {
      icon: Gavel,
      title: 'Intellectual Property',
      description: 'Our platform is protected by copyright and trademark laws. You retain rights to your content.'
    },
    {
      icon: Scale,
      title: 'Limitation of Liability',
      description: 'Our liability is limited to the maximum extent permitted by law for any damages or losses.'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl mb-8">
            <Scale className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Please read these terms carefully before using ToolZilla's services. These terms govern your use of our platform and tools.
          </p>
        </div>

        {/* Last Updated */}
        <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-xl p-6 mb-12">
          <div className="flex items-center space-x-3">
            <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <div>
              <span className="text-purple-800 dark:text-purple-200 font-semibold text-lg">
                Last updated: January 15, 2025
              </span>
              <p className="text-purple-700 dark:text-purple-300 text-sm mt-1">
                These terms are reviewed regularly to ensure clarity and compliance with applicable laws.
              </p>
            </div>
          </div>
        </div>

        {/* Key Terms Overview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Key Terms at a Glance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {keyTerms.map((term, index) => {
              const Icon = term.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {term.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {term.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-12">
          {/* Acceptance of Terms */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              1. Acceptance of Terms
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                By accessing and using ToolZilla ("the Service"), you accept and agree to be bound by the terms 
                and provisions of this agreement ("Terms of Service" or "Terms"). If you do not agree to these terms, 
                please do not use our service.
              </p>
              <p className="leading-relaxed">
                These Terms constitute a legally binding agreement between you and ToolZilla regarding your use of 
                our website located at toolzilla.com and all related services, features, and content.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Important:</strong> By using our service, you represent that you are at least 18 years old 
                  or have parental consent to use our services.
                </p>
              </div>
            </div>
          </div>

          {/* Description of Service */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              2. Description of Service
            </h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                ToolZilla provides a comprehensive suite of online tools designed to help users with various digital tasks. 
                Our services include but are not limited to:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Image Tools</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Image compression and optimization</li>
                    <li>• Image resizing and format conversion</li>
                    <li>• Batch processing capabilities</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Document Tools</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• PDF to text conversion</li>
                    <li>• Text to PDF generation</li>
                    <li>• Document formatting options</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Financial Calculators</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• EMI and loan calculators</li>
                    <li>• Compound interest calculations</li>
                    <li>• Investment planning tools</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Additional Features</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Dark/light mode themes</li>
                    <li>• Mobile-responsive design</li>
                    <li>• Privacy-focused processing</li>
                  </ul>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-200 text-sm">
                  <strong>Free Service:</strong> All tools are provided free of charge with no subscription fees or hidden costs. 
                  We may display advertisements to support the service.
                </p>
              </div>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              3. User Responsibilities and Acceptable Use
            </h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                You agree to use the Service only for lawful purposes and in accordance with these Terms. 
                You are responsible for your conduct and any content you process through our tools.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">✅ Acceptable Use</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Process your own files and content</li>
                    <li>• Use tools for legitimate business or personal purposes</li>
                    <li>• Respect intellectual property rights</li>
                    <li>• Follow applicable laws and regulations</li>
                    <li>• Report bugs or security issues responsibly</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">❌ Prohibited Activities</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Upload malicious files or viruses</li>
                    <li>• Process copyrighted material without authorization</li>
                    <li>• Attempt to hack or compromise our systems</li>
                    <li>• Use automated tools to overload our service</li>
                    <li>• Engage in illegal or harmful activities</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  <strong>Violation Consequences:</strong> Violation of these terms may result in immediate termination 
                  of access to our services and potential legal action if applicable.
                </p>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              4. Intellectual Property Rights
            </h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Our Rights</h3>
                  <p className="text-sm leading-relaxed mb-3">
                    The Service, including its original content, features, functionality, design, and underlying technology, 
                    is and will remain the exclusive property of ToolZilla and its licensors.
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li>• Website design and user interface</li>
                    <li>• Software algorithms and code</li>
                    <li>• Trademarks and branding</li>
                    <li>• Documentation and help content</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Your Rights</h3>
                  <p className="text-sm leading-relaxed mb-3">
                    You retain all rights, title, and interest in and to any content you upload, process, or create 
                    using our tools. We do not claim ownership of your content.
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li>• Full ownership of your uploaded files</li>
                    <li>• Rights to processed/converted content</li>
                    <li>• Control over your data and privacy</li>
                    <li>• Right to delete your content anytime</li>
                  </ul>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>License Grant:</strong> By using our service, you grant us a limited, non-exclusive license 
                  to process your content solely for the purpose of providing our services to you.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy and Data Handling */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              5. Privacy and Data Handling
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                Your privacy is fundamental to our service. Our comprehensive Privacy Policy explains how we collect, 
                use, and protect your information when you use our Service.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">What We Don't Do</h3>
                  <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                    <li>• Store your files on our servers</li>
                    <li>• Access your file contents</li>
                    <li>• Share your data with third parties</li>
                    <li>• Track your personal activities</li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">What We Do</h3>
                  <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                    <li>• Process files locally in your browser</li>
                    <li>• Collect anonymous usage statistics</li>
                    <li>• Protect your data with encryption</li>
                    <li>• Respect your privacy choices</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm">
                For detailed information about our privacy practices, please review our 
                <a href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline ml-1">Privacy Policy</a>.
              </p>
            </div>
          </div>

          {/* Service Availability and Disclaimers */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              6. Service Availability and Disclaimers
            </h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Service Availability</h3>
                <p className="leading-relaxed mb-4">
                  We strive to maintain high availability of our services but cannot guarantee uninterrupted access. 
                  The Service may be temporarily unavailable due to:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-sm">
                    <li>• Scheduled maintenance and updates</li>
                    <li>• Technical difficulties or server issues</li>
                    <li>• Network connectivity problems</li>
                    <li>• Security incidents or investigations</li>
                  </ul>
                  <ul className="space-y-2 text-sm">
                    <li>• Force majeure events</li>
                    <li>• Third-party service disruptions</li>
                    <li>• Legal or regulatory requirements</li>
                    <li>• Service improvements and upgrades</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Disclaimers</h3>
                <p className="leading-relaxed mb-4">
                  The Service is provided on an "as is" and "as available" basis. To the fullest extent permitted by law, 
                  ToolZilla disclaims all warranties, express or implied, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                  <li>Warranties of merchantability and fitness for a particular purpose</li>
                  <li>Warranties regarding the accuracy, reliability, or completeness of results</li>
                  <li>Warranties that the service will be uninterrupted or error-free</li>
                  <li>Warranties regarding the security or privacy of data transmission</li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  <strong>User Responsibility:</strong> You are responsible for backing up your important files and 
                  verifying the results of any processing before relying on them for critical purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              7. Limitation of Liability
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                To the maximum extent permitted by applicable law, in no event shall ToolZilla, its directors, employees, 
                partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, 
                or punitive damages, including without limitation:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm">
                  <li>• Loss of profits or revenue</li>
                  <li>• Loss of data or information</li>
                  <li>• Loss of business opportunities</li>
                  <li>• Interruption of business operations</li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li>• Cost of substitute services</li>
                  <li>• Damage to reputation or goodwill</li>
                  <li>• Personal injury or property damage</li>
                  <li>• Any other intangible losses</li>
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  <strong>Maximum Liability:</strong> Our total liability to you for all claims arising from or related to 
                  the Service shall not exceed $100 USD or the amount you paid us in the 12 months preceding the claim, 
                  whichever is greater.
                </p>
              </div>
            </div>
          </div>

          {/* Indemnification */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              8. Indemnification
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                You agree to defend, indemnify, and hold harmless ToolZilla and its affiliates, officers, directors, 
                employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, 
                or debt, and expenses (including attorney's fees) arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                <li>Your use or misuse of the Service</li>
                <li>Your violation of these Terms of Service</li>
                <li>Your violation of any third-party rights, including intellectual property rights</li>
                <li>Any content you upload, process, or transmit through the Service</li>
                <li>Your violation of any applicable laws or regulations</li>
              </ul>
            </div>
          </div>

          {/* Modifications to Terms */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              9. Modifications to Terms
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                We reserve the right to modify or replace these Terms at any time at our sole discretion. 
                If a revision is material, we will make reasonable efforts to provide notice:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                <li>At least 30 days prior to any new terms taking effect for material changes</li>
                <li>Through prominent notice on our website</li>
                <li>Via email if you have provided us with your email address</li>
                <li>Through in-app notifications where applicable</li>
              </ul>
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Continued Use:</strong> By continuing to access or use our Service after revisions become effective, 
                  you agree to be bound by the revised terms.
                </p>
              </div>
            </div>
          </div>

          {/* Termination */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              10. Termination
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Termination by You</h3>
                  <p className="text-sm leading-relaxed">
                    You may stop using our Service at any time. Since we don't require account creation, 
                    simply discontinuing use effectively terminates your access.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Termination by Us</h3>
                  <p className="text-sm leading-relaxed">
                    We may terminate or suspend your access immediately, without prior notice, for conduct 
                    that we believe violates these Terms or is harmful to other users or our Service.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Effect of Termination</h3>
                <p className="text-sm leading-relaxed">
                  Upon termination, your right to use the Service will cease immediately. Since we don't store your files, 
                  termination does not affect any data you have processed or downloaded.
                </p>
              </div>
            </div>
          </div>

          {/* Governing Law and Dispute Resolution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              11. Governing Law and Dispute Resolution
            </h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Governing Law</h3>
                <p className="text-sm leading-relaxed">
                  These Terms shall be interpreted and governed by the laws of the United States and the State of Delaware, 
                  without regard to conflict of law provisions. This choice of law does not override mandatory consumer 
                  protection laws in your jurisdiction.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Dispute Resolution</h3>
                <p className="text-sm leading-relaxed mb-3">
                  We encourage resolving disputes through direct communication. If you have a concern:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm ml-4">
                  <li>Contact us first at legal@toolzilla.com</li>
                  <li>We will attempt to resolve the issue within 30 days</li>
                  <li>If unresolved, disputes may be subject to binding arbitration</li>
                  <li>Small claims court remains available for qualifying disputes</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Miscellaneous */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              12. Miscellaneous Provisions
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Severability</h3>
                  <p className="text-sm">
                    If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full effect.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Waiver</h3>
                  <p className="text-sm">
                    Our failure to enforce any right or provision will not be considered a waiver of those rights.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Entire Agreement</h3>
                  <p className="text-sm">
                    These Terms constitute the entire agreement between you and ToolZilla regarding the Service.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Assignment</h3>
                  <p className="text-sm">
                    We may assign our rights and obligations under these Terms without restriction.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              If you have any questions about these Terms of Service, please don't hesitate to contact us. 
              We're here to help clarify any concerns you may have.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Email: legal@toolzilla.com</span>
              </div>
              <p className="text-purple-100 text-sm">
                We typically respond to legal inquiries within 5 business days
              </p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-12 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-semibold mb-2">Important Legal Notice:</p>
              <p className="leading-relaxed">
                These Terms of Service constitute a legally binding agreement. By using ToolZilla, you acknowledge that you have 
                read, understood, and agree to be bound by these terms. If you do not agree with any part of these terms, 
                you must not use our service. Please print or save a copy of these terms for your records.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;