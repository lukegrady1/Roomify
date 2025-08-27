import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import { Button } from './ui/button';
import { CampusAutocomplete } from './CampusAutocomplete';
import { DateRangePicker } from './DateRangePicker';
import { cn } from '../lib/utils';
import { Campus } from '../types';
import { buildSearchString } from '../lib/queryString';
import { format } from 'date-fns';

interface SearchBoxProps {
  className?: string;
}

export function SearchBox({ className }: SearchBoxProps) {
  const navigate = useNavigate();
  const [campus, setCampus] = useState('');
  const [, setSelectedCampus] = useState<Campus | undefined>();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);
  const [showValidation, setShowValidation] = useState(false);

  const handleCampusChange = (value: string, campusData?: Campus) => {
    setCampus(value);
    setSelectedCampus(campusData);
  };

  const handleSearch = () => {
    setShowValidation(true);

    // Validate required fields
    if (!campus.trim()) {
      return;
    }

    // Build search parameters
    const searchParams = {
      campus: campus,
      ...(startDate && { start: format(startDate, 'yyyy-MM-dd') }),
      ...(endDate && { end: format(endDate, 'yyyy-MM-dd') }),
    };

    const searchString = buildSearchString(searchParams);
    navigate(`/search?${searchString}`);
  };

  // const isFormValid = campus.trim().length > 0;

  return (
    <div className={cn('bg-white rounded-2xl shadow-xl p-6 border border-border/10', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Campus Search */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            LOCATION
          </label>
          <CampusAutocomplete
            value={campus}
            onChange={handleCampusChange}
            placeholder="Search by College or University"
            className="h-12"
          />
          {showValidation && !campus && (
            <p className="text-sm text-destructive mt-1">Please enter a location</p>
          )}
        </div>

        {/* Date Range */}
        <div className="lg:col-span-1">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>

        {/* Guests & Search Button */}
        <div className="flex flex-col justify-end">
          <div className="mb-4 lg:mb-0">
            <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              GUESTS
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full h-12 pl-10 pr-4 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer"
              >
                {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'guest' : 'guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={handleSearch}
            className="h-12 bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            size="lg"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}