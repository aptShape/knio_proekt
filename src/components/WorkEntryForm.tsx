import React, { useState } from 'react';
import { AlertCircle, Calendar } from 'lucide-react';
import { useWorkData } from '../contexts/WorkDataContext';
import toast from 'react-hot-toast';

type WorkEntryFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
  existingEntry?: any;
};

const WorkEntryForm: React.FC<WorkEntryFormProps> = ({ 
  onSuccess, 
  onCancel, 
  existingEntry 
}) => {
  const { addEntry, updateEntry } = useWorkData();
  const isEditing = !!existingEntry;
  
  const [formData, setFormData] = useState({
    date: existingEntry?.date || new Date().toISOString().split('T')[0],
    regularDays: existingEntry?.regularDays || 0,
    weekendDays: existingEntry?.weekendDays || 0,
    holidayDays: existingEntry?.holidayDays || 0,
    notes: existingEntry?.notes || ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const parsedValue = 
      name === 'regularDays' || name === 'weekendDays' || name === 'holidayDays'
        ? parseInt(value) || 0
        : value;
    
    setFormData({
      ...formData,
      [name]: parsedValue
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (formData.regularDays < 0) {
      newErrors.regularDays = 'Regular days cannot be negative';
    }
    
    if (formData.weekendDays < 0) {
      newErrors.weekendDays = 'Weekend days cannot be negative';
    }
    
    if (formData.holidayDays < 0) {
      newErrors.holidayDays = 'Holiday days cannot be negative';
    }
    
    if (
      formData.regularDays === 0 && 
      formData.weekendDays === 0 && 
      formData.holidayDays === 0
    ) {
      newErrors.regularDays = 'You must enter at least one day worked';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      if (isEditing) {
        updateEntry(existingEntry.id, formData);
        toast.success('Work entry updated successfully');
      } else {
        addEntry(formData);
        toast.success('Work entry added successfully');
      }
      
      onSuccess();
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2 sm:text-sm border ${
                errors.date ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
          </div>
          {errors.date && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.date}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="regularDays" className="block text-sm font-medium text-gray-700">
              Regular Days
            </label>
            <input
              type="number"
              id="regularDays"
              name="regularDays"
              min="0"
              value={formData.regularDays}
              onChange={handleChange}
              className={`mt-1 block w-full py-2 px-3 sm:text-sm border ${
                errors.regularDays ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.regularDays && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.regularDays}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="weekendDays" className="block text-sm font-medium text-gray-700">
              Weekend Days
            </label>
            <input
              type="number"
              id="weekendDays"
              name="weekendDays"
              min="0"
              value={formData.weekendDays}
              onChange={handleChange}
              className={`mt-1 block w-full py-2 px-3 sm:text-sm border ${
                errors.weekendDays ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.weekendDays && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.weekendDays}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="holidayDays" className="block text-sm font-medium text-gray-700">
              Holiday Days
            </label>
            <input
              type="number"
              id="holidayDays"
              name="holidayDays"
              min="0"
              value={formData.holidayDays}
              onChange={handleChange}
              className={`mt-1 block w-full py-2 px-3 sm:text-sm border ${
                errors.holidayDays ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.holidayDays && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.holidayDays}
              </p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full py-2 px-3 sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Add any additional information..."
          />
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting
              ? 'Saving...'
              : isEditing
              ? 'Update Entry'
              : 'Add Entry'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default WorkEntryForm;