import { Icons } from '../../components/icons.js';

export function StudentDashboard(store) {
    const state = store.getState();
    const user = state.user || {};
    const c = (key) => state.content[key] || key;
    const vis = state.featureVisibility || {};

    // Built-in dashboard cards — only render visible ones
    const allCards = [
        {
            href: '#/student/idea',
            visKey: 'idea',
            iconBg: 'rgba(232, 194, 109, 0.15)',
            iconColor: 'var(--color-primary-light)',
            iconBorder: 'rgba(232, 194, 109, 0.3)',
            icon: Icons.Idea,
            titleKey: 'فكرة البرنامج',
            descKey: 'card.idea.description'
        },
        {
            href: '#/student/calendar',
            visKey: 'calendar',
            iconBg: 'rgba(92, 196, 129, 0.15)',
            iconColor: 'var(--color-primary)',
            iconBorder: 'rgba(92, 196, 129, 0.3)',
            icon: Icons.Calendar,
            titleKey: 'التقويم',
            descKey: 'card.calendar.description'
        },
        {
            href: '#/student/tasks',
            visKey: 'tasks',
            iconBg: 'rgba(81, 173, 173, 0.15)',
            iconColor: 'var(--color-primary-dark)',
            iconBorder: 'rgba(81, 173, 173, 0.3)',
            icon: Icons.Tasks,
            titleKey: 'المهام',
            descKey: 'card.tasks.description'
        },
        {
            href: '#/student/points',
            visKey: 'points',
            iconBg: 'rgba(255, 167, 38, 0.15)',
            iconColor: '#FFA726',
            iconBorder: 'rgba(255, 167, 38, 0.3)',
            icon: Icons.Points,
            titleKey: 'النقاط',
            descKey: 'card.points.description'
        }
    ].filter(card => vis[card.visKey] !== false);

    const renderDesktopCard = (card) => `
        <a href="${card.href}" class="card card-interactive" style="display: flex; flex-direction: column; text-decoration: none; color: inherit;">
            <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: ${card.iconBg}; color: ${card.iconColor}; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; border: 1px solid ${card.iconBorder};">
                ${card.icon}
            </div>
            <h3 style="font-size: 1.3rem; margin-bottom: 12px;">${c(card.titleKey)}</h3>
            <p style="font-size: 0.95rem; margin: 0; color: var(--text-secondary); line-height: 1.5;">${c(card.descKey)}</p>
        </a>
    `;

    const renderMobileSquareCard = (card) => `
        <a href="${card.href}" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:20px 16px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-decoration:none; color:inherit; box-shadow:var(--shadow-sm); transition:transform 0.2s;">
            <div style="width:52px; height:52px; border-radius:26px; background:${card.iconBg}; color:${card.iconColor}; display:flex; align-items:center; justify-content:center; margin-bottom:12px; border:1px solid ${card.iconBorder};">
                ${card.icon}
            </div>
            <span style="font-weight:700; font-size:0.95rem; color:var(--text-primary); text-align:center;">${c(card.titleKey)}</span>
        </a>
    `;

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            
            <!-- ── DESKTOP LAYOUT ── -->
            <div class="desktop-only">
                <!-- Hero Section -->
                <div class="hero-section" style="
                    background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
                    border-radius: var(--radius-xl);
                    padding: 56px 64px; color: white;
                    display: flex; align-items: center; justify-content: space-between;
                    margin-bottom: 48px;
                    box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.2);
                    position: relative; overflow: hidden;
                ">
                    <div style="position: absolute; top: -50%; right: -10%; width: 400px; height: 400px; background: rgba(255,255,255,0.15); border-radius: 50%; filter: blur(60px); pointer-events: none;"></div>
                    <div style="position: absolute; bottom: -50%; left: 10%; width: 300px; height: 300px; background: rgba(232, 194, 109, 0.25); border-radius: 50%; filter: blur(60px); pointer-events: none;"></div>
                    
                    <!-- Background Logo Watermark -->
                    <div style="position: absolute; top: 50%; right: 5%; transform: translateY(-50%); opacity: 0.12; pointer-events: none; z-index: 0;">
                        <img src="حلية.svg" alt="" style="height: 180px; width: auto; filter: brightness(0) invert(1);" />
                    </div>
                    
                    <div style="position: relative; z-index: 1;">
                        <h1 data-editable="hero.title" style="color: white; font-size: 3rem; margin-bottom: 20px; letter-spacing: -0.02em;">${c('hero.title')} ${user.name || ''} ✨</h1>
                        <p data-editable="hero.subtitle" style="color: rgba(255,255,255,0.9); font-size: 1.2rem; max-width: 600px; line-height: 1.6;">${c('hero.subtitle')}</p>
                        <div style="display: flex; gap: 16px; align-items: center; margin-top: 24px;">
                            <span style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); padding: 10px 20px; border-radius: 30px; font-weight: 500; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">النقاط: ${user.points || 0}</span>
                            <span style="background: rgba(232,194,109,0.2); border: 1px solid rgba(232,194,109,0.4); padding: 10px 20px; border-radius: 30px; font-weight: 500; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); color:#FFF;">المرتبة: الذهبية</span>
                        </div>
                    </div>
                    
                    <div style="position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 16px; flex-shrink: 0;">
                        <div style="
                            width: 180px; height: 180px; border-radius: 50%;
                            background: rgba(255,255,255,0.18); border: 2px solid rgba(255,255,255,0.5);
                            display: flex; align-items: center; justify-content: center;
                            backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
                            box-shadow: 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4);
                        ">
                            <img src="حلية.svg" alt="Hilyah Logo" style="height: 130px; width: auto; filter: brightness(0) invert(1) drop-shadow(0 4px 12px rgba(0,0,0,0.3));" />
                        </div>
                        <div style="
                            background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.35);
                            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                            border-radius: 30px; padding: 8px 28px; color: white;
                            font-size: 1.2rem; font-weight: 700;
                        ">حِلْيَة</div>
                    </div>
                </div>

                <!-- Navigation Cards -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
                    <h2 data-editable="dashboard.guide.title" style="font-size: 1.75rem; margin: 0;">${c('dashboard.guide.title')}</h2>
                </div>
                
                ${allCards.length > 0 ? `
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px;">
                        ${allCards.map(renderDesktopCard).join('')}
                    </div>
                ` : `
                    <div style="text-align:center; padding:80px; color:var(--text-tertiary);">
                        <div style="font-size:3rem; margin-bottom:16px;">⚙️</div>
                        <p style="font-size:1.1rem;">جميع الأقسام مخفية حالياً. تواصل مع المشرف.</p>
                    </div>
                `}
            </div>

            <!-- ── MOBILE LAYOUT (App-like) ── -->
            <div class="mobile-only">
                <!-- Compact Welcome Card -->
                <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-sm); margin-bottom:24px; position:relative; overflow:hidden;">
                    <!-- Subtle accent bar -->
                    <div style="position:absolute; top:0; right:0; width:4px; height:100%; background:linear-gradient(to bottom, var(--color-primary-light), var(--color-primary-dark));"></div>
                    
                    <h2 style="font-size:1.25rem; font-weight:800; color:var(--text-primary); margin:0 0 16px 0;">مرحباً بك، <span style="color:var(--color-primary);">${user.name ? user.name.split(' ')[0] : 'أيها المبدع'}</span> ✨</h2>
                    
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div style="display:flex; flex-direction:column; gap:4px;">
                            <span style="font-size:0.8rem; color:var(--text-secondary);">النقاط</span>
                            <span style="font-size:1.1rem; font-weight:800; color:var(--color-primary-light);">${user.points || 0} 🌟</span>
                        </div>
                        <div style="width:1px; height:36px; background:var(--border-color);"></div>
                        <div style="display:flex; flex-direction:column; gap:4px; text-align:left;">
                            <span style="font-size:0.8rem; color:var(--text-secondary);">المرتبة</span>
                            <span style="font-size:1rem; font-weight:700; color:var(--text-primary); background:rgba(232,194,109,0.15); padding:2px 10px; border-radius:12px; white-space:nowrap;">الذهبية</span>
                        </div>
                    </div>
                </div>

                <!-- 2x2 Square Grid -->
                ${allCards.length > 0 ? `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        ${allCards.map(renderMobileSquareCard).join('')}
                    </div>
                ` : `
                    <div style="text-align:center; padding:40px; color:var(--text-tertiary); background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--border-color);">
                        <p style="font-size:1rem; margin:0;">الأقسام مخفية حالياً</p>
                    </div>
                `}
            </div>

        </div>
    `;
}
