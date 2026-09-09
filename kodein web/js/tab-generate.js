// Multi-Step Wizard, Navigation & Catalog Logic
let wizardStep = 1;

// Global Dynamic Avatar Builder
function renderAvatarSVG(gender, containerId = 'avatar-preview-box', sizeClasses = 'w-16 h-16') {
  const target = document.getElementById(containerId);
  if (!target) return;

  const colorGradient = gender === 'Female' ? 'from-pink-500 to-rose-600 border-pink-400' :
                        gender === 'Male' ? 'from-cyan-500 to-blue-600 border-cyan-400' :
                        'from-purple-500 to-indigo-600 border-purple-400';

  target.innerHTML = `
    <div class="${sizeClasses} rounded-2xl bg-gradient-to-br ${colorGradient} border-2 flex items-center justify-center shadow-lg shrink-0">
      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  `;
}

// Global Tab Navigation Manager
function switchTab(tabName) {
  const tabs = ['home', 'generate', 'passes'];
  
  tabs.forEach(tab => {
    const panel = document.getElementById(`panel-${tab}`);
    const btn = document.getElementById(`tab-btn-${tab}`);
    
    if (panel) panel.classList.add('hidden');
    if (btn) {
      btn.classList.remove('text-brand-600', 'bg-brand-50', 'dark:bg-gray-700');
      btn.classList.add('text-gray-600', 'dark:text-gray-300');
    }
  });

  const targetPanel = document.getElementById(`panel-${tabName}`);
  const targetBtn = document.getElementById(`tab-btn-${tabName}`);

  if (targetPanel) targetPanel.classList.remove('hidden');
  if (targetBtn) {
    targetBtn.classList.add('text-brand-600', 'bg-brand-50', 'dark:bg-gray-700');
    targetBtn.classList.remove('text-gray-600', 'dark:text-gray-300');
  }

  if (tabName === 'passes' && typeof renderPassesArchive === 'function') {
    renderPassesArchive();
  }
}

// Global Dark Mode Toggle
function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.classList.toggle('dark');
  const themeIcon = document.getElementById('theme-icon');
  
  if (themeIcon) {
    themeIcon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCatalogOptions();
  attachInputListeners();
  renderAvatarSVG(UserState.gender, 'avatar-preview-box');
});

function renderCatalogOptions(filterQuery = '') {
  const query = filterQuery.toLowerCase().trim();

  // Filter & Render Artists with Persistent Selection Highlight
  const filteredArtists = FESTIVAL_DATA.artists.filter(a => a.name.toLowerCase().includes(query) || a.genre.toLowerCase().includes(query));
  document.getElementById('artists-grid').innerHTML = filteredArtists.map(a => {
    const isSelected = UserState.selectedArtists.includes(a.id);
    const activeClasses = isSelected ? 'border-brand-500 ring-2 ring-brand-500/50 bg-brand-500/10 -translate-y-1' : 'border-gray-800';
    return `
      <div onclick="toggleArtistSelection('${a.id}')" id="artist-card-${a.id}" class="item-card cursor-pointer border rounded-xl p-3 flex items-center gap-3 transition-all duration-200 ${activeClasses}">
        <img src="${a.image}" class="w-12 h-12 rounded-lg object-cover">
        <div class="flex-grow min-w-0">
          <h4 class="font-bold text-sm text-white truncate">${a.name}</h4>
          <p class="text-xs text-gray-400 truncate">${a.genre}</p>
        </div>
      </div>
    `;
  }).join('');

  // Render Food
  document.getElementById('food-list').innerHTML = FESTIVAL_DATA.food.map(f => `
    <div class="item-card flex items-center justify-between border border-gray-800 rounded-xl p-3">
      <div>
        <h4 class="font-bold text-sm text-white">${f.name}</h4>
        <p class="text-xs text-brand-400 font-semibold">₹${f.price}</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="updateFoodItemQty('${f.id}', -1)" class="w-7 h-7 rounded bg-gray-800 hover:bg-gray-700 font-bold text-sm text-white transition">-</button>
        <span id="food-qty-${f.id}" class="text-sm font-bold w-4 text-center text-white">${UserState.foodQty[f.id] || 0}</span>
        <button onclick="updateFoodItemQty('${f.id}', 1)" class="w-7 h-7 rounded bg-gray-800 hover:bg-gray-700 font-bold text-sm text-white transition">+</button>
      </div>
    </div>
  `).join('');

  // Filter & Render Games with Highlight States
  const filteredGames = FESTIVAL_DATA.games.filter(g => g.name.toLowerCase().includes(query));
  document.getElementById('games-list').innerHTML = filteredGames.map(g => {
    const isSelected = UserState.selectedGames.includes(g.id);
    const activeClasses = isSelected ? 'border-brand-500 ring-2 ring-brand-500/50 bg-brand-500/10 -translate-y-0.5' : 'border-gray-800';
    return `
      <div onclick="toggleGameSelection('${g.id}')" id="game-card-${g.id}" class="item-card cursor-pointer border rounded-xl p-3 flex justify-between items-center transition-all duration-200 ${activeClasses}">
        <div>
          <h4 class="font-bold text-sm text-white">${g.name}</h4>
          <p class="text-xs text-brand-400 font-semibold">₹${g.price}</p>
        </div>
        <i id="game-icon-${g.id}" data-lucide="${isSelected ? 'check-circle-2' : 'circle'}" class="w-5 h-5 ${isSelected ? 'text-brand-400' : 'text-gray-500'}"></i>
      </div>
    `;
  }).join('');

  // Render Passes with Persistent Outward Lift State
  document.getElementById('pass-grid').innerHTML = FESTIVAL_DATA.passes.map(p => {
    const isSelected = UserState.selectedPass === p.id;
    const activeClasses = isSelected 
      ? 'border-brand-500 ring-2 ring-brand-500/60 -translate-y-2.5 scale-[1.03] shadow-xl shadow-brand-500/20 bg-brand-500/10' 
      : 'border-gray-800 hover:-translate-y-1';
    return `
      <div onclick="selectPassTier('${p.id}')" id="pass-card-${p.id}" class="cursor-pointer border-2 rounded-2xl p-4 transition-all duration-300 space-y-2 ${activeClasses}">
        <h4 class="font-extrabold text-md text-white">${p.name}</h4>
        <p class="text-2xl font-black text-brand-400">₹${p.price}</p>
        <p class="text-xs text-gray-400">${p.desc}</p>
      </div>
    `;
  }).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function attachInputListeners() {
  document.getElementById('input-name').addEventListener('input', e => UserState.name = e.target.value.trim());
  document.getElementById('input-roll').addEventListener('input', e => UserState.roll = e.target.value.trim());
  
  const genderSelect = document.getElementById('input-gender');
  if (genderSelect) {
    genderSelect.addEventListener('change', e => {
      UserState.gender = e.target.value;
      renderAvatarSVG(UserState.gender, 'avatar-preview-box');
    });
  }

  const filterSearch = document.getElementById('filter-search');
  if (filterSearch) {
    filterSearch.addEventListener('input', e => renderCatalogOptions(e.target.value));
  }
}

function toggleArtistSelection(id) {
  const idx = UserState.selectedArtists.indexOf(id);
  if (idx > -1) UserState.selectedArtists.splice(idx, 1);
  else UserState.selectedArtists.push(id);

  const el = document.getElementById(`artist-card-${id}`);
  if (el) {
    const isSelected = UserState.selectedArtists.includes(id);
    el.className = `item-card cursor-pointer border rounded-xl p-3 flex items-center gap-3 transition-all duration-200 ${
      isSelected ? 'border-brand-500 ring-2 ring-brand-500/50 bg-brand-500/10 -translate-y-1' : 'border-gray-800'
    }`;
  }
  syncPriceSummaryUI();
}

function updateFoodItemQty(id, change) {
  const current = UserState.foodQty[id] || 0;
  const next = Math.max(0, current + change);
  UserState.foodQty[id] = next;
  document.getElementById(`food-qty-${id}`).innerText = next;
  syncPriceSummaryUI();
}

function toggleGameSelection(id) {
  const idx = UserState.selectedGames.indexOf(id);
  if (idx > -1) UserState.selectedGames.splice(idx, 1);
  else UserState.selectedGames.push(id);

  const el = document.getElementById(`game-card-${id}`);
  if (el) {
    const isSelected = UserState.selectedGames.includes(id);
    el.className = `item-card cursor-pointer border rounded-xl p-3 flex justify-between items-center transition-all duration-200 ${
      isSelected ? 'border-brand-500 ring-2 ring-brand-500/50 bg-brand-500/10 -translate-y-0.5' : 'border-gray-800'
    }`;
    const icon = document.getElementById(`game-icon-${id}`);
    if (icon) {
      icon.setAttribute('data-lucide', isSelected ? 'check-circle-2' : 'circle');
      icon.className = `w-5 h-5 ${isSelected ? 'text-brand-400' : 'text-gray-500'}`;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }
  syncPriceSummaryUI();
}

function selectPassTier(id) {
  UserState.selectedPass = id;
  FESTIVAL_DATA.passes.forEach(p => {
    const el = document.getElementById(`pass-card-${p.id}`);
    if (el) {
      const isSelected = p.id === id;
      el.className = `cursor-pointer border-2 rounded-2xl p-4 transition-all duration-300 space-y-2 ${
        isSelected 
          ? 'border-brand-500 ring-2 ring-brand-500/60 -translate-y-2.5 scale-[1.03] shadow-xl shadow-brand-500/20 bg-brand-500/10' 
          : 'border-gray-800 hover:-translate-y-1'
      }`;
    }
  });
  syncPriceSummaryUI();
}

function setTicketTheme(themeKey) {
  UserState.selectedTheme = themeKey;

  // Persistent Outward Lift for Theme Select Buttons
  const themes = ['cyberpunk', 'gold', 'sunset'];
  themes.forEach(t => {
    const btn = document.getElementById(`theme-btn-${t}`);
    if (btn) {
      if (t === themeKey) {
        btn.classList.add('border-brand-500', 'ring-2', 'ring-brand-500/60', '-translate-y-1.5', 'scale-105', 'shadow-lg');
        btn.classList.remove('border-gray-800');
      } else {
        btn.classList.remove('border-brand-500', 'ring-2', 'ring-brand-500/60', '-translate-y-1.5', 'scale-105', 'shadow-lg');
        btn.classList.add('border-gray-800');
      }
    }
  });

  const card = document.getElementById('ticket-card');
  if (card) {
    card.className = "rounded-2xl p-6 shadow-2xl relative overflow-hidden border transition-all duration-300 text-white ticket-theme-" + themeKey;
  }
}

function applyCouponCode() {
  const input = document.getElementById('input-coupon').value.trim().toUpperCase();
  const msg = document.getElementById('coupon-message');

  if (FESTIVAL_DATA.coupons[input]) {
    UserState.appliedCoupon = input;
    msg.className = "text-xs font-semibold text-green-500";
    msg.innerText = `Coupon ${input} applied successfully!`;
  } else {
    UserState.appliedCoupon = null;
    msg.className = "text-xs font-semibold text-red-500";
    msg.innerText = "Invalid coupon code.";
  }
  syncPriceSummaryUI();
}

function navigateStep(direction) {
  if (direction === 1 && wizardStep === 1) {
    if (!UserState.name || !UserState.roll || !UserState.gender) {
      alert("Please complete your Personal Details.");
      return;
    }
  }

  wizardStep = Math.max(1, Math.min(4, wizardStep + direction));
  document.getElementById('step-progress').style.width = `${(wizardStep / 4) * 100}%`;

  for (let i = 1; i <= 4; i++) {
    document.getElementById(`form-step-${i}`).classList.toggle('hidden', i !== wizardStep);
  }

  document.getElementById('btn-prev').classList.toggle('invisible', wizardStep === 1);
  document.getElementById('btn-next').innerText = wizardStep === 3 ? 'Generate Ticket' : 'Next Step';
  document.getElementById('btn-next').style.display = wizardStep === 4 ? 'none' : 'block';

  if (wizardStep === 4 && typeof generateTicketCard === 'function') {
    generateTicketCard();
  }
}