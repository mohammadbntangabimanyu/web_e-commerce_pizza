/* ============================================================
   BONUCINI PIZZERIA — script.js  (Full Fix)
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────
   1. HEADER — sticky class saat scroll
   (Header sudah sticky via CSS, ini hanya untuk shadow)
───────────────────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

/* ─────────────────────────────────────────────────────────────
   2. HERO — teks muncul sekali, TIDAK hilang saat kembali ke atas
   FIX: pakai "from" bukan "to", sehingga animasi hanya
   berjalan sekali ke depan dan tidak di-reverse.
   Hero text TIDAK dianimasikan dengan ScrollTrigger (yang
   menyebabkan hilang permanen). Cukup animasi masuk sekali.
───────────────────────────────────────────────────────────── */
gsap.from('#hero-text', {
  opacity: 0,
  y: 50,
  duration: 1.2,
  delay: 0.2,
  ease: 'power3.out',
  // TIDAK pakai scrollTrigger → tidak akan reverse/hilang
});

/* Bumbu muncul satu per satu dari bawah */
/*gsap.from('.ingredient', {
  opacity: 0,
  y: 80,
  scale: 0.75,
  stagger: 0.08,
  duration: 1,
  delay: 0.3,
  ease: 'back.out(1.3)',
});

/* ─────────────────────────────────────────────────────────────
   3. HERO — SCATTER kanan & kiri saat scroll ke bawah
   FIX:
   - Pakai scrub:true agar animasi bisa balik saat scroll naik
   - tx positif = geser kanan, negatif = kiri
   - Teks hero TIDAK di-scatter (hanya bumbu)
───────────────────────────────────────────────────────────── */
const scatterData = [
  // kiri
  { id: 'ing-chili',      tx: -900, ty: -60,  rot: -60,  side: 'left'  },
  { id: 'ing-flour',      tx: -700, ty: -30,  rot:  30,  side: 'left'  },
  { id: 'ing-egg',        tx: -500, ty: -80,  rot: -25,  side: 'left'  },
  { id: 'ing-sauce',      tx: -300, ty: -50,  rot:  15,  side: 'left'  },
  // kanan
  { id: 'ing-board',      tx:  200, ty: -200, rot:  10,  side: 'right' },
  { id: 'ing-dough',      tx:  350, ty: -60,  rot: -20,  side: 'right' },
  { id: 'ing-mozzarella', tx:  550, ty: -40,  rot:  30,  side: 'right' },
  { id: 'ing-leaf',       tx:  750, ty: -70,  rot: -40,  side: 'right' },
];

scatterData.forEach(({ id, tx, ty, rot }) => {
  const el = document.getElementById(id);
  if (!el) return;

  gsap.to(el, {
    x: tx,
    y: ty,
    rotation: rot,
    opacity: 0,
    scale: 0.5,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '+=1500',
      scrub: 1.5,
      // scrub: true → animasi bisa balik saat scroll naik
    },
  });
});

/* ─────────────────────────────────────────────────────────────
   4. MENU — HORIZONTAL PINNED SCROLL + PIZZA ROLLING
───────────────────────────────────────────────────────────── */
function setupHorizontalScroll() {
  const track  = document.getElementById('menu-track');
  if (!track) return;
  const amount = track.scrollWidth - window.innerWidth + 80;

  gsap.to(track, {
    x: -amount,
    ease: 'none',
    scrollTrigger: {
      trigger: '#menu',
      start: 'top top',
      end: () => `+=${amount + 200}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
    },
  });
}
setupHorizontalScroll();

document.querySelectorAll('.pizza-rolling-img').forEach(img => {
  gsap.to(img, {
    rotation: 360,
    ease: 'none',
    scrollTrigger: {
      trigger: '#menu',
      start: 'top top',
      end: '+=3000',
      scrub: true,
    },
  });
});

/* ─────────────────────────────────────────────────────────────
   5. SECTION REVEALS — fade in saat masuk viewport
───────────────────────────────────────────────────────────── */
const revealEls = [
  '#custom-pizza .section-header',
  '.pizza-canvas-wrap',
  '.custom-controls',
  '.about-text',
  '.chef-img-wrap',
  '.contact-info',
  '.contact-form',
];

revealEls.forEach(sel => {
  const el = document.querySelector(sel);
  if (!el) return;
  gsap.from(el, {
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 82%',
      toggleActions: 'play none none none', // tidak reverse
    },
  });
});

gsap.from('.extra-card, .drink-card', {
  y: 30, stagger: 0.08, duration: 0, ease: 'power2.out'
});


/* ─────────────────────────────────────────────────────────────
   6. DRAWER
───────────────────────────────────────────────────────────── */
function toggleDrawer() {
  const drawer  = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  const isOpen  = drawer.classList.contains('open');

  drawer.classList.toggle('open');
  overlay.classList.toggle('open');
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

/* ─────────────────────────────────────────────────────────────
   7. SEARCH BAR
───────────────────────────────────────────────────────────── */
function toggleSearch() {
  const bar = document.getElementById('search-bar');
  bar.classList.toggle('open');
  if (bar.classList.contains('open')) {
    document.getElementById('search-input').focus();
  }
}

/* ─────────────────────────────────────────────────────────────
   8. ORDER TYPE
───────────────────────────────────────────────────────────── */
let currentOrderType = 'dine-in';

function setOrderType(btn) {
  document.querySelectorAll('.order-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentOrderType = btn.dataset.type;
}

/* ─────────────────────────────────────────────────────────────
   9. CART STATE
───────────────────────────────────────────────────────────── */
let cart        = [];
let customPrice = 45000;

function formatRp(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function addToCart(name, price, img) {
  cart.push({ name, price, img });
  updateCartUI();
  showToast(`✓ ${name} ditambahkan`);
}

function addCustomToCart() {
  const actives = document.querySelectorAll('.topping-btn.active');
  const names   = ['Custom Pizza'];
  actives.forEach(b => names.push(b.querySelector('.t-name').textContent));
  addToCart(names.join(' + '), customPrice, 'aset_pizza_web/menu_custom/base_menu.png');
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  updateCartUI();
}

function updateCartUI() {
  const count   = cart.length;
  const countEl = document.getElementById('cart-count');
  countEl.textContent   = count;
  countEl.style.display = count > 0 ? 'inline-flex' : 'none';

  const total = cart.reduce((s, i) => s + i.price, 0);
  document.getElementById('cart-total').textContent = formatRp(total);

  const listEl = document.getElementById('cart-items-list');

  if (count === 0) {
    listEl.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <p>Keranjangmu kosong</p>
        <p style="margin-top:4px;font-size:.78rem;opacity:.5">Tambahkan pizza favoritmu!</p>
      </div>`;
  } else {
    listEl.innerHTML = cart.map((item, i) => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" onerror="this.src='data:image/svg+xml,<svg/>'">
        <div class="ci-info">
          <div class="ci-name">${item.name}</div>
          <div class="ci-price">${formatRp(item.price)}</div>
        </div>
        <button class="ci-remove" onclick="removeFromCart(${i})">✕</button>
      </div>
    `).join('');
  }
}

/* ─────────────────────────────────────────────────────────────
   10. CUSTOM PIZZA — toggle topping
───────────────────────────────────────────────────────────── */
function toggleTopping(btn) {
  const layerId  = btn.dataset.layer;
  const price    = parseInt(btn.dataset.price);
  const layer    = document.getElementById(layerId);
  const isActive = btn.classList.contains('active');

  if (isActive) {
    btn.classList.remove('active');
    layer.classList.add('hidden');
    layer.classList.remove('visible');
    customPrice -= price;
  } else {
    btn.classList.add('active');
    layer.classList.remove('hidden');
    layer.classList.add('visible');
    customPrice += price;
  }

  document.getElementById('custom-price').textContent = formatRp(customPrice);

  gsap.fromTo('#pizza-canvas',
    { rotation: -2 },
    { rotation: 0, duration: 0.4, ease: 'elastic.out(1,.4)' }
  );
}

/* ─────────────────────────────────────────────────────────────
   11. MODALS
───────────────────────────────────────────────────────────── */
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

/* ─────────────────────────────────────────────────────────────
   12. CHECKOUT + PROGRESS
───────────────────────────────────────────────────────────── */
function checkout() {
  if (cart.length === 0) {
    showToast('⚠️ Keranjang masih kosong!');
    return;
  }

  const payEl  = document.querySelector('input[name="payment"]:checked');
  const payVal = payEl ? payEl.value : 'cash';
  const payMap = { cash: '💵 Cash', qris: '📱 QRIS', bank: '💳 Bank Transfer' };

  closeModal('cart-modal');
  cart = [];
  updateCartUI();

  document.getElementById('order-num').textContent      = Math.floor(1000 + Math.random() * 9000);
  document.getElementById('order-pay-label').textContent = payMap[payVal] || payVal;

  // Sesuaikan step berdasarkan order type
  const step4Icon  = document.getElementById('step4-icon');
  const step4Title = document.getElementById('step4-title');
  const step4Desc  = document.getElementById('step4-desc');
  const step5Icon  = document.getElementById('step5-icon');
  const step5Title = document.getElementById('step5-title');
  const step5Desc  = document.getElementById('step5-desc');

  if (currentOrderType === 'delivery') {
    step4Icon.textContent  = '🛵';
    step4Title.textContent = 'Sedang Diantar Kurir';
    step4Desc.textContent  = 'Pesanan dalam perjalanan ke lokasimu';
    step5Icon.textContent  = '🏠';
    step5Title.textContent = 'Pesanan Tiba!';
    step5Desc.textContent  = 'Selamat menikmati pizzamu 🎉';
  } else if (currentOrderType === 'take-away') {
    step4Icon.textContent  = '📦';
    step4Title.textContent = 'Siap Diambil';
    step4Desc.textContent  = 'Pesananmu siap di counter';
    step5Icon.textContent  = '✅';
    step5Title.textContent = 'Terima Kasih!';
    step5Desc.textContent  = 'Selamat menikmati Bonucini 🍕';
  } else {
    step4Icon.textContent  = '🪑';
    step4Title.textContent = 'Siap di Meja';
    step4Desc.textContent  = 'Pesananmu diantarkan ke mejamu';
    step5Icon.textContent  = '🍽️';
    step5Title.textContent = 'Selamat Menikmati!';
    step5Desc.textContent  = 'Buon appetito! 🇮🇹';
  }

  openModal('progress-modal');
  runProgressSteps();
}

function runProgressSteps() {
  const stepIds  = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5'];
  const percents = [20, 40, 60, 80, 100];
  const delays   = [0, 2000, 4000, 6500, 9000];

  stepIds.forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('done', 'active');
  });
  document.getElementById('progress-bar').style.width = '0%';

  stepIds.forEach((id, i) => {
    setTimeout(() => {
      if (i > 0) {
        const prev = document.getElementById(stepIds[i - 1]);
        prev.classList.remove('active');
        prev.classList.add('done');
      }
      document.getElementById(id).classList.add('active');
      document.getElementById('progress-bar').style.width = percents[i] + '%';

      if (i === stepIds.length - 1) {
        setTimeout(() => {
          document.getElementById(id).classList.remove('active');
          document.getElementById(id).classList.add('done');
          showToast('🎉 Pesanan selesai! Selamat menikmati!');
        }, 1500);
      }
    }, delays[i]);
  });
}

/* ─────────────────────────────────────────────────────────────
   13. SWITCH CHEF
   FIX: button yang aktif harus berubah ke "active-chef" style
───────────────────────────────────────────────────────────── */
function switchChef(src, activeBtnId) {
  const img = document.getElementById('chef-img');

  // Animasi fade out → ganti src → fade in
  gsap.to(img, {
    opacity: 0,
    x: 20,
    duration: 0.28,
    onComplete: () => {
      img.src = src;
      gsap.to(img, { opacity: 1, x: 0, duration: 0.38 });
    },
  });

  // Update tombol active
  document.querySelectorAll('.chef-switch-btn').forEach(btn => {
    btn.classList.remove('active-chef', 'btn-primary');
    btn.classList.add('btn-outline');
  });
  const activeBtn = document.getElementById(activeBtnId);
  if (activeBtn) {
    activeBtn.classList.remove('btn-outline');
    activeBtn.classList.add('btn-primary', 'active-chef');
  }
}

/* ─────────────────────────────────────────────────────────────
   14. CUSTOMER SERVICE
───────────────────────────────────────────────────────────── */
const csReplies = {
  'cek status pesanan': 'Silakan berikan nomor order kamu! Format: BON-XXXX 📋',
  'menu dan harga':     'Menu lengkap kami ada di section "Our Menu". Pizza mulai Rp 48.000! 🍕',
  'menu & harga':       'Menu lengkap kami ada di section "Our Menu". Pizza mulai Rp 48.000! 🍕',
  'jam operasional':    'Kami buka setiap hari Senin–Minggu, pukul 10:00 – 22:00 WIB 😊',
  'default':            'Terima kasih sudah menghubungi kami! Tim akan membalas sebentar lagi 🍕',
};

function toggleCS() {
  document.getElementById('cs-popup').classList.toggle('open');
}

function csQuick(msg) {
  addCSMessage(msg, 'user');
  const key   = msg.toLowerCase().trim();
  const reply = csReplies[key] || csReplies['default'];
  setTimeout(() => addCSMessage(reply, 'bot'), 800);
}

function csSend() {
  const input = document.getElementById('cs-input');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';
  addCSMessage(text, 'user');

  const lower = text.toLowerCase();
  let reply   = csReplies['default'];
  for (const k in csReplies) {
    if (lower.includes(k)) { reply = csReplies[k]; break; }
  }
  setTimeout(() => addCSMessage(reply, 'bot'), 900);
}

function addCSMessage(text, type) {
  const msgs = document.getElementById('cs-messages');
  const div  = document.createElement('div');
  div.className = `cs-msg ${type}`;
  div.innerHTML = `<span>${text}</span>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

/* ─────────────────────────────────────────────────────────────
   15. NEWSLETTER
───────────────────────────────────────────────────────────── */
function subscribeNewsletter() {
  const email = document.getElementById('nl-email').value.trim();
  const agree = document.getElementById('nl-agree').checked;
  if (!email) { showToast('⚠️ Masukkan email kamu dulu!'); return; }
  if (!agree) { showToast('⚠️ Centang persetujuan newsletter!'); return; }
  showToast('✓ Berhasil berlangganan newsletter!');
  document.getElementById('nl-email').value = '';
  document.getElementById('nl-agree').checked = false;
}

/* ─────────────────────────────────────────────────────────────
   16. TOAST
───────────────────────────────────────────────────────────── */
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}