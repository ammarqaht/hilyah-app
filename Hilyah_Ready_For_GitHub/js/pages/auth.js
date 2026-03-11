/**
 * Authentication Pages (Student and Admin)
 * Luxury design requested by user.
 */

// Shared auth card layout
const AuthCard = (title, children, bottomLink) => `
    <div class="auth-card" style="animation: slideInRight var(--transition-slow);">
        <div class="auth-logo-container">
            <img src="حلية.svg" alt="Hilyah Logo" class="auth-logo" />
        </div>
        <h2 class="auth-title">${title}</h2>
        ${children}
        <div class="auth-bottom-link mt-8" style="text-align: center;">
            ${bottomLink}
        </div>
    </div>
    
    <!-- Creator Footer for Auth -->
    <footer style="
        position: absolute; bottom: 0; left: 0; right: 0;
        padding: 48px 24px max(32px, calc(16px + env(safe-area-inset-bottom))); 
        display: flex; flex-direction: column; align-items: center; gap: 32px; text-align: center;
    ">
        <img src="حلية.svg" alt="Hilyah Logo" style="height: 72px; width: auto; opacity: 0.9;" />
        <div>
            <div style="font-size:0.85rem; color:var(--text-tertiary); margin-bottom:12px; font-weight:600;">
                تم صناعة هذا النظام بواسطة
            </div>
            <img src="Ammar.png" alt="Ammar Logo" style="height: 48px; width: auto; opacity: 0.85;" />
        </div>
    </footer>
`;

export function LoginPage() {
    return AuthCard(
        "تسجيل دخول الطالب",
        `
        <form id="student-login-form" class="auth-form mt-8">
            <div class="form-group">
                <label class="form-label">اسم الطالب / رقم الهوية</label>
                <input type="text" id="username" class="form-input" placeholder="أدخل اسمك" required />
            </div>
            <div class="form-group">
                <label class="form-label">كلمة المرور</label>
                <input type="password" id="password" class="form-input" placeholder="••••••••" required />
            </div>
            <button type="submit" class="btn btn-primary w-full mt-4" style="padding: 14px; font-size: 1.1rem;">
                دخول
            </button>
        </form>
        `,
        `<a href="#/admin-login" class="text-secondary" style="font-size: 0.9rem;">دخول المشرفين</a>`
    );
}

// Attach event listeners after render
LoginPage.attachEvents = (store) => {
    const form = document.getElementById('student-login-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            // Mock authentication
            store.login({ 
                role: 'student', 
                name: username || 'طالب تجريبي',
                points: 120,
                id: 1 
            });
            window.location.hash = '#/student';
        });
    }
};

export function AdminLoginPage() {
    return AuthCard(
        "تسجيل دخول المشرف",
        `
        <form id="admin-login-form" class="auth-form mt-8">
            <div class="form-group">
                <label class="form-label">اسم المستخدم المشرف</label>
                <input type="text" id="admin-username" class="form-input" placeholder="أدخل اسم المشرف" required />
            </div>
            <div class="form-group">
                <label class="form-label">كلمة المرور</label>
                <input type="password" id="admin-password" class="form-input" placeholder="••••••••" required />
            </div>
            <button type="submit" class="btn btn-primary w-full mt-4" style="padding: 14px; font-size: 1.1rem; background: linear-gradient(135deg, #1A1D20, #5E636A);">
                دخول للإدارة
            </button>
        </form>
        `,
        `<a href="#/login" class="text-secondary" style="font-size: 0.9rem;">العودة لدخول الطلاب</a>`
    );
}

AdminLoginPage.attachEvents = (store) => {
    const form = document.getElementById('admin-login-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('admin-username').value;
            // Mock authentication
            store.login({ 
                role: 'admin', 
                name: username || 'المشرف العام'
            });
            window.location.hash = '#/admin';
        });
    }
};
