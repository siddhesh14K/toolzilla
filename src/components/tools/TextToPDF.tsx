import React, { useState } from 'react';
import { Download, FileText, Loader, X, Info, Eye, Type, Palette } from 'lucide-react';

interface PDFSettings {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
  textColor: string;
  backgroundColor: string;
  includeHeader: boolean;
  headerText: string;
  includeFooter: boolean;
  footerText: string;
}

const TextToPDF: React.FC = () => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [settings, setSettings] = useState<PDFSettings>({
    fontSize: 12,
    fontFamily: 'Arial',
    lineHeight: 1.6,
    margin: 40,
    textColor: '#000000',
    backgroundColor: '#ffffff',
    includeHeader: false,
    headerText: '',
    includeFooter: false,
    footerText: ''
  });

  const fontOptions = [
    'Arial',
    'Times New Roman',
    'Helvetica',
    'Georgia',
    'Verdana',
    'Courier New'
  ];

  const predefinedTexts = [
    {
      name: 'Business Letter',
      content: `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Email Address]
[Phone Number]

[Date]

[Recipient's Name]
[Recipient's Title]
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear [Recipient's Name],

I am writing to express my interest in the [Position Title] position at [Company Name]. With my [relevant experience/skills], I believe I would be a valuable addition to your team.

In my previous role at [Previous Company], I successfully [achievement or responsibility]. This experience has equipped me with [relevant skills] that would be beneficial for this position.

I would welcome the opportunity to discuss how my background and enthusiasm can contribute to [Company Name]. Thank you for considering my application.

Sincerely,
[Your Name]`
    },
    {
      name: 'Meeting Minutes',
      content: `MEETING MINUTES

Meeting: [Meeting Name]
Date: [Date]
Time: [Time]
Location: [Location/Platform]
Attendees: [List of Attendees]

AGENDA ITEMS:

1. Review of Previous Minutes
   - Previous action items were reviewed
   - All items completed successfully

2. Project Updates
   - Project A: On track for Q4 delivery
   - Project B: Facing minor delays, mitigation strategies discussed

3. Budget Review
   - Current spending within allocated budget
   - Additional resources may be needed for Q1

4. New Business
   - New initiative proposal presented
   - Team training schedule for next quarter

ACTION ITEMS:
- [Name]: Complete project timeline review by [Date]
- [Name]: Prepare budget proposal for additional resources
- [Name]: Schedule team training sessions

NEXT MEETING: [Date and Time]

Meeting adjourned at [Time]`
    },
    {
      name: 'Report Template',
      content: `EXECUTIVE SUMMARY

This report provides an analysis of [topic] covering the period from [start date] to [end date]. The key findings indicate [brief summary of main points].

INTRODUCTION

The purpose of this report is to [purpose statement]. This analysis examines [scope of analysis] and provides recommendations for [intended outcome].

METHODOLOGY

Data was collected through [data collection methods]. The analysis employed [analytical methods] to ensure comprehensive coverage of the subject matter.

FINDINGS

Key Finding 1: [Description and supporting data]
- Supporting evidence
- Impact assessment
- Recommendations

Key Finding 2: [Description and supporting data]
- Supporting evidence
- Impact assessment
- Recommendations

Key Finding 3: [Description and supporting data]
- Supporting evidence
- Impact assessment
- Recommendations

RECOMMENDATIONS

Based on the analysis, the following recommendations are proposed:

1. [Recommendation 1] - [Expected impact and timeline]
2. [Recommendation 2] - [Expected impact and timeline]
3. [Recommendation 3] - [Expected impact and timeline]

CONCLUSION

In conclusion, [summary of key points and next steps]. Implementation of these recommendations should result in [expected outcomes].`
    }
  ];

  const loadPredefinedText = (content: string) => {
    setText(content);
  };

  const generatePDF = async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert to PDF');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a simple PDF using browser's print functionality
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Generated PDF</title>
            <style>
              body {
                font-family: ${settings.fontFamily}, sans-serif;
                font-size: ${settings.fontSize}px;
                line-height: ${settings.lineHeight};
                color: ${settings.textColor};
                background-color: ${settings.backgroundColor};
                margin: ${settings.margin}px;
                padding: 0;
              }
              .header {
                text-align: center;
                border-bottom: 1px solid #ccc;
                padding-bottom: 10px;
                margin-bottom: 20px;
                font-weight: bold;
              }
              .footer {
                text-align: center;
                border-top: 1px solid #ccc;
                padding-top: 10px;
                margin-top: 20px;
                font-size: ${settings.fontSize - 2}px;
              }
              .content {
                white-space: pre-wrap;
                word-wrap: break-word;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${settings.includeHeader ? `<div class="header">${settings.headerText || 'Document Header'}</div>` : ''}
            <div class="content">${text}</div>
            ${settings.includeFooter ? `<div class="footer">${settings.footerText || 'Document Footer'}</div>` : ''}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
          </html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
      }
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Text to PDF Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Convert your text to beautifully formatted PDF documents. Choose from styling templates, 
            customize fonts, and add headers and footers for professional results.
          </p>
        </div>

        {/* Info Panel */}
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">How it works:</h3>
              <ol className="text-sm text-red-800 dark:text-red-200 space-y-1">
                <li>1. Enter your text or load a template</li>
                <li>2. Customize styling options (font, size, colors)</li>
                <li>3. Add optional headers and footers</li>
                <li>4. Preview and generate your PDF</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Text Input */}
          <div className="lg:col-span-2 space-y-6">
            {/* Predefined Templates */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Templates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {predefinedTexts.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => loadPredefinedText(template.content)}
                    className="p-3 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-left"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Area */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your Text
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={togglePreview}
                    className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {showPreview ? 'Edit' : 'Preview'}
                  </button>
                </div>
              </div>
              
              {showPreview ? (
                <div 
                  className="min-h-96 p-4 bg-white border border-gray-300 rounded-lg overflow-auto"
                  style={{
                    fontFamily: settings.fontFamily,
                    fontSize: `${settings.fontSize}px`,
                    lineHeight: settings.lineHeight,
                    color: settings.textColor,
                    backgroundColor: settings.backgroundColor
                  }}
                >
                  {settings.includeHeader && (
                    <div className="text-center border-b border-gray-300 pb-2 mb-4 font-bold">
                      {settings.headerText || 'Document Header'}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">
                    {text || 'Enter your text to see preview...'}
                  </div>
                  {settings.includeFooter && (
                    <div className="text-center border-t border-gray-300 pt-2 mt-4 text-sm">
                      {settings.footerText || 'Document Footer'}
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your text here or load a template above..."
                  className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              )}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Font Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Type className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Typography
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Family
                  </label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => setSettings({...settings, fontFamily: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {fontOptions.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Size: {settings.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="24"
                    value={settings.fontSize}
                    onChange={(e) => setSettings({...settings, fontSize: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Line Height: {settings.lineHeight}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={settings.lineHeight}
                    onChange={(e) => setSettings({...settings, lineHeight: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Margin: {settings.margin}px
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={settings.margin}
                    onChange={(e) => setSettings({...settings, margin: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Color Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Colors
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={settings.textColor}
                    onChange={(e) => setSettings({...settings, textColor: e.target.value})}
                    className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={settings.backgroundColor}
                    onChange={(e) => setSettings({...settings, backgroundColor: e.target.value})}
                    className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Header/Footer Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Header & Footer
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id="includeHeader"
                      checked={settings.includeHeader}
                      onChange={(e) => setSettings({...settings, includeHeader: e.target.checked})}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor="includeHeader" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Include Header
                    </label>
                  </div>
                  {settings.includeHeader && (
                    <input
                      type="text"
                      value={settings.headerText}
                      onChange={(e) => setSettings({...settings, headerText: e.target.value})}
                      placeholder="Header text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id="includeFooter"
                      checked={settings.includeFooter}
                      onChange={(e) => setSettings({...settings, includeFooter: e.target.checked})}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor="includeFooter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Include Footer
                    </label>
                  </div>
                  {settings.includeFooter && (
                    <input
                      type="text"
                      value={settings.footerText}
                      onChange={(e) => setSettings({...settings, footerText: e.target.value})}
                      placeholder="Footer text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePDF}
              disabled={isGenerating || !text.trim()}
              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Generate PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToPDF;