import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

const steps = [
  'Nombre',
  'Sexo',
  'Datos natales',
  'Fotos',
  'Preferencias'
];

const OnboardingPayment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    gender: '',
    birth_date: '',
    birth_time: '',
    birth_place: '',
    description: '',
    sign: '',
    moon_sign: '',
    rising_sign: '',
    photo_url: '',
    photo_url_2: '',
    photo_url_3: '',
    gender_preference: 'ambos',
  });
  const [photoFiles, setPhotoFiles] = useState<(File | null)[]>([null, null, null]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...photoFiles];
    files[idx] = e.target.files?.[0] || null;
    setPhotoFiles(files);
  };

  const uploadPhoto = async (file: File, idx: number) => {
    if (!user) return '';
    const ext = file.name.split('.').pop();
    const filePath = `pics/${user.id}_${idx}.${ext}`;
    const { error } = await supabase.storage.from('pics').upload(filePath, file, { upsert: true });
    if (error) {
      toast({ title: 'Error subiendo foto', description: error.message, variant: 'destructive' });
      return '';
    }
    const { data: urlData } = supabase.storage.from('pics').getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  const handleNext = async () => {
    if (step === steps.length - 1) {
      setLoading(true);
      let photoUrls = [form.photo_url, form.photo_url_2, form.photo_url_3];
      for (let i = 0; i < 3; i++) {
        if (photoFiles[i]) {
          const url = await uploadPhoto(photoFiles[i] as File, i + 1);
          photoUrls[i] = url;
        }
      }
      const profileData = {
        id: crypto.randomUUID(),
        name: form.full_name,
        age: form.birth_date ? new Date().getFullYear() - new Date(form.birth_date).getFullYear() : null,
        sign: form.sign,
        moon_sign: form.moon_sign,
        rising_sign: form.rising_sign,
        description: form.description,
        photo_url: photoUrls[0],
        photo_url_2: photoUrls[1],
        photo_url_3: photoUrls[2],
        // Puedes agregar otros campos opcionales aquí si tu tabla los permite
      };
      // Guardar perfil
      const { error: profileError } = await supabase.from('profiles').insert(profileData);
      // Marcar usuario como premium
      const { error: userError } = await supabase.from('users').update({ is_premium: true }).eq('id', user.id);
      setLoading(false);
      if (profileError || userError) {
        toast({ title: 'Error', description: (profileError?.message || userError?.message), variant: 'destructive' });
        return;
      }
      toast({ title: '¡Perfil completo!', description: 'Tu perfil premium ha sido creado.' });
      navigate('/home');
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cosmic-blue via-indigo-900 to-purple-900 p-4">
      <Card className="w-full max-w-lg bg-white/95 shadow-2xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-cosmic-magenta mb-2">Completa tu Perfil Premium</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 text-center text-cosmic-magenta font-semibold">Paso {step + 1} de {steps.length}: {steps[step]}</div>
          <form className="space-y-5" onSubmit={e => { e.preventDefault(); handleNext(); }}>
            {step === 0 && (
              <Input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Nombre completo"
                required
                className="bg-white/90 border border-cosmic-magenta text-gray-900 placeholder-gray-400 rounded-lg px-4 py-3 text-base"
              />
            )}
            {step === 1 && (
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-cosmic-magenta p-3 text-gray-900 bg-white/90"
              >
                <option value="">Selecciona tu género</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
                <option value="otro">Otro</option>
              </select>
            )}
            {step === 2 && (
              <div className="space-y-3">
                <Input
                  name="birth_date"
                  type="date"
                  value={form.birth_date}
                  onChange={handleChange}
                  placeholder="Fecha de nacimiento"
                  required
                  className="bg-white/90 border border-cosmic-magenta text-gray-900 rounded-lg px-4 py-3 text-base"
                />
                <Input
                  name="birth_time"
                  type="time"
                  value={form.birth_time}
                  onChange={handleChange}
                  placeholder="Hora de nacimiento"
                  required
                  className="bg-white/90 border border-cosmic-magenta text-gray-900 rounded-lg px-4 py-3 text-base"
                />
                <Input
                  name="birth_place"
                  value={form.birth_place}
                  onChange={handleChange}
                  placeholder="Lugar de nacimiento"
                  required
                  className="bg-white/90 border border-cosmic-magenta text-gray-900 rounded-lg px-4 py-3 text-base"
                />
              </div>
            )}
            {step === 3 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-cosmic-magenta">Foto principal (avatar)</label>
                <Input type="file" accept="image/*" onChange={e => handlePhotoChange(0, e)} className="bg-white/90 border border-cosmic-magenta rounded-lg" />
                {form.photo_url && <img src={form.photo_url} alt="avatar" className="w-20 h-20 rounded-full mt-2 border-2 border-cosmic-magenta" />}
                <label className="block text-sm font-medium text-cosmic-magenta">Foto adicional 2</label>
                <Input type="file" accept="image/*" onChange={e => handlePhotoChange(1, e)} className="bg-white/90 border border-cosmic-magenta rounded-lg" />
                {form.photo_url_2 && <img src={form.photo_url_2} alt="foto2" className="w-20 h-20 rounded mt-2 border-2 border-cosmic-magenta" />}
                <label className="block text-sm font-medium text-cosmic-magenta">Foto adicional 3</label>
                <Input type="file" accept="image/*" onChange={e => handlePhotoChange(2, e)} className="bg-white/90 border border-cosmic-magenta rounded-lg" />
                {form.photo_url_3 && <img src={form.photo_url_3} alt="foto3" className="w-20 h-20 rounded mt-2 border-2 border-cosmic-magenta" />}
              </div>
            )}
            {step === 4 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-cosmic-magenta">¿A quién quieres ver?</label>
                <select
                  name="gender_preference"
                  value={form.gender_preference}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-cosmic-magenta p-3 text-gray-900 bg-white/90"
                >
                  <option value="mujer">Solo mujeres</option>
                  <option value="hombre">Solo hombres</option>
                  <option value="ambos">Ambos</option>
                </select>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Descripción personal"
                  rows={3}
                  required
                  className="bg-white/90 border border-cosmic-magenta text-gray-900 placeholder-gray-400 rounded-lg px-4 py-3 text-base mt-2"
                />
              </div>
            )}
            <div className="flex gap-2 pt-2">
              {step > 0 && (
                <Button type="button" variant="outline" onClick={handleBack} className="w-1/2">Atrás</Button>
              )}
              <Button type="submit" className="w-1/2 bg-cosmic-magenta hover:bg-cosmic-magenta/90 text-white font-semibold text-lg py-3 rounded-lg shadow-lg" disabled={loading}>
                {loading ? 'Guardando...' : step === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <button
        onClick={() => { console.log('Click fuera del Card'); navigate('/home'); }}
        style={{ position: 'fixed', bottom: 40, left: 40, background: 'green', color: 'white', fontSize: 24, zIndex: 9999 }}
      >
        Botón de prueba
      </button>
    </div>
  );
};

export default OnboardingPayment; 