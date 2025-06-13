import React, { useState, useMemo } from 'react';
import { Calculator, DollarSign, TrendingUp, PieChart, Info } from 'lucide-react';

type CalculatorType = 'emi' | 'compound' | 'loan';

interface EMIData {
  principal: number;
  rate: number;
  tenure: number;
}

interface CompoundData {
  principal: number;
  rate: number;
  time: number;
  frequency: number;
}

interface LoanData {
  loanAmount: number;
  rate: number;
  tenure: number;
  prepayment: number;
}

const FinanceCalculators: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('emi');
  
  // EMI Calculator State
  const [emiData, setEmiData] = useState<EMIData>({
    principal: 1000000,
    rate: 8.5,
    tenure: 240
  });

  // Compound Interest State
  const [compoundData, setCompoundData] = useState<CompoundData>({
    principal: 100000,
    rate: 12,
    time: 10,
    frequency: 12
  });

  // Loan Repayment State
  const [loanData, setLoanData] = useState<LoanData>({
    loanAmount: 500000,
    rate: 9,
    tenure: 180,
    prepayment: 0
  });

  // EMI Calculations
  const emiCalculations = useMemo(() => {
    const { principal, rate, tenure } = emiData;
    const monthlyRate = rate / (12 * 100);
    const emi = monthlyRate === 0 
      ? principal / tenure 
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - principal;

    return {
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      interestPercentage: Math.round((totalInterest / totalAmount) * 100)
    };
  }, [emiData]);

  // Compound Interest Calculations
  const compoundCalculations = useMemo(() => {
    const { principal, rate, time, frequency } = compoundData;
    const amount = principal * Math.pow(1 + (rate / 100) / frequency, frequency * time);
    const interest = amount - principal;

    return {
      finalAmount: Math.round(amount),
      interestEarned: Math.round(interest),
      growth: Math.round((interest / principal) * 100)
    };
  }, [compoundData]);

  // Loan Repayment Calculations
  const loanCalculations = useMemo(() => {
    const { loanAmount, rate, tenure, prepayment } = loanData;
    const monthlyRate = rate / (12 * 100);
    const emi = monthlyRate === 0 
      ? loanAmount / tenure 
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
    
    let balance = loanAmount;
    let totalInterestWithoutPrepayment = (emi * tenure) - loanAmount;
    let totalInterestWithPrepayment = 0;
    let monthsWithPrepayment = 0;

    if (prepayment > 0) {
      for (let month = 1; month <= tenure; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = emi - interestPayment;
        
        totalInterestWithPrepayment += interestPayment;
        balance -= principalPayment;
        
        if (prepayment > 0 && month % 12 === 0) {
          balance = Math.max(0, balance - prepayment);
        }
        
        monthsWithPrepayment = month;
        if (balance <= 0) break;
      }
    }

    const interestSaved = totalInterestWithoutPrepayment - totalInterestWithPrepayment;
    const timeSaved = tenure - monthsWithPrepayment;

    return {
      emi: Math.round(emi),
      totalInterestWithoutPrepayment: Math.round(totalInterestWithoutPrepayment),
      totalInterestWithPrepayment: Math.round(totalInterestWithPrepayment),
      interestSaved: Math.round(interestSaved),
      timeSaved: Math.max(0, timeSaved)
    };
  }, [loanData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculators = [
    { id: 'emi', name: 'EMI Calculator', icon: Calculator },
    { id: 'compound', name: 'Compound Interest', icon: TrendingUp },
    { id: 'loan', name: 'Loan Repayment', icon: DollarSign }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Finance Calculators
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional financial calculators for EMI, compound interest, and loan repayment planning. 
            Make informed financial decisions with accurate calculations.
          </p>
        </div>

        {/* Calculator Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <button
                key={calc.id}
                onClick={() => setActiveCalculator(calc.id as CalculatorType)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeCalculator === calc.id
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{calc.name}</span>
              </button>
            );
          })}
        </div>

        {/* EMI Calculator */}
        {activeCalculator === 'emi' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                EMI Calculator
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Loan Amount: {formatCurrency(emiData.principal)}
                  </label>
                  <input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="50000"
                    value={emiData.principal}
                    onChange={(e) => setEmiData({...emiData, principal: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>₹1L</span>
                    <span>₹1Cr</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Interest Rate: {emiData.rate}% per annum
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="0.25"
                    value={emiData.rate}
                    onChange={(e) => setEmiData({...emiData, rate: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>5%</span>
                    <span>20%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Loan Tenure: {Math.round(emiData.tenure / 12)} years ({emiData.tenure} months)
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="360"
                    step="12"
                    value={emiData.tenure}
                    onChange={(e) => setEmiData({...emiData, tenure: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>1 year</span>
                    <span>30 years</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-purple-800 dark:text-purple-200">
                    <p className="font-semibold mb-1">EMI Formula:</p>
                    <p>EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)</p>
                    <p className="mt-1 text-xs">Where P = Principal, r = Monthly rate, n = Number of months</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                EMI Breakdown
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white">
                  <p className="text-sm opacity-90">Monthly EMI</p>
                  <p className="text-2xl font-bold">{formatCurrency(emiCalculations.emi)}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(emiCalculations.totalAmount)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <span className="font-medium text-green-800 dark:text-green-200">Principal Amount</span>
                  <span className="font-bold text-green-700 dark:text-green-300">{formatCurrency(emiData.principal)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                  <span className="font-medium text-orange-800 dark:text-orange-200">Total Interest</span>
                  <span className="font-bold text-orange-700 dark:text-orange-300">{formatCurrency(emiCalculations.totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <span className="font-medium text-blue-800 dark:text-blue-200">Interest Percentage</span>
                  <span className="font-bold text-blue-700 dark:text-blue-300">{emiCalculations.interestPercentage}%</span>
                </div>
              </div>

              {/* Visual representation */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Principal vs Interest</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 float-left"
                    style={{ width: `${(emiData.principal / emiCalculations.totalAmount) * 100}%` }}
                  />
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                    style={{ width: `${(emiCalculations.totalInterest / emiCalculations.totalAmount) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Principal ({Math.round((emiData.principal / emiCalculations.totalAmount) * 100)}%)</span>
                  <span>Interest ({Math.round((emiCalculations.totalInterest / emiCalculations.totalAmount) * 100)}%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compound Interest Calculator */}
        {activeCalculator === 'compound' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Compound Interest Calculator
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Principal Amount: {formatCurrency(compoundData.principal)}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="5000000"
                    step="10000"
                    value={compoundData.principal}
                    onChange={(e) => setCompoundData({...compoundData, principal: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>₹10K</span>
                    <span>₹50L</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Annual Interest Rate: {compoundData.rate}%
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="0.5"
                    value={compoundData.rate}
                    onChange={(e) => setCompoundData({...compoundData, rate: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>5%</span>
                    <span>25%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Period: {compoundData.time} years
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={compoundData.time}
                    onChange={(e) => setCompoundData({...compoundData, time: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>1 year</span>
                    <span>30 years</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Compounding Frequency
                  </label>
                  <select
                    value={compoundData.frequency}
                    onChange={(e) => setCompoundData({...compoundData, frequency: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value={1}>Annually</option>
                    <option value={2}>Semi-annually</option>
                    <option value={4}>Quarterly</option>
                    <option value={12}>Monthly</option>
                    <option value={365}>Daily</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-purple-800 dark:text-purple-200">
                    <p className="font-semibold mb-1">Compound Interest Formula:</p>
                    <p>A = P(1 + r/n)^(nt)</p>
                    <p className="mt-1 text-xs">Where A = Amount, P = Principal, r = Rate, n = Frequency, t = Time</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Investment Growth
              </h3>
              
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
                  <p className="text-sm opacity-90">Final Amount</p>
                  <p className="text-2xl font-bold">{formatCurrency(compoundCalculations.finalAmount)}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
                  <p className="text-sm opacity-90">Interest Earned</p>
                  <p className="text-2xl font-bold">{formatCurrency(compoundCalculations.interestEarned)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Principal Invested</span>
                  <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(compoundData.principal)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <span className="font-medium text-green-800 dark:text-green-200">Total Growth</span>
                  <span className="font-bold text-green-700 dark:text-green-300">{compoundCalculations.growth}%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <span className="font-medium text-purple-800 dark:text-purple-200">Compounding</span>
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    {compoundData.frequency === 1 && 'Annually'}
                    {compoundData.frequency === 2 && 'Semi-annually'}
                    {compoundData.frequency === 4 && 'Quarterly'}
                    {compoundData.frequency === 12 && 'Monthly'}
                    {compoundData.frequency === 365 && 'Daily'}
                  </span>
                </div>
              </div>

              {/* Visual representation */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Principal vs Interest</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-gray-500 to-gray-600 float-left"
                    style={{ width: `${(compoundData.principal / compoundCalculations.finalAmount) * 100}%` }}
                  />
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600"
                    style={{ width: `${(compoundCalculations.interestEarned / compoundCalculations.finalAmount) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Principal ({Math.round((compoundData.principal / compoundCalculations.finalAmount) * 100)}%)</span>
                  <span>Interest ({Math.round((compoundCalculations.interestEarned / compoundCalculations.finalAmount) * 100)}%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loan Repayment Calculator */}
        {activeCalculator === 'loan' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Loan Repayment Calculator
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Loan Amount: {formatCurrency(loanData.loanAmount)}
                  </label>
                  <input
                    type="range"
                    min="100000"
                    max="5000000"
                    step="50000"
                    value={loanData.loanAmount}
                    onChange={(e) => setLoanData({...loanData, loanAmount: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>₹1L</span>
                    <span>₹50L</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Interest Rate: {loanData.rate}% per annum
                  </label>
                  <input
                    type="range"
                    min="6"
                    max="18"
                    step="0.25"
                    value={loanData.rate}
                    onChange={(e) => setLoanData({...loanData, rate: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>6%</span>
                    <span>18%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Loan Tenure: {Math.round(loanData.tenure / 12)} years ({loanData.tenure} months)
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="300"
                    step="12"
                    value={loanData.tenure}
                    onChange={(e) => setLoanData({...loanData, tenure: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>1 year</span>
                    <span>25 years</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Annual Prepayment: {formatCurrency(loanData.prepayment)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="10000"
                    value={loanData.prepayment}
                    onChange={(e) => setLoanData({...loanData, prepayment: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>₹0</span>
                    <span>₹2L</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-purple-800 dark:text-purple-200">
                    <p className="font-semibold mb-1">Prepayment Benefits:</p>
                    <p>Making annual prepayments can significantly reduce your total interest and loan tenure.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Repayment Analysis
              </h3>
              
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
                  <p className="text-sm opacity-90">Monthly EMI</p>
                  <p className="text-2xl font-bold">{formatCurrency(loanCalculations.emi)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                  <span className="font-medium text-red-800 dark:text-red-200">Interest (Without Prepayment)</span>
                  <span className="font-bold text-red-700 dark:text-red-300">{formatCurrency(loanCalculations.totalInterestWithoutPrepayment)}</span>
                </div>
                
                {loanData.prepayment > 0 && (
                  <>
                    <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                      <span className="font-medium text-green-800 dark:text-green-200">Interest (With Prepayment)</span>
                      <span className="font-bold text-green-700 dark:text-green-300">{formatCurrency(loanCalculations.totalInterestWithPrepayment)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <span className="font-medium text-blue-800 dark:text-blue-200">Interest Saved</span>
                      <span className="font-bold text-blue-700 dark:text-blue-300">{formatCurrency(loanCalculations.interestSaved)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                      <span className="font-medium text-purple-800 dark:text-purple-200">Time Saved</span>
                      <span className="font-bold text-purple-700 dark:text-purple-300">{loanCalculations.timeSaved} months</span>
                    </div>
                  </>
                )}
              </div>

              {/* Savings visualization */}
              {loanData.prepayment > 0 && loanCalculations.interestSaved > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Interest Comparison</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-400 rounded"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Without Prepayment</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div className="h-full bg-red-400 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-4 h-4 bg-green-400 rounded"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">With Prepayment</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div 
                        className="h-full bg-green-400 rounded-full" 
                        style={{ width: `${(loanCalculations.totalInterestWithPrepayment / loanCalculations.totalInterestWithoutPrepayment) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceCalculators;