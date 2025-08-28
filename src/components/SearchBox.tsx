import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampusAutocomplete from './CampusAutocomplete';
import DateRangePicker from './DateRangePicker';
import { buildSearchUrl } from '../lib/queryString';
import type { Campus } from '../types';

interface SearchBoxProps {
  className?: string;
  defaultValues?: {
    campus?: string;
    startDate?: string;
    endDate?: string;
  };
  onSearch?: (filters: {
    campus: string;
    startDate: string;
    endDate: string;
    selectedCampus: Campus | null;
  }) => void;
  showValidation?: boolean;
}

export default function SearchBox({
  className = '',
  defaultValues,
  onSearch,
  showValidation = true
}: SearchBoxProps) {
  const [campus, setCampus] = useState(defaultValues?.campus || '');
  const [startDate, setStartDate] = useState(defaultValues?.startDate || '');
  const [endDate, setEndDate] = useState(defaultValues?.endDate || '');
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!campus.trim()) {
      newErrors.campus = 'Please select a campus';
    }

    if (!startDate) {
      newErrors.startDate = 'Please select a move-in date';
    }

    if (!endDate) {
      newErrors.endDate = 'Please select a move-out date';
    }

    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      newErrors.endDate = 'Move-out date must be after move-in date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    if (!showValidation || validateForm()) {
      const searchData = {
        campus,
        startDate,
        endDate,
        selectedCampus
      };

      if (onSearch) {
        onSearch(searchData);
      } else {
        // Default behavior: navigate to search page
        const url = buildSearchUrl({
          campus,
          start: startDate,
          end: endDate
        });
        navigate(url);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const isFormValid = campus && startDate && endDate;

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 ${className}`}>
      <div className="space-y-4">
        {/* Campus Search */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Location
          </label>
          <CampusAutocomplete
            value={campus}
            onChange={setCampus}
            onCampusSelect={setSelectedCampus}
            placeholder="Search by College or University"
            className="w-full"
          />
          {showValidation && errors.campus && (
            <p className="mt-1 text-sm text-red-600">{errors.campus}</p>
          )}
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Move Dates
          </label>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            placeholder={{ start: 'Move in', end: 'Move out' }}
            className="w-full"
          />
          {showValidation && errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
          {showValidation && errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
          )}
        </div>

        {/* Search Button */}
        <button
          type="button"
          onClick={handleSearch}
          onKeyPress={handleKeyPress}
          className={`
            w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors duration-200
            ${isFormValid 
              ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200' 
              : 'bg-gray-400 cursor-not-allowed'
            }
            focus:outline-none
          `}
          disabled={showValidation && !isFormValid}
        >
          Search
        </button>

        {/* Help Text */}
        <p className="text-xs text-gray-500 text-center">
          Find student housing and sublets near your campus
        </p>
      </div>
    </div>
  );
}