
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

// Popular cities database for autocomplete
const POPULAR_CITIES = [
  "Madrid, España", "Barcelona, España", "Valencia, España", "Sevilla, España", "Bilbao, España",
  "París, Francia", "Londres, Reino Unido", "Roma, Italia", "Berlín, Alemania", "Amsterdam, Países Bajos",
  "Nueva York, Estados Unidos", "Los Ángeles, Estados Unidos", "Miami, Estados Unidos", "Chicago, Estados Unidos",
  "México DF, México", "Buenos Aires, Argentina", "São Paulo, Brasil", "Río de Janeiro, Brasil",
  "Tokio, Japón", "Seúl, Corea del Sur", "Bangkok, Tailandia", "Singapur", "Dubai, Emiratos Árabes",
  "Sídney, Australia", "Melbourne, Australia", "Toronto, Canadá", "Vancouver, Canadá",
  "Estocolmo, Suecia", "Copenhague, Dinamarca", "Oslo, Noruega", "Helsinki, Finlandia",
  "Zurich, Suiza", "Viena, Austria", "Praga, República Checa", "Varsovia, Polonia",
  "Lisboa, Portugal", "Atenas, Grecia", "Dubrovnik, Croacia", "Budapest, Hungría",
  "Marrakech, Marruecos", "El Cairo, Egipto", "Ciudad del Cabo, Sudáfrica", "Nairobi, Kenia",
  "Mumbai, India", "Delhi, India", "Bangalore, India", "Shanghái, China", "Hong Kong",
  "Bali, Indonesia", "Manila, Filipinas", "Ho Chi Minh, Vietnam", "Kuala Lumpur, Malasia"
];

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const CityAutocomplete = ({ value, onChange, disabled }: CityAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = POPULAR_CITIES.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
      setHighlightedIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const handleBlur = () => {
    // Delay to allow click on suggestions
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-300 z-10" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => value.length >= 2 && setShowSuggestions(true)}
          className="bg-white/10 border-white/30 text-white placeholder:text-white/50 h-12 rounded-2xl border-2 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300 pl-10"
          placeholder="Barcelona, España ✨"
          disabled={disabled}
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                index === highlightedIndex
                  ? 'bg-purple-500/20 text-purple-900'
                  : 'text-gray-800 hover:bg-purple-500/10'
              } ${index === 0 ? 'rounded-t-xl' : ''} ${
                index === suggestions.length - 1 ? 'rounded-b-xl' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <MapPin className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <span className="font-medium">{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityAutocomplete;
