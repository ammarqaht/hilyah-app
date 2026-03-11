import { Icons } from '../../components/icons.js';

export function StudentPoints(store) {
    const user = store.getState().user;
    const allTasks = store.getState().tasks;
    
    // Only count approved tasks; use earnedPoints (admin-assigned) when available
    const completedTasks = allTasks.filter(t => t.status === 'completed');
    const totalPoints = completedTasks.reduce((sum, task) => {
        const earned = task.earnedPoints !== undefined ? task.earnedPoints : task.points;
        return sum + earned;
    }, 0);
    const progressPerc = Math.min((totalPoints / 160) * 100, 100);
    
    // Group points by category
    const categoryTotals = {
        "مسار تقني": 0, "الثقافي": 0, "الذاكرة الحديدية": 0, "عاجل": 0, "اجتماعي": 0, "منوع": 0, "مسار إعلامي": 0
    };
    completedTasks.forEach(t => {
        if (categoryTotals[t.track] !== undefined) categoryTotals[t.track] += t.points;
        else categoryTotals[t.track] = t.points; // Fallback
    });

    const categories = [
        { name: "مسار تقني", points: categoryTotals["مسار تقني"], color: "var(--color-primary-dark)" },
        { name: "الثقافي", points: categoryTotals["الثقافي"], color: "var(--color-primary-light)" },
        { name: "الذاكرة الحديدية", points: categoryTotals["الذاكرة الحديدية"], color: "var(--color-primary)" },
        { name: "اجتماعي", points: categoryTotals["اجتماعي"], color: "#FFA726" },
    ].filter(c => c.points > 0); // Only show active tracks or we can show all

    // Make sure we have defaults if empty
    if (categories.length === 0) categories.push({ name: "لا توجد نقاط موزعة بعد", points: 0, color: "var(--text-tertiary)" });

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 40px;">
                <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: rgba(255, 167, 38, 0.15); color: #FFA726; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255, 167, 38, 0.3);">
                    ${Icons.Points}
                </div>
                <div>
                    <h1 style="margin: 0; font-size: 2.25rem;">النقاط والإنجازات</h1>
                    <p style="margin: 4px 0 0 0; color: var(--text-secondary); font-size: 1.05rem;">تابع تقدمك وأوسمتك في برنامج حِلْيَة</p>
                </div>
            </div>

            <!-- Top Analytics Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 32px; margin-bottom: 40px;">
                <div class="card" style="text-align: center; padding: 48px 32px; display: flex; flex-direction: column; justify-content: center;">
                    <h3 style="color: var(--text-secondary); font-size: 1.15rem; margin-bottom: 16px; font-weight: 500;">إجمالي النقاط المكتسبة</h3>
                    <div style="font-size: 5rem; font-weight: 800; background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1;">
                        ${totalPoints}
                    </div>
                </div>
                
                <div class="card" style="padding: 40px 32px; display: flex; flex-direction: column; justify-content: center;">
                    <h3 style="color: var(--text-secondary); font-size: 1.15rem; margin-bottom: 24px; font-weight: 500;">التقدم نحو الطور التالي</h3>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="font-weight: 700; color: var(--text-primary); font-size: 1.1rem;">الطور الفضي</span>
                        <span style="font-weight: 700; color: var(--color-primary); font-size: 1.1rem;">الطور الذهبي</span>
                    </div>
                    <div style="width: 100%; height: 16px; background: rgba(0,0,0,0.05); border-radius: 8px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
                        <div style="width: ${progressPerc}%; height: 100%; background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark)); border-radius: 8px; transition: width 1s cubic-bezier(0.2, 0.8, 0.2, 1);"></div>
                    </div>
                    <p style="margin-top: 16px; font-size: 1rem; color: var(--text-tertiary); text-align: right;">متبقي ${Math.max(160 - totalPoints, 0)} نقطة</p>
                </div>
            </div>

            <!-- Table & Categories -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
                <!-- Latest History Table -->
                <div class="card" style="padding: 0; overflow: hidden;">
                    <div style="padding: 32px; border-bottom: 1px solid var(--border-color);">
                        <h3 style="margin: 0; font-size: 1.4rem;">سجل الإنجازات</h3>
                    </div>
                    ${completedTasks.length > 0 ? `
                        <table style="width: 100%; border-collapse: collapse; text-align: right;">
                            <thead style="background: var(--bg-surface-hover);">
                                <tr>
                                    <th style="padding: 16px 32px; font-weight: 600; color: var(--text-secondary);">المهمة</th>
                                    <th style="padding: 16px 32px; font-weight: 600; color: var(--text-secondary);">المسار</th>
                                    <th style="padding: 16px 32px; font-weight: 600; color: var(--text-secondary);">النقاط المُكتسبة</th>
                                    <th style="padding: 16px 32px; font-weight: 600; color: var(--text-secondary);">تعليق المشرف</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${[...completedTasks].reverse().map(t => {
                                    const earned = t.earnedPoints !== undefined ? t.earnedPoints : t.points;
                                    return `
                                    <tr style="border-bottom: 1px solid var(--border-color); transition: background var(--transition-fast);" onmouseover="this.style.background='var(--bg-main)'" onmouseout="this.style.background='transparent'">
                                        <td style="padding: 20px 32px; font-weight: 600; color: var(--text-primary);">${t.title}</td>
                                        <td style="padding: 20px 32px; color: var(--text-secondary);">${t.track}</td>
                                        <td style="padding: 20px 32px;">
                                            <span style="background: rgba(92,196,129,0.15); color: var(--color-primary); padding: 6px 14px; border-radius: 20px; font-weight: 700; display: inline-block;">+${earned} / ${t.points}</span>
                                        </td>
                                        <td style="padding: 20px 32px; font-size:0.88rem; font-style:italic; color:var(--text-tertiary);">${t.adminComment || '—'}</td>
                                    </tr>
                                `}).join('')}
                            </tbody>
                        </table>
                    ` : `
                        <div style="padding: 64px 32px; text-align: center; color: var(--text-tertiary);">لا توجد مهام مكتملة بعد.</div>
                    `}
                </div>

                <!-- Points by Category -->
                <div class="card" style="padding: 32px;">
                    <h3 style="margin-bottom: 32px; font-size: 1.4rem;">النقاط حسب المسار</h3>
                    <div style="display: flex; flex-direction: column; gap: 24px;">
                        ${categories.map(cat => `
                            <div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                                    <span style="font-weight: 600; color: var(--text-primary); font-size: 1.05rem;">${cat.name}</span>
                                    <span style="font-weight: 700; color: ${cat.color};">${cat.points} نقطة</span>
                                </div>
                                <div style="width: 100%; height: 10px; background: rgba(0,0,0,0.05); border-radius: 5px; overflow: hidden;">
                                    <div style="width: ${(totalPoints > 0 ? (cat.points / totalPoints) * 100 : 0)}%; height: 100%; background: ${cat.color}; border-radius: 5px;"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}
