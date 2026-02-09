/**
 * Utilidades para manejo de contraseñas en el sistema
 */

export interface FrequentPassword {
  password: string;
  lastUsed: number;
  usageCount: number;
}

/**
 * Valida si una contraseña es válida para el sistema
 * @param password - Contraseña a validar
 * @returns boolean - true si es válida
 */
export const validatePassword = async (password: string): Promise<boolean> => {
  // Validación básica
  if (!password || password.length === 0) {
    return false;
  }

  // Aquí puedes agregar validaciones adicionales:
  // - Verificar con el controller
  // - Verificar con la página de consulta de interrapidisimo
  // - Validaciones de formato, etc.
  
  try {
    // Ejemplo de validación con el controller (ajusta la URL según tu backend)
    // const response = await fetch('/api/validate-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ password })
    // });
    // return response.ok;
    
    return true; // Por ahora retorna true si no está vacía
  } catch (error) {
    console.error('Error validating password:', error);
    return false;
  }
};

/**
 * Obtiene las contraseñas frecuentes del localStorage
 */
export const getFrequentPasswords = (): FrequentPassword[] => {
  try {
    const saved = localStorage.getItem("frequentPasswords");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading frequent passwords:', error);
    return [];
  }
};

/**
 * Guarda una contraseña como frecuente
 * @param password - Contraseña a guardar
 * @returns boolean - true si se guardó exitosamente
 */
export const saveFrequentPassword = (password: string): boolean => {
  try {
    const currentPasswords = getFrequentPasswords();
    
    // Verificar si ya existe
    const existingIndex = currentPasswords.findIndex(p => p.password === password);
    
    if (existingIndex >= 0) {
      // Actualizar contador de uso y fecha
      currentPasswords[existingIndex].usageCount++;
      currentPasswords[existingIndex].lastUsed = Date.now();
    } else {
      // Agregar nueva contraseña
      currentPasswords.push({
        password,
        lastUsed: Date.now(),
        usageCount: 1
      });
    }
    
    // Ordenar por uso más reciente y limitar a 10 contraseñas
    const sortedPasswords = currentPasswords
      .sort((a, b) => b.lastUsed - a.lastUsed)
      .slice(0, 10);
    
    localStorage.setItem("frequentPasswords", JSON.stringify(sortedPasswords));
    return true;
  } catch (error) {
    console.error('Error saving frequent password:', error);
    return false;
  }
};

/**
 * Elimina una contraseña frecuente
 * @param password - Contraseña a eliminar
 */
export const removeFrequentPassword = (password: string): boolean => {
  try {
    const currentPasswords = getFrequentPasswords();
    const updatedPasswords = currentPasswords.filter(p => p.password !== password);
    localStorage.setItem("frequentPasswords", JSON.stringify(updatedPasswords));
    return true;
  } catch (error) {
    console.error('Error removing frequent password:', error);
    return false;
  }
};

/**
 * Actualiza el contador de uso de una contraseña frecuente
 * @param password - Contraseña utilizada
 */
export const updatePasswordUsage = (password: string): void => {
  try {
    const currentPasswords = getFrequentPasswords();
    const passwordIndex = currentPasswords.findIndex(p => p.password === password);
    
    if (passwordIndex >= 0) {
      currentPasswords[passwordIndex].usageCount++;
      currentPasswords[passwordIndex].lastUsed = Date.now();
      localStorage.setItem("frequentPasswords", JSON.stringify(currentPasswords));
    }
  } catch (error) {
    console.error('Error updating password usage:', error);
  }
};