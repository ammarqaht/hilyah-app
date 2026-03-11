import { Icons } from '../../components/icons.js';

/**
 * Student Tasks — view tasks and submit with content
 */

export function StudentTasks(store) {
    const state = store.getState();
    const tasks = state.tasks.filter(t => !t.disabled);
    const submissions = state.submissions || [];
    const user = state.user;
    const c = (key, fb) => state.content[key] || fb;

    // Find this student's submission for a task
    const mySubmission = (taskId) => submissions.find(s => s.taskId === taskId && s.studentName === user?.name);

    const renderBadge = (status) => {
        if (status === 'completed') return `<span style="background:rgba(92,196,129,0.15); color:var(--color-primary); padding:4px 12px; border-radius:20px; font-size:0.8rem; font-weight:700;">مكتملة ✓</span>`;
        if (status === 'submitted') return `<span style="background:rgba(255,167,38,0.12); color:#FFA726; padding:4px 12px; border-radius:20px; font-size:0.8rem; font-weight:700;">قيد المراجعة</span>`;
        return `<span style="background:rgba(81,173,173,0.12); color:var(--color-primary-dark); padding:4px 12px; border-radius:20px; font-size:0.8rem; font-weight:700;">قيد الانتظار</span>`;
    };

    const TRACK_COLORS = {
        'الثقافي':         { grad: 'var(--color-primary-light),var(--color-primary-dark)' },
        'مسار تقني':      { grad: 'var(--color-primary-dark),var(--color-primary)' },
        'الذاكرة الحديدية':{ grad: '#9B72CF,var(--color-primary-dark)' },
        'الاجتماعي':      { grad: 'var(--color-primary),var(--color-primary-dark)' },
    };
    const trackGrad = (t) => (TRACK_COLORS[t] || TRACK_COLORS['الثقافي']).grad;

    const renderCard = (task) => {
        const sub = mySubmission(task.id);
        const isSubmitted = task.status === 'submitted';
        const isCompleted = task.status === 'completed';
        const isPending   = task.status === 'pending';

        return `
            <div class="card task-compact-card" data-id="${task.id}" style="display:flex; flex-direction:column; position:relative; overflow:hidden; border-radius:var(--radius-lg); transition:all 0.3s; cursor:pointer;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)'" onmouseout="this.style.transform='none'; this.style.boxShadow='var(--shadow-sm)'">
                <!-- Track accent bar -->
                <div style="position:absolute; top:0; right:0; width:6px; height:100%; background:linear-gradient(to bottom, ${trackGrad(task.track)});"></div>

                <div class="task-card-header" style="flex:1; display:flex; flex-direction:column; gap:8px;">
                    <span style="display:inline-block; font-size:0.75rem; color:white; background:linear-gradient(135deg, ${trackGrad(task.track)}); padding:4px 10px; border-radius:12px; font-weight:700; width:fit-content; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;">
                        ${task.track}
                    </span>
                    <h3 class="task-card-title" style="margin:0; color:var(--text-primary); font-weight:700; font-size:1.1rem; line-height:1.4; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">${task.title}</h3>
                </div>

                <div class="task-card-footer" style="display:flex; flex-direction:column; gap:10px; margin-top:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div style="font-weight:700; color:var(--color-primary-light); font-size:0.95rem;">
                            ${task.points} 🌟
                        </div>
                        ${renderBadge(task.status)}
                    </div>
                </div>
            </div>
        `;
    };

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <div style="display:flex; align-items:center; gap:16px; margin-bottom:40px;">
                <div style="width:56px; height:56px; border-radius:var(--radius-md); background:rgba(81,173,173,0.15); color:var(--color-primary-dark); display:flex; align-items:center; justify-content:center; border:1px solid rgba(81,173,173,0.3);">
                    ${Icons.Tasks}
                </div>
                <div>
                    <h1 style="margin:0; font-size:2.25rem;">${c('tasks.page.title','المهام الحالية')}</h1>
                    <p style="margin:4px 0 0; color:var(--text-secondary); font-size:1.05rem;">${c('tasks.page.subtitle','استعرض وسلّم مهامك')}</p>
                </div>
            </div>

            ${tasks.length > 0 ? `
                <div class="tasks-grid">
                    ${tasks.map(t => renderCard(t)).join('')}
                </div>
            ` : `
                <div class="card" style="text-align:center; padding:80px;">
                    <div style="font-size:3rem; margin-bottom:16px;">📋</div>
                    <p style="color:var(--text-secondary);">لا توجد مهام متاحة حالياً.</p>
                </div>
            `}
        </div>

        <!-- Task Detail Modal -->
        <div id="task-detail-modal" style="display:none; position:fixed; inset:0; z-index:10000; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px); align-items:center; justify-content:center; opacity:0; transition:opacity 0.2s;">
            <div id="task-detail-modal-content" style="background:var(--bg-surface); max-width:600px; display:flex; flex-direction:column; box-shadow:0 10px 40px rgba(0,0,0,0.2); transition:transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); transform:translateY(50px);">
                <!-- Header -->
                <div style="padding:20px 24px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.02);">
                    <h3 style="margin:0; font-size:1.25rem;">تفاصيل المهمة</h3>
                    <button id="close-task-modal" class="btn" style="padding:8px; background:var(--bg-surface-hover); border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; border:none; cursor:pointer;">✕</button>
                </div>
                <!-- Body -->
                <div id="task-modal-body" style="padding:24px; overflow-y:auto; flex:1;">
                </div>
            </div>
        </div>
    `;
}

StudentTasks.attachEvents = (store) => {
    const state = store.getState();
    const tasks = state.tasks.filter(t => !t.disabled);
    const submissions = state.submissions || [];
    const user = state.user;
    const c = (key, fb) => state.content[key] || fb;

    const mySubmission = (taskId) => submissions.find(s => s.taskId === taskId && s.studentName === user?.name);

    const modal = document.getElementById('task-detail-modal');
    const modalContent = document.getElementById('task-detail-modal-content');
    const modalBody = document.getElementById('task-modal-body');
    const closeBtn = document.getElementById('close-task-modal');

    const closeModal = () => {
        if(modal) {
            modal.style.opacity = '0';
            modalContent.style.transform = 'translateY(50px)';
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 200);
        }
    };

    closeBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    const TRACK_COLORS = {
        'الثقافي':         { grad: 'var(--color-primary-light),var(--color-primary-dark)' },
        'مسار تقني':      { grad: 'var(--color-primary-dark),var(--color-primary)' },
        'الذاكرة الحديدية':{ grad: '#9B72CF,var(--color-primary-dark)' },
        'الاجتماعي':      { grad: 'var(--color-primary),var(--color-primary-dark)' },
    };
    const trackGrad = (t) => (TRACK_COLORS[t] || TRACK_COLORS['الثقافي']).grad;

    const renderBadge = (status) => {
        if (status === 'completed') return `<span style="background:rgba(92,196,129,0.15); color:var(--color-primary); padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:700;">مكتملة ✓</span>`;
        if (status === 'submitted') return `<span style="background:rgba(255,167,38,0.12); color:#FFA726; padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:700;">قيد المراجعة</span>`;
        return `<span style="background:rgba(81,173,173,0.12); color:var(--color-primary-dark); padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:700;">قيد الانتظار</span>`;
    };

    const openModal = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if(!task) return;
        const sub = mySubmission(task.id);
        const isSubmitted = task.status === 'submitted';
        const isCompleted = task.status === 'completed';
        const isPending   = task.status === 'pending';

        modalBody.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <!-- Header Info -->
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div>
                        <span style="font-size:0.85rem; color:var(--text-tertiary); font-weight:700; text-transform:uppercase; letter-spacing:0.05em; display:inline-block; margin-bottom:4px;">${task.track}</span>
                        <h2 style="font-size:1.5rem; margin:0; color:var(--text-primary); font-weight:700; line-height:1.4;">${task.title}</h2>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
                        <div style="background:rgba(232,194,109,0.1); border:1px solid rgba(232,194,109,0.3); padding:5px 14px; border-radius:20px; font-weight:700; color:var(--color-primary-light); white-space:nowrap;">
                            ${task.points} 🌟
                        </div>
                        ${renderBadge(task.status)}
                    </div>
                </div>

                <!-- Description -->
                <div style="background:var(--bg-main); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-color);">
                    <p style="margin:0; color:var(--text-secondary); font-size:1rem; line-height:1.7;">${task.description}</p>
                </div>

                <!-- Meta Info -->
                <div style="display:flex; flex-direction:column; gap:8px; padding:16px; background:var(--bg-surface-hover); border-radius:var(--radius-md);">
                    <div style="display:flex; justify-content:space-between;">
                        <span style="color:var(--text-secondary); font-size:0.9rem;">طريقة التسليم:</span>
                        <strong style="color:var(--text-primary); font-size:0.95rem;">${task.submissionMethod}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span style="color:var(--text-secondary); font-size:0.9rem;">آخر موعد:</span>
                        <strong style="color:var(--text-primary); font-size:0.95rem;">${task.deadline}</strong>
                    </div>
                </div>

                <!-- Show result if approved -->
                ${isCompleted && task.earnedPoints !== undefined ? `
                    <div style="background:rgba(92,196,129,0.08); border:1px solid rgba(92,196,129,0.25); border-radius:var(--radius-sm); padding:14px 16px;">
                        <div style="font-weight:700; color:var(--color-primary); font-size:1rem; margin-bottom:4px;">🏅 نقاطك: ${task.earnedPoints} / ${task.points}</div>
                        ${task.adminComment ? `<div style="font-size:0.88rem; color:var(--text-secondary); font-style:italic;">"${task.adminComment}"</div>` : ''}
                    </div>
                ` : ''}

                <!-- Show rejection note -->
                ${isSubmitted && sub?.status === 'rejected' ? `
                    <div style="background:rgba(239,68,68,0.07); border:1px solid rgba(239,68,68,0.2); border-radius:var(--radius-sm); padding:12px 16px; color:#EF4444; font-size:0.9rem;">
                        ❌ تم رد المهمة${sub.adminComment ? `: "${sub.adminComment}"` : '.'}
                    </div>
                ` : ''}

                <!-- Submission form -->
                ${isPending ? `
                    <div style="margin-top:8px;">
                        <label style="display:block; font-weight:700; margin-bottom:8px; color:var(--text-primary);">التسليم</label>
                        <textarea id="modal-sub-content-${task.id}" class="form-input" rows="4"
                            placeholder="اكتب سجل إنجازك أو الرابط الخاص بالتسليم هنا..."
                            style="width:100%; padding:14px; font-family:inherit; resize:vertical; font-size:0.95rem; margin-bottom:16px;"></textarea>
                        <button class="btn btn-primary modal-submit-task-btn" data-id="${task.id}" style="width:100%; padding:14px; font-size:1.05rem; font-weight:700;">
                            ↑ ${c('ui.submit.task','تسليم المهمة')}
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        
        document.body.style.overflow = 'hidden';
        modal.style.display = 'flex';
        // Trigger flow
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'translateY(0)';
        });

        // Attach submit event listener inside modal
        const submitBtn = modalBody.querySelector('.modal-submit-task-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const contentArea = document.getElementById(`modal-sub-content-${task.id}`);
                const content = contentArea?.value?.trim() || '';
                if (!content) {
                    contentArea?.classList.add('error');
                    contentArea?.setAttribute('placeholder','⚠️ الرجاء كتابة محتوى التسليم أولاً');
                    setTimeout(() => { contentArea?.classList.remove('error'); contentArea?.setAttribute('placeholder','اكتب سجل إنجازك أو الرابط الخاص بالتسليم هنا...'); }, 2500);
                    return;
                }
                store.submitTask(task.id, content);
                closeModal();
                window.dispatchEvent(new HashChangeEvent('hashchange'));
            });
        }
    };

    document.querySelectorAll('.task-compact-card').forEach(card => {
        card.addEventListener('click', () => {
            const taskId = parseInt(card.getAttribute('data-id'));
            openModal(taskId);
        });
    });
};
