import { Icons } from '../../components/icons.js';

export function AdminDashboard(store) {
    const state = store.getState();
    const tasksCount = state.tasks.length;
    const studentsCount = state.students.length;
    const pendingTasks = state.tasks.filter(t => t.status === 'submitted').length; // Assuming 'submitted' by student needs admin review
    
    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px;">
                <div>
                    <h1 style="margin: 0; font-size: 2.25rem;">لوحة تحكم المشرف</h1>
                    <p style="margin: 4px 0 0 0; color: var(--text-secondary); font-size: 1.05rem;">نظرة عامة على أداء وإنجازات المتدربين.</p>
                </div>
                <a href="#/admin/add-task" class="btn btn-primary" style="padding: 12px 24px; font-weight: 600;">+ إضافة مهمة جديدة</a>
            </div>

            <!-- Stats Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; margin-bottom: 48px;">
                <div class="card" style="display: flex; align-items: center; gap: 20px; padding: 32px;">
                    <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(92,196,129,0.1); border: 1px solid rgba(92,196,129,0.2); color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
                        ${Icons.Users}
                    </div>
                    <div>
                        <div style="font-size: 0.95rem; color: var(--text-secondary); font-weight: 500;">إجمالي الطلاب</div>
                        <div style="font-size: 1.8rem; font-weight: 700; color: var(--text-primary); margin-top: 4px;">${studentsCount}</div>
                    </div>
                </div>
                
                <div class="card" style="display: flex; align-items: center; gap: 20px; padding: 32px;">
                    <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(81,173,173,0.1); border: 1px solid rgba(81,173,173,0.2); color: var(--color-primary-dark); display: flex; align-items: center; justify-content: center;">
                        ${Icons.Tasks}
                    </div>
                    <div>
                        <div style="font-size: 0.95rem; color: var(--text-secondary); font-weight: 500;">إجمالي المهام</div>
                        <div style="font-size: 1.8rem; font-weight: 700; color: var(--text-primary); margin-top: 4px;">${tasksCount}</div>
                    </div>
                </div>
                
                <div class="card" style="display: flex; align-items: center; gap: 20px; padding: 32px;">
                    <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(232,194,109,0.1); border: 1px solid rgba(232,194,109,0.2); color: var(--color-primary-light); display: flex; align-items: center; justify-content: center;">
                        ${Icons.Calendar}
                    </div>
                    <div>
                        <div style="font-size: 0.95rem; color: var(--text-secondary); font-weight: 500;">مهام بانتظار التقييم</div>
                        <div style="font-size: 1.8rem; font-weight: 700; color: var(--text-primary); margin-top: 4px;">${pendingTasks}</div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions & recent Activity -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
                <div class="card" style="padding: 0; overflow: hidden;">
                    <div style="padding: 24px 32px; border-bottom: 1px solid var(--border-color); background: var(--bg-surface-hover);">
                        <h3 style="margin: 0; font-size: 1.25rem;">أحدث تسليمات الطلاب</h3>
                    </div>
                    ${pendingTasks > 0 ? `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 32px; border-bottom: 1px solid var(--border-color); transition: background var(--transition-fast);" onmouseover="this.style.background='var(--bg-surface-hover)'" onmouseout="this.style.background='transparent'">
                            <div>
                                <div style="font-weight: 600; font-size: 1.1rem;">بناء صفحة شخصية</div>
                                <div style="font-size: 0.95rem; color: var(--text-secondary); margin-top: 4px;">الطالب: أحمد محمد</div>
                            </div>
                            <a href="#/admin/tasks" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.95rem; font-weight: 600;">تقييم المهمة</a>
                        </div>
                    ` : `
                        <p style="color: var(--text-tertiary); text-align: center; padding: 48px 0; font-size: 1.05rem;">لا يوجد تسليمات جديدة بانتظار التقييم.</p>
                    `}
                </div>
                
                <div class="card" style="padding: 32px;">
                    <h3 style="margin-bottom: 24px; font-size: 1.25rem;">اختصارات الإدارة</h3>
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <a href="#/admin/add-task" class="btn btn-secondary" style="justify-content: flex-start; padding: 14px 20px; border: 1px dashed var(--border-color); color: var(--color-primary-dark); font-weight: 600;">+ إنشاء مهمة جديدة</a>
                        <a href="#/admin/tasks" class="btn btn-secondary" style="justify-content: flex-start; padding: 14px 20px; font-weight: 500;">مراجعة قائمة المهام المُحالة</a>
                        <a href="#/admin/points" class="btn btn-secondary" style="justify-content: flex-start; padding: 14px 20px; font-weight: 500;">سجل نقاط الطلاب العام</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}
