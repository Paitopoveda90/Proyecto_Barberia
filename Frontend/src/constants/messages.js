// Mensajes de confirmación
export const CONFIRM_MESSAGES = {
  CANCEL_APPOINTMENT: '¿Estás seguro de cancelar esta cita?',
  DELETE_SERVICE: '¿Estás seguro de eliminar este servicio?',
  UNBLOCK_DATE: '¿Estás seguro de desbloquear esta fecha/horario?',
  LOGOUT: '¿Estás seguro de que deseas cerrar sesión?',
  DELETE_APPOINTMENT: '¿Estás seguro de que deseas eliminar esta cita?'
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  APPOINTMENT_CANCELLED: 'Cita cancelada exitosamente',
  SERVICE_CREATED: 'Servicio creado exitosamente',
  SERVICE_DELETED: 'Servicio eliminado exitosamente',
  DATE_BLOCKED: 'Fecha/horario bloqueado exitosamente',
  DATE_UNBLOCKED: 'Fecha/horario desbloqueado exitosamente',
  APPOINTMENT_CREATED: '¡Cita reservada correctamente!',
  APPOINTMENT_DELETED: 'Cita eliminada exitosamente'
};

// Mensajes de error
export const ERROR_MESSAGES = {
  CANCEL_APPOINTMENT: 'Error al cancelar la cita',
  CREATE_SERVICE: 'Error al crear servicio',
  DELETE_SERVICE: 'Error al eliminar servicio',
  BLOCK_DATE: 'Error al bloquear fecha',
  UNBLOCK_DATE: 'Error al desbloquear',
  CREATE_APPOINTMENT: 'Error al crear la cita',
  DELETE_APPOINTMENT: 'Error al eliminar la cita',
  LOAD_APPOINTMENTS: 'Error al cargar las citas',
  LOAD_USERS: 'Error al cargar usuarios',
  LOAD_SERVICES: 'Error al cargar servicios',
  LOAD_BLOCKED_DATES: 'Error al cargar fechas bloqueadas'
};

// Estados de citas
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Traducciones de estados
export const STATUS_LABELS = {
  [APPOINTMENT_STATUS.SCHEDULED]: 'Programada',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completada',
  [APPOINTMENT_STATUS.CANCELLED]: 'Cancelada'
};
