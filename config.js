/* Configuración del envío real de correos.
   OPCIÓN RECOMENDADA (gratis): Google Apps Script con el Gmail del complejo.
   Ver instrucciones en correo/Codigo.gs */
window.CONFIG_CORREO = {
  appsScriptUrl: '',          // ej: 'https://script.google.com/macros/s/AKfy.../exec'
  clave: 'almudena-2026',     // la misma CLAVE que pusiste en Codigo.gs

  /* Alternativa: EmailJS (dejar vacío si usás Apps Script) */
  serviceId: '', templateId: '', publicKey: ''
};
