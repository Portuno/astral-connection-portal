import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cities = [
  { name: 'Madrid, España' },
  { name: 'Barcelona, España' },
  { name: 'Valencia, España' },
  { name: 'Sevilla, España' },
  { name: 'Zaragoza, España' },
  { name: 'Málaga, España' },
  { name: 'Murcia, España' },
  { name: 'Palma, España' },
  { name: 'Bilbao, España' },
  { name: 'Alicante, España' },
  { name: 'Buenos Aires, Argentina' },
  { name: 'Córdoba, Argentina' },
  { name: 'Rosario, Argentina' },
  { name: 'Bogotá, Colombia' },
  { name: 'Medellín, Colombia' },
  { name: 'Cali, Colombia' },
  { name: 'París, Francia' },
  { name: 'Roma, Italia' },
  { name: 'Lisboa, Portugal' },
  { name: 'Londres, Reino Unido' },
  { name: 'Berlín, Alemania' },
  { name: 'Montevideo, Uruguay' },
  { name: 'Santiago, Chile' },
  { name: 'Ciudad de México, México' },
  { name: 'Guadalajara, México' },
  { name: 'Lima, Perú' },
  { name: 'Quito, Ecuador' },
  { name: 'Caracas, Venezuela' },
  { name: 'La Paz, Bolivia' },
  { name: 'San Juan, Puerto Rico' },
  // ...agrega más si quieres
];

export default function PreHome() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    birthDate: '', // formato DD/MM/AAAA
    birthTime: '', // formato HH:MM
    birthCity: ''
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'birthCity') {
      const value = e.target.value.toLowerCase();
      if (value.length >= 2) {
        setSuggestions(
          cities
            .filter(city => city.name.toLowerCase().includes(value))
            .map(city => city.name)
            .slice(0, 8)
        );
      } else {
        setSuggestions([]);
      }
    }
  };

  const handleDateInput = (e) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value.length > 2) value = value.slice(0,2) + '/' + value.slice(2);
    if (value.length > 5) value = value.slice(0,5) + '/' + value.slice(5,9);
    if (value.length > 10) value = value.slice(0,10);
    setForm({ ...form, birthDate: value });
  };
  const handleTimeInput = (e) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value.length > 2) value = value.slice(0,2) + ':' + value.slice(2,4);
    if (value.length > 5) value = value.slice(0,5);
    setForm({ ...form, birthTime: value });
  };

  const handleSelectCity = (city: string) => {
    setForm({ ...form, birthCity: city });
    setSuggestions([]);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!cities.some(city => city.name === form.birthCity)) {
      alert('Por favor selecciona una ciudad de la lista.');
      return;
    }
    localStorage.setItem('prehomeData', JSON.stringify(form));
    navigate('/preloading');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cosmic-blue via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Fondo artístico etéreo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none select-none"
      >
        {/* Degradado pastel y vórtice */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-blue-200 to-yellow-100 opacity-60" style={{ filter: 'blur(8px)' }} />
        {/* Galaxia/vórtice */}
        <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" width="600" height="600" viewBox="0 0 600 600" fill="none">
          <defs>
            <radialGradient id="galaxy" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#fffbe6" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#e0c3fc" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#a1c4fd" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="300" cy="300" rx="260" ry="120" fill="url(#galaxy)" />
        </svg>
        {/* Estrellas y constelaciones */}
        <svg className="absolute left-0 top-0 w-full h-full" width="100%" height="100%" viewBox="0 0 800 600" fill="none">
          {/* Estrellas */}
          <circle cx="100" cy="120" r="2" fill="#fff8dc" />
          <circle cx="200" cy="80" r="1.5" fill="#ffe4e1" />
          <circle cx="700" cy="100" r="2.5" fill="#fffbe6" />
          <circle cx="600" cy="500" r="1.7" fill="#fffbe6" />
          <circle cx="400" cy="550" r="1.2" fill="#fffbe6" />
          <circle cx="300" cy="400" r="1.8" fill="#fffbe6" />
          {/* Constelación simple */}
          <polyline points="100,120 200,80 300,400 400,550" stroke="#ffe4e1" strokeWidth="0.7" opacity="0.5" />
        </svg>
        {/* Fases lunares */}
        <svg className="absolute right-12 top-24" width="60" height="60" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="20" fill="#fffbe6" opacity="0.7" />
          <path d="M30 10 A20 20 0 1 0 50 30" fill="#e0c3fc" />
        </svg>
        <svg className="absolute left-16 bottom-20" width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="14" fill="#fffbe6" opacity="0.5" />
          <path d="M20 6 A14 14 0 1 1 34 20" fill="#b4aee8" />
        </svg>
        {/* Símbolos zodiacales artísticos (curvas y puntos) */}
        <svg className="absolute left-1/4 top-1/3" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M4 28 Q16 4 28 28" stroke="#ffd700" strokeWidth="2" fill="none" opacity="0.7" />
          <circle cx="16" cy="16" r="2" fill="#ffd700" />
        </svg>
        <svg className="absolute right-1/4 bottom-1/4" width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M4 24 Q14 4 24 24" stroke="#b4aee8" strokeWidth="1.5" fill="none" opacity="0.7" />
          <circle cx="14" cy="14" r="1.5" fill="#b4aee8" />
        </svg>
        {/* Siluetas de dos cabezas mirándose */}
        <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10" width="220" height="120" viewBox="0 0 220 120" fill="none">
          <path d="M60 100 Q40 60 60 40 Q80 20 110 40 Q140 20 160 40 Q180 60 160 100" stroke="#ffd700" strokeWidth="3" fill="none" filter="url(#glow)" />
          <path d="M80 80 Q90 60 110 80 Q130 60 140 80" stroke="#ffd700" strokeWidth="2" fill="none" opacity="0.7" />
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
      {/* Fin fondo artístico */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10 relative z-20"
      >
        <h2 className="text-3xl font-bold text-cosmic-gold mb-2 text-center">Tus datos cósmicos</h2>
        <p className="text-white text-center mb-6">Completa estos datos para calcular tu carta natal y encontrar tu conexión perfecta</p>
        <div className="mb-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre completo"
            required
            className="w-full rounded-lg p-3 mb-2 border border-cosmic-magenta bg-white/80 text-gray-900 text-lg"
          />
        </div>
        <div className="mb-4 flex gap-2">
          <input
            name="birthDate"
            type="text"
            value={form.birthDate}
            onChange={handleDateInput}
            placeholder="DD/MM/AAAA"
            inputMode="numeric"
            pattern="\d{2}/\d{2}/\d{4}"
            maxLength={10}
            className="flex-1 rounded-lg p-3 border border-cosmic-magenta bg-white/80 text-gray-900 text-lg"
            aria-label="Fecha de nacimiento"
            required
          />
        </div>
        <div className="mb-4 flex gap-2 items-center">
          <input
            name="birthTime"
            type="text"
            value={form.birthTime}
            onChange={handleTimeInput}
            placeholder="HH:MM"
            inputMode="numeric"
            pattern="\d{2}:\d{2}"
            maxLength={5}
            className="flex-1 rounded-lg p-3 border border-cosmic-magenta bg-white/80 text-gray-900 text-lg"
            aria-label="Hora de nacimiento"
            required
          />
        </div>
        <div className="mb-6 relative">
          <input
            name="birthCity"
            value={form.birthCity}
            onChange={handleChange}
            placeholder="Ciudad de nacimiento"
            required
            autoComplete="off"
            className="w-full rounded-lg p-3 border border-cosmic-magenta bg-white/80 text-gray-900 text-lg"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-cosmic-magenta rounded-lg mt-1 max-h-40 overflow-y-auto">
              {suggestions.map((city, idx) => (
                <li
                  key={idx}
                  className="p-2 hover:bg-cosmic-magenta hover:text-white cursor-pointer"
                  onClick={() => handleSelectCity(city)}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cosmic-magenta to-purple-600 hover:from-cosmic-magenta/90 hover:to-purple-600/90 text-white font-semibold text-lg py-3 rounded-lg shadow-lg transition-all duration-300"
        >
          Ver compatibilidades
        </button>
      </form>
    </div>
  );
} 