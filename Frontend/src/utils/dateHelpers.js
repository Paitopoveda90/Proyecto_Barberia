/**
 * Utilidades para formatear y manejar fechas
 * Evita problemas de zona horaria usando métodos locales
 */

/**
 * Formatea una fecha a string YYYY-MM-DD sin problemas de zona horaria
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const formatDateToString = (date) => {
  if (!date) return '';
  
  // Si es string, devolverlo tal cual si ya está en formato YYYY-MM-DD
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  
  // Si es Date, usar métodos locales (no UTC) para evitar cambios de día
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  return '';
};

/**
 * Normaliza una fecha para comparación (puede venir como string o Date)
 * @param {Date|string|object} dateValue - Valor de fecha a normalizar
 * @returns {string} Fecha normalizada en formato YYYY-MM-DD
 */
export const normalizeDate = (dateValue) => {
  if (!dateValue) return '';
  
  // Si es string, extraer solo la parte de fecha (YYYY-MM-DD)
  if (typeof dateValue === 'string') {
    const datePart = dateValue.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart;
    }
  }
  
  // Si es Date, formatearlo
  if (dateValue instanceof Date) {
    return formatDateToString(dateValue);
  }
  
  // Si es un objeto con propiedades de fecha (de Sequelize)
  if (dateValue && typeof dateValue === 'object') {
    if (dateValue.getFullYear) {
      return formatDateToString(dateValue);
    }
  }
  
  return '';
};

/**
 * Formatea una fecha a formato local completo en español
 * @param {Date|string} dateValue - Fecha a formatear
 * @returns {string} Fecha formateada en español
 */
export const formatDateLocal = (dateValue) => {
  if (!dateValue) return '';
  
  // Si la fecha viene como string YYYY-MM-DD, parsearla correctamente
  if (typeof dateValue === 'string') {
    const datePart = dateValue.split('T')[0];
    const [year, month, day] = datePart.split('-');
    // Crear Date usando constructor local (no UTC) para evitar cambios de día
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return dateObj.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  // Si es un objeto Date, usar métodos locales
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  return date.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

/**
 * Formatea una fecha a formato corto (DD/MM/YYYY)
 * @param {Date|string} dateValue - Fecha a formatear
 * @returns {string} Fecha formateada en formato corto
 */
export const formatDateShort = (dateValue) => {
  if (!dateValue) return '';
  
  // Si la fecha viene como string YYYY-MM-DD, parsearla correctamente
  if (typeof dateValue === 'string') {
    const datePart = dateValue.split('T')[0];
    const [year, month, day] = datePart.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return dateObj.toLocaleDateString('es-ES');
  }
  
  // Si es un objeto Date, usar métodos locales
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  return date.toLocaleDateString('es-ES');
};
