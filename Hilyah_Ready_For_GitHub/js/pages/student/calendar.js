import { Icons } from '../../components/icons.js';

/**
 * Interactive Calendar — monthly view
 * Supports:
 *   • Program tasks: schedule admin-created tasks on a specific date
 *   • Personal tasks: create custom tasks tied to a date
 *   • Status: not-started / in-progress / completed per calendar entry
 *   • Visual differentiation: color-coded by task type + status
 */

// ── helpers ──────────────────────────────────────────────────────────────────

const ARABIC_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const ARABIC_DAYS   = ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

// Load / save calendar entries per-user from localStorage
function getCalendarKey(user) {
    return `hilyah_cal_${user?.id || 'guest'}`;
}
function loadEntries(user) {
    try { return JSON.parse(localStorage.getItem(getCalendarKey(user)) || '[]'); }
    catch { return []; }
}
function saveEntries(user, entries) {
    localStorage.setItem(getCalendarKey(user), JSON.stringify(entries));
}

// TRACK colors (for program tasks)
const TRACK_STYLE = {
    'الثقافي':         { bg: 'rgba(232,194,109,0.15)', border: 'rgba(232,194,109,0.5)', accent: '#E8C26D', text: '#C8A24D' },
    'مسار تقني':      { bg: 'rgba(81,173,173,0.15)',  border: 'rgba(81,173,173,0.5)',  accent: '#51ADAD', text: '#3D8F8F' },
    'الذاكرة الحديدية':{ bg: 'rgba(155,114,207,0.15)', border: 'rgba(155,114,207,0.5)', accent: '#9B72CF', text: '#7A52B0' },
    'الاجتماعي':      { bg: 'rgba(92,196,129,0.15)',  border: 'rgba(92,196,129,0.5)',  accent: '#5CC481', text: '#3E9C61' },
};
const PERSONAL_STYLE = { bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.45)', accent: '#FF6B6B', text: '#CC4444' };

const STATUS_CONFIG = {
    'not-started': { label: 'لم تبدأ',    dot: '#94A3B8' },
    'in-progress':  { label: 'قيد التنفيذ', dot: '#FFA726' },
    'completed':    { label: 'مكتملة ✓',   dot: '#5CC481' },
};

// ── render helpers ────────────────────────────────────────────────────────────

function entryBadge(entry) {
    const isPersonal = entry.type === 'personal';
    const s = isPersonal ? PERSONAL_STYLE : (TRACK_STYLE[entry.track] || TRACK_STYLE['الثقافي']);
    const statusDot = STATUS_CONFIG[entry.status || 'not-started']?.dot || '#94A3B8';
    const done = entry.status === 'completed';

    return `
        <div class="cal-entry" data-id="${entry.id}"
            style="
                background: ${s.bg}; border: 1px solid ${s.border};
                border-right: 3px solid ${s.accent};
                border-radius: 8px; padding: 8px 10px;
                margin-bottom: 6px; cursor: pointer;
                transition: transform 0.15s, box-shadow 0.15s;
                opacity: ${done ? '0.6' : '1'};
            "
            onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'"
            onmouseout="this.style.transform='none'; this.style.boxShadow='none'"
        >
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                <div style="width:7px; height:7px; border-radius:50%; background:${statusDot}; flex-shrink:0;"></div>
                <span style="font-size:0.72rem; font-weight:700; color:${s.text}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${isPersonal ? '✎ شخصي' : entry.track}
                </span>
            </div>
            <div style="font-size:0.82rem; font-weight:600; color:var(--text-primary); line-height:1.3; ${done ? 'text-decoration:line-through; opacity:0.7;' : ''}">
                ${entry.title}
            </div>
        </div>
    `;
}

// ── MOBILE CALENDAR ───────────────────────────────────────────────────────────

function renderMobileCalendar(store) {
    const state = store.getState();
    const user  = state.user;
    const content = state.content;
    const c = (k, fb) => content[k] || fb;
    
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    // Use shared state for month/year view to persist selection
    const viewYear  = window._calYear  ?? today.getFullYear();
    const viewMonth = window._calMonth ?? today.getMonth();
    window._calYear  = viewYear;
    window._calMonth = viewMonth;

    const entries = loadEntries(user);
    const programTasks = (state.tasks || []).filter(t => !t.disabled);

    // Filter to selected month
    const monthEntries = entries.filter(e => {
        const [y, m, d] = e.date.split('-');
        return parseInt(y) === viewYear && (parseInt(m) - 1) === viewMonth;
    });

    // Group by date
    const grouped = {};
    monthEntries.forEach(e => {
        if (!grouped[e.date]) grouped[e.date] = [];
        grouped[e.date].push(e);
    });

    // Sort dates
    const sortedDates = Object.keys(grouped).sort();

    let agendaHtml = '';
    if (sortedDates.length === 0) {
        agendaHtml = `
            <div style="text-align:center; padding:64px 24px; color:var(--text-tertiary); background:var(--bg-surface); border-radius:var(--radius-xl); border:1px dashed var(--border-color); margin-top:24px;">
                <div style="font-size:3rem; margin-bottom:16px; opacity:0.8;">📅</div>
                <div style="font-size:1.1rem; font-weight:700; margin-bottom:8px; color:var(--text-primary);">لا توجد مهام في هذا الشهر</div>
                <div style="font-size:0.9rem;">أضف مهامك الشخصية أو جدول مهام البرنامج</div>
            </div>
        `;
    } else {
        agendaHtml = sortedDates.map(dateKey => {
            const isToday = dateKey === todayKey;
            
            const [yStr, mStr, dStr] = dateKey.split('-');
            const dInt = parseInt(dStr);
            const mInt = parseInt(mStr) - 1;
            const dateObj = new Date(parseInt(yStr), mInt, dInt);
            const dayName = ARABIC_DAYS[dateObj.getDay()];
            
            let dateLabel = `${dayName}، ${dInt} ${ARABIC_MONTHS[mInt]}`;
            if (isToday) dateLabel = 'اليوم';
            else {
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                const tmrKey = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth()+1).padStart(2,'0')}-${String(tomorrow.getDate()).padStart(2,'0')}`;
                if (dateKey === tmrKey) dateLabel = 'غدًا';
            }

            return `
                <div style="margin-bottom: 32px;">
                    <div style="font-size: 1.05rem; font-weight: 800; color: ${isToday ? 'var(--color-primary)' : 'var(--text-secondary)'}; margin-bottom: 16px; display:flex; align-items:center; gap:8px;">
                        ${isToday ? `<span style="width:8px; height:8px; border-radius:50%; background:var(--color-primary);"></span>` : ''}
                        ${dateLabel}
                    </div>
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        ${grouped[dateKey].map(entry => {
                            const isPersonal = entry.type === 'personal';
                            const s = isPersonal ? PERSONAL_STYLE : (TRACK_STYLE[entry.track] || TRACK_STYLE['الثقافي']);
                            const statusCfg = STATUS_CONFIG[entry.status || 'not-started'];
                            const done = entry.status === 'completed';
                            return `
                                <div class="mob-task-card cal-entry" data-id="${entry.id}"
                                    style="
                                        background:var(--bg-surface); border:1px solid ${s.border};
                                        border-right:4px solid ${s.accent};
                                        border-radius:16px; padding:20px; cursor:pointer;
                                        opacity:${done ? '0.65' : '1'};
                                        box-shadow:var(--shadow-sm);
                                        transition:transform 0.2s, box-shadow 0.2s;
                                    "
                                >
                                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
                                        <span style="font-size:0.75rem; font-weight:700; color:${s.text}; background:${s.bg}; padding:4px 10px; border-radius:20px;">
                                            ${isPersonal ? '✎ شخصي' : entry.track}
                                        </span>
                                        <div style="display:flex; align-items:center; gap:6px;">
                                            <span style="font-size:0.75rem; font-weight:600; color:var(--text-tertiary);">${statusCfg.label}</span>
                                            <div style="width:8px;height:8px;border-radius:50%;background:${statusCfg.dot};"></div>
                                        </div>
                                    </div>
                                    <div style="font-size:1.05rem; font-weight:700; color:var(--text-primary); ${done ? 'text-decoration:line-through;opacity:0.7;' : ''}">
                                        ${entry.title}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    return `
        <div style="animation:slideUpFade .4s ease; padding-bottom:100px;">
            
            <!-- Month Selector View (Sticky Top) -->
            <div style="position:sticky; top:60px; z-index:90; background:rgba(var(--bg-main-rgb), 0.9); backdrop-filter:blur(12px); border-bottom:1px solid var(--border-color); margin:-24px -16px 24px -16px; padding:16px 24px; display:flex; align-items:center; justify-content:space-between;">
                <button id="cal-prev-month" class="btn" style="padding:8px; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
                    <span style="transform:translateY(-1px);">←</span>
                </button>
                <h2 style="margin:0; font-size:1.25rem; font-weight:800; color:var(--text-primary); letter-spacing:-0.03em;">
                    ${ARABIC_MONTHS[viewMonth]} ${viewYear}
                </h2>
                <button id="cal-next-month" class="btn" style="padding:8px; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
                    <span style="transform:translateY(-1px);">→</span>
                </button>
            </div>

            <!-- Agenda List -->
            <div style="padding:0 8px;">
                ${agendaHtml}
            </div>

            <!-- Fixed Add Button -->
            <div style="position:fixed; bottom:24px; left:24px; z-index:95;">
                <button id="cal-add-personal-btn" class="btn btn-primary" style="width:64px; height:64px; border-radius:32px; box-shadow:0 8px 24px rgba(92,196,129,0.3); font-size:2rem; font-weight:300; display:flex; align-items:center; justify-content:center; padding:0; transition:transform 0.2s;">
                    <span style="transform:translateY(-2px);">+</span>
                </button>
            </div>
        </div>

        <!-- ADD MODAL (reused) -->
        <div id="cal-modal" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.55);backdrop-filter:blur(8px);align-items:center;justify-content:center; padding:16px;">
            <div style="background:var(--bg-surface);border-radius:var(--radius-xl);padding:32px 24px;width:100%;max-width:480px;box-shadow:var(--shadow-lg);direction:rtl;max-height:85vh;overflow-y:auto; transform:translateY(10px); animation:slideUpFade 0.3s forwards;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">
                    <h3 id="modal-title" style="margin:0;font-size:1.3rem;">إضافة مهمة للتقويم</h3>
                    <button id="cal-modal-close" style="background:none;border:none;cursor:pointer;font-size:1.4rem;color:var(--text-tertiary);">✕</button>
                </div>
                <div style="display:flex;gap:0;margin-bottom:24px;border:1px solid var(--border-color);border-radius:var(--radius-sm);overflow:hidden;">
                    <button id="tab-program" class="cal-tab active-tab" data-tab="program" style="flex:1;padding:12px;border:none;cursor:pointer;font-weight:600;font-size:0.92rem;background:var(--color-primary);color:white;transition:all .2s;">مهمة البرنامج</button>
                    <button id="tab-personal" class="cal-tab" data-tab="personal" style="flex:1;padding:12px;border:none;cursor:pointer;font-weight:600;font-size:0.92rem;background:var(--bg-surface-hover);color:var(--text-secondary);transition:all .2s;">مهمة شخصية</button>
                </div>
                <div id="form-program">
                    <div class="form-group">
                        <label class="form-label">اختر المهمة</label>
                        <select id="modal-program-task" class="form-input" style="width:100%;padding:14px 16px; border-radius:12px;">
                            <option value="">-- اختر مهمة من البرنامج --</option>
                            ${programTasks.map(t => `<option value="${t.id}" data-title="${t.title}" data-track="${t.track}">${t.title} — ${t.track}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">التاريخ المخطط التنفيذ فيه</label>
                        <input type="date" id="modal-program-date" class="form-input" style="width:100%;padding:14px 16px; border-radius:12px;" value="${todayKey}" />
                    </div>
                </div>
                <div id="form-personal" style="display:none;">
                    <div class="form-group"><label class="form-label">عنوان المهمة *</label><input type="text" id="modal-personal-title" class="form-input" placeholder="مثال: مراجعة الدروس" style="width:100%;padding:14px 16px; border-radius:12px;" /></div>
                    <div class="form-group"><label class="form-label">الوصف (اختياري)</label><textarea id="modal-personal-desc" class="form-input" rows="2" placeholder="تفاصيل إضافية..." style="width:100%;padding:14px 16px; border-radius:12px; font-family:inherit;resize:vertical;"></textarea></div>
                    <div class="form-group"><label class="form-label">التاريخ *</label><input type="date" id="modal-personal-date" class="form-input" style="width:100%;padding:14px 16px; border-radius:12px;" value="${todayKey}" /></div>
                    <div class="form-group"><label class="form-label">ملاحظات (اختياري)</label><input type="text" id="modal-personal-notes" class="form-input" placeholder="أي تفاصيل إضافية..." style="width:100%;padding:14px 16px; border-radius:12px;" /></div>
                </div>
                <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:16px;">
                    <button id="cal-modal-cancel-btn" class="btn btn-secondary" style="padding:14px 20px; border-radius:12px;">إلغاء</button>
                    <button id="cal-modal-save-btn" class="btn btn-primary" style="padding:14px 28px;font-weight:700; border-radius:12px;">جدولة الآن</button>
                </div>
            </div>
        </div>

        <!-- DETAIL MODAL -->
        <div id="cal-detail-modal" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.55);backdrop-filter:blur(8px);align-items:center;justify-content:center;">
            <div style="background:var(--bg-surface);border-radius:var(--radius-xl);padding:32px 24px;width:95vw;max-width:440px;box-shadow:var(--shadow-lg);direction:rtl;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
                    <h3 id="detail-title" style="margin:0;font-size:1.2rem;"></h3>
                    <button id="detail-close" style="background:none;border:none;cursor:pointer;font-size:1.4rem;color:var(--text-tertiary);">✕</button>
                </div>
                <div id="detail-body" style="margin-bottom:20px;"></div>
                <div style="margin-bottom:20px;">
                    <label class="form-label" style="margin-bottom:12px;display:block;">الحالة</label>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        ${Object.entries(STATUS_CONFIG).map(([k,v]) => `
                            <button class="status-btn btn" data-status="${k}"
                                style="padding:8px 16px;border-radius:20px;font-weight:600;font-size:0.88rem;border:2px solid var(--border-color);background:transparent;color:var(--text-secondary);transition:all .2s;display:flex;align-items:center;gap:6px;">
                                <div style="width:8px;height:8px;border-radius:50%;background:${v.dot};"></div>${v.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div style="display:flex;gap:12px;justify-content:space-between;">
                    <button id="detail-delete-btn" class="btn" style="padding:10px 18px;color:#EF4444;border:1px solid rgba(239,68,68,0.3);background:rgba(239,68,68,0.08);font-weight:600;">حذف</button>
                    <button id="detail-close-btn" class="btn btn-secondary" style="padding:10px 24px;">إغلاق</button>
                </div>
            </div>
        </div>
    `;
}

// ── main component ────────────────────────────────────────────────────────────

export function CalendarView(store) {
    // ── Mobile: use the dedicated mobile calendar ──
    if (window.innerWidth <= 768) {
        return renderMobileCalendar(store);
    }

    // ── Desktop: original monthly grid ───────────────────────────────────────
    const state = store.getState();
    const user  = state.user;
    const content = state.content;
    const c = (k, fb) => content[k] || fb;

    const today  = new Date();
    // Read current month/year from a "global" variable stored on window
    const viewYear  = window._calYear  ?? today.getFullYear();
    const viewMonth = window._calMonth ?? today.getMonth(); // 0-indexed
    window._calYear  = viewYear;
    window._calMonth = viewMonth;

    const entries = loadEntries(user);

    // Program tasks available to schedule (not yet on calendar for that date)
    const programTasks = (state.tasks || []).filter(t => !t.disabled);

    // Build calendar grid
    const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    // Group entries by YYYY-MM-DD key
    const byDate = {};
    entries.forEach(e => { (byDate[e.date] = byDate[e.date] || []).push(e); });

    const dateKey = (d) => `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    // Build cells
    let cells = '';

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        cells += `<div class="cal-cell" style="background:var(--bg-main); opacity:0.35; min-height:120px; border-bottom:1px solid var(--border-color); border-right:1px solid var(--border-color);"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dk = dateKey(d);
        const isToday = dk === todayKey;
        const dayEntries = byDate[dk] || [];

        cells += `
            <div class="cal-cell" data-date="${dk}"
                style="
                    min-height: 120px;
                    padding: 10px 8px;
                    border-bottom: 1px solid var(--border-color);
                    border-right: 1px solid var(--border-color);
                    background: ${isToday ? 'rgba(92,196,129,0.03)' : 'var(--bg-surface)'};
                    cursor: pointer;
                    vertical-align: top;
                    transition: background 0.15s;
                "
                onmouseover="if(!this.querySelector('.cal-entry:hover')) this.style.background='var(--bg-surface-hover)'"
                onmouseout="this.style.background='${isToday ? 'rgba(92,196,129,0.03)' : 'var(--bg-surface)'}'"
            >
                <div style="
                    font-size: 0.9rem; font-weight: ${isToday ? '700' : '500'};
                    color: ${isToday ? 'white' : 'var(--text-secondary)'};
                    background: ${isToday ? 'var(--color-primary)' : 'transparent'};
                    width: 28px; height: 28px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 6px;
                ">${d}</div>
                ${dayEntries.map(e => entryBadge(e)).join('')}
                ${dayEntries.length === 0 ? `<div class="cal-add-hint" style="opacity:0; transition:opacity 0.15s; font-size:0.75rem; color:var(--text-tertiary); text-align:center; padding-top:8px;">+ إضافة</div>` : ''}
            </div>
        `;
    }

    // Upcoming tasks sidebar
    const upcomingEntries = entries
        .filter(e => e.date >= todayKey && e.status !== 'completed')
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 6);

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <!-- Header -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; flex-wrap:wrap; gap:16px;">
                <div style="display:flex; align-items:center; gap:16px;">
                    <div style="width:56px; height:56px; border-radius:var(--radius-md); background:rgba(92,196,129,0.15); color:var(--color-primary); display:flex; align-items:center; justify-content:center; border:1px solid rgba(92,196,129,0.3);">
                        ${Icons.Calendar}
                    </div>
                    <div>
                        <h1 style="margin:0; font-size:2.25rem;">${c('calendar.page.title','التقويم')}</h1>
                        <p style="margin:4px 0 0; color:var(--text-secondary); font-size:1rem;">${c('calendar.page.subtitle','خطط لمهامك وعاداتك شهرياً')}</p>
                    </div>
                </div>
                <button id="cal-add-personal-btn" class="btn btn-primary" style="padding:12px 24px; font-weight:700;">
                    + إضافة مهمة شخصية
                </button>
            </div>

            <!-- Legend -->
            <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px; align-items:center;">
                <span style="font-size:0.85rem; color:var(--text-tertiary); font-weight:600; margin-left:4px;">التصنيف:</span>
                ${Object.entries(TRACK_STYLE).map(([name, s]) => `
                    <div style="display:flex; align-items:center; gap:6px;">
                        <div style="width:10px; height:10px; border-radius:2px; background:${s.accent};"></div>
                        <span style="font-size:0.8rem; color:var(--text-secondary);">${name}</span>
                    </div>
                `).join('')}
                <div style="display:flex; align-items:center; gap:6px;">
                    <div style="width:10px; height:10px; border-radius:2px; background:${PERSONAL_STYLE.accent};"></div>
                    <span style="font-size:0.8rem; color:var(--text-secondary);">مهمة شخصية</span>
                </div>
                <div style="margin-right:auto; display:flex; gap:12px;">
                    ${Object.entries(STATUS_CONFIG).map(([k,v]) => `
                        <div style="display:flex; align-items:center; gap:5px;">
                            <div style="width:8px;height:8px;border-radius:50%;background:${v.dot};"></div>
                            <span style="font-size:0.78rem;color:var(--text-tertiary);">${v.label}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 280px; gap:24px; align-items:start;">
                <!-- Calendar grid -->
                <div class="card" style="padding:0; overflow:hidden; border-radius:var(--radius-xl);">
                    <!-- Month navigation -->
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:20px 28px; border-bottom:1px solid var(--border-color); background:var(--bg-surface-hover);">
                        <button id="cal-prev-month" class="btn" style="padding:8px 16px; background:transparent; border:1px solid var(--border-color);">← السابق</button>
                        <h3 style="margin:0; font-size:1.4rem; font-weight:700;">${ARABIC_MONTHS[viewMonth]} ${viewYear}</h3>
                        <button id="cal-next-month" class="btn" style="padding:8px 16px; background:transparent; border:1px solid var(--border-color);">التالي →</button>
                    </div>
                    <!-- Day of week headers -->
                    <div style="display:grid; grid-template-columns:repeat(7,1fr); background:var(--bg-surface-hover);">
                        ${ARABIC_DAYS.map(d => `
                            <div style="padding:12px 8px; text-align:center; font-size:0.82rem; font-weight:600; color:var(--text-secondary); border-bottom:1px solid var(--border-color); border-right:1px solid var(--border-color);">${d}</div>
                        `).join('')}
                    </div>
                    <!-- Days grid -->
                    <div style="display:grid; grid-template-columns:repeat(7,1fr);">
                        ${cells}
                    </div>
                </div>

                <!-- Sidebar -->
                <div style="display:flex; flex-direction:column; gap:20px; position:sticky; top:20px;">
                    <!-- Today chip -->
                    <div class="card" style="padding:20px 24px;">
                        <div style="font-size:0.8rem; color:var(--text-tertiary); margin-bottom:4px;">اليوم</div>
                        <div style="font-size:1.4rem; font-weight:700; color:var(--color-primary);">
                            ${today.getDate()} ${ARABIC_MONTHS[today.getMonth()]} ${today.getFullYear()}
                        </div>
                    </div>

                    <!-- Upcoming tasks -->
                    <div class="card" style="padding:0; overflow:hidden; border-radius:var(--radius-xl);">
                        <div style="padding:16px 20px; background:var(--bg-surface-hover); border-bottom:1px solid var(--border-color);">
                            <div style="font-weight:700; font-size:1rem;">المهام القادمة</div>
                        </div>
                        <div style="padding:12px;">
                            ${upcomingEntries.length > 0 ? upcomingEntries.map(e => `
                                <div class="sidebar-entry" data-id="${e.id}" style="padding:10px 12px; border-radius:var(--radius-sm); margin-bottom:6px; cursor:pointer; border:1px solid var(--border-color); transition:background 0.15s;"
                                    onmouseover="this.style.background='var(--bg-surface-hover)'"
                                    onmouseout="this.style.background='transparent'">
                                    <div style="font-size:0.8rem; color:var(--text-tertiary); margin-bottom:3px;">${e.date}</div>
                                    <div style="font-size:0.9rem; font-weight:600; color:var(--text-primary);">${e.title}</div>
                                    <div style="display:flex; align-items:center; gap:6px; margin-top:4px;">
                                        <div style="width:6px; height:6px; border-radius:50%; background:${STATUS_CONFIG[e.status||'not-started']?.dot};"></div>
                                        <span style="font-size:0.75rem; color:var(--text-tertiary);">${STATUS_CONFIG[e.status||'not-started']?.label}</span>
                                    </div>
                                </div>
                            `).join('') : `
                                <div style="text-align:center; padding:32px 16px; color:var(--text-tertiary);">
                                    <div style="font-size:2rem; margin-bottom:8px;">📅</div>
                                    <div style="font-size:0.9rem;">لا توجد مهام قادمة</div>
                                </div>
                            `}
                        </div>
                    </div>

                    <!-- Program tasks -->
                    <div class="card" style="padding:0; overflow:hidden; border-radius:var(--radius-xl);">
                        <div style="padding:16px 20px; background:var(--bg-surface-hover); border-bottom:1px solid var(--border-color);">
                            <div style="font-weight:700; font-size:1rem;">مهام البرنامج</div>
                            <div style="font-size:0.8rem; color:var(--text-tertiary); margin-top:2px;">اسحب أو انقر لجدولة مهمة</div>
                        </div>
                        <div style="padding:12px; display:flex; flex-direction:column; gap:6px;">
                            ${programTasks.length > 0 ? programTasks.map(t => {
                                const s = TRACK_STYLE[t.track] || TRACK_STYLE['الثقافي'];
                                return `
                                    <div class="program-task-chip" data-task-id="${t.id}" data-task-title="${t.title}" data-task-track="${t.track}"
                                        style="padding:10px 12px; border-radius:var(--radius-sm); cursor:pointer; background:${s.bg}; border:1px solid ${s.border}; transition:all 0.15s;"
                                        onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='var(--shadow-sm)'"
                                        onmouseout="this.style.transform='none'; this.style.boxShadow='none'">
                                        <div style="font-size:0.75rem; font-weight:700; color:${s.text}; margin-bottom:3px;">${t.track}</div>
                                        <div style="font-size:0.85rem; font-weight:600; color:var(--text-primary);">${t.title}</div>
                                    </div>
                                `;
                            }).join('') : `<div style="text-align:center; padding:20px; color:var(--text-tertiary); font-size:0.9rem;">لا توجد مهام متاحة</div>`}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ADD MODAL -->
        <div id="cal-modal" style="display:none; position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.55); backdrop-filter:blur(8px); align-items:center; justify-content:center;">
            <div style="background:var(--bg-surface); border-radius:var(--radius-xl); padding:48px; width:560px; max-width:92vw; box-shadow:var(--shadow-lg); direction:rtl; max-height:90vh; overflow-y:auto;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:32px;">
                    <h3 id="modal-title" style="margin:0; font-size:1.5rem;">إضافة مهمة</h3>
                    <button id="cal-modal-close" style="background:none; border:none; cursor:pointer; font-size:1.4rem; color:var(--text-tertiary);">✕</button>
                </div>
                <div style="display:flex; gap:0; margin-bottom:28px; border:1px solid var(--border-color); border-radius:var(--radius-sm); overflow:hidden;">
                    <button id="tab-program" class="cal-tab active-tab" data-tab="program" style="flex:1; padding:10px; border:none; cursor:pointer; font-weight:600; font-size:0.95rem; background:var(--color-primary); color:white; transition:all 0.2s;">مهمة البرنامج</button>
                    <button id="tab-personal" class="cal-tab" data-tab="personal" style="flex:1; padding:10px; border:none; cursor:pointer; font-weight:600; font-size:0.95rem; background:var(--bg-surface-hover); color:var(--text-secondary); transition:all 0.2s;">مهمة شخصية</button>
                </div>
                <div id="form-program">
                    <div class="form-group">
                        <label class="form-label">اختر المهمة</label>
                        <select id="modal-program-task" class="form-input" style="width:100%; padding:12px 16px;">
                            <option value="">-- اختر مهمة من البرنامج --</option>
                            ${programTasks.map(t => `<option value="${t.id}" data-title="${t.title}" data-track="${t.track}">${t.title} — ${t.track}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">التاريخ المخطط</label>
                        <input type="date" id="modal-program-date" class="form-input" style="width:100%; padding:12px 16px;" />
                    </div>
                </div>
                <div id="form-personal" style="display:none;">
                    <div class="form-group"><label class="form-label">عنوان المهمة *</label><input type="text" id="modal-personal-title" class="form-input" placeholder="مثال: مراجعة الدروس" style="width:100%; padding:12px 16px;" /></div>
                    <div class="form-group"><label class="form-label">الوصف (اختياري)</label><textarea id="modal-personal-desc" class="form-input" rows="2" placeholder="تفاصيل إضافية..." style="width:100%; padding:12px 16px; font-family:inherit; resize:vertical;"></textarea></div>
                    <div class="form-group"><label class="form-label">التاريخ *</label><input type="date" id="modal-personal-date" class="form-input" style="width:100%; padding:12px 16px;" /></div>
                    <div class="form-group"><label class="form-label">ملاحظات (اختياري)</label><input type="text" id="modal-personal-notes" class="form-input" placeholder="أي تفاصيل إضافية..." style="width:100%; padding:12px 16px;" /></div>
                </div>
                <div style="display:flex; gap:12px; justify-content:flex-end; margin-top:8px;">
                    <button id="cal-modal-cancel-btn" class="btn btn-secondary" style="padding:12px 24px;">إلغاء</button>
                    <button id="cal-modal-save-btn" class="btn btn-primary" style="padding:12px 32px; font-weight:700;">إضافة للتقويم</button>
                </div>
            </div>
        </div>

        <!-- DETAIL MODAL -->
        <div id="cal-detail-modal" style="display:none; position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.55); backdrop-filter:blur(8px); align-items:center; justify-content:center;">
            <div style="background:var(--bg-surface); border-radius:var(--radius-xl); padding:48px; width:480px; max-width:92vw; box-shadow:var(--shadow-lg); direction:rtl;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:28px;">
                    <h3 id="detail-title" style="margin:0; font-size:1.4rem;"></h3>
                    <button id="detail-close" style="background:none; border:none; cursor:pointer; font-size:1.4rem; color:var(--text-tertiary);">✕</button>
                </div>
                <div id="detail-body" style="margin-bottom:28px;"></div>
                <div style="margin-bottom:24px;">
                    <label class="form-label" style="margin-bottom:12px; display:block;">الحالة</label>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        ${Object.entries(STATUS_CONFIG).map(([k,v]) => `
                            <button class="status-btn btn" data-status="${k}"
                                style="padding:8px 18px; border-radius:20px; font-weight:600; font-size:0.9rem; border:2px solid var(--border-color); background:transparent; color:var(--text-secondary); transition:all 0.2s; display:flex; align-items:center; gap:8px;">
                                <div style="width:8px;height:8px;border-radius:50%;background:${v.dot};"></div>
                                ${v.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div style="display:flex; gap:12px; justify-content:space-between;">
                    <button id="detail-delete-btn" class="btn" style="padding:10px 20px; color:#EF4444; border:1px solid rgba(239,68,68,0.3); background:rgba(239,68,68,0.08); font-weight:600;">حذف</button>
                    <button id="detail-close-btn" class="btn btn-secondary" style="padding:10px 24px;">إغلاق</button>
                </div>
            </div>
        </div>
    `;
}

// ── event attachment ──────────────────────────────────────────────────────────

CalendarView.attachEvents = (store) => {
    const user = store.getState().user;
    let entries = loadEntries(user);
    let pendingDate = null;
    let pendingTaskId = null;
    let detailEntryId = null;

    const reRender = () => window.dispatchEvent(new HashChangeEvent('hashchange'));
    const isMobile = window.innerWidth <= 768;

    // ── Add personal task button ──
    document.getElementById('cal-add-personal-btn')?.addEventListener('click', () => {
        const today = new Date();
        const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
        openModal(todayKey, 'personal');
    });

    // Month navigation (works for both mobile and desktop)
    document.getElementById('cal-prev-month')?.addEventListener('click', () => {
        let m = window._calMonth - 1;
        let y = window._calYear;
        if (m < 0) { m = 11; y--; }
        window._calMonth = m; window._calYear = y;
        reRender();
    });
    
    document.getElementById('cal-next-month')?.addEventListener('click', () => {
        let m = window._calMonth + 1;
        let y = window._calYear;
        if (m > 11) { m = 0; y++; }
        window._calMonth = m; window._calYear = y;
        reRender();
    });

    // ── Desktop only: click on day cell ──
    if (!isMobile) {
        document.querySelectorAll('.cal-cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                if (e.target.closest('.cal-entry')) return;
                const date = cell.getAttribute('data-date');
                if (!date) return;
                openModal(date, 'program');
            });
        });

        // Hover hint on empty cells
        document.querySelectorAll('.cal-cell').forEach(cell => {
            const hint = cell.querySelector('.cal-add-hint');
            if (!hint) return;
            cell.addEventListener('mouseenter', () => { hint.style.opacity = '1'; });
            cell.addEventListener('mouseleave', () => { hint.style.opacity = '0'; });
        });
    }

    // ── Touch Threshold Helper ──
    const attachTouchWithThreshold = (el, handler) => {
        let startY = 0;
        let startX = 0;
        let isScrolling = false;
        
        el.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) return; // ignore multi-touch
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
            isScrolling = false;
        }, { passive: true });
        
        el.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1 || isScrolling) return;
            const deltaY = Math.abs(e.touches[0].clientY - startY);
            const deltaX = Math.abs(e.touches[0].clientX - startX);
            // If finger moved more than 10px in any direction, it's a scroll, not a tap.
            if (deltaY > 10 || deltaX > 10) {
                isScrolling = true;
            }
        }, { passive: true });
        
        el.addEventListener('touchend', (e) => {
            if (!isScrolling) {
                // Was a clean tap
                // Only prevent default if it's a confirmed tap, so we don't block normal scrolling
                e.preventDefault();
                handler(e);
            }
        }, { passive: false });
        
        // Also keep standard click for desktop/hybrid
        el.addEventListener('click', handler);
    };

    // ── Program task chip → open modal pre-filled ──
    document.querySelectorAll('.program-task-chip').forEach(chip => {
        const handler = (e) => {
            if(e) e.stopPropagation();
            const taskId = chip.getAttribute('data-task-id');
            openModal(window._calSelectedDate || null, 'program', taskId);
        };
        attachTouchWithThreshold(chip, handler);
    });

    // ── Click on calendar entry → open detail ──
    document.querySelectorAll('.cal-entry, .sidebar-entry').forEach(el => {
        const handler = (e) => {
            if(e) e.stopPropagation();
            const id = parseInt(el.getAttribute('data-id'));
            openDetail(id);
        };
        attachTouchWithThreshold(el, handler);
    });

    // ─────────────────────────────── MODALS ──────────────────────────────────

    const modal       = document.getElementById('cal-modal');
    const detailModal = document.getElementById('cal-detail-modal');

    function openModal(date, tab = 'program', preTaskId = null) {
        pendingDate   = date;
        pendingTaskId = preTaskId;
        if (date) {
            const pd  = document.getElementById('modal-program-date');
            const ppd = document.getElementById('modal-personal-date');
            if (pd)  pd.value  = date;
            if (ppd) ppd.value = date;
        }
        if (preTaskId) {
            const sel = document.getElementById('modal-program-task');
            if (sel) sel.value = preTaskId;
        }
        switchTab(tab);
        modal.style.display = 'flex';
    }

    function switchTab(tab) {
        const isProgram  = tab === 'program';
        const tProgram   = document.getElementById('tab-program');
        const tPersonal  = document.getElementById('tab-personal');
        const fProgram   = document.getElementById('form-program');
        const fPersonal  = document.getElementById('form-personal');
        if (!tProgram) return;
        tProgram.style.background  = isProgram  ? 'var(--color-primary)' : 'var(--bg-surface-hover)';
        tProgram.style.color       = isProgram  ? 'white' : 'var(--text-secondary)';
        tPersonal.style.background = !isProgram ? 'var(--color-primary)' : 'var(--bg-surface-hover)';
        tPersonal.style.color      = !isProgram ? 'white' : 'var(--text-secondary)';
        fProgram.style.display     = isProgram  ? 'block' : 'none';
        fPersonal.style.display    = !isProgram ? 'block' : 'none';
    }

    document.querySelectorAll('.cal-tab').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
    });

    const closeModal = () => { modal.style.display = 'none'; pendingDate = null; pendingTaskId = null; };
    document.getElementById('cal-modal-close')?.addEventListener('click', closeModal);
    document.getElementById('cal-modal-cancel-btn')?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    document.getElementById('cal-modal-save-btn')?.addEventListener('click', () => {
        const fProgram  = document.getElementById('form-program');
        const isProgram = fProgram.style.display !== 'none';

        if (isProgram) {
            const sel    = document.getElementById('modal-program-task');
            const dateEl = document.getElementById('modal-program-date');
            const taskId = parseInt(sel?.value);
            const date   = dateEl?.value;
            if (!taskId || !date) { alert('اختر المهمة والتاريخ'); return; }
            const task = store.getState().tasks.find(t => t.id === taskId);
            if (!task) return;
            entries.push({ id: Date.now(), type: 'program', taskId: task.id, title: task.title, track: task.track, date, status: 'not-started' });
        } else {
            const title = document.getElementById('modal-personal-title')?.value?.trim();
            const desc  = document.getElementById('modal-personal-desc')?.value?.trim();
            const date  = document.getElementById('modal-personal-date')?.value;
            const notes = document.getElementById('modal-personal-notes')?.value?.trim();
            if (!title || !date) { alert('أدخل عنوان المهمة والتاريخ'); return; }
            entries.push({ id: Date.now(), type: 'personal', title, description: desc, date, notes, status: 'not-started' });
        }

        saveEntries(user, entries);
        closeModal();
        reRender();
    });

    // ── Detail modal ──
    function openDetail(id) {
        const entry = entries.find(e => e.id === id);
        if (!entry) return;
        detailEntryId = id;

        document.getElementById('detail-title').textContent = entry.title;
        document.getElementById('detail-body').innerHTML = `
            <div style="display:flex; flex-direction:column; gap:10px; color:var(--text-secondary); font-size:0.95rem;">
                <div>📅 <strong>التاريخ:</strong> ${entry.date}</div>
                ${entry.track ? `<div>📌 <strong>المسار:</strong> ${entry.track}</div>` : ''}
                ${entry.description ? `<div>📝 <strong>الوصف:</strong> ${entry.description}</div>` : ''}
                ${entry.notes ? `<div>💬 <strong>ملاحظات:</strong> ${entry.notes}</div>` : ''}
                <div>🔖 <strong>النوع:</strong> ${entry.type === 'personal' ? 'مهمة شخصية' : 'مهمة برنامج'}</div>
            </div>
        `;

        document.querySelectorAll('.status-btn').forEach(btn => {
            const active = btn.getAttribute('data-status') === (entry.status || 'not-started');
            btn.style.background  = active ? 'var(--color-primary)' : 'transparent';
            btn.style.color       = active ? 'white' : 'var(--text-secondary)';
            btn.style.borderColor = active ? 'var(--color-primary)' : 'var(--border-color)';
        });

        detailModal.style.display = 'flex';
    }

    const closeDetail = () => { detailModal.style.display = 'none'; detailEntryId = null; };
    document.getElementById('detail-close')?.addEventListener('click', closeDetail);
    document.getElementById('detail-close-btn')?.addEventListener('click', closeDetail);
    detailModal?.addEventListener('click', (e) => { if (e.target === detailModal) closeDetail(); });

    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const status = btn.getAttribute('data-status');
            const idx = entries.findIndex(e => e.id === detailEntryId);
            if (idx === -1) return;
            entries[idx].status = status;
            saveEntries(user, entries);
            document.querySelectorAll('.status-btn').forEach(b => {
                const active = b.getAttribute('data-status') === status;
                b.style.background  = active ? 'var(--color-primary)' : 'transparent';
                b.style.color       = active ? 'white' : 'var(--text-secondary)';
                b.style.borderColor = active ? 'var(--color-primary)' : 'var(--border-color)';
            });
        });
    });

    document.getElementById('detail-delete-btn')?.addEventListener('click', () => {
        if (!confirm('حذف هذه المهمة من التقويم؟')) return;
        entries = entries.filter(e => e.id !== detailEntryId);
        saveEntries(user, entries);
        closeDetail();
        reRender();
    });
};
