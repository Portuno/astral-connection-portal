
import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [year, setYear] = useState<string>(date?.getFullYear().toString() || "");
  const [month, setMonth] = useState<string>(date ? (date.getMonth() + 1).toString().padStart(2, '0') : "");
  const [day, setDay] = useState<string>(date?.getDate().toString().padStart(2, '0') || "");
  const [showTimeInput, setShowTimeInput] = useState<boolean>(!!time && !unknownTime);

  // Actualizar los valores cuando cambie la fecha desde fuera
  useEffect(() => {
    if (date) {
      setYear(date.getFullYear().toString());
      setMonth((date.getMonth() + 1).toString().padStart(2, '0'));
      setDay(date.getDate().toString().padStart(2, '0'));
    }
  }, [date]);

  // Validar y actualizar la fecha cuando cambien los inputs
  useEffect(() => {
    if (year && month && day) {
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);
      const dayNum = parseInt(day);
      
      // Validar que sea una fecha válida
      if (yearNum >= 1920 && yearNum <= new Date().getFullYear() &&
          monthNum >= 1 && monthNum <= 12 &&
          dayNum >= 1 && dayNum <= 31) {
        
        const newDate = new Date(yearNum, monthNum - 1, dayNum);
        
        // Verificar que la fecha es válida (no se ajusta automáticamente)
        if (newDate.getFullYear() === yearNum && 
            newDate.getMonth() === monthNum - 1 && 
            newDate.getDate() === dayNum &&
            newDate <= new Date()) {
          onDateChange?.(newDate);
        } else {
          onDateChange?.(undefined);
        }
      } else {
        onDateChange?.(undefined);
      }
    } else {
      onDateChange?.(undefined);
    }
  }, [year, month, day, onDateChange]);

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setYear(value);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
      setMonth(value);
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 31)) {
      setDay(value);
    }
  };

  const handleUnknownTimeClick = () => {
    const newUnknownTime = !unknownTime;
    onUnknownTimeChange?.(newUnknownTime);
    
    if (newUnknownTime) {
      onTimeChange?.("");
      setShowTimeInput(false);
    }
  };

  const handleAddTimeClick = () => {
    setShowTimeInput(true);
    onUnknownTimeChange?.(false);
  };

  const isDateValid = () => {
    if (!year || !month || !day) return false;
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);
    
    if (yearNum < 1920 || yearNum > new Date().getFullYear()) return false;
    if (monthNum < 1 || monthNum > 12) return false;
    if (dayNum < 1 || dayNum > 31) return false;
    
    const testDate = new Date(yearNum, monthNum - 1, dayNum);
    return testDate.getFullYear() === yearNum && 
           testDate.getMonth() === monthNum - 1 && 
           testDate.getDate() === dayNum &&
           testDate <= new Date();
  };

  return (
    <div className="space-y-6">
      {/* Selector de Fecha */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarIcon className="h-4 w-4 text-yellow-300" />
          <Label className="text-white font-medium">Fecha de nacimiento</Label>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {/* Año */}
          <div className="space-y-2">
            <Label className="text-white/80 text-xs">Año</Label>
            <Input
              type="text"
              value={year}
              onChange={handleYearChange}
              placeholder="1995"
              maxLength={4}
              className="bg-white/10 border-white/30 text-white text-center placeholder:text-white/50 h-12 rounded-xl border-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
              disabled={disabled}
            />
          </div>
          
          {/* Mes */}
          <div className="space-y-2">
            <Label className="text-white/80 text-xs">Mes</Label>
            <Input
              type="text"
              value={month}
              onChange={handleMonthChange}
              placeholder="07"
              maxLength={2}
              className="bg-white/10 border-white/30 text-white text-center placeholder:text-white/50 h-12 rounded-xl border-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
              disabled={disabled}
            />
          </div>
          
          {/* Día */}
          <div className="space-y-2">
            <Label className="text-white/80 text-xs">Día</Label>
            <Input
              type="text"
              value={day}
              onChange={handleDayChange}
              placeholder="25"
              maxLength={2}
              className="bg-white/10 border-white/30 text-white text-center placeholder:text-white/50 h-12 rounded-xl border-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Vista previa de fecha */}
        {isDateValid() && (
          <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-400/30 backdrop-blur-sm">
            <p className="text-yellow-200 text-sm text-center font-medium">
              📅 {(() => {
                const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                                  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
                const monthName = monthNames[parseInt(month) - 1] || 'mes';
                return `${day} de ${monthName} de ${year}`;
              })()}
            </p>
          </div>
        )}
        
        {/* Error de fecha */}
        {(year || month || day) && !isDateValid() && (
          <div className="p-3 bg-red-500/10 rounded-lg border border-red-400/30 backdrop-blur-sm">
            <p className="text-red-300 text-sm text-center">
              ⚠️ Por favor, verifica que la fecha sea válida
            </p>
          </div>
        )}
      </div>

      {/* Selector de Hora */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-purple-300" />
          <Label className="text-white font-medium">Hora de nacimiento (opcional)</Label>
        </div>

        {showTimeInput && !unknownTime ? (
          <div className="space-y-3">
            <div className="relative">
              <Input
                type="time"
                value={time}
                onChange={(e) => onTimeChange?.(e.target.value)}
                className="bg-white/10 border-white/30 text-white h-12 rounded-xl border-2 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                disabled={disabled}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowTimeInput(false)}
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg text-xs"
                disabled={disabled}
              >
                Quitar hora
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleUnknownTimeClick}
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg text-xs"
                disabled={disabled}
              >
                No conozco la hora
              </Button>
            </div>
          </div>
        ) : unknownTime ? (
          <div className="space-y-3">
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-400/30 backdrop-blur-sm">
              <p className="text-purple-200 text-sm text-center font-medium">
                ⏰ Hora desconocida - ¡No hay problema!
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowTimeInput(true);
                  onUnknownTimeChange?.(false);
                }}
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg text-xs"
                disabled={disabled}
              >
                Sí conozco la hora
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTimeClick}
              className="flex-1 h-10 rounded-lg border-white/30 text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 text-sm bg-white/5"
              disabled={disabled}
            >
              <Clock className="mr-2 h-4 w-4" />
              Agregar hora exacta
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleUnknownTimeClick}
              className="flex-1 h-10 rounded-lg border-white/30 text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 text-sm bg-white/5"
              disabled={disabled}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              No conozco mi hora
            </Button>
          </div>
        )}
        
        <p className="text-white/60 text-xs text-center">
          💫 {unknownTime || !showTimeInput
            ? "Tu carta astral será igualmente precisa sin la hora exacta" 
            : "La hora exacta mejora la precisión de tu carta astral"}
        </p>
      </div>
    </div>
  );
};
