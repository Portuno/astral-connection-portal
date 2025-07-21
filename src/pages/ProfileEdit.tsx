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
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    <div className="min-h-screen flex items-center justify-center bg-cosmic-blue p-4">
      <Card className="w-full max-w-lg bg-white/90">
        <CardHeader>
          <CardTitle>Editar Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Nombre completo"
              required
            />
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descripción personal"
              rows={3}
              required
            />
            <div className="flex gap-2">
              <Input
                name="sign"
                value={form.sign}
                onChange={handleChange}
                placeholder="Signo solar"
                required
              />
              <Input
                name="moon_sign"
                value={form.moon_sign}
                onChange={handleChange}
                placeholder="Signo lunar"
                required
              />
              <Input
                name="rising_sign"
                value={form.rising_sign}
                onChange={handleChange}
                placeholder="Ascendente"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Foto principal (avatar)</label>
              <Input type="file" accept="image/*" onChange={e => handlePhotoChange(0, e)} />
              {form.photo_url && <img src={form.photo_url} alt="avatar" className="w-20 h-20 rounded-full mt-2" />}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Foto adicional 2</label>
              <Input type="file" accept="image/*" onChange={e => handlePhotoChange(1, e)} />
              {form.photo_url_2 && <img src={form.photo_url_2} alt="foto2" className="w-20 h-20 rounded mt-2" />}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Foto adicional 3</label>
              <Input type="file" accept="image/*" onChange={e => handlePhotoChange(2, e)} />
              {form.photo_url_3 && <img src={form.photo_url_3} alt="foto3" className="w-20 h-20 rounded mt-2" />}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileEdit; 