
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, ChevronDown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  unknownTime?: boolean;
  onUnknownTimeChange?: (unknown: boolean) => void;
}

export const DateTimePicker = ({ 
  date, 
  onDateChange, 
  time, 
  onTimeChange, 
  disabled,
  unknownTime = false,
  onUnknownTimeChange
}: DateTimePickerProps) => {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>(date?.getFullYear().toString() || "");
  const [selectedMonth, setSelectedMonth] = useState<string>(date?.getMonth().toString() || "");
  const [selectedDay, setSelectedDay] = useState<string>(date?.getDate().toString() || "");

  // Generar años (desde 1920 hasta el año actual)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);
  
  // Meses en español
  const months = [
    { value: "0", label: "Enero" },
    { value: "1", label: "Febrero" },
    { value: "2", label: "Marzo" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Mayo" },
    { value: "5", label: "Junio" },
    { value: "6", label: "Julio" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Septiembre" },
    { value: "9", label: "Octubre" },
    { value: "10", label: "Noviembre" },
    { value: "11", label: "Diciembre" }
  ];

  // Obtener días del mes seleccionado
  const getDaysInMonth = (year: string, month: string) => {
    if (!year || !month) return 31;
    return new Date(parseInt(year), parseInt(month) + 1, 0).getDate();
  };

  const daysInMonth = selectedYear && selectedMonth ? getDaysInMonth(selectedYear, selectedMonth) : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());

  const canCreateDate = selectedYear && selectedMonth && selectedDay;

  const handleDateSelection = () => {
    if (canCreateDate) {
      const newDate = new Date(parseInt(selectedYear), parseInt(selectedMonth), parseInt(selectedDay));
      onDateChange?.(newDate);
      setIsDateOpen(false);
    }
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    // Si el día seleccionado no existe en el nuevo año/mes, reiniciarlo
    if (selectedMonth && selectedDay) {
      const maxDays = getDaysInMonth(year, selectedMonth);
      if (parseInt(selectedDay) > maxDays) {
        setSelectedDay("1");
      }
    }
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    // Si el día seleccionado no existe en el nuevo mes, reiniciarlo
    if (selectedYear && selectedDay) {
      const maxDays = getDaysInMonth(selectedYear, month);
      if (parseInt(selectedDay) > maxDays) {
        setSelectedDay("1");
      }
    }
  };

  const handleUnknownTimeClick = () => {
    onUnknownTimeChange?.(!unknownTime);
    if (!unknownTime) {
      onTimeChange?.("");
    }
  };

  const getDateDisplay = () => {
    if (date) {
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
    }
    return "Selecciona tu fecha";
  };

  return (
    <div className="space-y-4">
      {/* Selector de Fecha */}
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
              <span className={date ? "font-medium" : ""}>
                {getDateDisplay()}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-96 p-6 bg-white/95 backdrop-blur-md border-white/20 shadow-2xl rounded-2xl" 
            align="start"
          >
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  🌟 Selecciona tu fecha de nacimiento
                </h3>
                <p className="text-sm text-gray-600">
                  Necesaria para calcular tu carta astral
                </p>
              </div>
              
              {/* Selectores */}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Año</label>
                    <Select value={selectedYear} onValueChange={handleYearChange}>
                      <SelectTrigger className="h-10 rounded-lg border-gray-300 focus:border-purple-400 focus:ring-purple-400">
                        <SelectValue placeholder="Año" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-white">
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Mes</label>
                    <Select value={selectedMonth} onValueChange={handleMonthChange}>
                      <SelectTrigger className="h-10 rounded-lg border-gray-300 focus:border-purple-400 focus:ring-purple-400">
                        <SelectValue placeholder="Mes" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Día</label>
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger className="h-10 rounded-lg border-gray-300 focus:border-purple-400 focus:ring-purple-400">
                        <SelectValue placeholder="Día" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 bg-white">
                        {days.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Vista previa */}
                {canCreateDate && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-700 text-center font-medium">
                      📅 Fecha seleccionada: {selectedDay} de {months.find(m => m.value === selectedMonth)?.label} de {selectedYear}
                    </p>
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex justify-between gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDateOpen(false)}
                  className="flex-1 rounded-lg"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDateSelection}
                  disabled={!canCreateDate}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg disabled:opacity-50"
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selector de Hora */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="relative flex-1">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300 z-10" />
            <Input
              type="time"
              value={unknownTime ? "" : time}
              onChange={(e) => onTimeChange?.(e.target.value)}
              className="bg-white/10 border-white/30 text-white h-12 rounded-xl border-2 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 pl-10 disabled:opacity-50"
              disabled={disabled || unknownTime}
              placeholder="Hora (opcional)"
            />
            {unknownTime && (
              <div className="absolute inset-0 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-white/80 text-sm font-medium">
                  Hora desconocida
                </span>
              </div>
            )}
          </div>
        </div>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleUnknownTimeClick}
          className={cn(
            "w-full h-10 rounded-lg border border-white/30 text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 text-sm",
            unknownTime && "bg-white/20 text-white border-purple-400"
          )}
          disabled={disabled}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          {unknownTime ? "✓ Usar hora desconocida" : "No conozco mi horario exacto"}
        </Button>
        
        <p className="text-white/60 text-xs text-center">
          💫 {unknownTime 
            ? "Sin problema, tu carta será igual de precisa" 
            : "La hora mejora la precisión, pero no es obligatoria"}
        </p>
      </div>
    </div>
  );
};
