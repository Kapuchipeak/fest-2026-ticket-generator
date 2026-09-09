// LocalStorage Persistence Module
function saveCurrentPass() {
  const { total } = calculatePriceTotals();
  const passRecord = {
    id: UserState.ticketId,
    name: UserState.name,
    roll: UserState.roll,
    gender: UserState.gender,
    passTier: FESTIVAL_DATA.passes.find(p => p.id === UserState.selectedPass)?.name,
    total: total.toFixed(0),
    date: new Date().toLocaleDateString()
  };

  const savedPasses = JSON.parse(localStorage.getItem('fest_saved_passes') || '[]');
  savedPasses.push(passRecord);
  localStorage.setItem('fest_saved_passes', JSON.stringify(savedPasses));
  alert('Ticket saved to My Passes!');
}

function renderPassesArchive() {
  const passes = JSON.parse(localStorage.getItem('fest_saved_passes') || '[]');
  const container = document.getElementById('passes-archive-grid');

  if (passes.length === 0) {
    container.innerHTML = `<p class="col-span-full text-center text-gray-500 py-8">No saved passes in local storage.</p>`;
    return;
  }

  container.innerHTML = passes.map(p => {
    const avatarGradient = p.gender === 'Female' ? 'from-pink-500 to-rose-600' : 
                           p.gender === 'Male' ? 'from-cyan-500 to-blue-600' : 
                           'from-purple-500 to-indigo-600';

    return `
      <div class="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div class="flex justify-between items-start">
          <span class="text-xs font-mono text-brand-400 font-bold">${p.id}</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 font-bold uppercase">${p.passTier}</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center shrink-0 border border-white/20">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-sm text-white">${p.name}</h4>
            <p class="text-xs text-gray-400 font-mono">${p.roll}</p>
            <span class="text-[10px] text-gray-400">Gender: <strong class="text-gray-200">${p.gender || 'Other'}</strong></span>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-3 flex justify-between items-center text-xs text-gray-400">
          <span>Paid: <strong class="text-emerald-400 font-bold">₹${p.total}</strong></span>
          <span>${p.date}</span>
        </div>
      </div>
    `;
  }).join('');
}

function clearPassesArchive() {
  if (confirm('Delete all saved passes from localStorage?')) {
    localStorage.removeItem('fest_saved_passes');
    renderPassesArchive();
  }
}