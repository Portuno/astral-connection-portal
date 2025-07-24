-- Actualizar valores de género en la tabla profiles
-- Cambiar de "masculino"/"femenino" a "hombre"/"mujer"

-- Actualizar género de "masculino" a "hombre"
UPDATE profiles 
SET gender = 'hombre' 
WHERE gender = 'masculino';

-- Actualizar género de "femenino" a "mujer"
UPDATE profiles 
SET gender = 'mujer' 
WHERE gender = 'femenino';

-- Verificar los cambios
SELECT gender, COUNT(*) as count 
FROM profiles 
GROUP BY gender 
ORDER BY count DESC; 