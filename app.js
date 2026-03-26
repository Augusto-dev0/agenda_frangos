
/* =========================================
   ESTADO
========================================= */
const CHAVE = 'avicola_pedidos';
let pedidos = [];
let calAno, calMes;

/* =========================================
   DOM
========================================= */
const formPedido   = document.getElementById('form-pedido');
const tabelaBody   = document.getElementById('tabela-body');
const semPedidos   = document.getElementById('sem-pedidos');
const btnSalvar    = document.getElementById('btn-salvar');
const btnLimpar    = document.getElementById('btn-limpar');
const editIdx      = document.getElementById('edit-idx');
const modal        = document.getElementById('modal');
const modalClose   = document.getElementById('modal-close');
const modalText    = document.getElementById('modal-text');
const inpCliente   = document.getElementById('inp-cliente');
const inpQtd       = document.getElementById('inp-qtd');
const inpData      = document.getElementById('inp-data');
const selEntrega   = document.getElementById('sel-entrega');
const selPagamento = document.getElementById('sel-pagamento');
const inpObs       = document.getElementById('inp-obs');

/* =========================================
   STORAGE LOCAL
========================================= */
function salvarLocal() {
  localStorage.setItem(CHAVE, JSON.stringify(pedidos));
}

function carregarLocal() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
  } catch { return []; }
}

/* =========================================
   TOAST
========================================= */
function toast(msg, tipo = 'ok') {
  const el   = document.getElementById('toast');
  const icon = document.getElementById('toast-icon');
  document.getElementById('toast-msg').textContent = msg;
  const mapa = {
    ok:    'fa-circle-check',
    aviso: 'fa-triangle-exclamation',
    info:  'fa-circle-info',
    erro:  'fa-circle-xmark'
  };
  icon.className = `fas ${mapa[tipo] || mapa.ok}`;
  icon.style.color = tipo === 'erro'  ? 'var(--vermelho)' :
                     tipo === 'aviso' ? 'var(--amarelo)'  : 'var(--laranja)';
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3400);
}

/* =========================================
   MODAL OBSERVAÇÕES
========================================= */
function openModal(idx) {
  const obs = pedidos[idx]?.observations?.trim();
  modalText.textContent = obs || 'Nenhuma observação registrada.';
  modal.classList.add('aberto');
}
function closeModal() { modal.classList.remove('aberto'); }

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

/* =========================================
   MODAL CONFIRMAÇÃO DE TEMA
========================================= */
let _temaPendente = null;

function pedirTrocaTema() {
  const claro = document.body.classList.contains('light');
  _temaPendente = claro ? 'escuro' : 'claro';
  const nomeTema = _temaPendente === 'claro' ? 'Modo Claro ☀️' : 'Modo Escuro 🌙';
  document.getElementById('modal-tema-txt').textContent =
    `Deseja mudar para o ${nomeTema}?`;
  document.getElementById('btn-confirmar-tema').onclick = confirmarTema;
  document.getElementById('modal-tema').classList.add('aberto');
}

function confirmarTema() {
  if (_temaPendente === 'claro') {
    document.body.classList.add('light');
    document.getElementById('tema-icon').className = 'fas fa-sun';
    localStorage.setItem('tema', 'claro');
  } else {
    document.body.classList.remove('light');
    document.getElementById('tema-icon').className = 'fas fa-moon';
    localStorage.setItem('tema', 'escuro');
  }
  _temaPendente = null;
  document.getElementById('modal-tema').classList.remove('aberto');
  toast('Tema alterado com sucesso!', 'info');
}

function cancelarTema() {
  _temaPendente = null;
  document.getElementById('modal-tema').classList.remove('aberto');
}

document.getElementById('modal-tema').addEventListener('click', function(e) {
  if (e.target === this) cancelarTema();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); cancelarTema(); }
});

/* =========================================
   INICIAR TEMA SALVO
========================================= */
(function initTema() {
  if (localStorage.getItem('tema') === 'claro') {
    document.body.classList.add('light');
    const ic = document.getElementById('tema-icon');
    if (ic) ic.className = 'fas fa-sun';
  }
})();

/* =========================================
   ESTATÍSTICAS — requestAnimationFrame
========================================= */
function atualizarStats() {
  const frangos   = pedidos.reduce((s, p) => s + (parseInt(p.quantity) || 0), 0);
  const total     = pedidos.length;
  const entregues = pedidos.filter(p => p.delivery === 'delivered').length;
  const pendentes = pedidos.filter(p => p.delivery === 'pending').length;
  animNum('stat-frangos',   frangos);
  animNum('stat-pedidos',   total);
  animNum('stat-entregues', entregues);
  animNum('stat-pendentes', pendentes);
}

function animNum(id, alvo) {
  const el  = document.getElementById(id);
  const ini = parseInt(el.textContent) || 0;
  if (ini === alvo) { el.textContent = alvo; return; }
  const dur = 420, t0 = performance.now();
  (function step(agora) {
    const p = Math.min((agora - t0) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ini + (alvo - ini) * e);
    if (p < 1) requestAnimationFrame(step);
  })(performance.now());
}

/* =========================================
   ALERTAS PROATIVOS
========================================= */
function verificarAlertas() {
  const alertas = [];
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);

  pedidos.forEach(p => {
    // Pagamento pendente há mais de 7 dias
    if (p.payment === 'pending' && p.order_date) {
      const data = new Date(p.order_date + 'T00:00:00');
      const dias = Math.floor((hoje - data) / 86400000);
      if (dias >= 7) {
        alertas.push({
          tipo: 'urgente',
          icon: 'fa-circle-dollar-to-slot',
          msg: `<strong>${p.client}</strong> — pagamento pendente há <strong>${dias} dia${dias !== 1 ? 's' : ''}</strong>`
        });
      }
    }
    // Entrega pendente há mais de 3 dias
    if (p.delivery === 'pending' && p.order_date) {
      const data = new Date(p.order_date + 'T00:00:00');
      const dias = Math.floor((hoje - data) / 86400000);
      if (dias >= 3) {
        alertas.push({
          tipo: 'aviso',
          icon: 'fa-truck-clock',
          msg: `<strong>${p.client}</strong> — entrega pendente há <strong>${dias} dia${dias !== 1 ? 's' : ''}</strong>`
        });
      }
    }
  });

  const section = document.getElementById('alertas-section');
  const lista   = document.getElementById('alertas-lista');
  lista.innerHTML = '';

  if (alertas.length === 0) { section.style.display = 'none'; return; }

  section.style.display = 'block';
  alertas.forEach(a => {
    const div = document.createElement('div');
    div.className = `alerta-item ${a.tipo}`;
    div.innerHTML = `<i class="fas ${a.icon}"></i><span>${a.msg}</span>`;
    lista.appendChild(div);
  });
}

/* =========================================
   CALENDÁRIO
========================================= */
function iniciarCalendario() {
  const hoje = new Date();
  calAno = hoje.getFullYear();
  calMes = hoje.getMonth();
  renderCalendario();
}

function mudarMesCal(dir) {
  calMes += dir;
  if (calMes < 0)  { calMes = 11; calAno--; }
  if (calMes > 11) { calMes = 0;  calAno++; }
  renderCalendario();
}

function renderCalendario() {
  const nomes = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                 'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  document.getElementById('cal-titulo').textContent = `${nomes[calMes]} ${calAno}`;

  const grid      = document.getElementById('cal-grid');
  grid.innerHTML  = '';

  const hoje       = new Date(); hoje.setHours(0,0,0,0);
  const primeiroDia= new Date(calAno, calMes, 1).getDay();
  const totalDias  = new Date(calAno, calMes + 1, 0).getDate();
  const diasMesAnt = new Date(calAno, calMes, 0).getDate();

  // Mapa de pedidos no mês
  const mapaPedidos = {};
  pedidos.forEach(p => {
    if (!p.order_date) return;
    const [y, m] = p.order_date.split('-').map(Number);
    if (y === calAno && m - 1 === calMes) {
      if (!mapaPedidos[p.order_date]) mapaPedidos[p.order_date] = [];
      mapaPedidos[p.order_date].push(p.client);
    }
  });

  // Dias mês anterior
  for (let i = primeiroDia - 1; i >= 0; i--) {
    const div = document.createElement('div');
    div.className = 'cal-dia outro-mes';
    div.textContent = diasMesAnt - i;
    grid.appendChild(div);
  }

  // Dias do mês atual
  for (let d = 1; d <= totalDias; d++) {
    const div  = document.createElement('div');
    const mm   = String(calMes + 1).padStart(2, '0');
    const dd   = String(d).padStart(2, '0');
    const chave= `${calAno}-${mm}-${dd}`;
    const dataD= new Date(calAno, calMes, d);

    div.className = 'cal-dia';
    div.textContent = d;

    if (dataD.getTime() === hoje.getTime()) div.classList.add('hoje');

    if (mapaPedidos[chave]) {
      div.classList.add('tem-pedido');
      const qtd    = mapaPedidos[chave].length;
      const nomes  = mapaPedidos[chave].join(', ');
      const tip    = qtd > 2
        ? `${mapaPedidos[chave].slice(0,2).join(', ')} +${qtd-2}`
        : nomes;
      div.setAttribute('data-tip', `${qtd} pedido${qtd>1?'s':''}: ${tip}`);
      div.addEventListener('click', () => {
        document.getElementById('filtro-busca').value = '';
        renderizar();
        document.querySelector('.tabela-wrap').scrollIntoView({ behavior:'smooth' });
      });
    }

    grid.appendChild(div);
  }

  // Completar grid
  const totalCelulas = primeiroDia + totalDias;
  const restante = totalCelulas % 7 === 0 ? 0 : 7 - (totalCelulas % 7);
  for (let i = 1; i <= restante; i++) {
    const div = document.createElement('div');
    div.className = 'cal-dia outro-mes';
    div.textContent = i;
    grid.appendChild(div);
  }
}

/* =========================================
   FILTROS
========================================= */
function limparFiltros() {
  document.getElementById('filtro-busca').value    = '';
  document.getElementById('filtro-entrega').value  = '';
  document.getElementById('filtro-pagamento').value = '';
  renderizar();
}

function getPedidosFiltrados() {
  const busca   = document.getElementById('filtro-busca').value.toLowerCase().trim();
  const entrega = document.getElementById('filtro-entrega').value;
  const pag     = document.getElementById('filtro-pagamento').value;

  return pedidos.filter(p => {
    if (busca   && !p.client.toLowerCase().includes(busca)) return false;
    if (entrega && p.delivery !== entrega)                   return false;
    if (pag     && p.payment  !== pag)                      return false;
    return true;
  });
}

document.getElementById('filtro-busca').addEventListener('input', renderizar);
document.getElementById('filtro-entrega').addEventListener('change', renderizar);
document.getElementById('filtro-pagamento').addEventListener('change', renderizar);

/* =========================================
   RENDER
========================================= */
function renderizar() {
  tabelaBody.innerHTML = '';
  const lista = getPedidosFiltrados();
  const lbl   = document.getElementById('lbl-count');

  if (lista.length === 0) {
    semPedidos.style.display = 'block';
    lbl.textContent = pedidos.length > 0 ? 'Nenhum resultado para o filtro aplicado.' : '';
    atualizarStats();
    return;
  }

  semPedidos.style.display = 'none';
  lbl.textContent = `${lista.length} pedido${lista.length !== 1 ? 's' : ''} encontrado${lista.length !== 1 ? 's' : ''}`;

  lista.forEach(p => {
    const idxReal = pedidos.indexOf(p);
    const tr = document.createElement('tr');

    // Cliente
    const tdC = document.createElement('td');
    tdC.style.fontWeight = '600';
    tdC.textContent = p.client;
    tr.appendChild(tdC);

    // Quantidade
    const tdQ = document.createElement('td');
    tdQ.className = 'td-qtd';
    tdQ.textContent = p.quantity + (p.quantity === 1 ? ' frango' : ' frangos');
    tr.appendChild(tdQ);

    // Data
    const tdD = document.createElement('td');
    tdD.style.fontSize = '0.83rem';
    tdD.style.color = 'var(--txt2)';
    tdD.textContent = p.order_date
      ? new Date(p.order_date + 'T00:00:00').toLocaleDateString('pt-BR')
      : '—';
    tr.appendChild(tdD);

    // Badge entrega
    const tdE = document.createElement('td');
    const bE  = document.createElement('span');
    bE.className = p.delivery === 'delivered' ? 'badge badge-entregue' : 'badge badge-processo';
    bE.innerHTML  = p.delivery === 'delivered'
      ? '<i class="fas fa-check-circle"></i> Entregue'
      : '<i class="fas fa-clock"></i> Em processo';
    tdE.appendChild(bE); tr.appendChild(tdE);

    // Badge pagamento
    const tdP = document.createElement('td');
    const bP  = document.createElement('span');
    bP.className = p.payment === 'paid' ? 'badge badge-pago' : 'badge badge-pendente';
    bP.innerHTML  = p.payment === 'paid'
      ? '<i class="fas fa-check-circle"></i> Pago'
      : '<i class="fas fa-exclamation-circle"></i> Pendente';
    tdP.appendChild(bP); tr.appendChild(tdP);

    // Obs — botão com bolinha vermelha
    const tdO  = document.createElement('td');
    const temObs = p.observations?.trim();
    const bObs = document.createElement('button');
    bObs.className = `btn-acao ${temObs ? 'btn-obs-sim' : 'btn-obs-nao'}`;
    bObs.title = temObs ? 'Ver observações' : 'Sem observações';
    bObs.setAttribute('aria-label', temObs ? 'Ver observações' : 'Sem observações');
    bObs.innerHTML = '<i class="fas fa-eye"></i>';
    if (temObs) {
      const dot = document.createElement('span');
      dot.className = 'obs-dot';
      bObs.appendChild(dot);
      bObs.addEventListener('click', () => openModal(idxReal));
    }
    tdO.appendChild(bObs);
    tr.appendChild(tdO);

    // Ações
    const tdA = document.createElement('td');
    tdA.style.whiteSpace = 'nowrap';

    const bEd = document.createElement('button');
    bEd.className = 'btn-acao btn-editar';
    bEd.innerHTML = '<i class="fas fa-pen"></i><span class="txt-btn"> Editar</span>';
    bEd.title = 'Editar';
    bEd.addEventListener('click', () => editarPedido(idxReal));

    const bDel = document.createElement('button');
    bDel.className = 'btn-acao btn-apagar';
    bDel.innerHTML = '<i class="fas fa-trash"></i><span class="txt-btn"> Apagar</span>';
    bDel.title = 'Apagar';
    bDel.style.marginLeft = '4px';
    bDel.addEventListener('click', () => apagarPedido(idxReal));

    tdA.appendChild(bEd);
    tdA.appendChild(bDel);
    tr.appendChild(tdA);

    tabelaBody.appendChild(tr);
  });

  atualizarStats();
}

/* =========================================
   SALVAR / EDITAR
========================================= */
formPedido.addEventListener('submit', function(e) {
  e.preventDefault();

  const cliente = inpCliente.value.trim();
  const qtd     = parseInt(inpQtd.value);

  if (cliente.length < 2) { toast('Nome deve ter ao menos 2 caracteres.', 'aviso'); inpCliente.focus(); return; }
  if (isNaN(qtd) || qtd < 1) { toast('Quantidade deve ser ao menos 1.', 'aviso'); inpQtd.focus(); return; }

  const pedido = {
    client:       cliente,
    quantity:     qtd,
    delivery:     selEntrega.value,
    payment:      selPagamento.value,
    observations: inpObs.value.trim(),
    order_date:   inpData.value || new Date().toISOString().split('T')[0]
  };

  const idx = editIdx.value !== '' ? parseInt(editIdx.value) : -1;

  if (idx >= 0) {
    pedidos[idx] = pedido;
    editIdx.value = '';
    btnSalvar.innerHTML = '<i class="fas fa-save"></i> Salvar Pedido';
    toast('Pedido atualizado com sucesso!');
  } else {
    pedidos.unshift(pedido);
    toast('Pedido salvo com sucesso!');
  }

  salvarLocal();
  formPedido.reset();
  inpQtd.value  = '1';
  inpData.value = new Date().toISOString().split('T')[0];
  renderizar();
  renderCalendario();
  verificarAlertas();
});

/* =========================================
   EDITAR
========================================= */
function editarPedido(i) {
  const p = pedidos[i];
  inpCliente.value   = p.client;
  inpQtd.value       = p.quantity;
  inpData.value      = p.order_date || '';
  selEntrega.value   = p.delivery;
  selPagamento.value = p.payment;
  inpObs.value       = p.observations || '';
  editIdx.value      = i;
  btnSalvar.innerHTML = '<i class="fas fa-pen"></i> Atualizar Pedido';
  document.getElementById('form-pedido').scrollIntoView({ behavior:'smooth', block:'start' });
  inpCliente.focus();
  toast(`Editando: ${p.client}`, 'info');
}

/* =========================================
   APAGAR
========================================= */
function apagarPedido(i) {
  const nome = pedidos[i].client;
  if (confirm(`Excluir o pedido de ${nome}?`)) {
    pedidos.splice(i, 1);
    salvarLocal();
    renderizar();
    renderCalendario();
    verificarAlertas();
    toast(`Pedido de ${nome} removido.`, 'aviso');
  }
}

/* =========================================
   LIMPAR FORM
========================================= */
btnLimpar.addEventListener('click', () => {
  formPedido.reset();
  inpQtd.value  = '1';
  inpData.value = new Date().toISOString().split('T')[0];
  editIdx.value = '';
  btnSalvar.innerHTML = '<i class="fas fa-save"></i> Salvar Pedido';
  inpCliente.focus();
  toast('Formulário limpo.', 'info');
});

/* =========================================
   EXPORTAR PDF
========================================= */
function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  const W = 210, H = 297, ML = 14, MR = 14;

  const C = {
    bg:      [14,  11,  8],   sup1:    [23,  19, 14],
    sup2:    [33,  26, 18],   laranja: [249, 115, 22],
    verde:   [74, 222,128],   vermelho:[248, 113,113],
    amarelo: [251,191, 36],   txt:     [245, 237,226],
    muted:   [154,136,120],   borda:   [45,  36, 23],
    branco:  [255,255,255],
  };

  const F = c => doc.setFillColor(c[0],c[1],c[2]);
  const S = c => doc.setDrawColor(c[0],c[1],c[2]);
  const T = c => doc.setTextColor(c[0],c[1],c[2]);

  F(C.bg); doc.rect(0,0,W,H,'F');
  F(C.sup1); doc.rect(0,0,W,50,'F');
  F(C.laranja); doc.rect(0,0,5,50,'F');
  F([30,18,8]); doc.rect(5,0,W-5,50,'F');

  F(C.laranja); doc.roundedRect(12,11,28,28,5,5,'F');
  T(C.branco); doc.setFontSize(11); doc.setFont('helvetica','bold');
  doc.text('AVI',26,28,{align:'center'});

  T(C.txt); doc.setFontSize(19); doc.setFont('helvetica','bold');
  doc.text('AVÍCOLA PARAÍSO',47,23);
  T(C.muted); doc.setFontSize(8); doc.setFont('helvetica','normal');
  doc.text('Relatório de Pedidos',47,31);

  T(C.muted); doc.setFontSize(7);
  doc.text('Gerado em: '+new Date().toLocaleString('pt-BR'), W-MR, 20, {align:'right'});
  T(C.laranja); doc.setFont('helvetica','bold'); doc.setFontSize(7.5);
  doc.text(`${pedidos.length} pedido${pedidos.length!==1?'s':''} no sistema`, W-MR, 30, {align:'right'});

  S(C.laranja); doc.setLineWidth(0.45);
  doc.line(ML,52,W-MR,52);

  const frangos   = pedidos.reduce((s,p)=>s+(parseInt(p.quantity)||0),0);
  const entregues = pedidos.filter(p=>p.delivery==='delivered').length;
  const processos = pedidos.filter(p=>p.delivery==='pending').length;
  const pagPend   = pedidos.filter(p=>p.payment==='pending').length;

  const cards = [
    {label:'FRANGOS',    valor:String(frangos),   cor:C.laranja },
    {label:'ENTREGUES',  valor:String(entregues), cor:C.verde   },
    {label:'EM PROCESSO',valor:String(processos), cor:C.amarelo },
    {label:'PAG. PEND.', valor:String(pagPend),   cor:C.vermelho},
  ];

  const cW=42, cH=22, cY=57, gap=5;
  cards.forEach((c,i)=>{
    const x=ML+i*(cW+gap);
    F(C.sup2); doc.roundedRect(x,cY,cW,cH,3,3,'F');
    F(c.cor);  doc.roundedRect(x,cY,3,cH,2,2,'F');
    T(C.muted); doc.setFontSize(5.5); doc.setFont('helvetica','bold');
    doc.text(c.label,x+6,cY+8);
    T(C.txt); doc.setFontSize(13); doc.setFont('helvetica','bold');
    doc.text(c.valor,x+6,cY+17);
  });

  const tY=87;
  const cols=['CLIENTE','QTD.','DATA','ENTREGA','PAGAMENTO','OBSERVAÇÕES'];
  const colX=[ML,55,78,104,132,162];

  F(C.sup2); doc.roundedRect(ML,tY,W-ML-MR,9,2,2,'F');
  F(C.laranja); doc.rect(ML,tY+9,W-ML-MR,0.6,'F');
  T(C.muted); doc.setFontSize(6); doc.setFont('helvetica','bold');
  cols.forEach((col,i)=>doc.text(col,colX[i]+2,tY+6));

  let rY=tY+12;

  pedidos.forEach((p,idx)=>{
    if(rY>H-22){
      doc.addPage();
      F(C.bg); doc.rect(0,0,W,H,'F');
      F(C.sup1); doc.rect(0,0,W,14,'F');
      F(C.laranja); doc.rect(0,0,4,14,'F');
      T(C.muted); doc.setFontSize(6.5); doc.setFont('helvetica','normal');
      doc.text('Avícola Paraíso — Relatório de Pedidos (continuação)',ML+5,9);
      rY=22;
    }

    if(idx%2===0){F(C.sup1);doc.rect(ML,rY-0.5,W-ML-MR,9.5,'F');}
    S(C.borda); doc.setLineWidth(0.22);
    doc.line(ML,rY+9,W-ML-MR+ML,rY+9);
    const cy=rY+6;

    T(C.txt); doc.setFont('helvetica','bold'); doc.setFontSize(7.5);
    const nome=p.client.length>16?p.client.substring(0,14)+'…':p.client;
    doc.text(nome,colX[0]+2,cy);

    T(C.laranja); doc.setFontSize(8);
    doc.text(String(p.quantity),colX[1]+2,cy);

    T(C.muted); doc.setFont('helvetica','normal'); doc.setFontSize(7);
    const dataFmt=p.order_date
      ?new Date(p.order_date+'T00:00:00').toLocaleDateString('pt-BR'):'—';
    doc.text(dataFmt,colX[2]+2,cy);

    const eC=p.delivery==='delivered'?C.verde:C.amarelo;
    doc.setFillColor(eC[0],eC[1],eC[2],0.15);
    doc.roundedRect(colX[3]+1,rY+1.8,27,6,2,2,'F');
    T(eC); doc.setFontSize(6.2); doc.setFont('helvetica','bold');
    doc.text(p.delivery==='delivered'?'Entregue':'Em processo',colX[3]+14.5,cy,{align:'center'});

    const pC=p.payment==='paid'?C.verde:C.vermelho;
    doc.setFillColor(pC[0],pC[1],pC[2],0.15);
    doc.roundedRect(colX[4]+1,rY+1.8,25,6,2,2,'F');
    T(pC); doc.setFontSize(6.2);
    doc.text(p.payment==='paid'?'Pago':'Pendente',colX[4]+13.5,cy,{align:'center'});

    T(C.muted); doc.setFont('helvetica','normal'); doc.setFontSize(6.5);
    const obsT=p.observations?.trim()
      ?(p.observations.length>22?p.observations.substring(0,20)+'…':p.observations):'—';
    doc.text(obsT,colX[5]+2,cy);

    rY+=9.5;
  });

  const nPags=doc.getNumberOfPages();
  for(let pg=1;pg<=nPags;pg++){
    doc.setPage(pg);
    F(C.sup1); doc.rect(0,H-13,W,13,'F');
    F(C.laranja); doc.rect(0,H-13,W,0.5,'F');
    T(C.muted); doc.setFontSize(6.2); doc.setFont('helvetica','normal');
    doc.text('Avícola Paraíso © '+new Date().getFullYear()+' | github.com/Augusto-dev0',ML,H-5);
    doc.text(`Página ${pg} de ${nPags}`,W-MR,H-5,{align:'right'});
  }

  doc.save('Relatorio_Avicola_Paraiso.pdf');
  toast('PDF exportado com sucesso!');
}

/* =========================================
   INICIALIZAR
========================================= */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ano').textContent = new Date().getFullYear();
  inpData.value = new Date().toISOString().split('T')[0];
  pedidos = carregarLocal();
  renderizar();
  iniciarCalendario();
  verificarAlertas();
});
