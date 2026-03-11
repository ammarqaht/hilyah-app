import { Icons } from '../../components/icons.js';

/**
 * Admin Content Management — per-feature content editing + visibility toggles
 */

// The 4 controllable platform features
const PLATFORM_FEATURES = [
    {
        key: 'idea',
        icon: Icons.Idea,
        label: 'فكرة البرنامج',
        color: 'rgba(232, 194, 109, 0.15)',
        colorBorder: 'rgba(232, 194, 109, 0.4)',
        colorText: 'var(--color-primary-light)',
        description: 'الصفحة التعريفية التي توضح فلسفة وأهداف البرنامج.',
        contentKeys: [
            { key: 'card.idea.title', label: 'عنوان البطاقة (لوحة الطالب)' },
            { key: 'card.idea.description', label: 'وصف البطاقة (لوحة الطالب)' },
            { key: 'idea.page.title', label: 'عنوان الصفحة' },
            { key: 'idea.main.heading', label: 'العنوان الرئيسي' },
            { key: 'idea.main.heading.highlight', label: 'الجزء المميز من العنوان' },
            { key: 'idea.main.quote', label: 'الاقتباس التعريفي' },
            { key: 'idea.pillar1.title', label: 'ركيزة 1 — العنوان' },
            { key: 'idea.pillar1.description', label: 'ركيزة 1 — الوصف' },
            { key: 'idea.pillar2.title', label: 'ركيزة 2 — العنوان' },
            { key: 'idea.pillar2.description', label: 'ركيزة 2 — الوصف' },
            { key: 'idea.pillar3.title', label: 'ركيزة 3 — العنوان' },
            { key: 'idea.pillar3.description', label: 'ركيزة 3 — الوصف' },
        ]
    },
    {
        key: 'calendar',
        icon: Icons.Calendar,
        label: 'التقويم',
        color: 'rgba(92, 196, 129, 0.15)',
        colorBorder: 'rgba(92, 196, 129, 0.4)',
        colorText: 'var(--color-primary)',
        description: 'صفحة التقويم الأسبوعي للعادات والمهام.',
        contentKeys: [
            { key: 'card.calendar.title', label: 'عنوان البطاقة (لوحة الطالب)' },
            { key: 'card.calendar.description', label: 'وصف البطاقة (لوحة الطالب)' },
            { key: 'calendar.page.title', label: 'عنوان الصفحة' },
            { key: 'calendar.page.subtitle', label: 'وصف الصفحة' },
        ]
    },
    {
        key: 'tasks',
        icon: Icons.Tasks,
        label: 'المهام',
        color: 'rgba(81, 173, 173, 0.15)',
        colorBorder: 'rgba(81, 173, 173, 0.4)',
        colorText: 'var(--color-primary-dark)',
        description: 'صفحة عرض وتسليم المهام للطلاب.',
        contentKeys: [
            { key: 'card.tasks.title', label: 'عنوان البطاقة (لوحة الطالب)' },
            { key: 'card.tasks.description', label: 'وصف البطاقة (لوحة الطالب)' },
            { key: 'tasks.page.title', label: 'عنوان الصفحة' },
            { key: 'tasks.page.subtitle', label: 'وصف الصفحة' },
            { key: 'ui.submit.task', label: 'نص زر تسليم المهمة' },
        ]
    },
    {
        key: 'points',
        icon: Icons.Points,
        label: 'النقاط',
        color: 'rgba(255, 167, 38, 0.15)',
        colorBorder: 'rgba(255, 167, 38, 0.4)',
        colorText: '#FFA726',
        description: 'صفحة تتبع النقاط والإنجازات والترتيب.',
        contentKeys: [
            { key: 'card.points.title', label: 'عنوان البطاقة (لوحة الطالب)' },
            { key: 'card.points.description', label: 'وصف البطاقة (لوحة الطالب)' },
            { key: 'points.page.title', label: 'عنوان الصفحة' },
            { key: 'points.page.subtitle', label: 'وصف الصفحة' },
        ]
    }
];

// Additional hero/general content
const GENERAL_KEYS = [
    { key: 'hero.title', label: 'مقدمة شاشة الترحيب' },
    { key: 'hero.subtitle', label: 'نص شاشة الترحيب' },
    { key: 'dashboard.guide.title', label: 'عنوان قسم البطاقات' },
];

export function AdminCMS(store) {
    const content = store.getState().content;
    const visibility = store.getState().featureVisibility;

    const renderToggle = (featKey, isVisible) => `
        <label class="vis-toggle" data-feat="${featKey}" style="display: flex; align-items: center; gap: 12px; cursor: pointer; user-select: none;">
            <div style="
                position: relative; width: 52px; height: 28px;
                background: ${isVisible ? 'var(--color-primary)' : 'var(--bg-surface-hover)'};
                border-radius: 14px; border: 1px solid ${isVisible ? 'var(--color-primary)' : 'var(--border-color)'};
                transition: all 0.3s;
            ">
                <div style="
                    position: absolute; top: 3px; 
                    ${isVisible ? 'left: 26px' : 'left: 3px'};
                    width: 20px; height: 20px; background: white; border-radius: 50%;
                    transition: all 0.3s; box-shadow: 0 1px 4px rgba(0,0,0,0.25);
                "></div>
            </div>
            <span style="font-weight: 600; font-size: 0.95rem; color: ${isVisible ? 'var(--color-primary)' : 'var(--text-tertiary)'};">
                ${isVisible ? 'ظاهر للطلاب' : 'مخفي مؤقتاً'}
            </span>
        </label>
    `;

    const renderFeaturePanel = (feat) => {
        const isVisible = visibility[feat.key] !== false;
        return `
            <div class="card" style="padding: 0; overflow: hidden; border-radius: var(--radius-xl);" id="feat-panel-${feat.key}">
                <!-- Feature Header -->
                <div style="
                    padding: 28px 36px; background: var(--bg-surface-hover);
                    border-bottom: 1px solid var(--border-color);
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 16px;
                ">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div style="
                            width: 48px; height: 48px; border-radius: var(--radius-sm);
                            background: ${feat.color}; color: ${feat.colorText};
                            border: 1px solid ${feat.colorBorder};
                            display: flex; align-items: center; justify-content: center;
                        ">
                            ${feat.icon}
                        </div>
                        <div>
                            <h3 style="margin: 0; font-size: 1.25rem;">${feat.label}</h3>
                            <p style="margin: 4px 0 0; color: var(--text-secondary); font-size: 0.9rem;">${feat.description}</p>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <!-- Visibility toggle -->
                        ${renderToggle(feat.key, isVisible)}
                        <!-- Expand/collapse -->
                        <button class="btn feat-expand-btn" data-feat="${feat.key}" style="
                            padding: 8px 18px; background: transparent;
                            border: 1px solid var(--border-color); font-weight: 600;
                            color: var(--text-secondary);
                        ">تعديل المحتوى</button>
                    </div>
                </div>

                <!-- Content editing rows (collapsed by default) -->
                <div class="feat-content-rows" data-feat="${feat.key}" style="display: none;">
                    ${feat.contentKeys.map(ck => `
                        <div style="
                            display: grid; grid-template-columns: 220px 1fr auto;
                            align-items: start; gap: 16px;
                            padding: 18px 36px; border-bottom: 1px solid var(--border-color);
                            transition: background var(--transition-fast);
                        " onmouseover="this.style.background='var(--bg-main)'" onmouseout="this.style.background='transparent'">
                            <div style="padding-top: 10px; font-size: 0.95rem; font-weight: 500; color: var(--text-secondary);">${ck.label}</div>
                            <textarea class="cms-input form-input" data-key="${ck.key}" rows="2"
                                style="width: 100%; resize: vertical; font-size: 0.95rem; font-family: inherit; padding: 10px 14px; line-height: 1.5;">${content[ck.key] || ''}</textarea>
                            <div style="display: flex; gap: 8px; padding-top: 6px; flex-shrink: 0;">
                                <button class="btn cms-save-btn" data-key="${ck.key}"
                                    style="padding: 8px 14px; background: rgba(92,196,129,0.1); color: var(--color-primary); border: 1px solid rgba(92,196,129,0.3); font-weight: 600; white-space: nowrap;">حفظ</button>
                                <button class="btn cms-reset-btn" data-key="${ck.key}"
                                    style="padding: 8px 12px; background: transparent; color: var(--text-tertiary); border: 1px solid var(--border-color);" title="إعادة للافتراضي">↺</button>
                            </div>
                        </div>
                    `).join('')}
                    <div style="padding: 20px 36px; background: var(--bg-main);">
                        <button class="btn cms-save-section-btn" data-feat="${feat.key}"
                            style="padding: 10px 24px; background: var(--color-primary); color: white; border: none; font-weight: 700;">
                            حفظ تعديلات ${feat.label}
                        </button>
                    </div>
                </div>
            </div>
        `;
    };

    // Hidden-feature warning banner
    const hiddenCount = Object.values(visibility).filter(v => v === false).length;

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <!-- Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; flex-wrap: wrap; gap: 16px;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: rgba(92, 196, 129, 0.15); color: var(--color-primary); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(92, 196, 129, 0.3);">
                        ${Icons.Idea}
                    </div>
                    <div>
                        <h1 style="margin: 0; font-size: 2.25rem;">إدارة المحتوى</h1>
                        <p style="margin: 4px 0 0; color: var(--text-secondary); font-size: 1.05rem;">تحكم في محتوى وإظهار كل قسم من أقسام المنصة.</p>
                    </div>
                </div>
            </div>

            ${hiddenCount > 0 ? `
                <div style="padding: 16px 24px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); border-radius: var(--radius-md); margin-bottom: 28px; display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 1.2rem;">⚠️</span>
                    <span style="color: #EF4444; font-weight: 600;">${hiddenCount} قسم مخفي حالياً عن الطلاب</span>
                </div>
            ` : ''}

            <!-- General Content -->
            <div class="card" style="padding: 0; overflow: hidden; border-radius: var(--radius-xl); margin-bottom: 32px;">
                <div style="padding: 24px 36px; background: var(--bg-surface-hover); border-bottom: 1px solid var(--border-color);">
                    <h3 style="margin: 0;">المحتوى العام للمنصة</h3>
                </div>
                ${GENERAL_KEYS.map(ck => `
                    <div style="display: grid; grid-template-columns: 220px 1fr auto; align-items: start; gap: 16px; padding: 18px 36px; border-bottom: 1px solid var(--border-color);" onmouseover="this.style.background='var(--bg-main)'" onmouseout="this.style.background='transparent'">
                        <div style="padding-top: 10px; font-size: 0.95rem; font-weight: 500; color: var(--text-secondary);">${ck.label}</div>
                        <textarea class="cms-input form-input" data-key="${ck.key}" rows="2"
                            style="width: 100%; resize: vertical; font-size: 0.95rem; font-family: inherit; padding: 10px 14px;">${content[ck.key] || ''}</textarea>
                        <div style="display: flex; gap: 8px; padding-top: 6px;">
                            <button class="btn cms-save-btn" data-key="${ck.key}" style="padding: 8px 14px; background: rgba(92,196,129,0.1); color: var(--color-primary); border: 1px solid rgba(92,196,129,0.3); font-weight: 600;">حفظ</button>
                            <button class="btn cms-reset-btn" data-key="${ck.key}" style="padding: 8px 12px; background: transparent; color: var(--text-tertiary); border: 1px solid var(--border-color);" title="إعادة للافتراضي">↺</button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Per-feature panels -->
            <div style="display: flex; flex-direction: column; gap: 24px;">
                ${PLATFORM_FEATURES.map(f => renderFeaturePanel(f)).join('')}
            </div>

            <!-- Save toast -->
            <div id="cms-toast" style="display: none; position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); background: var(--color-primary); color: white; padding: 14px 28px; border-radius: 30px; font-weight: 600; z-index: 9999; box-shadow: var(--shadow-md); white-space: nowrap;">
                ✓ تم حفظ التغييرات
            </div>
        </div>
    `;
}

AdminCMS.attachEvents = (store) => {
    const showToast = (msg = '✓ تم الحفظ') => {
        const t = document.getElementById('cms-toast');
        if (!t) return;
        t.textContent = msg;
        t.style.display = 'block';
        setTimeout(() => { t.style.display = 'none'; }, 2500);
    };

    // Individual save
    document.querySelectorAll('.cms-save-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-key');
            const inp = document.querySelector(`.cms-input[data-key="${key}"]`);
            if (inp) { store.updateContent(key, inp.value); showToast(`✓ تم حفظ: ${key.split('.').pop()}`); }
        });
    });

    // Individual reset
    document.querySelectorAll('.cms-reset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-key');
            if (confirm('إعادة هذا النص للقيمة الافتراضية؟')) {
                store.resetContent(key);
                const inp = document.querySelector(`.cms-input[data-key="${key}"]`);
                if (inp) inp.value = store.getState().content[key] || '';
                showToast('↺ تمت إعادة التعيين');
            }
        });
    });

    // Save whole section
    document.querySelectorAll('.cms-save-section-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const featKey = btn.getAttribute('data-feat');
            const rows = document.querySelectorAll(`.feat-content-rows[data-feat="${featKey}"] .cms-input`);
            const updates = {};
            rows.forEach(inp => { updates[inp.getAttribute('data-key')] = inp.value; });
            store.batchUpdateContent(updates);
            showToast('✓ تم حفظ تعديلات القسم');
        });
    });

    // Expand/collapse content rows
    document.querySelectorAll('.feat-expand-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const featKey = btn.getAttribute('data-feat');
            const rows = document.querySelector(`.feat-content-rows[data-feat="${featKey}"]`);
            const isOpen = rows.style.display !== 'none';
            rows.style.display = isOpen ? 'none' : 'block';
            btn.textContent = isOpen ? 'تعديل المحتوى' : 'إغلاق';
        });
    });

    // Visibility toggles
    document.querySelectorAll('.vis-toggle').forEach(label => {
        label.addEventListener('click', () => {
            const featKey = label.getAttribute('data-feat');
            const current = store.getState().featureVisibility[featKey] !== false;
            store.setFeatureVisibility(featKey, !current);
            showToast(!current ? `✓ تم إظهار "${featKey}" للطلاب` : `⚠️ تم إخفاء "${featKey}" عن الطلاب`);
            // Re-render just this panel by re-dispatching hashchange
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        });
    });
};
