import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PreHome() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthCity: ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    // Opcional: guardar en localStorage
    localStorage.setItem('prehomeData', JSON.stringify(form));
    navigate('/preloading');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 bg-white/10 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Tus datos cósmicos</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre completo" required className="mb-2 w-full rounded p-2" />
      <input name="birthDate" type="date" value={form.birthDate} onChange={handleChange} required className="mb-2 w-full rounded p-2" />
      <input name="birthTime" type="time" value={form.birthTime} onChange={handleChange} required className="mb-2 w-full rounded p-2" />
      <input name="birthCity" value={form.birthCity} onChange={handleChange} placeholder="Ciudad de nacimiento" required className="mb-2 w-full rounded p-2" />
      <button type="submit" className="bg-cosmic-magenta text-white px-4 py-2 rounded mt-2 w-full">Ver compatibilidades</button>
    </form>
  );
} 