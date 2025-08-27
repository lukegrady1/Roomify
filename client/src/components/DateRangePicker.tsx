import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '../lib/utils';

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date?: Date) => void;
  onEndDateChange: (date?: Date) => void;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}: DateRangePickerProps) {
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const handleStartDateSelect = (date?: Date) => {
    onStartDateChange(date);
    setShowStartCalendar(false);
    
    // Clear end date if it's before the new start date
    if (date && endDate && endDate <= date) {
      onEndDateChange(undefined);
    }
  };

  const handleEndDateSelect = (date?: Date) => {
    onEndDateChange(date);
    setShowEndCalendar(false);
  };

  return (
    <div className={cn('flex gap-4', className)}>
      {/* Move-in Date */}
      <div className="flex-1">
        <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          MOVE IN
        </label>
        <Popover open={showStartCalendar} onOpenChange={setShowStartCalendar}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal h-12',
                !startDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, 'MMM d, yyyy') : 'Move in'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartDateSelect}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Move-out Date */}
      <div className="flex-1">
        <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          MOVE OUT
        </label>
        <Popover open={showEndCalendar} onOpenChange={setShowEndCalendar}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal h-12',
                !endDate && 'text-muted-foreground'
              )}
              disabled={!startDate}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, 'MMM d, yyyy') : 'Move out'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleEndDateSelect}
              disabled={(date) => {
                if (!startDate) return true;
                return date <= startDate;
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}