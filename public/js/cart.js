async function showCart() {
  const cart = store.cart;
  if (!cart.length) { $('#cart').innerHTML = '<p class="lede">Your cart is empty. Pick something from the <a href="index.html">shop</a>.</p>'; return; }
  const ps = await Promise.all(cart.map(i => api('/api/products/' + i.id)));
  const total = ps.reduce((s, p, k) => s + p.price * cart[k].quantity, 0);
  $('#cart').innerHTML = ps.map((p, k) => `<div class="row">${swatch(p)}
      <div class="grow"><a href="product.html?id=${p._id}">${esc(p.name)}</a><br><span class="price">${money(p.price)}</span></div>
      <input type="number" min="1" max="${p.stock}" value="${cart[k].quantity}" data-qty="${p._id}" aria-label="Quantity of ${esc(p.name)}">
      <button class="btn ghost" data-rm="${p._id}">Remove</button></div>`).join('') +
    `<p class="total">Total: <strong>${money(total)}</strong></p><a class="btn" href="checkout.html">Go to checkout</a>`;
  document.querySelectorAll('[data-qty]').forEach(el => el.onchange = () => {
    store.cart = store.cart.map(i => i.id === el.dataset.qty ? { ...i, quantity: Math.max(1, +el.value || 1) } : i); showCart();
  });
  document.querySelectorAll('[data-rm]').forEach(el => el.onclick = () => {
    store.cart = store.cart.filter(i => i.id !== el.dataset.rm); showCart();
  });
}

async function showOrders() {
  const os = await api('/api/orders');
  $('#orders').innerHTML = os.length ? os.map(o => `<div class="order"><strong>Order #${esc(o._id.slice(-6))}</strong> — ${money(o.total)}
    <span style="color:#5C6678">(${esc(new Date(o.createdAt).toLocaleString())})</span>
    <ul>${o.items.map(i => `<li>${i.quantity} × ${esc(i.name)}</li>`).join('')}</ul><small>Ships to: ${esc(o.address)}</small></div>`).join('')
    : '<p class="lede">No orders yet.</p>';
}

(async () => {
  try {
    if ($('#cart')) await showCart();
    if ($('#checkout-form')) {
      if (!store.token) { location.href = 'login.html'; return; }
      $('#checkout-form').onsubmit = async e => {
        e.preventDefault();
        try {
          const { orderId } = await api('/api/orders', { method: 'POST', body: { items: store.cart, address: $('#addr').value.trim() } });
          store.cart = [];
          $('#note').innerHTML = flash(`Order #${orderId.slice(-6)} placed. Thank you!`, true);
          showOrders();
        } catch (err) { $('#note').innerHTML = flash(err.message); }
      };
      showOrders();
    }
  } catch (e) { $('#main').innerHTML = flash(e.message); }
})();
