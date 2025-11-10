import getData from '../utils/getData';

const Character = async () => {
  const id = location.hash.slice(2); // obtiene el id desde la URL
  const launches = await getData();  // devuelve array de lanzamientos
  const launch = launches.find(l => l.id === id);

  if (!launch) {
    return `<div class="Error">Lanzamiento no encontrado</div>`;
  }

  const fallas = launch.failures.length
    ? launch.failures.map(f =>
        `Tiempo: ${f.time ?? "-"} seg, Altitud: ${f.altitude ?? "-"} m, Razón: ${f.reason ?? "-"}`
      ).join('<br>')
    : "Ninguna";

  const view = `
    <div class="Launch-inner">
      <article class="Launch-card">
        <img src="${launch.links.patch.large || 'assets/placeholder.png'}" alt="${launch.name}">
        <h2>${launch.name}</h2>
      </article>

      <article class="Launch-card">
        <h3><b>Vuelo:</b> <span>${launch.flight_number}</span></h3>
        <h3><b>Fecha:</b> <span>${new Date(launch.date_utc).toLocaleString()}</span></h3>
        <p><b>Detalles:</b> ${launch.details ?? "Sin detalles"}</p>
        <p><b>Fallas:</b><br>${fallas}</p>
      </article>
    </div>
  `;

  return view;
};

export default Character;

