import { Icons } from '../../components/icons.js';

/**
 * Admin — Review submitted tasks with custom point assignment
 */

const TRACK_STYLE = {
    'الثقافي':         { bg: 'rgba(232,194,109,0.12)', text: 'var(--color-primary-light)', border: 'rgba(232,194,109,0.35)' },
    'مسار تقني':      { bg: 'rgba(81,173,173,0.12)',  text: 'var(--color-primary-dark)', border: 'rgba(81,173,173,0.35)' },
    'الذاكرة الحديدية':{ bg: 'rgba(155,114,207,0.12)', text: '#9B72CF', border: 'rgba(155,114,207,0.35)' },
    'الاجتماعي':      { bg: 'rgba(92,196,129,0.12)',  text: 'var(--color-primary)', border: 'rgba(92,196,129,0.35)' },
};

function trackBadge(track) {
    const s = TRACK_STYLE[track] || { bg: 'var(--bg-surface-hover)', text: 'var(--text-secondary)', border: 'var(--border-color)' };
    return `<span style="background:${s.bg}; color:${s.text}; border:1px solid ${s.border}; padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:700;">${track}</span>`;
}

function renderSubmissionRow(sub) {
    const isPending  = sub.status === 'pending';
    const isApproved = sub.status === 'approved';
    const isRejected = sub.status === 'rejected';

    const statusBadge = isApproved
        ? `<span style="background:rgba(92,196,129,0.1); color:var(--color-primary); border:1px solid rgba(92,196,129,0.3); padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:700;">مقبولة ✓</span>`
        : isRejected
        ? `<span style="background:rgba(239,68,68,0.1); color:#EF4444; border:1px solid rgba(239,68,68,0.3); padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:700;">مردودة ✗</span>`
        : `<span style="background:rgba(255,167,38,0.1); color:#FFA726; border:1px solid rgba(255,167,38,0.3); padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:700;">بانتظار المراجعة</span>`;

    return `
        <div class="submission-card" data-sub-id="${sub.id}" style="
            background: var(--bg-surface); border: 1px solid var(--border-color);
            border-radius: var(--radius-xl); padding: 28px 32px; margin-bottom: 20px;
            transition: box-shadow 0.2s;
            ${isPending ? 'border-right: 4px solid #FFA726;' : isApproved ? 'border-right: 4px solid var(--color-primary);' : 'border-right: 4px solid #EF4444;'}
        ">
            <!-- Row 1: Student + Track + Status -->
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg,var(--color-primary-light),var(--color-primary)); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:1.1rem; flex-shrink:0;">
                        ${sub.studentName?.charAt(0) || 'ط'}
                    </div>
                    <div>
                        <div style="font-weight:700; font-size:1rem; color:var(--text-primary);">${sub.studentName}</div>
                        <div style="font-size:0.82rem; color:var(--text-tertiary);">${new Date(sub.submittedAt).toLocaleDateString('ar-SA')}</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                    ${trackBadge(sub.taskTrack)}
                    ${statusBadge}
                </div>
            </div>

            <!-- Row 2: Task title + Max points -->
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
                <h4 style="margin:0; font-size:1.15rem; color:var(--text-primary);">${sub.taskTitle}</h4>
                <div style="background:rgba(232,194,109,0.1); border:1px solid rgba(232,194,109,0.3); padding:5px 14px; border-radius:20px; font-weight:700; color:var(--color-primary-light);">
                    الحد الأقصى: ${sub.taskMaxPoints} 🌟
                </div>
            </div>

            <!-- Submission content preview -->
            ${sub.submissionContent ? `
                <div style="background:var(--bg-main); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:14px 18px; margin-bottom:16px;">
                    <div style="font-size:0.78rem; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px;">محتوى التسليم</div>
                    <div style="font-size:0.95rem; color:var(--text-secondary); line-height:1.6; white-space:pre-wrap;">${sub.submissionContent}</div>
                </div>
            ` : ''}

            <!-- Approval result (if decided) -->
            ${isApproved ? `
                <div style="display:flex; align-items:center; gap:16px; margin-bottom:14px; flex-wrap:wrap;">
                    <div style="background:rgba(92,196,129,0.1); border:1px solid rgba(92,196,129,0.3); border-radius:var(--radius-sm); padding:10px 20px; font-weight:700; font-size:1.05rem; color:var(--color-primary);">
                        النقاط المُمنوحة: ${sub.earnedPoints} / ${sub.taskMaxPoints} 🌟
                    </div>
                    ${sub.adminComment ? `<div style="font-size:0.9rem; color:var(--text-secondary); font-style:italic;">"${sub.adminComment}"</div>` : ''}
                </div>
            ` : isRejected ? `
                <div style="margin-bottom:14px; color:#EF4444; font-size:0.9rem; font-style:italic;">
                    ${sub.adminComment ? `تعليق المشرف: "${sub.adminComment}"` : 'تم الرفض بدون تعليق.'}
                </div>
            ` : ''}

            <!-- Actions (only for pending) -->
            ${isPending ? `
                <div style="display:flex; gap:10px; margin-top:4px;">
                    <button class="btn review-sub-btn" data-sub-id="${sub.id}"
                        style="padding:10px 24px; background:rgba(92,196,129,0.1); color:var(--color-primary); border:1px solid rgba(92,196,129,0.3); font-weight:700;">
                        قبول وتقييم النقاط
                    </button>
                    <button class="btn reject-sub-btn" data-sub-id="${sub.id}"
                        style="padding:10px 20px; background:rgba(239,68,68,0.08); color:#EF4444; border:1px solid rgba(239,68,68,0.25); font-weight:700;">
                        رد المهمة
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

export function AdminTasks(store) {
    const state = store.getState();
    const submissions = state.submissions || [];
    const pending   = submissions.filter(s => s.status === 'pending');
    const decided   = submissions.filter(s => s.status !== 'pending');

    const pendingCount = pending.length;
    const decidedCount = decided.length;

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <!-- Header -->
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:40px; flex-wrap:wrap; gap:16px;">
                <div style="display:flex; align-items:center; gap:16px;">
                    <div style="width:56px; height:56px; border-radius:var(--radius-md); background:rgba(81,173,173,0.15); color:var(--color-primary-dark); display:flex; align-items:center; justify-content:center; border:1px solid rgba(81,173,173,0.3);">
                        ${Icons.Tasks}
                    </div>
                    <div>
                        <h1 style="margin:0; font-size:2.25rem;">مراجعة التسليمات</h1>
                        <p style="margin:4px 0 0; color:var(--text-secondary); font-size:1.05rem;">اعتمد أو ارفض تسليمات الطلاب وامنح النقاط المناسبة.</p>
                    </div>
                </div>
                ${pendingCount > 0 ? `<div style="background:rgba(255,167,38,0.1); border:1px solid rgba(255,167,38,0.3); border-radius:30px; padding:10px 20px; font-weight:700; color:#FFA726;">${pendingCount} تسليم بانتظار المراجعة</div>` : ''}
            </div>

            <!-- Pending submissions -->
            ${pending.length > 0 ? `
                <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:16px;">
                    ⏳ بانتظار المراجعة (${pending.length})
                </h3>
                ${pending.map(s => renderSubmissionRow(s)).join('')}
            ` : `
                <div class="card" style="text-align:center; padding:80px 32px; margin-bottom:32px;">
                    <div style="font-size:3rem; margin-bottom:16px;">✅</div>
                    <h3 style="font-size:1.4rem; color:var(--text-primary); margin-bottom:8px;">لا توجد تسليمات معلقة</h3>
                    <p style="color:var(--text-secondary);">جميع التسليمات تمت مراجعتها.</p>
                </div>
            `}

            <!-- Decided submissions -->
            ${decidedCount > 0 ? `
                <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:16px; margin-top:32px;">
                    📋 سجل التقييمات السابقة (${decidedCount})
                </h3>
                ${decided.reverse().map(s => renderSubmissionRow(s)).join('')}
            ` : ''}
        </div>

        <!-- ===== APPROVAL MODAL ===== -->
        <div id="approval-modal" style="display:none; position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.55); backdrop-filter:blur(8px); align-items:center; justify-content:center;">
            <div style="background:var(--bg-surface); border-radius:var(--radius-xl); padding:48px; width:560px; max-width:92vw; box-shadow:var(--shadow-lg); direction:rtl;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                    <h3 style="margin:0; font-size:1.4rem;">تقييم التسليم</h3>
                    <button id="approval-close-btn" style="background:none; border:none; cursor:pointer; font-size:1.4rem; color:var(--text-tertiary);">✕</button>
                </div>
                <p id="approval-task-label" style="color:var(--text-secondary); font-size:0.95rem; margin-bottom:32px;"></p>

                <!-- Points input with range indicator -->
                <div class="form-group" style="margin-bottom:20px;">
                    <label class="form-label" style="margin-bottom:8px; display:block;">النقاط المُمنوحة</label>
                    <div style="display:flex; align-items:center; gap:16px;">
                        <input type="number" id="approval-points-input" class="form-input" min="0" style="width:140px; padding:14px 16px; font-size:1.2rem; font-weight:700; text-align:center;" />
                        <span id="approval-max-label" style="color:var(--text-tertiary); font-size:0.95rem;"></span>
                    </div>
                    <div id="approval-points-error" style="color:#EF4444; font-size:0.85rem; margin-top:6px; display:none;">القيمة يجب أن تكون بين 0 والحد الأقصى.</div>
                    <!-- Visual range bar -->
                    <div style="margin-top:14px;">
                        <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-tertiary); margin-bottom:6px;">
                            <span>0</span>
                            <span id="approval-max-bar-label"></span>
                        </div>
                        <div style="width:100%; height:8px; background:var(--bg-surface-hover); border-radius:4px; overflow:hidden;">
                            <div id="approval-range-fill" style="height:100%; background:linear-gradient(90deg, var(--color-primary), var(--color-primary-dark)); border-radius:4px; transition:width 0.3s; width:100%;"></div>
                        </div>
                    </div>
                    <!-- Quick presets -->
                    <div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
                        <span style="font-size:0.8rem; color:var(--text-tertiary); align-self:center;">اختيار سريع:</span>
                        <button class="preset-btn btn" data-pct="100" style="padding:4px 12px; font-size:0.8rem; background:rgba(92,196,129,0.1); color:var(--color-primary); border:1px solid rgba(92,196,129,0.3); border-radius:16px;">كامل</button>
                        <button class="preset-btn btn" data-pct="75"  style="padding:4px 12px; font-size:0.8rem; background:rgba(81,173,173,0.1); color:var(--color-primary-dark); border:1px solid rgba(81,173,173,0.3); border-radius:16px;">75%</button>
                        <button class="preset-btn btn" data-pct="50"  style="padding:4px 12px; font-size:0.8rem; background:rgba(255,167,38,0.1); color:#FFA726; border:1px solid rgba(255,167,38,0.3); border-radius:16px;">50%</button>
                        <button class="preset-btn btn" data-pct="0"   style="padding:4px 12px; font-size:0.8rem; background:rgba(239,68,68,0.08); color:#EF4444; border:1px solid rgba(239,68,68,0.2); border-radius:16px;">صفر</button>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom:28px;">
                    <label class="form-label" style="margin-bottom:8px; display:block;">تعليق المشرف (اختياري)</label>
                    <textarea id="approval-comment-input" class="form-input" rows="3" placeholder="مثال: عمل جيد، لكن بعض الأجزاء تحتاج مزيداً من التفصيل." style="width:100%; padding:12px 16px; font-family:inherit; resize:vertical;"></textarea>
                </div>

                <div style="display:flex; gap:12px; justify-content:flex-end;">
                    <button id="approval-cancel-btn" class="btn btn-secondary" style="padding:12px 24px;">إلغاء</button>
                    <button id="approval-save-btn" class="btn btn-primary" style="padding:12px 32px; font-weight:700;">اعتماد وحفظ النقاط</button>
                </div>
            </div>
        </div>
    `;
}

AdminTasks.attachEvents = (store) => {
    const modal         = document.getElementById('approval-modal');
    const pointsInput   = document.getElementById('approval-points-input');
    const maxLabel      = document.getElementById('approval-max-label');
    const maxBarLabel   = document.getElementById('approval-max-bar-label');
    const rangeFill     = document.getElementById('approval-range-fill');
    const pointsError   = document.getElementById('approval-points-error');
    const taskLabel     = document.getElementById('approval-task-label');
    const commentInput  = document.getElementById('approval-comment-input');
    let activeSubId     = null;
    let activeMaxPts    = 0;

    const closeModal = () => { modal.style.display = 'none'; activeSubId = null; };
    document.getElementById('approval-close-btn')?.addEventListener('click', closeModal);
    document.getElementById('approval-cancel-btn')?.addEventListener('click', closeModal);
    modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    // Update range bar as user types
    pointsInput?.addEventListener('input', () => {
        const v = parseFloat(pointsInput.value) || 0;
        const pct = activeMaxPts > 0 ? Math.min(100, Math.max(0, (v / activeMaxPts) * 100)) : 0;
        rangeFill.style.width = pct + '%';
        const valid = v >= 0 && v <= activeMaxPts;
        pointsError.style.display = valid ? 'none' : 'block';
    });

    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const pct = parseInt(btn.getAttribute('data-pct'));
            const val = Math.round(activeMaxPts * pct / 100);
            pointsInput.value = val;
            rangeFill.style.width = pct + '%';
            pointsError.style.display = 'none';
        });
    });

    // Open approval modal
    document.querySelectorAll('.review-sub-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const subId = parseInt(btn.getAttribute('data-sub-id'));
            const sub = store.getState().submissions.find(s => s.id === subId);
            if (!sub) return;
            activeSubId = subId;
            activeMaxPts = sub.taskMaxPoints;
            taskLabel.textContent = `المهمة: ${sub.taskTitle} — ${sub.studentName} — الحد الأقصى: ${sub.taskMaxPoints} نقطة`;
            maxLabel.textContent = `من ${sub.taskMaxPoints}`;
            maxBarLabel.textContent = sub.taskMaxPoints;
            pointsInput.setAttribute('max', sub.taskMaxPoints);
            pointsInput.value = sub.taskMaxPoints; // default: full marks
            rangeFill.style.width = '100%';
            commentInput.value = '';
            pointsError.style.display = 'none';
            modal.style.display = 'flex';
            setTimeout(() => pointsInput.focus(), 80);
        });
    });

    // Save approval
    document.getElementById('approval-save-btn')?.addEventListener('click', () => {
        const pts = parseFloat(pointsInput.value);
        if (isNaN(pts) || pts < 0 || pts > activeMaxPts) {
            pointsError.style.display = 'block';
            return;
        }
        store.approveSubmission(activeSubId, pts, commentInput.value.trim());
        closeModal();
        window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    // Reject buttons
    document.querySelectorAll('.reject-sub-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const subId = parseInt(btn.getAttribute('data-sub-id'));
            const comment = prompt('تعليق على الرفض (اختياري):') || '';
            store.rejectSubmission(subId, comment);
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        });
    });
};
