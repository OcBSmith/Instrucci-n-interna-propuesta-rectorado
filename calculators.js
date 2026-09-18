// Todas las funciones son globales porque se llaman desde atributos onclick del HTML

function switchCalcTab(btn, tabId) {
  document.querySelectorAll('.calc-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  ['tab-perfil', 'tab-economico', 'tab-jornada'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === tabId ? 'block' : 'none';
  });
}

function calcPerfil() {
  const hijos = document.getElementById('pf-hijos').value;
  const tele  = document.getElementById('pf-tele').value;
  const horas = document.getElementById('pf-horas').value;
  const disc  = document.getElementById('pf-disc').value;
  const items = [];

  if (hijos === 'hijos12' || hijos === 'hijos6')
    items.push({ type: 'ok', text: '<strong>Art. 22</strong> — Reducción de jornada por cuidado de hijos hasta 12 años (antes 9). Puedes solicitar entre 1/8 y 1/2 jornada.' });
  if (hijos === 'hijos6')
    items.push({ type: 'ok', text: '<strong>Art. 29</strong> — Permiso por nacimiento/adopción mejorado: 19 semanas para cada progenitor.' });
  if (hijos === 'familiares')
    items.push({ type: 'ok', text: '<strong>Art. 22</strong> — Reducción de jornada para cuidar familiar hasta 2.º grado.' });
  if (tele === 'si')
    items.push({ type: 'ok', text: '<strong>Art. 9</strong> — Teletrabajo regulado por primera vez: mismos derechos de jornada, permisos y control horario que el trabajo presencial.' });
  if (tele === 'si')
    items.push({ type: 'alert', text: '<strong>Alerta (Art. 9)</strong> — El acceso y las condiciones del teletrabajo se remiten a la normativa específica de la UMA. UGT vigila que no sea discrecional.' });
  if (horas === 'si')
    items.push({ type: 'ok', text: '<strong>Arts. 14, 16 y 17</strong> — Compensación del exceso de jornada, horas urgentes y trabajo en festivos: 2 horas por hora trabajada o su equivalente económico.' });
  if (horas === 'si')
    items.push({ type: 'alert', text: '<strong>Alerta (Art. 8.5)</strong> — Compensar el saldo positivo de horas requiere autorización previa. UGT negocia eliminar esta restricción.' });
  if (disc === 'si')
    items.push({ type: 'ok', text: '<strong>Art. 24</strong> — Reducción gradual de jornada por discapacidad ≥45% con derecho a jubilación anticipada.' });
  if (disc === 'enfermedad')
    items.push({ type: 'ok', text: '<strong>Art. 28</strong> — Permiso por enfermedad grave de familiar: 5 días hábiles.' });
  if (!items.length)
    items.push({ type: 'ok', text: 'No hay artículos de impacto especial según tu perfil. Revisa el buscador de artículos para ver la norma completa.' });

  const res = document.getElementById('perfil-result');
  res.innerHTML = '<div class="profile-result-list">' +
    items.map(i =>
      '<div class="profile-result-item' + (i.type === 'alert' ? ' alert' : '') + '">' + i.text + '</div>'
    ).join('') +
    '</div>';
  res.classList.add('show');
}

function calcEconomico() {
  const sal    = parseFloat(document.getElementById('ec-salario').value) || 28000;
  const hrs    = parseFloat(document.getElementById('ec-horas').value)   || 0;
  const tipo   = document.getElementById('ec-tipo').value;
  const hrBase = sal / (12 * 160);
  const mult   = tipo === 'fest' ? 2.0 : tipo === 'noc' ? 1.75 : 1.5;
  const hrExtra = hrBase * mult;
  const mesExtra = hrExtra * hrs;
  const tipoLabel = tipo === 'fest' ? 'festivo/fin de semana' : tipo === 'noc' ? 'nocturna' : 'ordinaria';

  const res = document.getElementById('economico-result');
  res.innerHTML =
    '<div class="calc-result-headline">+' + mesExtra.toFixed(2) + ' €/mes</div>' +
    '<ul class="calc-result-items">' +
    '<li>Valor hora base: <strong>' + hrBase.toFixed(2) + ' €</strong></li>' +
    '<li>Multiplicador ×' + mult + ' (' + tipoLabel + '): <strong>' + hrExtra.toFixed(2) + ' €/h</strong></li>' +
    '<li>Con ' + hrs + ' h/mes: <strong>' + mesExtra.toFixed(2) + ' €/mes</strong> · <strong>' + (mesExtra * 12).toFixed(2) + ' €/año</strong></li>' +
    '<li style="font-size:12px;color:var(--text-3)">Estimación orientativa según los Arts. 14 y 17 de la propuesta 2026. Consulta UGT para verificar tu caso.</li>' +
    '</ul>';
  res.classList.add('show');
}

function calcJornada() {
  const pct    = parseFloat(document.getElementById('jr-pct').value) / 100;
  const sal    = parseFloat(document.getElementById('jr-salario').value) || 28000;
  const motivo = document.getElementById('jr-motivo').value;
  const redSal = sal * pct;
  const newSal = sal - redSal;
  const nota   = motivo === 'disc'
    ? ' (la reducción por discapacidad puede tener condiciones especiales de retribución — consulta UGT)'
    : '';

  const res = document.getElementById('jornada-result');
  res.innerHTML =
    '<div class="calc-result-headline">-' + redSal.toFixed(0) + ' €/año brutos</div>' +
    '<ul class="calc-result-items">' +
    '<li>Salario actual: <strong>' + sal.toFixed(0) + ' €/año</strong></li>' +
    '<li>Reducción del ' + (pct * 100).toFixed(1) + '%: <strong>-' + redSal.toFixed(0) + ' €/año</strong></li>' +
    '<li>Salario con reducción: <strong>' + newSal.toFixed(0) + ' €/año</strong> (~' + (newSal / 12).toFixed(0) + ' €/mes)</li>' +
    '<li style="font-size:12px;color:var(--text-3)">Estimación orientativa. Reducción proporcional al salario base.' + nota + '</li>' +
    '</ul>';
  res.classList.add('show');
}

function updateJornadaInfo() {
  const motivo = document.getElementById('jr-motivo')?.value;
  const info = {
    hijos12:   'Art. 22: reducción de 1/8 a 1/2 jornada para cuidado de hijos hasta 12 años (antes 9). Proporcional al salario.',
    disc:      'Art. 24: reducción gradual por discapacidad propia ≥45% con jubilación anticipada. Consulta condiciones con UGT.',
    legal:     'Art. 22: guarda legal de menores con discapacidad — mismos límites que cuidado de hijos.',
    prematuro: 'Art. 29: permiso por hospitalización del recién nacido. Duración ligada al período de hospitalización.',
  };
  const div = document.getElementById('jornada-info');
  if (div && motivo) div.textContent = info[motivo] || '';
}

document.addEventListener('DOMContentLoaded', updateJornadaInfo);
