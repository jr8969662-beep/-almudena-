# Sistema de Gestión Integral — Complejo Policial Almudena

Prototipo del **Sistema Web Inteligente de Gestión Integral** solicitado por la Div. Complejo Pol. Almudena (DPyRI) mediante Nota SEPS N° 315434/26, para una comunidad de aproximadamente 7.335 socios.

> ⚠️ **Prototipo de demostración.** Los datos (socios, tarifas, horarios, reservas) son de ejemplo y se guardan solo en el navegador (`localStorage`). No usar con datos reales.

## Cómo probarlo

Abrir `index.html` en Chrome (PC o celular). En la pantalla de ingreso hay accesos de demostración:

| Rol | Usuario | Contraseña |
|---|---|---|
| Socio | `1001` | `1234` |
| Portería | `porteria` | `1234` |
| Administrador | `admin` | `admin` |

Para probar el registro: socio `1003`, DNI `33444555`.

## Funcionalidades (según la nota)

1. **Gestión de usuarios** — login, recuperación de contraseña, registro validado contra padrón (N° de socio + DNI), grupo familiar con aprobación administrativa.
2. **Reservas** — quinchos, canchas y pileta; calendario interactivo con disponibilidad en tiempo real; bloqueo de horarios ocupados; confirmación inmediata; una reserva por tipo y por día.
3. **Comprobantes digitales** — QR único e irrepetible, validación por cámara o código en portería, registro de fecha y hora de ingreso, rechazo de QR falsos, cancelados, reutilizados o de otra fecha.
4. **Panel administrativo** — alta, modificación y cancelación; filtros; estadísticas; reportes mensuales/anuales y exportación CSV.
5. **Asistente virtual** — responde horarios, tarifas, reglamento, disponibilidad, actividades, eventos, requisitos, ubicación y guía la reserva (por reglas en el prototipo; IA en la versión final).
6. **Comunicación institucional** — comunicados, novedades, eventos, promociones, mantenimiento, clima, reglamento y documentación.
7. **Seguridad** — permisos por rol y registro de auditoría de todas las operaciones.
8. **Diseño responsivo** — PC, celular y tablet.

## Próximos pasos para la versión productiva

- Backend con base de datos compartida (p. ej. Supabase o Firebase), autenticación real y contraseñas cifradas.
- Carga del padrón real de socios y datos institucionales (dirección, horarios, tarifas, reglamento).
- Integración del asistente con un modelo de IA.
- Copias de seguridad automáticas, HTTPS y política de protección de datos personales.
- Ampliaciones previstas (punto 9): pagos electrónicos, credencial digital, notificaciones por correo/WhatsApp, molinetes QR, encuestas y estadísticas con IA.
