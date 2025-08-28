import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { searchCampuses, findCampusByName } from '../lib/campuses';
import type { Campus } from '../types';

interface CampusAutocompleteProps {
  value?: string;
  onChange: (campus: string) => void;
  onCampusSelect?: (campus: Campus | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function CampusAutocomplete({
  value = '',
  onChange,
  onCampusSelect,
  placeholder = 'Search by College or University',
  className = '',
  disabled = false
}: CampusAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Campus[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Fetch campus suggestions from Supabase, fallback to local data
  const fetchCampusSuggestions = async (query: string): Promise<Campus[]> => {
    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from('campuses')
        .select('*')
        .or(`name.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%`)
        .limit(10);

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (error) {
      console.warn('Supabase campus search failed, falling back to local data:', error);
    }

    // Fallback to local campus data
    return searchCampuses(query, 10) as Campus[];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSelectedCampus(null);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!newValue.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      onCampusSelect?.(null);
      return;
    }

    setIsLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const results = await fetchCampusSuggestions(newValue);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Error fetching campus suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleSuggestionClick = (campus: Campus) => {
    const campusName = campus.name;
    onChange(campusName);
    setSelectedCampus(campus);
    setShowSuggestions(false);
    setSuggestions([]);
    onCampusSelect?.(campus);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Find campus info when value changes externally
  useEffect(() => {
    if (value && !selectedCampus) {
      const campus = findCampusByName(value);
      if (campus) {
        setSelectedCampus(campus as Campus);
        onCampusSelect?.(campus as Campus);
      }
    }
  }, [value, selectedCampus, onCampusSelect]);

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${showSuggestions ? 'rounded-b-none' : ''}
        `}
        autoComplete="off"
      />
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 border-t-0 rounded-b-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((campus, index) => (
            <button
              key={campus.id || index}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionClick(campus)}
            >
              <div className="font-medium text-gray-900">{campus.name}</div>
              {(campus.city || campus.state) && (
                <div className="text-sm text-gray-500">
                  {[campus.city, campus.state].filter(Boolean).join(', ')}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}