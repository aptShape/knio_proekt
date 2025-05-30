import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, CalendarDays, DollarSign, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-indigo-800 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Calculator className="h-8 w-8 text-teal-400" />
          <span className="text-2xl font-bold">SalaryTrack</span>
        </div>
        <div className="space-x-4">
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md transition-all duration-200"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-white hover:text-teal-300 transition-all duration-200"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md transition-all duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Track Your Work, <br />
            <span className="text-amber-400">Calculate Your Earnings</span>
          </h1>
          <p className="text-lg mb-8 text-indigo-200 max-w-md">
            The easiest way to track your working days and calculate your salary based on regular days, weekends, and holidays.
          </p>
          <div className="space-x-4">
            <Link 
              to="/register" 
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-md font-medium transition-all duration-200 inline-block"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="border border-white hover:border-teal-400 hover:text-teal-400 text-white px-8 py-3 rounded-md font-medium transition-all duration-200 inline-block"
            >
              Login
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="bg-indigo-700/50 p-8 rounded-2xl shadow-lg backdrop-blur-sm border border-indigo-600 w-full max-w-md">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-teal-500/20 p-3 rounded-lg">
                  <CalendarDays className="h-6 w-6 text-teal-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Track Working Days</h3>
                  <p className="text-indigo-200">Log your regular days, weekends, and holidays worked</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-amber-500/20 p-3 rounded-lg">
                  <Calculator className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Automatic Calculations</h3>
                  <p className="text-indigo-200">Get accurate salary calculations based on your work</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-500/20 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Salary Reports</h3>
                  <p className="text-indigo-200">View and export detailed reports of your earnings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white text-gray-800 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-2">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">1. Track Your Time</h3>
              <p className="text-gray-600 text-center">
                Enter the number of regular days, weekend days, and holiday days you worked.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-2">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Calculator className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">2. Automatic Calculation</h3>
              <p className="text-gray-600 text-center">
                Our system automatically calculates your earnings based on your hourly rate and days worked.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-2">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <DollarSign className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">3. View Reports</h3>
              <p className="text-gray-600 text-center">
                Access detailed reports and track your earnings over time with visual data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-950 text-indigo-200 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Calculator className="h-6 w-6 text-teal-400" />
              <span className="text-xl font-bold">SalaryTrack</span>
            </div>
            <div className="text-sm">
              © {new Date().getFullYear()} SalaryTrack. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;