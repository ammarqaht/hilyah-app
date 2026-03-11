/**
 * Custom Hash-based Router
 * Hash-based routing is chosen because it requires no server configuration,
 * making it perfect for native HTML/JS projects.
 */
class Router {
    constructor() {
        this.routes = [];
        this.currentRoute = null;
        this.subscribers = [];
        this.params = {};
    }

    init() {
        // Listen to hash changes
        window.addEventListener('hashchange', () => this.handleHashChange());
        
        // Handle initial load
        if (!window.location.hash) {
            window.location.hash = '#/';
        } else {
            this.handleHashChange();
        }
    }

    addRoute(path, componentName, layout = 'dashboard', meta = {}) {
        this.routes.push({ path, componentName, layout, meta });
    }

    navigate(path) {
        // Remove leading # if included
        if(path.startsWith('#')) path = path.substring(1);
        window.location.hash = `#${path}`;
    }

    getCurrentRoute() {
        const hashPath = window.location.hash.slice(1) || '/';
        
        // Simple match exactly or parameters if we needed them, but we'll stick to simple static matching first.
        let matchedRoute = this.routes.find(r => r.path === hashPath);
        
        if (!matchedRoute) {
            // Default to 404 or index
            matchedRoute = { path: hashPath, componentName: 'NotFound', layout: 'empty', meta: { title: 'Page Not Found' } };
        }

        return matchedRoute;
    }

    handleHashChange() {
        const route = this.getCurrentRoute();
        this.currentRoute = route;
        
        // Notify subscribers
        this.subscribers.forEach(cb => cb(route));
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }
}

export const router = new Router();

// Register all application routes
router.addRoute('/', 'HomeRedirect', 'empty');
router.addRoute('/login', 'Login', 'auth');
router.addRoute('/admin-login', 'AdminLogin', 'auth');

// Student Routes
router.addRoute('/student', 'StudentDashboard', 'dashboard');
router.addRoute('/student/idea', 'ProgramIdea', 'dashboard');
router.addRoute('/student/calendar', 'CalendarView', 'dashboard');
router.addRoute('/student/tasks', 'StudentTasks', 'dashboard');
router.addRoute('/student/points', 'StudentPoints', 'dashboard');

// Admin Routes
router.addRoute('/admin', 'AdminDashboard', 'dashboard');
router.addRoute('/admin/tasks', 'AdminTasks', 'dashboard');
router.addRoute('/admin/add-task', 'AdminAddTask', 'dashboard');
router.addRoute('/admin/points', 'AdminGeneralPoints', 'dashboard');
router.addRoute('/admin/cms', 'AdminCMS', 'dashboard');
router.addRoute('/admin/manage-tasks', 'AdminManageTask', 'dashboard');
