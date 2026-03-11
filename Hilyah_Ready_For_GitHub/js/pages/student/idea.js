import { Icons } from '../../components/icons.js';

export function ProgramIdea(store) {
    const c = (key) => (store && store.getState().content[key]) || key;
    return `
        <div style="animation: slideUpFade var(--transition-slow);">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 32px;">
                <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: rgba(232, 194, 109, 0.15); color: var(--color-primary-light); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(232, 194, 109, 0.3); flex-shrink:0;">
                    ${Icons.Idea}
                </div>
                <h1 data-editable="idea.page.title" style="margin: 0;">${c('idea.page.title')}</h1>
            </div>

            <div class="card idea-card" style="border-radius: var(--radius-xl); position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 40px;">
                <!-- Decor gradient bar -->
                <div style="position: absolute; top: 0; right: 0; width: 6px; height: 100%; background: linear-gradient(to bottom, var(--color-primary-light), var(--color-primary));"></div>
                
                <h2 style="font-size: 2.5rem; color: var(--text-primary); max-width: 900px; line-height: 1.4; font-weight: 800; margin: 0; padding-left: 8px;">
                    <span data-editable="idea.main.heading">${c('idea.main.heading')}</span><br/>
                    <span data-editable="idea.main.heading.highlight" style="color: var(--color-primary-dark);">${c('idea.main.heading.highlight')}</span>
                </h2>
                
                <p data-editable="idea.main.quote" class="idea-quote" style="font-size: 1.2rem; line-height: 1.85; color: var(--text-secondary); max-width: 900px; margin: 0; padding-right: 20px; border-right: 3px solid var(--color-primary-light);">
                    ${c('idea.main.quote')}
                </p>

                <div style="width: 100%; height: 1px; background: var(--border-color);"></div>

                <div class="idea-pillars">
                    <div>
                        <h3 style="color: var(--color-primary); margin-bottom: 16px; display: flex; align-items: center; gap: 12px; font-size: 1.3rem;">
                            <span style="font-size: 1.6rem;">📚</span>
                            <span data-editable="idea.pillar1.title">${c('idea.pillar1.title')}</span>
                        </h3>
                        <p data-editable="idea.pillar1.description" style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.85; margin:0;">
                            ${c('idea.pillar1.description')}
                        </p>
                    </div>
                    <div>
                        <h3 style="color: var(--color-primary-dark); margin-bottom: 16px; display: flex; align-items: center; gap: 12px; font-size: 1.3rem;">
                            <span style="font-size: 1.6rem;">🤝</span>
                            <span data-editable="idea.pillar2.title">${c('idea.pillar2.title')}</span>
                        </h3>
                        <p data-editable="idea.pillar2.description" style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.85; margin:0;">
                            ${c('idea.pillar2.description')}
                        </p>
                    </div>
                    <div>
                        <h3 style="color: var(--color-primary-light); margin-bottom: 16px; display: flex; align-items: center; gap: 12px; font-size: 1.3rem;">
                            <span style="font-size: 1.6rem;">⭐</span>
                            <span data-editable="idea.pillar3.title">${c('idea.pillar3.title')}</span>
                        </h3>
                        <p data-editable="idea.pillar3.description" style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.85; margin:0;">
                            ${c('idea.pillar3.description')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}
