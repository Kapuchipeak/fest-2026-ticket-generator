// Inventory Data Store
const FESTIVAL_DATA = {
  artists: [
    { 
      id: 'a1', 
      name: 'Seedhe Maut', 
      genre: 'Hip-Hop / Rap', 
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300',
      day: 'Day 1',
      time: '08:30 PM',
      tag: 'Headliner',
      tagBg: 'bg-purple-900/90 text-purple-200 border-purple-500/30'
    },
    { 
      id: 'a2', 
      name: 'Zephyrtone', 
      genre: 'EDM / Pop', 
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300',
      day: 'Day 2',
      time: '08:00 PM',
      tag: 'EDM Night',
      tagBg: 'bg-amber-900/90 text-amber-200 border-amber-500/30'
    },
    { 
      id: 'a3', 
      name: 'Javed Ali', 
      genre: 'Bollywood Sufi', 
      image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300',
      day: 'Day 3',
      time: '08:00 PM',
      tag: 'Sufi Night',
      tagBg: 'bg-pink-900/90 text-pink-200 border-pink-500/30'
    },
    { 
      id: 'a4', 
      name: 'Symphony Fusion', 
      genre: 'Classical Instrumental Ensemble', 
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300',
      day: 'Day 2',
      time: '06:00 PM',
      tag: 'Acoustic',
      tagBg: 'bg-cyan-900/90 text-cyan-200 border-cyan-500/30'
    }
  ],
  food: [
    { id: 'f1', name: 'Gourmet Burger Combo', price: 250 },
    { id: 'f2', name: 'Cheesy Pizza Slice', price: 150 },
    { id: 'f3', name: 'Red Bull Energy Drink', price: 120 }
  ],
  games: [
    { id: 'g1', name: 'Paintball Arena', price: 300 },
    { id: 'g2', name: 'VR Gaming Simulator', price: 200 },
    { id: 'g3', name: 'Go-Karting Lap', price: 400 }
  ],
  passes: [
    { id: 'bronze', name: 'Bronze Pass', price: 499, desc: 'General festival ground entry + Basic access' },
    { id: 'silver', name: 'Silver Pass', price: 999, desc: 'Includes Fan-pit artist access + 1 Free Drink' },
    { id: 'gold', name: 'Gold VIP Pass', price: 1999, desc: 'Full VIP Access + Lounge + Priority Queues' }
  ],
  schedule: [
    { day: 1, time: '05:00 PM', title: 'Battle of Bands (Wildfire)', stage: 'Arena Stage', type: 'Competition' },
    { day: 1, time: '08:30 PM', title: 'Seedhe Maut Pro-Night', stage: 'Main Ground', type: 'Concert' },
    { day: 2, time: '04:00 PM', title: 'Centrifuge Group Dance', stage: 'Auditorium', type: 'Competition' },
    { day: 2, time: '06:00 PM', title: 'Symphony Fusion Performance', stage: 'Open Air Theater', type: 'Concert' },
    { day: 2, time: '08:00 PM', title: 'Zephyrtone EDM Night', stage: 'Main Ground', type: 'Concert' },
    { day: 3, time: '03:00 PM', title: 'Street Play (Nukkad)', stage: 'Open Air Theater', type: 'Dramatics' },
    { day: 3, time: '08:00 PM', title: 'Javed Ali Sufi Night', stage: 'Main Ground', type: 'Concert' }
  ],
  coupons: {
    'FEST20': { discountPercent: 20, desc: '20% Off Total' },
    'FOOD10': { discountPercent: 10, desc: '10% Off' },
    'VIPFREE': { flatDiscount: 200, desc: '₹200 Flat Off' }
  }
};

// Global exports for accessibility across scripts
window.FEST_DATA = FESTIVAL_DATA;
window.ARTISTS = FESTIVAL_DATA.artists;