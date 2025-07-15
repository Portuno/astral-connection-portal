import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, Star } from "lucide-react";

interface City {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
  score: number;
  source: 'local' | 'nominatim' | 'photon' | 'geonames';
  country: string;
  region?: string;
  population?: number;
}

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Base de datos local de ciudades importantes (especialmente España)
const localCities: Omit<City, 'score' | 'place_id'>[] = [
  // España - Ciudades principales
  { display_name: "Madrid, España", lat: "40.4168", lon: "-3.7038", source: 'local', country: "España", region: "Comunidad de Madrid", population: 3223000 },
  { display_name: "Barcelona, España", lat: "41.3851", lon: "2.1734", source: 'local', country: "España", region: "Cataluña", population: 1620000 },
  { display_name: "Valencia, España", lat: "39.4699", lon: "-0.3763", source: 'local', country: "España", region: "Comunidad Valenciana", population: 791000 },
  { display_name: "Sevilla, España", lat: "37.3891", lon: "-5.9845", source: 'local', country: "España", region: "Andalucía", population: 688000 },
  { display_name: "Bilbao, España", lat: "43.2627", lon: "-2.9253", source: 'local', country: "España", region: "País Vasco", population: 345000 },
  { display_name: "Málaga, España", lat: "36.7213", lon: "-4.4214", source: 'local', country: "España", region: "Andalucía", population: 574000 },
  { display_name: "Zaragoza, España", lat: "41.6488", lon: "-0.8891", source: 'local', country: "España", region: "Aragón", population: 675000 },
  { display_name: "Palma de Mallorca, España", lat: "39.5696", lon: "2.6502", source: 'local', country: "España", region: "Islas Baleares", population: 416000 },
  { display_name: "Las Palmas de Gran Canaria, España", lat: "28.1248", lon: "-15.4300", source: 'local', country: "España", region: "Canarias", population: 380000 },
  { display_name: "Murcia, España", lat: "37.9922", lon: "-1.1307", source: 'local', country: "España", region: "Región de Murcia", population: 453000 },
  { display_name: "Alicante, España", lat: "38.3460", lon: "-0.4907", source: 'local', country: "España", region: "Comunidad Valenciana", population: 334000 },
  { display_name: "Córdoba, España", lat: "37.8882", lon: "-4.7794", source: 'local', country: "España", region: "Andalucía", population: 326000 },
  { display_name: "Valladolid, España", lat: "41.6523", lon: "-4.7245", source: 'local', country: "España", region: "Castilla y León", population: 299000 },
  { display_name: "Vigo, España", lat: "42.2406", lon: "-8.7207", source: 'local', country: "España", region: "Galicia", population: 295000 },
  { display_name: "Gijón, España", lat: "43.5322", lon: "-5.6611", source: 'local', country: "España", region: "Asturias", population: 271000 },
  { display_name: "Granada, España", lat: "37.1773", lon: "-3.5986", source: 'local', country: "España", region: "Andalucía", population: 232000 },
  { display_name: "Vitoria-Gasteiz, España", lat: "42.8467", lon: "-2.6716", source: 'local', country: "España", region: "País Vasco", population: 249000 },
  { display_name: "A Coruña, España", lat: "43.3623", lon: "-8.4115", source: 'local', country: "España", region: "Galicia", population: 246000 },
  { display_name: "Elche, España", lat: "38.2622", lon: "-0.7011", source: 'local', country: "España", region: "Comunidad Valenciana", population: 230000 },
  { display_name: "Oviedo, España", lat: "43.3614", lon: "-5.8493", source: 'local', country: "España", region: "Asturias", population: 220000 },
  { display_name: "Santa Cruz de Tenerife, España", lat: "28.4636", lon: "-16.2518", source: 'local', country: "España", region: "Canarias", population: 207000 },
  { display_name: "Badalona, España", lat: "41.4500", lon: "2.2472", source: 'local', country: "España", region: "Cataluña", population: 216000 },
  { display_name: "Cartagena, España", lat: "37.6000", lon: "-0.9861", source: 'local', country: "España", region: "Región de Murcia", population: 218000 },
  { display_name: "Terrassa, España", lat: "41.5608", lon: "2.0110", source: 'local', country: "España", region: "Cataluña", population: 215000 },
  { display_name: "Jerez de la Frontera, España", lat: "36.6861", lon: "-6.1364", source: 'local', country: "España", region: "Andalucía", population: 213000 },
  { display_name: "Sabadell, España", lat: "41.5431", lon: "2.1089", source: 'local', country: "España", region: "Cataluña", population: 209000 },
  { display_name: "Móstoles, España", lat: "40.3231", lon: "-3.8644", source: 'local', country: "España", region: "Comunidad de Madrid", population: 206000 },
  { display_name: "Alcalá de Henares, España", lat: "40.4817", lon: "-3.3616", source: 'local', country: "España", region: "Comunidad de Madrid", population: 195000 },
  { display_name: "Pamplona, España", lat: "42.8169", lon: "-1.6432", source: 'local', country: "España", region: "Navarra", population: 197000 },
  { display_name: "Fuenlabrada, España", lat: "40.2842", lon: "-3.7938", source: 'local', country: "España", region: "Comunidad de Madrid", population: 194000 },
  
  // Regiones importantes
  { display_name: "Galicia, España", lat: "42.7593", lon: "-7.8666", source: 'local', country: "España", region: "Galicia" },
  { display_name: "Cataluña, España", lat: "41.8919", lon: "2.0000", source: 'local', country: "España", region: "Cataluña" },
  { display_name: "Andalucía, España", lat: "37.3891", lon: "-5.9845", source: 'local', country: "España", region: "Andalucía" },
  { display_name: "País Vasco, España", lat: "43.2627", lon: "-2.9253", source: 'local', country: "España", region: "País Vasco" },
  { display_name: "Castilla y León, España", lat: "41.6523", lon: "-4.7245", source: 'local', country: "España", region: "Castilla y León" },
  
  // Otras ciudades importantes del mundo
  { display_name: "París, Francia", lat: "48.8566", lon: "2.3522", source: 'local', country: "Francia", population: 2140000 },
  { display_name: "Londres, Reino Unido", lat: "51.5074", lon: "-0.1278", source: 'local', country: "Reino Unido", population: 8900000 },
  { display_name: "Roma, Italia", lat: "41.9028", lon: "12.4964", source: 'local', country: "Italia", population: 2870000 },
  { display_name: "Milán, Italia", lat: "45.4642", lon: "9.1900", source: 'local', country: "Italia", population: 1372000 },
  { display_name: "Nápoles, Italia", lat: "40.8522", lon: "14.2681", source: 'local', country: "Italia", population: 967000 },
  { display_name: "Turín, Italia", lat: "45.0703", lon: "7.6869", source: 'local', country: "Italia", population: 872000 },
  { display_name: "Florencia, Italia", lat: "43.7696", lon: "11.2558", source: 'local', country: "Italia", population: 383000 },
  { display_name: "Bolonia, Italia", lat: "44.4949", lon: "11.3426", source: 'local', country: "Italia", population: 388000 },
  { display_name: "Avellino, Italia", lat: "40.9146", lon: "14.7903", source: 'local', country: "Italia", region: "Campania", population: 56000 },
  { display_name: "Salerno, Italia", lat: "40.6824", lon: "14.7681", source: 'local', country: "Italia", region: "Campania", population: 133000 },
  { display_name: "Venezia, Italia", lat: "45.4408", lon: "12.3155", source: 'local', country: "Italia", population: 261000 },
  { display_name: "Berlín, Alemania", lat: "52.5200", lon: "13.4050", source: 'local', country: "Alemania", population: 3669000 },
  { display_name: "Ámsterdam, Países Bajos", lat: "52.3676", lon: "4.9041", source: 'local', country: "Países Bajos", population: 873000 },
  { display_name: "Lisboa, Portugal", lat: "38.7223", lon: "-9.1393", source: 'local', country: "Portugal", population: 545000 },
  { display_name: "Zurich, Suiza", lat: "47.3769", lon: "8.5417", source: 'local', country: "Suiza", population: 434000 },
  { display_name: "Viena, Austria", lat: "48.2082", lon: "16.3738", source: 'local', country: "Austria", population: 1897000 },
  
  // Latinoamérica
  { display_name: "Ciudad de México, México", lat: "19.4326", lon: "-99.1332", source: 'local', country: "México", population: 9200000 },
  { display_name: "Buenos Aires, Argentina", lat: "-34.6037", lon: "-58.3816", source: 'local', country: "Argentina", population: 3075000 },
  { display_name: "Bogotá, Colombia", lat: "4.7110", lon: "-74.0721", source: 'local', country: "Colombia", population: 7413000 },
  { display_name: "Lima, Perú", lat: "-12.0464", lon: "-77.0428", source: 'local', country: "Perú", population: 9752000 },
  { display_name: "Santiago, Chile", lat: "-33.4489", lon: "-70.6693", source: 'local', country: "Chile", population: 6158000 },
  { display_name: "Caracas, Venezuela", lat: "10.4806", lon: "-66.9036", source: 'local', country: "Venezuela", population: 2923000 },
];

// Cache para resultados
const searchCache = new Map<string, City[]>();
const maxCacheSize = 100;

const CityAutocomplete = ({ value, onChange, placeholder = "Ciudad, País", className }: CityAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<City[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [showLocationButton, setShowLocationButton] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent_city_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading recent searches:', e);
      }
    }
  }, []);

  // Manejar clicks fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Guardar búsqueda reciente
  const saveRecentSearch = useCallback((city: City) => {
    const updated = [city, ...recentSearches.filter(c => c.place_id !== city.place_id)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_city_searches', JSON.stringify(updated));
  }, [recentSearches]);

  // Limpiar cache si se llena demasiado
  const cleanCache = useCallback(() => {
    if (searchCache.size > maxCacheSize) {
      const keys = Array.from(searchCache.keys());
      keys.slice(0, 20).forEach(key => searchCache.delete(key));
    }
  }, []);

  // Detectar ubicación del usuario
  const detectUserLocation = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocalización no disponible');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        });
      });

      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lon: longitude });

      // Reverse geocoding para obtener la ciudad
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&zoom=10`,
        { signal: abortControllerRef.current?.signal }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.display_name) {
          const cityName = formatLocationName(data);
          onChange(cityName);
          setShowLocationButton(false);
        }
      }
    } catch (error) {
      console.error('Error detecting location:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onChange]);

  // Formatear nombre de ubicación
  const formatLocationName = (data: any): string => {
    const address = data.address || {};
    const city = address.city || address.town || address.village || address.municipality;
    const state = address.state || address.region;
    const country = address.country;

    if (city && country) {
      return state ? `${city}, ${state}, ${country}` : `${city}, ${country}`;
    }
    return data.display_name || '';
  };

  // Búsqueda en base de datos local mejorada
  const searchLocalCities = (query: string): City[] => {
    if (query.length < 1) return [];
    
    const lowerQuery = query.toLowerCase().trim();
    const words = lowerQuery.split(/\s+/).filter(word => word.length >= 2);
    
    return localCities
      .filter(city => {
        const cityName = city.display_name.toLowerCase();
        const cityOnly = cityName.split(',')[0].trim();
        const country = city.country.toLowerCase();
        const region = city.region?.toLowerCase() || '';
        
        // Búsqueda más flexible
        const queryMatches = (
          cityName.includes(lowerQuery) ||
          cityOnly.includes(lowerQuery) ||
          country.includes(lowerQuery) ||
          region.includes(lowerQuery) ||
          cityOnly.startsWith(lowerQuery) ||
          words.some(word => cityOnly.includes(word) || country.includes(word))
        );
        
        return queryMatches;
      })
      .map(city => ({
        ...city,
        place_id: `local_${city.display_name.replace(/[^a-zA-Z0-9]/g, '_')}`,
        score: calculateLocalScore(city, query)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Más resultados locales
  };

  // Calcular puntuación para ciudades locales
  const calculateLocalScore = (city: Omit<City, 'score' | 'place_id'>, query: string): number => {
    const lowerQuery = query.toLowerCase().trim();
    const cityName = city.display_name.toLowerCase();
    const cityOnly = cityName.split(',')[0].trim();
    let score = 0;

    // Coincidencia exacta con el nombre de la ciudad
    if (cityOnly === lowerQuery) score += 150;
    else if (cityOnly.startsWith(lowerQuery)) score += 120;
    else if (cityOnly.includes(lowerQuery)) score += 100;
    else if (cityName.includes(lowerQuery)) score += 80;

    // Bonificación por país
    if (city.country === 'España') score += 60;
    else if (['Francia', 'Italia', 'Portugal', 'Reino Unido'].includes(city.country)) score += 40;
    else if (['México', 'Argentina', 'Colombia', 'Chile'].includes(city.country)) score += 35;
    else score += 20;

    // Bonificación por población
    if (city.population) {
      if (city.population > 1000000) score += 30;
      else if (city.population > 500000) score += 25;
      else if (city.population > 200000) score += 20;
      else if (city.population > 100000) score += 15;
      else score += 10;
    }

    // Bonificación extra para ciudades principales españolas
    const mainSpanishCities = ['madrid', 'barcelona', 'valencia', 'sevilla', 'bilbao', 'málaga', 'zaragoza'];
    if (mainSpanishCities.includes(cityOnly)) score += 40;

    return score;
  };

  // Búsqueda usando proxy CORS para evitar bloqueos
  const searchWithProxy = async (query: string, signal: AbortSignal): Promise<City[]> => {
    try {
      // Usar allorigins.win como proxy CORS
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=4&accept-language=es,en`
      )}`;
      
      const response = await fetch(proxyUrl, { signal });
      
      if (!response.ok) return [];
      
      const proxyData = await response.json();
      const data = JSON.parse(proxyData.contents);
      
      return data
        .filter((item: any) => 
          item.type === 'city' || 
          item.type === 'town' || 
          item.type === 'municipality' ||
          item.class === 'place' ||
          item.type === 'administrative'
        )
        .map((item: any) => {
          const country = getCountryFromDisplayName(item.display_name);
          let score = calculateLocationScore(item, query, country);
          
          return {
            display_name: formatCityName(item.display_name),
            lat: item.lat,
            lon: item.lon,
            place_id: item.place_id,
            score,
            source: 'nominatim' as const,
            country,
            region: item.address?.state || item.address?.region
          };
        });
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      console.error('Proxy search error:', error);
      return [];
    }
  };

  // Calcular puntuación de relevancia
  const calculateLocationScore = (item: any, query: string, country: string): number => {
    let score = 0;
    const lowerQuery = query.toLowerCase();
    const name = (item.name || item.display_name || '').toLowerCase();
    
    // Puntuación por coincidencia exacta
    if (name === lowerQuery) score += 100;
    else if (name.startsWith(lowerQuery)) score += 80;
    else if (name.includes(lowerQuery)) score += 60;
    
    // Puntuación por país (priorizar España)
    if (country === 'España' || country === 'Spain') score += 50;
    else if (['Francia', 'Italy', 'Portugal', 'United Kingdom'].includes(country)) score += 30;
    else if (['México', 'Argentina', 'Colombia', 'Chile'].includes(country)) score += 25;
    else score += 10;
    
    // Puntuación por tipo de lugar
    if (item.type === 'city') score += 20;
    else if (item.type === 'town') score += 15;
    else if (item.type === 'municipality') score += 10;
    
    return score;
  };

  // Búsqueda principal con múltiples fuentes
  const searchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Verificar cache
    const cacheKey = query.toLowerCase().trim();
    if (searchCache.has(cacheKey)) {
      const cached = searchCache.get(cacheKey)!;
      setSuggestions(cached);
      setIsOpen(cached.length > 0);
      return;
    }

    setIsLoading(true);
    try {
      // 1. Buscar primero en base de datos local (más rápido y preciso)
      const localResults = searchLocalCities(query);
      
      // 2. Usar solo resultados locales (más rápido y sin problemas CORS)
      setSuggestions(localResults);
      setIsOpen(localResults.length > 0);
      setSelectedIndex(-1);
      
      // 3. Guardar en cache
      searchCache.set(cacheKey, localResults);
      cleanCache();

    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Search error:', error);
        // En caso de error, mostrar solo resultados locales
        const localResults = searchLocalCities(query);
        setSuggestions(localResults);
        setIsOpen(localResults.length > 0);
      }
    } finally {
      setIsLoading(false);
    }
  }, [cleanCache]);

  const getCountryFromDisplayName = (displayName: string) => {
    const parts = displayName.split(',');
    return parts[parts.length - 1]?.trim() || '';
  };

  const formatCityName = (displayName: string) => {
    const parts = displayName.split(',');
    if (parts.length >= 2) {
      const city = parts[0].trim();
      const country = parts[parts.length - 1].trim();
      const region = parts.length > 2 ? parts[1].trim() : null;
      
      if (region && !region.includes(country)) {
        return `${city}, ${region}, ${country}`;
      }
      return `${city}, ${country}`;
    }
    return displayName;
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCities(value);
    }, 150); // Más rápido para mejor responsividad

    return () => clearTimeout(timeoutId);
  }, [value, searchCities]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Abrir dropdown si hay texto suficiente o mostrar recientes si está vacío
    if (newValue.length >= 2) {
      setIsOpen(true);
    } else if (newValue.length === 0 && recentSearches.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    
    setSelectedIndex(-1);
  }, [onChange, recentSearches.length]);

  const handleSuggestionClick = useCallback((city: City) => {
    onChange(city.display_name);
    setIsOpen(false);
    setSelectedIndex(-1);
    saveRecentSearch(city);
    
    // Enfocar el input después de la selección
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [onChange, saveRecentSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleFocus = useCallback(() => {
    if (value.length >= 2 || (value.length === 0 && recentSearches.length > 0)) {
      setIsOpen(true);
    }
  }, [value.length, recentSearches.length]);

  const handleBlur = useCallback(() => {
    // No hacer nada aquí, el manejo de click fuera se encarga del cierre
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={className}
          autoComplete="off"
        />
        
        {/* Botón de geolocalización */}
        {showLocationButton && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={detectUserLocation}
            disabled={isLoading}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/20"
            title="Detectar mi ubicación"
          >
            <Navigation className="h-4 w-4 text-cosmic-magenta" />
          </Button>
        )}
        
        {/* Indicador de carga */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-cosmic-magenta border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Lista de sugerencias */}
      {isOpen && (
        <div 
          data-suggestion-container
          className="absolute z-50 w-full mt-1 bg-white/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl max-h-64 overflow-y-auto"
        >
          {/* Búsquedas recientes */}
          {value.length === 0 && recentSearches.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs text-gray-500 font-medium bg-gray-50/50 border-b border-gray-200/20">
                <Clock className="inline h-3 w-3 mr-1" />
                Búsquedas recientes
              </div>
              {recentSearches.map((city, index) => (
                <div
                  key={`recent_${city.place_id}`}
                  className="px-4 py-2 cursor-pointer transition-colors text-gray-700 hover:bg-cosmic-magenta/10 hover:text-cosmic-magenta flex items-center"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevenir blur del input
                    handleSuggestionClick(city);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSuggestionClick(city);
                  }}
                >
                  <Clock className="h-3 w-3 mr-2 text-gray-400" />
                  <span className="text-sm">{city.display_name}</span>
                </div>
              ))}
              {suggestions.length > 0 && <div className="border-t border-gray-200/20" />}
            </>
          )}

          {/* Resultados de búsqueda */}
          {suggestions.map((city, index) => (
            <div
              key={city.place_id}
              ref={el => suggestionRefs.current[index] = el}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === selectedIndex 
                  ? 'bg-cosmic-magenta/20 text-cosmic-magenta' 
                  : 'text-gray-800 hover:bg-white/30'
              }`}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevenir blur del input
                handleSuggestionClick(city);
              }}
              onClick={(e) => {
                e.preventDefault();
                handleSuggestionClick(city);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  {city.source === 'local' && city.country === 'España' && (
                    <Star className="h-3 w-3 ml-1 text-cosmic-gold" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{city.display_name}</div>
                  <div className="text-xs text-gray-500 flex items-center">
                    {city.source === 'local' && (
                      <span className="text-cosmic-gold font-medium">Recomendado</span>
                    )}
                    {city.population && (
                      <span className={city.source === 'local' ? 'ml-1' : ''}>
                        {city.source === 'local' ? '• ' : ''}{(city.population / 1000).toFixed(0)}k hab.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Mensaje cuando no hay resultados */}
          {value.length >= 2 && suggestions.length === 0 && !isLoading && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No se encontraron ciudades que coincidan con "{value}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CityAutocomplete; 