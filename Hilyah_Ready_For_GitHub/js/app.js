import { router } from './core/router.js';
import { store } from './store/state.js';
import { renderApp } from './core/renderer.js';

// Application Entrypoint
class HilyahApp {
  constructor() {
    this.appElement = document.getElementById('app');
    this.init();
  }

  async init() {
    // Check initial route
    router.init();
    
    // Subscribe to route changes
    router.subscribe(this.onRouteChange.bind(this));
    
    // Subscribe to store changes to trigger reactivity
    store.subscribe(() => {
      this.onRouteChange(router.getCurrentRoute());
    });
    
    // Initial Render
    this.onRouteChange(router.getCurrentRoute());
    
    // Add event listeners for global interactive elements
    this.setupGlobalListeners();
  }

  onRouteChange(route) {
    // Render the appropriate layout and page based on state and route
    renderApp(this.appElement, route, store);
  }

  setupGlobalListeners() {
    // Event delegation for internal links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#/"]');
      if (link) {
        e.preventDefault();
        router.navigate(link.getAttribute('href'));
      }
    });
  }
}

// Bootstrap app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new HilyahApp();
});
