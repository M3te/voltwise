// â”€â”€â”€ PRODUCT DATA â”€â”€â”€
var PRODUCT = {
  id: 'vw-sem-v1',
  name: 'VoltWise Smart Energy Meter',
  price: 699,
  oldPrice: 999,
  color: 'Pearl White',
  image: 'imgs/Mian.png',
  images: [
    'imgs/Mian.png',
    'imgs/Main 2.jpeg',
    'imgs/Main 3.jpeg',
    'imgs/Main 4.png'
  ]
};

// â”€â”€â”€ GALLERY â”€â”€â”€
(function() {
  var mainPhoto = document.getElementById('mainPhoto');
  var thumbsEl  = document.getElementById('thumbs');

  PRODUCT.images.forEach(function(src, i) {
    var div = document.createElement('div');
    div.className = 'thumb' + (i === 0 ? ' active' : '');
    var img = document.createElement('img');
    img.src = src;
    img.alt = 'View ' + (i+1);
    img.loading = 'lazy';
    div.appendChild(img);
    div.addEventListener('click', function() {
      mainPhoto.src = src;
      thumbsEl.querySelectorAll('.thumb').forEach(function(t){ t.classList.remove('active'); });
      div.classList.add('active');
    });
    thumbsEl.appendChild(div);
  });
})();

// â”€â”€â”€ COLOR SWATCHES â”€â”€â”€
(function() {
  var swatches = document.querySelectorAll('.color-swatch');
  var colorName = document.getElementById('colorName');
  var mainPhoto = document.getElementById('mainPhoto');

  swatches.forEach(function(swatch) {
    swatch.addEventListener('click', function() {
      swatches.forEach(function(s){ s.classList.remove('active'); });
      swatch.classList.add('active');
      var color = swatch.dataset.color;
      var img   = swatch.dataset.img;
      if (colorName) colorName.textContent = color;
      if (img) mainPhoto.src = img;
      PRODUCT.color = color;
      PRODUCT.image = img;
    });
  });
})();

// â”€â”€â”€ PRICE COUNT-UP â”€â”€â”€
(function() {
  var priceEl = document.querySelector('.price');
  if (!priceEl) return;
  var target = parseInt(priceEl.textContent, 10) || 0;
  var duration = 1100;
  var start = null;
  function step(ts) {
    if (!start) start = ts;
    var p = Math.min((ts - start) / duration, 1);
    var eased = 1 - Math.pow(1 - p, 3);
    priceEl.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(step);
    else priceEl.textContent = target;
  }
  priceEl.textContent = '0';
  setTimeout(function(){ requestAnimationFrame(step); }, 200);
})();


// â”€â”€â”€ CART STATE â”€â”€â”€
var cart = [];

function getQty() {
  var v = parseInt(document.getElementById('qtyInput').value) || 1;
  return Math.max(1, v);
}

function cartCount() {
  return cart.reduce(function(s, i){ return s + i.qty; }, 0);
}
function cartTotal() {
  return cart.reduce(function(s, i){ return s + i.price * i.qty; }, 0);
}

function updateCartBtn() {
  var n = cartCount();
  var countEl = document.getElementById('cartCount');
  var label   = document.getElementById('cartLabel');
  if (n > 0) {
    countEl.textContent = n;
    countEl.classList.remove('hidden');
    label.textContent = 'Cart';
    countEl.classList.add('pop');
    setTimeout(function(){ countEl.classList.remove('pop'); }, 300);
  } else {
    countEl.classList.add('hidden');
    label.textContent = 'Cart';
  }
}

// â”€â”€â”€ QTY STEPPER â”€â”€â”€
document.getElementById('qtyMinus').addEventListener('click', function() {
  var inp = document.getElementById('qtyInput');
  var v = parseInt(inp.value) || 1;
  if (v > 1) inp.value = v - 1;
});
document.getElementById('qtyPlus').addEventListener('click', function() {
  var inp = document.getElementById('qtyInput');
  inp.value = (parseInt(inp.value) || 1) + 1;
});

// â”€â”€â”€ ADD TO CART â”€â”€â”€
document.getElementById('addBtn').addEventListener('click', function() {
  var qty = getQty();
  var itemId = PRODUCT.id + '-' + PRODUCT.color.toLowerCase().replace(/\s+/g,'-');
  var existing = cart.find(function(i){ return i.id === itemId; });
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: itemId,
      name: PRODUCT.name + ' â€” ' + PRODUCT.color,
      price: PRODUCT.price,
      image: PRODUCT.image,
      qty: qty
    });
  }
  updateCartBtn();
  showToast(PRODUCT.name + ' (' + PRODUCT.color + ') added to cart');

  var btn = document.getElementById('addBtn');
  btn.classList.add('added', 'pulse');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg> Added!';
  setTimeout(function() {
    btn.classList.remove('added', 'pulse');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> Add to Cart';
  }, 1400);

  openDrawer();
  renderCart();
});

// â”€â”€â”€ DRAWER â”€â”€â”€
function openDrawer() {
  document.getElementById('overlay').classList.add('open');
  document.getElementById('drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
  showPanel('cart');
}
function closeDrawer() {
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('drawer').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('overlay').addEventListener('click', closeDrawer);
document.getElementById('closeDrawer').addEventListener('click', closeDrawer);
document.getElementById('closeCheckout').addEventListener('click', closeDrawer);
document.getElementById('cartBtn').addEventListener('click', function() {
  openDrawer();
  renderCart();
});
document.getElementById('continueShopping').addEventListener('click', function(e) {
  e.preventDefault(); closeDrawer();
});

function showPanel(name) {
  document.getElementById('panelCart').style.display     = name === 'cart'     ? 'flex'  : 'none';
  document.getElementById('panelCheckout').style.display = name === 'checkout' ? 'flex'  : 'none';
  document.getElementById('panelConfirm').style.display  = name === 'confirm'  ? 'flex'  : 'none';
  if (name === 'checkout') {
    document.getElementById('panelCheckout').classList.add('on');
    renderCheckoutSummary();
  }
}

// â”€â”€â”€ RENDER CART â”€â”€â”€
function renderCart() {
  var body = document.getElementById('cartItems');
  var foot = document.getElementById('cartFoot');
  var sum  = document.getElementById('cartSummary');

  if (cart.length === 0) {
    body.innerHTML = '<div class="empty-cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="56" height="56" style="margin:0 auto 16px"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg><p>Your cart is empty.<br>Add the Smart Energy Meter above.</p></div>';
    foot.style.display = 'none';
    return;
  }

  body.innerHTML = cart.map(function(item) {
    return [
      '<div class="cart-item" data-id="' + item.id + '">',
        '<div class="ci-img"><img src="' + item.image + '" alt="' + item.name + '"></div>',
        '<div class="ci-info">',
          '<div class="ci-name">' + item.name + '</div>',
          '<div class="ci-price">' + item.price + ' SAR each</div>',
          '<div class="ci-qty" style="margin-top:8px">',
            '<button class="ci-qb" data-action="minus" data-id="' + item.id + '">âˆ’</button>',
            '<input class="ci-qn" type="number" value="' + item.qty + '" min="1" data-id="' + item.id + '" readonly>',
            '<button class="ci-qb" data-action="plus" data-id="' + item.id + '">+</button>',
          '</div>',
        '</div>',
        '<div class="ci-right">',
          '<span class="ci-total">' + (item.price * item.qty) + ' SAR</span>',
          '<button class="ci-remove" data-id="' + item.id + '">',
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            'Remove',
          '</button>',
        '</div>',
      '</div>'
    ].join('');
  }).join('');

  body.querySelectorAll('.ci-qb').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var id = btn.dataset.id;
      var item = cart.find(function(i){ return i.id === id; });
      if (!item) return;
      if (btn.dataset.action === 'minus') {
        item.qty = Math.max(1, item.qty - 1);
      } else {
        item.qty++;
      }
      updateCartBtn();
      renderCart();
    });
  });
  body.querySelectorAll('.ci-remove').forEach(function(btn) {
    btn.addEventListener('click', function() {
      cart = cart.filter(function(i){ return i.id !== btn.dataset.id; });
      updateCartBtn();
      renderCart();
    });
  });

  var subtotal = cartTotal();
  var shipping = subtotal >= 999 ? 0 : 50;
  var fastChk = document.getElementById('fastDelivChk');
  var fastFee = (fastChk && fastChk.checked) ? 30 : 0;
  var total = subtotal + shipping + fastFee;

  var freeNote = subtotal < 999
    ? '<div class="free-ship"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>Free shipping included with your order!</div>'
    : '<div class="free-ship"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>Free shipping + installation included!</div>';

  sum.innerHTML = freeNote + [
    '<div class="sum-row"><span>Subtotal</span><span>' + subtotal + ' SAR</span></div>',
    '<div class="sum-row"><span>Shipping</span><span style="color:' + (shipping===0?'var(--success)':'inherit') + '">' + (shipping===0?'FREE':shipping+' SAR') + '</span></div>',
    (fastFee ? '<div class="sum-row"><span>Fast Delivery</span><span>+30 SAR</span></div>' : ''),
    '<div class="sum-row total"><span>Total</span><span>' + total + ' SAR</span></div>'
  ].join('');

  foot.style.display = 'block';
}

// â”€â”€â”€ CHECKOUT â”€â”€â”€
document.getElementById('toCheckout').addEventListener('click', function() {
  showPanel('checkout');
});
document.getElementById('backToCart').addEventListener('click', function() {
  showPanel('cart');
});

function getShipping() {
  var del = document.querySelector('input[name="delivery"]:checked');
  if (del && del.value === 'express') return 30;
  if (del && del.value === 'sameday') return 99;
  var fastChk = document.getElementById('fastDelivChk');
  if (fastChk && fastChk.checked) return 30;
  return 0;
}

document.addEventListener('DOMContentLoaded', function(){
  var chk = document.getElementById('fastDelivChk');
  if (chk) chk.addEventListener('change', function(){
    renderCart();
    var exp = document.querySelector('input[name="delivery"][value="express"]');
    if (exp && chk.checked) exp.checked = true;
    if (typeof renderCheckoutSummary === 'function') renderCheckoutSummary();
  });
});

function renderCheckoutSummary() {
  var itemsEl  = document.getElementById('coItems');
  var totalsEl = document.getElementById('coTotals');
  var stdPrice = document.getElementById('stdPrice');

  itemsEl.innerHTML = cart.map(function(item) {
    return '<div class="co-mi"><div class="co-mi-img"><img src="' + item.image + '" alt="' + item.name + '"></div><div class="co-mi-name">' + item.name + ' Ã— ' + item.qty + '</div><div class="co-mi-p">' + (item.price*item.qty) + ' SAR</div></div>';
  }).join('');

  var sub = cartTotal(), ship = getShipping(), total = sub + ship;
  if (stdPrice) { stdPrice.textContent = 'FREE'; stdPrice.className = 'opt-price free'; }

  totalsEl.innerHTML = [
    '<div class="co-tr"><span>Subtotal</span><span>' + sub + ' SAR</span></div>',
    '<div class="co-tr"><span>Shipping</span><span style="color:' + (ship===0?'var(--success)':'inherit') + '">' + (ship===0?'FREE':ship+' SAR') + '</span></div>',
    '<div class="co-tr total"><span>Total</span><span>' + total + ' SAR</span></div>'
  ].join('');
}

document.querySelectorAll('input[name="delivery"]').forEach(function(inp) {
  inp.addEventListener('change', renderCheckoutSummary);
});

// â”€â”€â”€ FIELD VALIDATION â”€â”€â”€
var FIELDS = [
  { id:'f_first',   eid:'e_first',   type:'text' },
  { id:'f_last',    eid:'e_last',    type:'text' },
  { id:'f_email',   eid:'e_email',   type:'email' },
  { id:'f_phone',   eid:'e_phone',   type:'text' },
  { id:'f_address', eid:'e_address', type:'text' },
  { id:'f_city',    eid:'e_city',    type:'text' },
  { id:'f_region',  eid:'e_region',  type:'text' }
];

FIELDS.forEach(function(f) {
  var el = document.getElementById(f.id);
  if (el) el.addEventListener('blur', function(){ validateField(f); });
});

function validateField(f) {
  var el = document.getElementById(f.id);
  var er = document.getElementById(f.eid);
  if (!el || !er) return true;
  var val = el.value.trim();
  var bad = f.type === 'email' ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) : val === '';
  el.classList.toggle('err', bad);
  er.classList.toggle('on', bad);
  return !bad;
}

function validateAll() {
  return FIELDS.every(function(f){ return validateField(f); });
}

// â”€â”€â”€ PLACE ORDER â”€â”€â”€
var payLabels = { mada:'Mada', applepay:'Apple Pay', tamara:'Tamara', tabby:'Tabby', cod:'Cash on Delivery' };
var delLabels = { standard:'Standard (3â€“5 days)', express:'Express (1â€“2 days)', sameday:'Same-Day' };

document.getElementById('placeOrderBtn').addEventListener('click', function() {
  if (!validateAll()) {
    var first = document.querySelector('#checkoutForm .err');
    if (first) first.scrollIntoView({ behavior:'smooth', block:'center' });
    showToast('Please fill in all required fields');
    return;
  }
  if (cart.length === 0) { showToast('Your cart is empty'); return; }

  var del = document.querySelector('input[name="delivery"]:checked');
  var pay = document.querySelector('input[name="payment"]:checked');
  var ship = getShipping();
  var sub  = cartTotal();

  var order = {
    num:     'VW-' + Date.now().toString(36).toUpperCase(),
    date:    new Date().toLocaleDateString('en-SA', { year:'numeric', month:'long', day:'numeric' }),
    name:    document.getElementById('f_first').value.trim() + ' ' + document.getElementById('f_last').value.trim(),
    email:   document.getElementById('f_email').value.trim(),
    city:    document.getElementById('f_city').value.trim(),
    region:  document.getElementById('f_region').value,
    address: document.getElementById('f_address').value.trim(),
    delivery: del ? del.value : 'standard',
    payment:  pay ? pay.value : 'mada',
    subtotal: sub, shipping: ship, total: sub + ship,
    items: cart.slice()
  };

  localStorage.setItem('voltwise_last_order', JSON.stringify(order));
  cart = [];
  updateCartBtn();

  showPanel('confirm');
  renderConfirm(order);
});

function renderConfirm(order) {
  var body = document.getElementById('confirmBody');
  var itemsHtml = order.items.map(function(item) {
    return '<div class="cd-row"><span>' + item.name + ' Ã— ' + item.qty + '</span><strong>' + (item.price*item.qty) + ' SAR</strong></div>';
  }).join('');

  body.innerHTML = [
    '<div class="check-anim">',
      '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">',
        '<circle class="check-circle" cx="40" cy="40" r="36"/>',
        '<path class="check-mark" d="M22 42l12 12 24-24"/>',
      '</svg>',
    '</div>',
    '<h2>Order Confirmed!</h2>',
    '<p>Thank you, ' + order.name.split(' ')[0] + '!</p>',
    '<p>A confirmation was sent to <strong>' + order.email + '</strong></p>',
    '<p class="order-num">Order <strong>' + order.num + '</strong> Â· ' + order.date + '</p>',
    '<div class="conf-details">',
      '<h4>Items Ordered</h4>',
      itemsHtml,
      '<div class="cd-row" style="margin-top:8px"><span>Shipping (' + (delLabels[order.delivery]||order.delivery) + ')</span><strong>' + (order.shipping===0?'FREE':order.shipping+' SAR') + '</strong></div>',
      '<div class="cd-row"><span><strong>Total Paid</strong></span><strong>' + order.total + ' SAR</strong></div>',
    '</div>',
    '<div class="conf-details">',
      '<h4>Shipping To</h4>',
      '<div class="cd-row"><span>Name</span><strong>' + order.name + '</strong></div>',
      '<div class="cd-row"><span>Address</span><strong>' + order.address + ', ' + order.city + ', ' + order.region + '</strong></div>',
      '<div class="cd-row"><span>Payment</span><strong>' + (payLabels[order.payment]||order.payment) + '</strong></div>',
    '</div>'
  ].join('');
}

document.getElementById('shopAgainBtn').addEventListener('click', function() {
  closeDrawer();
  window.scrollTo({ top:0, behavior:'smooth' });
});

// â”€â”€â”€ TABS â”€â”€â”€
function switchTab(name) {
  document.querySelectorAll('.tab').forEach(function(t){ t.classList.toggle('on', t.dataset.tab===name); });
  document.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.toggle('on', p.id==='tab-'+name); });
  var el = document.getElementById('tab-'+name);
  if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
}
document.querySelectorAll('.tab').forEach(function(btn) {
  btn.addEventListener('click', function(){ switchTab(btn.dataset.tab); });
});

// â”€â”€â”€ TOAST â”€â”€â”€
function showToast(msg) {
  var wrap = document.getElementById('toastWrap');
  var t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg><span>' + msg + '</span>';
  wrap.appendChild(t);
  setTimeout(function() {
    t.classList.add('out');
    setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 300);
  }, 2700);
}
