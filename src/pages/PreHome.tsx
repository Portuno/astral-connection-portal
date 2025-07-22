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
    birthDate: '',
    birthTime: '',
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
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10"
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
            type="date"
            value={form.birthDate}
            onChange={handleChange}
            required
            className="flex-1 rounded-lg p-3 border border-cosmic-magenta bg-white/80 text-gray-900 text-lg"
          />
          <input
            name="birthTime"
            type="time"
            value={form.birthTime}
            onChange={handleChange}
            required
            className="flex-1 rounded-lg p-3 border border-cosmic-magenta bg-white/80 text-gray-900 text-lg"
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