import { useState, useRef, useEffect } from 'react';
import { format, isAfter, isBefore, isEqual } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DateRangePickerProps {
  startDate?: string; // ISO date string (YYYY-MM-DD)
  endDate?: string;   // ISO date string (YYYY-MM-DD)
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: {
    start?: string;
    end?: string;
  };
  minDate?: Date;
  maxDate?: Date;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className = '',
  disabled = false,
  placeholder = { start: 'Move in', end: 'Move out' },
  minDate = new Date(),
  maxDate
}: DateRangePickerProps) {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const startPickerRef = useRef<HTMLDivElement>(null);
  const endPickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        startPickerRef.current &&
        !startPickerRef.current.contains(event.target as Node)
      ) {
        setShowStartPicker(false);
      }
      if (
        endPickerRef.current &&
        !endPickerRef.current.contains(event.target as Node)
      ) {
        setShowEndPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      onStartDateChange(dateStr);
      setShowStartPicker(false);

      // Clear end date if it's before or equal to the new start date
      if (endDate) {
        const endDateObj = new Date(endDate);
        if (isBefore(endDateObj, date) || isEqual(endDateObj, date)) {
          onEndDateChange('');
        }
      }
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      onEndDateChange(dateStr);
      setShowEndPicker(false);
    }
  };

  const formatDisplayDate = (dateStr?: string): string => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch {
      return '';
    }
  };

  const getMinEndDate = (): Date => {
    if (startDate) {
      const startDateObj = new Date(startDate);
      const nextDay = new Date(startDateObj);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
    }
    return minDate;
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Start Date Picker */}
      <div ref={startPickerRef} className="relative flex-1">
        <button
          type="button"
          onClick={() => {
            if (!disabled) {
              setShowStartPicker(!showStartPicker);
              setShowEndPicker(false);
            }
          }}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg text-left
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
            ${showStartPicker ? 'ring-2 ring-blue-500 border-transparent' : ''}
            transition-colors duration-200
          `}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                {placeholder.start}
              </div>
              <div className={`text-sm ${startDate ? 'text-gray-900' : 'text-gray-400'}`}>
                {formatDisplayDate(startDate) || 'Add date'}
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </button>

        {showStartPicker && (
          <div className="absolute z-50 mt-1 p-3 bg-white border border-gray-300 rounded-lg shadow-lg">
            <DayPicker
              mode="single"
              selected={startDate ? new Date(startDate) : undefined}
              onSelect={handleStartDateSelect}
              disabled={{ before: minDate, after: maxDate }}
              className="!m-0"
            />
          </div>
        )}
      </div>

      {/* End Date Picker */}
      <div ref={endPickerRef} className="relative flex-1">
        <button
          type="button"
          onClick={() => {
            if (!disabled) {
              setShowEndPicker(!showEndPicker);
              setShowStartPicker(false);
            }
          }}
          disabled={disabled || !startDate}
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg text-left
            ${disabled || !startDate ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'}
            ${showEndPicker ? 'ring-2 ring-blue-500 border-transparent' : ''}
            transition-colors duration-200
          `}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                {placeholder.end}
              </div>
              <div className={`text-sm ${endDate ? 'text-gray-900' : 'text-gray-400'}`}>
                {formatDisplayDate(endDate) || 'Add date'}
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
            </svg>
          </div>
        </button>

        {showEndPicker && (
          <div className="absolute z-50 mt-1 p-3 bg-white border border-gray-300 rounded-lg shadow-lg">
            <DayPicker
              mode="single"
              selected={endDate ? new Date(endDate) : undefined}
              onSelect={handleEndDateSelect}
              disabled={{ before: getMinEndDate(), after: maxDate }}
              className="!m-0"
            />
          </div>
        )}
      </div>
    </div>
  );
}