import { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { cn } from '../lib/utils';
import { fallbackCampuses } from '../lib/campuses';
import { Campus } from '../types';

interface CampusAutocompleteProps {
  value: string;
  onChange: (value: string, campus?: Campus) => void;
  placeholder?: string;
  className?: string;
}

export function CampusAutocomplete({
  value,
  onChange,
  placeholder = 'Search by College or University',
  className,
}: CampusAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Campus[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle input changes
  useEffect(() => {
    if (!value.trim() || isSelected) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Filter local campuses
    const filtered = fallbackCampuses.filter(campus =>
      campus.name.toLowerCase().includes(value.toLowerCase())
    );

    // If we have local matches, show them
    if (filtered.length > 0) {
      setSuggestions(filtered.slice(0, 8)); // Limit to 8 results
      setShowSuggestions(true);
    } else {
      // Fallback to Google Places API (if available)
      fetchGooglePlacesSuggestions(value);
    }
  }, [value, isSelected]);

  const fetchGooglePlacesSuggestions = async (query: string) => {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
      if (!apiKey) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      // Note: This is a simplified example. In production, you'd want to use
      // the Google Places Autocomplete service or your own API endpoint
      const response = await fetch(
        `https://api.data.gov/ed/collegescorecard/v1/schools.json?school.name=${encodeURIComponent(query)}&school.degrees_awarded.predominant=2,3&fields=school.name&api_key=Xpxl6fdwzfjF8paehVPMXKOaxSFvmvtOL2vFUHZw&_limit=8`
      );
      
      if (response.ok) {
        const data = await response.json();
        const formattedSuggestions: Campus[] = data.results?.map((item: { 'school.name': string }, index: number) => ({
          id: `api-${index}`,
          name: item['school.name'],
          slug: item['school.name'].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        })) || [];
        
        setSuggestions(formattedSuggestions);
        setShowSuggestions(formattedSuggestions.length > 0);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsSelected(false);
  };

  const handleSuggestionSelect = (campus: Campus) => {
    onChange(campus.name, campus);
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSelected(true);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  return (
    <div className={cn('relative w-full', className)}>
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className="w-full"
        autoComplete="off"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              className="w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none border-b border-border/50 last:border-b-0"
              onClick={() => handleSuggestionSelect(suggestion)}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur
            >
              <div className="font-medium">{suggestion.name}</div>
              {suggestion.city && suggestion.state && (
                <div className="text-sm text-muted-foreground">
                  {suggestion.city}, {suggestion.state}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}