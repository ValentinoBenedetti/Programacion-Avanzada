export function createLoading() {
  const loadingElement = document.createElement('div');
  loadingElement.className = 'loading';
  loadingElement.innerHTML = `
    <div class="spinner"></div>
    <p>Cargando lanzamientos...</p>
  `;
  return loadingElement;
}