import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFacebookPixel } from '@/hooks/useFacebookPixel';

const cities = [
  'Madrid, España', 'Barcelona, España', 'Valencia, España', 'Sevilla, España', 'Zaragoza, España', 'Málaga, España', 'Murcia, España', 'Palma, España', 'Bilbao, España', 'Alicante, España',
  'Buenos Aires, Argentina', 'Córdoba, Argentina', 'Rosario, Argentina', 'Bogotá, Colombia', 'Medellín, Colombia', 'Cali, Colombia', 'París, Francia', 'Roma, Italia', 'Lisboa, Portugal',
  'Londres, Reino Unido', 'Berlín, Alemania', 'Montevideo, Uruguay', 'Santiago, Chile', 'Ciudad de México, México', 'Guadalajara, México', 'Lima, Perú', 'Quito, Ecuador', 'Caracas, Venezuela', 'La Paz, Bolivia', 'San Juan, Puerto Rico'
];

export default function PreHome() {
  const navigate = useNavigate();
  const { trackFindLocation } = useFacebookPixel();
  const [form, setForm] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthCity: ''
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'birthCity') {
      const value = e.target.value.toLowerCase();
      if (value.length >= 2) {
        setSuggestions(
          cities
            .filter(city => city.toLowerCase().includes(value))
            .sort((a, b) => {
              const esA = a.includes('España') || a.includes('Argentina') || a.includes('Colombia') || a.includes('México') || a.includes('Perú') || a.includes('Chile') || a.includes('Uruguay') || a.includes('Venezuela') || a.includes('Bolivia') || a.includes('Puerto Rico');
              const esB = b.includes('España') || b.includes('Argentina') || b.includes('Colombia') || b.includes('México') || b.includes('Perú') || b.includes('Chile') || b.includes('Uruguay') || b.includes('Venezuela') || b.includes('Bolivia') || b.includes('Puerto Rico');
              return esA === esB ? 0 : esA ? -1 : 1;
            })
            .slice(0, 8)
        );
      } else {
        setSuggestions([]);
      }
    }
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value.length > 2) value = value.slice(0,2) + '/' + value.slice(2);
    if (value.length > 5) value = value.slice(0,5) + '/' + value.slice(5,9);
    if (value.length > 10) value = value.slice(0,10);
    setForm({ ...form, birthDate: value });
  };

  const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value.length > 2) value = value.slice(0,2) + ':' + value.slice(2,4);
    if (value.length > 5) value = value.slice(0,5);
    setForm({ ...form, birthTime: value });
  };

  const handleSelectCity = (city: string) => {
    setForm({ ...form, birthCity: city });
    setSuggestions([]);
    // Track Facebook Pixel event when user selects a location
    trackFindLocation();
  };

  const handleSuggestCities = () => {
    const value = form.birthCity.toLowerCase();
    if (value.length >= 2) {
      setSuggestions(
        cities
          .filter(city => city.toLowerCase().includes(value))
          .sort((a, b) => {
            const esA = a.includes('España') || a.includes('Argentina') || a.includes('Colombia') || a.includes('México') || a.includes('Perú') || a.includes('Chile') || a.includes('Uruguay') || a.includes('Venezuela') || a.includes('Bolivia') || a.includes('Puerto Rico');
            const esB = b.includes('España') || b.includes('Argentina') || b.includes('Colombia') || b.includes('México') || b.includes('Perú') || b.includes('Chile') || b.includes('Uruguay') || b.includes('Venezuela') || b.includes('Bolivia') || b.includes('Puerto Rico');
            return esA === esB ? 0 : esA ? -1 : 1;
          })
          .slice(0, 8)
      );
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(true);
    }
  };

  const handleGoogleMaps = () => {
    if (form.birthCity.trim().length === 0) return;
    const query = encodeURIComponent(form.birthCity);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validación de hora y minutos
    const [hh, mm] = form.birthTime.split(':');
    const hour = parseInt(hh, 10);
    const minute = parseInt(mm, 10);
    if (
      isNaN(hour) || isNaN(minute) ||
      hour < 0 || hour > 24 ||
      minute < 0 || minute > 59
    ) {
      alert('Por favor ingresa una hora válida (HH:MM, 00-24 y 00-59)');
      return;
    }
    // Validación de fecha simple
    const [d, m, y] = form.birthDate.split('/');
    if (!d || !m || !y || d.length !== 2 || m.length !== 2 || y.length !== 4) {
      alert('Por favor ingresa una fecha válida (DD/MM/AAAA)');
      return;
    }
    // Navegar a Loading
    navigate('/loading');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1440] via-[#2a0a3c] to-[#0a1033] relative overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10 relative z-20"
      >
        <h2 className="text-3xl font-bold text-cosmic-gold mb-2 text-center">Tus datos cósmicos</h2>
        <p className="text-white text-center mb-6">Completa estos datos para calcular tu carta natal y encontrar tu conexión perfecta</p>
        <div className="mb-4">
          <label htmlFor="name" className="block text-white mb-1">Nombre completo</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre completo"
            required
            className="w-full rounded-lg p-3 mb-2 border border-cosmic-magenta bg-white/80 text-gray-900 text-lg"
          />
        </div>
        <div className="mb-4 flex gap-2 flex-col">
          <label htmlFor="birthDate" className="block text-white mb-1">Fecha de nacimiento</label>
          <input
            id="birthDate"
            name="birthDate"
            type="text"
            value={form.birthDate}
            onChange={handleDateInput}
            placeholder="DD/MM/AAAA"
            inputMode="numeric"
            pattern="\d{2}/\d{2}/\d{4}"
            maxLength={10}
            className="rounded-lg p-3 border border-cosmic-magenta bg-white/80 text-gray-900 text-lg"
            aria-label="Fecha de nacimiento"
            required
          />
        </div>
        <div className="mb-4 flex gap-2 flex-col">
          <label htmlFor="birthTime" className="block text-white mb-1">Hora de nacimiento</label>
          <input
            id="birthTime"
            name="birthTime"
            type="text"
            value={form.birthTime}
            onChange={handleTimeInput}
            placeholder="Hora de nacimiento"
            inputMode="numeric"
            pattern="\d{2}:\d{2}"
            maxLength={5}
            className="rounded-lg p-3 border border-cosmic-magenta bg-white/80 text-gray-900 text-lg"
            aria-label="Hora de nacimiento"
            required
          />
        </div>
        <div className="mb-6 relative">
          <label htmlFor="birthCity" className="block text-white mb-1">Lugar de nacimiento</label>
          <input
            id="birthCity"
            name="birthCity"
            value={form.birthCity}
            onChange={handleChange}
            placeholder="Lugar de nacimiento (puedes escribir cualquier cosa)"
            required
            autoComplete="off"
            className="w-full rounded-lg p-3 border border-cosmic-magenta bg-white/80 text-gray-900 placeholder-gray-400 text-lg"
            aria-label="Lugar de nacimiento"
            tabIndex={0}
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-cosmic-magenta rounded-lg mt-1 max-h-40 overflow-y-auto">
              {suggestions.map((city, idx) => (
                <li
                  key={idx}
                  className="p-2 hover:bg-cosmic-magenta hover:text-white cursor-pointer"
                  onClick={() => { handleSelectCity(city); }}
                  tabIndex={0}
                  aria-label={`Sugerencia: ${city}`}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { handleSelectCity(city); } }}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cosmic-magenta to-purple-600 hover:from-cosmic-magenta/90 hover:to-purple-600/90 text-white font-semibold text-lg py-3 rounded-full shadow-lg transition-all duration-300"
        >
          Ver compatibilidades
        </button>
      </form>
    </div>
  );
} 