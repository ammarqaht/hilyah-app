import { Icons } from '../../components/icons.js';

export function AdminAddTask() {
    return `
        <div style="animation: slideUpFade var(--transition-slow); max-width: 900px; margin: 0 auto;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 40px;">
                <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: rgba(92, 196, 129, 0.1); color: var(--color-primary); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(92, 196, 129, 0.2);">
                    ${Icons.Idea}
                </div>
                <div>
                    <h1 style="margin: 0; font-size: 2.25rem;">إنشاء مهمة جديدة</h1>
                    <p style="margin: 4px 0 0 0; color: var(--text-secondary); font-size: 1.05rem;">قم بإضافة المهام والتحديات لتظهر للطلاب.</p>
                </div>
            </div>

            <div class="card" style="padding: 48px; border-radius: var(--radius-xl);">
                <form id="add-task-form">
                    <div class="form-group" style="margin-bottom: 32px;">
                        <label class="form-label" style="font-size: 1rem; margin-bottom: 12px;">عنوان المهمة</label>
                        <input type="text" id="task-title" class="form-input" placeholder="مثال: قراءة فصل من كتاب..." required style="padding: 16px; font-size: 1.05rem;" />
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 32px;">
                        <label class="form-label" style="font-size: 1rem; margin-bottom: 12px;">الوصف المكتوب</label>
                        <textarea id="task-desc" class="form-input" rows="5" placeholder="اشرح للطلاب ما المطلوب إنجازه بالتفصيل..." required style="resize: vertical; padding: 16px; font-size: 1.05rem;"></textarea>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label" style="font-size: 1rem; margin-bottom: 12px;">تصنيف / مسار المهمة</label>
                            <select id="task-track" class="form-input" required style="padding: 16px; font-size: 1.05rem;">
                                <option value="مسار تقني">مسار تقني</option>
                                <option value="الذاكرة الحديدية">الذاكرة الحديدية</option>
                                <option value="مسار إعلامي">مسار إعلامي</option>
                                <option value="الثقافي">الثقافي</option>
                                <option value="منوع">منوع</option>
                                <option value="اجتماعي">اجتماعي</option>
                            </select>
                        </div>
                        
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label" style="font-size: 1rem; margin-bottom: 12px;">نقاط الإنجاز</label>
                            <input type="number" id="task-points" class="form-input" placeholder="مثال: 30" required min="1" style="padding: 16px; font-size: 1.05rem;" />
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px;">
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label" style="font-size: 1rem; margin-bottom: 12px;">طريقة التسليم</label>
                            <select id="task-submethod" class="form-input" required style="padding: 16px; font-size: 1.05rem;">
                                <option value="رفع ملف">رفع ملف (صورة / كود)</option>
                                <option value="كتابة نص ملخص">كتابة نص / ملخص</option>
                                <option value="تسجيل صوتي">تسجيل صوتي</option>
                                <option value="إقرار بالإنجاز">إقرار بالإنجاز فقط</option>
                            </select>
                        </div>
                        
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label" style="font-size: 1rem; margin-bottom: 12px;">الموعد النهائي</label>
                            <input type="date" id="task-deadline" class="form-input" required style="padding: 16px; font-size: 1.05rem; font-family: inherit;" />
                        </div>
                    </div>

                    <div style="margin-top: 48px; display: flex; gap: 16px; justify-content: flex-end; padding-top: 32px; border-top: 1px solid var(--border-color);">
                        <a href="#/admin" class="btn btn-secondary" style="padding: 14px 28px; font-size: 1.05rem; font-weight: 600;">إلغاء</a>
                        <button type="submit" class="btn btn-primary" style="padding: 14px 40px; font-size: 1.05rem; font-weight: 600;">نشر المهمة والتحدي</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

AdminAddTask.attachEvents = (store) => {
    const form = document.getElementById('add-task-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const task = {
                title: document.getElementById('task-title').value,
                description: document.getElementById('task-desc').value,
                track: document.getElementById('task-track').value,
                points: parseInt(document.getElementById('task-points').value),
                submissionMethod: document.getElementById('task-submethod').value,
                deadline: document.getElementById('task-deadline').value
            };
            
            store.addTask(task);
            alert('تم نشر المهمة بنجاح!');
            window.location.hash = '#/admin/tasks';
        });
    }
};
