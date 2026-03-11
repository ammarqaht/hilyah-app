import { LoginPage, AdminLoginPage } from '../pages/auth.js';
import { DashboardLayout } from '../components/layout.js';
import { StudentDashboard } from '../pages/student/dashboard.js';
import { ProgramIdea } from '../pages/student/idea.js';
import { CalendarView } from '../pages/student/calendar.js';
import { StudentTasks } from '../pages/student/tasks.js';
import { StudentPoints } from '../pages/student/points.js';

import { AdminDashboard } from '../pages/admin/dashboard.js';
import { AdminTasks } from '../pages/admin/tasks.js';
import { AdminAddTask } from '../pages/admin/addTask.js';
import { AdminGeneralPoints } from '../pages/admin/points.js';
import { AdminCMS } from '../pages/admin/cms.js';
import { AdminManageTask } from '../pages/admin/manageTask.js';

const components = {
    'Login': LoginPage,
    'AdminLogin': AdminLoginPage,
    'StudentDashboard': StudentDashboard,
    'ProgramIdea': ProgramIdea,
    'CalendarView': CalendarView,
    'StudentTasks': StudentTasks,
    'StudentPoints': StudentPoints,
    'AdminDashboard': AdminDashboard,
    'AdminTasks': AdminTasks,
    'AdminAddTask': AdminAddTask,
    'AdminGeneralPoints': AdminGeneralPoints,
    'AdminCMS': AdminCMS,
    'AdminManageTask': AdminManageTask,
    'HomeRedirect': () => '<div style="display:none">Redirecting...</div>',
    'NotFound': () => '<div style="text-align:center; padding: 100px;"><h1>404</h1><p>الصفحة غير موجودة</p><a href="#/" class="btn btn-primary mt-4">العودة للرئيسية</a></div>'
};

export function renderApp(rootElement, route, store) {
    if (route.componentName === 'HomeRedirect') {
        const user = store.getState().user;
        if (!user) { window.location.hash = '#/login'; return; }
        window.location.hash = user.role === 'admin' ? '#/admin' : '#/student';
        return;
    }

    const Component = components[route.componentName] || components['NotFound'];
    let html = '';

    if (route.layout === 'dashboard') {
        const user = store.getState().user;
        if (!user) { window.location.hash = '#/login'; return; }
        html = DashboardLayout(Component(store), user, route, store);
    } else {
        html = `<div class="${route.layout === 'auth' ? 'auth-layout' : ''}">${Component(store)}</div>`;
    }

    rootElement.innerHTML = html;

    setTimeout(() => {
        if (typeof Component.attachEvents === 'function') Component.attachEvents(store);
        if (route.layout === 'dashboard' && typeof DashboardLayout.attachEvents === 'function') DashboardLayout.attachEvents(store);
    }, 0);
}
