import { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFacebookPixel } from '@/hooks/useFacebookPixel';

const GENDER_OPTIONS = [
  { value: '', label: 'Selecciona tu género' },
  { value: 'hombre', label: 'Masculino' },
  { value: 'mujer', label: 'Femenino' },
  { value: 'no-binario', label: 'No binario' },
  { value: 'otro', label: 'Otro' },
];

const ProfileEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackSubmitApplication } = useFacebookPixel();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<{
    id: string;
    name: string;
    age?: number | string;
    sign?: string;
    moon_sign?: string;
    rising_sign?: string;
    description: string;
    photo_url: string;
    photo_url_2?: string;
    photo_url_3?: string;
    photo_url_4?: string;
    photo_url_5?: string;
    gender?: string;
    gender_preference?: string;
    compatibility_score?: number;
    created_at: string;
  } | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    photo_url: '',
    photo_url_2: '',
    photo_url_3: '',
    photo_url_4: '',
    photo_url_5: '',
    age: '',
    sign: '',
    moon_sign: '',
    rising_sign: '',
    gender: '',
  });
  const [photoFiles, setPhotoFiles] = useState<(File | null)[]>([null, null, null, null, null]);
  const [photoPreviews, setPhotoPreviews] = useState<(string | null)[]>([null, null, null, null, null]);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setProfile(data);
        setForm({
          name: data.name || '',
          description: data.description || '',
          photo_url: data.photo_url || '',
          photo_url_2: data.photo_url_2 || '',
          photo_url_3: data.photo_url_3 || '',
          photo_url_4: data.photo_url_4 || '',
          photo_url_5: data.photo_url_5 || '',
          age: data.age ? String(data.age) : '',
          sign: data.sign || '',
          moon_sign: data.moon_sign || '',
          rising_sign: data.rising_sign || '',
          gender: data.gender || '',
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    const files = [...photoFiles];
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Archivo inválido', description: 'Solo puedes subir imágenes.', variant: 'destructive' });
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        toast({ title: 'Archivo demasiado grande', description: 'La imagen debe pesar menos de 8MB.', variant: 'destructive' });
        return;
      }
    }
    files[idx] = file;
    setPhotoFiles(files);
    // Previsualización
    const previews = [...photoPreviews];
    previews[idx] = file ? URL.createObjectURL(file) : null;
    setPhotoPreviews(previews);
  };

  const uploadPhoto = async (file: File, idx: number) => {
    if (!user) return '';
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}_${idx}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('pics').upload(filePath, file, { upsert: true });
    if (error) {
      toast({ title: 'Error subiendo foto', description: error.message, variant: 'destructive' });
      return '';
    }
    const { data: urlData } = supabase.storage.from('pics').getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  const validateForm = () => {
    if (!form.name) return 'El nombre es obligatorio';
    if (!form.description) return 'La descripción es obligatoria';
    if (!form.photo_url && !photoFiles[0]) return 'La foto principal es obligatoria';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      toast({ title: 'Error', description: err, variant: 'destructive' });
      return;
    }
    setLoading(true);
    let photoUrls = [form.photo_url, form.photo_url_2, form.photo_url_3, form.photo_url_4, form.photo_url_5];
    for (let i = 0; i < 5; i++) {
      if (photoFiles[i]) {
        const url = await uploadPhoto(photoFiles[i] as File, i + 1);
        if (!url) {
          setLoading(false);
          return;
        }
        photoUrls[i] = url;
      }
    }
    // Sincronizar avatar principal en users si cambió
    if (photoFiles[0] && user) {
      await supabase.from('users').update({ avatar_url: photoUrls[0] }).eq('id', user.id);
    }
    const updateData = {
      name: form.name,
      description: form.description,
      photo_url: photoUrls[0],
      photo_url_2: photoUrls[1],
      photo_url_3: photoUrls[2],
      photo_url_4: photoUrls[3],
      photo_url_5: photoUrls[4],
      age: form.age ? Number(form.age) : undefined,
      sign: form.sign,
      moon_sign: form.moon_sign,
      rising_sign: form.rising_sign,
      gender: form.gender,
    };
    let result;
    if (profile) {
      result = await (supabase.from('profiles').update(updateData).eq('user_id', user.id) as any);
    } else {
      result = await (supabase.from('profiles').insert({ ...updateData, id: crypto.randomUUID(), user_id: user.id }) as any);
    }
    if (result.error) {
      toast({ title: 'Error', description: result.error.message, variant: 'destructive' });
    } else {
      // Track Facebook Pixel event for profile submission
      trackSubmitApplication();
      toast({ title: 'Perfil actualizado', description: 'Tus cambios han sido guardados.' });
      navigate('/home');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Fondo mágico/esotérico */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1a1440] via-[#2a0a3c] to-[#a78bfa]">
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="120" fill="#fff" fillOpacity="0.08" />
          <circle cx="1200" cy="700" r="180" fill="#fff" fillOpacity="0.06" />
          <g opacity="0.18">
            <path d="M720 100 l30 60 60 10-50 40 15 65-55-35-55 35 15-65-50-40 60-10z" fill="#fff" />
            <circle cx="400" cy="600" r="60" fill="#fff" fillOpacity="0.12" />
            <circle cx="1000" cy="300" r="40" fill="#fff" fillOpacity="0.10" />
            <text x="1100" y="200" fontSize="48" fill="#fff" fillOpacity="0.12">♓</text>
            <text x="300" y="800" fontSize="64" fill="#fff" fillOpacity="0.10">★</text>
            <text x="800" y="850" fontSize="40" fill="#fff" fillOpacity="0.10">☉</text>
            <text x="200" y="400" fontSize="32" fill="#fff" fillOpacity="0.10">☾</text>
          </g>
        </svg>
      </div>
      <Card className="w-full max-w-2xl bg-white/80 shadow-2xl border-0 rounded-3xl backdrop-blur-xl p-2 md:p-8">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-cosmic-magenta mb-2 text-center drop-shadow">Editar Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-base font-semibold text-cosmic-magenta">Nombre</label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  required
                  className="bg-white/90 border border-cosmic-magenta text-gray-900 placeholder-gray-400 focus:ring-cosmic-magenta focus:border-cosmic-magenta rounded-lg px-4 py-3 text-base"
                  aria-label="Nombre completo"
                  tabIndex={0}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-base font-semibold text-cosmic-magenta">Género</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="bg-white/90 border border-cosmic-magenta text-gray-900 rounded-lg px-4 py-3 text-base focus:ring-cosmic-magenta focus:border-cosmic-magenta"
                  aria-label="Género"
                  tabIndex={0}
                  required
                >
                  {GENDER_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-base font-semibold text-cosmic-magenta">Descripción</label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descripción personal"
                rows={3}
                required
                className="bg-white/90 border border-cosmic-magenta text-gray-900 placeholder-gray-400 focus:ring-cosmic-magenta focus:border-cosmic-magenta rounded-lg px-4 py-3 text-base"
                aria-label="Descripción personal"
                tabIndex={0}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-base font-semibold text-cosmic-magenta">Edad</label>
                <Input
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Edad"
                  type="number"
                  min={14}
                  max={120}
                  className="bg-white/90 border border-cosmic-magenta text-gray-900 rounded-lg px-4 py-3 text-base"
                  aria-label="Edad"
                  tabIndex={0}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-base font-semibold text-cosmic-magenta">Fotos de perfil</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[0,1,2,3,4].map(idx => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={e => handlePhotoChange(idx, e)}
                      className="bg-white/90 border border-cosmic-magenta rounded-lg"
                      aria-label={`Seleccionar foto ${idx+1}`}
                      tabIndex={0}
                    />
                    {photoPreviews[idx] ? (
                      <img src={photoPreviews[idx]!} alt={`preview foto${idx+1}`} className={`w-20 h-20 ${idx===0 ? 'rounded-full' : 'rounded-xl'} mt-1 border-2 border-cosmic-magenta shadow-lg`} />
                    ) : form[`photo_url${idx===0?'':'_'+(idx+1)}`] ? (
                      <img src={form[`photo_url${idx===0?'':'_'+(idx+1)}`]} alt={`foto${idx+1}`} className={`w-20 h-20 ${idx===0 ? 'rounded-full' : 'rounded-xl'} mt-1 border-2 border-cosmic-magenta shadow-lg`} />
                    ) : (
                      <div className={`w-20 h-20 flex items-center justify-center bg-white/40 text-cosmic-magenta ${idx===0 ? 'rounded-full' : 'rounded-xl'} border-2 border-dashed border-cosmic-magenta mt-1`}>Sin foto</div>
                    )}
                    <span className="text-xs text-cosmic-magenta">{idx === 0 ? 'Principal' : `Adicional ${idx}`}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <Button type="submit" className="w-full bg-gradient-to-r from-cosmic-magenta to-fuchsia-500 hover:from-fuchsia-600 hover:to-cosmic-magenta text-white font-bold text-lg py-3 rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cosmic-magenta" disabled={loading} aria-label="Guardar Cambios" tabIndex={0}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              <Button type="button" variant="outline" className="w-full border-2 border-cosmic-magenta text-cosmic-magenta font-semibold rounded-xl py-3 hover:bg-cosmic-magenta/10 transition-all" onClick={() => navigate('/home')} aria-label="Volver al inicio" tabIndex={0}>
                Volver al inicio
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileEdit; 