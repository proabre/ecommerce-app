const form = $('#login-form') || $('#register-form');
form.onsubmit = async e => {
  e.preventDefault();
  const isLogin = form.id === 'login-form';
  const body = { email: $('#email').value, password: $('#pw').value };
  if (!isLogin) body.name = $('#nm').value;
  try {
    const r = await api(isLogin ? '/api/login' : '/api/register', { method: 'POST', body });
    localStorage.token = r.token; localStorage.name = r.name;
    location.href = store.cart.length ? 'cart.html' : 'index.html';
  } catch (err) { $('#note').innerHTML = flash(err.message); }
};
