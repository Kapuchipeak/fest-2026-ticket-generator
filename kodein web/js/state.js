// State & Coupon Engine Logic
const UserState = {
  name: '',
  roll: '',
  gender: 'Other',
  selectedArtists: [],
  foodQty: {},
  selectedGames: [],
  selectedPass: 'bronze',
  selectedTheme: 'cyberpunk',
  appliedCoupon: null,
  ticketId: null
};

// Dynamic Pricing & Discount Engine
function calculatePriceTotals() {
  const passObj = FESTIVAL_DATA.passes.find(p => p.id === UserState.selectedPass) || FESTIVAL_DATA.passes[0];
  const passPrice = passObj.price;
  
  let foodPrice = 0;
  Object.keys(UserState.foodQty).forEach(fId => {
    const item = FESTIVAL_DATA.food.find(f => f.id === fId);
    if (item) foodPrice += item.price * UserState.foodQty[fId];
  });

  let gamesPrice = 0;
  UserState.selectedGames.forEach(gId => {
    const game = FESTIVAL_DATA.games.find(g => g.id === gId);
    if (game) gamesPrice += game.price;
  });

  const subtotal = passPrice + foodPrice + gamesPrice;
  let discountAmount = 0;

  if (UserState.appliedCoupon) {
    const coupon = FESTIVAL_DATA.coupons[UserState.appliedCoupon];
    if (coupon) {
      if (coupon.discountPercent) {
        discountAmount = (subtotal * coupon.discountPercent) / 100;
      } else if (coupon.flatDiscount) {
        discountAmount = coupon.flatDiscount;
      }
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  return { passObj, passPrice, foodPrice, gamesPrice, discountAmount, total: finalTotal };
}

// Global Pricing UI Sync
function syncPriceSummaryUI() {
  const { passObj, passPrice, foodPrice, gamesPrice, discountAmount, total } = calculatePriceTotals();
  
  document.getElementById('summary-pass-name').innerText = passObj.name;
  document.getElementById('summary-pass-price').innerText = `₹${passPrice}`;
  document.getElementById('summary-food-price').innerText = `₹${foodPrice}`;
  document.getElementById('summary-games-price').innerText = `₹${gamesPrice}`;
  
  const discountRow = document.getElementById('summary-discount-row');
  if (discountAmount > 0) {
    discountRow.classList.remove('hidden');
    document.getElementById('summary-discount-price').innerText = `-₹${discountAmount.toFixed(0)}`;
  } else {
    discountRow.classList.add('hidden');
  }

  document.getElementById('summary-total-price').innerText = `₹${total.toFixed(0)}`;
}