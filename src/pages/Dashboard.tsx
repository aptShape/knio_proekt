import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  DollarSign, 
  Clock, 
  CalendarClock, 
  Briefcase,
  CalendarOff,
  Plus,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { WorkDataProvider, useWorkData } from '../contexts/WorkDataContext';
import WorkEntryForm from '../components/WorkEntryForm';
import WorkEntryList from '../components/WorkEntryList';

const DashboardContent: React.FC = () => {
  const { user } = useAuth();
  const { entries, calculateTotalSalary } = useWorkData();
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [stats, setStats] = useState({
    totalRegularDays: 0,
    totalWeekendDays: 0,
    totalHolidayDays: 0,
    totalDays: 0
  });
  
  useEffect(() => {
    // Calculate statistics
    const totalRegularDays = entries.reduce((sum, entry) => sum + entry.regularDays, 0);
    const totalWeekendDays = entries.reduce((sum, entry) => sum + entry.weekendDays, 0);
    const totalHolidayDays = entries.reduce((sum, entry) => sum + entry.holidayDays, 0);
    const totalDays = totalRegularDays + totalWeekendDays + totalHolidayDays;
    
    setStats({
      totalRegularDays,
      totalWeekendDays,
      totalHolidayDays,
      totalDays
    });
  }, [entries]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}</h1>
          <p className="text-gray-600">
            Here's an overview of your work and earnings.
          </p>
        </div>
        <button
          onClick={() => setShowEntryForm(true)}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Work Entry
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-md">
              <DollarSign className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(calculateTotalSalary())}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-teal-100 p-3 rounded-md">
              <Briefcase className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Regular Days</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalRegularDays}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-amber-100 p-3 rounded-md">
              <CalendarOff className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Weekend Days</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalWeekendDays}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-rose-100 p-3 rounded-md">
              <CalendarClock className="h-6 w-6 text-rose-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Holiday Days</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalHolidayDays}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Work Entry Form Modal */}
      {showEntryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Work Entry</h2>
              <button 
                onClick={() => setShowEntryForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <WorkEntryForm 
              onSuccess={() => setShowEntryForm(false)}
              onCancel={() => setShowEntryForm(false)}
            />
          </div>
        </div>
      )}

      {/* Recent Entries */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Work Entries</h2>
        <WorkEntryList />
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <WorkDataProvider>
      <DashboardContent />
    </WorkDataProvider>
  );
};

export default Dashboard;