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
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({
    full_name: '',
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
          full_name: data.full_name || '',
          description: data.description || '',
          sign: data.sign || '',
          moon_sign: data.moon_sign || '',
          rising_sign: data.rising_sign || '',
          photo_url: data.photo_url || '',
          photo_url_2: data.photo_url_2 || '',
          photo_url_3: data.photo_url_3 || '',
          gender_preference: data.gender_preference || 'ambos',
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
    files[idx] = e.target.files?.[0] || null;
    setPhotoFiles(files);
  };

  const uploadPhoto = async (file: File, idx: number) => {
    if (!user) return '';
    const ext = file.name.split('.').pop();
    const filePath = `avatars/${user.id}_${idx}.${ext}`;
    const { data, error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (error) {
      toast({ title: 'Error subiendo foto', description: error.message, variant: 'destructive' });
      return '';
    }
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let photoUrls = [form.photo_url, form.photo_url_2, form.photo_url_3];
    for (let i = 0; i < 3; i++) {
      if (photoFiles[i]) {
        const url = await uploadPhoto(photoFiles[i] as File, i + 1);
        photoUrls[i] = url;
      }
    }
    const updateData = {
      ...form,
      photo_url: photoUrls[0],
      photo_url_2: photoUrls[1],
      photo_url_3: photoUrls[2],
      updated_at: new Date().toISOString(),
      user_id: user.id,
    };
    let result;
    if (profile) {
      result = await supabase.from('profiles').update(updateData).eq('user_id', user.id);
    } else {
      result = await supabase.from('profiles').insert(updateData);
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
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Nombre completo"
              required
              className="bg-white/90 border border-cosmic-magenta text-gray-900 placeholder-gray-400 focus:ring-cosmic-magenta focus:border-cosmic-magenta rounded-lg px-4 py-3 text-base"
            />
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descripción personal"
              rows={3}
              required
              className="bg-white/90 border border-cosmic-magenta text-gray-900 placeholder-gray-400 focus:ring-cosmic-magenta focus:border-cosmic-magenta rounded-lg px-4 py-3 text-base"
            />
            <div className="flex gap-2">
              <Input
                name="sign"
                value={form.sign}
                onChange={handleChange}
                placeholder="Signo solar"
                required
                className="bg-white/90 border border-cosmic-magenta text-gray-900 placeholder-gray-400 focus:ring-cosmic-magenta focus:border-cosmic-magenta rounded-lg px-4 py-3 text-base"
              />
              <Input
                name="moon_sign"
                value={form.moon_sign}
                onChange={handleChange}
                placeholder="Signo lunar"
                required
                className="bg-white/90 border border-cosmic-magenta text-gray-900 placeholder-gray-400 focus:ring-cosmic-magenta focus:border-cosmic-magenta rounded-lg px-4 py-3 text-base"
              />
              <Input
                name="rising_sign"
                value={form.rising_sign}
                onChange={handleChange}
                placeholder="Ascendente"
                required
                className="bg-white/90 border border-cosmic-magenta text-gray-900 placeholder-gray-400 focus:ring-cosmic-magenta focus:border-cosmic-magenta rounded-lg px-4 py-3 text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-cosmic-magenta">¿A quién quieres ver?</label>
              <select
                name="gender_preference"
                value={form.gender_preference}
                onChange={handleChange}
                className="w-full rounded-lg border border-cosmic-magenta p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cosmic-magenta bg-white/90"
              >
                <option value="mujer">Solo mujeres</option>
                <option value="hombre">Solo hombres</option>
                <option value="ambos">Ambos</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-cosmic-magenta">Foto principal (avatar)</label>
              <Input type="file" accept="image/*" onChange={e => handlePhotoChange(0, e)} className="bg-white/90 border border-cosmic-magenta rounded-lg" />
              {form.photo_url && <img src={form.photo_url} alt="avatar" className="w-20 h-20 rounded-full mt-2 border-2 border-cosmic-magenta" />}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-cosmic-magenta">Foto adicional 2</label>
              <Input type="file" accept="image/*" onChange={e => handlePhotoChange(1, e)} className="bg-white/90 border border-cosmic-magenta rounded-lg" />
              {form.photo_url_2 && <img src={form.photo_url_2} alt="foto2" className="w-20 h-20 rounded mt-2 border-2 border-cosmic-magenta" />}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-cosmic-magenta">Foto adicional 3</label>
              <Input type="file" accept="image/*" onChange={e => handlePhotoChange(2, e)} className="bg-white/90 border border-cosmic-magenta rounded-lg" />
              {form.photo_url_3 && <img src={form.photo_url_3} alt="foto3" className="w-20 h-20 rounded mt-2 border-2 border-cosmic-magenta" />}
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