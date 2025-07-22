-- Ejemplo de actualización de perfiles artificiales existentes (ajusta los usernames según tus datos)
UPDATE profiles SET moon_sign = 'Piscis', rising_sign = 'Libra', lat = 40.4168, lon = -3.7038 WHERE username = 'laura'; -- Madrid
UPDATE profiles SET moon_sign = 'Leo', rising_sign = 'Sagitario', lat = 41.3874, lon = 2.1686 WHERE username = 'marta'; -- Barcelona
UPDATE profiles SET moon_sign = 'Tauro', rising_sign = 'Acuario', lat = 39.4699, lon = -0.3763 WHERE username = 'carmen'; -- Valencia
UPDATE profiles SET moon_sign = 'Géminis', rising_sign = 'Capricornio', lat = 37.3886, lon = -5.9822 WHERE username = 'alba'; -- Sevilla
UPDATE profiles SET moon_sign = 'Virgo', rising_sign = 'Escorpio', lat = 43.2630, lon = -2.9350 WHERE username = 'lucia'; -- Bilbao
UPDATE profiles SET moon_sign = 'Libra', rising_sign = 'Piscis', lat = 37.1773, lon = -3.5986 WHERE username = 'ines'; -- Granada
UPDATE profiles SET moon_sign = 'Escorpio', rising_sign = 'Leo', lat = 41.6488, lon = -0.8891 WHERE username = 'paula'; -- Zaragoza
UPDATE profiles SET moon_sign = 'Sagitario', rising_sign = 'Virgo', lat = 38.3452, lon = -0.4810 WHERE username = 'sara'; -- Alicante

-- Ejemplo para un perfil argentino
UPDATE profiles SET moon_sign = 'Cáncer', rising_sign = 'Tauro', lat = -34.6037, lon = -58.3816 WHERE username = 'valentina'; -- Buenos Aires

-- Ejemplo para un perfil colombiano
UPDATE profiles SET moon_sign = 'Acuario', rising_sign = 'Libra', lat = 6.2442, lon = -75.5812 WHERE username = 'juliana'; -- Medellín

-- Ejemplo para un perfil venezolano
UPDATE profiles SET moon_sign = 'Piscis', rising_sign = 'Sagitario', lat = 10.4806, lon = -66.9036 WHERE username = 'andrea'; -- Caracas

-- Ejemplo para un perfil ucraniano
UPDATE profiles SET moon_sign = 'Leo', rising_sign = 'Capricornio', lat = 50.4501, lon = 30.5234 WHERE username = 'kateryna'; -- Kiev

-- Ejemplo para un perfil de Estados Unidos
UPDATE profiles SET moon_sign = 'Sagitario', rising_sign = 'Acuario', lat = 37.7749, lon = -122.4194 WHERE username = 'ashley'; -- San Francisco

-- Crear la función RPC para filtrar por distancia, género y compatibilidad
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

CREATE OR REPLACE FUNCTION get_profiles_nearby(
  user_lat double precision,
  user_lon double precision,
  max_distance_km double precision,
  gender text,
  min_compat int
)
RETURNS SETOF profiles AS $$
  SELECT * FROM profiles
  WHERE is_premium = true
    AND (gender = gender OR gender = 'ambos')
    AND compatibility_score >= min_compat
    AND lat IS NOT NULL AND lon IS NOT NULL
    AND earth_distance(
      ll_to_earth(user_lat, user_lon),
      ll_to_earth(lat, lon)
    ) < max_distance_km * 1000
$$ LANGUAGE sql STABLE; 