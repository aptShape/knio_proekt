import React, { useState, useEffect } from 'react';
import { LineChart, DollarSign, Calendar, Download } from 'lucide-react';
import { useWorkData, WorkDataProvider } from '../contexts/WorkDataContext';

// Separate the content into its own component that uses the context
const ReportsContent: React.FC = () => {
  const { entries, calculateSalaryForEntry } = useWorkData();
  const [monthlyData, setMonthlyData] = useState<Record<string, number>>({});
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const years = Array.from(
    new Set(entries.map(entry => new Date(entry.date).getFullYear()))
  ).sort((a, b) => b - a);
  
  // If no entries yet, add current year to options
  if (years.length === 0) {
    years.push(new Date().getFullYear());
  }
  
  useEffect(() => {
    // Group entries by month and calculate total earnings
    const data: Record<string, number> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize all months with zero
    months.forEach((month, index) => {
      data[month] = 0;
    });
    
    // Sum earnings by month for selected year
    entries.forEach(entry => {
      const entryDate = new Date(entry.date);
      const entryYear = entryDate.getFullYear();
      const entryMonth = entryDate.getMonth();
      
      if (entryYear === selectedYear) {
        const monthKey = months[entryMonth];
        data[monthKey] += calculateSalaryForEntry(entry);
      }
    });
    
    setMonthlyData(data);
  }, [entries, selectedYear, calculateSalaryForEntry]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Calculate stats
  const totalEarnings = Object.values(monthlyData).reduce((sum, value) => sum + value, 0);
  const averageMonthlyEarnings = totalEarnings / 12;
  const highestMonth = Object.entries(monthlyData).sort((a, b) => b[1] - a[1])[0];
  
  // Mock function for exporting data (would be implemented with a real export library)
  const exportData = () => {
    alert('Export functionality would generate a CSV or PDF here.');
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Earnings Reports</h1>
        <p className="text-gray-600">
          View and analyze your earning patterns over time.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Calendar className="h-5 w-5 text-gray-500 mr-2" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md py-1 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <button
            onClick={exportData}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-sm"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>
        
        {/* Monthly chart */}
        <div className="h-64 relative">
          <div className="absolute inset-0 flex items-end">
            {Object.entries(monthlyData).map(([month, value], index) => {
              const maxValue = Math.max(...Object.values(monthlyData));
              const percentage = maxValue === 0 ? 0 : (value / maxValue) * 100;
              
              return (
                <div 
                  key={month} 
                  className="flex flex-col items-center flex-1"
                >
                  <div 
                    className="w-full mx-1 bg-indigo-500 rounded-t-md transition-all duration-500 ease-in-out relative group"
                    style={{ 
                      height: `${percentage}%`,
                      minHeight: value > 0 ? '4px' : '0px'
                    }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none whitespace-nowrap">
                      {formatCurrency(value)}
                    </div>
                  </div>
                  <div className="text-xs mt-2 text-gray-600">{month}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-md">
              <DollarSign className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings ({selectedYear})</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalEarnings)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-teal-100 p-3 rounded-md">
              <LineChart className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Monthly</p>
              <p className="text-2xl font-bold text-gray-800">{formatCurrency(averageMonthlyEarnings)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-amber-100 p-3 rounded-md">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Highest Month</p>
              <p className="text-2xl font-bold text-gray-800">
                {highestMonth && highestMonth[1] > 0 
                  ? `${highestMonth[0]} (${formatCurrency(highestMonth[1])})` 
                  : 'No data'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Yearly summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Annual Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % of Annual
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(monthlyData).map(([month, value]) => (
                <tr key={month} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{month}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {formatCurrency(value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[200px]">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ 
                            width: totalEarnings > 0 
                              ? `${(value / totalEarnings) * 100}%` 
                              : '0%' 
                          }}
                        ></div>
                      </div>
                      <span>
                        {totalEarnings > 0 
                          ? `${((value / totalEarnings) * 100).toFixed(1)}%` 
                          : '0%'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Wrap the content with the WorkDataProvider
const Reports: React.FC = () => {
  return (
    <WorkDataProvider>
      <ReportsContent />
    </WorkDataProvider>
  );
};

export default Reports;