/* Sistema de Gestión Integral — Complejo Policial Almudena (prototipo)
   MODO = 'socio' (index.html) o 'admin' (admin.html) */
const MODO = window.MODO || 'socio';
/* ===================== Utilidades ===================== */
const KEY = 'almudena_prototipo_v3';
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

/* ===================== Datos de ejemplo ===================== */
const INFO = {
  horarios: 'Martes a domingo de 9 a 22 h. Los lunes el complejo permanece cerrado por mantenimiento. Atención administrativa: martes a viernes de 9 a 13 h.',
  ubicacion: 'Complejo Policial Almudena, Salta Capital. (Cargar aquí la dirección exacta y el enlace a Google Maps.)',
  requisitos: ['Ser socio activo o integrante del grupo familiar habilitado.', 'Presentar el código QR de la reserva o la credencial de socio junto con el DNI.', 'Los invitados deben ingresar acompañados por el socio titular.', 'Para la pileta: revisación médica vigente.'],
  reglamento: ['Respetar el horario reservado; la tolerancia es de 15 minutos.', 'Cancelar con al menos 24 h de anticipación para liberar el turno.', 'No se permite el ingreso de mascotas.', 'El socio titular es responsable por daños en las instalaciones.', 'Prohibido el consumo de bebidas alcohólicas en canchas y pileta.']
};

const FAQ = [
  ['¿Con cuánta anticipación puedo reservar?', 'Hasta 30 días antes. Los turnos se liberan automáticamente cuando alguien cancela.'],
  ['¿Cuántas reservas puedo tener?', 'Una por tipo de instalación (quincho, cancha o pileta) por día.'],
  ['¿Cómo cancelo una reserva?', 'En “Mis reservas”, tocá “Cancelar”. Te pedimos hacerlo con 24 h de anticipación.'],
  ['¿Qué pasa si llueve?', 'Si hay alerta meteorológica se publica un aviso y las reservas al aire libre se reprograman sin costo.'],
  ['¿Pueden ir mis familiares?', 'Sí, los integrantes del grupo familiar habilitado. Podés solicitar altas desde “Mi familia”.'],
  ['¿Dónde y cómo pago?', 'Por ahora en la administración del complejo. Más adelante se podrá pagar online.'],
  ['¿Qué presento en la entrada?', 'El código QR de tu reserva (desde el celular o impreso) y tu DNI.']
];
const PAGO = {alias:'ALMUDENA.RESERVAS', cbu:'0000003100012345678901', titular:'Div. Complejo Pol. Almudena', plazo:'hasta 48 h antes del turno'};
const badgePago = p => ({pendiente:'<span class="badge b-amarillo">💲 Pago pendiente</span>', informado:'<span class="badge b-azul">🕓 Pago en revisión</span>', confirmado:'<span class="badge b-verde">✅ Pagado</span>', rechazado:'<span class="badge b-rojo">⛔ Pago rechazado</span>'}[p || 'pendiente']);
const icoPago = p => ({pendiente:'💲', informado:'🕓', confirmado:'✅', rechazado:'⛔'}[p || 'pendiente']);
function botonesPago(r) {
  let b = '';
  if (r.pagoInfo && r.pagoInfo.img) b += `<button class="btn-sm" data-act="pimg" data-id="${r.id}">🧾 Comprobante</button> `;
  if (r.pago === 'informado') b += `<button class="btn-sm" style="background:var(--verdeb);border-color:#a7e0bd;color:var(--verde)" data-act="pconf" data-id="${r.id}">✔ Confirmar</button> <button class="btn-sm rojo" data-act="prech" data-id="${r.id}">Rechazar</button>`;
  if ((r.pago === 'pendiente' || r.pago === 'rechazado') && r.estado !== 'cancelada') b += `<button class="btn-sm" data-act="pefec" data-id="${r.id}">💵 Registrar pago en efectivo</button>`;
  return b;
}
const ICON = {q1:'🍖', q2:'🍖', q3:'🍖', f1:'⚽', f2:'⚽', pd:'🎾', vo:'🏐', pi:'🏊'};
const unidad = i => i.tipo === 'Cancha' ? 'por hora' : i.tipo === 'Pileta' ? 'por grupo y turno' : 'por turno';
const maskDni = d => String(d).length > 4 ? String(d).slice(0, 2) + '.***.' + String(d).slice(-3) : '***';

function seed() {
  const inst = [
    {id:'q1', tipo:'Quincho', nombre:'Quincho 1', cap:'Hasta 30 personas', turnos:['Mediodía 11–16 h','Noche 20–01 h'], cupo:1, tarifa:18000, activo:true},
    {id:'q2', tipo:'Quincho', nombre:'Quincho 2', cap:'Hasta 30 personas', turnos:['Mediodía 11–16 h','Noche 20–01 h'], cupo:1, tarifa:18000, activo:true},
    {id:'q3', tipo:'Quincho', nombre:'Quincho grande', cap:'Hasta 60 personas', turnos:['Mediodía 11–16 h','Noche 20–01 h'], cupo:1, tarifa:30000, activo:true},
    {id:'f1', tipo:'Cancha', nombre:'Fútbol 5 – Cancha 1', cap:'10 jugadores', turnos:horas(9,22), cupo:1, tarifa:12000, activo:true},
    {id:'f2', tipo:'Cancha', nombre:'Fútbol 5 – Cancha 2', cap:'10 jugadores', turnos:horas(9,22), cupo:1, tarifa:12000, activo:true},
    {id:'pd', tipo:'Cancha', nombre:'Pádel', cap:'4 jugadores', turnos:horas(9,22), cupo:1, tarifa:8000, activo:true},
    {id:'vo', tipo:'Cancha', nombre:'Vóley', cap:'12 jugadores', turnos:horas(9,22), cupo:1, tarifa:5000, activo:true},
    {id:'pi', tipo:'Pileta', nombre:'Pileta (temporada)', cap:'40 grupos familiares por turno', turnos:['Mañana 10–14 h','Tarde 14–20 h'], cupo:40, tarifa:3000, activo:true}
  ];
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
  const s = {inst, padron, socios, reservas, noticias, auditoria:[], staff:[{user:'admin', pass:'admin', rol:'admin', nombre:'Administración'}, {user:'porteria', pass:'1234', rol:'porteria', nombre:'Personal de portería'}]};
  // reserva del socio demo
  const f3 = addDays(t0, 3);
  s.reservas = s.reservas.filter(r => !(r.instId === 'q2' && r.fecha === f3 && r.turno === 'Noche 20–01 h'));
  s.reservas.push({id:'r-demo', codigo:'ALM-7KQ4-X9TP', socio:'1001', instId:'q2', fecha:f3, turno:'Noche 20–01 h', estado:'confirmada', creada:now - 86400000, ingreso:null, pago:'pendiente'});
  s.reservas.forEach((r, k) => {
    r.monto = inst.find(i => i.id === r.instId).tarifa;
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

const getInst = id => S.inst.find(i => i.id === id) || {nombre:'?', tipo:'?', turnos:[], cupo:1};
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

/* ===================== Acceso ===================== */
function vistaSitio() {
  const ns = S.noticias.slice().sort((a, b) => b.fecha - a.fecha).slice(0, 3);
  const h = hoy();
  const T = [['Quincho', '🍖', 'Quinchos'], ['Cancha', '⚽', 'Canchas'], ['Pileta', '🏊', 'Pileta']];
  const dispo = T.map(([t, ic, n]) => {
    const is = S.inst.filter(i => i.tipo === t && i.activo);
    const lib = is.reduce((a, i) => a + i.turnos.filter(tu => !turnoPasado(h, tu) && ocup(i.id, h, tu) < i.cupo).length, 0);
    return `<div class="dispo"><span><span style="font-size:22px">${ic}</span> <b>${n}</b></span>${lib ? `<span class="badge b-verde">${lib} turnos libres</span>` : '<span class="badge b-gris">Sin turnos hoy</span>'}</div>`;
  }).join('');
  const desc = {Quincho:'Quinchos equipados para asados y reuniones familiares de hasta 60 personas.', Cancha:'Fútbol 5, pádel y vóley. Se reservan por hora, de 9 a 22 h.', Pileta:'Turnos de mañana y tarde durante la temporada de verano.'};
  return `<div class="sitio">
  <header class="s-head"><div class="marca"><div class="logo">CPA</div><div><b>Complejo Policial Almudena</b><small>Div. Complejo Pol. Almudena (DPyRI) · Salta</small></div></div>
    <nav class="s-nav"><a data-act="ir" data-id="s-como">Cómo reservar</a><a data-act="ir" data-id="s-inst">Instalaciones</a><a data-act="ir" data-id="s-nov">Novedades</a><a data-act="ir" data-id="s-info">Información</a></nav>
    <div class="s-acc"><button class="btn ghost" data-act="acceso" data-v="registro">Registrarme</button><button class="btn" data-act="acceso" data-v="login">Ingresar</button></div></header>
  <section class="hero"><div><span class="badge-proto">PROTOTIPO</span><h1>Reservá quinchos, canchas y pileta sin llamar ni hacer filas</h1>
    <p>El sistema online para los socios del Complejo Policial Almudena. Elegí el día, mirá la disponibilidad en el momento y recibí tu comprobante con código QR.</p>
    <div class="chips"><button class="btn" data-act="acceso" data-v="login">Ingresar como socio</button><button class="btn ghost" data-act="acceso" data-v="registro">Crear mi cuenta</button></div></div>
    <div class="hero-card"><h3>Disponibilidad de hoy</h3><p class="small muted" style="margin-top:-4px">${fmtFL(h)} · se actualiza en tiempo real</p>${dispo}</div></section>
  <section class="s-sec" id="s-como"><h2>Cómo reservar en 3 pasos</h2><p class="sub">Desde la computadora, la tablet o el celular.</p><div class="grid3">
    <div class="card"><span class="num">1</span><h3>Ingresá</h3><p class="muted">Con tu número de socio o DNI y tu contraseña. Si es tu primera vez, registrate en un minuto.</p></div>
    <div class="card"><span class="num">2</span><h3>Elegí lugar, día y horario</h3><p class="muted">El calendario te muestra en colores qué está libre. Los horarios ocupados se bloquean solos.</p></div>
    <div class="card"><span class="num">3</span><h3>Mostrá tu QR</h3><p class="muted">Recibís el comprobante al instante. En la entrada el personal lo escanea y listo.</p></div></div></section>
  <section class="s-sec" id="s-inst"><h2>Instalaciones</h2><p class="sub">Tarifas vigentes para socios.</p><div class="grid3">
    ${T.map(([t, ic, n]) => { const is = S.inst.filter(i => i.tipo === t); return `<div class="card"><span class="icg">${ic}</span><h3>${n}</h3><p class="muted">${desc[t]}</p>${is.map(i => `<div class="rl"><span>${esc(i.nombre)}</span><b>${i.activo ? pesos(i.tarifa) : 'En mantenimiento'}</b></div>`).join('')}</div>`; }).join('')}</div></section>
  <section class="s-sec" id="s-nov"><h2>Novedades</h2><p class="sub">Comunicados oficiales del complejo.</p><div class="grid3">
    ${ns.map(n => `<div class="card noticia ${esc(n.tipo)}">${badgeNot(n.tipo)}<h3 style="margin:10px 0 0">${esc(n.titulo)}</h3><p>${esc(n.texto)}</p><p class="small muted">${fmtDT(n.fecha)}</p></div>`).join('')}</div></section>
  <section class="s-sec" id="s-info"><h2>Información útil</h2><p class="sub">Lo que tenés que saber antes de venir.</p><div class="grid3">
    <div class="card"><span class="icg">🕘</span><h3>Horarios</h3><p class="muted">${esc(INFO.horarios)}</p></div>
    <div class="card"><span class="icg">📍</span><h3>Ubicación</h3><p class="muted">${esc(INFO.ubicacion)}</p></div>
    <div class="card"><span class="icg">✅</span><h3>Requisitos para ingresar</h3><ul class="muted" style="padding-left:18px;margin:0">${INFO.requisitos.map(x => '<li>' + esc(x) + '</li>').join('')}</ul></div></div></section>
  <footer class="s-foot">Complejo Policial Almudena · Sistema de Gestión Integral · Prototipo de demostración con datos de ejemplo</footer></div>`;
}

function vistaAcceso() {
  if (ui.acceso === 'sitio') return vistaSitio();
  const m = ui.msg ? `<div class="${ui.msg.tipo}">${esc(ui.msg.txt)}</div>` : '';
  let body = '';
  if (ui.acceso === 'login') body = `
    <h3>${MODO === 'admin' ? 'Ingreso del personal' : 'Ingresar'}</h3>
    <form data-form="login">
      <label>${MODO === 'admin' ? 'Usuario' : 'N° de socio o DNI'}</label><input name="u" required autocomplete="username">
      <label>Contraseña</label><input name="p" type="password" required autocomplete="current-password">
      <button class="btn full" style="margin-top:14px">Ingresar</button>
    </form>${m}
    ${MODO === 'admin' ? `<p class="small muted" style="text-align:center;margin-top:14px">¿Olvidaste tu contraseña? Pedí el restablecimiento a un administrador.</p>
    <div class="demo"><b>Cuentas de demostración</b> (prototipo):
      <div class="chips"><button class="chip" data-act="demo" data-u="admin" data-p="admin">Administrador</button><button class="chip" data-act="demo" data-u="porteria" data-p="1234">Portería</button></div></div>
    <div class="links" style="justify-content:center"><a href="index.html">← Ir al sitio de socios</a></div>`
    : `<div class="links"><a data-act="acceso" data-v="registro">Registrarme</a><a data-act="acceso" data-v="recuperar">Olvidé mi contraseña</a></div>
    <div class="links" style="justify-content:center"><a data-act="acceso" data-v="sitio">← Volver al sitio</a></div>
    <div class="demo"><b>Cuenta de demostración</b> (prototipo):
      <div class="chips"><button class="chip" data-act="demo" data-u="1001" data-p="1234">Entrar como Socio 1001</button></div></div>
    <p class="small muted" style="text-align:center;margin-top:12px"><a href="admin.html" style="color:var(--gris)">Acceso para el personal del complejo</a></p>`}`;
  if (ui.acceso === 'registro') body = `
    <h3>Formulario de registro</h3>
    <p class="muted small">El sistema valida automáticamente que el número de socio y el DNI coincidan con el padrón. Para probar usá socio 1003 y DNI 33444555.</p>
    <form data-form="registro">
      <label>N° de socio</label><input name="nro" required inputmode="numeric">
      <label>DNI del titular</label><input name="dni" required inputmode="numeric">
      <label>Correo electrónico</label><input name="email" type="email" required>
      <label>Teléfono (WhatsApp)</label><input name="tel" inputmode="tel">
      <label>Contraseña (mínimo 6 caracteres)</label><input name="p" type="password" required minlength="6">
      <label>Repetir contraseña</label><input name="p2" type="password" required>
      <label class="check" style="margin-top:12px"><input type="checkbox" name="consent" value="1"> <span>Acepto que mis datos se usen solo para la gestión del complejo, conforme a la Ley 25.326 de Protección de Datos Personales.</span></label>
      <button class="btn full" style="margin-top:14px">Crear cuenta</button>
    </form>${m}
    <div class="links"><a data-act="acceso" data-v="login">← Volver al ingreso</a></div>`;
  if (ui.acceso === 'recuperar') body = `
    <h3>Recuperar contraseña</h3>
    <p class="muted small">Te enviamos un enlace de un solo uso, válido por 30 minutos, al correo registrado.</p>
    <form data-form="recuperar">
      <label>N° de socio</label><input name="nro" required>
      <label>Correo electrónico registrado</label><input name="email" type="email" required>
      <button class="btn full" style="margin-top:14px">Enviar enlace</button>
    </form>${m}
    <div class="links"><a data-act="acceso" data-v="login">← Volver al ingreso</a></div>`;
  return `<div class="acceso"><div class="box">
    <div class="marca"><div class="logo">CPA</div><div><b>Complejo Policial Almudena</b><small style="color:var(--gris)">${MODO === 'admin' ? 'Administración' : 'Reservas para socios'} <span class="badge-proto">PROTOTIPO</span></small></div></div>
    ${body}
    <p class="small muted" style="text-align:center;margin-top:16px"><a data-act="reset" style="cursor:pointer;text-decoration:underline">Reiniciar datos de demostración</a></p>
  </div></div>`;
}

/* ===================== Vistas ===================== */
const ICONOS = {pagos:'💳', disponibilidad:'🟢', agenda:'📆', inicio:'🏠', reservar:'📅', mis:'🎟️', asistente:'💬', perfil:'👤', validar:'📷', ingresos:'🚪', panel:'📊', reservas:'🗂️', nueva:'➕', instalaciones:'🏟️', comunicados:'📢', socios:'👥', seguridad:'🔒', auditoria:'📜'};
const NAV = {
  socio:[['inicio','Inicio','🏠'],['reservar','Reservar','📅'],['mis','Mis reservas','🎟️'],['asistente','Asistente','💬'],['perfil','Mi cuenta','👤']],
  porteria:[['validar','Validar QR'],['ingresos','Ingresos de hoy']],
  admin:[['_','Principal'],['panel','Inicio'],['disponibilidad','Disponibilidad'],['agenda','Agenda del día'],['pagos','Pagos'],['reservas','Reservas'],['nueva','Nueva reserva'],['_','Gestión'],['socios','Socios'],['instalaciones','Instalaciones'],['comunicados','Comunicados'],['_','Sistema'],['seguridad','Seguridad'],['auditoria','Auditoría']]
};

function listaNoticias(admin, limite, tipo) {
  let ns = S.noticias.slice().sort((a, b) => b.fecha - a.fecha);
  if (tipo) ns = ns.filter(n => n.tipo === tipo);
  if (limite) ns = ns.slice(0, limite);
  if (!ns.length) return '<p class="muted">No hay publicaciones.</p>';
  return ns.map(n => `<div class="card noticia ${esc(n.tipo)}">
    <div style="display:flex;justify-content:space-between;gap:8px;align-items:center">${badgeNot(n.tipo)}<span class="small muted">${fmtDT(n.fecha)}</span></div>
    <h3 style="margin:8px 0 0">${esc(n.titulo)}</h3><p>${esc(n.texto)}</p>
    ${admin ? `<div style="margin-top:10px"><button class="btn-sm rojo" data-act="delnot" data-id="${n.id}">Eliminar</button></div>` : ''}</div>`).join('');
}

const V = {
  inicio() {
    const s = socioActual();
    const alertas = S.noticias.filter(n => ['Clima', 'Mantenimiento'].includes(n.tipo) && Date.now() - n.fecha < 3 * 86400000);
    const prox = S.reservas.filter(r => r.socio === s.nro && r.estado === 'confirmada' && r.fecha >= hoy()).sort((a, b) => a.fecha.localeCompare(b.fecha) || inicioTurno(a.turno) - inicioTurno(b.turno))[0];
    const hr = new Date().getHours(), saludo = hr < 12 ? 'Buen día' : hr < 20 ? 'Buenas tardes' : 'Buenas noches';
    const tiles = [['nuevares', '📅', 'Reservar', 'Quinchos, canchas y pileta', 'prim'], ['mis', '🎟️', 'Mis reservas', 'Ver mi QR o cancelar'], ['credencial', '🪪', 'Mi credencial', 'Credencial digital de socio'],
      ['asistente', '💬', 'Preguntar', 'Asistente virtual las 24 h'], ['info', 'ℹ️', 'Información', 'Horarios, tarifas, reglamento'], ['familia', '👨‍👩‍👧', 'Mi familia', 'Grupo familiar habilitado']];
    const debe = S.reservas.filter(r => r.socio === s.nro && r.estado === 'confirmada' && r.fecha >= hoy() && ['pendiente', 'rechazado'].includes(r.pago)).length;
    const alHtml = (debe ? `<div class="alerta" style="background:#fff7e0"><span style="font-size:22px">💲</span><div style="flex:1"><b>Tenés ${debe} reserva${debe > 1 ? 's' : ''} con pago pendiente</b>Pagá por transferencia o Mercado Pago e informá el pago desde “Mis reservas”.</div><button class="btn-sm" data-act="nav" data-v="mis">Pagar</button></div>` : '') + alertas.map(a => `<div class="alerta"><span style="font-size:22px">${a.tipo === 'Clima' ? '⛈️' : '🛠️'}</span><div><b>${esc(a.titulo)}</b>${esc(a.texto)}</div></div>`).join('');
    return `<div class="home"><div class="home-main"><div class="solo-movil">${alHtml}</div>
    <h2 class="hola">${saludo}, ${esc(s.nombre.split(' ')[0])} 👋</h2><p class="sub">¿Qué querés hacer hoy?</p>
    ${prox ? `<div class="prox"><div><small>Tu próxima reserva</small><b>${ICON[prox.instId] || ''} ${esc(instNombre(prox.instId))}</b>${fmtFL(prox.fecha)} · ${esc(prox.turno)}<div style="margin-top:6px">${badgePago(prox.pago)}</div></div><button class="btn" data-act="verqr" data-id="${prox.id}">Mostrar QR</button></div>` : ''}
    <div class="tiles">${tiles.map(([v, ic, t, d, c]) => `<button class="tile ${c || ''}" ${v === 'nuevares' ? 'data-act="nuevares"' : `data-act="nav" data-v="${v}"`}><span class="ic">${ic}</span><b>${t}</b><span class="d">${d}</span></button>`).join('')}</div>
    </div><div class="home-side"><div class="solo-pc">${alHtml}</div><div style="display:flex;justify-content:space-between;align-items:center"><h3 class="sec" style="margin-top:6px">Novedades</h3><button class="link" data-act="nav" data-v="novedades">Ver todas</button></div>${listaNoticias(false, 3)}</div></div>`;
  },

  novedades() {
    const tipos = ['', ...TIPOS_NOT.filter(t => S.noticias.some(n => n.tipo === t))];
    return `<button class="back" data-act="nav" data-v="inicio">← Inicio</button><h2>Comunicados y novedades</h2>
    <div class="chips" style="margin-bottom:14px">${tipos.map(t => `<button class="chip ${ui.ntipo === t ? 'on' : ''}" data-act="ntipo" data-t="${t}">${t || 'Todas'}</button>`).join('')}</div>${listaNoticias(false, 0, ui.ntipo)}`;
  },

  reservar() {
    const w = ui.wiz;
    const pasos = ['Qué', 'Cuál', 'Día', 'Horario', 'Confirmar'];
    const st = `<div class="stepper">${pasos.map((p, i) => `<div class="${i < w.paso ? 'on' : ''}"><i></i>${p}</div>`).join('')}</div>`;
    const back = w.paso > 1 ? '<button class="back" data-act="wback">← Volver</button>' : '';
    let c = '';
    if (w.paso === 1) {
      const T = [['Quincho', '🍖', 'Quinchos', 'Para asados y reuniones'], ['Cancha', '⚽', 'Canchas', 'Fútbol 5, pádel y vóley, por hora'], ['Pileta', '🏊', 'Pileta', 'Turno mañana o tarde, en temporada']];
      c = `<h2 class="wtit">¿Qué querés reservar?</h2><p class="sub">Tocá una opción para empezar.</p><div class="opciones">${T.map(([t, ic, n, d]) => {
        const is = S.inst.filter(i => i.tipo === t), act = is.some(i => i.activo), min = Math.min(...is.map(i => i.tarifa));
        return `<button class="opcion" data-act="wtipo" data-t="${t}" ${act ? '' : 'disabled'}><span class="ic">${ic}</span><span><b>${n}</b><span class="d">${d}</span><span class="p">${act ? 'Desde ' + pesos(min) : 'Suspendido por mantenimiento'}</span></span></button>`;
      }).join('')}</div>`;
    }
    if (w.paso === 2) {
      const is = S.inst.filter(i => i.tipo === w.tipo);
      c = `<h2 class="wtit">¿Cuál ${w.tipo === 'Quincho' ? 'quincho' : 'cancha'} preferís?</h2><p class="sub">Elegí el lugar.</p><div class="opciones">${is.map(i => `<button class="opcion" data-act="winst" data-id="${i.id}" ${i.activo ? '' : 'disabled'}><span class="ic">${ICON[i.id]}</span><span><b>${esc(i.nombre)}</b><span class="d">${esc(i.cap)}</span><span class="p">${i.activo ? pesos(i.tarifa) + ' ' + unidad(i) : 'En mantenimiento'}</span></span></button>`).join('')}</div>`;
    }
    if (w.paso === 3) {
      const inst = getInst(w.inst);
      let dias = '';
      for (let k = 0; k < 14; k++) {
        const f = addDays(hoy(), k), e = estadoDia(inst, f), d = new Date(f + 'T12:00'), off = e === 'lleno' || e === 'cerrado';
        dias += `<button class="dchip ${e} ${w.dia === f ? 'sel' : ''}" data-act="wdia" data-f="${f}" ${off ? 'disabled' : ''}><small>${k === 0 ? 'Hoy' : k === 1 ? 'Mañana' : cap1(d.toLocaleDateString('es-AR', {weekday:'short'}).replace('.', ''))}</small><b>${d.getDate()}</b><em>${{libre:'Libre', parcial:'Pocos', lleno:'Completo', cerrado:'Cerrado'}[e] || ''}</em></button>`;
      }
      c = `<h2 class="wtit">¿Qué día?</h2><p class="sub">${ICON[inst.id]} ${esc(inst.nombre)} · deslizá para ver más días.</p><div class="dias">${dias}</div>
      <button class="link wcal-btn" data-act="wcal">${ui.verCal ? 'Ocultar calendario' : '📅 Ver calendario completo (hasta 30 días)'}</button>
      <div class="cal-wrap ${ui.verCal ? 'open' : ''}"><div class="card" style="margin-top:12px;max-width:460px"><p class="small muted" style="margin:0 0 4px">O elegí en el calendario (hasta 30 días):</p>${calendario(inst)}<div class="leyenda"><span><i style="background:var(--verdeb);border:1px solid #a7e0bd"></i>Libre</span><span><i style="background:var(--amarillob);border:1px solid #f0d58c"></i>Pocos turnos</span><span><i style="background:var(--rojob);border:1px solid #f3b4b4"></i>Completo</span></div></div></div>`;
    }
    if (w.paso === 4) {
      const inst = getInst(w.inst);
      const hs = inst.turnos.map(t => {
        const lib = inst.cupo - ocup(inst.id, w.dia, t), pas = turnoPasado(w.dia, t), ok = lib > 0 && !pas && inst.activo;
        return `<button class="hbtn" ${ok ? `data-act="wturno" data-t="${esc(t)}"` : 'disabled'}><b>${esc(t)}</b><span>${pas ? 'Ya pasó' : ok ? (inst.cupo > 1 ? lib + ' lugares libres' : 'Disponible') : 'Ocupado'}</span></button>`;
      }).join('');
      c = `<h2 class="wtit">¿En qué horario?</h2><p class="sub">${ICON[inst.id]} ${esc(inst.nombre)} · ${fmtFL(w.dia)}</p><div class="horarios">${hs}</div>`;
    }
    if (w.paso === 5) {
      const inst = getInst(w.inst);
      c = `<h2 class="wtit">Revisá y confirmá</h2><p class="sub">Si está todo bien, tocá “Confirmar reserva”.</p>
      <div class="resumen"><table class="kv"><tr><td>Lugar</td><td><b>${ICON[inst.id]} ${esc(inst.nombre)}</b></td></tr><tr><td>Día</td><td>${fmtFL(w.dia)}</td></tr><tr><td>Horario</td><td>${esc(w.turno)}</td></tr><tr><td>Capacidad</td><td>${esc(inst.cap)}</td></tr><tr><td>Costo</td><td>${pesos(inst.tarifa)} <span class="small muted">(se abona en el complejo)</span></td></tr></table></div>
      <label class="check" style="margin:16px 0"><input type="checkbox" id="acepto"> <span>Acepto el <button type="button" class="link" data-act="verreg">reglamento del complejo</button></span></label>
      <button class="btn grande" data-act="confirmar">✔ Confirmar reserva</button><p class="small muted" style="text-align:center">Vas a recibir tu comprobante con código QR al instante. Después pagás por transferencia o Mercado Pago (${PAGO.plazo}) e informás el pago con una foto del comprobante.</p>`;
    }
    const ins = w.inst ? getInst(w.inst) : null;
    const fila = (l, v) => `<div class="rl ${v ? 'hecho' : ''}"><span>${l}</span><b>${v ? esc(v) : '<span class="muted">—</span>'}</b></div>`;
    const res = `<div class="card"><h3>Tu reserva</h3>${fila('Tipo', w.paso > 1 ? w.tipo : '')}${fila('Lugar', w.paso > 2 && ins ? ins.nombre : '')}${fila('Día', w.paso > 3 && w.dia ? fmtFL(w.dia) : '')}${fila('Horario', w.paso > 4 ? w.turno : '')}${fila('Costo', w.paso > 2 && ins ? pesos(ins.tarifa) + ' ' + unidad(ins) : '')}</div>
      <div class="card"><b>¿Necesitás ayuda?</b><p class="small muted">El asistente responde tus dudas y te guía en cada paso.</p><button class="btn ghost full" data-act="nav" data-v="asistente">💬 Abrir asistente</button></div>`;
    return `<div class="wiz"><div class="wiz-main">${back}${st}${c}</div><aside class="wiz-res">${res}</aside></div>`;
  },

  mis() {
    const s = socioActual();
    const rs = S.reservas.filter(r => r.socio === s.nro);
    const prox = rs.filter(r => r.estado === 'confirmada' && r.fecha >= hoy()).sort((a, b) => a.fecha.localeCompare(b.fecha) || inicioTurno(a.turno) - inicioTurno(b.turno));
    const hist = rs.filter(r => !prox.includes(r)).sort((a, b) => b.fecha.localeCompare(a.fecha));
    const lista = ui.mtab === 'hist' ? hist : prox;
    const card = r => `<div class="rcard"><span class="ic">${ICON[r.instId] || '📍'}</span><div class="info"><b>${esc(instNombre(r.instId))}</b> ${badgeEstado(r.estado)}<br><span class="small muted">${fmtFL(r.fecha)} · ${esc(r.turno)} · ${pesos(r.monto || 0)}${r.ingreso ? '<br>Ingresó ' + fmtDT(r.ingreso) : ''}</span>${r.estado !== 'cancelada' ? '<br>' + badgePago(r.pago) : ''}</div>
      ${r.estado === 'confirmada' && r.fecha >= hoy() ? `<div class="acc">${['pendiente', 'rechazado'].includes(r.pago) ? `<button class="btn" data-act="pagar" data-id="${r.id}">💲 Pagar</button>` : ''}<button class="btn ${['pendiente', 'rechazado'].includes(r.pago) ? 'ghost' : ''}" data-act="verqr" data-id="${r.id}">Mostrar QR</button><button class="btn ghost" data-act="cancelar" data-id="${r.id}">Cancelar</button></div>` : r.estado !== 'cancelada' ? `<button class="btn-sm" data-act="verqr" data-id="${r.id}">Ver comprobante</button>` : ''}</div>`;
    return `<h2>Mis reservas</h2>
    <div class="seg"><button class="${ui.mtab !== 'hist' ? 'on' : ''}" data-act="mtab" data-t="prox">Próximas (${prox.length})</button><button class="${ui.mtab === 'hist' ? 'on' : ''}" data-act="mtab" data-t="hist">Historial (${hist.length})</button></div>
    ${lista.length ? lista.map(card).join('') : `<div class="card vacio"><div class="ic">${ui.mtab === 'hist' ? '🗂️' : '📅'}</div><p>${ui.mtab === 'hist' ? 'Todavía no tenés historial.' : 'No tenés reservas próximas.'}</p>${ui.mtab === 'hist' ? '' : '<button class="btn" data-act="nuevares">Hacer una reserva</button>'}</div>`}`;
  },

  perfil() {
    const s = socioActual();
    const ini = s.nombre.split(' ').map(x => x[0]).slice(0, 2).join('');
    return `<h2>Mi cuenta</h2>
    <div class="card" style="display:flex;gap:14px;align-items:center"><div class="avatar">${esc(ini)}</div><div><b style="font-size:17px">${esc(s.nombre)}</b><br><span class="muted small">Socio N° ${s.nro} · DNI ${maskDni(s.dni)}</span></div></div>
    <div class="tiles"><button class="tile" data-act="nav" data-v="credencial"><span class="ic">🪪</span><b>Mi credencial</b><span class="d">Mostrala en la entrada</span></button><button class="tile" data-act="nav" data-v="familia"><span class="ic">👨‍👩‍👧</span><b>Mi familia</b><span class="d">${s.grupo.filter(g => g.estado === 'habilitado').length} habilitados</span></button><button class="tile" data-act="nav" data-v="info"><span class="ic">ℹ️</span><b>Información</b><span class="d">Reglamento y más</span></button></div>
    <div class="card"><h3>Mis datos de contacto</h3><form data-form="datos"><label>Correo electrónico</label><input name="email" type="email" required value="${esc(s.email)}"><label>Teléfono (WhatsApp)</label><input name="tel" inputmode="tel" value="${esc(s.tel || '')}"><button class="btn" style="margin-top:12px">Guardar cambios</button></form></div>
    <div class="card"><h3>Cambiar contraseña</h3><form data-form="pass"><label>Contraseña actual</label><input name="a" type="password" required autocomplete="current-password"><label>Nueva contraseña (mínimo 6 caracteres)</label><input name="n" type="password" required minlength="6" autocomplete="new-password"><label>Repetir nueva contraseña</label><input name="n2" type="password" required autocomplete="new-password"><button class="btn" style="margin-top:12px">Cambiar contraseña</button></form></div>
    <button class="btn ghost full" data-act="salir">Cerrar sesión</button>`;
  },

  credencial() {
    const s = socioActual(), fam = s.grupo.filter(g => g.estado === 'habilitado');
    return `<button class="back" data-act="nav" data-v="perfil">← Mi cuenta</button><h2>Mi credencial digital</h2>
    <div class="credencial"><div class="cmp-head" style="justify-content:center;margin:0"><div class="logo">CPA</div><div style="text-align:left"><b>Complejo Policial Almudena</b><small style="color:#cfe0f5">Credencial de socio</small></div></div>
      <div class="qrbox"><div class="qr" data-qr="CPA-SOCIO-${s.nro}"></div></div><b style="font-size:20px;display:block">${esc(s.nombre)}</b><div>Socio N° ${s.nro}</div>
      <div class="small" style="opacity:.85;margin-top:8px">${fam.length ? 'Grupo familiar: ' + fam.map(g => esc(g.nombre)).join(', ') : 'Sin grupo familiar cargado'}</div></div>
    <p class="muted small" style="text-align:center;margin-top:12px">Mostrala en la portería junto con tu DNI. Para usar una instalación reservada, mostrá el QR de la reserva.</p>`;
  },

  info() {
    const acc = (t, html, open) => `<details class="acc" ${open ? 'open' : ''}><summary>${t}</summary><div class="cont">${html}</div></details>`;
    const ul = a => '<ul>' + a.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
    const docs = S.noticias.filter(n => ['Reglamento', 'Documentación'].includes(n.tipo));
    return `<h2>Información del complejo</h2><p class="sub">Tocá cada tema para ver el detalle.</p>
    ${acc('🕘 Horarios de atención', esc(INFO.horarios), true)}
    ${acc('💲 Tarifas', ul(S.inst.map(i => `${i.nombre}: ${pesos(i.tarifa)} ${unidad(i)}${i.activo ? '' : ' (suspendida)'}`)))}
    ${acc('📍 Ubicación', esc(INFO.ubicacion))}
    ${acc('✅ Requisitos para ingresar', ul(INFO.requisitos))}
    ${acc('📘 Reglamento del complejo', ul(INFO.reglamento) + '<button class="btn-sm" data-act="descreg">Descargar reglamento</button>')}
    ${acc('❓ Preguntas frecuentes', FAQ.map(([q, a]) => `<p><b>${esc(q)}</b><br>${esc(a)}</p>`).join(''))}
    ${acc('📄 Documentación institucional', docs.length ? docs.map(d => `<p><b>${esc(d.titulo)}</b><br>${esc(d.texto)}</p>`).join('') : '<p class="muted">No hay documentos publicados.</p>')}
    <div class="card" style="text-align:center;margin-top:14px"><p style="margin-top:0">¿No encontrás lo que buscás?</p><button class="btn" data-act="nav" data-v="asistente">💬 Preguntale al asistente</button></div>`;
  },

  familia() {
    const s = socioActual();
    return `<button class="back" data-act="nav" data-v="perfil">← Mi cuenta</button><h2>Mi grupo familiar</h2>
    <div class="card"><h3>Titular</h3><div class="item"><div><b>${esc(s.nombre)}</b><br><span class="small muted">Socio N° ${s.nro} · DNI ${maskDni(s.dni)}</span></div><span class="badge b-verde">Habilitado</span></div></div>
    <div class="card"><h3>Integrantes</h3>${s.grupo.length ? s.grupo.map(g => `<div class="item"><div><b>${esc(g.nombre)}</b><br><span class="small muted">${esc(g.parentesco)} · DNI ${maskDni(g.dni)}</span></div>${g.estado === 'habilitado' ? '<span class="badge b-verde">Habilitado</span>' : '<span class="badge b-amarillo">Pendiente de aprobación</span>'}</div>`).join('') : '<p class="muted">No hay integrantes cargados.</p>'}</div>
    <div class="card"><h3>Solicitar alta de un familiar</h3><p class="small muted">La administración verifica la documentación antes de habilitarlo.</p>
      <form data-form="familiar"><div class="grid2"><div><label>Nombre y apellido</label><input name="nombre" required></div><div><label>DNI</label><input name="dni" required inputmode="numeric"></div></div>
      <label>Parentesco</label><select name="parentesco"><option>Cónyuge</option><option>Hijo/a</option><option>Padre/Madre</option><option>Otro</option></select>
      <button class="btn" style="margin-top:12px">Enviar solicitud</button></form></div>`;
  },

  asistente() {
    if (!ui.chat.length) ui.chat.push({de:'bot', html:'¡Hola! Soy el asistente virtual del Complejo Policial Almudena. Puedo responderte sobre <b>horarios, tarifas, reglamento, disponibilidad, actividades, eventos, requisitos de ingreso y ubicación</b>, y guiarte para hacer una reserva. ¿En qué te ayudo?'});
    const sugs = ['¿Qué hay libre mañana?', '¿Cuánto cuesta un quincho?', '¿Cómo reservo?', 'Horarios', 'Requisitos para ingresar', 'Reglamento', 'Próximos eventos', '¿Dónde queda?'];
    return `<h2>Asistente virtual</h2>
    <div class="card chat"><div class="msgs" id="msgs">${ui.chat.map(m => `<div class="msg ${m.de}">${m.html}</div>`).join('')}</div>
      <div class="sugs">${sugs.map(x => `<button class="chip" data-act="preg" data-q="${esc(x)}">${esc(x)}</button>`).join('')}</div>
      <form data-form="chat" class="chatform"><input name="q" id="chatq" placeholder="Escribí tu consulta…" autocomplete="off"><button class="btn">Enviar</button></form></div>
    <p class="small muted">Prototipo: responde con reglas y con los datos cargados en el sistema (tarifas, disponibilidad y comunicados reales del sistema). En la versión final se conecta a un modelo de inteligencia artificial.</p>`;
  },

  validar() {
    const v = ui.validacion;
    const ico = {ok:'✅', warn:'⚠️', error:'⛔'};
    return `<h2>Validar ingreso</h2>
    <div class="grid2"><div class="card"><h3>Escanear código QR</h3>
      <div class="cam"><video id="video" playsinline muted></video><div class="cam-ph" id="camph">Cámara apagada</div></div>
      <button class="btn full" type="button" data-act="camara">Activar cámara</button>
      <form data-form="codigo" class="row"><input name="c" placeholder="O ingresá el código: ALM-XXXX-XXXX" autocomplete="off"><button class="btn ghost">Validar</button></form>
      <p class="small muted">Para probar: en “Ingresos de hoy” podés simular el escaneo de una reserva.</p></div>
    <div class="card resultado ${v ? v.tipo : ''}">${v ? `<div class="icono">${ico[v.tipo]}</div><h3>${esc(v.titulo)}</h3><p>${v.html}</p><p class="small muted">${fmtDT(v.t)}</p>` : '<p class="muted">El resultado de la validación aparece acá.</p>'}</div></div>`;
  },

  ingresos() {
    const h = hoy();
    const rs = S.reservas.filter(r => r.fecha === h && r.estado !== 'cancelada').sort((a, b) => inicioTurno(a.turno) - inicioTurno(b.turno));
    const dentro = rs.filter(r => r.estado === 'utilizada'), esperan = rs.filter(r => r.estado === 'confirmada');
    return `<h2>Ingresos de hoy</h2>
    <div class="kpis"><div class="kpi"><b>${rs.length}</b><span>Reservas del día</span></div><div class="kpi"><b>${dentro.length}</b><span>Ingresos registrados</span></div><div class="kpi"><b>${esperan.length}</b><span>Pendientes de ingreso</span></div><div class="kpi"><b>${fmtH(Date.now())}</b><span>Hora actual</span></div></div>
    <div class="card"><h3>Pendientes de ingreso</h3>${esperan.length ? esperan.map(r => `<div class="item"><div><b>${esc(instNombre(r.instId))}</b> · ${esc(r.turno)}<br><span class="small muted">${esc(nombreSocio(r.socio))} (socio ${r.socio}) · ${r.codigo}</span></div><button class="btn-sm" data-act="simular" data-c="${r.codigo}">Simular escaneo</button></div>`).join('') : '<p class="muted">No hay ingresos pendientes.</p>'}</div>
    <div class="card"><h3>Ingresos registrados</h3>${dentro.length ? dentro.map(r => `<div class="item"><div><b>${esc(instNombre(r.instId))}</b> · ${esc(r.turno)}<br><span class="small muted">${esc(nombreSocio(r.socio))} · ${r.codigo}</span></div><span class="badge b-azul">Ingresó ${r.ingreso ? fmtH(r.ingreso) : ''}</span></div>`).join('') : '<p class="muted">Todavía no se registraron ingresos.</p>'}</div>`;
  },

  panel() {
    const h = hoy(), mes = h.slice(0, 7), anio = h.slice(0, 4);
    const val = S.reservas.filter(r => r.estado !== 'cancelada');
    const activas = S.reservas.filter(r => r.estado === 'confirmada' && r.fecha >= h).length;
    const delMes = val.filter(r => r.fecha.startsWith(mes)).length;
    const hoyR = S.reservas.filter(r => r.fecha === h && r.estado !== 'cancelada').sort((a, b) => inicioTurno(a.turno) - inicioTurno(b.turno));
    const ingHoy = hoyR.filter(r => r.estado === 'utilizada').length, espHoy = hoyR.filter(r => r.estado === 'confirmada');
    let tot = 0, oc = 0;
    for (let i = 0; i < 7; i++) { const f = addDays(h, i); S.inst.filter(x => x.cupo === 1).forEach(x => x.turnos.forEach(t => { tot++; if (ocup(x.id, f, t)) oc++; })); }
    const porInst = S.inst.map(i => [i.nombre, val.filter(r => r.instId === i.id && r.fecha.startsWith(mes)).length]);
    const meses = []; const d = new Date(); d.setDate(1);
    for (let i = 5; i >= 0; i--) { const x = new Date(d.getFullYear(), d.getMonth() - i, 1); const k = x.getFullYear() + '-' + z(x.getMonth() + 1); meses.push([cap1(x.toLocaleDateString('es-AR', {month:'short', year:'2-digit'})), val.filter(r => r.fecha.startsWith(k)).length]); }
    const cancel = S.reservas.filter(r => r.estado === 'cancelada' && r.fecha.startsWith(mes)).length;
    const pendFam = S.socios.reduce((a, s) => a + s.grupo.filter(g => g.estado === 'pendiente').length, 0);
    const susp = S.inst.filter(i => !i.activo);
    const tareas = [];
    if (pendFam) tareas.push(['👨‍👩‍👧', `${pendFam} solicitud${pendFam > 1 ? 'es' : ''} de grupo familiar para revisar`, 'socios', 'Revisar']);
    if (susp.length) tareas.push(['🛠️', `${susp.length} instalación${susp.length > 1 ? 'es' : ''} en mantenimiento: ${susp.map(i => i.nombre).join(', ')}`, 'instalaciones', 'Ver']);
    const porConf = S.reservas.filter(r => r.pago === 'informado' && r.estado !== 'cancelada').length;
    const cobrado = S.reservas.filter(r => r.pago === 'confirmado' && r.estado !== 'cancelada' && r.fecha.startsWith(mes)).reduce((a, r) => a + (r.monto || 0), 0);
    if (porConf) tareas.unshift(['💳', `${porConf} pagos informados por socios esperan tu confirmación`, 'pagos', 'Revisar pagos']);
    if (espHoy.length) tareas.push(['🚪', `${espHoy.length} reservas de hoy todavía no ingresaron`, 'agenda', 'Ver agenda']);
    const hr = new Date().getHours(), saludo = hr < 12 ? 'Buen día' : hr < 20 ? 'Buenas tardes' : 'Buenas noches';
    const acciones = [['pagos', '💳', `Pagos por confirmar (${porConf})`, '¿Llegó el pago? Revisalo acá'], ['disponibilidad', '🟢', 'Lugares disponibles', 'Próximos 14 días de un vistazo'], ['agenda', '📆', 'Agenda del día', 'Quién reservó cada turno'], ['nueva', '➕', 'Nueva reserva', 'Para socios que llaman o vienen']];
    return `<h2 class="hola">${saludo} 👋</h2><p class="sub">Resumen del complejo y accesos rápidos.</p>
    <div class="tiles cuatro">${acciones.map(([v, ic, t, ds], i) => `<button class="tile ${i === 0 ? 'prim' : ''}" data-act="nav" data-v="${v}"><span class="ic">${ic}</span><b>${t}</b><span class="d">${ds}</span></button>`).join('')}</div>
    <div class="kpis"><div class="kpi"><b>${hoyR.length}</b><span>Reservas de hoy</span></div><div class="kpi"><b>${ingHoy}</b><span>Ya ingresaron hoy</span></div><div class="kpi"><b>${pesos(cobrado)}</b><span>Cobrado este mes</span></div><div class="kpi"><b>${Math.round(oc / tot * 100)} %</b><span>Ocupación próximos 7 días</span></div></div>
    <div class="grid2"><div class="card"><h3>Tareas pendientes</h3>${tareas.length ? tareas.map(([ic, t, v, b]) => `<div class="item"><div style="display:flex;gap:10px;align-items:center"><span style="font-size:22px">${ic}</span><span>${esc(t)}</span></div><button class="btn-sm" data-act="nav" data-v="${v}">${b}</button></div>`).join('') : '<p class="muted">✅ No hay tareas pendientes.</p>'}</div>
      <div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><h3 style="margin:0">Próximos ingresos de hoy</h3><button class="link" data-act="nav" data-v="agenda">Agenda completa</button></div>
      ${espHoy.length ? espHoy.slice(0, 6).map(r => `<div class="item"><div>${ICON[r.instId] || ''} <b>${esc(instNombre(r.instId))}</b> · ${esc(r.turno)}<br><span class="small muted">${esc(nombreSocio(r.socio))} (socio ${r.socio})</span></div><button class="btn-sm" data-act="agdet" data-id="${r.id}">Detalle</button></div>`).join('') : '<p class="muted">No quedan ingresos pendientes para hoy.</p>'}</div></div>
    <div class="grid2" style="margin-top:14px"><div class="card"><h3>Uso por instalación (mes actual)</h3>${bars(porInst)}</div>
      <div class="card"><h3>Reservas por mes</h3>${bars(meses)}<p class="small muted">Reservas este mes: <b>${delMes}</b> · Cancelaciones: <b>${cancel}</b> · Socios con cuenta: <b>${S.socios.length}</b> de 7.335</p></div></div>
    <div class="card" style="margin-top:14px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><div><h3 style="margin:0">Reportes</h3><span class="small muted">Se descargan en CSV y se abren con Excel.</span></div>
      <div class="chips"><button class="btn" data-act="rep" data-p="${mes}">⬇ Reporte mensual (${mes})</button><button class="btn ghost" data-act="rep" data-p="${anio}">⬇ Reporte anual (${anio})</button></div></div>`;
  },

  pagos() {
    const tab = ui.ptab || 'informado', q = norm(ui.pq || '');
    const G = {
      informado: S.reservas.filter(r => r.pago === 'informado' && r.estado !== 'cancelada'),
      pendiente: S.reservas.filter(r => r.pago === 'pendiente' && r.estado === 'confirmada'),
      confirmado: S.reservas.filter(r => r.pago === 'confirmado' && r.estado !== 'cancelada'),
      rechazado: S.reservas.filter(r => r.pago === 'rechazado' && r.estado !== 'cancelada')
    };
    const mes = hoy().slice(0, 7);
    const cobrado = G.confirmado.filter(r => r.fecha.startsWith(mes)).reduce((a, r) => a + (r.monto || 0), 0);
    const debe = G.pendiente.reduce((a, r) => a + (r.monto || 0), 0);
    const orden = tab === 'informado' ? (a, b) => (a.pagoInfo ? a.pagoInfo.t : 0) - (b.pagoInfo ? b.pagoInfo.t : 0) : tab === 'confirmado' ? (a, b) => b.fecha.localeCompare(a.fecha) : (a, b) => a.fecha.localeCompare(b.fecha);
    const lista = G[tab].filter(r => !q || norm(r.socio + ' ' + nombreSocio(r.socio) + ' ' + r.codigo).includes(q)).sort(orden);
    return `<h2>Pagos</h2><p class="sub">Revisá los avisos de pago de los socios y confirmalos cuando el dinero esté acreditado.</p>
    <div class="kpis"><div class="kpi"><b>${G.informado.length}</b><span>🕓 Por confirmar</span></div><div class="kpi"><b>${G.pendiente.length}</b><span>💲 Sin pagar (${pesos(debe)})</span></div><div class="kpi"><b>${pesos(cobrado)}</b><span>✅ Cobrado este mes</span></div><div class="kpi"><b>${G.rechazado.length}</b><span>⛔ Rechazados</span></div></div>
    <div class="seg" style="max-width:720px">${[['informado', 'Por confirmar'], ['pendiente', 'Sin pagar'], ['confirmado', 'Confirmados'], ['rechazado', 'Rechazados']].map(([k, l]) => `<button class="${tab === k ? 'on' : ''}" data-act="ptab" data-t="${k}">${l} (${G[k].length})</button>`).join('')}</div>
    <form data-form="pbuscar" class="row" style="max-width:720px;margin:0 0 12px"><input name="q" value="${esc(ui.pq || '')}" placeholder="Buscar por N° de socio, nombre o código"><button class="btn ghost">Buscar</button></form>
    ${lista.length ? `<div class="card scroll"><table class="tabla"><thead><tr><th>Socio</th><th>Reserva</th><th>Monto</th><th>Estado del pago</th><th></th></tr></thead><tbody>
    ${lista.slice(0, 150).map(r => `<tr><td><b>${esc(nombreSocio(r.socio))}</b><br><span class="small muted">Socio ${r.socio}</span></td><td>${ICON[r.instId] || ''} ${esc(instNombre(r.instId))}<br><span class="small muted">${fmtF(r.fecha)} · ${esc(r.turno)}</span></td><td><b>${pesos(r.monto || 0)}</b></td>
      <td>${badgePago(r.pago)}${r.pagoInfo ? `<br><span class="small muted">${esc(r.pagoInfo.metodo)}${r.pagoInfo.operacion ? ' · Op. ' + esc(r.pagoInfo.operacion) : ''}<br>Informado ${fmtDT(r.pagoInfo.t)}</span>` : ''}${r.pagoConf ? `<br><span class="small muted">Confirmado por ${esc(r.pagoConf.usuario)} · ${fmtDT(r.pagoConf.t)}</span>` : ''}</td>
      <td style="white-space:nowrap">${botonesPago(r)}</td></tr>`).join('')}</tbody></table>${lista.length > 150 ? '<p class="small muted">Se muestran los primeros 150. Usá el buscador.</p>' : ''}</div>`
      : `<div class="card vacio"><div class="ic">✅</div><p>No hay pagos en esta lista.</p></div>`}`;
  },

  disponibilidad() {
    const dias = [...Array(14)].map((_, k) => addDays(hoy(), k));
    const libres = (i, f) => i.cupo > 1 ? i.turnos.reduce((a, t) => a + (turnoPasado(f, t) ? 0 : Math.max(0, i.cupo - ocup(i.id, f, t))), 0) : i.turnos.filter(t => !turnoPasado(f, t) && ocup(i.id, f, t) < i.cupo).length;
    const total = (i, f) => i.cupo > 1 ? i.turnos.filter(t => !turnoPasado(f, t)).length * i.cupo : i.turnos.filter(t => !turnoPasado(f, t)).length;
    const h = hoy();
    const resumen = [['Quincho', '🍖', 'Quinchos', 'turnos'], ['Cancha', '⚽', 'Canchas', 'turnos'], ['Pileta', '🏊', 'Pileta', 'lugares']].map(([t, ic, n, u]) => {
      const v = S.inst.filter(i => i.tipo === t && i.activo).reduce((a, i) => a + libres(i, h), 0);
      return `<div class="kpi"><b>${ic} ${v}</b><span>${n}: ${u} libres hoy</span></div>`;
    }).join('');
    const filas = S.inst.map(i => `<tr><td>${ICON[i.id]} <b>${esc(i.nombre)}</b>${i.cupo > 1 ? '<br><span class="small muted">lugares por día</span>' : ''}</td>${dias.map(f => {
      if (!i.activo) return `<td><button class="dc cerr" data-act="disp" data-f="${f}">—<small>mant.</small></button></td>`;
      const l = libres(i, f), tt = total(i, f), cls = !tt || !l ? 'llen' : l / tt < 0.4 ? 'poco' : 'libr';
      return `<td><button class="dc ${cls}" data-act="disp" data-f="${f}" title="${l} libres de ${tt}">${l}<small>de ${tt}</small></button></td>`;
    }).join('')}</tr>`).join('');
    return `<h2>Lugares disponibles</h2><p class="sub">Próximos 14 días. Cada casilla indica cuántos turnos (o lugares, en la pileta) quedan libres. Tocá una para ver la agenda de ese día.</p>
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
        if (r) return `<button class="slot ocu ${r.estado === 'utilizada' ? 'usada' : ''}" data-act="agdet" data-id="${r.id}" title="${esc(nombreSocio(r.socio))}"><b>${esc(t)}</b><span>${r.estado === 'utilizada' ? '✓ ' : icoPago(r.pago) + ' '}${esc(nombreSocio(r.socio))}</span></button>`;
        if (!i.activo) return `<div class="slot pas"><b>${esc(t)}</b><span>Suspendido</span></div>`;
        if (pas) return `<div class="slot pas"><b>${esc(t)}</b><span>Libre (pasado)</span></div>`;
        return `<button class="slot lib" data-act="agnueva" data-i="${i.id}" data-t="${esc(t)}"><b>${esc(t)}</b><span>+ Reservar</span></button>`;
      }).join('');
      const usados = i.turnos.filter(t => ocup(i.id, f, t) >= i.cupo).length;
      return `<div class="agfila"><div class="agnom"><span style="font-size:22px">${ICON[i.id]}</span><div><b>${esc(i.nombre)}</b><br><span class="small muted">${i.activo ? `${usados} de ${i.turnos.length} ${i.cupo > 1 ? 'turnos completos' : 'ocupados'}` : '<span class="badge b-rojo">Mantenimiento</span>'}</span></div></div><div class="agslots">${celdas}</div></div>`;
    }).join('');
    return `<h2>Agenda del día</h2><p class="sub">Tocá un turno libre para reservarlo, o uno reservado para ver el detalle.</p>
    <div class="card agbar"><button class="btn-sm" data-act="agdia" data-d="-1">‹ Día anterior</button><button class="btn-sm" data-act="aghoy">Hoy</button><button class="btn-sm" data-act="agdia" data-d="1">Día siguiente ›</button><input type="date" id="agfecha" value="${f}" style="width:auto"><b class="agtit">${fmtFL(f)}</b></div>
    <div class="leyenda" style="margin:0 0 12px"><span><i style="background:var(--verdeb);border:1px solid #a7e0bd"></i>Libre</span><span><i style="background:#fff3d6;border:1px solid #f0d58c"></i>Reservado</span><span><i style="background:var(--celeste);border:1px solid #b9dcc4"></i>Ya ingresó</span><span><i style="background:#f3f4f6"></i>Pasado o suspendido</span><span>· 💲 sin pagar · 🕓 pago en revisión · ✅ pagado</span></div>
    <div class="card">${filas}</div>`;
  },

  reservas() {
    const h = hoy();
    if (!ui.f) ui.f = {desde:addDays(h, -7), hasta:addDays(h, 30), inst:'', estado:'', q:''};
    const f = ui.f;
    const rs = filtrarReservas();
    const rap = [['hoy', 'Hoy'], ['semana', 'Próximos 7 días'], ['mes', 'Este mes'], ['futuras', 'Todas las próximas'], ['canceladas', 'Canceladas']];
    return `<h2>Reservas</h2><p class="sub">Buscá por socio, código o fecha. Tocá “Detalle” para ver, modificar o cancelar.</p>
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
    return `<h2>Nueva reserva</h2><p class="sub">Para socios que reservan por teléfono o en persona. Se aplican las mismas reglas que en la web.</p>
    <div class="grid2" style="align-items:start"><div class="card"><form data-form="nueva">
      <label style="margin-top:0">1. N° de socio</label><input name="nro" id="n_nro" required inputmode="numeric" placeholder="Ej: 1001" autocomplete="off"><div id="n_socio" class="small muted" style="margin-top:6px">Escribí el número para buscar al socio.</div>
      <label>2. Instalación</label><select name="inst" id="n_inst">${S.inst.map(i => `<option value="${i.id}" ${i.id === inst.id ? 'selected' : ''} ${i.activo ? '' : 'disabled'}>${ICON[i.id]} ${esc(i.nombre)}${i.activo ? '' : ' (mantenimiento)'}</option>`).join('')}</select>
      <label>3. Fecha</label><input type="date" name="fecha" id="n_fecha" required min="${hoy()}" value="${fecha}">
      <label>4. Turno</label><select name="turno" id="n_turno">${turnoOpts(inst, fecha, p.turno)}</select>
      <label class="check" style="margin-top:14px"><input type="checkbox" name="efec" value="1"> <span>El socio ya pagó en efectivo</span></label>
      <button class="btn grande" style="margin-top:14px">✔ Registrar reserva</button></form></div>
    <div class="card"><h3>Cómo funciona</h3><ul class="small" style="padding-left:18px;line-height:1.7"><li>Al escribir el número se muestra el nombre del socio y si su cuenta está activa.</li><li>Los turnos ocupados o pasados aparecen como “no disponible”.</li><li>Se permite una reserva por tipo de instalación y por día para cada socio.</li><li>Al registrar se genera el comprobante con QR para imprimir o enviar al socio.</li></ul>
      <button class="btn ghost full" data-act="nav" data-v="agenda">📆 Ver la agenda del día</button></div></div>`;
  },

  instalaciones() {
    return `<h2>Instalaciones y disponibilidad</h2>
    <div class="card scroll"><table class="tabla"><thead><tr><th>Instalación</th><th>Tipo</th><th>Turnos</th><th>Tarifa</th><th>Estado</th></tr></thead><tbody>
    ${S.inst.map(i => `<tr><td><b>${esc(i.nombre)}</b><br><span class="small muted">${esc(i.cap)}</span></td><td>${i.tipo}</td><td>${i.turnos.length}${i.cupo > 1 ? ` (cupo ${i.cupo})` : ''}</td>
      <td><input type="number" style="width:120px" data-tarifa="${i.id}" value="${i.tarifa}" min="0" step="500"></td>
      <td>${i.activo ? '<span class="badge b-verde">Habilitada</span>' : '<span class="badge b-rojo">Mantenimiento</span>'}<br><button class="btn-sm" style="margin-top:6px" data-act="toggleinst" data-id="${i.id}">${i.activo ? 'Suspender' : 'Habilitar'}</button></td></tr>`).join('')}
    </tbody></table><p class="small muted">Al suspender una instalación se bloquean automáticamente las nuevas reservas y podés publicar el aviso en Comunicados.</p></div>`;
  },

  comunicados() {
    return `<h2>Comunicación institucional</h2>
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
    return `<h2>Socios y perfiles de usuario</h2>
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
    return `<h2>Seguridad y copias de seguridad</h2>
    <div class="grid2"><div class="card"><h3>Copias de seguridad automáticas</h3><p class="small muted">El sistema genera una copia diaria automática y guarda las últimas 3.</p>
      ${bks.length ? bks.slice().reverse().map((b, i) => `<div class="item"><div><b>${fmtDT(b.t)}</b><br><span class="small muted">${Math.round(b.data.length / 1024)} KB</span></div><button class="btn-sm" data-act="restbk" data-i="${bks.length - 1 - i}">Restaurar</button></div>`).join('') : '<p class="muted">Sin copias todavía.</p>'}
      <div class="chips" style="margin-top:12px"><button class="btn" data-act="backup">Crear copia ahora</button><button class="btn ghost" data-act="descbk">Descargar copia (.json)</button></div>
      <label>Restaurar desde un archivo</label><input type="file" id="restfile" accept=".json,application/json"></div>
    <div class="card"><h3>Medidas activas</h3><ul class="small" style="padding-left:18px;line-height:1.6">
      <li>Permisos por nivel de usuario: socio, portería y administrador.</li><li>Bloqueo de 5 minutos tras 5 intentos de ingreso fallidos.</li><li>Cierre automático de sesión tras 15 minutos de inactividad.</li><li>Registro de auditoría de todas las operaciones.</li><li>Consentimiento de protección de datos personales (Ley 25.326) al registrarse.</li><li>DNI enmascarado en las vistas del socio.</li><li>En producción: HTTPS obligatorio y contraseñas cifradas en el servidor.</li></ul>
      <h3 style="margin-top:14px">Eventos de seguridad recientes</h3>${fallos.length ? fallos.map(a => `<div class="small" style="padding:4px 0;border-bottom:1px solid var(--borde)">${fmtDT(a.t)} · ${esc(a.usuario)} · ${esc(a.accion)}</div>`).join('') : '<p class="muted small">Sin eventos.</p>'}</div></div>
    <div class="card" style="margin-top:14px"><h3>Usuarios del personal</h3>
      <div class="scroll"><table class="tabla"><thead><tr><th>Usuario</th><th>Nombre</th><th>Nivel</th><th>Estado</th><th></th></tr></thead><tbody>
      ${S.staff.map(u => `<tr><td>${esc(u.user)}</td><td>${esc(u.nombre)}</td><td>${u.rol === 'admin' ? 'Administrador' : 'Portería'}</td><td>${u.activo === false ? '<span class="badge b-rojo">Suspendido</span>' : '<span class="badge b-verde">Activo</span>'}</td><td>${u.user === ses.user ? '<span class="small muted">(vos)</span>' : `<button class="btn-sm" data-act="togglestaff" data-u="${esc(u.user)}">${u.activo === false ? 'Habilitar' : 'Suspender'}</button>`}</td></tr>`).join('')}
      </tbody></table></div>
      <form data-form="staff" class="filtros" style="margin-top:12px;grid-template-columns:repeat(4,1fr) auto"><div><label>Usuario</label><input name="user" required></div><div><label>Nombre</label><input name="nombre" required></div><div><label>Nivel</label><select name="rol"><option value="porteria">Portería</option><option value="admin">Administrador</option></select></div><div><label>Contraseña</label><input name="pass" type="password" required minlength="6"></div><div><button class="btn">Agregar</button></div></form></div>`;
  },

  auditoria() {
    const a = S.auditoria.slice().reverse().slice(0, 300);
    return `<h2>Registro de auditoría</h2><div class="card scroll"><p class="small muted">Cada operación queda registrada con fecha, hora y usuario.</p>
    <table class="tabla"><thead><tr><th>Fecha y hora</th><th>Usuario</th><th>Operación</th></tr></thead><tbody>
    ${a.map(x => `<tr><td style="white-space:nowrap">${fmtDT(x.t)}</td><td>${esc(x.usuario)}</td><td>${esc(x.accion)}</td></tr>`).join('')}</tbody></table></div>`;
  }
};

function calendario(inst) {
  const [y, m] = ui.mes.split('-').map(Number);
  const first = new Date(y, m - 1, 1), start = (first.getDay() + 6) % 7, dias = new Date(y, m, 0).getDate();
  let h = `<div class="cal-head"><button type="button" data-act="mes" data-d="-1" ${ui.mes <= hoy().slice(0, 7) ? 'disabled' : ''}>‹</button><b>${cap1(first.toLocaleDateString('es-AR', {month:'long', year:'numeric'}))}</b><button type="button" data-act="mes" data-d="1">›</button></div><div class="cal">`;
  h += ['L','M','M','J','V','S','D'].map(x => `<div class="dow">${x}</div>`).join('');
  for (let i = 0; i < start; i++) h += '<div></div>';
  for (let d = 1; d <= dias; d++) {
    const f = y + '-' + z(m) + '-' + z(d), e = estadoDia(inst, f), off = ['pasado','fuera','cerrado'].includes(e);
    h += `<button type="button" class="dia ${off ? '' : e} ${ui.wiz.dia === f ? 'sel' : ''}" data-act="dia" data-f="${f}" ${off ? 'disabled' : ''}>${d}</button>`;
  }
  return h + '</div>';
}

function turnoOpts(inst, fecha, sel) {
  return inst.turnos.map(t => { const no = !fecha || turnoPasado(fecha, t) || ocup(inst.id, fecha, t) >= inst.cupo; return `<option value="${esc(t)}" ${no ? 'disabled' : ''} ${t === sel ? 'selected' : ''}>${esc(t)}${no ? ' — no disponible' : inst.cupo > 1 ? ` — ${inst.cupo - ocup(inst.id, fecha, t)} lugares` : ' — libre'}</option>`; }).join('');
}
function filtrarReservas() {
  const f = ui.f, q = norm(f.q || '');
  return S.reservas.filter(r => (!f.desde || r.fecha >= f.desde) && (!f.hasta || r.fecha <= f.hasta) && (!f.inst || r.instId === f.inst) && (!f.estado || r.estado === f.estado)
    && (!q || norm(r.socio + ' ' + r.codigo + ' ' + nombreSocio(r.socio)).includes(q))).sort((a, b) => a.fecha.localeCompare(b.fecha) || inicioTurno(a.turno) - inicioTurno(b.turno));
}

function exportCSV(rows, nombre) {
  const head = ['Código','N° socio','Nombre','Instalación','Tipo','Fecha','Turno','Estado','Monto','Pago','Medio de pago','Creada','Ingreso'];
  const lines = [head, ...rows.map(r => [r.codigo, r.socio, nombreSocio(r.socio), instNombre(r.instId), getInst(r.instId).tipo, fmtF(r.fecha), r.turno, r.estado, r.monto || 0, r.pago || '', r.pagoInfo ? r.pagoInfo.metodo : '', fmtDT(r.creada), r.ingreso ? fmtDT(r.ingreso) : ''])]
    .map(l => l.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(';')).join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + lines], {type:'text/csv;charset=utf-8'}));
  a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
  log('Exportó ' + nombre + ' (' + rows.length + ' registros)');
  toast('Archivo exportado: ' + nombre);
}

/* ===================== Render ===================== */
function render() {
  detenerCamara();
  const app = $('#app');
  document.body.classList.toggle('con-bottom', !!ses && ses.rol === 'socio');
  if (!ses) { app.innerHTML = vistaAcceso(); return; }
  const navAct = {familia:'perfil', credencial:'perfil', info:'inicio', novedades:'inicio'}[ui.view] || ui.view;
  const nom = ses.rol === 'socio' ? socioActual().nombre + ' · Socio ' + ses.nro : S.staff.find(s => s.user === ses.user).nombre;
  const nomCorto = ses.rol === 'socio' ? socioActual().nombre : S.staff.find(s => s.user === ses.user).nombre;
  const rolTxt = ses.rol === 'socio' ? 'Socio N° ' + ses.nro : ses.rol === 'admin' ? 'Administrador' : 'Portería';
  const ini = nomCorto.split(' ').map(x => x[0]).slice(0, 2).join('');
  const side = `<aside class="side"><div class="marca"><div class="logo">CPA</div><div><b>Complejo Policial Almudena</b><small>Sistema de Gestión <span class="badge-proto">PROTOTIPO</span></small></div></div>
    <nav class="snav">${NAV[ses.rol].map(([k, l]) => k === '_' ? `<div class="sgrupo">${l}</div>` : `<button class="sitem ${navAct === k ? 'on' : ''}" data-act="nav" data-v="${k}"><span>${ICONOS[k] || '•'}</span>${l}</button>`).join('')}</nav>
    <div class="suser"><div class="avatar sm">${esc(ini)}</div><div><b>${esc(nomCorto)}</b><small>${rolTxt}</small></div></div><button class="btn ghost full" data-act="salir">Cerrar sesión</button></aside>`;
  app.innerHTML = `<div class="layout">${side}<div class="contenido"><header class="top"><div class="marca"><div class="logo">CPA</div><div><b>Complejo Policial Almudena</b> <span class="badge-proto">PROTOTIPO</span><small>Sistema de Gestión Integral</small></div></div>
    <div class="who"><span>${esc(nom)}</span><button class="btn-sm ghost" data-act="salir">Salir</button></div></header>
    <nav class="tabs ${ses.rol === 'socio' ? 'socio' : ''}">${NAV[ses.rol].filter(n => n[0] !== '_').map(([k, l, ic]) => `<button class="tab ${navAct === k ? 'on' : ''}" data-act="nav" data-v="${k}"><span class="tic">${ICONOS[k] || ''}</span>${l}</button>`).join('')}</nav>
    <main><div class="ptitulo"><span>${new Date().toLocaleDateString('es-AR', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</span><span>${esc(rolTxt)}</span></div>${V[ui.view]()}</main></div></div>${ses.rol === 'socio' && ui.view !== 'asistente' ? '<button class="fab" data-act="nav" data-v="asistente" title="Asistente virtual" aria-label="Asistente virtual">💬</button>' : ''}`;
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
      S.inst.forEach(i => {
        if (!i.activo) { h += `<li>${esc(i.nombre)}: suspendida</li>`; return; }
        const lib = i.turnos.filter(t => !turnoPasado(f, t) && ocup(i.id, f, t) < i.cupo);
        h += `<li>${esc(i.nombre)}: ${lib.length ? (i.tipo === 'Cancha' ? lib.length + ' horarios libres' : lib.map(esc).join(', ')) : 'completo'}</li>`;
      });
      h += '</ul>';
    });
    return h + '<button class="btn" data-act="nuevares">Reservar</button>';
  }
  if (has(/reserv|como (hago|alquilo)|quiero (un|una|el|la)|alquil|turno/)) return 'Reservar es muy simple:<ol><li>Entrá a <b>Reservar</b>.</li><li>Elegí la instalación (quincho, cancha o pileta).</li><li>Elegí el día en el calendario: verde es libre, amarillo quedan pocos turnos, rojo completo.</li><li>Tocá el horario disponible, aceptá el reglamento y confirmá.</li><li>Recibís al instante tu <b>comprobante con código QR</b>, que mostrás en la entrada.</li></ol>Se permite una reserva por tipo de instalación y por día, con hasta 30 días de anticipación.<br><button class="btn" data-act="nuevares">Empezar a reservar</button>';
  if (has(/pago|pagar|transfer|alias|cbu|mercado ?pago|abonar|comprobante de pago/)) return `Podés pagar por transferencia o Mercado Pago:<ul><li>Alias: <b>${PAGO.alias}</b></li><li>CBU: ${PAGO.cbu}</li><li>Titular: ${esc(PAGO.titular)}</li></ul>Plazo: ${PAGO.plazo}. Después entrá a <b>Mis reservas</b>, tocá “💲 Pagar” y enviá la foto del comprobante. La administración lo confirma y tu reserva queda como “✅ Pagado”.<br><button class="btn" data-act="nav" data-v="mis">Ir a Mis reservas</button>`;
  if (has(/tarifa|precio|cuesta|costo|valor|sale/)) return 'Tarifas vigentes:' + lista(S.inst.map(i => `${i.nombre}: ${pesos(i.tarifa)}${i.tipo === 'Cancha' ? ' por hora' : i.tipo === 'Pileta' ? ' por grupo y turno' : ' por turno'}`)) + 'Por ahora se abonan en la administración del complejo.';
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
    const det = `<b>${esc(nombreSocio(r.socio))}</b> (socio ${r.socio})<br>${esc(instNombre(r.instId))} · ${fmtF(r.fecha)} · ${esc(r.turno)}`;
    if (r.estado === 'cancelada') { v = {tipo:'error', titulo:'Reserva cancelada', html:det + '<br>Esta reserva fue cancelada y no habilita el ingreso.'}; log('Validación rechazada (cancelada): ' + c); }
    else if (r.estado === 'utilizada') { v = {tipo:'warn', titulo:'QR ya utilizado', html:det + `<br>Ya se registró el ingreso ${r.ingreso ? 'el ' + fmtDT(r.ingreso) : ''}. El QR es válido una sola vez.`}; log('Validación rechazada (QR reutilizado): ' + c); }
    else if (r.fecha !== hoy()) { v = {tipo:'warn', titulo:'Fecha incorrecta', html:det + `<br>La reserva es para el <b>${fmtF(r.fecha)}</b>, no para hoy.`}; log('Validación rechazada (otra fecha): ' + c); }
    else {
      r.estado = 'utilizada'; r.ingreso = Date.now();
      const s = S.socios.find(x => x.nro === r.socio);
      const fam = s && s.grupo.filter(g => g.estado === 'habilitado').length ? '<br><span class="small">Grupo familiar habilitado: ' + s.grupo.filter(g => g.estado === 'habilitado').map(g => esc(g.nombre)).join(', ') + '</span>' : '';
      v = {tipo:'ok', titulo:'Ingreso autorizado', html:det + fam + (r.pago !== 'confirmado' ? `<br><b style="color:var(--amarillo)">⚠ ${r.pago === 'informado' ? 'Pago informado, todavía sin confirmar' : 'Pago pendiente'}: cobrar ${pesos(r.monto || 0)} o verificar en administración</b>` : '<br><span class="small">✅ Pago confirmado</span>')};
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
  if (so) { ses = {rol:'socio', nro:so.nro}; ui = uiInicial(); ui.view = 'inicio'; log('Inicio de sesión'); render(); return; }
  const b = S.bloqueos[u] = S.bloqueos[u] || {n:0, hasta:0};
  b.n++;
  S.auditoria.push({t:Date.now(), usuario:u || 'anónimo', accion:'Intento de ingreso fallido'});
  if (b.n >= 5) { b.hasta = Date.now() + 5 * 60000; b.n = 0; S.auditoria.push({t:Date.now(), usuario:u || 'anónimo', accion:'Bloqueo temporal por 5 intentos fallidos'}); ui.msg = {tipo:'err', txt:'Demasiados intentos fallidos. El acceso quedó bloqueado por 5 minutos.'}; }
  else ui.msg = {tipo:'err', txt:`Usuario o contraseña incorrectos. Te quedan ${5 - b.n} intentos.`};
  save(); render();
}

const ACT = {
  nav: b => { ui.view = b.dataset.v; closeModal(); render(); window.scrollTo(0, 0); },
  acceso: b => { ui.acceso = b.dataset.v; ui.msg = null; render(); },
  demo: b => entrar(b.dataset.u, b.dataset.p),
  reset: () => { if (confirm('¿Reiniciar todos los datos de demostración?')) { S = seed(); save(); ui.msg = {tipo:'ok', txt:'Datos reiniciados.'}; render(); } },
  salir: () => { log('Cierre de sesión'); ses = null; ui = uiInicial(); closeModal(); render(); },
  nuevares: () => { ui.wiz = {paso:1}; ui.verCal = false; ui.view = 'reservar'; render(); window.scrollTo(0, 0); },
  wtipo: b => { const is = S.inst.filter(i => i.tipo === b.dataset.t && i.activo); ui.wiz.tipo = b.dataset.t; if (is.length === 1 && S.inst.filter(i => i.tipo === b.dataset.t).length === 1) { ui.wiz.inst = is[0].id; ui.wiz.paso = 3; } else ui.wiz.paso = 2; ui.verCal = false; render(); window.scrollTo(0, 0); },
  winst: b => { ui.wiz.inst = b.dataset.id; ui.wiz.paso = 3; ui.verCal = false; render(); window.scrollTo(0, 0); },
  wdia: b => { ui.wiz.dia = b.dataset.f; ui.wiz.paso = 4; render(); window.scrollTo(0, 0); },
  dia: b => { ui.wiz.dia = b.dataset.f; ui.wiz.paso = 4; render(); window.scrollTo(0, 0); },
  wturno: b => { ui.wiz.turno = b.dataset.t; ui.wiz.paso = 5; render(); window.scrollTo(0, 0); },
  wback: () => { const w = ui.wiz; w.paso = (w.paso === 3 && S.inst.filter(i => i.tipo === w.tipo).length === 1) ? 1 : w.paso - 1; render(); },
  wcal: () => { ui.verCal = !ui.verCal; if (ui.verCal) ui.mes = (ui.wiz.dia || hoy()).slice(0, 7); render(); },
  mes: b => { const [y, m] = ui.mes.split('-').map(Number); const d = new Date(y, m - 1 + Number(b.dataset.d), 1); ui.mes = d.getFullYear() + '-' + z(d.getMonth() + 1); render(); },
  mtab: b => { ui.mtab = b.dataset.t; render(); },
  ir: b => { const el = document.getElementById(b.dataset.id); if (el) el.scrollIntoView({behavior:'smooth', block:'start'}); },
  pagar: b => {
    const r = S.reservas.find(x => x.id === b.dataset.id);
    showModal(`<h3>💲 Pagar reserva</h3><p class="small muted" style="margin-top:-6px">${ICON[r.instId] || ''} ${esc(instNombre(r.instId))} · ${fmtFL(r.fecha)} · ${esc(r.turno)}</p>
      <div class="resumen" style="text-align:center;padding:14px"><span class="small muted">Monto a pagar</span><div style="font-size:30px;font-weight:800;color:var(--azul)">${pesos(r.monto || 0)}</div><span class="small muted">Plazo: ${PAGO.plazo}</span></div>
      ${r.pago === 'rechazado' ? '<div class="err">El pago anterior fue rechazado. Revisá los datos y volvé a informarlo.</div>' : ''}
      <h3 style="margin-top:16px">1. Transferí a esta cuenta</h3>
      <table class="kv"><tr><td>Alias</td><td><b>${PAGO.alias}</b> <button type="button" class="btn-sm" data-act="copiar" data-txt="${PAGO.alias}">Copiar</button></td></tr><tr><td>CBU</td><td style="font-family:monospace">${PAGO.cbu} <button type="button" class="btn-sm" data-act="copiar" data-txt="${PAGO.cbu}">Copiar</button></td></tr><tr><td>Titular</td><td>${esc(PAGO.titular)}</td></tr></table>
      <p class="small muted">Datos de ejemplo del prototipo.</p>
      <h3>2. Avisanos que pagaste</h3>
      <form data-form="infopago" data-id="${r.id}"><label>Medio de pago</label><select name="metodo"><option>Transferencia</option><option>Mercado Pago</option></select>
        <label>N° de operación (opcional)</label><input name="op" inputmode="numeric" autocomplete="off">
        <label>Foto o captura del comprobante</label><input type="file" name="img" accept="image/*">
        <div class="acciones"><button type="button" class="btn ghost" data-act="cerrar">Más tarde</button><button class="btn">Enviar aviso de pago</button></div></form>`);
  },
  copiar: b => { try { navigator.clipboard.writeText(b.dataset.txt); toast('Copiado: ' + b.dataset.txt); } catch (e) { toast(b.dataset.txt); } },
  pconf: b => { const r = S.reservas.find(x => x.id === b.dataset.id); r.pago = 'confirmado'; r.pagoConf = {t:Date.now(), usuario:usuarioLog()}; log(`Confirmó el pago de ${r.codigo} (${pesos(r.monto || 0)}, socio ${r.socio})`); closeModal(); toast('Pago confirmado ✅'); render(); },
  prech: b => { const r = S.reservas.find(x => x.id === b.dataset.id); if (!confirm('¿Rechazar este aviso de pago? El socio va a ver que tiene que informarlo de nuevo.')) return; r.pago = 'rechazado'; log(`Rechazó el aviso de pago de ${r.codigo} (socio ${r.socio})`); closeModal(); toast('Pago rechazado'); render(); },
  pefec: b => { const r = S.reservas.find(x => x.id === b.dataset.id); if (!confirm(`¿Registrar el pago en efectivo de ${pesos(r.monto || 0)}?`)) return; r.pago = 'confirmado'; r.pagoInfo = {metodo:'Efectivo en administración', operacion:'', t:Date.now(), img:null}; r.pagoConf = {t:Date.now(), usuario:usuarioLog()}; log(`Registró pago en efectivo de ${r.codigo} (${pesos(r.monto || 0)})`); closeModal(); toast('Pago registrado ✅'); render(); },
  pimg: b => { const r = S.reservas.find(x => x.id === b.dataset.id); showModal(`<h3>🧾 Comprobante de pago</h3><p class="small muted">${esc(nombreSocio(r.socio))} · ${pesos(r.monto || 0)} · ${esc(r.pagoInfo.metodo)}</p><img src="${r.pagoInfo.img}" alt="Comprobante" style="width:100%;border-radius:10px;border:1px solid var(--borde)"><div class="acciones">${r.pago === 'informado' ? `<button class="btn rojo" data-act="prech" data-id="${r.id}">Rechazar</button><button class="btn" data-act="pconf" data-id="${r.id}">✔ Confirmar pago</button>` : '<button class="btn" data-act="cerrar">Cerrar</button>'}</div>`); },
  ptab: b => { ui.ptab = b.dataset.t; render(); },
  disp: b => { ui.ag = b.dataset.f; ui.view = 'agenda'; render(); window.scrollTo(0, 0); },
  agdia: b => { ui.ag = addDays(ui.ag || hoy(), Number(b.dataset.d)); render(); },
  aghoy: () => { ui.ag = hoy(); render(); },
  agnueva: b => { ui.pref = {inst:b.dataset.i, fecha:ui.ag || hoy(), turno:b.dataset.t}; closeModal(); ui.view = 'nueva'; render(); },
  agdet: b => {
    const r = S.reservas.find(x => x.id === b.dataset.id), s = S.socios.find(x => x.nro === r.socio);
    showModal(`<h3>${ICON[r.instId] || ''} ${esc(instNombre(r.instId))}</h3><p class="small muted" style="margin-top:-6px">${fmtFL(r.fecha)} · ${esc(r.turno)}</p>
      <table class="kv"><tr><td>Socio</td><td><b>${esc(nombreSocio(r.socio))}</b> (N° ${r.socio})</td></tr><tr><td>Contacto</td><td>${s ? esc(s.email) + (s.tel ? '<br>' + esc(s.tel) : '') : '<span class="muted">Sin cuenta web</span>'}</td></tr>
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
    const w = ui.wiz, res = crearReserva(ses.nro, w.inst, w.dia, w.turno, false);
    if (res.error) { toast(res.error, 'error'); w.paso = 4; render(); return; }
    ui.wiz = {paso:1}; ui.view = 'mis'; ui.mtab = 'prox'; render(); comprobante(res.r, true);
  },
  verqr: b => comprobante(S.reservas.find(r => r.id === b.dataset.id)),
  cerrar: () => closeModal(),
  imprimir: () => window.print(),
  cancelar: b => {
    const r = S.reservas.find(x => x.id === b.dataset.id);
    if (!confirm(`¿Cancelar la reserva de ${instNombre(r.instId)} del ${fmtF(r.fecha)} (${r.turno})?`)) return;
    r.estado = 'cancelada'; log(`Canceló la reserva ${r.codigo}`); closeModal(); toast('Reserva cancelada. El turno quedó libre.'); render();
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
  resetpass: b => { const s = S.socios.find(x => x.nro === b.dataset.n); const v = new Uint32Array(1); crypto.getRandomValues(v); s.pass = String(100000 + v[0] % 900000); log(`Restableció la contraseña del socio ${s.nro}`); showModal(`<h3>Contraseña restablecida</h3><p>Contraseña temporal para <b>${esc(s.nombre)}</b> (socio ${s.nro}):</p><p class="codigo">${s.pass}</p><p class="small muted">Entregala al socio y pedile que la cambie desde “Mi cuenta”. En producción se envía por correo.</p><div class="acciones"><button class="btn" data-act="cerrar">Listo</button></div>`); },
  togglestaff: b => { const u = S.staff.find(x => x.user === b.dataset.u); u.activo = u.activo === false; log(`${u.activo ? 'Habilitó' : 'Suspendió'} al usuario ${u.user}`); render(); },
  backup: () => { if (autoBackup(true)) { log('Copia de seguridad manual'); toast('Copia de seguridad creada'); } else toast('No hay espacio para la copia. Descargala como archivo.', 'error'); render(); },
  descbk: () => { descargar(JSON.stringify(S), `copia_almudena_${hoy()}.json`, 'application/json'); log('Descargó copia de seguridad'); },
  restbk: b => { let bks = []; try { bks = JSON.parse(localStorage.getItem(KEY + '_bk') || '[]'); } catch (e) {} const bk = bks[+b.dataset.i]; if (!bk || !confirm('¿Restaurar la copia del ' + fmtDT(bk.t) + '? Se reemplazan los datos actuales.')) return; S = JSON.parse(bk.data); log('Restauró la copia del ' + fmtDT(bk.t)); toast('Copia restaurada'); render(); },
  rechazar: b => { const s = S.socios.find(x => x.nro === b.dataset.n), g = s.grupo[+b.dataset.i]; s.grupo.splice(+b.dataset.i, 1); log(`Rechazó familiar ${g.nombre} del socio ${s.nro}`); toast('Solicitud rechazada'); render(); }
};

function comprobante(r, nueva) {
  showModal(`${nueva ? '<div class="ok" style="text-align:center;margin:0 0 12px;font-weight:700">✅ ¡Listo! Tu reserva está confirmada</div>' : ''}<div class="comprobante"><div class="cmp-head"><div class="logo">CPA</div><div><b>Complejo Policial Almudena</b><small>Comprobante digital de reserva</small></div></div>
    <div class="qr" data-qr="${r.codigo}"></div><div class="codigo">${r.codigo}</div>
    <table class="kv"><tr><td>Socio</td><td>${esc(nombreSocio(r.socio))} (N° ${r.socio})</td></tr><tr><td>Instalación</td><td>${esc(instNombre(r.instId))}</td></tr><tr><td>Fecha</td><td>${fmtFL(r.fecha)}</td></tr><tr><td>Horario</td><td>${esc(r.turno)}</td></tr><tr><td>Estado</td><td>${badgeEstado(r.estado)}</td></tr><tr><td>Pago</td><td>${badgePago(r.pago)} ${pesos(r.monto || 0)}</td></tr><tr><td>Emitido</td><td>${fmtDT(r.creada)}</td></tr>${r.ingreso ? `<tr><td>Ingreso</td><td>${fmtDT(r.ingreso)}</td></tr>` : ''}</table>
    <p class="small muted">Presentá este QR en el ingreso. Es único e intransferible y solo es válido una vez.</p></div>
    <div class="acciones no-print" style="flex-wrap:wrap"><button class="btn ghost" data-act="cerrar">Cerrar</button><button class="btn ${MODO === 'socio' && r.estado === 'confirmada' && ['pendiente', 'rechazado'].includes(r.pago) ? 'ghost' : ''}" data-act="imprimir">Descargar / imprimir</button>${MODO === 'socio' && r.estado === 'confirmada' && ['pendiente', 'rechazado'].includes(r.pago) ? `<button class="btn" data-act="pagar" data-id="${r.id}">💲 Pagar ahora</button>` : ''}</div>`);
}

const FORM = {
  login: fd => entrar(fd.get('u'), fd.get('p')),
  registro: fd => {
    const nro = fd.get('nro').trim(), dni = fd.get('dni').trim(), p = fd.get('p');
    const pad = S.padron.find(x => x.nro === nro);
    let err = null;
    if (!pad) err = 'El número de socio no figura en el padrón de socios activos.';
    else if (pad.dni !== dni) err = 'El DNI no coincide con el titular de ese número de socio.';
    else if (S.socios.some(s => s.nro === nro)) err = 'Ese socio ya tiene una cuenta. Usá “Olvidé mi contraseña”.';
    else if (p.length < 6) err = 'La contraseña debe tener al menos 6 caracteres.';
    else if (p !== fd.get('p2')) err = 'Las contraseñas no coinciden.';
    else if (!fd.get('consent')) err = 'Tenés que aceptar la política de protección de datos personales.';
    if (err) { ui.msg = {tipo:'err', txt:err}; render(); return; }
    S.socios.push({nro, dni, nombre:pad.nombre, email:fd.get('email').trim(), tel:fd.get('tel').trim(), pass:p, alta:Date.now(), grupo:[]});
    S.auditoria.push({t:Date.now(), usuario:'Socio ' + nro, accion:'Registro de cuenta nueva (validado contra padrón)'}); save();
    ui.acceso = 'login'; ui.msg = {tipo:'ok', txt:`Cuenta creada para ${pad.nombre}. Ya podés ingresar con tu N° de socio.`}; render();
  },
  recuperar: fd => {
    const s = S.socios.find(x => x.nro === fd.get('nro').trim() && x.email.toLowerCase() === fd.get('email').trim().toLowerCase());
    if (s) S.auditoria.push({t:Date.now(), usuario:'Socio ' + s.nro, accion:'Solicitud de recuperación de contraseña'}), save();
    ui.msg = {tipo:'ok', txt:'Si los datos son correctos, vas a recibir un enlace de recuperación en tu correo en los próximos minutos. (Simulado en el prototipo.)'}; render();
  },
  familiar: fd => { const s = socioActual(); s.grupo.push({nombre:fd.get('nombre').trim(), dni:fd.get('dni').trim(), parentesco:fd.get('parentesco'), estado:'pendiente'}); log('Solicitó alta de familiar: ' + fd.get('nombre').trim()); toast('Solicitud enviada a la administración'); render(); },
  chat: fd => preguntar(fd.get('q')),
  pbuscar: fd => { ui.pq = fd.get('q'); render(); },
  infopago: (fd, f) => {
    const r = S.reservas.find(x => x.id === f.dataset.id), file = fd.get('img');
    const fin = img => { r.pago = 'informado'; r.pagoInfo = {metodo:fd.get('metodo'), operacion:(fd.get('op') || '').trim(), t:Date.now(), img}; log(`Informó el pago de ${r.codigo} (${fd.get('metodo')})`); closeModal(); toast('¡Aviso enviado! La administración va a confirmar tu pago.'); render(); };
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
  if (e.target.dataset.tarifa) { const i = getInst(e.target.dataset.tarifa); const v = Math.max(0, Number(e.target.value) || 0); log(`Cambió la tarifa de ${i.nombre}: ${pesos(i.tarifa)} → ${pesos(v)}`); i.tarifa = v; toast('Tarifa actualizada'); }
});
document.addEventListener('input', e => {
  if (e.target.id === 'n_nro') {
    const n = e.target.value.trim(), el = $('#n_socio'); if (!el) return;
    const s = S.socios.find(x => x.nro === n), pd = S.padron.find(x => x.nro === n);
    if (!n) el.innerHTML = 'Escribí el número para buscar al socio.';
    else if (s && s.activo === false) el.innerHTML = `<span style="color:var(--rojo)">⛔ ${esc(s.nombre)}: cuenta suspendida</span>`;
    else if (s) el.innerHTML = `<span style="color:var(--verde);font-weight:600">✅ ${esc(s.nombre)}</span> · ${s.grupo.filter(g => g.estado === 'habilitado').length} familiares habilitados`;
    else if (pd) el.innerHTML = `<span style="color:var(--verde);font-weight:600">✅ ${esc(pd.nombre)}</span> · socio sin cuenta web`;
    else el.innerHTML = '<span style="color:var(--rojo)">❌ No existe un socio con ese número</span>';
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
render();
