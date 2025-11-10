import { createCard } from './components/Card.js';
import { createDetailView } from './components/DetailView.js';
import { createLoading } from './components/Loading.js';
import { fetchLaunches } from './utils/api.js';

export class App {
  constructor() {
    this.launches = [];
    this.currentView = 'home';
    this.currentLaunch = null;
    this.appElement = document.getElementById('app');
    
    this.init();
  }
  
  async init() {
    this.renderLoading();
    await this.loadLaunches();
    this.setupEventListeners();
    this.renderHome();
  }
  
  async loadLaunches() {
    try {
      this.launches = await fetchLaunches();
    } catch (error) {
      this.renderError(error);
    }
  }
  
  setupEventListeners() {
    document.addEventListener('launchSelected', (e) => {
      this.showLaunchDetail(e.detail);
    });
    
    document.addEventListener('viewChange', (e) => {
      if (e.detail === 'home') {
        this.renderHome();
      }
    });
  }
  
  renderLoading() {
    this.appElement.innerHTML = '';
    this.appElement.appendChild(createLoading());
  }
  
  renderError(error) {
    this.appElement.innerHTML = `
      <div class="error">
        <h2>Error al cargar los datos</h2>
        <p>${error.message}</p>
        <button class="back-button" onclick="location.reload()">Reintentar</button>
      </div>
    `;
  }
  
  renderHome() {
    this.currentView = 'home';
    
    const header = document.createElement('header');
    header.innerHTML = `
      <h1>SpaceX Launches</h1>
      <p>Explora los lanzamientos espaciales de SpaceX</p>
    `;
    
    const grid = document.createElement('div');
    grid.className = 'grid';
    
    this.launches.forEach(launch => {
      grid.appendChild(createCard(launch));
    });
    
    this.appElement.innerHTML = '';
    this.appElement.appendChild(header);
    this.appElement.appendChild(grid);
  }
  
  showLaunchDetail(launchId) {
    const launch = this.launches.find(l => l.id === launchId);
    if (!launch) return;
    
    this.currentLaunch = launch;
    this.currentView = 'detail';
    
    this.appElement.innerHTML = '';
    this.appElement.appendChild(createDetailView(launch));
  }
}