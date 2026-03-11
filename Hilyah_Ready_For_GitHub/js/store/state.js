/**
 * Simple Reactive Data Store — CMS v2 + Submission System
 */

const defaultContent = {
    'hero.title': 'مرحباً بك،',
    'hero.subtitle': 'في برنامج حِلْيَة، نبني الانضباط والمعرفة والأخلاق النبيلة. استمر في تقدمك نحو التميز.',
    'nav.home': 'الرئيسية',
    'nav.idea': 'فكرة البرنامج',
    'nav.calendar': 'التقويم',
    'nav.tasks': 'المهام',
    'nav.points': 'النقاط',
    'dashboard.guide.title': 'لوحة التوجيه',
    'card.idea.title': 'فكرة البرنامج',
    'card.idea.description': 'تعرف على فلسفة وأهداف برنامج حلية لبناء الأخلاق والمهارات.',
    'card.calendar.title': 'التقويم',
    'card.calendar.description': 'جدولك الأسبوعي للمهام والمناشط المخطط لها بدقة.',
    'card.tasks.title': 'المهام',
    'card.tasks.description': 'استعرض، سلم، وتابع مهامك مقسمة حسب المسارات المختلفة.',
    'card.points.title': 'النقاط والإنجازات',
    'card.points.description': 'راقب تقدمك الحيازي وإنجازاتك وترتيبك بين أقرانك.',
    'idea.page.title': 'فكرة البرنامج',
    'idea.main.heading': 'رؤية تجمع بين الأصالة والمعاصرة',
    'idea.main.heading.highlight': 'لبناء شخصية متكاملة.',
    'idea.main.quote': '"حِلْيَة هو برنامج صُمم لمساعدة الطلاب على العيش بأخلاق نبيلة وعادات هادفة. من خلال التحديات المنظمة، الاستكشاف الفكري، والمسؤولية الاجتماعية، يبني الطلاب الانضباط، يوسعون مداركهم، ويهذبون شخصياتهم."',
    'idea.pillar1.title': 'التعلّم المستمر',
    'idea.pillar1.description': 'تشجيع فضول المعرفة كنمط حياة عبر مسارات قرائية وثقافية تلائم تطلعات الشباب المتجددة، ليكونوا قادة الفكر في المستقبل.',
    'idea.pillar2.title': 'المساهمة الاجتماعية',
    'idea.pillar2.description': 'صناعة الأثر في المحيط المباشر وتنمية جسور التواصل البنّاء مع كافة فئات المجتمع، لتحقيق المواطنة الإيجابية والفعلية.',
    'idea.pillar3.title': 'التميز الشخصي',
    'idea.pillar3.description': 'الارتقاء بالذات، وتنمية الذاكرة الحديدية والمهارات التقنية والإعلامية التي يتطلبها العصر لتسريع عجلة الابتكار.',
    'tasks.page.title': 'المهام الحالية',
    'tasks.page.subtitle': 'استعرض وسلّم مهامك في المسارات المختلفة',
    'points.page.title': 'النقاط والإنجازات',
    'points.page.subtitle': 'تابع تقدمك وأوسمتك في برنامج حِلْيَة',
    'calendar.page.title': 'التقويم',
    'calendar.page.subtitle': 'خطط لمهامك وعاداتك شهرياً',
    'ui.submit.task': 'تسليم المهمة',
    'ui.logout': 'تسجيل الخروج',
    'ui.leaderboard.title': 'النقاط العامة ولوحة الشرف',
    'admin.dashboard.title': 'لوحة تحكم المشرف',
    'admin.dashboard.subtitle': 'نظرة عامة على أداء وإنجازات المتدربين.',
};

const defaultFeatureVisibility = { idea: true, calendar: true, tasks: true, points: true };

class Store {
    constructor() {
        const savedState = localStorage.getItem('hilyah_state');
        const defaultState = {
            theme: localStorage.getItem('theme') || 'light',
            user: null,
            editMode: false,
            content: defaultContent,
            featureVisibility: defaultFeatureVisibility,
            tasks: [
                { id: 1, title: "قراءة 10 صفحات من كتاب", description: "قم بقراءة 10 صفحات من أي كتاب نافع ولخص ما تعلمته في تقرير موجز.", track: "الثقافي", submissionMethod: "كتابة ملخص", deadline: "2026-03-20", points: 10, status: "pending", disabled: false },
                { id: 2, title: "بناء صفحة شخصية بـ HTML", description: "أنشئ صفحة HTML تعريفية بنفسك تحتوي على صورة ونبذة وروابط التواصل.", track: "مسار تقني", submissionMethod: "رفع رابط أو ملف الكود", deadline: "2026-03-25", points: 30, status: "pending", disabled: false },
                { id: 3, title: "حفظ 5 كلمات إنجليزية جديدة", description: "احفظ 5 كلمات جديدة في اللغة الإنجليزية مع المعنى والجملة.", track: "الذاكرة الحديدية", submissionMethod: "تسجيل صوتي", deadline: "2026-03-18", points: 15, status: "pending", disabled: false },
                { id: 4, title: "عمل خيري في المجتمع", description: "شارك في نشاط خيري أو تطوعي وسجّل تجربتك وما تعلمته منها.", track: "الاجتماعي", submissionMethod: "كتابة تقرير", deadline: "2026-03-28", points: 20, status: "pending", disabled: false },
                { id: 5, title: "مشاهدة وثائقي علمي", description: "شاهد وثائقياً علمياً أو تاريخياً لا يقل عن 30 دقيقة واكتب مراجعة.", track: "الثقافي", submissionMethod: "كتابة مراجعة", deadline: "2026-03-22", points: 12, status: "pending", disabled: false },
                { id: 6, title: "تصميم واجهة تطبيق", description: "صمّم واجهة مستخدم لتطبيق جوال باستخدام أي أداة (Figma أو حتى رسم يدوي مصوّر).", track: "مسار تقني", submissionMethod: "رفع صور التصميم", deadline: "2026-04-01", points: 40, status: "pending", disabled: false },
                { id: 7, title: "حفظ صفحة قرآنية", description: "احفظ صفحة كاملة من القرآن الكريم وتلها بتجويد صحيح.", track: "الذاكرة الحديدية", submissionMethod: "تسجيل صوتي تلاوة", deadline: "2026-03-17", points: 25, status: "pending", disabled: false },
                { id: 8, title: "إجراء مقابلة مع شخصية ملهمة", description: "أجرِ مقابلة مع شخص ناجح في مجاله وسجّل أبرز ما تعلمته منه.", track: "الاجتماعي", submissionMethod: "كتابة ملخص المقابلة", deadline: "2026-04-05", points: 35, status: "pending", disabled: false },
            ],
            submissions: [],
            students: [
                { id: 1, name: "أحمد محمد العتيبي",  totalPoints: 0 },
                { id: 2, name: "سالم خالد الخالدي",  totalPoints: 0 },
                { id: 3, name: "عمر فهد الشمري",     totalPoints: 0 },
                { id: 4, name: "يوسف ناصر الحربي",   totalPoints: 0 },
                { id: 5, name: "فيصل عبدالله الدوسري",totalPoints: 0 },
                { id: 6, name: "محمد سعد القحطاني",  totalPoints: 0 },
                { id: 7, name: "خالد راشد المطيري",  totalPoints: 0 },
                { id: 8, name: "عبدالرحمن علي الغامدي",totalPoints: 0 },
            ]
        };

        if (savedState) {
            const parsed = JSON.parse(savedState);
            this.state = {
                ...defaultState,
                ...parsed,
                content: { ...defaultContent, ...(parsed.content || {}) },
                featureVisibility: { ...defaultFeatureVisibility, ...(parsed.featureVisibility || {}) },
                submissions: parsed.submissions || [],
                editMode: false,
            };
        } else {
            this.state = defaultState;
        }
        this.listeners = [];
    }

    getState() { return this.state; }
    getText(key) { return this.state.content[key] || key; }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        localStorage.setItem('hilyah_state', JSON.stringify(this.state));
        this.notify();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => { this.listeners = this.listeners.filter(l => l !== listener); };
    }

    notify() { this.listeners.forEach(l => l(this.state)); }

    // Auth
    login(user) { this.setState({ user }); }
    logout() { this.setState({ user: null, editMode: false }); window.location.hash = '#/login'; }
    toggleTheme() {
        const t = this.state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', t);
        this.setState({ theme: t });
        document.documentElement.setAttribute('data-theme', t);
    }

    // CMS Content
    updateContent(key, value) { this.setState({ content: { ...this.state.content, [key]: value } }); }
    batchUpdateContent(updates) { this.setState({ content: { ...this.state.content, ...updates } }); }
    resetContent(key) { this.setState({ content: { ...this.state.content, [key]: defaultContent[key] || key } }); }

    // Feature Visibility
    setFeatureVisibility(featureKey, visible) {
        this.setState({ featureVisibility: { ...this.state.featureVisibility, [featureKey]: visible } });
    }

    // Tasks CRUD
    addTask(task) {
        this.setState({ tasks: [...this.state.tasks, { ...task, id: Date.now(), status: 'pending', disabled: false }] });
    }
    updateTask(id, updates) {
        this.setState({ tasks: this.state.tasks.map(t => t.id === id ? { ...t, ...updates } : t) });
    }
    deleteTask(id) {
        this.setState({ tasks: this.state.tasks.filter(t => t.id !== id) });
    }
    toggleTaskDisabled(id) {
        this.setState({ tasks: this.state.tasks.map(t => t.id === id ? { ...t, disabled: !t.disabled } : t) });
    }

    // ── Submission System ──────────────────────────────────────────────────────

    /**
     * Student submits a task with optional content text.
     * Creates a submission record and marks task as 'submitted'.
     */
    submitTask(taskId, submissionContent = '') {
        const user = this.state.user;
        const task = this.state.tasks.find(t => t.id === taskId);
        if (!task) return;

        const newSubmission = {
            id: Date.now(),
            taskId,
            studentId: user.id || 'guest',
            studentName: user.name || 'الطالب',
            taskTitle: task.title,
            taskTrack: task.track,
            taskMaxPoints: task.points,
            submissionContent,
            submittedAt: new Date().toISOString(),
            status: 'pending', // pending | approved | rejected
            earnedPoints: null,
            adminComment: '',
        };

        this.setState({
            submissions: [...this.state.submissions, newSubmission],
            tasks: this.state.tasks.map(t => t.id === taskId ? { ...t, status: 'submitted' } : t),
        });
    }

    /**
     * Admin approves a submission with custom points and optional comment.
     * Updates the task status to 'completed' and adds earned points to the student.
     */
    approveSubmission(submissionId, earnedPoints, adminComment = '') {
        const sub = this.state.submissions.find(s => s.id === submissionId);
        if (!sub) return;

        const clampedPoints = Math.max(0, Math.min(sub.taskMaxPoints, earnedPoints));

        // Update submission
        const updatedSubmissions = this.state.submissions.map(s =>
            s.id === submissionId
                ? { ...s, status: 'approved', earnedPoints: clampedPoints, adminComment }
                : s
        );

        // Mark the task as completed and record earned points on it too
        const updatedTasks = this.state.tasks.map(t =>
            t.id === sub.taskId ? { ...t, status: 'completed', earnedPoints: clampedPoints, adminComment } : t
        );

        // Update student total points in the students array
        const updatedStudents = this.state.students.map(s =>
            s.name === sub.studentName
                ? { ...s, totalPoints: (s.totalPoints || 0) + clampedPoints }
                : s
        );

        this.setState({ submissions: updatedSubmissions, tasks: updatedTasks, students: updatedStudents });
    }

    /**
     * Admin rejects a submission — task goes back to 'pending', submission marked rejected.
     */
    rejectSubmission(submissionId, adminComment = '') {
        const sub = this.state.submissions.find(s => s.id === submissionId);
        if (!sub) return;

        const updatedSubmissions = this.state.submissions.map(s =>
            s.id === submissionId ? { ...s, status: 'rejected', adminComment } : s
        );
        const updatedTasks = this.state.tasks.map(t =>
            t.id === sub.taskId ? { ...t, status: 'pending' } : t
        );

        this.setState({ submissions: updatedSubmissions, tasks: updatedTasks });
    }

    // Edit Mode
    toggleEditMode() { this.setState({ editMode: !this.state.editMode }); }
}

export const store = new Store();
window._hilyahStore = store;
document.documentElement.setAttribute('data-theme', store.getState().theme);
