export interface Profile {
  id: string;
  name: string;
  age: number;
  sign: string;
  moon_sign: string;
  rising_sign: string;
  description: string;
  photo_url: string | null;
  compatibility_score: number;
  gender: string;
  location: string;
  lookingFor: string;
}

// Mock data de perfiles compatibles
export const mockProfiles: Profile[] = [
  {
    id: "luna",
    name: "Luna",
    age: 25,
    sign: "Piscis",
    moon_sign: "Cáncer",
    rising_sign: "Escorpio",
    description: "Una alma sensible que encuentra magia en los pequeños momentos. Ama la música, la poesía y las conversaciones profundas bajo la luz de la luna.",
    photo_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    compatibility_score: 94,
    gender: "mujer",
    location: "Madrid, España",
    lookingFor: "conexion-especial"
  },
  {
    id: "sofia",
    name: "Sofía",
    age: 28,
    sign: "Libra",
    moon_sign: "Géminis", 
    rising_sign: "Leo",
    description: "Equilibrio perfecto entre elegancia y espontaneidad. Disfruta del arte, los viajes y crear conexiones auténticas con personas especiales.",
    photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    compatibility_score: 91,
    gender: "mujer",
    location: "Barcelona, España",
    lookingFor: "relacion-seria"
  },
  {
    id: "maya",
    name: "Maya",
    age: 26,
    sign: "Escorpio",
    moon_sign: "Piscis",
    rising_sign: "Virgo",
    description: "Intensidad y misterio en perfecta armonía. Le fascina explorar los secretos del universo y las profundidades del alma humana.",
    photo_url: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face",
    compatibility_score: 89,
    gender: "mujer",
    location: "Valencia, España",
    lookingFor: "conexion-especial"
  },
  {
    id: "elena",
    name: "Elena",
    age: 24,
    sign: "Sagitario",
    moon_sign: "Aries",
    rising_sign: "Acuario",
    description: "Espíritu libre con sed de aventuras. Siempre lista para explorar nuevos horizontes y vivir experiencias que expandan su conciencia.",
    photo_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    compatibility_score: 87,
    gender: "mujer",
    location: "Sevilla, España",
    lookingFor: "explorar"
  },
  {
    id: "camila",
    name: "Camila",
    age: 27,
    sign: "Géminis",
    moon_sign: "Libra",
    rising_sign: "Sagitario",
    description: "Mente brillante y corazón curioso. Le encanta aprender cosas nuevas, debatir ideas fascinantes y descubrir conexiones inesperadas.",
    photo_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
    compatibility_score: 85,
    gender: "mujer",
    location: "Bilbao, España",
    lookingFor: "amistad-profunda"
  },
  {
    id: "alejandro",
    name: "Alejandro",
    age: 29,
    sign: "Capricornio",
    moon_sign: "Tauro",
    rising_sign: "Cáncer",
    description: "Determinación y sensibilidad en perfecta síntesis. Construye sus sueños con paciencia y encuentra belleza en los detalles cotidianos.",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    compatibility_score: 83,
    gender: "hombre",
    location: "Madrid, España",
    lookingFor: "relacion-seria"
  },
  {
    id: "diego",
    name: "Diego",
    age: 26,
    sign: "Acuario",
    moon_sign: "Sagitario",
    rising_sign: "Géminis",
    description: "Visionario con los pies en la tierra. Combina ideas innovadoras con una perspectiva práctica para crear soluciones únicas.",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    compatibility_score: 81,
    gender: "hombre",
    location: "Barcelona, España",
    lookingFor: "conexion-especial"
  },
  {
    id: "mateo",
    name: "Mateo",
    age: 30,
    sign: "Leo",
    moon_sign: "Escorpio",
    rising_sign: "Piscis",
    description: "Carisma natural con profundidad emocional. Irradia confianza mientras mantiene una conexión genuina con su mundo interior.",
    photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    compatibility_score: 79,
    gender: "hombre",
    location: "Valencia, España",
    lookingFor: "explorar"
  }
];

// Función helper para obtener un perfil por ID
export const getProfileById = (id: string): Profile | undefined => {
  return mockProfiles.find(profile => profile.id === id);
}; 