// Ticket Builder, 3D Flip & Confetti FX
function generateTicketCard() {
  const { passObj, total } = calculatePriceTotals();
  UserState.ticketId = 'FEST26-' + Math.floor(100000 + Math.random() * 900000);

  document.getElementById('ticket-name').innerText = UserState.name;
  document.getElementById('ticket-roll').innerText = UserState.roll;
  document.getElementById('ticket-gender-val').innerText = UserState.gender;
  document.getElementById('ticket-id').innerText = UserState.ticketId;

  // Render Dynamic Avatar in Ticket Slot
  renderAvatarSVG(UserState.gender, 'ticket-avatar-slot', 'w-20 h-20');

  document.getElementById('ticket-pass-badge').innerText = passObj.name;
  document.getElementById('ticket-final-price').innerText = `₹${total.toFixed(0)}`;

  const selectedArtistNames = UserState.selectedArtists.map(id => FESTIVAL_DATA.artists.find(a => a.id === id)?.name).join(', ');
  document.getElementById('ticket-artists-list').innerText = selectedArtistNames || 'None Selected';

  const selectedGameNames = UserState.selectedGames.map(id => FESTIVAL_DATA.games.find(g => g.id === id)?.name).join(', ');
  document.getElementById('ticket-activities-list').innerText = selectedGameNames || 'None Selected';

  // Render QR Code
  const qrContainer = document.getElementById('qrcode');
  qrContainer.innerHTML = '';
  new QRCode(qrContainer, {
    text: `TicketID:${UserState.ticketId}|Name:${UserState.name}|Gender:${UserState.gender}`,
    width: 64, height: 64
  });

  // Trigger GSAP 3D Reveal & Canvas Confetti
  if (window.gsap) {
    gsap.fromTo("#ticket-card", 
      { rotateY: -180, scale: 0.8, opacity: 0 },
      { rotateY: 0, scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)" }
    );
  }

  if (window.confetti) {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }
}

function downloadTicketPNG() {
  const ticketNode = document.getElementById('ticket-card');
  html2canvas(ticketNode).then(canvas => {
    const downloadLink = document.createElement('a');
    downloadLink.download = `${UserState.ticketId}_Pass.png`;
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.click();
  });
}