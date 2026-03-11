import { Icons } from '../../components/icons.js';
import { IconLibrary, IconList, IconLabels } from '../../components/iconLibrary.js';

/**
 * Admin Feature Builder — create dynamic sections/cards for the Student Dashboard
 */

const ACCENT_COLORS = [
    { label: 'أخضر', value: '#5CC481' },
    { label: 'ذهبي', value: '#E8C26D' },
    { label: 'فيروزي', value: '#51ADAD' },
    { label: 'برتقالي', value: '#FFA726' },
    { label: 'بنفسجي', value: '#9B72CF' },
    { label: 'أحمر', value: '#EF4444' },
];

export function AdminFeatureBuilder(store) {
    const features = store.getState().features;

    const renderFeatureRow = (feature) => `
        <tr class="feature-row" style="border-bottom: 1px solid var(--border-color); transition: background var(--transition-fast);" onmouseover="this.style.background='var(--bg-main)'" onmouseout="this.style.background='transparent'">
            <td style="padding: 20px 32px;">
                <div style="width: 44px; height: 44px; border-radius: var(--radius-sm); background: ${feature.color}22; border: 1px solid ${feature.color}44; color: ${feature.color}; display: flex; align-items: center; justify-content: center;">
                    ${IconLibrary[feature.icon] || IconLibrary['star']}
                </div>
            </td>
            <td style="padding: 20px 24px; font-weight: 700; font-size: 1.05rem; color: var(--text-primary);">${feature.name}</td>
            <td style="padding: 20px 24px; font-size: 0.95rem; color: var(--text-secondary); max-width: 300px;">${feature.description}</td>
            <td style="padding: 20px 24px; text-align: center;">
                <label style="position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer;">
                    <input type="checkbox" class="feature-toggle" data-id="${feature.id}" ${feature.visible ? 'checked' : ''} style="opacity: 0; width: 0; height: 0; position: absolute;">
                    <span style="position: absolute; inset: 0; background: ${feature.visible ? 'var(--color-primary)' : 'var(--bg-surface-hover)'}; border-radius: 12px; transition: all 0.3s; border: 1px solid var(--border-color);"></span>
                    <span style="position: absolute; top: 3px; ${feature.visible ? 'left: 22px' : 'left: 3px'}; width: 18px; height: 18px; background: white; border-radius: 50%; transition: all 0.3s; box-shadow: 0 1px 4px rgba(0,0,0,0.2);"></span>
                </label>
            </td>
            <td style="padding: 20px 24px; text-align: center;">
                <div style="display: flex; gap: 8px; justify-content: center;">
                    <button class="btn feature-delete-btn" data-id="${feature.id}" style="padding: 8px 14px; background: rgba(239, 68, 68, 0.1); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.3); font-weight: 600;" onmouseover="this.style.background='#EF4444'; this.style.color='white'" onmouseout="this.style.background='rgba(239, 68, 68, 0.1)'; this.style.color='#EF4444'">
                        حذف
                    </button>
                </div>
            </td>
        </tr>
    `;

    // Build icon picker HTML (8 per row)
    const iconPickerHtml = IconList.map(name => `
        <div class="icon-option" data-icon="${name}" style="
            width: 56px; height: 56px; border-radius: var(--radius-sm);
            display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
            cursor: pointer; border: 2px solid var(--border-color);
            transition: all 0.2s; padding: 6px;
            background: var(--bg-main);
        " title="${IconLabels[name] || name}"
           onmouseover="this.style.borderColor='var(--color-primary)'; this.style.color='var(--color-primary)'"
           onmouseout="if(!this.classList.contains('selected')) { this.style.borderColor='var(--border-color)'; this.style.color='inherit'; }">
            ${IconLibrary[name]}
        </div>
    `).join('');

    const colorPickerHtml = ACCENT_COLORS.map(c => `
        <div class="color-option" data-color="${c.value}" style="
            width: 40px; height: 40px; border-radius: 50%;
            background: ${c.value}; cursor: pointer;
            border: 3px solid transparent;
            transition: all 0.2s; box-shadow: 0 2px 8px ${c.value}44;
        " title="${c.label}"
           onmouseover="this.style.transform='scale(1.15)'"
           onmouseout="if(!this.classList.contains('selected')) this.style.transform='scale(1)'">
        </div>
    `).join('');

    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 40px;">
                <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: rgba(155, 114, 207, 0.15); color: #9B72CF; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(155, 114, 207, 0.3);">
                    ${Icons.Points}
                </div>
                <div>
                    <h1 style="margin: 0; font-size: 2.25rem;">بناء الميزات والأقسام</h1>
                    <p style="margin: 4px 0 0 0; color: var(--text-secondary); font-size: 1.05rem;">أنشئ أقساماً جديدة تظهر في لوحة الطالب دون الحاجة لتعديل الكود.</p>
                </div>
            </div>

            <!-- Create Feature Card -->
            <div class="card" style="padding: 40px; border-radius: var(--radius-xl); margin-bottom: 40px; border: 2px dashed var(--color-primary); background: rgba(92,196,129,0.02);">
                <h3 style="margin: 0 0 32px; font-size: 1.4rem; color: var(--color-primary);">+ إنشاء ميزة جديدة</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
                    <div class="form-group" style="margin: 0;">
                        <label class="form-label" style="font-size: 1rem; margin-bottom: 10px;">اسم الميزة (عربي)</label>
                        <input type="text" id="feat-name" class="form-input" placeholder="مثال: الإنجازات" style="padding: 14px 16px; font-size: 1.05rem;" />
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label class="form-label" style="font-size: 1rem; margin-bottom: 10px;">وصف مختصر</label>
                        <input type="text" id="feat-desc" class="form-input" placeholder="مثال: استعرض إنجازاتك المميزة..." style="padding: 14px 16px; font-size: 1.05rem;" />
                    </div>
                </div>

                <div style="margin-bottom: 32px;">
                    <label class="form-label" style="font-size: 1rem; margin-bottom: 16px; display: block;">اختر أيقونة</label>
                    <div id="icon-picker" style="display: flex; flex-wrap: wrap; gap: 10px;">
                        ${iconPickerHtml}
                    </div>
                    <input type="hidden" id="feat-icon" value="star" />
                </div>

                <div style="margin-bottom: 40px;">
                    <label class="form-label" style="font-size: 1rem; margin-bottom: 16px; display: block;">لون التمييز</label>
                    <div style="display: flex; gap: 16px; align-items: center;">
                        ${colorPickerHtml}
                        <input type="hidden" id="feat-color" value="#5CC481" />
                    </div>
                </div>

                <!-- Preview -->
                <div style="margin-bottom: 32px;">
                    <label class="form-label" style="font-size: 1rem; margin-bottom: 16px; display: block;">معاينة البطاقة</label>
                    <div id="feat-preview" style="display: inline-block; max-width: 280px; width: 100%;">
                        <div class="card" style="padding: 32px; display: flex; flex-direction: column; border-radius: var(--radius-lg);">
                            <div id="preview-icon" style="width: 56px; height: 56px; border-radius: var(--radius-md); background: rgba(92,196,129,0.15); color: #5CC481; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; border: 1px solid rgba(92,196,129,0.3);">
                                ${IconLibrary['star']}
                            </div>
                            <h3 id="preview-name" style="font-size: 1.2rem; margin-bottom: 8px; color: var(--text-primary);">اسم الميزة</h3>
                            <p id="preview-desc" style="font-size: 0.9rem; color: var(--text-secondary); margin: 0; line-height: 1.5;">وصف الميزة يظهر هنا</p>
                        </div>
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end;">
                    <button id="feat-create-btn" class="btn btn-primary" style="padding: 14px 40px; font-size: 1.1rem; font-weight: 700;">
                        نشر الميزة في لوحة الطالب 🚀
                    </button>
                </div>
            </div>

            <!-- Existing Features Table -->
            <div class="card" style="padding: 0; overflow: hidden; border-radius: var(--radius-xl);">
                <div style="padding: 24px 32px; border-bottom: 1px solid var(--border-color); background: var(--bg-surface-hover);">
                    <h3 style="margin: 0; font-size: 1.25rem;">الميزات الحالية</h3>
                </div>
                ${features.length > 0 ? `
                    <table style="width: 100%; border-collapse: collapse; text-align: right;">
                        <thead style="background: var(--bg-surface-hover);">
                            <tr>
                                <th style="padding: 16px 32px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border-color);">الأيقونة</th>
                                <th style="padding: 16px 24px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border-color);">الاسم</th>
                                <th style="padding: 16px 24px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border-color);">الوصف</th>
                                <th style="padding: 16px 24px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border-color); text-align: center;">ظاهرة</th>
                                <th style="padding: 16px 24px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border-color); text-align: center;">إجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${features.map(f => renderFeatureRow(f)).join('')}
                        </tbody>
                    </table>
                ` : `
                    <div style="padding: 80px 32px; text-align: center;">
                        <div style="font-size: 4rem; margin-bottom: 16px; opacity: 0.5;">✦</div>
                        <h3 style="margin-bottom: 8px; color: var(--text-primary);">لا توجد ميزات مُضافة بعد</h3>
                        <p style="color: var(--text-secondary); font-size: 1.05rem;">أنشئ أول ميزة باستخدام النموذج أعلاه وستظهر فوراً في لوحة الطالب.</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

AdminFeatureBuilder.attachEvents = (store) => {
    let selectedIcon = 'star';
    let selectedColor = '#5CC481';

    // Select first icon by default
    const firstIcon = document.querySelector('.icon-option[data-icon="star"]');
    if (firstIcon) { firstIcon.classList.add('selected'); firstIcon.style.borderColor = 'var(--color-primary)'; firstIcon.style.color = 'var(--color-primary)'; }
    const firstColor = document.querySelector('.color-option[data-color="#5CC481"]');
    if (firstColor) { firstColor.classList.add('selected'); firstColor.style.border = '3px solid var(--text-primary)'; }

    // Icon picker
    document.querySelectorAll('.icon-option').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.icon-option').forEach(o => {
                o.classList.remove('selected');
                o.style.borderColor = 'var(--border-color)';
                o.style.color = 'inherit';
            });
            el.classList.add('selected');
            el.style.borderColor = 'var(--color-primary)';
            el.style.color = 'var(--color-primary)';
            selectedIcon = el.getAttribute('data-icon');
            document.getElementById('feat-icon').value = selectedIcon;
            // Update preview
            const pi = document.getElementById('preview-icon');
            if (pi) {
                pi.innerHTML = IconLibrary[selectedIcon] || '';
                pi.style.background = `${selectedColor}22`;
                pi.style.color = selectedColor;
                pi.style.borderColor = `${selectedColor}44`;
            }
        });
    });

    // Color picker
    document.querySelectorAll('.color-option').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(o => {
                o.classList.remove('selected');
                o.style.border = '3px solid transparent';
                o.style.transform = 'scale(1)';
            });
            el.classList.add('selected');
            el.style.border = '3px solid var(--text-primary)';
            el.style.transform = 'scale(1.15)';
            selectedColor = el.getAttribute('data-color');
            document.getElementById('feat-color').value = selectedColor;
            // Update preview
            const pi = document.getElementById('preview-icon');
            if (pi) {
                pi.style.background = `${selectedColor}22`;
                pi.style.color = selectedColor;
                pi.style.borderColor = `${selectedColor}44`;
            }
        });
    });

    // Live preview name/desc
    document.getElementById('feat-name')?.addEventListener('input', (e) => {
        const el = document.getElementById('preview-name');
        if (el) el.textContent = e.target.value || 'اسم الميزة';
    });
    document.getElementById('feat-desc')?.addEventListener('input', (e) => {
        const el = document.getElementById('preview-desc');
        if (el) el.textContent = e.target.value || 'وصف الميزة يظهر هنا';
    });

    // Create feature
    document.getElementById('feat-create-btn')?.addEventListener('click', () => {
        const name = document.getElementById('feat-name')?.value?.trim();
        const desc = document.getElementById('feat-desc')?.value?.trim();
        if (!name) { alert('الرجاء إدخال اسم الميزة'); return; }
        store.addFeature({ name, description: desc, icon: selectedIcon, color: selectedColor });
        alert(`✓ تم إضافة ميزة "${name}" بنجاح! ستظهر الآن في لوحة الطالب.`);
        // Re-render the page
        window.location.hash = window.location.hash;
        window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    // Toggle visibility
    document.querySelectorAll('.feature-toggle').forEach(chk => {
        chk.addEventListener('change', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            store.updateFeature(id, { visible: e.target.checked });
        });
    });

    // Delete feature
    document.querySelectorAll('.feature-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('.feature-delete-btn').getAttribute('data-id'));
            if (confirm('حذف هذه الميزة نهائياً؟')) {
                store.deleteFeature(id);
                window.dispatchEvent(new HashChangeEvent('hashchange'));
            }
        });
    });
};
