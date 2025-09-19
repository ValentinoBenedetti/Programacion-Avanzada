export function createDetailView(launch) {
  const detailView = document.createElement('div');
  
  const patchImage = launch.links.patch.large || launch.links.patch.small || 'https://via.placeholder.com/400x400?text=No+Image';
  const launchName = launch.name || 'Nombre no disponible';
  const flightNumber = launch.flight_number || 'N/A';
  const launchDate = launch.date_utc ? new Date(launch.date_utc).toLocaleString() : 'Fecha no disponible';
  const details = launch.details || 'No hay detalles disponibles para este lanzamiento.';
  
  let failuresHtml = '';
  if (launch.failures && launch.failures.length > 0) {
    failuresHtml = `
      <div class="detail-item">
        <span class="failure">Fallas:</span>
        <ul>
          ${launch.failures.map(failure => `
            <li>Altitud: ${failure.altitude || 'N/A'}, Tiempo: ${failure.time || 'N/A'}, Razón: ${failure.reason || 'Desconocida'}</li>
          `).join('')}
        </ul>
      </div>
    `;
  } else {
    failuresHtml = `
      <div class="detail-item">
        <span class="success">No hubo fallas en este lanzamiento</span>
      </div>
    `;
  }
  
  detailView.innerHTML = `
    <button class="back-button" id="backButton">← Volver al listado</button>
    <div class="detail-view">
      <div class="detail-header">
        <img src="${patchImage}" alt="${launchName}" class="detail-img">
        <div class="detail-info">
          <h2 class="detail-title">${launchName}</h2>
          <div class="detail-item"><strong>Número de vuelo:</strong> ${flightNumber}</div>
          <div class="detail-item"><strong>Fecha y hora de despegue:</strong> ${launchDate}</div>
          ${failuresHtml}
        </div>
      </div>
      <div class="detail-item">
        <strong>Detalles:</strong>
        <p>${details}</p>
      </div>
    </div>
  `;
  
  detailView.querySelector('#backButton').addEventListener('click', () => {
    const event = new CustomEvent('viewChange', { detail: 'home' });
    document.dispatchEvent(event);
  });
  
  return detailView;
}