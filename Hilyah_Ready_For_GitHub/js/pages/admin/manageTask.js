import { Icons } from '../../components/icons.js';

/**
 * Admin Manage Tasks — full CRUD: view, edit, delete, disable/enable tasks
 */

const TRACK_COLORS = {
    'الثقافي': { bg: 'rgba(232,194,109,0.12)', text: 'var(--color-primary-light)', border: 'rgba(232,194,109,0.35)' },
    'مسار تقني': { bg: 'rgba(81,173,173,0.12)', text: 'var(--color-primary-dark)', border: 'rgba(81,173,173,0.35)' },
    'الذاكرة الحديدية': { bg: 'rgba(155,114,207,0.12)', text: '#9B72CF', border: 'rgba(155,114,207,0.35)' },
    'الاجتماعي': { bg: 'rgba(92,196,129,0.12)', text: 'var(--color-primary)', border: 'rgba(92,196,129,0.35)' },
};

const trackBadge = (track) => {
    const c = TRACK_COLORS[track] || { bg: 'var(--bg-surface-hover)', text: 'var(--text-secondary)', border: 'var(--border-color)' };
    return `<span style="background:${c.bg}; color:${c.text}; border:1px solid ${c.border}; padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:600; white-space:nowrap;">${track}</span>`;
};

const statusBadge = (status, disabled) => {
    if (disabled) return `<span style="background:rgba(239,68,68,0.1); color:#EF4444; border:1px solid rgba(239,68,68,0.3); padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:600;">معطّلة</span>`;
    const map = {
        pending: { bg: 'rgba(161,165,171,0.12)', text: 'var(--text-secondary)', border: 'rgba(161,165,171,0.3)', label: 'بانتظار التسليم' },
        submitted: { bg: 'rgba(232,194,109,0.12)', text: 'var(--color-primary-light)', border: 'rgba(232,194,109,0.3)', label: 'بانتظار التقييم' },
        completed: { bg: 'rgba(92,196,129,0.12)', text: 'var(--color-primary)', border: 'rgba(92,196,129,0.3)', label: 'مكتملة ✓' },
    };
    const s = map[status] || map.pending;
    return `<span style="background:${s.bg}; color:${s.text}; border:1px solid ${s.border}; padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:600; white-space:nowrap;">${s.label}</span>`;
};

export function AdminManageTask(store) {
    const tasks = store.getState().tasks;
    const tracks = [...new Set(tasks.map(t => t.track))];

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <!-- Page header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; flex-wrap: wrap; gap: 16px;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: rgba(81,173,173,0.15); color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(81,173,173,0.3);">
                        ${Icons.Tasks}
                    </div>
                    <div>
                        <h1 style="margin: 0; font-size: 2.25rem;">إدارة المهام</h1>
                        <p style="margin: 4px 0 0; color: var(--text-secondary); font-size: 1.05rem;">استعرض وعدّل وحذف جميع المهام المنشورة على المنصة.</p>
                    </div>
                </div>
                <a href="#/admin/add-task" class="btn btn-primary" style="padding: 12px 28px; font-weight: 700; font-size: 1.05rem; text-decoration: none;">+ إضافة مهمة جديدة</a>
            </div>

            <!-- Filters bar -->
            <div class="card" style="padding: 20px 28px; border-radius: var(--radius-xl); margin-bottom: 28px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 200px;">
                    <input type="text" id="task-search" class="form-input" placeholder="🔍  ابحث باسم المهمة..." style="width: 100%; padding: 10px 16px; font-size: 1rem;" />
                </div>
                <select id="task-track-filter" class="form-input" style="padding: 10px 16px; font-size: 1rem; min-width: 160px;">
                    <option value="all">كل المسارات</option>
                    ${tracks.map(t => `<option value="${t}">${t}</option>`).join('')}
                </select>
                <select id="task-sort" class="form-input" style="padding: 10px 16px; font-size: 1rem; min-width: 180px;">
                    <option value="default">الترتيب الافتراضي</option>
                    <option value="deadline-asc">الموعد (الأقرب أولاً)</option>
                    <option value="deadline-desc">الموعد (الأبعد أولاً)</option>
                    <option value="points-desc">النقاط (الأعلى أولاً)</option>
                </select>
            </div>

            <!-- Stats summary -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px;">
                ${[
                    { label: 'إجمالي المهام', value: tasks.length, color: 'var(--color-primary-dark)' },
                    { label: 'بانتظار التسليم', value: tasks.filter(t=>t.status==='pending'&&!t.disabled).length, color: 'var(--text-secondary)' },
                    { label: 'بانتظار التقييم', value: tasks.filter(t=>t.status==='submitted').length, color: 'var(--color-primary-light)' },
                    { label: 'مهام معطّلة', value: tasks.filter(t=>t.disabled).length, color: '#EF4444' },
                ].map(s => `
                    <div class="card" style="text-align:center; padding:20px 16px;">
                        <div style="font-size:2rem; font-weight:800; color:${s.color};">${s.value}</div>
                        <div style="font-size:0.9rem; color:var(--text-secondary); margin-top:4px;">${s.label}</div>
                    </div>
                `).join('')}
            </div>

            <!-- Tasks table -->
            <div class="card" style="padding:0; overflow:hidden; border-radius:var(--radius-xl);" id="tasks-table-container">
                <table style="width:100%; border-collapse:collapse; text-align:right;" id="manage-tasks-table">
                    <thead style="background:var(--bg-surface-hover);">
                        <tr>
                            <th style="padding:18px 28px; font-weight:600; color:var(--text-secondary); border-bottom:1px solid var(--border-color);">المهمة</th>
                            <th style="padding:18px 20px; font-weight:600; color:var(--text-secondary); border-bottom:1px solid var(--border-color);">المسار</th>
                            <th style="padding:18px 20px; font-weight:600; color:var(--text-secondary); border-bottom:1px solid var(--border-color);">النقاط</th>
                            <th style="padding:18px 20px; font-weight:600; color:var(--text-secondary); border-bottom:1px solid var(--border-color);">الموعد</th>
                            <th style="padding:18px 20px; font-weight:600; color:var(--text-secondary); border-bottom:1px solid var(--border-color); text-align:center;">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody id="manage-tasks-body">
                        ${tasks.map(task => renderTaskRow(task)).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Edit Modal -->
            <div id="task-edit-modal" style="display:none; position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.55); backdrop-filter:blur(6px); align-items:center; justify-content:center;">
                <div style="background:var(--bg-surface); border-radius:var(--radius-xl); padding:48px; width:640px; max-width:92vw; box-shadow:var(--shadow-lg); direction:rtl; max-height:90vh; overflow-y:auto;">
                    <h3 style="margin:0 0 32px; font-size:1.5rem;">تعديل المهمة</h3>
                    <input type="hidden" id="edit-task-id" />
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
                        <div class="form-group" style="margin:0; grid-column:1/-1;">
                            <label class="form-label">عنوان المهمة</label>
                            <input type="text" id="edit-task-title" class="form-input" style="width:100%; padding:12px 16px;" />
                        </div>
                        <div class="form-group" style="margin:0; grid-column:1/-1;">
                            <label class="form-label">الوصف</label>
                            <textarea id="edit-task-desc" class="form-input" rows="3" style="width:100%; resize:vertical; padding:12px 16px; font-family:inherit;"></textarea>
                        </div>
                        <div class="form-group" style="margin:0;">
                            <label class="form-label">المسار</label>
                            <select id="edit-task-track" class="form-input" style="width:100%; padding:12px 16px;">
                                <option>الثقافي</option>
                                <option>مسار تقني</option>
                                <option>الذاكرة الحديدية</option>
                                <option>الاجتماعي</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin:0;">
                            <label class="form-label">طريقة التسليم</label>
                            <input type="text" id="edit-task-submission" class="form-input" style="width:100%; padding:12px 16px;" />
                        </div>
                        <div class="form-group" style="margin:0;">
                            <label class="form-label">النقاط</label>
                            <input type="number" id="edit-task-points" class="form-input" min="1" style="width:100%; padding:12px 16px;" />
                        </div>
                        <div class="form-group" style="margin:0;">
                            <label class="form-label">الموعد النهائي</label>
                            <input type="date" id="edit-task-deadline" class="form-input" style="width:100%; padding:12px 16px;" />
                        </div>
                    </div>
                    <div style="display:flex; gap:12px; justify-content:flex-end; margin-top:8px;">
                        <button id="edit-modal-cancel" class="btn btn-secondary" style="padding:12px 24px;">إلغاء</button>
                        <button id="edit-modal-save" class="btn btn-primary" style="padding:12px 32px; font-weight:700;">حفظ التعديلات</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderTaskRow(task) {
    return `
        <tr data-task-id="${task.id}" data-task-track="${task.track}" data-task-title="${task.title}"
            style="border-bottom:1px solid var(--border-color); transition:background var(--transition-fast); ${task.disabled ? 'opacity:0.5;' : ''}"
            onmouseover="this.style.background='var(--bg-main)'" onmouseout="this.style.background='transparent'">
            <td style="padding:20px 28px;">
                <div style="font-weight:600; font-size:1rem; color:var(--text-primary); margin-bottom:4px;">${task.title}</div>
                <div style="font-size:0.85rem; color:var(--text-tertiary);">${task.description?.substring(0, 60)}...</div>
            </td>
            <td style="padding:20px 20px;">${trackBadge(task.track)}</td>
            <td style="padding:20px 20px; font-weight:700; font-size:1.05rem; color:var(--text-primary);">${task.points} 🌟</td>
            <td style="padding:20px 20px; font-size:0.95rem; color:var(--text-secondary);">${task.deadline || '—'}</td>
            <td style="padding:20px 20px; text-align:center;">
                <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
                    <button class="btn task-edit-btn" data-id="${task.id}"
                        style="padding:7px 14px; background:rgba(81,173,173,0.1); color:var(--color-primary-dark); border:1px solid rgba(81,173,173,0.3); font-weight:600; font-size:0.85rem;">
                        تعديل
                    </button>
                    <button class="btn task-toggle-btn" data-id="${task.id}"
                        style="padding:7px 14px; background:${task.disabled ? 'rgba(92,196,129,0.1)' : 'rgba(255,167,38,0.1)'}; color:${task.disabled ? 'var(--color-primary)' : '#FFA726'}; border:1px solid ${task.disabled ? 'rgba(92,196,129,0.3)' : 'rgba(255,167,38,0.3)'}; font-weight:600; font-size:0.85rem;">
                        ${task.disabled ? 'تفعيل' : 'تعطيل'}
                    </button>
                    <button class="btn task-delete-btn" data-id="${task.id}"
                        style="padding:7px 14px; background:rgba(239,68,68,0.1); color:#EF4444; border:1px solid rgba(239,68,68,0.3); font-weight:600; font-size:0.85rem;">
                        حذف
                    </button>
                </div>
            </td>
        </tr>
    `;
}

AdminManageTask.attachEvents = (store) => {
    const modal = document.getElementById('task-edit-modal');

    // --- Filters ---
    const applyFilters = () => {
        const search = document.getElementById('task-search')?.value?.toLowerCase() || '';
        const track = document.getElementById('task-track-filter')?.value || 'all';
        const sort = document.getElementById('task-sort')?.value || 'default';

        let tasks = [...store.getState().tasks];

        // Filter
        if (search) tasks = tasks.filter(t => t.title?.toLowerCase().includes(search));
        if (track !== 'all') tasks = tasks.filter(t => t.track === track);

        // Sort
        if (sort === 'deadline-asc') tasks.sort((a, b) => (a.deadline || '').localeCompare(b.deadline || ''));
        if (sort === 'deadline-desc') tasks.sort((a, b) => (b.deadline || '').localeCompare(a.deadline || ''));
        if (sort === 'points-desc') tasks.sort((a, b) => b.points - a.points);

        const tbody = document.getElementById('manage-tasks-body');
        if (tbody) tbody.innerHTML = tasks.map(t => renderTaskRow(t)).join('');

        // Re-attach row buttons after filter re-render
        attachRowButtons();
    };

    document.getElementById('task-search')?.addEventListener('input', applyFilters);
    document.getElementById('task-track-filter')?.addEventListener('change', applyFilters);
    document.getElementById('task-sort')?.addEventListener('change', applyFilters);

    // --- Row action buttons ---
    const attachRowButtons = () => {
        // Edit
        document.querySelectorAll('.task-edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const task = store.getState().tasks.find(t => t.id === id);
                if (!task) return;
                document.getElementById('edit-task-id').value = id;
                document.getElementById('edit-task-title').value = task.title || '';
                document.getElementById('edit-task-desc').value = task.description || '';
                document.getElementById('edit-task-track').value = task.track || '';
                document.getElementById('edit-task-submission').value = task.submissionMethod || '';
                document.getElementById('edit-task-points').value = task.points || 0;
                document.getElementById('edit-task-deadline').value = task.deadline || '';
                modal.style.display = 'flex';
            });
        });

        // Toggle disable
        document.querySelectorAll('.task-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                store.toggleTaskDisabled(id);
                applyFilters();
            });
        });

        // Delete
        document.querySelectorAll('.task-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                const task = store.getState().tasks.find(t => t.id === id);
                if (confirm(`حذف مهمة "${task?.title}" نهائياً؟ لا يمكن التراجع.`)) {
                    store.deleteTask(id);
                    applyFilters();
                }
            });
        });
    };

    attachRowButtons();

    // --- Modal save ---
    document.getElementById('edit-modal-save')?.addEventListener('click', () => {
        const id = parseInt(document.getElementById('edit-task-id').value);
        store.updateTask(id, {
            title: document.getElementById('edit-task-title').value,
            description: document.getElementById('edit-task-desc').value,
            track: document.getElementById('edit-task-track').value,
            submissionMethod: document.getElementById('edit-task-submission').value,
            points: parseInt(document.getElementById('edit-task-points').value),
            deadline: document.getElementById('edit-task-deadline').value,
        });
        modal.style.display = 'none';
        applyFilters();
    });

    document.getElementById('edit-modal-cancel')?.addEventListener('click', () => { modal.style.display = 'none'; });
    modal?.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
};
