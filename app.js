/* Sistema de Gestión Integral — Complejo Policial Almudena (prototipo)
   MODO = 'socio' (index.html) o 'admin' (admin.html) */
const MODO = window.MODO || 'socio';
/* ===================== Utilidades ===================== */
const KEY = 'almudena_prototipo_v4';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const z = n => String(n).padStart(2, '0');
const ymd = d => d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
const hoy = () => ymd(new Date());
const addDays = (s, n) => { const d = new Date(s + 'T12:00'); d.setDate(d.getDate() + n); return ymd(d); };
const fmtF = s => { const [y, m, d] = s.split('-'); return d + '/' + m + '/' + y; };
const cap1 = s => s.charAt(0).toUpperCase() + s.slice(1);
const fmtFL = s => cap1(new Date(s + 'T12:00').toLocaleDateString('es-AR', {weekday:'long', day:'numeric', month:'long'}));
const fmtDT = t => new Date(t).toLocaleString('es-AR', {dateStyle:'short', timeStyle:'short'});
const fmtH = t => new Date(t).toLocaleTimeString('es-AR', {hour:'2-digit', minute:'2-digit'});
const pesos = n => '$ ' + Number(n).toLocaleString('es-AR');
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const horas = (a, b) => { const r = []; for (let h = a; h < b; h++) r.push(z(h) + ':00'); return r; };

/* ===================== Íconos (SVG de línea) ===================== */
const IP = {
  home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>',
  calendar:'<rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M16 2.5v4M8 2.5v4M3 10h18"/>',
  ticket:'<path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h15A1.5 1.5 0 0 1 21 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5V14a2 2 0 0 0 0-4z"/><path d="M14 6v12" stroke-dasharray="2 2.5"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
  chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.8A8 8 0 1 1 21 12z"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.4M12 17v.5"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2 .7 3.5 2.8 3.5 6"/>',
  card:'<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h4"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  megaphone:'<path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M17 8.5a5 5 0 0 1 0 7"/>',
  building:'<path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16"/><path d="M15 9h4a1 1 0 0 1 1 1v11M2 21h20M8 8h3M8 12h3M8 16h3"/>',
  shield:'<path d="M12 3 4.5 6v6c0 4.5 3.2 8 7.5 9 4.3-1 7.5-4.5 7.5-9V6z"/><path d="m9 12 2 2 4-4"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  logout:'<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5M5 12h11"/>',
  chevron:'<path d="m9 6 6 6-6 6"/>',
  back:'<path d="m15 6-6 6 6 6"/>',
  flame:'<path d="M12 21c-4 0-7-2.8-7-6.6 0-3.4 2.6-5.6 4-8.4.6 2 1.8 3 3 3.4C12 6.5 13 4.5 14.5 3c.5 3 4.5 5.5 4.5 11.4 0 3.8-3 6.6-7 6.6z"/>',
  ball:'<circle cx="12" cy="12" r="9"/><path d="m12 7.5 3.8 2.8-1.4 4.5H9.6l-1.4-4.5z"/><path d="M12 3v4.5M20.6 9.5l-4.8.8M17.3 19.3l-2.9-4.5M6.7 19.3l2.9-4.5M3.4 9.5l4.8.8"/>',
  racket:'<ellipse cx="10" cy="9" rx="6" ry="6.5"/><path d="m14.2 13.8 6.3 6.3"/><path d="M7 7h.01M10 6h.01M13 8h.01M8 10.5h.01M11 11h.01"/>',
  volley:'<circle cx="12" cy="12" r="9"/><path d="M12 3c-1.5 4-1 8.5 3.5 12.5M3.6 9.5c4.2-.3 8.6 1.5 11 6.2M20.6 10.5c-3.8 1-6.8 4-7.8 10.3"/>',
  waves:'<path d="M2 16c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/><path d="M2 20.5c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/><path d="M8.5 13V5.5a2 2 0 0 1 4 0M15.5 13V5.5a2 2 0 0 0-3-1.7M8.5 9h7"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  checkcircle:'<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>',
  alert:'<path d="M10.3 4 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0z"/><path d="M12 9.5v4M12 17v.5"/>',
  xcircle:'<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
  download:'<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>',
  qr:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20.5 14v.01M14 20.5h.01M17 20.5h3.5V17"/>',
  idcard:'<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><circle cx="8.5" cy="11" r="2.2"/><path d="M5.5 16c.5-1.7 1.6-2.5 3-2.5s2.5.8 3 2.5M14 10h4.5M14 13.5h3"/>',
  cloud:'<path d="M7 16.5a4.5 4.5 0 1 1 .9-8.9A6 6 0 0 1 19.5 9.5 3.5 3.5 0 0 1 18 16.5z"/><path d="m10 19-1 2M14 19l-1 2"/>',
  wrench:'<path d="M14.7 6.3a4 4 0 0 0 5 5l-8.2 8.2a2.1 2.1 0 0 1-3-3z"/><path d="M14.7 6.3 17 4l3 3-2.3 2.3"/>',
  camera:'<path d="M4 7.5h3l1.5-2h7l1.5 2h3v12H4z"/><circle cx="12" cy="13" r="3.5"/>',
  door:'<path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17M3 21h18M15 12h.01"/>',
  chart:'<path d="M4 20V11M10 20V5M16 20v-6M21 20H3"/>',
  doc:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  pin:'<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  money:'<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9.5v.01M18 14.5v.01"/>',
  key:'<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l3 3"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  book:'<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20v-3"/>',
  bell:'<path d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'
};
const ico = (n, s) => `<svg class="i" width="${s || 20}" height="${s || 20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IP[n] || ''}</svg>`;
const ICONK = new Proxy({f1:'ball', f2:'ball', pd:'racket', vo:'volley', pi:'waves'}, {get:(o, k) => o[k] || (String(k)[0] === 'q' ? 'flame' : 'ticket')});
const ICON = new Proxy({}, {get:(o, k) => `<span class="ii">${ico(ICONK[k])}</span>`});
const ICON_T = {Quincho:'flame', Cancha:'ball', Pileta:'waves'};
/* Fotos reales del complejo (carpeta fotos/) */
const GALERIA = [['pileta-1', 'Pileta con juegos de agua'], ['pileta-2', 'Toboganes'], ['pileta-3', 'Pileta y juegos infantiles'], ['quincho', 'Quincho con asador'], ['cancha-futbol', 'Cancha de fútbol'], ['cancha-voley', 'Cancha de vóley'], ['predio', 'El predio'], ['estacionamiento', 'Estacionamiento techado']];
const FOTO_T = {Quincho:'quincho', Cancha:'cancha-futbol', Pileta:'pileta-1'};
const FOTO_I = new Proxy({f1:'cancha-futbol', f2:'cancha-futbol', vo:'cancha-voley', pi:'pileta-3'}, {get:(o, k) => o[k] || (String(k)[0] === 'q' ? 'quincho' : undefined)});
const foto = n => 'fotos/' + n + '.jpg';
function tarifasLista() {
  const T = S.tarifas, q = S.inst.filter(i => i.tipo === 'Quincho'), qc = q.find(i => capN(i) <= 20), qg = q.find(i => capN(i) > 20);
  return [['Entrada adulto (desde 13 años)', pesos(T.adulto)], ['Entrada menor (6 a 12 años)', pesos(T.menor)], ['Menores de 6 años', 'Sin cargo'], ['Auto o camioneta', pesos(T.auto)], ['Moto', pesos(T.moto)],
    ...(qc ? [[`Quincho (hasta ${capN(qc)} personas)`, pesos(qc.tarifa) + ' por turno']] : []), ...(qg ? [[`Quincho grande (hasta ${capN(qg)} personas)`, pesos(qg.tarifa) + ' por turno']] : []),
    ...S.inst.filter(i => i.tipo === 'Cancha').map(i => [i.nombre, pesos(i.tarifa) + ' por hora'])];
}
const galeria = () => `<div class="galeria">${GALERIA.map(([f, c]) => `<button data-act="verfoto" data-f="${f}" aria-label="${esc(c)}"><img src="${foto(f)}" alt="${esc(c)}" loading="lazy"><span>${esc(c)}</span></button>`).join('')}</div>`;

/* ===================== Datos de ejemplo ===================== */
const INFO = {
  horarios: 'Martes a domingo de 9 a 22 h. Los lunes el complejo permanece cerrado por mantenimiento. Atención administrativa: martes a viernes de 9 a 13 h.',
  ubicacion: 'Complejo Policial Almudena, Salta Capital. (Cargar aquí la dirección exacta y el enlace a Google Maps.)',
  requisitos: ['Ser socio activo o integrante del grupo familiar habilitado.', 'Presentar el código QR de la reserva o la credencial de socio junto con el DNI.', 'Los invitados deben ingresar acompañados por el socio titular.', 'Para la pileta: revisación médica vigente.'],
  reglamento: ['Respetar el horario reservado; la tolerancia es de 15 minutos.', 'Cancelar con al menos 24 h de anticipación para liberar el turno.', 'No se permite el ingreso de mascotas.', 'El socio titular es responsable por daños en las instalaciones.', 'Prohibido el consumo de bebidas alcohólicas en canchas y pileta.']
};

const FAQ = [
  ['¿Con cuánta anticipación puedo reservar?', 'Hasta 30 días antes. Los turnos se liberan automáticamente cuando alguien cancela.'],
  ['¿Cómo se cobra la entrada?', 'Por persona (adultos y menores de 6 a 12 años; los menores de 6 no pagan) y por vehículo. Al reservar ves el total antes de pagar.'],
  ['¿Cuántas reservas puedo tener?', 'Una por día y horario.'],
  ['¿Cómo cancelo una reserva?', 'En “Mis reservas”, tocá “Cancelar”. Te pedimos hacerlo con 24 h de anticipación.'],
  ['¿Qué pasa si llueve?', 'Si hay alerta meteorológica se publica un aviso y las reservas al aire libre se reprograman sin costo.'],
  ['¿Pueden ir mis familiares?', 'Sí, los integrantes del grupo familiar habilitado. Podés solicitar altas desde “Mi familia”.'],
  ['¿Dónde y cómo pago?', 'Por ahora en la administración del complejo. Más adelante se podrá pagar online.'],
  ['¿Qué presento en la entrada?', 'El código QR de tu reserva (desde el celular o impreso) y tu DNI.']
];
const PAGO = {alias:'ALMUDENA.RESERVAS', cbu:'0000003100012345678901', titular:'Div. Complejo Pol. Almudena', plazo:'hasta 48 h antes del turno'};
const badgePago = p => ({pendiente:'<span class="badge b-amarillo"><i class="dot"></i>Pago pendiente</span>', informado:'<span class="badge b-azul"><i class="dot"></i>Pago en revisión</span>', confirmado:'<span class="badge b-verde"><i class="dot"></i>Pagado</span>', rechazado:'<span class="badge b-rojo"><i class="dot"></i>Pago rechazado</span>'}[p || 'pendiente']);
const icoPago = p => `<i class="dot d-${({pendiente:'amarillo', informado:'azul', confirmado:'verde', rechazado:'rojo'})[p || 'pendiente']}"></i>`;
function botonesPago(r) {
  let b = '';
  if (r.pagoInfo && r.pagoInfo.img) b += `<button class="btn-sm" data-act="pimg" data-id="${r.id}">Ver comprobante</button> `;
  if (r.pago === 'informado') b += `<button class="btn-sm ok" data-act="pconf" data-id="${r.id}">${ico('check', 16)} Confirmar</button> <button class="btn-sm rojo" data-act="prech" data-id="${r.id}">Rechazar</button>`;
  if ((r.pago === 'pendiente' || r.pago === 'rechazado') && r.estado !== 'cancelada') b += `<button class="btn-sm" data-act="pefec" data-id="${r.id}">Cobrado en efectivo</button>`;
  return b;
}
const unidad = i => i.tipo === 'Cancha' ? 'por hora' : i.tipo === 'Pileta' ? 'por grupo y turno' : 'por turno';
const maskDni = d => String(d).length > 4 ? String(d).slice(0, 2) + '.***.' + String(d).slice(-3) : '***';

function seed() {
  const FR = ['Mediodía 11–16 h', 'Tarde 16–20 h', 'Noche 20–01 h'];
  const inst = [];
  // 21 quinchos (según la vista satelital): 14 + quincho grande + 6
  for (let i = 0; i < 21; i++) {
    const g = i === 14, n = i < 14 ? i + 1 : i;
    inst.push({id: g ? 'qg' : 'q' + n, tipo:'Quincho', nombre: g ? 'Quincho grande' : 'Quincho ' + n, cap: g ? 'Hasta 40 personas' : 'Hasta 15 personas', capN: g ? 40 : 15, turnos:FR, cupo:1, tarifa: g ? 30000 : 15000, activo:true, pos:i});
  }
  inst.push(
    {id:'f1', tipo:'Cancha', nombre:'Fútbol 5 – Cancha 1', cap:'10 jugadores', turnos:horas(9,22), cupo:1, tarifa:12000, activo:true},
    {id:'f2', tipo:'Cancha', nombre:'Fútbol 5 – Cancha 2', cap:'10 jugadores', turnos:horas(9,22), cupo:1, tarifa:12000, activo:true},
    {id:'pd', tipo:'Cancha', nombre:'Pádel', cap:'4 jugadores', turnos:horas(9,22), cupo:1, tarifa:8000, activo:true},
    {id:'vo', tipo:'Cancha', nombre:'Vóley', cap:'12 jugadores', turnos:horas(9,22), cupo:1, tarifa:5000, activo:true},
    {id:'pi', tipo:'Pileta', nombre:'Pileta (temporada)', cap:'Incluida con la entrada', turnos:['Mediodía 11–16 h', 'Tarde 16–20 h'], cupo:40, tarifa:0, activo:true});
  const padron = [
    {nro:'1001', dni:'30111222', nombre:'Juan Pérez'},
    {nro:'1002', dni:'28999111', nombre:'Ana Gómez'},
    {nro:'1003', dni:'33444555', nombre:'Carlos Ruiz'},
    {nro:'1004', dni:'35666777', nombre:'Laura Díaz'}
  ];
  const socios = [
    {nro:'1001', dni:'30111222', nombre:'Juan Pérez', email:'juan.perez@ejemplo.com', pass:'1234', alta:Date.now(),
      grupo:[{nombre:'María López', parentesco:'Cónyuge', dni:'31222333', estado:'habilitado'}, {nombre:'Tomás Pérez', parentesco:'Hijo', dni:'50111222', estado:'habilitado'}]},
    {nro:'1002', dni:'28999111', nombre:'Ana Gómez', email:'ana.gomez@ejemplo.com', pass:'1234', alta:Date.now(), grupo:[]}
  ];
  const reservas = [];
  const t0 = hoy();
  let n = 0;
  for (let i = -75; i <= 12; i++) {
    const f = addDays(t0, i);
    inst.forEach((it, ii) => {
      it.turnos.forEach((tu, ti) => {
        let cant = 0;
        if (it.cupo > 1) cant = (Math.abs(i * 7 + ti * 5) % 9) + 3;
        else cant = (Math.abs(i * 31 + ii * 17 + ti * 13) % 10) < (i < 0 ? 5 : 3) ? 1 : 0;
        for (let k = 0; k < cant; k++) {
          n++;
          const pasado = i < 0 || (i === 0 && inicioTurno(tu) <= new Date().getHours());
          const cancel = pasado && n % 11 === 0;
          reservas.push({id:'r' + n, codigo:'ALM-D' + z(Math.floor(n / 100) % 100) + '-' + String(n).padStart(4, '0'), socio:String(1100 + (n * 37) % 800),
            instId:it.id, fecha:f, turno:tu, estado: cancel ? 'cancelada' : (pasado ? 'utilizada' : 'confirmada'),
            creada:new Date(addDays(f, -3) + 'T10:00').getTime(), ingreso: pasado && !cancel ? new Date(f + 'T' + z(inicioTurno(tu)) + ':05').getTime() : null});
        }
      });
    });
  }
  const now = Date.now();
  const noticias = [
    {id:'n1', tipo:'Comunicado', titulo:'Nuevo sistema de reservas online', texto:'Desde ahora los socios pueden reservar quinchos, canchas y la pileta desde el celular o la computadora, sin necesidad de llamar.', fecha:now - 86400000 * 2},
    {id:'n2', tipo:'Mantenimiento', titulo:'Pádel: mantenimiento de la superficie', texto:'La cancha de pádel permanecerá cerrada el próximo lunes por recambio de césped sintético.', fecha:now - 86400000},
    {id:'n3', tipo:'Evento', titulo:'Torneo interno de fútbol 5', texto:'Inscripciones abiertas hasta fin de mes en la administración del complejo. Categorías libre y +40.', fecha:now - 86400000 * 3},
    {id:'n4', tipo:'Clima', titulo:'Alerta por tormentas', texto:'Ante alertas meteorológicas se podrán suspender las actividades al aire libre. Las reservas afectadas se reprograman sin costo.', fecha:now - 3600000 * 5},
    {id:'n6', tipo:'Reglamento', titulo:'Reglamento interno del complejo', texto:'Rige para todos los socios, familiares e invitados. Podés descargarlo desde Información → Reglamento del complejo.', fecha:now - 86400000 * 10},
    {id:'n7', tipo:'Documentación', titulo:'Formulario de alta de grupo familiar', texto:'Para habilitar a un familiar se debe presentar copia del DNI y la documentación que acredite el parentesco en la administración.', fecha:now - 86400000 * 12},
    {id:'n5', tipo:'Promoción', titulo:'Pileta: abono de temporada', texto:'Los grupos familiares que abonen la temporada completa antes del 15 de diciembre tienen un 15 % de descuento.', fecha:now - 86400000 * 4}
  ];
  const s = {inst, padron, socios, reservas, noticias, auditoria:[], tarifas:{adulto:3000, menor:1500, auto:2000, moto:1000}, staff:[{user:'admin', pass:'admin', rol:'admin', nombre:'Administración'}, {user:'porteria', pass:'1234', rol:'porteria', nombre:'Personal de portería'}]};
  // reserva del socio demo
  const f3 = addDays(t0, 3);
  s.reservas = s.reservas.filter(r => !(r.instId === 'q2' && r.fecha === f3 && r.turno === 'Noche 20–01 h'));
  s.reservas.push({id:'r-demo', codigo:'ALM-7KQ4-X9TP', socio:'1001', instId:'q2', fecha:f3, turno:'Noche 20–01 h', estado:'confirmada', creada:now - 86400000, ingreso:null, pago:'pendiente', visita:true, pers:{a:4, m:2, b:1}, veh:{auto:2, moto:0}, monto:15000 + 4 * 3000 + 2 * 1500 + 2 * 2000});
  s.reservas.forEach((r, k) => {
    const it = inst.find(i => i.id === r.instId);
    if (it.tipo === 'Quincho' && !r.visita) { r.visita = true; r.pers = {a:2 + k % 9, m:k % 3, b:k % 2}; r.veh = {auto:1 + k % 2, moto:k % 5 === 0 ? 1 : 0}; r.monto = it.tarifa + r.pers.a * 3000 + r.pers.m * 1500 + r.veh.auto * 2000 + r.veh.moto * 1000; }
    else if (r.monto == null) r.monto = it.tarifa;
    if (r.pago) return;
    r.pago = r.estado === 'cancelada' ? 'pendiente' : r.estado === 'utilizada' ? 'confirmado' : ['confirmado', 'pendiente', 'confirmado', 'confirmado', 'informado', 'confirmado', 'confirmado', 'confirmado'][k % 8];
    if (r.pago === 'informado' && r.fecha > addDays(hoy(), 4)) r.pago = 'confirmado';
    if (r.pago === 'pendiente' && k % 16 !== 1) r.pago = 'confirmado';
    if (r.pago !== 'pendiente') r.pagoInfo = {metodo: k % 3 === 0 ? 'Efectivo en administración' : k % 2 ? 'Transferencia' : 'Mercado Pago', operacion: k % 3 === 0 ? '' : String(40000000 + (k * 7919) % 59999999), t: r.creada + 3600000, img: null};
    if (r.pago === 'confirmado') r.pagoConf = {t: r.creada + 7200000, usuario: 'admin'};
  });
  s.auditoria.push({t:now, usuario:'sistema', accion:'Base de datos de ejemplo inicializada'});
  return s;
}
function inicioTurno(t) { const m = t.match(/(\d{1,2})/); return m ? +m[1] : 0; }

/* ===================== Estado ===================== */
let S;
function load() { try { const raw = localStorage.getItem(KEY); if (raw) { S = JSON.parse(raw); return; } } catch (e) {} S = seed(); save(); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
let ses = null;
const uiInicial = () => ({acceso: MODO === 'admin' ? 'login' : 'sitio', view:'', mes:hoy().slice(0, 7), wiz:{paso:1}, verCal:false, mtab:'prox', ntipo:'', chat:[], validacion:null, f:null, msg:null, q:''});
let ui = uiInicial();

const ENTRADA = {id:null, tipo:'Entrada', nombre:'Entrada general', cap:'', turnos:[], cupo:9999, tarifa:0, activo:true};
const getInst = id => id ? (S.inst.find(i => i.id === id) || {nombre:'?', tipo:'?', turnos:[], cupo:1}) : ENTRADA;
const instNombre = id => getInst(id).nombre;
const socioActual = () => S.socios.find(s => s.nro === ses.nro);
const NOMS = ['Martín','Lucía','Diego','Carolina','Jorge','Valeria','Pablo','Romina','Sergio','Natalia','Gustavo','Florencia','Ricardo','Paola','Marcelo','Silvina','Fernando','Daniela','Héctor','Gabriela'];
const APES = ['Gómez','Fernández','Rodríguez','López','Martínez','Guzmán','Cruz','Mamaní','Flores','Sosa','Romero','Vargas','Aguirre','Choque','Díaz','Ruiz','Ortiz','Tolaba','Quispe','Herrera'];
const nombreSocio = nro => { const s = S.socios.find(x => x.nro === nro) || S.padron.find(x => x.nro === nro); if (s) return s.nombre; const n = parseInt(nro, 10) || 0; return NOMS[n % NOMS.length] + ' ' + APES[(n * 7 + 3) % APES.length]; };
const usuarioLog = () => ses ? (ses.rol === 'socio' ? 'Socio ' + ses.nro : ses.user) : 'anónimo';
function log(accion) { S.auditoria.push({t:Date.now(), usuario:usuarioLog(), accion}); save(); }
const ocup = (instId, fecha, turno, exceptoId) => S.reservas.filter(r => r.instId === instId && r.fecha === fecha && r.turno === turno && r.estado !== 'cancelada' && r.id !== exceptoId).length;
function turnoPasado(f, t) { const h = hoy(); if (f < h) return true; if (f > h) return false; return inicioTurno(t) <= new Date().getHours(); }
function estadoDia(inst, f) {
  if (f < hoy()) return 'pasado';
  if (f > addDays(hoy(), 30)) return 'fuera';
  if (!inst.activo) return 'cerrado';
  const libres = inst.turnos.filter(t => !turnoPasado(f, t) && ocup(inst.id, f, t) < inst.cupo).length;
  if (!libres) return 'lleno';
  return libres < inst.turnos.length ? 'parcial' : 'libre';
}
function genCodigo() {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c;
  do {
    const v = new Uint32Array(8); crypto.getRandomValues(v);
    const p = Array.from(v, x => A[x % A.length]).join('');
    c = 'ALM-' + p.slice(0, 4) + '-' + p.slice(4);
  } while (S.reservas.some(r => r.codigo === c));
  return c;
}
function crearReserva(nro, instId, fecha, turno, porAdmin, efectivo) {
  const inst = getInst(instId);
  if (!S.socios.some(s => s.nro === nro) && !S.padron.some(s => s.nro === nro)) return {error:'El número de socio no existe en el padrón.'};
  if (!inst.activo) return {error:'La instalación está suspendida por mantenimiento.'};
  if (turnoPasado(fecha, turno)) return {error:'No se puede reservar una fecha u horario pasado.'};
  if (!porAdmin && fecha > addDays(hoy(), 30)) return {error:'Se puede reservar con hasta 30 días de anticipación.'};
  if (ocup(instId, fecha, turno) >= inst.cupo) return {error:'Ese horario acaba de ser ocupado. Elegí otro.'};
  const dup = S.reservas.find(r => r.socio === nro && r.fecha === fecha && r.estado === 'confirmada' && getInst(r.instId).tipo === inst.tipo);
  if (dup) return {error:`Ya existe una reserva de ${inst.tipo.toLowerCase()} para ese día (${instNombre(dup.instId)}, ${dup.turno}). Se permite una por tipo y por día.`};
  const r = {id:'r' + Date.now().toString(36), codigo:genCodigo(), socio:nro, instId, fecha, turno, estado:'confirmada', creada:Date.now(), ingreso:null, monto:inst.tarifa, pago:'pendiente'};
  if (efectivo) { r.pago = 'confirmado'; r.pagoInfo = {metodo:'Efectivo en administración', operacion:'', t:Date.now(), img:null}; r.pagoConf = {t:Date.now(), usuario:usuarioLog()}; }
  S.reservas.push(r);
  log(`${porAdmin ? 'Alta manual de' : 'Nueva'} reserva ${r.codigo}: ${inst.nombre}, ${fmtF(fecha)} ${turno} (socio ${nro})`);
  return {r};
}

/* ===================== UI helpers ===================== */
function toast(msg, tipo) { const t = $('#toast'); t.textContent = msg; t.className = 'show ' + (tipo || ''); clearTimeout(t._h); t._h = setTimeout(() => t.className = '', 3200); }
function showModal(html) { $('#modalCaja').innerHTML = html; $('#modal').classList.add('open'); pintarQR(); }
function closeModal() { $('#modal').classList.remove('open'); }
function qrSvg(text) {
  try { if (typeof qrcode === 'function') { const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({cellSize:6, margin:2, scalable:true}); } } catch (e) {}
  return '<div class="qr-fallback">QR: ' + esc(text) + '<br><small>(sin conexión: no se pudo dibujar el QR)</small></div>';
}
function pintarQR() { document.querySelectorAll('[data-qr]').forEach(el => { if (!el.innerHTML) el.innerHTML = qrSvg(el.dataset.qr); }); }
const badgeEstado = e => ({confirmada:'<span class="badge b-verde">Confirmada</span>', utilizada:'<span class="badge b-azul">Utilizada</span>', cancelada:'<span class="badge b-rojo">Cancelada</span>'}[e] || e);
const TIPOS_NOT = ['Comunicado','Novedad','Evento','Promoción','Mantenimiento','Clima','Reglamento','Documentación'];
const badgeNot = t => `<span class="badge ${['Mantenimiento','Clima'].includes(t) ? 'b-amarillo' : ['Evento','Promoción'].includes(t) ? 'b-verde' : 'b-azul'}">${esc(t)}</span>`;
function bars(data) {
  const max = Math.max(1, ...data.map(d => d[1]));
  return data.map(([l, v]) => `<div class="barra"><span>${esc(l)}</span><div class="bg"><div class="fg" style="width:${v / max * 100}%"></div></div><b>${v}</b></div>`).join('');
}

/* ===================== Correos (simulados en el prototipo) ===================== */
const REMITENTE = 'Complejo Policial Almudena <no-responder@complejoalmudena.gob.ar>';
const enmascarar = e => { const [u, d] = String(e).split('@'); return d ? u.slice(0, 2) + '•••@' + d : e; };
function nuevoToken(nro, tipo) {
  const v = new Uint32Array(4); crypto.getRandomValues(v);
  const tk = Array.from(v, x => x.toString(36)).join('');
  S.tokens = S.tokens || {};
  S.tokens[tk] = {nro, tipo, exp:Date.now() + 30 * 60000, usado:false};
  return tk;
}
const CC = () => window.CONFIG_CORREO || {};
const usaGAS = () => !!CC().appsScriptUrl;
const correoReal = () => { const c = CC(); return usaGAS() || !!(c.serviceId && c.templateId && c.publicKey && window.emailjs); };
function enviarReal(c) {
  if (!correoReal()) { c.estadoEnvio = 'simulado'; return; }
  c.estadoEnvio = 'enviando';
  const html = c.html.replace(/data-act="[^"]*"/g, '').replace(/data-tk="[^"]*"/g, '');
  const texto = html.replace(/<br\s*\/?>/g, '\n').replace(/<\/p>/g, '\n\n').replace(/<[^>]+>/g, '').replace(/\n{3,}/g, '\n\n').trim();
  if (usaGAS()) {
    fetch(CC().appsScriptUrl, {method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({clave:CC().clave, to:c.para, subject:c.asunto, html, text:texto})})
      .then(() => { c.estadoEnvio = 'enviado'; save(); })
      .catch(err => { c.estadoEnvio = 'error'; c.errorEnvio = String(err && err.message || err); save(); });
    return;
  }
  window.emailjs.send(CC().serviceId, CC().templateId, {to_email:c.para, subject:c.asunto, message_html:html, message:texto}, {publicKey:CC().publicKey})
    .then(() => { c.estadoEnvio = 'enviado'; save(); })
    .catch(err => { c.estadoEnvio = 'error'; c.errorEnvio = (err && (err.text || err.message)) || 'error'; save(); S.auditoria.push({t:Date.now(), usuario:'sistema', accion:`No se pudo enviar el correo a ${enmascarar(c.para)}: ${c.errorEnvio}`}); save(); });
}
function enviarCorreo(para, asunto, html, extra) {
  S.correos = S.correos || [];
  const c = {id:'m' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), para, asunto, html, t:Date.now(), ...(extra || {})};
  enviarReal(c);
  S.correos.push(c); if (S.correos.length > 50) S.correos.shift();
  S.auditoria.push({t:Date.now(), usuario:'sistema', accion:`Correo enviado a ${enmascarar(para)}: ${asunto}`}); save();
  return c;
}
const linkReset = tk => location.href.split('#')[0] + '#reset=' + tk;
function verCorreo(id) {
  const c = (S.correos || []).find(x => x.id === id); if (!c) return;
  showModal(`<div class="mail"><div class="mail-top"><span class="badge b-gris">Vista previa · demostración</span></div>
    <div class="mail-h"><div class="avatar sm">${ico('shield', 16)}</div><div><b>${esc(c.asunto)}</b><small>De: ${esc(REMITENTE)}<br>Para: ${esc(c.para)} · ${fmtDT(c.t)}</small></div></div>
    <div class="mail-body">${c.html}</div></div>
    <p class="tiny" style="text-align:left">En la versión final este correo llega a la casilla del socio. Acá se muestra para poder probar el recorrido.</p>
    <div class="acciones"><button class="btn ghost" data-act="cerrar">Cerrar</button></div>`);
}
function plantillaCorreo(titulo, parrafos, boton) {
  return `<div class="mail-card"><div class="mail-brand">${ico('shield', 18)} Complejo Policial Almudena</div><h2>${titulo}</h2>${parrafos.map(p => `<p>${p}</p>`).join('')}${boton ? `<p style="text-align:center;margin:22px 0"><a class="mail-btn" href="${boton.href}" ${boton.act ? `data-act="${boton.act}" data-tk="${boton.tk}"` : 'target="_blank" rel="noopener"'}>${boton.txt}</a></p>` : ''}<p class="mail-pie">Si no pediste esto, ignorá este mensaje. Tu cuenta sigue segura.<br>Este es un correo automático, no lo respondas.</p></div>`;
}

/* ===================== Reserva de visita (por etapas) ===================== */
const FRANJAS = [
  {id:'mediodia', t:'Mediodía', h:'11 a 16 h', turno:'Mediodía 11–16 h', desde:11, hasta:16, ic:'flame'},
  {id:'tarde', t:'Tarde', h:'16 a 20 h', turno:'Tarde 16–20 h', desde:16, hasta:20, ic:'clock'},
  {id:'noche', t:'Noche', h:'20 a 01 h', turno:'Noche 20–01 h', desde:20, hasta:25, ic:'clock'}
];
const franja = id => FRANJAS.find(f => f.id === id);
const quinchos = () => S.inst.filter(i => i.tipo === 'Quincho').sort((a, b) => (a.pos || 0) - (b.pos || 0));
const capN = i => i.capN || parseInt(String(i.cap).replace(/\D/g, ''), 10) || 15;
const totPers = p => (p.a || 0) + (p.m || 0) + (p.b || 0);
const persTxt = p => { if (!p) return ''; const x = []; if (p.a) x.push(p.a + (p.a > 1 ? ' adultos' : ' adulto')); if (p.m) x.push(p.m + (p.m > 1 ? ' menores' : ' menor')); if (p.b) x.push(p.b + (p.b > 1 ? ' niños menores de 6' : ' niño menor de 6')); return x.join(', '); };
const vehTxt = v => { if (!v || (!v.auto && !v.moto)) return 'Sin vehículo'; const x = []; if (v.auto) x.push(v.auto + (v.auto > 1 ? ' autos/camionetas' : ' auto/camioneta')); if (v.moto) x.push(v.moto + (v.moto > 1 ? ' motos' : ' moto')); return x.join(', '); };
function quinchosLibres(f, fr) { const t = franja(fr).turno; if (turnoPasado(f, t)) return 0; return quinchos().filter(q => q.activo && !ocup(q.id, f, t)).length; }
function estadoVisita(f) {
  if (f < hoy()) return 'pasado';
  if (f > addDays(hoy(), 30)) return 'fuera';
  const fr = FRANJAS.filter(x => !turnoPasado(f, x.turno));
  if (!fr.length) return 'pasado';
  const tot = fr.length * quinchos().filter(q => q.activo).length;
  const lib = fr.reduce((a, x) => a + quinchosLibres(f, x.id), 0);
  return !lib ? 'lleno' : lib / tot < 0.35 ? 'parcial' : 'libre';
}
function horasCancha(c, f, fr) { const F = franja(fr); return c.turnos.filter(t => { const h = inicioTurno(t); return h >= F.desde && h < Math.min(F.hasta, 22); }); }
function cotizar(w) {
  const T = S.tarifas, p = w.pers || {a:0}, v = w.veh || {}, it = [];
  if (p.a) it.push(['Adultos', p.a, T.adulto]);
  if (p.m) it.push(['Menores de 6 a 12 años', p.m, T.menor]);
  if (p.b) it.push(['Menores de 6 años', p.b, 0]);
  if (w.conVeh && v.auto) it.push(['Autos / camionetas', v.auto, T.auto]);
  if (w.conVeh && v.moto) it.push(['Motos', v.moto, T.moto]);
  if (w.quincho) it.push([instNombre(w.quincho), 1, getInst(w.quincho).tarifa]);
  if (w.cancha) it.push([instNombre(w.cancha.id) + ' · ' + w.cancha.hora, 1, getInst(w.cancha.id).tarifa]);
  return {items:it, total:it.reduce((s, [, c, pr]) => s + c * pr, 0)};
}
function hijos(r) { return S.reservas.filter(x => x.padre === r.id); }
function propagar(r) { hijos(r).forEach(h => { h.pago = r.pago; h.pagoConf = r.pagoConf; h.estado = r.estado; if (r.ingreso) h.ingreso = r.ingreso; }); }
function crearVisita(w) {
  const nro = ses.nro, t = franja(w.franja).turno;
  if (turnoPasado(w.dia, t)) return {error:'Ese horario ya comenzó. Elegí otro.'};
  if (S.reservas.some(r => r.socio === nro && r.visita && r.fecha === w.dia && r.turno === t && r.estado === 'confirmada')) return {error:'Ya tenés una reserva para ese día y horario.'};
  if (w.quincho && ocup(w.quincho, w.dia, t)) return {error:'Ese quincho se acaba de ocupar. Elegí otro en el mapa.', paso:3};
  if (w.cancha && ocup(w.cancha.id, w.dia, w.cancha.hora)) return {error:'Ese horario de cancha se acaba de ocupar.', paso:3};
  const c = cotizar(w), now = Date.now();
  const r = {id:'v' + now.toString(36), codigo:genCodigo(), socio:nro, instId:w.quincho || null, fecha:w.dia, turno:t, estado:'confirmada', creada:now, ingreso:null,
    visita:true, pers:{...w.pers}, veh:w.conVeh ? {...w.veh} : {auto:0, moto:0}, detalle:c.items, monto:c.total, pago:'pendiente'};
  S.reservas.push(r);
  if (w.cancha) S.reservas.push({id:r.id + 'c', codigo:r.codigo + '-C', socio:nro, instId:w.cancha.id, fecha:w.dia, turno:w.cancha.hora, estado:'confirmada', creada:now, ingreso:null, padre:r.id, monto:0, pago:'pendiente'});
  log(`Nueva reserva ${r.codigo}: ${fmtF(w.dia)} ${t}, ${persTxt(r.pers)}, ${vehTxt(r.veh)}${w.quincho ? ', ' + instNombre(w.quincho) : ''}${w.cancha ? ', ' + instNombre(w.cancha.id) + ' ' + w.cancha.hora : ''} — ${pesos(r.monto)}`);
  return {r};
}

/* Mapa del predio: modo 'info' (ilustrativo) o 'reserva' (elegir quincho/cancha) */
function mapaPredio(modo) {
  const R = modo === 'reserva', w = ui.wiz || {}, F = R && franja(w.franja), t = F && F.turno;
  const pers = R ? totPers(w.pers || {}) : 0;
  const lbl = (x, y, s, cls) => `<text class="z-lbl ${cls || ''}" x="${x}" y="${y}">${s}</text>`;
  const zi = (k, inner) => R ? `<g class="zona-r">${inner}</g>` : `<g class="zona${ui.zona === k ? ' sel' : ''}" data-act="zona" data-z="${k}" tabindex="0" role="button" aria-label="${ZONAS[k].t}">${inner}</g>`;
  // quinchos
  const QL = quinchos(), unid = QL.reduce((s, q) => s + (capN(q) > 20 ? 2 : 1), 0);
  const uw = R ? (920 - (QL.length - 1) * 5 - 14) / unid : 19;
  let x = R ? 40 : 230, qs = '';
  QL.forEach((q, i) => {
    const ancho = R ? uw * (capN(q) > 20 ? 2 : 1) : (capN(q) > 20 ? 40 : 19), alto = R ? 32 : 16, y = R ? 500 : 508;
    const num = q.nombre.replace('Quincho ', '').replace('grande', 'G');
    if (R) {
      const st = !q.activo ? 'mant' : w.quincho === q.id ? 'sel' : ocup(q.id, w.dia, t) ? 'ocu' : capN(q) < pers ? 'chico' : 'lib';
      const est = {mant:'En mantenimiento', sel:'Tu elección', ocu:'Ocupado', chico:'Capacidad ' + capN(q) + ' personas', lib:'Libre · hasta ' + capN(q) + ' personas'}[st];
      qs += `<g class="q st-${st}" ${['lib', 'sel'].includes(st) ? `data-act="wq" data-id="${q.id}" role="button" tabindex="0"` : ''}><title>${q.nombre}: ${est}</title><rect x="${x}" y="${y}" width="${ancho}" height="${alto}" rx="4"/><text x="${x + ancho / 2}" y="${y + 21}">${num}</text></g>`;
    } else qs += `<rect x="${x}" y="${y}" width="${ancho}" height="${alto}" rx="2" class="techo"/>`;
    x += ancho + (R ? 5 : 4); if (i === 13) x += R ? 14 : 12;
  });
  const fila = R ? `<g>${qs}</g>${lbl(500, 494, 'Quinchos · tocá uno libre para elegirlo')}` : zi('quinchos', `<rect x="224" y="500" width="${x - 218}" height="31" rx="6" class="z-base z-fila"/>${qs}${lbl(500, 497, 'Quinchos')}`);
  // canchas reservables
  const cz = (id, rx, ry, rw, rh, nombre) => {
    if (!R) return '';
    const c = getInst(id), hs = horasCancha(c, w.dia, w.franja), libres = hs.filter(h => !turnoPasado(w.dia, h) && !ocup(id, w.dia, h)).length;
    const st = !c.activo ? 'mant' : (w.cancha && w.cancha.id === id) ? 'sel' : ui.canSel === id ? 'abierta' : libres ? 'lib' : 'ocu';
    return `<g class="cz st-${st}" ${st !== 'mant' && st !== 'ocu' ? `data-act="wcan" data-id="${id}" role="button" tabindex="0"` : ''}><title>${nombre}: ${libres ? libres + ' horarios libres' : 'sin horarios'}</title><rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="3"/><line x1="${rx + rw / 2}" y1="${ry}" x2="${rx + rw / 2}" y2="${ry + rh}"/><text x="${rx + rw / 2}" y="${ry + rh / 2 + 5}">${nombre}</text></g>`;
  };
  let arboles = ''; for (let i = 0; i < 40; i++) arboles += `<circle cx="${10 + i * 25 + (i % 3) * 4}" cy="${554 + (i % 2) * 12}" r="${11 + (i % 4)}" class="arbol"/>`;
  const piletaTxt = R ? (w.franja === 'noche' ? 'Pileta · cerrada' : 'Pileta · incluida') : 'Piletas';
  return `<svg class="plano ${R ? 'plano-r' : ''}" viewBox="0 0 1000 580" role="img" aria-label="Mapa del predio">
  <rect width="1000" height="580" class="pasto"/>
  <rect y="0" width="1000" height="34" class="calle"/><text class="c-lbl" x="560" y="22">Calle La Paz</text>
  <rect y="538" width="1000" height="42" class="monte"/>${arboles}
  <path d="M300 34 L300 470 Q300 488 318 488 L794 488 Q812 488 812 470 L812 140 Q812 110 850 104 L900 100" class="camino"/>
  ${zi('pileta', `<rect x="28" y="48" width="160" height="178" rx="10" class="z-base"/><rect x="44" y="60" width="42" height="72" rx="3" class="agua"/><rect x="96" y="60" width="42" height="72" rx="3" class="agua"/><rect x="44" y="140" width="94" height="28" rx="3" class="agua2"/><ellipse cx="112" cy="197" rx="48" ry="19" class="agua"/><circle cx="96" cy="194" r="6" class="hongo"/><circle cx="124" cy="194" r="6" class="hongo"/>${lbl(108, 245, piletaTxt)}`)}
  ${zi('sum', `<rect x="196" y="58" width="92" height="80" rx="4" class="z-base edif"/>${lbl(242, 104, 'SUM')}`)}
  ${zi('glorieta', `<polygon points="248,290 272,290 289,307 289,331 272,348 248,348 231,331 231,307" class="z-base edif"/>${lbl(260, 372, 'Glorieta')}`)}
  ${zi('campo', `<rect x="330" y="48" width="230" height="292" rx="4" class="z-base campo"/>${lbl(445, 200, 'Campo libre')}`)}
  ${zi('futbol11', `<rect x="574" y="52" width="214" height="290" rx="2" class="z-base cancha"/><line x1="574" y1="197" x2="788" y2="197" class="linea"/><circle cx="681" cy="197" r="26" class="linea"/><rect x="636" y="52" width="90" height="36" class="linea"/><rect x="636" y="306" width="90" height="36" class="linea"/>${lbl(681, 240, 'Fútbol 11')}`)}
  ${R ? cz('vo', 330, 352, 80, 118, 'Vóley') + cz('f1', 420, 352, 168, 118, 'Fútbol 5 · 1') + cz('f2', 600, 352, 188, 118, 'Fútbol 5 · 2') + cz('pd', 832, 318, 74, 64, 'Pádel')
    : zi('auxiliares', `<rect x="420" y="352" width="168" height="118" rx="2" class="z-base cancha"/><rect x="600" y="352" width="188" height="118" rx="2" class="z-base cancha"/><line x1="504" y1="352" x2="504" y2="470" class="linea"/><line x1="694" y1="352" x2="694" y2="470" class="linea"/>${lbl(604, 418, 'Canchas auxiliares')}`) + zi('playon', `<rect x="832" y="318" width="74" height="64" rx="3" class="z-base piso"/>${lbl(869, 400, 'Playón')}`)}
  ${fila}
  ${zi('entrada', `<rect x="874" y="44" width="74" height="26" rx="3" class="z-base edif"/><rect x="884" y="80" width="56" height="54" rx="3" class="z-base edif"/><path d="M960 52c0-9 14-9 14 0 0 8-7 15-7 15s-7-7-7-15z" class="pin"/>${lbl(912, 152, 'Entrada')}`)}
  <rect x="934" y="292" width="24" height="96" rx="2" class="edif-gris"/>
  <g class="norte"><circle cx="40" cy="300" r="18"/><path d="M40 287 L46 304 L40 300 L34 304 Z"/><text x="40" y="330">N</text></g>
  </svg>`;
}

function vistaReserva() {
  const w = ui.wiz;
  if (!w.pers) { w.pers = {a:2, m:0, b:0}; w.veh = {auto:1, moto:0}; w.conVeh = null; }
  const pasos = ['Fecha y horario', 'Personas', 'Lugar', 'Pago'];
  const st = `<p class="step-m">Paso ${w.paso} de 4 · ${pasos[w.paso - 1]}</p><div class="stepper">${pasos.map((p, i) => `<div class="${i < w.paso ? 'on' : ''}"><i></i><span>${i + 1}. ${p}</span></div>`).join('')}</div>`;
  const back = '';
  const cot = cotizar(w), F = w.franja && franja(w.franja);
  let c = '', ok = false, txtBtn = 'Continuar';
  if (w.paso === 1) {
    let dias = '';
    for (let k = 0; k < 14; k++) {
      const f = addDays(hoy(), k), e = estadoVisita(f), d = new Date(f + 'T12:00'), off = ['lleno', 'pasado', 'fuera'].includes(e);
      dias += `<button class="dchip ${e} ${w.dia === f ? 'sel' : ''}" data-act="wdia" data-f="${f}" ${off ? 'disabled' : ''}><small>${k === 0 ? 'Hoy' : k === 1 ? 'Mañana' : cap1(d.toLocaleDateString('es-AR', {weekday:'short'}).replace('.', ''))}</small><b>${d.getDate()}</b><em>${{libre:'Libre', parcial:'Pocos', lleno:'Completo', pasado:'—'}[e] || ''}</em></button>`;
    }
    const frs = w.dia ? FRANJAS.map(fr => {
      const pas = turnoPasado(w.dia, fr.turno), lib = quinchosLibres(w.dia, fr.id);
      return `<button class="franja ${w.franja === fr.id ? 'sel' : ''}" data-act="wfr" data-f="${fr.id}" ${pas ? 'disabled' : ''}><span class="fr-ic">${ico(fr.ic, 22)}</span><span class="fr-t"><b>${fr.t}</b><small>${fr.h}</small></span><span class="fr-d">${pas ? 'Ya comenzó' : lib ? `<span class="badge b-verde"><i class="dot"></i>${lib} quinchos libres</span>` : '<span class="badge b-gris">Sin quinchos</span>'}${fr.id !== 'noche' ? '<small>Pileta incluida</small>' : ''}</span></button>`;
    }).join('') : '';
    c = `<h2 class="wtit">¿Cuándo venís?</h2><p class="sub">Elegí el día y el horario de tu visita.</p>
      <label style="margin-top:4px">Día</label><div class="dias">${dias}</div>
      <button class="link wcal-btn2" data-act="wcal">${ui.verCal ? 'Ocultar calendario' : 'Ver más fechas'}</button>
      ${ui.verCal ? `<div class="card" style="margin-top:12px;max-width:440px">${calendario(estadoVisita)}</div>` : ''}
      ${w.dia ? `<label style="margin-top:22px">Horario · ${fmtFL(w.dia)}</label><div class="franjas">${frs}</div>` : ''}`;
    ok = !!(w.dia && w.franja);
  }
  if (w.paso === 2) {
    const T = S.tarifas;
    const ctr = (k, obj, t, d) => `<div class="contador"><div><b>${t}</b><small>${d}</small></div><div class="ctr"><button type="button" data-act="cnt" data-o="${obj}" data-k="${k}" data-d="-1" aria-label="Restar">−</button><span>${w[obj][k]}</span><button type="button" data-act="cnt" data-o="${obj}" data-k="${k}" data-d="1" aria-label="Sumar">+</button></div></div>`;
    c = `<h2 class="wtit">¿Quiénes vienen?</h2><p class="sub">La entrada se cobra por persona. Contate a vos también.</p>
      <div class="card" style="padding:6px 20px">${ctr('a', 'pers', 'Adultos', 'Desde 13 años · ' + pesos(T.adulto))}${ctr('m', 'pers', 'Menores', 'De 6 a 12 años · ' + pesos(T.menor))}${ctr('b', 'pers', 'Niños', 'Menores de 6 años · sin cargo')}</div>
      <h3 style="margin-top:24px">¿Venís en vehículo?</h3><p class="small muted" style="margin-top:-6px">El ingreso de vehículos al predio también tiene costo.</p>
      <div class="seg" style="max-width:360px"><button class="${w.conVeh === true ? 'on' : ''}" data-act="wveh" data-v="1">Sí</button><button class="${w.conVeh === false ? 'on' : ''}" data-act="wveh" data-v="0">No</button></div>
      ${w.conVeh ? `<div class="card" style="padding:6px 20px">${ctr('auto', 'veh', 'Autos o camionetas', pesos(T.auto) + ' cada uno')}${ctr('moto', 'veh', 'Motos', pesos(T.moto) + ' cada una')}</div>` : ''}`;
    ok = w.pers.a > 0 && w.conVeh !== null && (!w.conVeh || w.veh.auto + w.veh.moto > 0);
  }
  if (w.paso === 3) {
    const q = w.quincho && getInst(w.quincho), libres = quinchosLibres(w.dia, w.franja);
    const can = ui.canSel && getInst(ui.canSel);
    const lista = quinchos().map(qq => { const s = !qq.activo ? 'mant' : w.quincho === qq.id ? 'sel' : ocup(qq.id, w.dia, F.turno) ? 'ocu' : capN(qq) < totPers(w.pers) ? 'chico' : 'lib'; return `<button class="qchip st-${s}" ${['lib', 'sel'].includes(s) ? `data-act="wq" data-id="${qq.id}"` : 'disabled'} title="${qq.nombre}">${qq.nombre.replace('Quincho ', '').replace('grande', 'Grande')}</button>`; }).join('');
    c = `<h2 class="wtit">Elegí tu lugar</h2><p class="sub">${fmtFL(w.dia)} · ${F.t} (${F.h}) · ${totPers(w.pers)} personas. Hay <b>${libres}</b> quinchos libres.</p>
      <div class="card mapa-card"><div class="mapa-scroll">${mapaPredio('reserva')}</div>
        <div class="leyenda"><span><i class="lg-lib"></i>Libre</span><span><i class="lg-sel"></i>Tu elección</span><span><i class="lg-ocu"></i>Ocupado</span><span><i class="lg-chico"></i>No alcanza para tu grupo</span></div></div>
      <div class="sel-panel">
        <div class="card sel-box">${q ? `<div class="sb-row"><span class="ii">${ico('flame')}</span><div class="sb-t"><small>Quincho elegido</small><b>${esc(q.nombre)}</b><span>Hasta ${capN(q)} personas · ${pesos(q.tarifa)}</span></div><button class="link rojo" data-act="wq" data-id="${q.id}">Quitar</button></div>`
          : `<div class="sb-row"><span class="ii">${ico('flame')}</span><div class="sb-t"><small>Quincho</small><b>Todavía no elegiste</b><span>Tocá un quincho verde en el mapa o en la lista.</span></div></div>`}
          <details class="qlista" ${q ? '' : 'open'}><summary>Elegir de la lista</summary><div class="qgrid">${lista}</div></details></div>
        <div class="card sel-box">${w.cancha ? `<div class="sb-row"><span class="ii">${ico(ICONK[w.cancha.id])}</span><div class="sb-t"><small>Cancha (opcional)</small><b>${esc(instNombre(w.cancha.id))} · ${esc(w.cancha.hora)}</b><span>${pesos(getInst(w.cancha.id).tarifa)} por hora</span></div><button class="link rojo" data-act="wcanq">Quitar</button></div>`
          : can ? `<div class="sb-row"><span class="ii">${ico(ICONK[can.id])}</span><div class="sb-t"><small>Cancha (opcional)</small><b>${esc(can.nombre)}</b><span>Elegí la hora · ${pesos(can.tarifa)}</span></div><button class="link" data-act="wcan" data-id="${can.id}">Cerrar</button></div>
            <div class="chips" style="margin-top:12px">${horasCancha(can, w.dia, w.franja).map(h => { const no = turnoPasado(w.dia, h) || ocup(can.id, w.dia, h); return `<button class="chip" ${no ? 'disabled style="opacity:.45"' : `data-act="wcanh" data-h="${esc(h)}"`}>${esc(h)}</button>`; }).join('') || '<span class="muted small">Sin horarios en esta franja.</span>'}</div>`
          : `<div class="sb-row"><span class="ii">${ico('ball')}</span><div class="sb-t"><small>Cancha (opcional)</small><b>¿Querés sumar una cancha?</b><span>Tocá una cancha en el mapa: fútbol 5, vóley o pádel.</span></div></div>`}</div>
      </div>`;
    ok = true; txtBtn = w.quincho ? 'Continuar' : 'Continuar sin quincho';
  }
  if (w.paso === 4) {
    const met = w.metodo || 'mp';
    c = `<h2 class="wtit">Revisá y pagá</h2><p class="sub">Controlá que esté todo bien antes de confirmar.</p>
      <div class="card"><div class="rl"><span>Día</span><b>${fmtFL(w.dia)}</b></div><div class="rl"><span>Horario</span><b>${F.t} · ${F.h}</b></div><div class="rl"><span>Personas</span><b>${persTxt(w.pers)}</b></div><div class="rl"><span>Vehículos</span><b>${vehTxt(w.conVeh ? w.veh : null)}</b></div><div class="rl"><span>Lugar</span><b>${w.quincho ? esc(instNombre(w.quincho)) : 'Solo entrada (sin quincho)'}</b></div>${w.cancha ? `<div class="rl"><span>Cancha</span><b>${esc(instNombre(w.cancha.id))} · ${esc(w.cancha.hora)}</b></div>` : ''}</div>
      <h3 style="margin-top:22px">¿Cómo querés pagar?</h3>
      <div class="metodos">
        <button class="metodo ${met === 'mp' ? 'sel' : ''}" data-act="wmet" data-m="mp"><span class="radio"></span><span class="mt-t"><b>Mercado Pago</b><small>Tarjeta de crédito o débito, o dinero en cuenta. Se confirma al instante.</small></span><span class="mt-tag">Recomendado</span></button>
        <button class="metodo ${met === 'tr' ? 'sel' : ''}" data-act="wmet" data-m="tr"><span class="radio"></span><span class="mt-t"><b>Transferencia bancaria</b><small>Transferís al alias del complejo y enviás la foto del comprobante. Se confirma cuando la administración lo revisa.</small></span></button>
      </div>
      <label class="check" style="margin:18px 0 0"><input type="checkbox" id="acepto"> <span>Acepto el <button type="button" class="link" data-act="verreg">reglamento del complejo</button> y las condiciones de cancelación.</span></label>`;
    ok = true; txtBtn = `${met === 'mp' ? 'Pagar' : 'Confirmar'} ${pesos(cot.total)}`;
  }
  const res = `<div class="card resumen-v"><h3>Tu visita</h3>
      <div class="rv-dato">${ico('calendar', 18)}<span>${w.dia ? fmtFL(w.dia) : '<i class="muted">Elegí un día</i>'}${F ? ' · ' + F.t : ''}</span></div>
      ${w.paso > 1 ? `<div class="rv-dato">${ico('users', 18)}<span>${persTxt(w.pers) || '—'}</span></div>` : ''}
      ${w.paso > 2 ? `<div class="rv-dato">${ico('pin', 18)}<span>${w.quincho ? esc(instNombre(w.quincho)) : 'Sin quincho'}${w.cancha ? ' + ' + esc(instNombre(w.cancha.id)) : ''}</span></div>` : ''}
      ${w.paso > 1 && cot.items.length ? `<div class="rv-items">${cot.items.map(([n, q, p]) => `<div><span>${q > 1 ? q + ' × ' : ''}${esc(n)}</span><b>${p ? pesos(q * p) : 'Sin cargo'}</b></div>`).join('')}</div>` : ''}
      <div class="rv-total"><span>Total</span><b>${pesos(cot.total)}</b></div></div>`;
  const foot = `<div class="wiz-foot"><div class="wf-total"><small>Total</small><b>${pesos(cot.total)}</b></div><button class="btn" data-act="${w.paso === 4 ? 'confirmar' : 'wnext'}" ${ok ? '' : 'disabled'}>${txtBtn}</button></div>`;
  return `<div class="wiz"><div class="wiz-main">${back}${st}${c}${foot}</div><aside class="wiz-res">${res}</aside></div>`;
}

/* ===================== Plano del predio (ilustrativo) ===================== */
const ZONAS = {
  entrada:{t:'Entrada y guardia', d:'Ingreso principal por calle La Paz. En la guardia se controla el código QR de la reserva o la credencial de socio.', ic:'door'},
  pileta:{t:'Piletas', d:'Dos piletas, una pileta chica y la pileta infantil con hongos, juegos de agua y toboganes.', foto:'pileta-1', tipo:'Pileta', ic:'waves'},
  sum:{t:'SUM (salón)', d:'Salón de usos múltiples techado, junto a las piletas, con capacidad para unas 150 personas.', ic:'building'},
  futbol11:{t:'Cancha de fútbol 11', d:'Cancha principal del predio, con iluminación.', foto:'cancha-futbol', tipo:'Cancha', ic:'ball'},
  auxiliares:{t:'Canchas auxiliares', d:'Canchas más chicas para fútbol 5 y vóley.', foto:'cancha-voley', tipo:'Cancha', ic:'volley'},
  quinchos:{t:'Quinchos con asador', d:'Fila de quinchos techados con asador y mesa, al fondo del predio, junto al monte.', foto:'quincho', tipo:'Quincho', ic:'flame'},
  glorieta:{t:'Glorieta', d:'Estructura techada de forma octogonal. Uso a confirmar.', ic:'home'},
  campo:{t:'Campo libre', d:'Gran espacio verde abierto para recreación.', ic:'grid'},
  playon:{t:'Playón', d:'Sector de piso duro. Uso a confirmar.', ic:'grid'}
};
function vistaPlano(publico) {
  const k = ui.zona, Z = k && ZONAS[k];
  const panel = Z ? `<div class="card plano-info">${Z.foto ? `<img src="${foto(Z.foto)}" alt="${Z.t}" class="pi-foto" data-act="verfoto" data-f="${Z.foto}">` : `<div class="pi-foto foto-ph">${ico(Z.ic, 40)}</div>`}
      <div class="pi-body"><h3>${Z.t}</h3><p class="muted">${Z.d}</p>${Z.tipo ? (publico ? `<button class="btn full" data-act="acceso" data-v="login">Ingresar para reservar</button>` : `<button class="btn full" data-act="nuevares">Reservar</button>`) : ''}</div></div>`
    : `<div class="card plano-info vacio"><span class="vic">${ico('pin', 28)}</span><p class="muted">Tocá un sector del plano para ver qué hay y reservarlo.</p></div>`;
  return `<div class="plano-wrap"><div class="card plano-card">${mapaPredio('info')}
      <div class="chips plano-chips">${Object.entries(ZONAS).map(([kk, v]) => `<button class="chip ${k === kk ? 'on' : ''}" data-act="zona" data-z="${kk}">${v.t}</button>`).join('')}</div></div>${panel}</div>
    <p class="tiny" style="text-align:left">Plano ilustrativo dibujado a partir de la vista satelital del predio (unas 5 hectáreas). La ubicación exacta y el uso de algunos sectores están por confirmar.</p>`;
}

/* ===================== Acceso ===================== */
function vistaSitio() {
  const h = hoy();
  const T = [['Quincho', 'Quinchos'], ['Cancha', 'Canchas'], ['Pileta', 'Pileta']];
  const dispo = T.map(([t, n]) => {
    const is = S.inst.filter(i => i.tipo === t && i.activo);
    const lib = is.reduce((a, i) => a + i.turnos.filter(tu => !turnoPasado(h, tu) && ocup(i.id, h, tu) < i.cupo).length, 0);
    return `<div class="dispo"><span><span class="ii sm">${ico(ICON_T[t])}</span>${n}</span>${lib ? `<span class="badge b-verde"><i class="dot"></i>${lib} turnos libres</span>` : '<span class="badge b-gris">Sin turnos hoy</span>'}</div>`;
  }).join('');
  const desc = {Quincho:'Equipados para asados y reuniones familiares de hasta 60 personas.', Cancha:'Fútbol 5, pádel y vóley. Se reservan por hora, de 9 a 22 h.', Pileta:'Turnos de mañana y tarde durante la temporada de verano.'};
  return `<div class="sitio">
  <header class="s-head"><div class="marca"><div class="logo">${ico('shield')}</div><div><b>Complejo Policial Almudena</b><small>Reservas para socios</small></div></div>
    <nav class="s-nav"><a data-act="ir" data-id="s-como">Cómo funciona</a><a data-act="ir" data-id="s-inst">Instalaciones</a><a data-act="ir" data-id="s-fotos">Fotos</a><a data-act="ir" data-id="s-plano">Plano</a><a data-act="ir" data-id="s-info">Información</a></nav>
    <div class="s-acc"><button class="btn ghost" data-act="acceso" data-v="registro">Crear cuenta</button><button class="btn" data-act="acceso" data-v="login">Ingresar</button></div></header>
  <section class="hero"><div><span class="eyebrow">Para socios del complejo</span><h1>Reservá quinchos, canchas y pileta desde tu casa</h1>
    <p>Sin llamadas ni filas. Elegí el día, mirá qué hay libre en el momento y recibí tu comprobante con código QR.</p>
    <div class="chips"><button class="btn" data-act="acceso" data-v="login">Ingresar y reservar ${ico('chevron', 18)}</button><button class="btn ghost" data-act="acceso" data-v="registro">Es mi primera vez</button></div></div>
    <div class="hero-card"><img class="hero-foto" src="${foto('pileta-1')}" alt="Pileta del complejo"><h3 style="margin-bottom:2px">Disponible hoy</h3><p class="small muted">${fmtFL(h)}</p>${dispo}</div></section>
  <section class="s-sec" id="s-como"><h2>Así de fácil</h2><p class="sub">Tres pasos, desde la computadora o el celular.</p><div class="grid3">
    <div class="card"><span class="num">1</span><h3>Ingresá</h3><p class="muted">Con tu número de socio o DNI. Si es tu primera vez, creá tu cuenta en un minuto.</p></div>
    <div class="card"><span class="num">2</span><h3>Elegí lugar, día y horario</h3><p class="muted">Solo te mostramos lo que está libre, así no hay confusiones.</p></div>
    <div class="card"><span class="num">3</span><h3>Pagá y mostrá tu QR</h3><p class="muted">Transferís, avisás con una foto del comprobante y en la entrada escanean tu QR.</p></div></div></section>
  <section class="s-sec" id="s-inst"><h2>Instalaciones y tarifas</h2><p class="sub">Valores vigentes para socios.</p><div class="grid3">
    ${(() => { const T2 = S.tarifas, q = S.inst.filter(i => i.tipo === 'Quincho'), qc = q.find(i => capN(i) <= 20), qg = q.find(i => capN(i) > 20);
      const card = (f, n, d, rows) => `<div class="card card-foto"><img src="${foto(f)}" alt="${n}" loading="lazy" data-act="verfoto" data-f="${f}"><div class="cf-body"><h3>${n}</h3><p class="muted">${d}</p>${rows.map(([a, b]) => `<div class="rl"><span>${a}</span><b>${b}</b></div>`).join('')}</div></div>`;
      return card('pileta-1', 'Entrada al predio', 'Se paga por persona y por vehículo. Incluye pileta en temporada.', [['Adulto (desde 13 años)', pesos(T2.adulto)], ['Menor (6 a 12 años)', pesos(T2.menor)], ['Menores de 6 años', 'Sin cargo'], ['Auto o camioneta', pesos(T2.auto)], ['Moto', pesos(T2.moto)]])
        + card('quincho', 'Quinchos', `${q.length} quinchos con asador y mesa. Se reservan por turno: mediodía, tarde o noche.`, [[`Quincho (hasta ${qc ? capN(qc) : 15} personas)`, qc ? pesos(qc.tarifa) : '—'], [`Quincho grande (hasta ${qg ? capN(qg) : 40})`, qg ? pesos(qg.tarifa) : '—']])
        + card('cancha-futbol', 'Canchas', 'Fútbol 5, pádel y vóley. Se suman a tu reserva, por hora.', S.inst.filter(i => i.tipo === 'Cancha').map(i => [i.nombre, pesos(i.tarifa)]));
    })()}</div></section>
  <section class="s-sec" id="s-fotos"><h2>Conocé el complejo</h2><p class="sub">Tocá una foto para verla más grande.</p>${galeria()}</section>
  <section class="s-sec" id="s-plano"><h2>Plano del predio</h2><p class="sub">Ubicá cada sector antes de venir.</p>${vistaPlano(true)}</section>
  <section class="s-sec" id="s-info"><h2>Antes de venir</h2><p class="sub">Lo importante, en pocas palabras.</p><div class="grid3">
    <div class="card"><span class="ii" style="margin-bottom:14px">${ico('clock')}</span><h3>Horarios</h3><p class="muted">${esc(INFO.horarios)}</p></div>
    <div class="card"><span class="ii" style="margin-bottom:14px">${ico('pin')}</span><h3>Ubicación</h3><p class="muted">${esc(INFO.ubicacion)}</p></div>
    <div class="card"><span class="ii" style="margin-bottom:14px">${ico('checkcircle')}</span><h3>Para ingresar</h3><ul class="muted" style="padding-left:18px;margin:0">${INFO.requisitos.map(x => '<li>' + esc(x) + '</li>').join('')}</ul></div></div></section>
  <footer class="s-foot">Complejo Policial Almudena · Div. Complejo Pol. Almudena (DPyRI) · Salta<br><span style="opacity:.7">Versión de demostración con datos de ejemplo</span></footer></div>`;
}

function vistaAcceso() {
  if (ui.acceso === 'sitio') return vistaSitio();
  const m = ui.msg ? `<div class="${ui.msg.tipo}">${esc(ui.msg.txt)}</div>` : '';
  let body = '';
  if (ui.acceso === 'login') body = `
    <h3>${MODO === 'admin' ? 'Ingreso del personal' : 'Ingresá a tu cuenta'}</h3><p class="muted small">${MODO === 'admin' ? 'Solo para personal autorizado del complejo.' : 'Usá tu número de socio o tu DNI.'}</p>
    <form data-form="login">
      <label>${MODO === 'admin' ? 'Usuario' : 'N° de socio o DNI'}</label><input name="u" required autocomplete="username">
      <label>Contraseña</label><input name="p" type="password" required autocomplete="current-password">
      <button class="btn grande" style="margin-top:18px">Ingresar</button>
    </form>${m}
    ${MODO === 'admin' ? `<p class="small muted" style="text-align:center;margin-top:14px">¿Olvidaste tu contraseña? Pedí el restablecimiento a un administrador.</p>
    <div class="demo">Demostración: entrá sin contraseña como
      <div class="chips"><button class="chip" data-act="demo" data-u="admin" data-p="admin">Administrador</button><button class="chip" data-act="demo" data-u="porteria" data-p="1234">Portería</button></div></div>
    <div class="links" style="justify-content:center"><a href="index.html">Ir al sitio de socios</a></div>`
    : `<div class="links"><a data-act="acceso" data-v="registro">Crear cuenta</a><a data-act="acceso" data-v="recuperar">Olvidé mi contraseña</a></div>
    <div class="links" style="justify-content:center"><a data-act="acceso" data-v="sitio">Volver al inicio</a></div>
    <div class="demo">Demostración: <button class="link" data-act="demo" data-u="1001" data-p="1234">entrar como socio de prueba</button></div>
    <p class="small muted" style="text-align:center;margin-top:12px"><a href="admin.html" style="color:var(--gris)">Acceso para el personal del complejo</a></p>`}`;
  if (ui.acceso === 'registro') {
    const tipo = ui.regTipo || 'socio';
    const consent = `<label class="check" style="margin-top:14px"><input type="checkbox" name="consent" value="1"> <span>Acepto que mis datos se usen solo para la gestión del complejo, conforme a la Ley 25.326 de Protección de Datos Personales.</span></label>`;
    body = `<h3>Crear tu cuenta</h3><p class="muted small">¿Ya sos socio del complejo o querés asociarte?</p>
    <div class="seg" style="margin-top:14px"><button class="${tipo === 'socio' ? 'on' : ''}" data-act="regtipo" data-t="socio">Ya soy socio</button><button class="${tipo === 'nuevo' ? 'on' : ''}" data-act="regtipo" data-t="nuevo">Quiero asociarme</button></div>
    ${tipo === 'socio' ? `<p class="small muted" style="margin:0 0 4px">Buscamos tu número de socio con tu DNI. No hace falta que lo sepas. (Para probar: DNI 33444555.)</p>
    <form data-form="registro">
      <label>DNI</label><input name="dni" required inputmode="numeric" autocomplete="off">
      <label>Correo electrónico</label><input name="email" type="email" required autocomplete="email">
      <label>Teléfono (WhatsApp)</label><input name="tel" inputmode="tel" autocomplete="tel">
      <label>Contraseña (mínimo 6 caracteres)</label><input name="p" type="password" required minlength="6" autocomplete="new-password">
      <label>Repetir contraseña</label><input name="p2" type="password" required autocomplete="new-password">
      ${consent}<button class="btn grande" style="margin-top:16px">Crear cuenta</button></form>`
    : `<p class="small muted" style="margin:0 0 4px">Completá la solicitud. La administración la revisa y, si se aprueba, te enviamos por correo tu <b>número de socio</b> y un enlace para crear tu contraseña.</p>
    <form data-form="solicitud">
      <div class="grid2"><div><label>Nombre</label><input name="nombre" required autocomplete="given-name"></div><div><label>Apellido</label><input name="apellido" required autocomplete="family-name"></div></div>
      <label>DNI</label><input name="dni" required inputmode="numeric" autocomplete="off">
      <label>Condición</label><select name="cond" required><option value="">Elegí una opción</option><option>Personal policial en actividad</option><option>Personal policial retirado</option><option>Pensionado/a policial</option><option>Familiar de personal policial</option></select>
      <label>Legajo policial (si corresponde)</label><input name="legajo" inputmode="numeric">
      <label>Correo electrónico</label><input name="email" type="email" required autocomplete="email">
      <label>Teléfono (WhatsApp)</label><input name="tel" inputmode="tel" required autocomplete="tel">
      <label>Foto del DNI (frente)</label><input type="file" name="img" accept="image/*">
      ${consent}<button class="btn grande" style="margin-top:16px">Enviar solicitud</button></form>`}${m}
    <div class="links" style="justify-content:center"><a data-act="acceso" data-v="login">Ya tengo cuenta, quiero ingresar</a></div>`;
  }
  if (ui.acceso === 'solenviada') body = `<div style="text-align:center"><span class="vic" style="width:72px;height:72px">${ico('checkcircle', 32)}</span>
    <h3 style="margin-top:6px">¡Solicitud enviada!</h3><p class="muted">Recibimos tu pedido para asociarte. La administración lo va a revisar y te va a responder por correo a <b>${esc(ui.recEmail || '')}</b>.</p>
    <div class="pasos-mail"><div>${ico('clock', 18)}<span>La revisión puede demorar unos días hábiles</span></div><div>${ico('idcard', 18)}<span>Si se aprueba, te llega tu <b>número de socio</b></span></div><div>${ico('key', 18)}<span>Y un enlace para <b>crear tu contraseña</b></span></div></div>
    ${ui.recMail ? `<button class="btn ghost full" style="margin-top:16px" data-act="vercorreo" data-id="${ui.recMail}">${ico('search', 18)} Ver el correo de confirmación (demostración)</button>` : ''}
    <div class="links" style="justify-content:center"><a data-act="acceso" data-v="sitio">Volver al inicio</a></div></div>`;
  if (ui.acceso === 'recuperar') {
    const tipo = ui.recTipo || 'clave';
    body = `<h3>¿Necesitás ayuda para ingresar?</h3><p class="muted small">Elegí qué te olvidaste.</p>
    <div class="seg" style="margin-top:14px"><button class="${tipo === 'clave' ? 'on' : ''}" data-act="rectipo" data-t="clave">Mi contraseña</button><button class="${tipo === 'nro' ? 'on' : ''}" data-act="rectipo" data-t="nro">Mi número de socio</button></div>
    ${tipo === 'clave' ? `<form data-form="recuperar"><input type="hidden" name="tipo" value="clave">
      <label style="margin-top:0">Correo electrónico con el que te registraste</label><input name="email" type="email" required autocomplete="email" placeholder="nombre@correo.com">
      <p class="small muted" style="margin:8px 0 0">Te vamos a enviar un enlace para crear una contraseña nueva.</p>
      <button class="btn grande" style="margin-top:16px">Enviar enlace</button></form>`
    : `<form data-form="recuperar"><input type="hidden" name="tipo" value="nro">
      <label style="margin-top:0">DNI del titular</label><input name="dni" required inputmode="numeric" autocomplete="off">
      <label>Correo electrónico con el que te registraste</label><input name="email" type="email" required autocomplete="email" placeholder="nombre@correo.com">
      <p class="small muted" style="margin:8px 0 0">Te vamos a enviar tu número de socio por correo.</p>
      <button class="btn grande" style="margin-top:16px">Enviar mi número de socio</button></form>`}${m}
    <div class="links" style="justify-content:center"><a data-act="acceso" data-v="login">Volver a ingresar</a></div>`;
  }
  if (ui.acceso === 'enviado') {
    const e = ui.recEmail || '';
    body = `<div style="text-align:center"><span class="vic" style="width:72px;height:72px">${ico('megaphone', 30)}</span>
      <h3 style="margin-top:6px">Revisá tu correo</h3>
      <p class="muted">Si <b>${esc(e)}</b> está registrado, te enviamos ${ui.recTipo === 'nro' ? 'tu <b>número de socio</b>' : 'un <b>enlace para restablecer tu contraseña</b>'}.</p>
      <div class="pasos-mail"><div>${ico('checkcircle', 18)}<span>Abrí tu casilla de correo</span></div><div>${ico('checkcircle', 18)}<span>Buscá el mensaje de <b>Complejo Policial Almudena</b></span></div><div>${ico('checkcircle', 18)}<span>Si no lo ves, revisá <b>Spam</b> o <b>Correo no deseado</b></span></div>${ui.recTipo === 'nro' ? '' : `<div>${ico('clock', 18)}<span>El enlace vence en <b>30 minutos</b></span></div>`}</div>
      ${ui.recMail ? `<button class="btn ghost full" style="margin-top:16px" data-act="vercorreo" data-id="${ui.recMail}">${ico('search', 18)} Ver el correo enviado (demostración)</button>` : ''}
      <div class="links" style="justify-content:space-between"><a data-act="acceso" data-v="recuperar">No me llegó, reenviar</a><a data-act="acceso" data-v="login">Volver a ingresar</a></div></div>`;
  }
  if (ui.acceso === 'nuevaclave') {
    const t = (S.tokens || {})[ui.tk], valido = t && !t.usado && t.exp > Date.now();
    body = valido ? `<h3>${t.tipo === 'alta' ? 'Activá tu cuenta' : 'Creá tu nueva contraseña'}</h3><p class="muted small">${t.tipo === 'alta' ? `Tu número de socio es <b>${t.nro}</b>. Elegí una contraseña para ingresar.` : `Para la cuenta del socio N° ${t.nro}.`}</p>
      <form data-form="nuevaclave"><label>Nueva contraseña (mínimo 6 caracteres)</label><input name="n" type="password" required minlength="6" autocomplete="new-password">
      <label>Repetir contraseña</label><input name="n2" type="password" required autocomplete="new-password"><button class="btn grande" style="margin-top:16px">Guardar contraseña</button></form>${m}`
      : `<div style="text-align:center"><span class="vic" style="background:var(--rojob);color:var(--rojo)">${ico('alert', 28)}</span><h3>El enlace no es válido</h3><p class="muted">${t && t.usado ? 'Este enlace ya se usó.' : 'El enlace venció o es incorrecto.'} Pedí uno nuevo.</p><button class="btn grande" data-act="acceso" data-v="recuperar">Pedir un enlace nuevo</button></div>`;
  }
  return `<div class="acceso"><div class="box">${barraAtras()}
    <div class="marca"><div class="logo">${ico('shield')}</div><div><b>Complejo Policial Almudena</b><small>${MODO === 'admin' ? 'Administración' : 'Reservas para socios'}</small></div></div>
    ${body}
    <p class="tiny"><a data-act="reset">Reiniciar datos de demostración</a></p>
  </div></div>`;
}

/* ===================== Vistas ===================== */
const ICONOS = {inicio:'home', reservar:'calendar', mis:'ticket', perfil:'user', asistente:'chat', validar:'qr', ingresos:'door', panel:'home', pagos:'card', disponibilidad:'grid', agenda:'clock', reservas:'list', nueva:'plus', socios:'users', instalaciones:'building', comunicados:'megaphone', seguridad:'shield', auditoria:'doc'};
const NAV = {
  socio:[['inicio','Inicio'],['reservar','Reservar'],['mis','Mis reservas'],['perfil','Mi cuenta']],
  porteria:[['validar','Validar QR'],['ingresos','Ingresos de hoy']],
  admin:[['_','Principal'],['panel','Inicio'],['pagos','Pagos'],['disponibilidad','Disponibilidad'],['agenda','Agenda del día'],['_','Gestión'],['reservas','Reservas'],['socios','Socios'],['instalaciones','Instalaciones'],['comunicados','Comunicados'],['_','Sistema'],['seguridad','Seguridad'],['auditoria','Auditoría']]
};

function listaNoticias(admin, limite, tipo) {
  let ns = S.noticias.slice().sort((a, b) => b.fecha - a.fecha);
  if (tipo) ns = ns.filter(n => n.tipo === tipo);
  if (limite) ns = ns.slice(0, limite);
  if (!ns.length) return '<p class="muted">No hay publicaciones.</p>';
  return ns.map(n => `<div class="card noticia ${esc(n.tipo)}"><span class="tipo">${esc(n.tipo)}</span><h3>${esc(n.titulo)}</h3><p>${esc(n.texto)}</p>
    <div class="fecha">${fmtDT(n.fecha)}${admin ? ` · <button class="link rojo" data-act="delnot" data-id="${n.id}">Eliminar</button>` : ''}</div></div>`).join('');
}

const V = {
  inicio() {
    const s = socioActual();
    const alertas = S.noticias.filter(n => ['Clima', 'Mantenimiento'].includes(n.tipo) && Date.now() - n.fecha < 3 * 86400000).sort((a, b) => b.fecha - a.fecha);
    const mias = S.reservas.filter(r => r.socio === s.nro && !r.padre && r.estado === 'confirmada' && r.fecha >= hoy()).sort((a, b) => a.fecha.localeCompare(b.fecha) || inicioTurno(a.turno) - inicioTurno(b.turno));
    const prox = mias[0];
    const debe = mias.filter(r => ['pendiente', 'rechazado'].includes(r.pago)).length;
    const hr = new Date().getHours(), saludo = hr < 12 ? 'Buen día' : hr < 20 ? 'Buenas tardes' : 'Buenas noches';
    const pagarProx = prox && ['pendiente', 'rechazado'].includes(prox.pago);
    const links = [['mis', 'ticket', 'Mis reservas', 'Ver, pagar o cancelar'], ['plano', 'pin', 'Plano del predio', 'Dónde queda cada sector'], ['credencial', 'idcard', 'Mi credencial', 'Para mostrar en la entrada'], ['info', 'info', 'Información', 'Horarios, tarifas y reglamento']];
    return `<div class="page-head"><h1>${saludo}, ${esc(s.nombre.split(' ')[0])}</h1><p class="sub">¿Qué querés hacer hoy?</p></div>
    ${debe ? `<div class="aviso aviso-amarillo">${ico('alert', 22)}<div><b>Tenés ${debe === 1 ? 'un pago pendiente' : debe + ' pagos pendientes'}</b><span>Pagá ${PAGO.plazo} para mantener tu reserva.</span></div><button class="btn" data-act="nav" data-v="mis">Pagar</button></div>` : ''}
    ${alertas.length ? `<div class="aviso">${ico(alertas[0].tipo === 'Clima' ? 'cloud' : 'wrench', 22)}<div><b>${esc(alertas[0].titulo)}</b></div><button class="link" data-act="nav" data-v="novedades">Ver más</button></div>` : ''}
    <div class="home"><div class="home-main">
      <button class="cta" data-act="nuevares"><div class="cta-ic">${ico('calendar', 28)}</div><div><b>Hacer una reserva</b><span>Quinchos, canchas o pileta, en 4 pasos</span></div>${ico('chevron', 24)}</button>
      ${prox ? `<div class="card"><div class="card-label">Tu próxima reserva</div><div class="prox-row">${ICON[prox.instId]}<div><b>${esc(instNombre(prox.instId))}</b><span>${fmtFL(prox.fecha)} · ${esc(prox.turno)}</span></div></div>
        <div class="prox-foot">${badgePago(prox.pago)}<button class="btn" data-act="${pagarProx ? 'pagar' : 'verqr'}" data-id="${prox.id}">${pagarProx ? 'Pagar ' + pesos(prox.monto || 0) : ico('qr', 18) + ' Mostrar QR'}</button></div></div>` : ''}
      <div class="lista-links">${links.map(([v, i, t, d]) => `<button class="link-row" data-act="nav" data-v="${v}"><span class="lr-ic">${ico(i)}</span><span class="lr-t"><b>${t}</b><small>${d}</small></span>${ico('chevron')}</button>`).join('')}</div>
    </div><div class="home-side"><div class="sec-head"><h3>Novedades</h3><button class="link" data-act="nav" data-v="novedades">Ver todas</button></div>${listaNoticias(false, 2)}</div></div>`;
  },

  novedades() {
    const tipos = ['', ...TIPOS_NOT.filter(t => S.noticias.some(n => n.tipo === t))];
    return `<div class="page-head"><h1>Novedades</h1><p class="sub">Comunicados oficiales del complejo.</p></div>
    <div class="chips" style="margin-bottom:16px">${tipos.map(t => `<button class="chip ${ui.ntipo === t ? 'on' : ''}" data-act="ntipo" data-t="${t}">${t || 'Todas'}</button>`).join('')}</div>${listaNoticias(false, 0, ui.ntipo)}`;
  },

  reservar() { return vistaReserva(); },

  mis() {
    const s = socioActual();
    const rs = S.reservas.filter(r => r.socio === s.nro && !r.padre);
    const prox = rs.filter(r => r.estado === 'confirmada' && r.fecha >= hoy()).sort((a, b) => a.fecha.localeCompare(b.fecha) || inicioTurno(a.turno) - inicioTurno(b.turno));
    const hist = rs.filter(r => !prox.includes(r)).sort((a, b) => b.fecha.localeCompare(a.fecha));
    const enHist = ui.mtab === 'hist', lista = enHist ? hist : prox;
    const card = r => {
      const pagar = ['pendiente', 'rechazado'].includes(r.pago);
      const futura = r.estado === 'confirmada' && r.fecha >= hoy();
      const acc = futura
        ? `<button class="link rojo" data-act="cancelar" data-id="${r.id}">Cancelar</button>${pagar ? `<button class="btn" data-act="pagar" data-id="${r.id}">Pagar</button>` : `<button class="btn" data-act="verqr" data-id="${r.id}">${ico('qr', 18)} Mostrar QR</button>`}`
        : r.estado !== 'cancelada' ? `<button class="link" data-act="verqr" data-id="${r.id}">Ver comprobante</button>` : '';
      return `<div class="rcard"><div class="rc-top">${ICON[r.instId] || ''}<div class="rc-t"><b>${esc(instNombre(r.instId))}${hijos(r).length ? ' + ' + esc(instNombre(hijos(r)[0].instId)) : ''}</b><span>${fmtFL(r.fecha)} · ${esc(r.turno)}</span>${r.pers ? `<span class="rc-ex">${ico('users', 14)} ${persTxt(r.pers)} · ${vehTxt(r.veh)}</span>` : ''}</div><span class="rc-monto">${pesos(r.monto || 0)}</span></div>
        <div class="rc-foot"><div>${futura ? badgePago(r.pago) : badgeEstado(r.estado)}</div><div class="rc-acc">${acc}</div></div></div>`;
    };
    return `<div class="page-head"><h1>Mis reservas</h1></div>
    <div class="seg"><button class="${!enHist ? 'on' : ''}" data-act="mtab" data-t="prox">Próximas (${prox.length})</button><button class="${enHist ? 'on' : ''}" data-act="mtab" data-t="hist">Anteriores (${hist.length})</button></div>
    ${lista.length ? lista.map(card).join('') : `<div class="card vacio"><span class="vic">${ico(enHist ? 'list' : 'calendar', 28)}</span><p class="muted">${enHist ? 'Todavía no tenés reservas anteriores.' : 'No tenés reservas próximas.'}</p>${enHist ? '' : '<button class="btn" data-act="nuevares">Hacer una reserva</button>'}</div>`}`;
  },

  perfil() {
    const s = socioActual();
    const ini = s.nombre.split(' ').map(x => x[0]).slice(0, 2).join('');
    const links = [['credencial', 'idcard', 'Mi credencial digital', 'Mostrala en la entrada'], ['familia', 'users', 'Mi grupo familiar', s.grupo.filter(g => g.estado === 'habilitado').length + ' integrantes habilitados'], ['info', 'info', 'Información del complejo', 'Horarios, tarifas, reglamento y preguntas'], ['asistente', 'chat', 'Ayuda', 'Preguntale al asistente virtual']];
    return `<div class="page-head"><h1>Mi cuenta</h1></div>
    <div class="card perfil-head"><div class="avatar">${esc(ini)}</div><div><b>${esc(s.nombre)}</b><span>Socio N° ${s.nro} · DNI ${maskDni(s.dni)}</span></div></div>
    <div class="lista-links">${links.map(([v, i, t, d]) => `<button class="link-row" data-act="nav" data-v="${v}"><span class="lr-ic">${ico(i)}</span><span class="lr-t"><b>${t}</b><small>${d}</small></span>${ico('chevron')}</button>`).join('')}</div>
    <details class="acc"><summary>${ico('user')} Mis datos de contacto</summary><div class="cont"><form data-form="datos"><label style="margin-top:0">Correo electrónico</label><input name="email" type="email" required value="${esc(s.email)}"><label>Teléfono (WhatsApp)</label><input name="tel" inputmode="tel" value="${esc(s.tel || '')}"><button class="btn" style="margin-top:14px">Guardar</button></form></div></details>
    <details class="acc"><summary>${ico('key')} Cambiar contraseña</summary><div class="cont"><form data-form="pass"><label style="margin-top:0">Contraseña actual</label><input name="a" type="password" required autocomplete="current-password"><label>Nueva contraseña (mínimo 6 caracteres)</label><input name="n" type="password" required minlength="6" autocomplete="new-password"><label>Repetir nueva contraseña</label><input name="n2" type="password" required autocomplete="new-password"><button class="btn" style="margin-top:14px">Cambiar contraseña</button></form></div></details>
    <button class="btn ghost full" style="margin-top:8px" data-act="salir">${ico('logout', 18)} Cerrar sesión</button>`;
  },

  plano() {
    return `<div class="page-head"><h1>Plano del predio</h1><p class="sub">Tocá un sector para ver qué hay y reservarlo.</p></div>${vistaPlano(false)}`;
  },

  credencial() {
    const s = socioActual(), fam = s.grupo.filter(g => g.estado === 'habilitado');
    return `<div class="page-head"><h1>Mi credencial</h1><p class="sub">Mostrala en la entrada junto con tu DNI.</p></div>
    <div class="credencial"><div class="cmp-head" style="justify-content:center;margin:0"><div class="logo">${ico('shield')}</div><div style="text-align:left"><b>Complejo Policial Almudena</b><small style="color:#cfe7d7">Credencial de socio</small></div></div>
      <div class="qrbox"><div class="qr" data-qr="CPA-SOCIO-${s.nro}"></div></div><b style="font-size:20px;display:block">${esc(s.nombre)}</b><div style="opacity:.9">Socio N° ${s.nro}</div>
      <div class="small" style="opacity:.8;margin-top:10px">${fam.length ? 'Grupo familiar: ' + fam.map(g => esc(g.nombre)).join(', ') : 'Sin grupo familiar cargado'}</div></div>
    <p class="muted small" style="text-align:center;margin-top:14px">Para usar una instalación reservada, mostrá el QR de esa reserva (en “Mis reservas”).</p>`;
  },

  info() {
    const acc = (i, t, html, open) => `<details class="acc" ${open ? 'open' : ''}><summary>${ico(i)} ${t}</summary><div class="cont">${html}</div></details>`;
    const ul = a => '<ul>' + a.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
    const docs = S.noticias.filter(n => ['Reglamento', 'Documentación'].includes(n.tipo));
    return `<div class="page-head"><h1>Información del complejo</h1><p class="sub">Tocá un tema para ver el detalle.</p></div>
    ${acc('camera', 'Fotos del complejo', galeria(), true)}
    ${acc('clock', 'Horarios', esc(INFO.horarios))}
    ${acc('money', 'Tarifas', ul(tarifasLista().map(([n, v]) => n + ': ' + v)))}
    ${acc('card', 'Cómo pagar', `<p>Transferencia o Mercado Pago a:</p>${ul(['Alias: ' + PAGO.alias, 'CBU: ' + PAGO.cbu, 'Titular: ' + PAGO.titular])}<p>Plazo: ${PAGO.plazo}. Después informá el pago desde “Mis reservas”.</p>`)}
    ${acc('pin', 'Ubicación', esc(INFO.ubicacion))}
    ${acc('checkcircle', 'Requisitos para ingresar', ul(INFO.requisitos))}
    ${acc('book', 'Reglamento', ul(INFO.reglamento) + `<button class="btn-sm" data-act="descreg">${ico('download', 16)} Descargar</button>`)}
    ${acc('help', 'Preguntas frecuentes', FAQ.map(([q, a]) => `<p><b>${esc(q)}</b><br>${esc(a)}</p>`).join(''))}
    ${acc('doc', 'Documentación', docs.length ? docs.map(d => `<p><b>${esc(d.titulo)}</b><br>${esc(d.texto)}</p>`).join('') : '<p class="muted">No hay documentos publicados.</p>')}`;
  },

  familia() {
    const s = socioActual();
    return `<div class="page-head"><h1>Mi grupo familiar</h1><p class="sub">Las personas que pueden ingresar con vos.</p></div>
    <div class="card"><h3>Titular</h3><div class="item"><div><b>${esc(s.nombre)}</b><br><span class="small muted">Socio N° ${s.nro} · DNI ${maskDni(s.dni)}</span></div><span class="badge b-verde">Habilitado</span></div></div>
    <div class="card"><h3>Integrantes</h3>${s.grupo.length ? s.grupo.map(g => `<div class="item"><div><b>${esc(g.nombre)}</b><br><span class="small muted">${esc(g.parentesco)} · DNI ${maskDni(g.dni)}</span></div>${g.estado === 'habilitado' ? '<span class="badge b-verde">Habilitado</span>' : '<span class="badge b-amarillo">Pendiente de aprobación</span>'}</div>`).join('') : '<p class="muted">No hay integrantes cargados.</p>'}</div>
    <div class="card"><h3>Solicitar alta de un familiar</h3><p class="small muted">La administración verifica la documentación antes de habilitarlo.</p>
      <form data-form="familiar"><div class="grid2"><div><label>Nombre y apellido</label><input name="nombre" required></div><div><label>DNI</label><input name="dni" required inputmode="numeric"></div></div>
      <label>Parentesco</label><select name="parentesco"><option>Cónyuge</option><option>Hijo/a</option><option>Padre/Madre</option><option>Otro</option></select>
      <button class="btn" style="margin-top:12px">Enviar solicitud</button></form></div>`;
  },

  asistente() {
    if (!ui.chat.length) ui.chat.push({de:'bot', html:'¡Hola! Soy el asistente virtual del Complejo Policial Almudena. Puedo responderte sobre <b>horarios, tarifas, reglamento, disponibilidad, actividades, eventos, requisitos de ingreso y ubicación</b>, y guiarte para hacer una reserva. ¿En qué te ayudo?'});
    const sugs = ['¿Cómo reservo?', '¿Qué hay libre mañana?', '¿Cómo pago?', '¿Cuánto cuesta?', 'Horarios', 'Requisitos para ingresar'];
    return `<div class="page-head"><h1>Ayuda</h1><p class="sub">Escribí tu pregunta o tocá una de las sugerencias.</p></div>
    <div class="card chat"><div class="msgs" id="msgs">${ui.chat.map(m => `<div class="msg ${m.de}">${m.html}</div>`).join('')}</div>
      <div class="sugs">${sugs.map(x => `<button class="chip" data-act="preg" data-q="${esc(x)}">${esc(x)}</button>`).join('')}</div>
      <form data-form="chat" class="chatform"><input name="q" id="chatq" placeholder="Escribí tu consulta…" autocomplete="off"><button class="btn">Enviar</button></form></div>
    <p class="tiny" style="text-align:left">Versión de demostración: responde con la información cargada en el sistema.</p>`;
  },

  validar() {
    const v = ui.validacion;
    const icv = {ok:ico('checkcircle', 34), warn:ico('alert', 34), error:ico('xcircle', 34)};
    return `<div class="page-head"><h1>Validar ingreso</h1></div>
    <div class="grid2"><div class="card"><h3>Escanear código QR</h3>
      <div class="cam"><video id="video" playsinline muted></video><div class="cam-ph" id="camph">Cámara apagada</div></div>
      <button class="btn full" type="button" data-act="camara">Activar cámara</button>
      <form data-form="codigo" class="row"><input name="c" placeholder="O ingresá el código: ALM-XXXX-XXXX" autocomplete="off"><button class="btn ghost">Validar</button></form>
      <p class="small muted">Para probar: en “Ingresos de hoy” podés simular el escaneo de una reserva.</p></div>
    <div class="card resultado ${v ? v.tipo : ''}">${v ? `<div class="icono">${icv[v.tipo]}</div><h3>${esc(v.titulo)}</h3><p>${v.html}</p><p class="small muted">${fmtDT(v.t)}</p>` : '<p class="muted">El resultado de la validación aparece acá.</p>'}</div></div>`;
  },

  ingresos() {
    const h = hoy();
    const rs = S.reservas.filter(r => r.fecha === h && r.estado !== 'cancelada').sort((a, b) => inicioTurno(a.turno) - inicioTurno(b.turno));
    const dentro = rs.filter(r => r.estado === 'utilizada'), esperan = rs.filter(r => r.estado === 'confirmada');
    return `<div class="page-head"><h1>Ingresos de hoy</h1></div>
    <div class="kpis"><div class="kpi"><b>${rs.length}</b><span>Reservas del día</span></div><div class="kpi"><b>${dentro.length}</b><span>Ingresos registrados</span></div><div class="kpi"><b>${esperan.length}</b><span>Pendientes de ingreso</span></div><div class="kpi"><b>${fmtH(Date.now())}</b><span>Hora actual</span></div></div>
    <div class="card"><h3>Pendientes de ingreso</h3>${esperan.length ? esperan.map(r => `<div class="item"><div><b>${esc(instNombre(r.instId))}</b> · ${esc(r.turno)}<br><span class="small muted">${esc(nombreSocio(r.socio))} (socio ${r.socio}) · ${r.codigo}</span></div><button class="btn-sm" data-act="simular" data-c="${r.codigo}">Simular escaneo</button></div>`).join('') : '<p class="muted">No hay ingresos pendientes.</p>'}</div>
    <div class="card"><h3>Ingresos registrados</h3>${dentro.length ? dentro.map(r => `<div class="item"><div><b>${esc(instNombre(r.instId))}</b> · ${esc(r.turno)}<br><span class="small muted">${esc(nombreSocio(r.socio))} · ${r.codigo}</span></div><span class="badge b-azul">Ingresó ${r.ingreso ? fmtH(r.ingreso) : ''}</span></div>`).join('') : '<p class="muted">Todavía no se registraron ingresos.</p>'}</div>`;
  },

  panel() {
    const h = hoy(), mes = h.slice(0, 7), anio = h.slice(0, 4);
    const val = S.reservas.filter(r => r.estado !== 'cancelada');
    const hoyR = val.filter(r => r.fecha === h).sort((a, b) => inicioTurno(a.turno) - inicioTurno(b.turno));
    const espHoy = hoyR.filter(r => r.estado === 'confirmada');
    const porConf = val.filter(r => !r.padre && r.pago === 'informado').length;
    const cobrado = val.filter(r => r.pago === 'confirmado' && r.fecha.startsWith(mes)).reduce((a, r) => a + (r.monto || 0), 0);
    const libresHoy = S.inst.filter(i => i.activo && i.cupo === 1).reduce((a, i) => a + i.turnos.filter(t => !turnoPasado(h, t) && !ocup(i.id, h, t)).length, 0);
    const porInst = [['Quinchos (todos)', val.filter(r => getInst(r.instId).tipo === 'Quincho' && r.fecha.startsWith(mes)).length], ['Solo entrada', val.filter(r => r.visita && !r.instId && r.fecha.startsWith(mes)).length], ...S.inst.filter(i => i.tipo !== 'Quincho').map(i => [i.nombre, val.filter(r => r.instId === i.id && r.fecha.startsWith(mes)).length])];
    const pendFam = S.socios.reduce((a, s) => a + s.grupo.filter(g => g.estado === 'pendiente').length, 0);
    const susp = S.inst.filter(i => !i.activo);
    const tareas = [];
    if (porConf) tareas.push(['card', `${porConf} pagos para confirmar`, 'Los socios avisaron que pagaron', 'pagos']);
    const nSol = (S.solicitudes || []).filter(x => x.estado === 'pendiente').length;
    if (nSol) tareas.push(['idcard', `${nSol} solicitud${nSol > 1 ? 'es' : ''} para asociarse`, 'Personas nuevas que quieren ser socias', 'socios']);
    if (pendFam) tareas.push(['users', `${pendFam} familiar${pendFam > 1 ? 'es' : ''} para aprobar`, 'Solicitudes de grupo familiar', 'socios']);
    if (susp.length) tareas.push(['wrench', `${susp.length} instalación${susp.length > 1 ? 'es' : ''} en mantenimiento`, susp.map(i => i.nombre).join(', '), 'instalaciones']);
    const hr = new Date().getHours(), saludo = hr < 12 ? 'Buen día' : hr < 20 ? 'Buenas tardes' : 'Buenas noches';
    return `<div class="page-head"><h1>${saludo}</h1><p class="sub">${cap1(new Date().toLocaleDateString('es-AR', {weekday:'long', day:'numeric', month:'long'}))} · Resumen del complejo</p></div>
    <div class="kpis">
      <button class="kpi kpi-btn ${porConf ? 'dest' : ''}" data-act="nav" data-v="pagos"><b>${porConf}</b><span>Pagos por confirmar</span></button>
      <button class="kpi kpi-btn" data-act="nav" data-v="agenda"><b>${hoyR.length}</b><span>Reservas de hoy</span></button>
      <button class="kpi kpi-btn" data-act="nav" data-v="disponibilidad"><b>${libresHoy}</b><span>Turnos libres hoy</span></button>
      <div class="kpi"><b>${pesos(cobrado)}</b><span>Cobrado este mes</span></div></div>
    <div class="grid2"><div class="card"><h3>Para hacer</h3>${tareas.length ? `<div class="lista-links" style="box-shadow:none;margin:0">${tareas.map(([i, t, d, v]) => `<button class="link-row" data-act="nav" data-v="${v}"><span class="lr-ic">${ico(i)}</span><span class="lr-t"><b>${esc(t)}</b><small>${esc(d)}</small></span>${ico('chevron')}</button>`).join('')}</div>` : `<div class="vacio" style="padding:20px"><span class="vic">${ico('check', 28)}</span><p class="muted">Todo al día. No hay tareas pendientes.</p></div>`}</div>
      <div class="card"><div class="sec-head"><h3>Llegan hoy</h3><button class="link" data-act="nav" data-v="agenda">Ver agenda</button></div>
      ${espHoy.length ? espHoy.slice(0, 5).map(r => `<div class="item"><div style="display:flex;gap:12px;align-items:center"><span class="ii sm">${ico(ICONK[r.instId])}</span><div><b>${esc(instNombre(r.instId))}</b> · ${esc(r.turno)}<br><span class="small muted">${esc(nombreSocio(r.socio))}</span></div></div><button class="link" data-act="agdet" data-id="${r.id}">Detalle</button></div>`).join('') : '<p class="muted">No quedan ingresos para hoy.</p>'}</div></div>
    <div class="card" style="margin-top:16px"><div class="sec-head"><h3>Uso de instalaciones este mes</h3><div class="chips"><button class="btn-sm" data-act="rep" data-p="${mes}">${ico('download', 16)} Reporte mensual</button><button class="btn-sm" data-act="rep" data-p="${anio}">${ico('download', 16)} Reporte anual</button></div></div>${bars(porInst)}</div>`;
  },

  pagos() {
    const tab = ui.ptab || 'informado', q = norm(ui.pq || '');
    const G = {
      informado: S.reservas.filter(r => !r.padre && r.pago === 'informado' && r.estado !== 'cancelada'),
      pendiente: S.reservas.filter(r => !r.padre && r.pago === 'pendiente' && r.estado === 'confirmada'),
      confirmado: S.reservas.filter(r => !r.padre && r.pago === 'confirmado' && r.estado !== 'cancelada'),
      rechazado: S.reservas.filter(r => !r.padre && r.pago === 'rechazado' && r.estado !== 'cancelada')
    };
    const mes = hoy().slice(0, 7);
    const cobrado = G.confirmado.filter(r => r.fecha.startsWith(mes)).reduce((a, r) => a + (r.monto || 0), 0);
    const debe = G.pendiente.reduce((a, r) => a + (r.monto || 0), 0);
    const orden = tab === 'informado' ? (a, b) => (a.pagoInfo ? a.pagoInfo.t : 0) - (b.pagoInfo ? b.pagoInfo.t : 0) : tab === 'confirmado' ? (a, b) => b.fecha.localeCompare(a.fecha) : (a, b) => a.fecha.localeCompare(b.fecha);
    const lista = G[tab].filter(r => !q || norm(r.socio + ' ' + nombreSocio(r.socio) + ' ' + r.codigo).includes(q)).sort(orden);
    return `<div class="page-head"><h1>Pagos</h1><p class="sub">Cuando un socio avisa que pagó, aparece en “Por confirmar”. Revisá el comprobante y confirmalo si el dinero llegó.</p></div>
    <div class="kpis"><div class="kpi ${G.informado.length ? 'dest' : ''}"><b>${G.informado.length}</b><span>Por confirmar</span></div><div class="kpi"><b>${G.pendiente.length}</b><span>Sin pagar · ${pesos(debe)}</span></div><div class="kpi"><b>${pesos(cobrado)}</b><span>Cobrado este mes</span></div><div class="kpi"><b>${G.rechazado.length}</b><span>Rechazados</span></div></div>
    <div class="seg" style="max-width:720px">${[['informado', 'Por confirmar'], ['pendiente', 'Sin pagar'], ['confirmado', 'Confirmados'], ['rechazado', 'Rechazados']].map(([k, l]) => `<button class="${tab === k ? 'on' : ''}" data-act="ptab" data-t="${k}">${l} (${G[k].length})</button>`).join('')}</div>
    <form data-form="pbuscar" class="row" style="max-width:720px;margin:0 0 12px"><input name="q" value="${esc(ui.pq || '')}" placeholder="Buscar por N° de socio, nombre o código"><button class="btn ghost">Buscar</button></form>
    ${lista.length ? `<div class="card scroll"><table class="tabla"><thead><tr><th>Socio</th><th>Reserva</th><th>Monto</th><th>Estado del pago</th><th></th></tr></thead><tbody>
    ${lista.slice(0, 150).map(r => `<tr><td><b>${esc(nombreSocio(r.socio))}</b><br><span class="small muted">Socio ${r.socio}</span></td><td>${ICON[r.instId] || ''} ${esc(instNombre(r.instId))}<br><span class="small muted">${fmtF(r.fecha)} · ${esc(r.turno)}</span></td><td><b>${pesos(r.monto || 0)}</b></td>
      <td>${badgePago(r.pago)}${r.pagoInfo ? `<br><span class="small muted">${esc(r.pagoInfo.metodo)}${r.pagoInfo.operacion ? ' · Op. ' + esc(r.pagoInfo.operacion) : ''}<br>Informado ${fmtDT(r.pagoInfo.t)}</span>` : ''}${r.pagoConf ? `<br><span class="small muted">Confirmado por ${esc(r.pagoConf.usuario)} · ${fmtDT(r.pagoConf.t)}</span>` : ''}</td>
      <td style="white-space:nowrap">${botonesPago(r)}</td></tr>`).join('')}</tbody></table>${lista.length > 150 ? '<p class="small muted">Se muestran los primeros 150. Usá el buscador.</p>' : ''}</div>`
      : `<div class="card vacio"><span class="vic">${ico('check', 28)}</span><p class="muted">No hay pagos en esta lista.</p></div>`}`;
  },

  disponibilidad() {
    const dias = [...Array(14)].map((_, k) => addDays(hoy(), k));
    const libres = (i, f) => i.cupo > 1 ? i.turnos.reduce((a, t) => a + (turnoPasado(f, t) ? 0 : Math.max(0, i.cupo - ocup(i.id, f, t))), 0) : i.turnos.filter(t => !turnoPasado(f, t) && ocup(i.id, f, t) < i.cupo).length;
    const total = (i, f) => i.cupo > 1 ? i.turnos.filter(t => !turnoPasado(f, t)).length * i.cupo : i.turnos.filter(t => !turnoPasado(f, t)).length;
    const h = hoy();
    const resumen = [['Quincho', 'flame', 'Quinchos', 'turnos'], ['Cancha', 'ball', 'Canchas', 'turnos'], ['Pileta', 'waves', 'Pileta', 'lugares']].map(([t, ic, n, u]) => {
      const v = S.inst.filter(i => i.tipo === t && i.activo).reduce((a, i) => a + libres(i, h), 0);
      return `<div class="kpi" style="display:flex;gap:14px;align-items:center"><span class="ii">${ico(ic)}</span><div><b>${v}</b><span>${n}: ${u} libres hoy</span></div></div>`;
    }).join('');
    const filas = S.inst.map(i => `<tr><td><b>${esc(i.nombre)}</b>${i.cupo > 1 ? '<br><span class="small muted">lugares por día</span>' : ''}</td>${dias.map(f => {
      if (!i.activo) return `<td><button class="dc cerr" data-act="disp" data-f="${f}">—<small>mant.</small></button></td>`;
      const l = libres(i, f), tt = total(i, f), cls = !tt || !l ? 'llen' : l / tt < 0.4 ? 'poco' : 'libr';
      return `<td><button class="dc ${cls}" data-act="disp" data-f="${f}" title="${l} libres de ${tt}">${l}<small>de ${tt}</small></button></td>`;
    }).join('')}</tr>`).join('');
    return `<div class="page-head"><h1>Lugares disponibles</h1><p class="sub">Cuántos turnos quedan libres en los próximos 14 días. Tocá una casilla para ver quién reservó.</p></div>
    <div class="kpis" style="grid-template-columns:repeat(3,1fr)">${resumen}</div>
    <div class="card scroll"><table class="tabla disp"><thead><tr><th>Instalación</th>${dias.map((f, k) => { const d = new Date(f + 'T12:00'); return `<th>${k === 0 ? 'Hoy' : cap1(d.toLocaleDateString('es-AR', {weekday:'short'}).replace('.', ''))}<br>${d.getDate()}/${d.getMonth() + 1}</th>`; }).join('')}</tr></thead><tbody>${filas}</tbody></table></div>
    <div class="leyenda"><span><i style="background:var(--verdeb)"></i>Bastante lugar</span><span><i style="background:var(--amarillob)"></i>Pocos lugares</span><span><i style="background:var(--rojob)"></i>Completo</span><span><i style="background:#f3f4f6"></i>En mantenimiento</span></div>`;
  },

  agenda() {
    if (!ui.ag) ui.ag = hoy();
    const f = ui.ag;
    const filas = S.inst.map(i => {
      const celdas = i.turnos.map(t => {
        const pas = turnoPasado(f, t);
        if (i.cupo > 1) { const o = ocup(i.id, f, t); return `<button class="slot ${pas || !i.activo ? 'pas' : o >= i.cupo ? 'ocu' : 'lib'}" data-act="agpileta" data-i="${i.id}" data-t="${esc(t)}"><b>${esc(t)}</b><span>${o} de ${i.cupo} grupos</span></button>`; }
        const r = S.reservas.find(x => x.instId === i.id && x.fecha === f && x.turno === t && x.estado !== 'cancelada');
        if (r) return `<button class="slot ocu ${r.estado === 'utilizada' ? 'usada' : ''}" data-act="agdet" data-id="${r.id}" title="${esc(nombreSocio(r.socio))}"><b>${esc(t)}</b><span>${r.estado === 'utilizada' ? ico('check', 13) : icoPago(r.pago)}${esc(nombreSocio(r.socio))}</span></button>`;
        if (!i.activo) return `<div class="slot pas"><b>${esc(t)}</b><span>Suspendido</span></div>`;
        if (pas) return `<div class="slot pas"><b>${esc(t)}</b><span>Libre (pasado)</span></div>`;
        return `<button class="slot lib" data-act="agnueva" data-i="${i.id}" data-t="${esc(t)}"><b>${esc(t)}</b><span>+ Reservar</span></button>`;
      }).join('');
      const usados = i.turnos.filter(t => ocup(i.id, f, t) >= i.cupo).length;
      return `<div class="agfila"><div class="agnom">${ICON[i.id]}<div><b>${esc(i.nombre)}</b><br><span class="small muted">${i.activo ? `${usados} de ${i.turnos.length} ${i.cupo > 1 ? 'turnos completos' : 'ocupados'}` : '<span class="badge b-rojo">Mantenimiento</span>'}</span></div></div><div class="agslots">${celdas}</div></div>`;
    }).join('');
    return `<div class="page-head"><h1>Agenda del día</h1><p class="sub">Tocá un turno libre para reservarlo, o uno ocupado para ver el detalle.</p></div>
    <div class="card agbar"><button class="btn-sm" data-act="agdia" data-d="-1">‹ Día anterior</button><button class="btn-sm" data-act="aghoy">Hoy</button><button class="btn-sm" data-act="agdia" data-d="1">Día siguiente ›</button><input type="date" id="agfecha" value="${f}" style="width:auto"><b class="agtit">${fmtFL(f)}</b></div>
    <div class="leyenda" style="margin:0 0 12px"><span><i style="background:var(--verdeb);border:1px solid #a7e0bd"></i>Libre</span><span><i style="background:#fff3d6;border:1px solid #f0d58c"></i>Reservado</span><span><i style="background:var(--celeste);border:1px solid #b9dcc4"></i>Ya ingresó</span><span><i style="background:#f3f4f6"></i>Pasado o suspendido</span><span>Pago: <i class="dot d-amarillo"></i> pendiente <i class="dot d-azul"></i> en revisión <i class="dot d-verde"></i> pagado</span></div>
    <div class="card">${filas}</div>`;
  },

  reservas() {
    const h = hoy();
    if (!ui.f) ui.f = {desde:addDays(h, -7), hasta:addDays(h, 30), inst:'', estado:'', q:''};
    const f = ui.f;
    const rs = filtrarReservas();
    const rap = [['hoy', 'Hoy'], ['semana', 'Próximos 7 días'], ['mes', 'Este mes'], ['futuras', 'Todas las próximas'], ['canceladas', 'Canceladas']];
    return `<div class="page-head"><h1>Reservas</h1><p class="sub">Buscá por socio, código o fecha.</p></div>
    <div class="chips" style="margin-bottom:12px">${rap.map(([k, l]) => `<button class="chip ${ui.frap === k ? 'on' : ''}" data-act="frap" data-k="${k}">${l}</button>`).join('')}</div>
    <div class="card"><form data-form="filtro" class="filtros">
      <div><label>Desde</label><input type="date" name="desde" value="${f.desde}"></div>
      <div><label>Hasta</label><input type="date" name="hasta" value="${f.hasta}"></div>
      <div><label>Instalación</label><select name="inst"><option value="">Todas</option>${S.inst.map(i => `<option value="${i.id}" ${f.inst === i.id ? 'selected' : ''}>${esc(i.nombre)}</option>`).join('')}</select></div>
      <div><label>Estado</label><select name="estado"><option value="">Todos</option>${['confirmada','utilizada','cancelada'].map(e => `<option ${f.estado === e ? 'selected' : ''}>${e}</option>`).join('')}</select></div>
      <div><label>Socio / código</label><input name="q" value="${esc(f.q)}" placeholder="N°, nombre o código"></div>
      <div><button class="btn">Filtrar</button></div></form></div>
    <div class="card"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><h3 style="margin:0">${rs.length} reservas</h3><button class="btn-sm" data-act="exportar">Exportar CSV</button></div>
    <div class="scroll"><table class="tabla"><thead><tr><th>Código</th><th>Socio</th><th>Instalación</th><th>Fecha</th><th>Turno</th><th>Estado</th><th>Pago</th><th></th></tr></thead><tbody>
    ${rs.slice(0, 200).map(r => `<tr><td style="font-family:monospace">${r.codigo}</td><td>${r.socio}<br><span class="small muted">${esc(nombreSocio(r.socio))}</span></td><td>${esc(instNombre(r.instId))}</td><td>${fmtF(r.fecha)}</td><td>${esc(r.turno)}</td><td>${badgeEstado(r.estado)}</td><td>${r.estado !== 'cancelada' ? badgePago(r.pago) : ''}</td>
      <td style="white-space:nowrap"><button class="btn-sm" data-act="agdet" data-id="${r.id}">Detalle</button></td></tr>`).join('')}
    </tbody></table></div>${rs.length > 200 ? '<p class="small muted">Se muestran las primeras 200. Usá los filtros o exportá para ver todas.</p>' : ''}</div>`;
  },

  nueva() {
    const p = ui.pref || {}; ui.pref = null;
    const inst = getInst(p.inst || S.inst[0].id), fecha = p.fecha || hoy();
    return `<div class="page-head"><h1>Nueva reserva</h1><p class="sub">Para socios que reservan por teléfono o en persona. Se aplican las mismas reglas que en la web.</p></div>
    <div class="grid2" style="align-items:start"><div class="card"><form data-form="nueva">
      <label style="margin-top:0">1. N° de socio</label><input name="nro" id="n_nro" required inputmode="numeric" placeholder="Ej: 1001" autocomplete="off"><div id="n_socio" class="small muted" style="margin-top:6px">Escribí el número para buscar al socio.</div>
      <label>2. Instalación</label><select name="inst" id="n_inst">${S.inst.map(i => `<option value="${i.id}" ${i.id === inst.id ? 'selected' : ''} ${i.activo ? '' : 'disabled'}>${esc(i.nombre)}${i.activo ? '' : ' (mantenimiento)'}</option>`).join('')}</select>
      <label>3. Fecha</label><input type="date" name="fecha" id="n_fecha" required min="${hoy()}" value="${fecha}">
      <label>4. Turno</label><select name="turno" id="n_turno">${turnoOpts(inst, fecha, p.turno)}</select>
      <label class="check" style="margin-top:14px"><input type="checkbox" name="efec" value="1"> <span>El socio ya pagó en efectivo</span></label>
      <button class="btn grande" style="margin-top:14px">Registrar reserva</button></form></div>
    <div class="card"><h3>Cómo funciona</h3><ul class="small" style="padding-left:18px;line-height:1.7"><li>Al escribir el número se muestra el nombre del socio y si su cuenta está activa.</li><li>Los turnos ocupados o pasados aparecen como “no disponible”.</li><li>Se permite una reserva por tipo de instalación y por día para cada socio.</li><li>Al registrar se genera el comprobante con QR para imprimir o enviar al socio.</li></ul>
      <button class="btn ghost full" data-act="nav" data-v="agenda">${ico('clock', 18)} Ver la agenda del día</button></div></div>`;
  },

  instalaciones() {
    const T = S.tarifas;
    return `<div class="page-head"><h1>Instalaciones y tarifas</h1></div>
    <div class="card"><h3>Tarifas de entrada</h3><p class="small muted" style="margin-top:-6px">Se cobran por persona y por vehículo en cada reserva.</p>
      <div class="filtros" style="grid-template-columns:repeat(4,1fr)">${[['adulto', 'Adulto (13+)'], ['menor', 'Menor (6 a 12)'], ['auto', 'Auto / camioneta'], ['moto', 'Moto']].map(([k, l]) => `<div><label>${l}</label><input type="number" min="0" step="100" data-tarifa-e="${k}" value="${T[k]}"></div>`).join('')}</div></div>
    <div class="card scroll"><table class="tabla"><thead><tr><th>Instalación</th><th>Tipo</th><th>Turnos</th><th>Tarifa</th><th>Estado</th></tr></thead><tbody>
    ${S.inst.map(i => `<tr><td style="display:flex;align-items:center;gap:12px">${FOTO_I[i.id] ? `<img class="thumb" src="${foto(FOTO_I[i.id])}" alt="">` : `<span class="thumb foto-ph">${ico(ICONK[i.id], 18)}</span>`}<div><b>${esc(i.nombre)}</b><br><span class="small muted">${esc(i.cap)}</span></div></td><td>${i.tipo}</td><td>${i.turnos.length}${i.cupo > 1 ? ` (cupo ${i.cupo})` : ''}</td>
      <td><input type="number" style="width:120px" data-tarifa="${i.id}" value="${i.tarifa}" min="0" step="500"></td>
      <td>${i.activo ? '<span class="badge b-verde">Habilitada</span>' : '<span class="badge b-rojo">Mantenimiento</span>'}<br><button class="btn-sm" style="margin-top:6px" data-act="toggleinst" data-id="${i.id}">${i.activo ? 'Suspender' : 'Habilitar'}</button></td></tr>`).join('')}
    </tbody></table><p class="small muted">Al suspender una instalación se bloquean automáticamente las nuevas reservas y podés publicar el aviso en Comunicados.</p></div>`;
  },

  comunicados() {
    return `<div class="page-head"><h1>Comunicados</h1></div>
    <div class="card"><h3>Nueva publicación</h3><form data-form="noticia">
      <div class="grid2"><div><label>Tipo</label><select name="tipo">${TIPOS_NOT.map(t => `<option>${t}</option>`).join('')}</select></div><div><label>Título</label><input name="titulo" required maxlength="120"></div></div>
      <label>Texto</label><textarea name="texto" required></textarea>
      <button class="btn" style="margin-top:12px">Publicar</button></form></div>
    <h3 class="sec">Publicadas</h3>${listaNoticias(true)}`;
  },

  socios() {
    const pend = [];
    S.socios.forEach(s => s.grupo.forEach((g, gi) => { if (g.estado === 'pendiente') pend.push({s, g, gi}); }));
    const q = norm(ui.q || '');
    const lista = S.socios.filter(s => !q || norm(s.nombre + ' ' + s.nro + ' ' + s.dni).includes(q));
    const sinCuenta = S.padron.filter(p => !S.socios.some(s => s.nro === p.nro)).length;
    const sols = (S.solicitudes || []).filter(x => x.estado === 'pendiente');
    return `<div class="page-head"><h1>Socios</h1></div>
    <div class="card"><h3>Solicitudes para asociarse (${sols.length})</h3>${sols.length ? sols.map(x => `<div class="item"><div style="display:flex;gap:12px;align-items:center">${x.img ? `<img class="thumb" src="${x.img}" alt="DNI" data-act="verdni" data-id="${x.id}" style="cursor:zoom-in">` : `<span class="thumb foto-ph">${ico('idcard', 18)}</span>`}<div><b>${esc(x.nombre)}</b> · DNI ${esc(x.dni)}<br><span class="small muted">${esc(x.cond)}${x.legajo ? ' · Legajo ' + esc(x.legajo) : ''} · ${esc(x.email)} · ${esc(x.tel)} · ${fmtDT(x.t)}</span></div></div><div class="acc"><button class="btn-sm ok" data-act="solok" data-id="${x.id}">${ico('check', 16)} Aprobar</button><button class="btn-sm rojo" data-act="solno" data-id="${x.id}">Rechazar</button></div></div>`).join('') : '<p class="muted">No hay solicitudes nuevas.</p>'}</div>
    <div class="card"><h3>Solicitudes de grupo familiar (${pend.length})</h3>${pend.length ? pend.map(p => `<div class="item"><div><b>${esc(p.g.nombre)}</b> · ${esc(p.g.parentesco)} · DNI ${esc(p.g.dni)}<br><span class="small muted">Titular: ${esc(p.s.nombre)} (socio ${p.s.nro})</span></div><div class="acc"><button class="btn-sm" data-act="aprobar" data-n="${p.s.nro}" data-i="${p.gi}">Aprobar</button><button class="btn-sm rojo" data-act="rechazar" data-n="${p.s.nro}" data-i="${p.gi}">Rechazar</button></div></div>`).join('') : '<p class="muted">No hay solicitudes pendientes.</p>'}</div>
    <div class="card"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center"><h3 style="margin:0">Socios con cuenta (${S.socios.length})</h3><span class="small muted">En padrón sin cuenta: ${sinCuenta}</span></div>
    <form data-form="buscarsocio" class="row"><input name="q" value="${esc(ui.q || '')}" placeholder="Buscar por nombre, N° o DNI"><button class="btn ghost">Buscar</button></form>
    <div class="scroll"><table class="tabla" style="margin-top:10px"><thead><tr><th>N°</th><th>Nombre</th><th>DNI</th><th>Contacto</th><th>Grupo</th><th>Estado</th><th></th></tr></thead><tbody>
    ${lista.map(s => `<tr><td>${s.nro}</td><td>${esc(s.nombre)}</td><td>${esc(s.dni)}</td><td>${esc(s.email)}<br><span class="small muted">${esc(s.tel || '')}</span></td><td>${s.grupo.filter(g => g.estado === 'habilitado').length}</td><td>${s.activo === false ? '<span class="badge b-rojo">Suspendida</span>' : '<span class="badge b-verde">Activa</span>'}</td>
      <td style="white-space:nowrap"><button class="btn-sm" data-act="togglesocio" data-n="${s.nro}">${s.activo === false ? 'Habilitar' : 'Suspender'}</button> <button class="btn-sm" data-act="resetpass" data-n="${s.nro}">Restablecer clave</button></td></tr>`).join('')}
    </tbody></table></div></div>`;
  },

  seguridad() {
    let bks = []; try { bks = JSON.parse(localStorage.getItem(KEY + '_bk') || '[]'); } catch (e) {}
    const fallos = S.auditoria.filter(a => /fallido|Bloqueo|inexistente|inactividad/.test(a.accion)).slice(-10).reverse();
    return `<div class="page-head"><h1>Seguridad</h1></div>
    <div class="grid2"><div class="card"><h3>Copias de seguridad automáticas</h3><p class="small muted">El sistema genera una copia diaria automática y guarda las últimas 3.</p>
      ${bks.length ? bks.slice().reverse().map((b, i) => `<div class="item"><div><b>${fmtDT(b.t)}</b><br><span class="small muted">${Math.round(b.data.length / 1024)} KB</span></div><button class="btn-sm" data-act="restbk" data-i="${bks.length - 1 - i}">Restaurar</button></div>`).join('') : '<p class="muted">Sin copias todavía.</p>'}
      <div class="chips" style="margin-top:12px"><button class="btn" data-act="backup">Crear copia ahora</button><button class="btn ghost" data-act="descbk">Descargar copia (.json)</button></div>
      <label>Restaurar desde un archivo</label><input type="file" id="restfile" accept=".json,application/json"></div>
    <div class="card"><h3>Medidas activas</h3><ul class="small" style="padding-left:18px;line-height:1.6">
      <li>Permisos por nivel de usuario: socio, portería y administrador.</li><li>Bloqueo de 5 minutos tras 5 intentos de ingreso fallidos.</li><li>Cierre automático de sesión tras 15 minutos de inactividad.</li><li>Registro de auditoría de todas las operaciones.</li><li>Consentimiento de protección de datos personales (Ley 25.326) al registrarse.</li><li>DNI enmascarado en las vistas del socio.</li><li>En producción: HTTPS obligatorio y contraseñas cifradas en el servidor.</li></ul>
      <h3 style="margin-top:14px">Envío de correos</h3>
      ${correoReal() ? `<div class="ok" style="margin-top:0">Envío real activado (${usaGAS() ? 'Gmail del complejo, gratis' : 'EmailJS'}).</div>` : `<div class="err" style="margin-top:0;background:var(--amarillob);color:var(--amarillo)">Envío real desactivado: los correos solo se ven en la vista previa. Falta completar <b>config.js</b> (ver correo/Codigo.gs).</div>`}
      <form data-form="mailprueba" class="row"><input name="to" type="email" required placeholder="Correo para probar"><button class="btn ghost">Enviar prueba</button></form>
      <h3 style="margin-top:14px">Correos enviados</h3>${(S.correos || []).slice(-6).reverse().map(c => `<div class="item" style="padding:8px 0"><div class="small"><b>${esc(c.asunto)}</b><br><span class="muted">${esc(enmascarar(c.para))} · ${fmtDT(c.t)} · ${({enviado:'Enviado ✓', error:'Error al enviar', enviando:'Enviando…', simulado:'Solo vista previa'})[c.estadoEnvio] || 'Solo vista previa'}</span></div><button class="link" data-act="vercorreo" data-id="${c.id}">Ver</button></div>`).join('') || '<p class="muted small">Todavía no se enviaron correos.</p>'}
      <h3 style="margin-top:14px">Eventos de seguridad recientes</h3>${fallos.length ? fallos.map(a => `<div class="small" style="padding:4px 0;border-bottom:1px solid var(--borde)">${fmtDT(a.t)} · ${esc(a.usuario)} · ${esc(a.accion)}</div>`).join('') : '<p class="muted small">Sin eventos.</p>'}</div></div>
    <div class="card" style="margin-top:14px"><h3>Usuarios del personal</h3>
      <div class="scroll"><table class="tabla"><thead><tr><th>Usuario</th><th>Nombre</th><th>Nivel</th><th>Estado</th><th></th></tr></thead><tbody>
      ${S.staff.map(u => `<tr><td>${esc(u.user)}</td><td>${esc(u.nombre)}</td><td>${u.rol === 'admin' ? 'Administrador' : 'Portería'}</td><td>${u.activo === false ? '<span class="badge b-rojo">Suspendido</span>' : '<span class="badge b-verde">Activo</span>'}</td><td>${u.user === ses.user ? '<span class="small muted">(vos)</span>' : `<button class="btn-sm" data-act="togglestaff" data-u="${esc(u.user)}">${u.activo === false ? 'Habilitar' : 'Suspender'}</button>`}</td></tr>`).join('')}
      </tbody></table></div>
      <form data-form="staff" class="filtros" style="margin-top:12px;grid-template-columns:repeat(4,1fr) auto"><div><label>Usuario</label><input name="user" required></div><div><label>Nombre</label><input name="nombre" required></div><div><label>Nivel</label><select name="rol"><option value="porteria">Portería</option><option value="admin">Administrador</option></select></div><div><label>Contraseña</label><input name="pass" type="password" required minlength="6"></div><div><button class="btn">Agregar</button></div></form></div>`;
  },

  auditoria() {
    const a = S.auditoria.slice().reverse().slice(0, 300);
    return `<div class="page-head"><h1>Auditoría</h1></div><div class="card scroll"><p class="small muted">Cada operación queda registrada con fecha, hora y usuario.</p>
    <table class="tabla"><thead><tr><th>Fecha y hora</th><th>Usuario</th><th>Operación</th></tr></thead><tbody>
    ${a.map(x => `<tr><td style="white-space:nowrap">${fmtDT(x.t)}</td><td>${esc(x.usuario)}</td><td>${esc(x.accion)}</td></tr>`).join('')}</tbody></table></div>`;
  }
};

function calendario(estFn) {
  const [y, m] = ui.mes.split('-').map(Number);
  const first = new Date(y, m - 1, 1), start = (first.getDay() + 6) % 7, dias = new Date(y, m, 0).getDate();
  let h = `<div class="cal-head"><button type="button" data-act="mes" data-d="-1" ${ui.mes <= hoy().slice(0, 7) ? 'disabled' : ''}>‹</button><b>${cap1(first.toLocaleDateString('es-AR', {month:'long', year:'numeric'}))}</b><button type="button" data-act="mes" data-d="1">›</button></div><div class="cal">`;
  h += ['L','M','M','J','V','S','D'].map(x => `<div class="dow">${x}</div>`).join('');
  for (let i = 0; i < start; i++) h += '<div></div>';
  for (let d = 1; d <= dias; d++) {
    const f = y + '-' + z(m) + '-' + z(d), e = estFn(f), off = ['pasado','fuera','cerrado','lleno'].includes(e);
    h += `<button type="button" class="dia ${off ? '' : e} ${ui.wiz.dia === f ? 'sel' : ''}" data-act="dia" data-f="${f}" ${off ? 'disabled' : ''}>${d}</button>`;
  }
  return h + '</div>';
}

function turnoOpts(inst, fecha, sel) {
  return inst.turnos.map(t => { const no = !fecha || turnoPasado(fecha, t) || ocup(inst.id, fecha, t) >= inst.cupo; return `<option value="${esc(t)}" ${no ? 'disabled' : ''} ${t === sel ? 'selected' : ''}>${esc(t)}${no ? ' — no disponible' : inst.cupo > 1 ? ` — ${inst.cupo - ocup(inst.id, fecha, t)} lugares` : ' — libre'}</option>`; }).join('');
}
function filtrarReservas() {
  const f = ui.f, q = norm(f.q || '');
  return S.reservas.filter(r => !r.padre && (!f.desde || r.fecha >= f.desde) && (!f.hasta || r.fecha <= f.hasta) && (!f.inst || r.instId === f.inst) && (!f.estado || r.estado === f.estado)
    && (!q || norm(r.socio + ' ' + r.codigo + ' ' + nombreSocio(r.socio)).includes(q))).sort((a, b) => a.fecha.localeCompare(b.fecha) || inicioTurno(a.turno) - inicioTurno(b.turno));
}

function exportCSV(rows, nombre) {
  const head = ['Código','N° socio','Nombre','Lugar','Tipo','Fecha','Turno','Personas','Vehículos','Estado','Monto','Pago','Medio de pago','Creada','Ingreso'];
  const lines = [head, ...rows.map(r => [r.codigo, r.socio, nombreSocio(r.socio), instNombre(r.instId), getInst(r.instId).tipo, fmtF(r.fecha), r.turno, persTxt(r.pers), r.pers ? vehTxt(r.veh) : '', r.estado, r.monto || 0, r.pago || '', r.pagoInfo ? r.pagoInfo.metodo : '', fmtDT(r.creada), r.ingreso ? fmtDT(r.ingreso) : ''])]
    .map(l => l.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(';')).join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + lines], {type:'text/csv;charset=utf-8'}));
  a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
  log('Exportó ' + nombre + ' (' + rows.length + ' registros)');
  toast('Archivo exportado: ' + nombre);
}

/* ===================== Historial (botón Atrás) ===================== */
let navStack = [], navActual = null, navRestaurando = false;
const NOMBRES = {novedades:'Novedades', plano:'Plano del predio', credencial:'Mi credencial', info:'Información', familia:'Mi grupo familiar', asistente:'Ayuda', nueva:'Nueva reserva',
  sitio:'Inicio', login:'Ingresar', registro:'Crear cuenta', recuperar:'Recuperar acceso', enviado:'Recuperar acceso', solenviada:'Solicitud', nuevaclave:'Nueva contraseña'};
const PASOS = ['Fecha y horario', 'Personas', 'Lugar', 'Pago'];
function navSnap() {
  const quien = ses ? ses.rol + ':' + (ses.nro || ses.user) : 'out';
  const paso = ses && ui.view === 'reservar' && ui.wiz ? ui.wiz.paso : 0;
  return {k:[quien, ses ? ui.view : ui.acceso, paso].join('|'), quien, view:ui.view, acceso:ui.acceso, paso};
}
function navNombre(s) {
  if (!s) return '';
  if (s.quien === 'out') return NOMBRES[s.acceso] || 'Anterior';
  if (s.view === 'reservar' && s.paso) return 'Paso ' + s.paso + ': ' + PASOS[s.paso - 1];
  const n = ses && (NAV[ses.rol] || []).find(x => x[0] === s.view);
  return n ? n[1] : (NOMBRES[s.view] || 'Anterior');
}
function navRegistrar() {
  const s = navSnap();
  if (navActual && navActual.quien !== s.quien) navStack = [];
  else if (!navRestaurando && navActual && navActual.k !== s.k) { navStack.push(navActual); if (navStack.length > 40) navStack.shift(); try { history.pushState({n:navStack.length}, ''); } catch (e) {} }
  navActual = s;
}
function navAtras() {
  const prev = navStack.pop(); if (!prev) return;
  navRestaurando = true;
  ui.view = prev.view; ui.acceso = prev.acceso; ui.msg = null;
  if (prev.paso && ui.wiz) ui.wiz.paso = prev.paso;
  closeModal(); render(); window.scrollTo(0, 0);
  navRestaurando = false;
}
window.addEventListener('popstate', () => { if (navStack.length) navAtras(); });
const barraAtras = () => navStack.length ? `<div class="atras-bar"><button class="atras" data-act="atras" aria-label="Volver atrás">${ico('back', 18)}<span>Atrás</span></button><span class="atras-a">Volver a <b>${esc(navNombre(navStack[navStack.length - 1]))}</b></span></div>` : '';

/* ===================== Render ===================== */
function render() {
  detenerCamara();
  const app = $('#app');
  document.body.classList.toggle('con-bottom', !!ses && ses.rol === 'socio');
  document.body.classList.toggle('en-reserva', !!ses && ui.view === 'reservar');
  navRegistrar();
  if (!ses) { app.innerHTML = vistaAcceso(); return; }
  const navAct = {familia:'perfil', credencial:'perfil', info:'perfil', novedades:'inicio', plano:'inicio', asistente:'', nueva:'reservas'}[ui.view] ?? ui.view;
  const nomCorto = ses.rol === 'socio' ? socioActual().nombre : S.staff.find(s => s.user === ses.user).nombre;
  const rolTxt = ses.rol === 'socio' ? 'Socio N° ' + ses.nro : ses.rol === 'admin' ? 'Administrador' : 'Portería';
  const ini = nomCorto.split(' ').map(x => x[0]).slice(0, 2).join('');
  const items = NAV[ses.rol];
  const pend = ses.rol === 'admin' ? S.reservas.filter(r => !r.padre && r.pago === 'informado' && r.estado !== 'cancelada').length : 0;
  const cnt = k => k === 'pagos' && pend ? `<span class="cnt">${pend}</span>` : '';
  const logo = `<div class="logo">${ico('shield')}</div>`;
  const cta = ses.rol === 'admin' ? `<button class="btn full side-cta" data-act="nav" data-v="nueva">${ico('plus', 18)} Nueva reserva</button>` : '';
  const side = `<aside class="side"><div class="marca">${logo}<div><b>Complejo Almudena</b><small>${ses.rol === 'socio' ? 'Reservas para socios' : 'Administración'}</small></div></div>${cta}
    <nav class="snav">${items.map(([k, l]) => k === '_' ? `<div class="sgrupo">${l}</div>` : `<button class="sitem ${navAct === k ? 'on' : ''}" data-act="nav" data-v="${k}">${ico(ICONOS[k])}<span>${l}</span>${cnt(k)}</button>`).join('')}</nav>
    <div class="suser"><div class="avatar sm">${esc(ini)}</div><div class="suser-t"><b>${esc(nomCorto)}</b><small>${rolTxt}</small></div><button class="icon-btn" data-act="salir" title="Cerrar sesión" aria-label="Cerrar sesión">${ico('logout', 18)}</button></div></aside>`;
  const top = `<header class="top"><div class="marca">${logo}<div><b>Complejo Almudena</b><small>${esc(rolTxt)}</small></div></div>${ses.rol !== 'socio' ? `<button class="icon-btn" data-act="salir" aria-label="Cerrar sesión">${ico('logout', 18)}</button>` : ''}</header>`;
  const tabs = `<nav class="tabs ${ses.rol === 'socio' ? 'socio' : ''}">${items.filter(n => n[0] !== '_').map(([k, l]) => `<button class="tab ${navAct === k ? 'on' : ''}" data-act="nav" data-v="${k}">${ico(ICONOS[k], 22)}<span>${l}</span>${cnt(k)}</button>`).join('')}</nav>`;
  const fab = ses.rol === 'socio' && ui.view !== 'asistente' ? `<button class="fab" data-act="nav" data-v="asistente" aria-label="Ayuda">${ico('chat', 22)}<span>¿Necesitás ayuda?</span></button>` : '';
  app.innerHTML = `<div class="layout">${side}<div class="contenido">${top}${tabs}<main>${barraAtras()}${V[ui.view]()}</main></div></div>${fab}`;
  pintarQR();
  const m = $('#msgs'); if (m) m.scrollTop = m.scrollHeight;
}

/* ===================== Asistente (reglas) ===================== */
function responder(qRaw) {
  const q = norm(qRaw);
  const has = re => re.test(q);
  const lista = arr => '<ul>' + arr.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
  if (has(/^(hola|buen(os|as)|que tal)/)) return '¡Hola! Contame qué necesitás: reservar, consultar tarifas, horarios o disponibilidad.';
  if (has(/cancel/)) return 'Para cancelar: entrá a <b>Mis reservas</b> y tocá “Cancelar” en la reserva. Te pedimos hacerlo con al menos 24 h de anticipación para liberar el turno.<br><button class="btn" data-act="nav" data-v="mis">Ir a Mis reservas</button>';
  if (has(/libre|disponib|hay lugar|hay turno|ocupad/)) {
    const dias = has(/manana/) ? [addDays(hoy(), 1)] : has(/hoy/) ? [hoy()] : [hoy(), addDays(hoy(), 1)];
    let h = '';
    dias.forEach(f => {
      h += `<b>${fmtFL(f)}</b><ul>`;
      FRANJAS.forEach(fr => { const lib = quinchosLibres(f, fr.id); h += `<li>${fr.t} (${fr.h}): ${turnoPasado(f, fr.turno) ? 'ya comenzó' : lib ? lib + ' quinchos libres' : 'sin quinchos libres'}</li>`; });
      h += '</ul>';
    });
    return h + '<button class="btn" data-act="nuevares">Reservar</button>';
  }
  if (has(/reserv|como (hago|alquilo)|quiero (un|una|el|la)|alquil|turno|quincho/)) return 'Reservar es muy simple, en 4 pasos:<ol><li><b>Fecha y horario:</b> elegí el día y si venís al mediodía, a la tarde o a la noche.</li><li><b>Personas:</b> indicá cuántos adultos y menores vienen, y si venís en vehículo.</li><li><b>Lugar:</b> en el mapa del predio tocá el quincho libre que quieras (en verde). Si querés, sumá una cancha.</li><li><b>Pago:</b> pagá con Mercado Pago o por transferencia.</li></ol>Al terminar recibís tu QR para mostrar en la entrada.<br><button class="btn" data-act="nuevares">Empezar a reservar</button>';
  if (has(/pago|pagar|transfer|alias|cbu|mercado ?pago|abonar|comprobante de pago/)) return `Podés pagar por transferencia o Mercado Pago:<ul><li>Alias: <b>${PAGO.alias}</b></li><li>CBU: ${PAGO.cbu}</li><li>Titular: ${esc(PAGO.titular)}</li></ul>Plazo: ${PAGO.plazo}. Después entrá a <b>Mis reservas</b>, tocá “Pagar” y enviá la foto del comprobante. La administración lo confirma y tu reserva queda como “Pagado”.<br><button class="btn" data-act="nav" data-v="mis">Ir a Mis reservas</button>`;
  if (has(/tarifa|precio|cuesta|costo|valor|sale|vehiculo|auto|persona/)) return 'Tarifas vigentes:' + lista(tarifasLista().map(([n, v]) => n + ': ' + v)) + 'Al reservar, el sistema calcula el total según las personas, los vehículos y el lugar que elijas.';
  if (has(/horario|hora|abre|abren|cierra|atencion/)) return esc(INFO.horarios);
  if (has(/reglamento|norma|regla|permit|mascota|perro|alcohol|prohib/)) return 'Puntos principales del reglamento:' + lista(INFO.reglamento) + 'El reglamento completo está publicado en Comunicados.';
  if (has(/credencial|carnet/)) return 'Tu credencial digital está en <b>Mi cuenta → Mi credencial</b>. Mostrala en la portería junto con tu DNI.<br><button class="btn" data-act="nav" data-v="credencial">Ver mi credencial</button>';
  if (has(/pregunta|frecuente|faq|dudas/)) return 'Preguntas frecuentes:' + FAQ.map(([p, r]) => `<p style="margin:6px 0"><b>${esc(p)}</b><br>${esc(r)}</p>`).join('');
  if (has(/requisito|ingres|entrar|invitad|document|revisacion/)) return 'Requisitos para ingresar:' + lista(INFO.requisitos);
  if (has(/donde|ubicacion|direccion|llegar|queda|mapa/)) return esc(INFO.ubicacion);
  if (has(/evento|torneo|fiesta|campeonato/)) { const ev = S.noticias.filter(n => n.tipo === 'Evento'); return ev.length ? 'Próximos eventos:' + lista(ev.map(e => e.titulo + ': ' + e.texto)) : 'Por el momento no hay eventos publicados.'; }
  if (has(/actividad|deporte|futbol|padel|voley|pileta|natacion|quincho/)) return 'En el complejo podés usar:' + lista(S.inst.map(i => `${i.nombre} (${i.cap})${i.activo ? '' : ' – suspendida temporalmente'}`)) + '¿Querés que te diga qué hay libre hoy o mañana?';
  if (has(/noticia|novedad|comunicado|aviso|clima|lluvia|tormenta|mantenimiento/)) { const ns = S.noticias.slice().sort((a, b) => b.fecha - a.fecha).slice(0, 3); return 'Últimas publicaciones:' + lista(ns.map(n => `[${n.tipo}] ${n.titulo}`)) + '<button class="btn" data-act="nav" data-v="novedades">Ver todas</button>'; }
  if (has(/familia|grupo|hijo|esposa|conyuge/)) return 'Podés ver y solicitar altas de tu grupo familiar en <b>Grupo familiar</b>. La administración aprueba cada integrante antes de habilitarlo.<br><button class="btn" data-act="nav" data-v="familia">Ir a Grupo familiar</button>';
  if (has(/contrasen|clave|password/)) return 'Si olvidaste tu contraseña, en la pantalla de ingreso tocá “Olvidé mi contraseña” y te llega un enlace de un solo uso a tu correo registrado.';
  if (has(/gracias/)) return '¡De nada! Si necesitás algo más, acá estoy.';
  return 'No estoy seguro de haber entendido. Puedo ayudarte con: horarios, tarifas, reglamento, disponibilidad, actividades, eventos, requisitos de ingreso, ubicación, noticias y cómo reservar.';
}
function preguntar(q) {
  if (!q.trim()) return;
  ui.chat.push({de:'yo', html:esc(q)});
  ui.chat.push({de:'bot', html:responder(q)});
  render();
  const i = $('#chatq'); if (i) i.focus();
}

/* ===================== Portería ===================== */
let stream = null, scanTimer = null;
async function iniciarCamara() {
  if (!('BarcodeDetector' in window)) { toast('Este navegador no lee QR con la cámara. Usá Chrome en Android o ingresá el código.', 'error'); return; }
  try {
    stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
    const v = $('#video'); v.srcObject = stream; await v.play(); $('#camph').style.display = 'none';
    const det = new BarcodeDetector({formats:['qr_code']});
    scanTimer = setInterval(async () => { try { const c = await det.detect(v); if (c.length) validar(c[0].rawValue); } catch (e) {} }, 400);
  } catch (e) { toast('No se pudo acceder a la cámara.', 'error'); }
}
function detenerCamara() { clearInterval(scanTimer); scanTimer = null; if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; } }
function validar(codigo) {
  const c = String(codigo).trim().toUpperCase();
  const r = S.reservas.find(x => x.codigo === c);
  let v;
  if (c.startsWith('CPA-SOCIO-')) {
    const s = S.socios.find(x => x.nro === c.slice(10));
    if (!s) { v = {tipo:'error', titulo:'Credencial inválida', html:'El número de socio no existe.'}; log('Credencial inválida: ' + c); }
    else if (s.activo === false) { v = {tipo:'error', titulo:'Cuenta suspendida', html:`<b>${esc(s.nombre)}</b> (socio ${s.nro})<br>La cuenta del socio está suspendida.`}; log('Credencial de cuenta suspendida: ' + c); }
    else {
      const rh = S.reservas.filter(x => x.socio === s.nro && x.fecha === hoy() && x.estado === 'confirmada');
      const fam = s.grupo.filter(g => g.estado === 'habilitado');
      v = {tipo:'ok', titulo:'Socio verificado', html:`<b>${esc(s.nombre)}</b> (socio ${s.nro})<br>Grupo familiar: ${fam.length ? fam.map(g => esc(g.nombre)).join(', ') : 'ninguno'}<br>${rh.length ? 'Reservas de hoy: ' + rh.map(x => esc(instNombre(x.instId) + ' ' + x.turno)).join(', ') + '<br><span class="small">Para habilitar la instalación escaneá el QR de la reserva.</span>' : 'Sin reservas para hoy.'}`};
      log('Credencial de socio verificada: ' + c);
    }
  }
  else if (!r) { v = {tipo:'error', titulo:'QR inválido', html:`El código <b>${esc(c)}</b> no existe en el sistema. Posible comprobante falso o adulterado.`}; log('Intento de validación con código inexistente: ' + c); }
  else {
    const det = `<b>${esc(nombreSocio(r.socio))}</b> (socio ${r.socio})<br>${esc(instNombre(r.instId))}${hijos(r).map(c => ' + ' + esc(instNombre(c.instId)) + ' ' + esc(c.turno)).join('')} · ${fmtF(r.fecha)} · ${esc(r.turno)}${r.pers ? `<br><b>Ingresan:</b> ${persTxt(r.pers)}<br><b>Vehículos:</b> ${vehTxt(r.veh)}` : ''}`;
    if (r.estado === 'cancelada') { v = {tipo:'error', titulo:'Reserva cancelada', html:det + '<br>Esta reserva fue cancelada y no habilita el ingreso.'}; log('Validación rechazada (cancelada): ' + c); }
    else if (r.estado === 'utilizada') { v = {tipo:'warn', titulo:'QR ya utilizado', html:det + `<br>Ya se registró el ingreso ${r.ingreso ? 'el ' + fmtDT(r.ingreso) : ''}. El QR es válido una sola vez.`}; log('Validación rechazada (QR reutilizado): ' + c); }
    else if (r.fecha !== hoy()) { v = {tipo:'warn', titulo:'Fecha incorrecta', html:det + `<br>La reserva es para el <b>${fmtF(r.fecha)}</b>, no para hoy.`}; log('Validación rechazada (otra fecha): ' + c); }
    else {
      r.estado = 'utilizada'; r.ingreso = Date.now(); propagar(r);
      const s = S.socios.find(x => x.nro === r.socio);
      const fam = s && s.grupo.filter(g => g.estado === 'habilitado').length ? '<br><span class="small">Grupo familiar habilitado: ' + s.grupo.filter(g => g.estado === 'habilitado').map(g => esc(g.nombre)).join(', ') + '</span>' : '';
      v = {tipo:'ok', titulo:'Ingreso autorizado', html:det + fam + (r.pago !== 'confirmado' ? `<br><b style="color:var(--amarillo)">Atención: ${r.pago === 'informado' ? 'Pago informado, todavía sin confirmar' : 'Pago pendiente'}: cobrar ${pesos(r.monto || 0)} o verificar en administración</b>` : '<br><span class="small">Pago confirmado</span>')};
      log('Ingreso registrado: ' + c);
    }
  }
  v.t = Date.now(); ui.validacion = v; save();
  if (ui.view !== 'validar') ui.view = 'validar';
  render();
}

/* ===================== Eventos ===================== */
function entrar(u, p) {
  u = u.trim();
  S.bloqueos = S.bloqueos || {};
  const bq = S.bloqueos[u];
  if (bq && bq.hasta > Date.now()) { ui.msg = {tipo:'err', txt:`Demasiados intentos fallidos. Probá de nuevo en ${Math.ceil((bq.hasta - Date.now()) / 60000)} min.`}; render(); return; }
  const st = S.staff.find(s => s.user === u && s.pass === p);
  const so = !st && S.socios.find(s => (s.nro === u || s.dni === u) && s.pass === p);
  if (MODO === 'socio' && st) { ui.msg = {tipo:'err', txt:'Este acceso es solo para socios. El personal ingresa desde la página de administración.'}; render(); return; }
  if (MODO === 'admin' && so) { ui.msg = {tipo:'err', txt:'Este acceso es para el personal del complejo. Los socios ingresan desde el sitio de reservas.'}; render(); return; }
  if ((st && st.activo === false) || (so && so.activo === false)) { ui.msg = {tipo:'err', txt:'La cuenta está suspendida. Comunicate con la administración del complejo.'}; render(); return; }
  if (st || so) delete S.bloqueos[u];
  ultimaAct = Date.now();
  if (st) { ses = {rol:st.rol, user:st.user}; ui.view = st.rol === 'admin' ? 'panel' : 'validar'; log('Inicio de sesión'); render(); return; }
  if (so) { ses = {rol:'socio', nro:so.nro}; ui = uiInicial(); ui.view = 'inicio'; log('Inicio de sesión'); render();
    if (so.debeCambiar) showModal(`<h3>Creá tu contraseña nueva</h3><p class="muted">Ingresaste con una contraseña temporal. Por seguridad, elegí una nueva para seguir.</p><form data-form="forzarpass"><label>Nueva contraseña (mínimo 6 caracteres)</label><input name="n" type="password" required minlength="6" autocomplete="new-password"><label>Repetir contraseña</label><input name="n2" type="password" required autocomplete="new-password"><button class="btn grande" style="margin-top:16px">Guardar y continuar</button></form>`);
    return; }
  const b = S.bloqueos[u] = S.bloqueos[u] || {n:0, hasta:0};
  b.n++;
  S.auditoria.push({t:Date.now(), usuario:u || 'anónimo', accion:'Intento de ingreso fallido'});
  if (b.n >= 5) { b.hasta = Date.now() + 5 * 60000; b.n = 0; S.auditoria.push({t:Date.now(), usuario:u || 'anónimo', accion:'Bloqueo temporal por 5 intentos fallidos'}); ui.msg = {tipo:'err', txt:'Demasiados intentos fallidos. El acceso quedó bloqueado por 5 minutos.'}; }
  else ui.msg = {tipo:'err', txt:`Usuario o contraseña incorrectos. Te quedan ${5 - b.n} intentos.`};
  save(); render();
}

const ACT = {
  nav: b => { ui.view = b.dataset.v; closeModal(); render(); window.scrollTo(0, 0); },
  acceso: b => { if (b.dataset.v === 'recuperar') ui.recTipo = ui.recTipo || 'clave'; ui.acceso = b.dataset.v; ui.msg = null; render(); },
  demo: b => entrar(b.dataset.u, b.dataset.p),
  reset: () => { if (confirm('¿Reiniciar todos los datos de demostración?')) { S = seed(); save(); ui.msg = {tipo:'ok', txt:'Datos reiniciados.'}; render(); } },
  salir: () => { log('Cierre de sesión'); ses = null; ui = uiInicial(); closeModal(); render(); },
  nuevares: () => { ui.wiz = {paso:1}; ui.verCal = false; ui.canSel = null; closeModal(); ui.view = 'reservar'; render(); window.scrollTo(0, 0); },
  wdia: b => { const w = ui.wiz; if (w.dia !== b.dataset.f) { w.franja = null; w.quincho = null; w.cancha = null; } w.dia = b.dataset.f; render(); },
  dia: b => { ACT.wdia(b); },
  wfr: b => { const w = ui.wiz; if (w.franja !== b.dataset.f) { w.quincho = null; w.cancha = null; ui.canSel = null; } w.franja = b.dataset.f; render(); },
  wnext: () => { const w = ui.wiz; if (w.paso === 3 && w.quincho && capN(getInst(w.quincho)) < totPers(w.pers)) w.quincho = null; w.paso = Math.min(4, w.paso + 1); ui.verCal = false; render(); window.scrollTo(0, 0); },
  wback: () => { ui.wiz.paso = Math.max(1, ui.wiz.paso - 1); render(); window.scrollTo(0, 0); },
  wcal: () => { ui.verCal = !ui.verCal; if (ui.verCal) ui.mes = (ui.wiz.dia || hoy()).slice(0, 7); render(); },
  cnt: b => { const w = ui.wiz, o = w[b.dataset.o], k = b.dataset.k, max = b.dataset.o === 'veh' ? 10 : 60; o[k] = Math.max(b.dataset.o === 'pers' && k === 'a' ? 1 : 0, Math.min(max, (o[k] || 0) + Number(b.dataset.d))); render(); },
  wveh: b => { const w = ui.wiz; w.conVeh = b.dataset.v === '1'; if (w.conVeh && !w.veh.auto && !w.veh.moto) w.veh.auto = 1; render(); },
  wq: b => { const w = ui.wiz; w.quincho = w.quincho === b.dataset.id ? null : b.dataset.id; render(); },
  wcan: b => { ui.canSel = ui.canSel === b.dataset.id ? null : b.dataset.id; render(); },
  wcanh: b => { ui.wiz.cancha = {id:ui.canSel, hora:b.dataset.h}; ui.canSel = null; render(); },
  wcanq: () => { ui.wiz.cancha = null; render(); },
  wmet: b => { ui.wiz.metodo = b.dataset.m; render(); },
  mes: b => { const [y, m] = ui.mes.split('-').map(Number); const d = new Date(y, m - 1 + Number(b.dataset.d), 1); ui.mes = d.getFullYear() + '-' + z(d.getMonth() + 1); render(); },
  mtab: b => { ui.mtab = b.dataset.t; render(); },
  verfoto: b => {
    const k = GALERIA.findIndex(g => g[0] === b.dataset.f), [f, c] = GALERIA[k < 0 ? 0 : k];
    const prev = GALERIA[(k - 1 + GALERIA.length) % GALERIA.length][0], next = GALERIA[(k + 1) % GALERIA.length][0];
    showModal(`<img class="foto-grande" src="${foto(f)}" alt="${esc(c)}"><div class="acciones" style="justify-content:space-between;align-items:center"><button class="icon-btn" data-act="verfoto" data-f="${prev}" aria-label="Anterior">${ico('back')}</button><b>${esc(c)}</b><button class="icon-btn" data-act="verfoto" data-f="${next}" aria-label="Siguiente">${ico('chevron')}</button></div><div class="acciones" style="margin-top:8px"><button class="btn ghost full" data-act="cerrar">Cerrar</button></div>`);
  },
  zona: b => { ui.zona = ui.zona === b.dataset.z ? null : b.dataset.z; const y = window.scrollY; render(); window.scrollTo(0, y); },
  rectipo: b => { ui.recTipo = b.dataset.t; ui.msg = null; render(); },
  vercorreo: b => verCorreo(b.dataset.id),
  abrirtoken: b => { closeModal(); ses = null; ui = uiInicial(); ui.tk = b.dataset.tk; ui.acceso = 'nuevaclave'; render(); window.scrollTo(0, 0); },
  regtipo: b => { ui.regTipo = b.dataset.t; ui.msg = null; render(); },
  verdni: b => { const x = S.solicitudes.find(y => y.id === b.dataset.id); showModal(`<h3>DNI de ${esc(x.nombre)}</h3><img class="foto-grande" src="${x.img}" alt="DNI"><div class="acciones"><button class="btn ghost" data-act="cerrar">Cerrar</button></div>`); },
  solok: b => {
    const x = S.solicitudes.find(y => y.id === b.dataset.id);
    const nro = String(Math.max(1000, ...S.padron.map(p => parseInt(p.nro, 10) || 0)) + 1);
    S.padron.push({nro, dni:x.dni, nombre:x.nombre});
    S.socios.push({nro, dni:x.dni, nombre:x.nombre, email:x.email, tel:x.tel, pass:null, alta:Date.now(), grupo:[]});
    x.estado = 'aprobada'; x.nro = nro;
    const tk = nuevoToken(nro, 'alta'); S.tokens[tk].exp = Date.now() + 7 * 86400000;
    const mail = enviarCorreo(x.email, '¡Bienvenido/a! Ya sos socio del complejo', plantillaCorreo('¡Bienvenido/a al Complejo Policial Almudena!', [`Hola ${esc(x.nombre.split(' ')[0])}:`, 'Tu solicitud fue aprobada. Este es tu número de socio:', `<span class="mail-nro">${nro}</span>`, 'Tocá el botón para crear tu contraseña y activar tu cuenta. El enlace vence en 7 días.'], {href:linkReset(tk).replace('admin.html', 'index.html'), act:MODO === 'socio' ? 'abrirtoken' : '', tk, txt:'Crear mi contraseña'}));
    log(`Aprobó la solicitud de ${x.nombre} (DNI ${x.dni}): socio N° ${nro}`);
    showModal(`<div class="exito">${ico('checkcircle', 20)} Socio N° ${nro} creado</div><p>Le enviamos a <b>${esc(x.nombre)}</b> un correo a ${esc(enmascarar(x.email))} con su número de socio y el enlace para crear su contraseña.</p><div class="acciones"><button class="btn ghost" data-act="vercorreo" data-id="${mail.id}">Ver correo enviado</button><button class="btn" data-act="cerrar">Listo</button></div>`);
    render();
  },
  solno: b => {
    const x = S.solicitudes.find(y => y.id === b.dataset.id); if (!confirm(`¿Rechazar la solicitud de ${x.nombre}?`)) return;
    x.estado = 'rechazada';
    enviarCorreo(x.email, 'Sobre tu solicitud', plantillaCorreo('Sobre tu solicitud', [`Hola ${esc(x.nombre.split(' ')[0])}:`, 'Revisamos tu solicitud y por el momento no pudo ser aprobada. Para más información, comunicate con la administración del complejo.']));
    log(`Rechazó la solicitud de ${x.nombre} (DNI ${x.dni})`); toast('Solicitud rechazada'); render();
  },
  atras: () => { const n = navStack.length; try { history.back(); } catch (e) {} setTimeout(() => { if (navStack.length === n) navAtras(); }, 120); },
  ir: b => { const el = document.getElementById(b.dataset.id); if (el) el.scrollIntoView({behavior:'smooth', block:'start'}); },
  pagar: b => {
    const r = S.reservas.find(x => x.id === b.dataset.id);
    showModal(`${b.dataset.nueva ? `<div class="exito">${ico('checkcircle', 20)} Tu lugar quedó reservado</div><p class="small muted" style="text-align:center;margin-top:-6px">Completá la transferencia para confirmar la reserva.</p>` : ''}<h3>Pagar reserva</h3><p class="small muted" style="margin-top:-6px">${esc(instNombre(r.instId))} · ${fmtFL(r.fecha)} · ${esc(r.turno)}</p>
      <div class="resumen" style="text-align:center;padding:14px"><span class="small muted">Monto a pagar</span><div style="font-size:30px;font-weight:800;color:var(--azul)">${pesos(r.monto || 0)}</div><span class="small muted">Plazo: ${PAGO.plazo}</span></div>
      ${r.pago === 'rechazado' ? '<div class="err">El pago anterior fue rechazado. Revisá los datos y volvé a informarlo.</div>' : ''}
      <h3 style="margin-top:18px">Paso 1 · Transferí a esta cuenta</h3>
      <table class="kv"><tr><td>Alias</td><td><b>${PAGO.alias}</b> <button type="button" class="btn-sm" data-act="copiar" data-txt="${PAGO.alias}">Copiar</button></td></tr><tr><td>CBU</td><td style="font-family:monospace">${PAGO.cbu} <button type="button" class="btn-sm" data-act="copiar" data-txt="${PAGO.cbu}">Copiar</button></td></tr><tr><td>Titular</td><td>${esc(PAGO.titular)}</td></tr></table>
      <p class="small muted">Datos de ejemplo del prototipo.</p>
      <h3 style="margin-top:18px">Paso 2 · Avisanos que pagaste</h3>
      <form data-form="infopago" data-id="${r.id}"><label>Medio de pago</label><select name="metodo"><option>Transferencia</option><option>Mercado Pago</option></select>
        <label>N° de operación (opcional)</label><input name="op" inputmode="numeric" autocomplete="off">
        <label>Foto o captura del comprobante</label><input type="file" name="img" accept="image/*">
        <div class="acciones"><button type="button" class="btn ghost" data-act="cerrar">Más tarde</button><button class="btn">Enviar aviso de pago</button></div></form>`);
  },
  copiar: b => { try { navigator.clipboard.writeText(b.dataset.txt); toast('Copiado: ' + b.dataset.txt); } catch (e) { toast(b.dataset.txt); } },
  pconf: b => { const r = S.reservas.find(x => x.id === b.dataset.id); r.pago = 'confirmado'; r.pagoConf = {t:Date.now(), usuario:usuarioLog()}; propagar(r); log(`Confirmó el pago de ${r.codigo} (${pesos(r.monto || 0)}, socio ${r.socio})`); closeModal(); toast('Pago confirmado'); render(); },
  prech: b => { const r = S.reservas.find(x => x.id === b.dataset.id); if (!confirm('¿Rechazar este aviso de pago? El socio va a ver que tiene que informarlo de nuevo.')) return; r.pago = 'rechazado'; propagar(r); log(`Rechazó el aviso de pago de ${r.codigo} (socio ${r.socio})`); closeModal(); toast('Pago rechazado'); render(); },
  pefec: b => { const r = S.reservas.find(x => x.id === b.dataset.id); if (!confirm(`¿Registrar el pago en efectivo de ${pesos(r.monto || 0)}?`)) return; r.pago = 'confirmado'; r.pagoInfo = {metodo:'Efectivo en administración', operacion:'', t:Date.now(), img:null}; r.pagoConf = {t:Date.now(), usuario:usuarioLog()}; propagar(r); log(`Registró pago en efectivo de ${r.codigo} (${pesos(r.monto || 0)})`); closeModal(); toast('Pago registrado'); render(); },
  pimg: b => { const r = S.reservas.find(x => x.id === b.dataset.id); showModal(`<h3>Comprobante de pago</h3><p class="small muted">${esc(nombreSocio(r.socio))} · ${pesos(r.monto || 0)} · ${esc(r.pagoInfo.metodo)}</p><img src="${r.pagoInfo.img}" alt="Comprobante" style="width:100%;border-radius:10px;border:1px solid var(--borde)"><div class="acciones">${r.pago === 'informado' ? `<button class="btn rojo" data-act="prech" data-id="${r.id}">Rechazar</button><button class="btn" data-act="pconf" data-id="${r.id}">Confirmar pago</button>` : '<button class="btn" data-act="cerrar">Cerrar</button>'}</div>`); },
  ptab: b => { ui.ptab = b.dataset.t; render(); },
  disp: b => { ui.ag = b.dataset.f; ui.view = 'agenda'; render(); window.scrollTo(0, 0); },
  agdia: b => { ui.ag = addDays(ui.ag || hoy(), Number(b.dataset.d)); render(); },
  aghoy: () => { ui.ag = hoy(); render(); },
  agnueva: b => { ui.pref = {inst:b.dataset.i, fecha:ui.ag || hoy(), turno:b.dataset.t}; closeModal(); ui.view = 'nueva'; render(); },
  agdet: b => {
    const r0 = S.reservas.find(x => x.id === b.dataset.id), r = r0.padre ? (S.reservas.find(x => x.id === r0.padre) || r0) : r0, s = S.socios.find(x => x.nro === r.socio);
    showModal(`<h3>${ICON[r.instId] || ''} ${esc(instNombre(r.instId))}</h3><p class="small muted" style="margin-top:-6px">${fmtFL(r.fecha)} · ${esc(r.turno)}</p>
      <table class="kv"><tr><td>Socio</td><td><b>${esc(nombreSocio(r.socio))}</b> (N° ${r.socio})</td></tr>${r.pers ? `<tr><td>Personas</td><td>${persTxt(r.pers)}</td></tr><tr><td>Vehículos</td><td>${vehTxt(r.veh)}</td></tr>` : ''}${hijos(r).length ? `<tr><td>Incluye</td><td>${hijos(r).map(c => esc(instNombre(c.instId)) + ' · ' + esc(c.turno)).join('<br>')}</td></tr>` : ''}<tr><td>Contacto</td><td>${s ? esc(s.email) + (s.tel ? '<br>' + esc(s.tel) : '') : '<span class="muted">Sin cuenta web</span>'}</td></tr>
      <tr><td>Estado</td><td>${badgeEstado(r.estado)}</td></tr><tr><td>Pago</td><td>${badgePago(r.pago)} <b>${pesos(r.monto || 0)}</b>${r.pagoInfo ? `<br><span class="small muted">${esc(r.pagoInfo.metodo)}${r.pagoInfo.operacion ? ' · Op. ' + esc(r.pagoInfo.operacion) : ''} · ${fmtDT(r.pagoInfo.t)}</span>` : ''}${r.estado !== 'cancelada' && botonesPago(r) ? '<div style="margin-top:6px">' + botonesPago(r) + '</div>' : ''}</td></tr><tr><td>Código</td><td style="font-family:monospace">${r.codigo}</td></tr><tr><td>Creada</td><td>${fmtDT(r.creada)}</td></tr>${r.ingreso ? `<tr><td>Ingreso</td><td>${fmtDT(r.ingreso)}</td></tr>` : ''}</table>
      <div class="acciones" style="flex-wrap:wrap"><button class="btn ghost" data-act="cerrar">Cerrar</button>${r.estado !== 'cancelada' ? `<button class="btn ghost" data-act="verqr" data-id="${r.id}">Ver QR</button>` : ''}${r.estado === 'confirmada' ? `<button class="btn ghost" data-act="modificar" data-id="${r.id}">Modificar</button><button class="btn rojo" data-act="cancelar" data-id="${r.id}">Cancelar reserva</button>` : ''}</div>`);
  },
  agpileta: b => {
    const i = getInst(b.dataset.i), t = b.dataset.t, f = ui.ag || hoy();
    const rs = S.reservas.filter(r => r.instId === i.id && r.fecha === f && r.turno === t && r.estado !== 'cancelada');
    const puede = i.activo && !turnoPasado(f, t) && rs.length < i.cupo;
    showModal(`<h3>${ICON[i.id]} ${esc(i.nombre)} · ${esc(t)}</h3><p class="small muted" style="margin-top:-6px">${fmtFL(f)} · ${rs.length} de ${i.cupo} grupos</p>
      <div style="max-height:300px;overflow-y:auto">${rs.length ? rs.map(r => `<div class="item"><div><b>${esc(nombreSocio(r.socio))}</b><br><span class="small muted">Socio ${r.socio} · ${r.codigo}</span></div>${badgeEstado(r.estado)}</div>`).join('') : '<p class="muted">Sin reservas en este turno.</p>'}</div>
      <div class="acciones"><button class="btn ghost" data-act="cerrar">Cerrar</button>${puede ? `<button class="btn" data-act="agnueva" data-i="${i.id}" data-t="${esc(t)}">+ Agregar reserva</button>` : ''}</div>`);
  },
  frap: b => {
    const k = b.dataset.k, h0 = hoy(); ui.frap = k;
    const base = {inst:'', estado:'', q:''};
    ui.f = k === 'hoy' ? {...base, desde:h0, hasta:h0} : k === 'semana' ? {...base, desde:h0, hasta:addDays(h0, 6)} : k === 'mes' ? {...base, desde:h0.slice(0, 8) + '01', hasta:h0.slice(0, 8) + '31'}
      : k === 'futuras' ? {...base, desde:h0, hasta:addDays(h0, 365), estado:'confirmada'} : {...base, desde:addDays(h0, -90), hasta:addDays(h0, 365), estado:'cancelada'};
    render();
  },
  ntipo: b => { ui.ntipo = b.dataset.t; render(); },
  verreg: () => showModal(`<h3>Reglamento del complejo</h3><ul style="padding-left:18px;line-height:1.6">${INFO.reglamento.map(x => '<li>' + esc(x) + '</li>').join('')}</ul><div class="acciones"><button class="btn" data-act="cerrar">Entendido</button></div>`),
  descreg: () => descargar('Reglamento del Complejo Policial Almudena\n\n' + INFO.reglamento.map((x, i) => (i + 1) + '. ' + x).join('\n'), 'reglamento_complejo_almudena.txt', 'text/plain'),
  confirmar: () => {
    if (!$('#acepto').checked) { toast('Marcá la casilla para aceptar el reglamento.', 'error'); return; }
    const w = ui.wiz, res = crearVisita(w), met = w.metodo || 'mp';
    if (res.error) { toast(res.error, 'error'); if (res.paso) w.paso = res.paso; render(); return; }
    const r = res.r;
    ui.wiz = {paso:1}; ui.view = 'mis'; ui.mtab = 'prox'; render();
    if (met === 'mp') {
      showModal(`<div class="mp-proc"><div class="mp-logo">Mercado Pago</div><div class="spinner"></div><p><b>Procesando tu pago de ${pesos(r.monto)}</b></p><p class="small muted">Demostración: en la versión real se abre el checkout de Mercado Pago.</p></div>`);
      setTimeout(() => { r.pago = 'confirmado'; r.pagoInfo = {metodo:'Mercado Pago', operacion:String(1e9 + Math.floor(Math.random() * 9e9)), t:Date.now(), img:null}; r.pagoConf = {t:Date.now(), usuario:'Mercado Pago (automático)'}; propagar(r); log(`Pago aprobado por Mercado Pago: ${r.codigo} (${pesos(r.monto)})`); render(); comprobante(r, true); }, 1600);
    } else ACT.pagar({dataset:{id:r.id, nueva:'1'}});
  },
  verqr: b => comprobante(S.reservas.find(r => r.id === b.dataset.id)),
  cerrar: () => closeModal(),
  imprimir: () => window.print(),
  cancelar: b => {
    const r = S.reservas.find(x => x.id === b.dataset.id);
    if (!confirm(`¿Cancelar la reserva de ${instNombre(r.instId)} del ${fmtF(r.fecha)} (${r.turno})?`)) return;
    r.estado = 'cancelada'; propagar(r); log(`Canceló la reserva ${r.codigo}`); closeModal(); toast('Reserva cancelada. El turno quedó libre.'); render();
  },
  preg: b => preguntar(b.dataset.q),
  camara: () => iniciarCamara(),
  simular: b => validar(b.dataset.c),
  rep: b => { const p = b.dataset.p; exportCSV(S.reservas.filter(r => r.fecha.startsWith(p)).sort((a, c) => a.fecha.localeCompare(c.fecha)), `reporte_reservas_${p}.csv`); },
  exportar: () => exportCSV(filtrarReservas(), `reservas_${ui.f.desde}_a_${ui.f.hasta}.csv`),
  modificar: b => {
    const r = S.reservas.find(x => x.id === b.dataset.id), inst = getInst(r.instId);
    showModal(`<h3>Modificar reserva</h3><p class="small muted">${r.codigo} · ${esc(nombreSocio(r.socio))} · ${esc(inst.nombre)}</p>
      <form data-form="modificar" data-id="${r.id}"><label>Nueva fecha</label><input type="date" name="fecha" value="${r.fecha}" min="${hoy()}" required>
      <label>Nuevo turno</label><select name="turno">${inst.turnos.map(t => `<option ${t === r.turno ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>
      <div class="acciones"><button type="button" class="btn ghost" data-act="cerrar">Volver</button><button class="btn">Guardar cambios</button></div></form>`);
  },
  toggleinst: b => { const i = getInst(b.dataset.id); i.activo = !i.activo; log(`${i.activo ? 'Habilitó' : 'Suspendió por mantenimiento'} ${i.nombre}`); toast(i.nombre + (i.activo ? ' habilitada' : ' suspendida')); render(); },
  delnot: b => { const n = S.noticias.find(x => x.id === b.dataset.id); if (!confirm('¿Eliminar “' + n.titulo + '”?')) return; S.noticias = S.noticias.filter(x => x !== n); log('Eliminó la publicación: ' + n.titulo); render(); },
  aprobar: b => { const s = S.socios.find(x => x.nro === b.dataset.n), g = s.grupo[+b.dataset.i]; g.estado = 'habilitado'; log(`Aprobó familiar ${g.nombre} del socio ${s.nro}`); toast('Familiar habilitado'); render(); },
  togglesocio: b => { const s = S.socios.find(x => x.nro === b.dataset.n); s.activo = s.activo === false; log(`${s.activo ? 'Habilitó' : 'Suspendió'} la cuenta del socio ${s.nro}`); toast('Cuenta ' + (s.activo ? 'habilitada' : 'suspendida')); render(); },
  resetpass: b => {
    const s = S.socios.find(x => x.nro === b.dataset.n); const v = new Uint32Array(1); crypto.getRandomValues(v);
    s.pass = String(100000 + v[0] % 900000); s.debeCambiar = true;
    const mail = enviarCorreo(s.email, 'Tu contraseña temporal', plantillaCorreo('Tu contraseña temporal', [`Hola ${esc(s.nombre.split(' ')[0])}:`, 'La administración del complejo restableció tu contraseña. Ingresá con estos datos y el sistema te va a pedir que crees una contraseña nueva:', `Número de socio: <b>${s.nro}</b><br>Contraseña temporal: <span class="mail-nro">${s.pass}</span>`], {href:location.href.split('#')[0].replace('admin.html', 'index.html'), txt:'Ir al sitio de reservas'}));
    log(`Restableció la contraseña del socio ${s.nro} y la envió por correo a ${enmascarar(s.email)}`);
    const cuerpo = `Hola ${s.nombre.split(' ')[0]}, la administración del Complejo Policial Almudena restableció tu contraseña.\n\nNúmero de socio: ${s.nro}\nContraseña temporal: ${s.pass}\n\nAl ingresar te vamos a pedir que crees una nueva.`;
    const tel = (s.tel || '').replace(/\D/g, '');
    showModal(`<div class="exito">${ico('checkcircle', 20)} Correo enviado a ${esc(enmascarar(s.email))}</div><h3>Contraseña restablecida</h3><p class="muted">Le enviamos a <b>${esc(s.nombre)}</b> (socio ${s.nro}) un correo con una contraseña temporal. Al ingresar, el sistema le va a pedir que la cambie.</p>
      <div class="resumen" style="text-align:center;padding:12px"><small class="muted">Contraseña temporal</small><div class="codigo">${s.pass}</div></div>
      <p class="small muted" style="margin-top:12px">¿El socio no recibe correos? Mandásela por otro medio:</p>
      <div class="chips"><a class="btn-sm" href="mailto:${encodeURIComponent(s.email)}?subject=${encodeURIComponent('Tu contraseña temporal - Complejo Policial Almudena')}&body=${encodeURIComponent(cuerpo.replace(/\\n/g, '\n'))}">${ico('megaphone', 16)} Desde mi correo</a>${tel ? `<a class="btn-sm" target="_blank" rel="noopener" href="https://wa.me/54${tel}?text=${encodeURIComponent(cuerpo.replace(/\\n/g, '\n'))}">${ico('chat', 16)} Por WhatsApp</a>` : ''}<button class="btn-sm" data-act="vercorreo" data-id="${mail.id}">${ico('search', 16)} Ver correo enviado</button></div>
      <div class="acciones"><button class="btn" data-act="cerrar">Listo</button></div>`);
  },
  togglestaff: b => { const u = S.staff.find(x => x.user === b.dataset.u); u.activo = u.activo === false; log(`${u.activo ? 'Habilitó' : 'Suspendió'} al usuario ${u.user}`); render(); },
  backup: () => { if (autoBackup(true)) { log('Copia de seguridad manual'); toast('Copia de seguridad creada'); } else toast('No hay espacio para la copia. Descargala como archivo.', 'error'); render(); },
  descbk: () => { descargar(JSON.stringify(S), `copia_almudena_${hoy()}.json`, 'application/json'); log('Descargó copia de seguridad'); },
  restbk: b => { let bks = []; try { bks = JSON.parse(localStorage.getItem(KEY + '_bk') || '[]'); } catch (e) {} const bk = bks[+b.dataset.i]; if (!bk || !confirm('¿Restaurar la copia del ' + fmtDT(bk.t) + '? Se reemplazan los datos actuales.')) return; S = JSON.parse(bk.data); log('Restauró la copia del ' + fmtDT(bk.t)); toast('Copia restaurada'); render(); },
  rechazar: b => { const s = S.socios.find(x => x.nro === b.dataset.n), g = s.grupo[+b.dataset.i]; s.grupo.splice(+b.dataset.i, 1); log(`Rechazó familiar ${g.nombre} del socio ${s.nro}`); toast('Solicitud rechazada'); render(); }
};

function comprobante(r, nueva) {
  showModal(`${nueva ? `<div class="exito">${ico('checkcircle', 20)} ¡Listo! Tu reserva está confirmada</div>` : ''}<div class="comprobante"><div class="cmp-head"><div class="logo">${ico('shield')}</div><div><b>Complejo Policial Almudena</b><small>Comprobante digital de reserva</small></div></div>
    <div class="qr" data-qr="${r.codigo}"></div><div class="codigo">${r.codigo}</div>
    <table class="kv"><tr><td>Socio</td><td>${esc(nombreSocio(r.socio))} (N° ${r.socio})</td></tr><tr><td>Lugar</td><td>${esc(instNombre(r.instId))}${hijos(r).map(c => '<br>' + esc(instNombre(c.instId)) + ' · ' + esc(c.turno)).join('')}</td></tr><tr><td>Fecha</td><td>${fmtFL(r.fecha)}</td></tr><tr><td>Horario</td><td>${esc(r.turno)}</td></tr>${r.pers ? `<tr><td>Personas</td><td>${persTxt(r.pers)}</td></tr><tr><td>Vehículos</td><td>${vehTxt(r.veh)}</td></tr>` : ''}<tr><td>Estado</td><td>${badgeEstado(r.estado)}</td></tr><tr><td>Pago</td><td>${badgePago(r.pago)} ${pesos(r.monto || 0)}</td></tr><tr><td>Emitido</td><td>${fmtDT(r.creada)}</td></tr>${r.ingreso ? `<tr><td>Ingreso</td><td>${fmtDT(r.ingreso)}</td></tr>` : ''}</table>
    <p class="small muted">Presentá este QR en el ingreso. Es único e intransferible y solo es válido una vez.</p></div>
    <div class="acciones no-print" style="flex-wrap:wrap"><button class="btn ghost" data-act="cerrar">Cerrar</button><button class="btn ${MODO === 'socio' && r.estado === 'confirmada' && ['pendiente', 'rechazado'].includes(r.pago) ? 'ghost' : ''}" data-act="imprimir">Descargar / imprimir</button>${MODO === 'socio' && r.estado === 'confirmada' && ['pendiente', 'rechazado'].includes(r.pago) ? `<button class="btn" data-act="pagar" data-id="${r.id}">Pagar ahora</button>` : ''}</div>`);
}

const FORM = {
  login: fd => entrar(fd.get('u'), fd.get('p')),
  registro: fd => {
    const dni = fd.get('dni').trim().replace(/\D/g, ''), p = fd.get('p');
    const pad = S.padron.find(x => x.dni === dni);
    let err = null;
    if (!pad) err = 'Tu DNI no figura en el padrón de socios. Si todavía no sos socio, elegí “Quiero asociarme”.';
    else if (S.socios.some(s => s.nro === pad.nro && s.pass)) err = 'Ya existe una cuenta con ese DNI. Usá “Olvidé mi contraseña”.';
    else if (p.length < 6) err = 'La contraseña debe tener al menos 6 caracteres.';
    else if (p !== fd.get('p2')) err = 'Las contraseñas no coinciden.';
    else if (!fd.get('consent')) err = 'Tenés que aceptar la política de protección de datos personales.';
    if (err) { ui.msg = {tipo:'err', txt:err}; render(); return; }
    const ex = S.socios.find(s => s.nro === pad.nro);
    if (ex) Object.assign(ex, {email:fd.get('email').trim(), tel:fd.get('tel').trim(), pass:p});
    else S.socios.push({nro:pad.nro, dni, nombre:pad.nombre, email:fd.get('email').trim(), tel:fd.get('tel').trim(), pass:p, alta:Date.now(), grupo:[]});
    S.auditoria.push({t:Date.now(), usuario:'Socio ' + pad.nro, accion:'Registro de cuenta (DNI validado contra padrón)'}); save();
    ui.acceso = 'login'; ui.msg = {tipo:'ok', txt:`¡Cuenta creada, ${pad.nombre.split(' ')[0]}! Tu número de socio es ${pad.nro}. Podés ingresar con ese número o con tu DNI.`}; render();
  },
  solicitud: fd => {
    const dni = fd.get('dni').trim().replace(/\D/g, ''), email = fd.get('email').trim(), file = fd.get('img');
    let err = null;
    if (dni.length < 7) err = 'Revisá el DNI.';
    else if (S.padron.some(x => x.dni === dni)) err = 'Ese DNI ya es socio. Elegí “Ya soy socio” para crear tu cuenta.';
    else if ((S.solicitudes || []).some(x => x.dni === dni && x.estado === 'pendiente')) err = 'Ya hay una solicitud en revisión con ese DNI.';
    else if (!fd.get('consent')) err = 'Tenés que aceptar la política de protección de datos personales.';
    if (err) { ui.msg = {tipo:'err', txt:err}; render(); return; }
    const fin = img => {
      const nombre = cap1(fd.get('nombre').trim()) + ' ' + cap1(fd.get('apellido').trim());
      S.solicitudes = S.solicitudes || [];
      S.solicitudes.push({id:'s' + Date.now().toString(36), nombre, dni, cond:fd.get('cond'), legajo:(fd.get('legajo') || '').trim(), email, tel:fd.get('tel').trim(), img, estado:'pendiente', t:Date.now()});
      S.auditoria.push({t:Date.now(), usuario:email, accion:`Solicitud para asociarse: ${nombre} (DNI ${dni})`});
      const mail = enviarCorreo(email, 'Recibimos tu solicitud', plantillaCorreo('Recibimos tu solicitud', [`Hola ${esc(cap1(fd.get('nombre').trim()))}:`, 'Gracias por querer sumarte al Complejo Policial Almudena. La administración va a revisar tus datos y te va a responder a este correo.', 'Si se aprueba, te vamos a enviar tu número de socio y un enlace para crear tu contraseña.']));
      ui.recEmail = email; ui.recMail = mail.id; ui.acceso = 'solenviada'; ui.msg = null; render(); window.scrollTo(0, 0);
    };
    if (file && file.size) achicarImagen(file).then(fin).catch(() => fin(null)); else fin(null);
  },
  recuperar: fd => {
    const tipo = fd.get('tipo'), email = fd.get('email').trim().toLowerCase();
    const s = S.socios.find(x => x.email.toLowerCase() === email && (tipo === 'clave' || x.dni === (fd.get('dni') || '').trim()));
    let mail = null;
    if (s && tipo === 'clave') {
      const tk = nuevoToken(s.nro, 'reset');
      mail = enviarCorreo(s.email, 'Restablecé tu contraseña', plantillaCorreo('Restablecé tu contraseña', [`Hola ${esc(s.nombre.split(' ')[0])}:`, 'Recibimos un pedido para restablecer la contraseña de tu cuenta de socio. Tocá el botón para crear una nueva. El enlace vence en 30 minutos y se puede usar una sola vez.'], {href:linkReset(tk), act:'abrirtoken', tk, txt:'Crear contraseña nueva'}));
      S.auditoria.push({t:Date.now(), usuario:'Socio ' + s.nro, accion:'Solicitó restablecer su contraseña'});
    }
    if (s && tipo === 'nro') {
      mail = enviarCorreo(s.email, 'Tu número de socio', plantillaCorreo('Tu número de socio', [`Hola ${esc(s.nombre.split(' ')[0])}:`, `Tu número de socio del Complejo Policial Almudena es:`, `<span class="mail-nro">${s.nro}</span>`, 'Con este número (o con tu DNI) y tu contraseña podés ingresar al sitio de reservas.']));
      S.auditoria.push({t:Date.now(), usuario:'Socio ' + s.nro, accion:'Solicitó recordar su número de socio'});
    }
    if (!s) S.auditoria.push({t:Date.now(), usuario:email, accion:'Pedido de recuperación con datos no registrados'});
    save();
    ui.recEmail = email; ui.recMail = mail ? mail.id : null; ui.acceso = 'enviado'; ui.msg = null; render();
  },
  nuevaclave: fd => {
    const t = (S.tokens || {})[ui.tk];
    if (!t || t.usado || t.exp < Date.now()) { render(); return; }
    if (fd.get('n').length < 6) { ui.msg = {tipo:'err', txt:'La contraseña debe tener al menos 6 caracteres.'}; render(); return; }
    if (fd.get('n') !== fd.get('n2')) { ui.msg = {tipo:'err', txt:'Las contraseñas no coinciden.'}; render(); return; }
    const s = S.socios.find(x => x.nro === t.nro); s.pass = fd.get('n'); s.debeCambiar = false; t.usado = true;
    S.auditoria.push({t:Date.now(), usuario:'Socio ' + s.nro, accion:'Restableció su contraseña con el enlace del correo'});
    enviarCorreo(s.email, 'Tu contraseña fue cambiada', plantillaCorreo('Tu contraseña fue cambiada', [`Hola ${esc(s.nombre.split(' ')[0])}:`, 'Te confirmamos que la contraseña de tu cuenta se cambió correctamente. Si no fuiste vos, comunicate de inmediato con la administración del complejo.']));
    save(); history.replaceState(null, '', location.pathname); ui.tk = null;
    ui.acceso = 'login'; ui.msg = {tipo:'ok', txt:'¡Listo! Ya podés ingresar con tu nueva contraseña.'}; render();
  },
  forzarpass: fd => {
    const s = socioActual();
    if (fd.get('n').length < 6) { toast('Mínimo 6 caracteres.', 'error'); return; }
    if (fd.get('n') !== fd.get('n2')) { toast('Las contraseñas no coinciden.', 'error'); return; }
    s.pass = fd.get('n'); s.debeCambiar = false; log('Cambió la contraseña temporal'); closeModal(); toast('Contraseña actualizada');
  },
  familiar: fd => { const s = socioActual(); s.grupo.push({nombre:fd.get('nombre').trim(), dni:fd.get('dni').trim(), parentesco:fd.get('parentesco'), estado:'pendiente'}); log('Solicitó alta de familiar: ' + fd.get('nombre').trim()); toast('Solicitud enviada a la administración'); render(); },
  chat: fd => preguntar(fd.get('q')),
  mailprueba: fd => { const c = enviarCorreo(fd.get('to').trim(), 'Correo de prueba', plantillaCorreo('Correo de prueba', ['Si recibiste este mensaje, el envío de correos del sistema funciona correctamente.'])); toast(correoReal() ? 'Enviando correo de prueba…' : 'Envío real desactivado: falta configurar EmailJS', correoReal() ? '' : 'error'); setTimeout(render, 2500); render(); },
  pbuscar: fd => { ui.pq = fd.get('q'); render(); },
  infopago: (fd, f) => {
    const r = S.reservas.find(x => x.id === f.dataset.id), file = fd.get('img');
    const fin = img => { r.pago = 'informado'; r.pagoInfo = {metodo:fd.get('metodo'), operacion:(fd.get('op') || '').trim(), t:Date.now(), img}; propagar(r); log(`Informó el pago de ${r.codigo} (${fd.get('metodo')})`); closeModal(); toast('¡Aviso enviado! La administración va a confirmar tu pago.'); render(); };
    if (file && file.size) achicarImagen(file).then(fin).catch(() => fin(null)); else fin(null);
  },
  datos: fd => { const s = socioActual(); s.email = fd.get('email').trim(); s.tel = fd.get('tel').trim(); log('Actualizó sus datos de contacto'); toast('Datos guardados'); render(); },
  pass: (fd, f) => { const s = socioActual(); if (fd.get('a') !== s.pass) { toast('La contraseña actual no es correcta.', 'error'); return; } if (fd.get('n').length < 6) { toast('La nueva contraseña debe tener al menos 6 caracteres.', 'error'); return; } if (fd.get('n') !== fd.get('n2')) { toast('Las contraseñas nuevas no coinciden.', 'error'); return; } s.pass = fd.get('n'); log('Cambió su contraseña'); f.reset(); toast('Contraseña actualizada'); },
  staff: fd => { const u = fd.get('user').trim(); if (S.staff.some(x => x.user === u) || S.socios.some(x => x.nro === u)) { toast('Ese usuario ya existe.', 'error'); return; } S.staff.push({user:u, nombre:fd.get('nombre').trim(), rol:fd.get('rol'), pass:fd.get('pass'), activo:true}); log(`Creó el usuario ${u} (${fd.get('rol')})`); toast('Usuario creado'); render(); },
  codigo: fd => { if (fd.get('c').trim()) validar(fd.get('c')); },
  filtro: fd => { ui.frap = ''; ui.f = {desde:fd.get('desde'), hasta:fd.get('hasta'), inst:fd.get('inst'), estado:fd.get('estado'), q:fd.get('q')}; render(); },
  nueva: (fd, f) => { const res = crearReserva(fd.get('nro').trim(), fd.get('inst'), fd.get('fecha'), fd.get('turno'), true, !!fd.get('efec')); if (res.error) { toast(res.error, 'error'); return; } f.reset(); comprobante(res.r); toast('Reserva registrada'); },
  modificar: (fd, f) => {
    const r = S.reservas.find(x => x.id === f.dataset.id), inst = getInst(r.instId), fe = fd.get('fecha'), t = fd.get('turno');
    if (turnoPasado(fe, t)) { toast('No se puede mover a una fecha u horario pasado.', 'error'); return; }
    if (ocup(r.instId, fe, t, r.id) >= inst.cupo) { toast('Ese horario está ocupado.', 'error'); return; }
    log(`Modificó la reserva ${r.codigo}: ${fmtF(r.fecha)} ${r.turno} → ${fmtF(fe)} ${t}`);
    r.fecha = fe; r.turno = t; save(); closeModal(); toast('Reserva modificada'); render();
  },
  noticia: fd => { S.noticias.push({id:'n' + Date.now(), tipo:fd.get('tipo'), titulo:fd.get('titulo').trim(), texto:fd.get('texto').trim(), fecha:Date.now()}); log('Publicó: ' + fd.get('titulo').trim()); toast('Publicado'); render(); },
  buscarsocio: fd => { ui.q = fd.get('q'); render(); }
};

document.addEventListener('click', e => {
  if (e.target.id === 'modal') { closeModal(); return; }
  const b = e.target.closest('[data-act]'); if (!b || b.disabled) return;
  e.preventDefault();
  ACT[b.dataset.act] && ACT[b.dataset.act](b, e);
});
document.addEventListener('submit', e => { const f = e.target.closest('form[data-form]'); if (!f) return; e.preventDefault(); FORM[f.dataset.form](new FormData(f), f); });
document.addEventListener('change', e => {
  if (e.target.id === 'restfile' && e.target.files[0]) {
    const rd = new FileReader();
    rd.onload = () => { try { const d = JSON.parse(rd.result); if (!d.reservas || !d.socios || !d.inst) throw 0; if (!confirm('¿Restaurar los datos desde el archivo? Se reemplazan los actuales.')) return; S = d; log('Restauró datos desde archivo'); toast('Datos restaurados'); render(); } catch (er) { toast('El archivo no es una copia válida del sistema.', 'error'); } };
    rd.readAsText(e.target.files[0]);
  }
  if (e.target.id === 'n_inst' || e.target.id === 'n_fecha') { $('#n_turno').innerHTML = turnoOpts(getInst($('#n_inst').value), $('#n_fecha').value); }
  if (e.target.id === 'agfecha' && e.target.value) { ui.ag = e.target.value; render(); }
  if (e.target.dataset.tarifaE) { const k = e.target.dataset.tarifaE, v = Math.max(0, Number(e.target.value) || 0); log(`Cambió la tarifa de entrada (${k}): ${pesos(S.tarifas[k])} → ${pesos(v)}`); S.tarifas[k] = v; toast('Tarifa actualizada'); }
  if (e.target.dataset.tarifa) { const i = getInst(e.target.dataset.tarifa); const v = Math.max(0, Number(e.target.value) || 0); log(`Cambió la tarifa de ${i.nombre}: ${pesos(i.tarifa)} → ${pesos(v)}`); i.tarifa = v; toast('Tarifa actualizada'); }
});
document.addEventListener('input', e => {
  if (e.target.id === 'n_nro') {
    const n = e.target.value.trim(), el = $('#n_socio'); if (!el) return;
    const s = S.socios.find(x => x.nro === n), pd = S.padron.find(x => x.nro === n);
    if (!n) el.innerHTML = 'Escribí el número para buscar al socio.';
    else if (s && s.activo === false) el.innerHTML = `<span style="color:var(--rojo)">${esc(s.nombre)}: cuenta suspendida</span>`;
    else if (s) el.innerHTML = `<span style="color:var(--verde);font-weight:600">${esc(s.nombre)}</span> · ${s.grupo.filter(g => g.estado === 'habilitado').length} familiares habilitados`;
    else if (pd) el.innerHTML = `<span style="color:var(--verde);font-weight:600">${esc(pd.nombre)}</span> · socio sin cuenta web`;
    else el.innerHTML = '<span style="color:var(--rojo)">No existe un socio con ese número</span>';
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function achicarImagen(file) {
  return new Promise((ok, mal) => {
    const fr = new FileReader();
    fr.onload = () => { const im = new Image(); im.onload = () => { const k = Math.min(1, 700 / Math.max(im.width, im.height)); const c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); ok(c.toDataURL('image/jpeg', 0.6)); }; im.onerror = mal; im.src = fr.result; };
    fr.onerror = mal; fr.readAsDataURL(file);
  });
}
function descargar(txt, nombre, tipo) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([txt], {type:tipo + ';charset=utf-8'}));
  a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
}
function autoBackup(forzar) {
  try {
    const bks = JSON.parse(localStorage.getItem(KEY + '_bk') || '[]');
    if (!forzar && bks.length && Date.now() - bks[bks.length - 1].t < 86400000) return true;
    bks.push({t:Date.now(), data:JSON.stringify(S)});
    while (bks.length > 3) bks.shift();
    localStorage.setItem(KEY + '_bk', JSON.stringify(bks));
    return true;
  } catch (e) { return false; }
}
let ultimaAct = Date.now();
['click', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, () => { ultimaAct = Date.now(); }, {passive:true}));
setInterval(() => {
  if (ses && Date.now() - ultimaAct > 15 * 60000) { log('Sesión cerrada por inactividad'); ses = null; ui = uiInicial(); ui.acceso = 'login'; ui.msg = {tipo:'err', txt:'Tu sesión se cerró por inactividad. Ingresá de nuevo.'}; closeModal(); render(); }
}, 30000);

load();
autoBackup(false);
{ const m = location.hash.match(/^#reset=([a-z0-9]+)/i); if (m && MODO === 'socio') { ui.tk = m[1]; ui.acceso = 'nuevaclave'; } }
render();
