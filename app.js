const defaultProducts = [
  { id: 1, icon: '☕', tile: '#efe6d9', name: 'Café Orfeu Clássico 500g', category: 'Mercearia', cadence: 'A cada 21 dias', status: 'urgent', statusLabel: 'Urgente', last: '23 ago', source: 'Mercado Livre', price: 'R$ 27,90', saving: '18% abaixo da média', quantity: 1 },
  { id: 2, icon: '🧻', tile: '#e9f0f4', name: 'Papel Higiênico Neve — 24 rolos', category: 'Cuidados pessoais', cadence: 'A cada 30 dias', status: 'urgent', statusLabel: 'Urgente', last: '15 ago', source: 'E-mail', price: 'R$ 34,99', saving: '11% abaixo da média', quantity: 1 },
  { id: 3, icon: '🫧', tile: '#e6f1ef', name: 'Detergente Ypê Neutro — kit 6', category: 'Limpeza', cadence: 'A cada 45 dias', status: 'soon', statusLabel: 'Em breve', last: '29 jul', source: 'Mercado Livre', price: 'R$ 16,80', saving: 'Preço dentro da média', quantity: 2 },
  { id: 4, icon: '🐾', tile: '#eee8dc', name: 'Areia Higiênica Pipicat 12kg', category: 'Pets', cadence: 'A cada 28 dias', status: 'soon', statusLabel: 'Em breve', last: '20 ago', source: 'E-mail', price: 'R$ 42,50', saving: '7% abaixo da média', quantity: 1 }
];

let products = JSON.parse(localStorage.getItem('meuEstoqueProducts') || 'null') || defaultProducts;
let activeFilter = 'all';
const list = document.querySelector('#productList');
const toast = document.querySelector('#toast');

function save() { localStorage.setItem('meuEstoqueProducts', JSON.stringify(products)); }
function notify(message) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2300); }
function render() {
  const query = document.querySelector('#search').value.trim().toLocaleLowerCase('pt-BR');
  const filtered = products.filter(p => (activeFilter === 'all' || p.status === activeFilter) && p.name.toLocaleLowerCase('pt-BR').includes(query));
  list.innerHTML = filtered.length ? filtered.map(p => `
    <article class="product-row" data-id="${p.id}">
      <div class="product-image" style="--tile:${p.tile}">${p.icon}</div>
      <div class="product-name"><strong>${p.name}</strong><span>${p.category} · ${p.cadence}</span></div>
      <span class="status ${p.status}">${p.statusLabel}</span>
      <div class="product-meta"><strong>${p.last}</strong><span>Última compra</span></div>
      <div class="best-price"><strong>${p.price}</strong><span>${p.saving}</span></div>
      <div class="quantity"><button data-action="minus" aria-label="Diminuir ${p.name}">−</button><span>${p.quantity}</span><button data-action="plus" aria-label="Aumentar ${p.name}">＋</button></div>
    </article>`).join('') : '<div class="empty">Nenhum produto encontrado.</div>';
  document.querySelector('#allCount').textContent = products.length;
  document.querySelector('#navCount').textContent = products.length;
  document.querySelector('#replacementTotal').textContent = products.length;
}

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelector('.tab.active').classList.remove('active'); tab.classList.add('active'); activeFilter = tab.dataset.filter; render();
}));
document.querySelector('#search').addEventListener('input', render);
list.addEventListener('click', event => {
  const button = event.target.closest('[data-action]'); if (!button) return;
  const product = products.find(p => p.id === Number(button.closest('.product-row').dataset.id));
  product.quantity = Math.max(0, product.quantity + (button.dataset.action === 'plus' ? 1 : -1)); save(); render();
});
document.querySelector('#addButton').addEventListener('click', () => document.querySelector('#addDialog').showModal());
document.querySelector('#addForm').addEventListener('submit', event => {
  if (event.submitter?.value === 'cancel') return;
  event.preventDefault(); const data = new FormData(event.currentTarget); const price = data.get('price') || '0,00';
  products.unshift({id: Date.now(), icon: '🛒', tile: '#e8efe9', name: data.get('name'), category: data.get('category'), cadence: 'Novo na lista', status: 'soon', statusLabel: 'Em breve', last: '—', source: 'Manual', price: `R$ ${price}`, saving: 'Acompanhando preço', quantity: 1});
  save(); render(); event.currentTarget.reset(); document.querySelector('#addDialog').close(); notify('Produto adicionado à sua lista');
});
document.querySelector('#syncButton').addEventListener('click', event => { event.currentTarget.innerHTML = '<span>↻</span> Sincronizando...'; setTimeout(() => { event.currentTarget.innerHTML = '<span>✓</span> Sincronizado'; notify('E-mail e Mercado Livre atualizados'); }, 900); });
document.querySelector('#offerButton').addEventListener('click', () => notify('Oferta salva para acompanhar'));
document.querySelector('#viewAll').addEventListener('click', () => { activeFilter = 'all'; document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.filter === 'all')); render(); document.querySelector('#search').focus(); });
document.querySelector('.insight button').addEventListener('click', event => event.currentTarget.closest('.insight').remove());
document.querySelector('.mobile-menu').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key === 'k') { event.preventDefault(); document.querySelector('#search').focus(); } });
render();
