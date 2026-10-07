// Shared helpers: API calls, cart storage, navigation
const $ = s => document.querySelector(s);
const money = c => '$' + (c / 100).toFixed(2);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const flash = (text, ok) => `<p class="msg ${ok ? 'ok' : ''}" role="alert">${esc(text)}</p>`;
const swatch = p => `<div class="swatch" style="background:${p.color}" aria-hidden="true">${esc(p.name[0])}</div>`;

const store = {
  get cart() { try { return JSON.parse(localStorage.cart || '[]'); } catch { return []; } },
  set cart(v) { localStorage.cart = JSON.stringify(v); renderNav(); },
  get token() { return localStorage.token; },
  get name() { return localStorage.name; }
};

async function api(url, opts = {}) {
  const res = await fetch(url, {
    method: opts.method,
    headers: { 'Content-Type': 'application/json', ...(store.token ? { Authorization: 'Bearer ' + store.token } : {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

function renderNav() {
  const n = store.cart.reduce((s, i) => s + i.quantity, 0);
  $('#nav').innerHTML = `<a href="index.html">Shop</a><a href="cart.html">Cart (${n})</a>` +
    (store.token
      ? `<a href="checkout.html">Orders</a><button id="logout">Log out (${esc(store.name)})</button>`
      : `<a href="login.html">Log in</a><a href="register.html">Sign up</a>`);
  $('#logout')?.addEventListener('click', () => { delete localStorage.token; delete localStorage.name; location.href = 'index.html'; });
}
renderNav();
