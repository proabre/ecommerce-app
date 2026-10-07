(async () => {
  try {
    if ($('#grid')) {
      const ps = await api('/api/products');
      $('#grid').innerHTML = ps.map(p => `<a class="card" href="product.html?id=${p._id}">${swatch(p)}
        <div class="info"><span>${esc(p.name)}</span><span class="price">${money(p.price)}</span></div></a>`).join('');
    }
    if ($('#detail')) {
      const id = new URLSearchParams(location.search).get('id');
      const p = await api('/api/products/' + encodeURIComponent(id));
      document.title = p.name + ' — Kiln';
      $('#detail').innerHTML = `${swatch(p)}<div><h1>${esc(p.name)}</h1>
        <p class="price" style="font-size:24px">${money(p.price)}</p><p>${esc(p.description)}</p>
        <p style="color:#5C6678">${p.stock > 0 ? p.stock + ' in stock' : 'Sold out'}</p>
        <button class="btn" id="add" ${p.stock < 1 ? 'disabled' : ''}>Add to cart</button><div id="note"></div></div>`;
      $('#add').onclick = () => {
        const cart = store.cart, found = cart.find(i => i.id === p._id);
        found ? found.quantity++ : cart.push({ id: p._id, quantity: 1 });
        store.cart = cart;
        $('#note').innerHTML = flash('Added to your cart.', true);
      };
    }
  } catch (e) { $('#main').innerHTML = flash(e.message); }
})();
