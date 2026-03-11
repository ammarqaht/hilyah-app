import { Icons } from '../../components/icons.js';

export function AdminGeneralPoints(store) {
    const students = store.getState().students;
    // Sort students by points descending
    const sortedStudents = [...students].sort((a, b) => b.totalPoints - a.totalPoints);

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: rgba(232, 194, 109, 0.15); color: var(--color-primary-light); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(232, 194, 109, 0.3);">
                        ${Icons.Points}
                    </div>
                    <div>
                        <h1 style="margin: 0; font-size: 2.25rem;">النقاط العامة ولوحة الشرف</h1>
                        <p style="margin: 4px 0 0 0; color: var(--text-secondary); font-size: 1.05rem;">استعرض درجات الطلاب ورتبهم بناءً على أدائهم.</p>
                    </div>
                </div>
                
                <div style="display: flex; gap: 12px;">
                    <input type="text" class="form-input" placeholder="ابحث باسم الطالب..." style="width: 280px; padding: 12px 16px; font-size: 1.05rem;" />
                    <button class="btn btn-secondary" style="padding: 12px 24px; font-size: 1.05rem; font-weight: 600; border: 1px solid var(--border-color);">
                        تصدير التقرير (Excel)
                    </button>
                </div>
            </div>

            <!-- Premium Podium -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 48px; align-items: end;">
                <!-- Silver (2nd) -->
                <div class="card" style="text-align: center; background: linear-gradient(180deg, rgba(161, 165, 171, 0.05) 0%, rgba(161, 165, 171, 0.15) 100%); border-color: rgba(161, 165, 171, 0.3); padding: 40px 24px; position: relative; overflow: hidden; height: 85%;">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #A1A5AB;"></div>
                    <div style="font-size: 2.5rem; margin-bottom: 16px; filter: drop-shadow(0 4px 8px rgba(161, 165, 171, 0.4));">🥈</div>
                    <div style="font-weight: 800; font-size: 1.3rem; color: var(--text-primary); margin-bottom: 8px;">${sortedStudents[1]?.name || '---'}</div>
                    <div style="color: var(--text-secondary); font-size: 1.05rem; font-weight: 600;">${sortedStudents[1]?.totalPoints || 0} نقطة</div>
                </div>

                <!-- Gold (1st) -->
                <div class="card" style="text-align: center; background: linear-gradient(180deg, rgba(232, 194, 109, 0.1) 0%, rgba(232, 194, 109, 0.25) 100%); border-color: rgba(232, 194, 109, 0.5); padding: 48px 24px; position: relative; overflow: hidden; transform: translateY(-16px); box-shadow: 0 12px 32px rgba(232, 194, 109, 0.2);">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: linear-gradient(90deg, var(--color-primary-light), #FFD700);"></div>
                    <div style="font-size: 3.5rem; margin-bottom: 16px; filter: drop-shadow(0 4px 12px rgba(232, 194, 109, 0.5));">👑</div>
                    <div style="font-weight: 800; font-size: 1.5rem; color: var(--color-primary-light); margin-bottom: 8px;">${sortedStudents[0]?.name || '---'}</div>
                    <div style="color: var(--text-primary); font-size: 1.15rem; font-weight: 700;">${sortedStudents[0]?.totalPoints || 0} نقطة</div>
                </div>

                <!-- Bronze (3rd) -->
                <div class="card" style="text-align: center; background: linear-gradient(180deg, rgba(205, 127, 50, 0.05) 0%, rgba(205, 127, 50, 0.15) 100%); border-color: rgba(205, 127, 50, 0.3); padding: 32px 24px; position: relative; overflow: hidden; height: 75%;">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #CD7F32;"></div>
                    <div style="font-size: 2rem; margin-bottom: 16px; filter: drop-shadow(0 4px 8px rgba(205, 127, 50, 0.4));">🥉</div>
                    <div style="font-weight: 800; font-size: 1.2rem; color: var(--text-primary); margin-bottom: 8px;">${sortedStudents[2]?.name || '---'}</div>
                    <div style="color: var(--text-secondary); font-size: 1rem; font-weight: 600;">${sortedStudents[2]?.totalPoints || 0} نقطة</div>
                </div>
            </div>

            <div class="card" style="padding: 0; overflow: hidden; border-radius: var(--radius-xl);">
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: right;">
                        <thead style="background: var(--bg-surface-hover);">
                            <tr>
                                <th style="padding: 20px 32px; font-weight: 600; color: var(--text-secondary); width: 100px; text-align: center; border-bottom: 1px solid var(--border-color);">الترتيب</th>
                                <th style="padding: 20px 32px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border-color);">اسم الطالب</th>
                                <th style="padding: 20px 32px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border-color);">المهام المنجزة</th>
                                <th style="padding: 20px 32px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border-color);">إجمالي النقاط</th>
                                <th style="padding: 20px 32px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border-color);">الطور المكتسب</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sortedStudents.map((student, index) => `
                                <tr style="border-bottom: 1px solid var(--border-color); transition: background var(--transition-fast);" onmouseover="this.style.background='var(--bg-main)'" onmouseout="this.style.background='transparent'">
                                    <td style="padding: 24px 32px; text-align: center; font-weight: 800; font-size: 1.1rem; color: ${index === 0 ? 'var(--color-primary-light)' : index === 1 ? '#A1A5AB' : index === 2 ? '#CD7F32' : 'var(--text-tertiary)'};">
                                        #${index + 1}
                                    </td>
                                    <td style="padding: 24px 32px; font-weight: 600; font-size: 1.05rem; display: flex; align-items: center; gap: 16px; color: var(--text-primary);">
                                        <div style="width: 40px; height: 40px; border-radius: 50%; background: ${index < 3 ? 'var(--bg-surface)' : 'var(--bg-surface-hover)'}; border: 1px solid ${index === 0 ? 'var(--color-primary-light)' : 'var(--border-color)'}; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; color: ${index === 0 ? 'var(--color-primary-light)' : 'var(--text-secondary)'};">
                                            ${student.name.charAt(0)}
                                        </div>
                                        ${student.name}
                                    </td>
                                    <td style="padding: 24px 32px; color: var(--text-secondary); font-size: 1.05rem;">
                                        ${Math.floor(student.totalPoints / 10)} مهمة
                                    </td>
                                    <td style="padding: 24px 32px; font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">
                                        ${student.totalPoints} 🌟
                                    </td>
                                    <td style="padding: 24px 32px;">
                                        <span style="background: ${student.totalPoints > 100 ? 'rgba(232, 194, 109, 0.15)' : 'rgba(161, 165, 171, 0.15)'}; color: ${student.totalPoints > 100 ? 'var(--color-primary-light)' : 'var(--text-tertiary)'}; border: 1px solid ${student.totalPoints > 100 ? 'rgba(232, 194, 109, 0.3)' : 'rgba(161, 165, 171, 0.3)'}; padding: 6px 16px; border-radius: 20px; font-size: 0.95rem; font-weight: 700; display: inline-block;">
                                            ${student.totalPoints > 100 ? 'الطور الذهبي 🏆' : 'الطور الفضي'}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}
