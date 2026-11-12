# Sistema de Gestión Integral — Complejo Policial Almudena

Prototipo del **Sistema Web Inteligente de Gestión Integral** solicitado por la Div. Complejo Pol. Almudena (DPyRI) mediante Nota SEPS N° 315434/26, para una comunidad de aproximadamente 7.335 socios.

> ⚠️ **Prototipo de demostración.** Los datos (socios, tarifas, horarios, reservas) son de ejemplo y se guardan solo en el navegador (`localStorage`). No usar con datos reales.

## Dos sitios

| Sitio | Archivo | Para quién |
|---|---|---|
| **Reservas para socios** | `index.html` | Sitio público + cuenta del socio: reservar, pagar e informar el pago, QR, credencial, asistente |
| **Administración** | `admin.html` | Personal del complejo: pagos por confirmar, lugares disponibles, agenda, reservas, socios, comunicados, seguridad. También portería |

Ambos comparten `styles.css` y `app.js`. En el prototipo los datos se guardan en el navegador, así que la administración ve lo que hacen los socios **solo si se usa el mismo navegador**. En la versión real ambos sitios se conectan a la misma base de datos en un servidor.

## Pagos

1. El socio reserva y la reserva queda con **💲 Pago pendiente**.
2. Transfiere (alias/CBU de ejemplo) y desde *Mis reservas → Pagar* informa el pago con N° de operación y foto del comprobante → **🕓 Pago en revisión**.
3. La administración, en *Pagos*, ve el comprobante y lo **confirma ✅** o **rechaza ⛔**. También puede registrar pagos en efectivo.
4. Portería ve al escanear el QR si el pago está confirmado.

## Cómo probarlo

Abrir `index.html` (socios) o `admin.html` (personal) en Chrome. Cada pantalla de ingreso tiene sus accesos de demostración:

| Rol | Usuario | Contraseña |
|---|---|---|
| Socio | `1001` | `1234` |
| Portería | `porteria` | `1234` |
| Administrador | `admin` | `admin` |

Para probar el registro: socio `1003`, DNI `33444555`.

## Panel del socio (diseño intuitivo)

- **Inicio con accesos grandes**: Reservar, Mis reservas, Mi credencial, Preguntar, Información y Mi familia, más la próxima reserva con botón “Mostrar QR” y avisos de clima o mantenimiento destacados.
- **Reserva paso a paso** con barra de progreso: ¿Qué? → ¿Cuál? → ¿Qué día? (tira de 14 días con colores y calendario completo opcional) → ¿Horario? → Confirmar.
- **Barra de navegación inferior** en el celular y botón flotante del asistente.
- **Mi cuenta**: datos de contacto, cambio de contraseña, credencial digital con QR y grupo familiar.
- **Información**: horarios, tarifas, ubicación, requisitos, reglamento descargable, preguntas frecuentes y documentación.

## Funcionalidades (según la nota)

1. **Gestión de usuarios** — login, recuperación de contraseña, registro validado contra padrón (N° de socio + DNI), grupo familiar con aprobación administrativa, administración de perfiles (suspender/habilitar cuentas, restablecer contraseñas, usuarios del personal por nivel).
2. **Reservas** — quinchos, canchas y pileta; calendario interactivo con disponibilidad en tiempo real; bloqueo de horarios ocupados; confirmación inmediata; una reserva por tipo y por día.
3. **Comprobantes digitales** — QR único e irrepetible, validación por cámara o código en portería, registro de fecha y hora de ingreso, rechazo de QR falsos, cancelados, reutilizados o de otra fecha.
4. **Panel administrativo** — alta, modificación y cancelación; filtros; estadísticas; reportes mensuales/anuales y exportación CSV.
5. **Asistente virtual** — responde horarios, tarifas, reglamento, disponibilidad, actividades, eventos, requisitos, ubicación y guía la reserva (por reglas en el prototipo; IA en la versión final).
6. **Comunicación institucional** — comunicados, novedades, eventos, promociones, mantenimiento, clima, reglamento y documentación.
7. **Seguridad** — permisos por nivel (socio, portería, administrador), bloqueo tras 5 intentos fallidos, cierre de sesión por inactividad, consentimiento de datos personales (Ley 25.326), DNI enmascarado, copias de seguridad automáticas diarias (descarga y restauración) y registro de auditoría.
8. **Diseño responsivo** — PC, celular y tablet.

## Próximos pasos para la versión productiva

- Backend con base de datos compartida (p. ej. Supabase o Firebase), autenticación real y contraseñas cifradas.
- Carga del padrón real de socios y datos institucionales (dirección, horarios, tarifas, reglamento).
- Integración del asistente con un modelo de IA.
- Copias de seguridad automáticas, HTTPS y política de protección de datos personales.
- Ampliaciones previstas (punto 9): pagos electrónicos, credencial digital, notificaciones por correo/WhatsApp, molinetes QR, encuestas y estadísticas con IA.
