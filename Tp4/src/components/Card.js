export function createCard(launch) {
  const card = document.createElement('div');
  card.className = 'card';
  
  const patchImage = launch.links.patch.small || 'https://via.placeholder.com/280x180?text=No+Image';
  const launchName = launch.name || 'Nombre no disponible';
  
  card.innerHTML = `
    <img src="${patchImage}" alt="${launchName}" class="card-img">
    <div class="card-content">
      <h3 class="card-title">${launchName}</h3>
    </div>
  `;
  
  card.addEventListener('click', () => {
    const event = new CustomEvent('launchSelected', { detail: launch.id });
    document.dispatchEvent(event);
  });
  
  return card;
}