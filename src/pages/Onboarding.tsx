
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";

const steps = [
  "Fotos",
  "Datos personales",
  "Signos",
  "Descripción",
  "Username"
];

export default function Onboarding({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const { trackPersonalizeProduct } = useFacebookPixel();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    photo_url: "",
    photo_url_2: "",
    photo_url_3: "",
    name: "",
    age: "",
    birth_day: "",
    birth_month: "",
    birth_year: "",
    birth_hour: "",
    birth_minute: "",
    sign: "",
    moon_sign: "",
    rising_sign: "",
    description: "",
    username: ""
  });
  const [photoFiles, setPhotoFiles] = useState<(File | null)[]>([null, null, null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0] || null;
    setPhotoFiles((prev) => {
      const updated = [...prev];
      updated[idx] = file;
      return updated;
    });
  };

  const uploadPhoto = async (file: File, idx: number) => {
    if (!userId) return '';
    const ext = file.name.split('.').pop();
    const filePath = `${userId}_${idx}.${ext}`;
    const { error } = await supabase.storage.from('pics').upload(filePath, file, { upsert: true });
    if (error) {
      setError('Error subiendo foto: ' + error.message);
      return '';
    }
    const { data: urlData } = supabase.storage.from('pics').getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  const validateStep = () => {
    if (step === 0 && !form.photo_url && !photoFiles[0]) return "Sube al menos una foto";
    if (step === 1) {
      if (!form.name) return "Completa tu nombre";
      if (!form.birth_day || !form.birth_month || !form.birth_year) return "Completa tu fecha de nacimiento";
      if (!form.birth_hour || !form.birth_minute) return "Completa tu hora de nacimiento";
    }
    if (step === 2 && (!form.sign || !form.moon_sign || !form.rising_sign)) return "Completa tus signos";
    if (step === 3 && !form.description) return "Agrega una descripción";
    if (step === 4 && !form.username) return "Elige un username";
    return null;
  };

  const checkUsernameUnique = async () => {
    // Use fetch instead of select to avoid deep type instantiation
    const { data } = await (supabase as any)
      .from("profiles")
      .fetch("id", {
        filter: [
          ["username", "eq", form.username],
          ["user_id", "neq", userId]
        ]
      });
    return !data?.length;
  };

  const handleNext = async () => {
    setError(null);
    const err = validateStep();
    if (err) return setError(err);

    if (step === 4) {
      setLoading(true);
      if (!(await checkUsernameUnique())) {
        setError("Ese username ya está en uso");
        setLoading(false);
        return;
      }
      // Subir fotos si hay archivos nuevos
      let photoUrls = [form.photo_url, form.photo_url_2, form.photo_url_3];
      for (let i = 0; i < 3; i++) {
        if (photoFiles[i]) {
          const url = await uploadPhoto(photoFiles[i] as File, i + 1);
          photoUrls[i] = url;
        }
      }
      // Guardar perfil
      const { error } = await (supabase as any).from("profiles").update({
        name: form.name,
        age: form.age ? Number(form.age) : undefined,
        birth_day: form.birth_day,
        birth_month: form.birth_month,
        birth_year: form.birth_year,
        birth_hour: form.birth_hour,
        birth_minute: form.birth_minute,
        sign: form.sign,
        moon_sign: form.moon_sign,
        rising_sign: form.rising_sign,
        description: form.description,
        photo_url: photoUrls[0],
        // Add other allowed fields as needed
      }).eq("user_id", userId);
      setLoading(false);
      if (error) return setError("Error guardando perfil: " + error.message);
      
      // Track Facebook Pixel event for profile personalization completion
      trackPersonalizeProduct();
      
      navigate("/home");
      return;
    }
    setStep(step + 1);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white/10 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Onboarding: {steps[step]}</h2>
      {error && <div className="mb-2 text-red-400">{error}</div>}

      {step === 0 && (
        <div>
          <label className="block text-white mb-2">Foto principal</label>
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, 0)} className="mb-2 w-full" />
          <label className="block text-white mb-2">Foto 2 (opcional)</label>
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, 1)} className="mb-2 w-full" />
          <label className="block text-white mb-2">Foto 3 (opcional)</label>
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, 2)} className="mb-2 w-full" />
        </div>
      )}

      {step === 1 && (
        <div>
          <label className="block text-white mb-2">Nombre</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="mb-2 w-full" />
          <label className="block text-white mb-2">Fecha de nacimiento</label>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              name="birth_day"
              value={form.birth_day}
              onChange={handleChange}
              placeholder="Día"
              min={1}
              max={31}
              className="w-1/3 px-2 py-2 rounded bg-white/20 text-white placeholder-gray-300 focus:border-cosmic-magenta"
              inputMode="numeric"
              aria-label="Día de nacimiento"
            />
            <input
              type="number"
              name="birth_month"
              value={form.birth_month}
              onChange={handleChange}
              placeholder="Mes"
              min={1}
              max={12}
              className="w-1/3 px-2 py-2 rounded bg-white/20 text-white placeholder-gray-300 focus:border-cosmic-magenta"
              inputMode="numeric"
              aria-label="Mes de nacimiento"
            />
            <input
              type="number"
              name="birth_year"
              value={form.birth_year}
              onChange={handleChange}
              placeholder="Año"
              min={1900}
              max={2024}
              className="w-1/3 px-2 py-2 rounded bg-white/20 text-white placeholder-gray-300 focus:border-cosmic-magenta"
              inputMode="numeric"
              aria-label="Año de nacimiento"
            />
          </div>
          <label className="block text-white mb-2">Hora de nacimiento</label>
          <div className="flex gap-2 items-center mb-2">
            <input
              type="number"
              name="birth_hour"
              value={form.birth_hour}
              onChange={handleChange}
              placeholder="HH"
              min={0}
              max={23}
              className="w-1/4 px-2 py-2 rounded bg-white/20 text-white placeholder-gray-300 focus:border-cosmic-magenta"
              inputMode="numeric"
              aria-label="Hora de nacimiento"
            />
            <span className="text-white">:</span>
            <input
              type="number"
              name="birth_minute"
              value={form.birth_minute}
              onChange={handleChange}
              placeholder="MM"
              min={0}
              max={59}
              className="w-1/4 px-2 py-2 rounded bg-white/20 text-white placeholder-gray-300 focus:border-cosmic-magenta"
              inputMode="numeric"
              aria-label="Minutos de nacimiento"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="block text-white mb-2">Signo solar</label>
          <input type="text" name="sign" value={form.sign} onChange={handleChange} className="mb-2 w-full" />
          <label className="block text-white mb-2">Signo lunar</label>
          <input type="text" name="moon_sign" value={form.moon_sign} onChange={handleChange} className="mb-2 w-full" />
          <label className="block text-white mb-2">Ascendente</label>
          <input type="text" name="rising_sign" value={form.rising_sign} onChange={handleChange} className="mb-2 w-full" />
        </div>
      )}

      {step === 3 && (
        <div>
          <label className="block text-white mb-2">Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="mb-2 w-full" />
        </div>
      )}

      {step === 4 && (
        <div>
          <label className="block text-white mb-2">Username</label>
          <input type="text" name="username" value={form.username} onChange={handleChange} className="mb-2 w-full" />
        </div>
      )}

      <div className="flex justify-between mt-4">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
            type="button"
          >
            Anterior
          </button>
        )}
        <button
          onClick={handleNext}
          className="bg-cosmic-magenta text-white px-4 py-2 rounded"
          disabled={loading}
          type="button"
        >
          {step === steps.length - 1 ? "Finalizar" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
