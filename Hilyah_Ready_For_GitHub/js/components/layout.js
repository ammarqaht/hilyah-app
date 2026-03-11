import { Icons } from './icons.js';

/**
 * Dashboard Layout — sidebar with visibility-aware student nav + Admin Edit Mode toolbar
 */

export function DashboardLayout(children, user, route, store) {
    const isStudent = user.role === 'student';
    const isAdm = user.role === 'admin';
    const editMode = store.getState().editMode;
    const content = store.getState().content;
    const visibility = store.getState().featureVisibility || {};

    const c = (key, fallback) => content[key] || fallback;

    // ---- Student sidebar links: respect featureVisibility ----
    const studentLinks = [
        { path: '/student', label: c('nav.home', 'الرئيسية'), icon: Icons.Home, always: true },
        { path: '/student/idea', label: c('nav.idea', 'فكرة البرنامج'), icon: Icons.Idea, visKey: 'idea' },
        { path: '/student/calendar', label: c('nav.calendar', 'التقويم'), icon: Icons.Calendar, visKey: 'calendar' },
        { path: '/student/tasks', label: c('nav.tasks', 'المهام'), icon: Icons.Tasks, visKey: 'tasks' },
        { path: '/student/points', label: c('nav.points', 'النقاط'), icon: Icons.Points, visKey: 'points' },
    ].filter(l => l.always || visibility[l.visKey] !== false);

    // ---- Admin sidebar — grouped ----
    const adminLinks = [
        // Group: Overview
        { type: 'link', path: '/admin', label: 'لوحة التحكم', icon: Icons.Home },
        { type: 'link', path: '/admin/points', label: 'النقاط العامة', icon: Icons.Points },
        // Group: Tasks
        { type: 'divider', label: 'إدارة المهام' },
        { type: 'link', path: '/admin/tasks', label: 'المهام المسلّمة', icon: Icons.Tasks },
        { type: 'link', path: '/admin/add-task', label: 'إضافة مهمة', icon: Icons.Idea },
        { type: 'link', path: '/admin/manage-tasks', label: 'إدارة المهام', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>` },
        // Group: Content
        { type: 'divider', label: 'إدارة المحتوى' },
        { type: 'link', path: '/admin/cms', label: 'إدارة المحتوى', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>` },
    ];

    const currentHash = window.location.hash.slice(1);

    const renderLink = (item) => {
        if (item.type === 'divider') {
            return `
                <div style="height: 1px; background: var(--border-color); margin: 12px 16px 8px;"></div>
                <div style="padding: 2px 20px 6px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-tertiary);">${item.label}</div>
            `;
        }
        const isActive = currentHash === item.path;
        return `
            <a href="#${item.path}" class="nav-link ${isActive ? 'active' : ''}" style="
                display: flex; align-items: center; gap: 12px;
                padding: 10px 16px; border-radius: var(--radius-sm);
                color: ${isActive ? 'var(--color-primary)' : 'var(--text-secondary)'};
                background-color: ${isActive ? 'var(--bg-surface-hover)' : 'transparent'};
                font-weight: 500; margin-bottom: 4px;
                transition: all var(--transition-fast); text-decoration: none;
            ">
                <span style="display: flex; align-items: center; justify-content: center; width: 20px; flex-shrink: 0;">
                    ${item.icon}
                </span>
                ${item.label}
            </a>
        `;
    };

    const navItems = isStudent
        ? studentLinks.map(l => ({ type: 'link', ...l }))
        : adminLinks;

    const sidebarHtml = `
        <aside class="sidebar" style="
            width: var(--sidebar-width);
            background-color: var(--bg-surface);
            border-left: 1px solid var(--border-color);
            display: flex; flex-direction: column;
            padding: 24px 0; z-index: 1000;
        ">
            <div class="sidebar-header" style="padding: 0 24px; margin-bottom: 32px; display: flex; align-items: center; justify-content: space-between;">
                <a href="${isStudent ? '#/student' : '#/admin'}" id="sidebar-logo" style="display: flex; align-items: center; gap: 12px; text-decoration: none;">
                    <img src="حلية.svg" alt="Hilyah Logo" style="height: 52px; width: auto;" />
                    <h2 style="font-size: 1.4rem; margin: 0; background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">حِلْيَة</h2>
                </a>
                <button id="theme-toggle" class="btn desktop-only-flex" style="background: var(--bg-main); border: 1px solid var(--border-color); padding: 8px; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); transition: all 0.2s;" title="تبديل المظهر">
                    ${store.getState().theme === 'dark' ? Icons.Sun : Icons.Moon}
                </button>
            </div>
            
            <nav class="sidebar-nav" style="flex: 1; padding: 0 16px; overflow-y: auto;">
                ${navItems.map(renderLink).join('')}
            </nav>
            
            <div class="sidebar-footer" style="padding: 24px 24px max(24px, env(safe-area-inset-bottom)); border-top: 1px solid var(--border-color); margin-top: auto;">
                <div class="user-profile" style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary)); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                        ${user.name.charAt(0)}
                    </div>
                    <div>
                        <div style="font-weight: 500; font-size: 0.95rem;">${user.name}</div>
                        <div style="font-size: 0.8rem; color: var(--text-tertiary);">${isStudent ? 'طالب' : 'مشرف'}</div>
                    </div>
                </div>
                <button id="logout-btn" class="btn" style="width: 100%; justify-content: flex-start; background: rgba(239, 68, 68, 0.08); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.15); padding: 12px 16px; font-weight: 600; font-size: 0.95rem; border-radius: var(--radius-md); transition: all 0.2s;">
                    <span style="margin-left: 8px;">${Icons.Logout}</span> تسجيل الخروج
                </button>
            </div>
        </aside>
    `;

    // Admin: Edit Mode floating toolbar
    const editModeBar = isAdm ? `
        <div id="edit-mode-bar" style="
            position: fixed; bottom: 40px; left: 40px;
            z-index: 9990;
            background: ${editMode ? '#E8C26D' : 'var(--bg-surface)'};
            border: 1px solid ${editMode ? '#C8A24D' : 'var(--border-color)'};
            border-radius: 40px; padding: 12px 24px;
            display: flex; align-items: center; gap: 16px;
            box-shadow: var(--shadow-md); transition: all 0.3s;
        ">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: ${editMode ? '#5CC481' : 'var(--text-tertiary)'};"></div>
            <span style="font-weight: 700; color: ${editMode ? '#6B4C00' : 'var(--text-primary)'}; font-size: 1rem;">
                ${editMode ? '✏️ وضع التعديل نشط' : 'وضع التعديل المباشر'}
            </span>
            <button id="toggle-edit-mode" class="btn" style="
                padding: 8px 20px; border-radius: 20px;
                background: ${editMode ? 'rgba(0,0,0,0.15)' : 'var(--color-primary)'};
                color: ${editMode ? '#6B4C00' : 'white'}; font-weight: 700; border: none;
            ">${editMode ? 'إيقاف التعديل' : 'تفعيل'}</button>
        </div>
        <style>
            ${editMode ? `
            [data-editable] { position:relative; cursor:pointer; outline:2px dashed rgba(232,194,109,0.65); outline-offset:3px; border-radius:4px; transition:outline-color 0.2s; }
            [data-editable]:hover { outline-color:var(--color-primary-light); background:rgba(232,194,109,0.06); }
            [data-editable]::after { content:"✏️"; position:absolute; top:-14px; right:-8px; font-size:11px; background:var(--color-primary-light); padding:1px 6px; border-radius:8px; color:white; pointer-events:none; opacity:0; transition:opacity 0.15s; }
            [data-editable]:hover::after { opacity:1; }
            ` : ''}
        </style>
    ` : '';

    // Inline edit modal
    const editModal = isAdm ? `
        <div id="inline-edit-modal" style="display:none; position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.5); backdrop-filter:blur(6px); align-items:center; justify-content:center;">
            <div style="background:var(--bg-surface); border-radius:var(--radius-xl); padding:40px; width:560px; max-width:90vw; box-shadow:var(--shadow-lg); direction:rtl;">
                <h3 style="margin:0 0 8px; font-size:1.4rem;">تعديل النص</h3>
                <p id="edit-modal-key" style="font-size:0.85rem; color:var(--text-tertiary); margin-bottom:20px;"></p>
                <textarea id="edit-modal-input" style="width:100%; min-height:120px; padding:14px; font-size:1.05rem; font-family:inherit; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--bg-main); color:var(--text-primary); resize:vertical;"></textarea>
                <div style="display:flex; gap:12px; justify-content:flex-end; margin-top:20px;">
                    <button id="edit-modal-cancel" class="btn btn-secondary" style="padding:12px 24px;">إلغاء</button>
                    <button id="edit-modal-save" class="btn btn-primary" style="padding:12px 28px; font-weight:700;">حفظ التغيير</button>
                </div>
            </div>
        </div>
    ` : '';

    const TopBar = () => `
        <header class="top-header mobile-only-flex" style="
            display: flex; align-items: center; justify-content: space-between;
            background-color: var(--bg-main);
            border-bottom: 1px solid var(--border-color);
            position: sticky; top: 0; z-index: 900;
        ">
            <div style="display: flex; align-items: center; gap: 16px;">
                <button id="mobile-menu-btn" class="btn" style="background: none; border: none; padding: 8px; flex-direction: column; gap: 4px; border-radius: 4px;">
                    <span style="display:block; width:22px; height:2px; background:var(--text-primary); border-radius:2px;"></span>
                    <span style="display:block; width:16px; height:2px; background:var(--text-primary); border-radius:2px;"></span>
                    <span style="display:block; width:22px; height:2px; background:var(--text-primary); border-radius:2px;"></span>
                </button>
                <a href="${isStudent ? '#/student' : '#/admin'}" id="header-logo" style="display: flex; align-items: center; gap: 12px; text-decoration: none;">
                    <img src="حلية.svg" alt="Hilyah Logo" style="height: 52px; width: auto;" />
                    <span class="header-brand-text" style="font-weight: 800; font-size: 1.35rem; letter-spacing: -0.01em; background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">حِلْيَة</span>
                </a>
            </div>
            <div style="display: flex; align-items: center; gap: 16px;">
                <button id="theme-toggle-mob" class="btn" style="background: var(--bg-surface-hover); border: 1px solid var(--border-color); padding: 8px; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); transition: all 0.2s;" title="تبديل المظهر">
                    ${store.getState().theme === 'dark' ? Icons.Sun : Icons.Moon}
                </button>
            </div>
        </header>
    `;

    const Footer = () => `
        <div style="position:relative; margin-top: auto; flex-shrink: 0; width: 100%;">
            <!-- Subtle wave or line separator could go here -->
            <div style="height: 1px; width: 80%; margin: 32px auto 0; background: linear-gradient(90deg, transparent, var(--border-color), transparent);"></div>
            
            <footer style="padding:48px 20px 32px; display:flex; flex-direction:column; align-items:center; gap:32px; text-align:center; position:relative; z-index:2; isolation:isolate;">
                <!-- Program Logo Signature -->
                <img src="حلية.svg" alt="Hilyah Logo" style="height: 72px; width: auto; opacity: 0.9;" />
                
                <!-- Creator Credit -->
                <div>
                    <div style="font-size:0.85rem; color:var(--text-tertiary); margin-bottom:12px; font-weight:600;">
                        تم صناعة هذا النظام بواسطة
                    </div>
                    <img src="Ammar.png" alt="Ammar Logo" style="height: 48px; width: auto; opacity: 0.85;" />
                </div>
            </footer>
        </div>
    `;

    return `
        <style>.nav-link:hover:not(.active){background-color:var(--bg-surface-hover);color:var(--text-primary)!important;}</style>
        ${editModeBar}
        ${editModal}
        <!-- Mobile sidebar overlay -->
        <div id="sidebar-overlay" style="pointer-events:none;"></div>
        <div class="dashboard-layout">
            ${sidebarHtml}
            <main class="main-content">
                ${TopBar()}
                <div class="page-container" style="padding:40px; flex: 1 0 auto; display: flex; flex-direction: column;">
                    ${children}
                </div>
                ${Footer()}
            </main>
        </div>
    `;
}

DashboardLayout.attachEvents = (store) => {
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        if (confirm('هل أنت متأكد أنك تريد تسجيل الخروج؟')) {
            store.logout();
        }
    });
    const addThemeToggle = (id) => document.getElementById(id)?.addEventListener('click', () => store.toggleTheme());
    addThemeToggle('theme-toggle');
    addThemeToggle('theme-toggle-mob');
    
    document.getElementById('toggle-edit-mode')?.addEventListener('click', () => store.toggleEditMode());

    // ── Mobile hamburger sidebar ──
    const menuBtn = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebar = document.querySelector('.sidebar');

    const openMenu = () => {
        if (!sidebar) return;
        if (overlay) {
            overlay.style.display = 'block';
            requestAnimationFrame(() => overlay.classList.add('active'));
        }
        sidebar.classList.add('mobile-open');
        // DO NOT add 'open' class to button — user doesn't want the X
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        if (!sidebar) return;
        sidebar.classList.remove('mobile-open');
        document.body.style.overflow = '';
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => { if (!overlay.classList.contains('active')) overlay.style.display = 'none'; }, 340);
        }
    };

    // Hamburger: open only (X is hidden via CSS when open)
    menuBtn?.addEventListener('click', () => {
        if (!sidebar.classList.contains('mobile-open')) openMenu();
    });

    // Tap outside (overlay left-of-sidebar zone) → close
    const handleOverlayClose = (e) => { e.preventDefault(); closeMenu(); };
    overlay?.addEventListener('click',      handleOverlayClose);
    overlay?.addEventListener('touchstart', handleOverlayClose, { passive: false });

    // Nav links (and logos): close sidebar on tap
    // (Removed duplicate touchend to prevent event cancellation/unresponsiveness on mobile)
    document.querySelectorAll('.nav-link, #header-logo, #sidebar-logo').forEach(link => {
        if (!link) return;
        link.addEventListener('click', () => {
            closeMenu();
        });
    });




    if (store.getState().editMode && store.getState().user?.role === 'admin') {
        const modal = document.getElementById('inline-edit-modal');
        const input = document.getElementById('edit-modal-input');
        const keyLabel = document.getElementById('edit-modal-key');
        let currentKey = null;

        document.querySelectorAll('[data-editable]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                currentKey = el.getAttribute('data-editable');
                if (!currentKey) return;
                keyLabel.textContent = `مفتاح النص: ${currentKey}`;
                input.value = store.getState().content[currentKey] || '';
                modal.style.display = 'flex';
                setTimeout(() => input.focus(), 50);
            });
        });

        document.getElementById('edit-modal-save')?.addEventListener('click', () => {
            if (currentKey) { store.updateContent(currentKey, input.value); modal.style.display = 'none'; }
        });
        document.getElementById('edit-modal-cancel')?.addEventListener('click', () => { modal.style.display = 'none'; });
        modal?.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
    }
};
