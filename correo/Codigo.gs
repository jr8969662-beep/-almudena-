/**
 * Envío de correos GRATIS para el sistema del Complejo Policial Almudena.
 * Usa la cuenta de Gmail que publique este script (Google Apps Script).
 *
 * Cómo instalarlo (una sola vez):
 * 1. Entrá a https://script.google.com con el Gmail del complejo → "Nuevo proyecto".
 * 2. Borrá lo que aparece y pegá TODO este archivo. Cambiá la CLAVE de abajo.
 * 3. Guardar (ícono de disquete).
 * 4. "Implementar" → "Nueva implementación" → tipo "Aplicación web".
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier persona
 * 5. "Implementar" → autorizá los permisos con tu cuenta.
 * 6. Copiá la "URL de la aplicación web" (termina en /exec) y pasala junto con la CLAVE.
 *
 * Límite de Google: 100 destinatarios por día con Gmail común (1.500 con Google Workspace).
 */
const CLAVE = 'almudena-2026';   // cambiala por una propia y usá la misma en config.js

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.clave !== CLAVE) return salida({ok: false, error: 'clave incorrecta'});
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.to || '')) return salida({ok: false, error: 'correo inválido'});
    MailApp.sendEmail({
      to: d.to,
      subject: String(d.subject || 'Complejo Policial Almudena').slice(0, 200),
      htmlBody: String(d.html || ''),
      body: String(d.text || ''),
      name: 'Complejo Policial Almudena'
    });
    return salida({ok: true, restantesHoy: MailApp.getRemainingDailyQuota()});
  } catch (err) {
    return salida({ok: false, error: String(err)});
  }
}

function doGet() {
  return salida({ok: true, servicio: 'correo Almudena', restantesHoy: MailApp.getRemainingDailyQuota()});
}

function salida(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
