import React, { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-react';
import { useWorkData, WorkEntry } from '../contexts/WorkDataContext';
import WorkEntryForm from './WorkEntryForm';
import toast from 'react-hot-toast';

const WorkEntryList: React.FC = () => {
  const { entries, deleteEntry, calculateSalaryForEntry } = useWorkData();
  const [editingEntry, setEditingEntry] = useState<WorkEntry | null>(null);
  const [sortField, setSortField] = useState<keyof WorkEntry>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const handleEdit = (entry: WorkEntry) => {
    setEditingEntry(entry);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(id);
      toast.success('Entry deleted successfully');
    }
  };
  
  const handleSort = (field: keyof WorkEntry) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new field
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Sort entries
  const sortedEntries = [...entries].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    // For numerical fields
    const valueA = a[sortField];
    const valueB = b[sortField];
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    }
    
    // Fallback for string comparison
    const strA = String(valueA).toLowerCase();
    const strB = String(valueB).toLowerCase();
    return sortDirection === 'asc'
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA);
  });
  
  // Calculate total days and total earnings
  const totalRegularDays = entries.reduce((sum, entry) => sum + entry.regularDays, 0);
  const totalWeekendDays = entries.reduce((sum, entry) => sum + entry.weekendDays, 0);
  const totalHolidayDays = entries.reduce((sum, entry) => sum + entry.holidayDays, 0);
  const totalEarnings = entries.reduce((sum, entry) => sum + calculateSalaryForEntry(entry), 0);
  
  return (
    <div>
      {/* Edit Modal */}
      {editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Work Entry</h2>
              <button 
                onClick={() => setEditingEntry(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <WorkEntryForm 
              existingEntry={editingEntry}
              onSuccess={() => setEditingEntry(null)}
              onCancel={() => setEditingEntry(null)}
            />
          </div>
        </div>
      )}
      
      {entries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No work entries yet. Add your first entry to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    <span>Date</span>
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('regularDays')}
                >
                  <div className="flex items-center">
                    <span>Regular Days</span>
                    {sortField === 'regularDays' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('weekendDays')}
                >
                  <div className="flex items-center">
                    <span>Weekend Days</span>
                    {sortField === 'weekendDays' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('holidayDays')}
                >
                  <div className="flex items-center">
                    <span>Holiday Days</span>
                    {sortField === 'holidayDays' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    <span>Earnings</span>
                  </div>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <span>{formatDate(entry.date)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.regularDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.weekendDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.holidayDays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-green-500 mr-1" />
                      {formatCurrency(calculateSalaryForEntry(entry))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {/* Summary row */}
              <tr className="bg-gray-50 font-medium">
                <td className="px-6 py-4 whitespace-nowrap">
                  <strong>Total</strong>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {totalRegularDays}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {totalWeekendDays}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {totalHolidayDays}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-green-600 mr-1" />
                    <strong>{formatCurrency(totalEarnings)}</strong>
                  </div>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkEntryList;