import { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ProfileEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
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
    age: '',
    sign: '',
    moon_sign: '',
    rising_sign: '',
  });
  const [photoFiles, setPhotoFiles] = useState<(File | null)[]>([null, null, null]);
  const [photoPreviews, setPhotoPreviews] = useState<(string | null)[]>([null, null, null]);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single<{
          id: string;
          name: string;
          age: number;
          sign: string;
          moon_sign: string;
          rising_sign: string;
          description: string;
          photo_url: string;
          photo_url_2?: string;
          photo_url_3?: string;
          gender_preference?: string;
          compatibility_score: number;
          created_at: string;
        }>();
      if (data) {
        setProfile(data);
        setForm({
          name: data.name || '',
          description: data.description || '',
          photo_url: data.photo_url || '',
          photo_url_2: data.photo_url_2 || '',
          photo_url_3: data.photo_url_3 || '',
          age: data.age ? String(data.age) : '',
          sign: data.sign || '',
          moon_sign: data.moon_sign || '',
          rising_sign: data.rising_sign || '',
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
    console.log('Archivo a subir:', file, 'Tamaño:', file.size, 'Tipo:', file.type);
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}_${idx}.${ext}`;
    const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (error) {
      toast({ title: 'Error subiendo foto', description: error.message, variant: 'destructive' });
      return '';
    }
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
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
    let photoUrls = [form.photo_url, form.photo_url_2, form.photo_url_3];
    for (let i = 0; i < 3; i++) {
      if (photoFiles[i]) {
        const url = await uploadPhoto(photoFiles[i] as File, i + 1);
        if (!url) {
          setLoading(false);
          return;
        }
        photoUrls[i] = url;
      }
    }
    const updateData = {
      name: form.name,
      description: form.description,
      photo_url: photoUrls[0],
      photo_url_2: photoUrls[1],
      photo_url_3: photoUrls[2],
      age: form.age ? Number(form.age) : undefined,
      sign: form.sign,
      moon_sign: form.moon_sign,
      rising_sign: form.rising_sign,
    };
    let result;
    if (profile) {
      result = await supabase.from('profiles').update(updateData).eq('user_id', user.id);
    } else {
      result = await supabase.from('profiles').insert({ ...updateData, id: crypto.randomUUID(), user_id: user.id });
    }
    if (result.error) {
      toast({ title: 'Error', description: result.error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Perfil actualizado', description: 'Tus cambios han sido guardados.' });
      navigate('/home');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cosmic-blue via-indigo-900 to-purple-900 p-4">
      <Card className="w-full max-w-lg bg-white/95 shadow-2xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-cosmic-magenta mb-2">Editar Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-base font-semibold text-cosmic-magenta">Nombre</label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nombre completo"
                required
                className="bg-white/90 border border-cosmic-magenta text-gray-900 placeholder-gray-400 focus:ring-cosmic-magenta focus:border-cosmic-magenta rounded-lg px-4 py-3 text-base"
              />
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
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base font-semibold text-cosmic-magenta">Foto principal (avatar)</label>
              <Input type="file" accept="image/*" onChange={e => handlePhotoChange(0, e)} className="bg-white/90 border border-cosmic-magenta rounded-lg" />
              {photoPreviews[0] ? (
                <img src={photoPreviews[0]} alt="preview avatar" className="w-20 h-20 rounded-full mt-2 border-2 border-cosmic-magenta" />
              ) : form.photo_url && (
                <img src={form.photo_url} alt="avatar" className="w-20 h-20 rounded-full mt-2 border-2 border-cosmic-magenta" />
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-base font-semibold text-cosmic-magenta">Foto adicional 2</label>
              <Input type="file" accept="image/*" onChange={e => handlePhotoChange(1, e)} className="bg-white/90 border border-cosmic-magenta rounded-lg" />
              {photoPreviews[1] ? (
                <img src={photoPreviews[1]} alt="preview foto2" className="w-20 h-20 rounded mt-2 border-2 border-cosmic-magenta" />
              ) : form.photo_url_2 && (
                <img src={form.photo_url_2} alt="foto2" className="w-20 h-20 rounded mt-2 border-2 border-cosmic-magenta" />
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-base font-semibold text-cosmic-magenta">Foto adicional 3</label>
              <Input type="file" accept="image/*" onChange={e => handlePhotoChange(2, e)} className="bg-white/90 border border-cosmic-magenta rounded-lg" />
              {photoPreviews[2] ? (
                <img src={photoPreviews[2]} alt="preview foto3" className="w-20 h-20 rounded mt-2 border-2 border-cosmic-magenta" />
              ) : form.photo_url_3 && (
                <img src={form.photo_url_3} alt="foto3" className="w-20 h-20 rounded mt-2 border-2 border-cosmic-magenta" />
              )}
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <Button type="submit" className="w-full bg-cosmic-magenta hover:bg-cosmic-magenta/90 text-white font-semibold text-lg py-3 rounded-lg shadow-lg" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/home')}>
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