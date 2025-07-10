
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  time?: string;
  onTimeChange?: (time: string) => void;
  disabled?: boolean;
}

export const DateTimePicker = ({ 
  date, 
  onDateChange, 
  time, 
  onTimeChange, 
  disabled 
}: DateTimePickerProps) => {
  const [isDateOpen, setIsDateOpen] = useState(false);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-12 rounded-xl border-2 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-yellow-400/50 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 justify-start text-left font-normal",
                !date && "text-white/50"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-yellow-300" />
              {date ? (
                <span className="font-medium">
                  {format(date, "dd MMM yyyy", { locale: es })}
                </span>
              ) : (
                <span>Tu llegada</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0 bg-white/95 backdrop-blur-md border-white/20 shadow-2xl rounded-2xl" 
            align="start"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                onDateChange?.(selectedDate);
                setIsDateOpen(false);
              }}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
              className="p-4 pointer-events-auto"
              classNames={{
                head_cell: "text-gray-600 font-semibold",
                cell: "relative p-0 text-center focus-within:relative focus-within:z-20",
                day: cn(
                  "h-8 w-8 p-0 font-normal text-gray-700 hover:bg-purple-100 hover:text-purple-900 rounded-lg transition-colors",
                  "aria-selected:bg-gradient-to-r aria-selected:from-purple-500 aria-selected:to-pink-500 aria-selected:text-white aria-selected:opacity-100 aria-selected:shadow-lg"
                ),
                day_today: "bg-yellow-100 text-yellow-900 font-semibold",
                day_outside: "text-gray-400 opacity-50",
                day_disabled: "text-gray-300 opacity-30",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center text-gray-800 font-semibold",
                caption_label: "text-sm font-medium",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-gray-600 hover:bg-gray-100 rounded",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                row: "flex w-full mt-2"
              }}
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300 z-10" />
          <Input
            type="time"
            value={time}
            onChange={(e) => onTimeChange?.(e.target.value)}
            className="bg-white/10 border-white/30 text-white h-12 rounded-xl border-2 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 pl-10"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};
