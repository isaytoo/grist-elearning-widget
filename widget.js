/**
 * Grist E-Learning Widget
 * Copyright 2026 Said Hamadou (isaytoo)
 * Licensed under the Apache License, Version 2.0
 * https://github.com/isaytoo/grist-elearning-widget
 */

// ============================================================================
// STATE
// ============================================================================

const state = {
  courses: [],
  chapters: [],
  lessons: [],
  quizzes: [],
  progress: [],
  currentCourse: null,
  currentLesson: null,
  currentQuizAnswers: {},
  userEmail: null,
  learnerName: null,
  mappedColumns: {},
  isReady: false,
  lang: 'fr'
};

// ============================================================================
// TRANSLATIONS
// ============================================================================

const translations = {
  fr: {
    loading: 'Chargement...',
    progression: 'Progression',
    getCertificate: 'Obtenir le certificat',
    course: 'Cours',
    lessons: 'leçons',
    welcomeTitle: 'Bienvenue dans votre formation',
    welcomeText: 'Sélectionnez une leçon dans le menu pour commencer',
    markAsWatched: 'Marquer comme vu',
    lesson: 'Leçon',
    video: 'Vidéo',
    quiz: 'Quiz',
    exercise: 'Exercice',
    noContent: 'Aucun contenu disponible.',
    completed: 'Terminé',
    testKnowledge: 'Testez vos connaissances',
    question: 'question',
    validateAnswer: 'Valider ma réponse',
    congratulations: 'Félicitations !',
    notQuite: 'Pas tout à fait...',
    correctAnswer: 'Vous avez répondu correctement !',
    theCorrectAnswer: 'La bonne réponse était :',
    retry: 'Réessayer',
    nextLesson: 'Leçon suivante',
    previous: 'Précédent',
    next: 'Suivant',
    markAsCompleted: 'Marquer comme terminé',
    lessonCompleted: '✅ Leçon marquée comme terminée !',
    videoWatched: '✅ Vidéo marquée comme vue !',
    courseCompleted: '🎉 Félicitations ! Vous avez terminé le cours !',
    certificateTitle: 'Certificat de Réussite',
    certificateText1: 'Ce certificat atteste que',
    certificateText2: 'a complété avec succès la formation',
    issuedOn: 'Délivré le',
    signature: 'Signature',
    download: 'Télécharger',
    min: 'min',
    rateLesson: 'Notez cette leçon',
    thankYouRating: 'Merci pour votre note !',
    yourRating: 'Votre note',
    welcomeModal: 'Bienvenue !',
    enterName: 'Entrez votre nom pour personnaliser votre expérience et votre certificat',
    yourFullName: 'Votre nom complet',
    startLearning: 'Commencer'
  },
  en: {
    loading: 'Loading...',
    progression: 'Progress',
    getCertificate: 'Get certificate',
    course: 'Course',
    lessons: 'lessons',
    welcomeTitle: 'Welcome to your training',
    welcomeText: 'Select a lesson from the menu to start',
    markAsWatched: 'Mark as watched',
    lesson: 'Lesson',
    video: 'Video',
    quiz: 'Quiz',
    exercise: 'Exercise',
    noContent: 'No content available.',
    completed: 'Completed',
    testKnowledge: 'Test your knowledge',
    question: 'question',
    validateAnswer: 'Submit answer',
    congratulations: 'Congratulations!',
    notQuite: 'Not quite...',
    correctAnswer: 'You answered correctly!',
    theCorrectAnswer: 'The correct answer was:',
    retry: 'Retry',
    nextLesson: 'Next lesson',
    previous: 'Previous',
    next: 'Next',
    markAsCompleted: 'Mark as completed',
    lessonCompleted: '✅ Lesson marked as completed!',
    videoWatched: '✅ Video marked as watched!',
    courseCompleted: '🎉 Congratulations! You have completed the course!',
    certificateTitle: 'Certificate of Completion',
    certificateText1: 'This certifies that',
    certificateText2: 'has successfully completed the training',
    issuedOn: 'Issued on',
    signature: 'Signature',
    download: 'Download',
    min: 'min',
    rateLesson: 'Rate this lesson',
    thankYouRating: 'Thank you for your rating!',
    yourRating: 'Your rating',
    welcomeModal: 'Welcome!',
    enterName: 'Enter your name to personalize your experience and certificate',
    yourFullName: 'Your full name',
    startLearning: 'Start'
  }
};

function t(key) {
  return translations[state.lang]?.[key] || translations.fr[key] || key;
}

function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem('elearning_lang', lang);
  updateUILanguage();
}

function loadLanguage() {
  const saved = localStorage.getItem('elearning_lang');
  if (saved && (saved === 'fr' || saved === 'en')) {
    state.lang = saved;
  } else {
    const browserLang = navigator.language?.substring(0, 2);
    state.lang = browserLang === 'en' ? 'en' : 'fr';
  }
  updateLangToggle();
}

function updateLangToggle() {
  const toggle = document.getElementById('langToggle');
  toggle.setAttribute('data-lang', state.lang);
  toggle.querySelectorAll('.lang-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === state.lang);
  });
}

function updateUILanguage() {
  // Update static UI elements
  document.querySelector('.progress-label').textContent = t('progression');
  document.querySelector('#btnCertificate span:last-child').textContent = t('getCertificate');
  document.querySelector('#welcomeTitle').textContent = t('welcomeTitle');
  document.querySelector('#welcomeText').textContent = t('welcomeText');
  document.querySelector('#btnMarkWatched').innerHTML = `<span class="icon">✓</span> ${t('markAsWatched')}`;
  document.querySelector('#btnPrevLesson span').textContent = t('previous');
  document.querySelector('#btnNextLessonNav span').textContent = t('next');
  document.querySelector('#certificateModal h1').textContent = t('certificateTitle');
  document.querySelector('#certificateModal .certificate-text').textContent = t('certificateText1');
  document.querySelectorAll('#certificateModal .certificate-text')[1].textContent = t('certificateText2');
  document.querySelector('.certificate-signature p').textContent = t('signature');
  document.querySelector('#btnDownloadCertificate').innerHTML = `<span class="icon">📥</span> ${t('download')}`;
  document.querySelector('#loadingOverlay p').textContent = t('loading');
  
  // Name modal
  document.querySelector('#nameModalTitle').textContent = t('welcomeModal');
  document.querySelector('#nameModalText').textContent = t('enterName');
  document.querySelector('#learnerNameInput').placeholder = t('yourFullName');
  document.querySelector('#btnStartText').textContent = t('startLearning');
  
  // Re-render dynamic content if course is loaded
  if (state.currentCourse) {
    renderCourse();
  }
  if (state.currentLesson) {
    loadLesson(state.currentLesson);
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

grist.ready({
  requiredAccess: 'full',
  columns: [
    { name: 'Course_Title', title: 'Titre du cours', type: 'Any' },
    { name: 'Course_Description', title: 'Description du cours', type: 'Any', optional: true },
    { name: 'Course_Thumbnail', title: 'Image du cours', type: 'Any', optional: true },
    { name: 'Chapter_Title', title: 'Titre du chapitre', type: 'Any', optional: true },
    { name: 'Chapter_Order', title: 'Ordre du chapitre', type: 'Any', optional: true },
    { name: 'Lesson_Title', title: 'Titre de la leçon', type: 'Any', optional: true },
    { name: 'Lesson_Type', title: 'Type de leçon', type: 'Any', optional: true },
    { name: 'Lesson_Content', title: 'Contenu de la leçon', type: 'Any', optional: true },
    { name: 'Lesson_VideoUrl', title: 'URL de la vidéo', type: 'Any', optional: true },
    { name: 'Lesson_Duration', title: 'Durée (min)', type: 'Any', optional: true },
    { name: 'Lesson_Order', title: 'Ordre de la leçon', type: 'Any', optional: true },
    { name: 'Quiz_Question', title: 'Question du quiz', type: 'Any', optional: true },
    { name: 'Quiz_Options', title: 'Options (séparées par |)', type: 'Any', optional: true },
    { name: 'Quiz_CorrectAnswer', title: 'Réponse correcte', type: 'Any', optional: true }
  ]
});

grist.onRecords(async (records, mappings) => {
  state.mappedColumns = mappings || {};
  
  // Si aucun enregistrement, proposer de créer la table démo
  if (!records || records.length === 0) {
    await checkAndCreateDemoTable();
    return;
  }
  
  await processRecords(records);
  hideLoading();
  state.isReady = true;
});

grist.onRecord(async (record) => {
  if (!state.isReady || !record) return;
  // When a specific record is selected, navigate to that lesson
  const lessonId = record.id;
  const lesson = state.lessons.find(l => l.id === lessonId);
  if (lesson) {
    await loadLesson(lesson);
  }
});

// Get user email
async function getUserEmail() {
  try {
    const tokenInfo = await grist.docApi.getAccessToken({ readOnly: false });
    if (tokenInfo && tokenInfo.userId) {
      // Try to get email from a helper table or use a default
      state.userEmail = `user_${tokenInfo.userId}`;
    }
  } catch (e) {
    console.warn('Could not get user info:', e);
    state.userEmail = 'anonymous';
  }
  updateUserDisplay();
}

getUserEmail();

// ============================================================================
// DEMO TABLE CREATION
// ============================================================================

async function checkAndCreateDemoTable() {
  const content = document.getElementById('lessonContent');
  
  // Check if Elearning table already exists
  let elearningExists = false;
  try {
    const tables = await grist.docApi.listTables();
    elearningExists = tables.includes('Elearning');
  } catch (e) {
    console.warn('Could not list tables:', e);
  }
  
  if (elearningExists) {
    // Table exists but widget is not linked to it - show instructions
    content.innerHTML = `
      <div class="welcome-screen" style="text-align:center;padding:40px;">
        <div style="font-size:64px;margin-bottom:20px;">📋</div>
        <h2 style="margin-bottom:16px;">${state.lang === 'fr' ? 'Table "Elearning" détectée' : 'Table "Elearning" detected'}</h2>
        <div style="text-align:left;max-width:400px;margin:24px auto;padding:20px;background:var(--bg-secondary);border-radius:8px;">
          <p style="font-weight:600;margin-bottom:12px;">${state.lang === 'fr' ? 'Pour configurer le widget :' : 'To configure the widget:'}</p>
          <ol style="margin:0;padding-left:20px;line-height:1.8;">
            <li>${state.lang === 'fr' ? 'Cliquez sur "Données source" (panneau de droite)' : 'Click "Data source" (right panel)'}</li>
            <li>${state.lang === 'fr' ? 'Sélectionnez la table "Elearning"' : 'Select the "Elearning" table'}</li>
            <li>${state.lang === 'fr' ? 'Mappez chaque colonne (elles ont le même nom)' : 'Map each column (they have the same name)'}</li>
          </ol>
        </div>
      </div>
    `;
  } else {
    // Table doesn't exist - offer to create it
    content.innerHTML = `
      <div class="welcome-screen" style="text-align:center;padding:40px;">
        <div style="font-size:64px;margin-bottom:20px;">📚</div>
        <h2 style="margin-bottom:16px;">${state.lang === 'fr' ? 'Bienvenue dans E-Learning' : 'Welcome to E-Learning'}</h2>
        <p style="margin-bottom:24px;color:var(--text-secondary);">
          ${state.lang === 'fr' 
            ? 'Créez une table de démonstration pour découvrir le widget E-Learning.' 
            : 'Create a demo table to explore the E-Learning widget.'}
        </p>
        <button id="btnCreateDemo" class="btn-primary" style="padding:12px 24px;font-size:16px;cursor:pointer;">
          ${state.lang === 'fr' ? '✨ Créer la table de démonstration' : '✨ Create demo table'}
        </button>
      </div>
    `;
    document.getElementById('btnCreateDemo').addEventListener('click', createDemoData);
  }
  hideLoading();
}

async function createDemoData() {
  const content = document.getElementById('lessonContent');
  content.innerHTML = `
    <div class="welcome-screen" style="text-align:center;padding:40px;">
      <div style="font-size:64px;margin-bottom:20px;">⏳</div>
      <h2>${state.lang === 'fr' ? 'Création en cours...' : 'Creating...'}</h2>
    </div>
  `;
  
  try {
    // Demo data for E-Learning
    const demoRecords = [
      // Chapter 1: Les bases
      {
        Course_Title: 'Introduction à Grist',
        Course_Thumbnail: '',
        Chapter_Title: 'Les bases',
        Chapter_Order: 1,
        Lesson_Title: 'Bienvenue dans Grist',
        Lesson_Type: 'video',
        Lesson_Content: 'Bienvenue dans cette formation ! Grist est un tableur moderne qui combine la simplicité des feuilles de calcul avec la puissance des bases de données.',
        Video_URL: 'https://www.youtube.com/embed/XYZ123',
        Duration: 5,
        Lesson_Order: 1,
        Quiz_Question: '',
        Quiz_Options: '',
        Quiz_CorrectAnswer: ''
      },
      {
        Course_Title: 'Introduction à Grist',
        Course_Thumbnail: '',
        Chapter_Title: 'Les bases',
        Chapter_Order: 1,
        Lesson_Title: 'Créer votre premier document',
        Lesson_Type: 'text',
        Lesson_Content: "Pour créer votre premier document Grist :\n\n1. Cliquez sur 'Nouveau document'\n2. Choisissez un modèle ou partez de zéro\n3. Nommez votre document\n\nVous pouvez maintenant ajouter des tables et des colonnes !",
        Video_URL: '',
        Duration: 8,
        Lesson_Order: 2,
        Quiz_Question: '',
        Quiz_Options: '',
        Quiz_CorrectAnswer: ''
      },
      {
        Course_Title: 'Introduction à Grist',
        Course_Thumbnail: '',
        Chapter_Title: 'Les bases',
        Chapter_Order: 1,
        Lesson_Title: 'Quiz Les bases',
        Lesson_Type: 'quiz',
        Lesson_Content: 'Testez vos connaissances sur les bases de Grist.',
        Video_URL: '',
        Duration: 2,
        Lesson_Order: 3,
        Quiz_Question: 'Comment créer un nouveau document dans Grist ?',
        Quiz_Options: 'Fichier > Nouveau|Cliquer sur "Nouveau document"|Ctrl+N|Toutes ces réponses',
        Quiz_CorrectAnswer: '1'
      },
      // Chapter 2: Les formules
      {
        Course_Title: 'Introduction à Grist',
        Course_Thumbnail: '',
        Chapter_Title: 'Les formules',
        Chapter_Order: 2,
        Lesson_Title: 'Introduction aux formules',
        Lesson_Type: 'video',
        Lesson_Content: 'Les formules dans Grist utilisent Python. Elles permettent de calculer des valeurs automatiquement.',
        Video_URL: 'https://www.youtube.com/embed/ABC456',
        Duration: 10,
        Lesson_Order: 4,
        Quiz_Question: '',
        Quiz_Options: '',
        Quiz_CorrectAnswer: ''
      },
      {
        Course_Title: 'Introduction à Grist',
        Course_Thumbnail: '',
        Chapter_Title: 'Les formules',
        Chapter_Order: 2,
        Lesson_Title: 'Formules avancées',
        Lesson_Type: 'text',
        Lesson_Content: "Utilisez Table.lookupOne() pour rechercher des données dans d'autres tables.\n\nExemple :\n```python\nClients.lookupOne(Email=$Email).Nom\n```",
        Video_URL: '',
        Duration: 12,
        Lesson_Order: 5,
        Quiz_Question: '',
        Quiz_Options: '',
        Quiz_CorrectAnswer: ''
      },
      {
        Course_Title: 'Introduction à Grist',
        Course_Thumbnail: '',
        Chapter_Title: 'Les formules',
        Chapter_Order: 2,
        Lesson_Title: 'Quiz Formules',
        Lesson_Type: 'quiz',
        Lesson_Content: 'Testez vos connaissances sur les formules.',
        Video_URL: '',
        Duration: 3,
        Lesson_Order: 6,
        Quiz_Question: 'Quel langage utilise Grist pour les formules ?',
        Quiz_Options: 'JavaScript|Python|SQL|Excel',
        Quiz_CorrectAnswer: '1'
      },
      // Chapter 3: Les widgets
      {
        Course_Title: 'Introduction à Grist',
        Course_Thumbnail: '',
        Chapter_Title: 'Les widgets',
        Chapter_Order: 3,
        Lesson_Title: 'Widgets personnalisés',
        Lesson_Type: 'video',
        Lesson_Content: "Les widgets personnalisés permettent d'étendre les fonctionnalités de Grist avec des interfaces sur mesure.",
        Video_URL: 'https://www.youtube.com/embed/DEF789',
        Duration: 7,
        Lesson_Order: 7,
        Quiz_Question: '',
        Quiz_Options: '',
        Quiz_CorrectAnswer: ''
      },
      {
        Course_Title: 'Introduction à Grist',
        Course_Thumbnail: '',
        Chapter_Title: 'Les widgets',
        Chapter_Order: 3,
        Lesson_Title: 'Installer un widget',
        Lesson_Type: 'text',
        Lesson_Content: "Pour installer un widget personnalisé :\n\n1. Ajoutez une nouvelle vue 'Custom'\n2. Collez l'URL du widget\n3. Configurez les colonnes mappées\n\nVisitez gristup.fr pour découvrir notre marketplace de widgets !",
        Video_URL: '',
        Duration: 5,
        Lesson_Order: 8,
        Quiz_Question: '',
        Quiz_Options: '',
        Quiz_CorrectAnswer: ''
      },
      {
        Course_Title: 'Introduction à Grist',
        Course_Thumbnail: '',
        Chapter_Title: 'Les widgets',
        Chapter_Order: 3,
        Lesson_Title: 'Quiz final',
        Lesson_Type: 'quiz',
        Lesson_Content: 'Quiz final sur les widgets.',
        Video_URL: '',
        Duration: 3,
        Lesson_Order: 9,
        Quiz_Question: 'Où trouver des widgets personnalisés pour Grist ?',
        Quiz_Options: 'Sur github.com uniquement|Sur gristup.fr|Dans les paramètres Grist|Nulle part',
        Quiz_CorrectAnswer: '1'
      }
    ];
    
    // Create the Elearning table with all required columns
    const tableId = 'Elearning';
    
    await grist.docApi.applyUserActions([
      // Create table with columns
      ['AddTable', tableId, [
        { id: 'Course_Title', type: 'Text' },
        { id: 'Course_Thumbnail', type: 'Text' },
        { id: 'Chapter_Title', type: 'Text' },
        { id: 'Chapter_Order', type: 'Int' },
        { id: 'Lesson_Title', type: 'Text' },
        { id: 'Lesson_Type', type: 'Choice', widgetOptions: JSON.stringify({ choices: ['video', 'text', 'quiz'] }) },
        { id: 'Lesson_Content', type: 'Text' },
        { id: 'Video_URL', type: 'Text' },
        { id: 'Duration', type: 'Int' },
        { id: 'Lesson_Order', type: 'Int' },
        { id: 'Quiz_Question', type: 'Text' },
        { id: 'Quiz_Options', type: 'Text' },
        { id: 'Quiz_CorrectAnswer', type: 'Text' }
      ]]
    ]);
    
    // Add demo records to the new table
    await grist.docApi.applyUserActions([
      ['BulkAddRecord', tableId, demoRecords.map(() => null), {
        Course_Title: demoRecords.map(r => r.Course_Title),
        Course_Thumbnail: demoRecords.map(r => r.Course_Thumbnail),
        Chapter_Title: demoRecords.map(r => r.Chapter_Title),
        Chapter_Order: demoRecords.map(r => r.Chapter_Order),
        Lesson_Title: demoRecords.map(r => r.Lesson_Title),
        Lesson_Type: demoRecords.map(r => r.Lesson_Type),
        Lesson_Content: demoRecords.map(r => r.Lesson_Content),
        Video_URL: demoRecords.map(r => r.Video_URL),
        Duration: demoRecords.map(r => r.Duration),
        Lesson_Order: demoRecords.map(r => r.Lesson_Order),
        Quiz_Question: demoRecords.map(r => r.Quiz_Question),
        Quiz_Options: demoRecords.map(r => r.Quiz_Options),
        Quiz_CorrectAnswer: demoRecords.map(r => r.Quiz_CorrectAnswer)
      }]
    ]);
    
    // Show success message with instructions
    content.innerHTML = `
      <div class="welcome-screen" style="text-align:center;padding:40px;">
        <div style="font-size:64px;margin-bottom:20px;">✅</div>
        <h2>${state.lang === 'fr' ? 'Table "Elearning" créée avec succès !' : 'Table "Elearning" created successfully!'}</h2>
        <div style="text-align:left;max-width:400px;margin:24px auto;padding:20px;background:var(--bg-secondary);border-radius:8px;">
          <p style="font-weight:600;margin-bottom:12px;">${state.lang === 'fr' ? 'Pour terminer la configuration :' : 'To complete setup:'}</p>
          <ol style="margin:0;padding-left:20px;line-height:1.8;">
            <li>${state.lang === 'fr' ? 'Cliquez sur "Données source" (panneau de droite)' : 'Click "Data source" (right panel)'}</li>
            <li>${state.lang === 'fr' ? 'Sélectionnez la table "Elearning"' : 'Select the "Elearning" table'}</li>
            <li>${state.lang === 'fr' ? 'Mappez chaque colonne (elles ont le même nom)' : 'Map each column (they have the same name)'}</li>
          </ol>
        </div>
      </div>
    `;
    
  } catch (error) {
    console.error('Error creating demo data:', error);
    content.innerHTML = `
      <div class="welcome-screen" style="text-align:center;padding:40px;">
        <div style="font-size:64px;margin-bottom:20px;">❌</div>
        <h2>${state.lang === 'fr' ? 'Erreur' : 'Error'}</h2>
        <p style="color:var(--text-secondary);">${error.message}</p>
        <p style="margin-top:16px;font-size:14px;color:var(--text-secondary);">
          ${state.lang === 'fr' 
            ? 'Assurez-vous que vous avez les droits de modification sur ce document.' 
            : 'Make sure you have edit permissions on this document.'}
        </p>
      </div>
    `;
  }
}

// ============================================================================
// DATA PROCESSING
// ============================================================================

async function processRecords(records) {
  if (!records || records.length === 0) {
    showWelcomeScreen();
    return;
  }

  const m = state.mappedColumns;
  
  // Extract unique courses
  const coursesMap = new Map();
  const chaptersMap = new Map();
  const lessonsMap = new Map();
  
  records.forEach((record, index) => {
    const courseTitle = getField(record, m.Course_Title);
    const chapterTitle = getField(record, m.Chapter_Title);
    const lessonTitle = getField(record, m.Lesson_Title);
    
    // Course
    if (courseTitle && !coursesMap.has(courseTitle)) {
      coursesMap.set(courseTitle, {
        id: `course_${coursesMap.size}`,
        title: courseTitle,
        description: getField(record, m.Course_Description) || '',
        thumbnail: getField(record, m.Course_Thumbnail) || ''
      });
    }
    
    // Chapter
    const chapterKey = `${courseTitle}|${chapterTitle}`;
    if (chapterTitle && !chaptersMap.has(chapterKey)) {
      chaptersMap.set(chapterKey, {
        id: `chapter_${chaptersMap.size}`,
        courseTitle: courseTitle,
        title: chapterTitle,
        order: getField(record, m.Chapter_Order) || chaptersMap.size
      });
    }
    
    // Lesson
    if (lessonTitle) {
      const lessonKey = `${chapterKey}|${lessonTitle}`;
      if (!lessonsMap.has(lessonKey)) {
        const quizQuestion = getField(record, m.Quiz_Question);
        const quizOptions = getField(record, m.Quiz_Options);
        const quizCorrect = getField(record, m.Quiz_CorrectAnswer);
        
        let quiz = null;
        if (quizQuestion && quizOptions) {
          quiz = {
            question: quizQuestion,
            options: quizOptions.split('|').map(o => o.trim()),
            correctAnswer: parseInt(quizCorrect) || 0
          };
        }
        
        lessonsMap.set(lessonKey, {
          id: record.id,
          chapterKey: chapterKey,
          chapterTitle: chapterTitle,
          courseTitle: courseTitle,
          title: lessonTitle,
          type: getField(record, m.Lesson_Type) || 'text',
          content: getField(record, m.Lesson_Content) || '',
          videoUrl: getField(record, m.Lesson_VideoUrl) || '',
          duration: getField(record, m.Lesson_Duration) || 0,
          order: getField(record, m.Lesson_Order) || lessonsMap.size,
          quiz: quiz
        });
      }
    }
  });
  
  state.courses = Array.from(coursesMap.values());
  state.chapters = Array.from(chaptersMap.values()).sort((a, b) => a.order - b.order);
  state.lessons = Array.from(lessonsMap.values()).sort((a, b) => a.order - b.order);
  
  // Load progress from localStorage
  loadProgress();
  
  // Set current course
  if (state.courses.length > 0) {
    state.currentCourse = state.courses[0];
    renderCourse();
  } else {
    showWelcomeScreen();
  }
}

function getField(record, fieldName) {
  if (!fieldName) return null;
  return record[fieldName] || null;
}

// ============================================================================
// PROGRESS MANAGEMENT
// ============================================================================

function loadProgress() {
  try {
    const key = `elearning_progress_${state.userEmail}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      state.progress = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Could not load progress:', e);
    state.progress = [];
  }
}

function saveProgress() {
  try {
    const key = `elearning_progress_${state.userEmail}`;
    localStorage.setItem(key, JSON.stringify(state.progress));
  } catch (e) {
    console.warn('Could not save progress:', e);
  }
}

function isLessonCompleted(lessonId) {
  return state.progress.some(p => p.lessonId === lessonId && p.completed);
}

function markLessonCompleted(lessonId, score = null) {
  const existing = state.progress.find(p => p.lessonId === lessonId);
  if (existing) {
    existing.completed = true;
    existing.completedAt = new Date().toISOString();
    if (score !== null) existing.score = score;
  } else {
    state.progress.push({
      lessonId: lessonId,
      completed: true,
      completedAt: new Date().toISOString(),
      score: score
    });
  }
  saveProgress();
  updateProgressDisplay();
  renderChaptersNav();
  checkCourseCompletion();
}

function getProgressPercentage() {
  if (state.lessons.length === 0) return 0;
  const completed = state.lessons.filter(l => isLessonCompleted(l.id)).length;
  return Math.round((completed / state.lessons.length) * 100);
}

function checkCourseCompletion() {
  const percentage = getProgressPercentage();
  const btnCertificate = document.getElementById('btnCertificate');
  if (percentage === 100) {
    btnCertificate.disabled = false;
    showToast(t('courseCompleted'), 'success');
  }
}

// ============================================================================
// RENDERING
// ============================================================================

function renderCourse() {
  if (!state.currentCourse) return;
  
  // Update header
  document.getElementById('courseTitle').textContent = state.currentCourse.title;
  document.getElementById('courseMeta').textContent = `${state.lessons.length} ${t('lessons')}`;
  
  // Update thumbnail
  const thumbnailEl = document.getElementById('courseThumbnail');
  if (state.currentCourse.thumbnail) {
    thumbnailEl.innerHTML = `<img src="${state.currentCourse.thumbnail}" alt="${state.currentCourse.title}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
  } else {
    thumbnailEl.innerHTML = '<span class="course-icon">🎓</span>';
  }
  
  // Update progress
  updateProgressDisplay();
  
  // Render chapters
  renderChaptersNav();
  
  // Show welcome or first lesson
  if (!state.currentLesson) {
    showWelcomeScreen();
  }
}

function updateProgressDisplay() {
  const percentage = getProgressPercentage();
  document.getElementById('progressValue').textContent = `${percentage}%`;
  document.getElementById('progressFill').style.width = `${percentage}%`;
  
  // Update certificate button
  const btnCertificate = document.getElementById('btnCertificate');
  btnCertificate.disabled = percentage < 100;
}

function renderChaptersNav() {
  const nav = document.getElementById('chaptersNav');
  nav.innerHTML = '';
  
  // Group lessons by chapter
  const chapterLessons = {};
  state.lessons.forEach(lesson => {
    if (!chapterLessons[lesson.chapterKey]) {
      chapterLessons[lesson.chapterKey] = [];
    }
    chapterLessons[lesson.chapterKey].push(lesson);
  });
  
  state.chapters.forEach(chapter => {
    const lessons = chapterLessons[`${chapter.courseTitle}|${chapter.title}`] || [];
    const completedCount = lessons.filter(l => isLessonCompleted(l.id)).length;
    const isExpanded = state.currentLesson && lessons.some(l => l.id === state.currentLesson.id);
    
    const chapterEl = document.createElement('div');
    chapterEl.className = 'chapter';
    chapterEl.innerHTML = `
      <div class="chapter-header ${isExpanded ? 'expanded' : ''}" data-chapter-id="${chapter.id}">
        <span class="chapter-icon">▶</span>
        <span class="chapter-title">${chapter.title}</span>
        <span class="chapter-progress">${completedCount}/${lessons.length}</span>
      </div>
      <div class="lessons-list ${isExpanded ? 'visible' : ''}">
        ${lessons.map(lesson => `
          <div class="lesson-item ${isLessonCompleted(lesson.id) ? 'completed' : ''} ${state.currentLesson?.id === lesson.id ? 'active' : ''}" 
               data-lesson-id="${lesson.id}">
            <span class="lesson-icon">${getLessonIcon(lesson.type)}</span>
            <span class="lesson-name">${lesson.title}</span>
            ${lesson.duration ? `<span class="lesson-duration">${lesson.duration} min</span>` : ''}
          </div>
        `).join('')}
      </div>
    `;
    
    nav.appendChild(chapterEl);
  });
  
  // Add event listeners
  nav.querySelectorAll('.chapter-header').forEach(header => {
    header.addEventListener('click', () => toggleChapter(header));
  });
  
  nav.querySelectorAll('.lesson-item').forEach(item => {
    item.addEventListener('click', () => {
      const lessonId = parseInt(item.dataset.lessonId);
      const lesson = state.lessons.find(l => l.id === lessonId);
      if (lesson) loadLesson(lesson);
    });
  });
}

function getLessonIcon(type) {
  const icons = {
    video: '🎬',
    text: '📖',
    quiz: '📝',
    exercise: '✏️'
  };
  return icons[type] || '📄';
}

function toggleChapter(header) {
  const wasExpanded = header.classList.contains('expanded');
  
  // Collapse all
  document.querySelectorAll('.chapter-header').forEach(h => h.classList.remove('expanded'));
  document.querySelectorAll('.lessons-list').forEach(l => l.classList.remove('visible'));
  
  // Expand clicked if it wasn't expanded
  if (!wasExpanded) {
    header.classList.add('expanded');
    header.nextElementSibling.classList.add('visible');
  }
}

// ============================================================================
// LESSON LOADING
// ============================================================================

async function loadLesson(lesson) {
  state.currentLesson = lesson;
  state.currentQuizAnswers = {};
  
  // Update breadcrumb
  document.getElementById('breadcrumb').innerHTML = `
    <span class="breadcrumb-item">${state.currentCourse.title}</span>
    <span class="breadcrumb-item">${lesson.chapterTitle}</span>
    <span class="breadcrumb-item">${lesson.title}</span>
  `;
  
  // Hide welcome screen
  document.getElementById('welcomeScreen').style.display = 'none';
  
  // Show appropriate sections
  const videoSection = document.getElementById('videoSection');
  const lessonContent = document.getElementById('lessonContent');
  const quizSection = document.getElementById('quizSection');
  const lessonNavigation = document.getElementById('lessonNavigation');
  
  videoSection.style.display = 'none';
  lessonContent.style.display = 'none';
  quizSection.style.display = 'none';
  
  // Video
  if (lesson.videoUrl) {
    videoSection.style.display = 'block';
    loadVideo(lesson.videoUrl);
  }
  
  // Content
  if (lesson.content || lesson.type === 'text') {
    lessonContent.style.display = 'block';
    renderLessonContent(lesson);
  }
  
  // Quiz
  if (lesson.quiz) {
    quizSection.style.display = 'block';
    renderQuiz(lesson);
  }
  
  // Navigation
  lessonNavigation.style.display = 'flex';
  updateNavigationButtons();
  
  // Rating section
  showRatingSection(lesson);
  
  // Update sidebar
  renderChaptersNav();
  
  // Scroll to top
  document.getElementById('lessonContainer').scrollTop = 0;
}

function loadVideo(url) {
  const iframe = document.getElementById('videoFrame');
  
  // Convert YouTube/Vimeo URLs to embed format
  let embedUrl = url;
  
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) {
    embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  iframe.src = embedUrl;
}

function renderLessonContent(lesson) {
  document.getElementById('lessonTypeBadge').innerHTML = `${getLessonIcon(lesson.type)} ${getLessonTypeLabel(lesson.type)}`;
  document.getElementById('lessonTitle').textContent = lesson.title;
  
  const meta = [];
  if (lesson.duration) meta.push(`<span>⏱️ ${lesson.duration} min</span>`);
  if (isLessonCompleted(lesson.id)) meta.push(`<span>✅ ${t('completed')}</span>`);
  document.getElementById('lessonMeta').innerHTML = meta.join('');
  
  // Parse markdown-like content
  document.getElementById('lessonBody').innerHTML = parseContent(lesson.content);
}

function getLessonTypeLabel(type) {
  const labels = {
    video: t('video'),
    text: t('lesson'),
    quiz: t('quiz'),
    exercise: t('exercise')
  };
  return labels[type] || t('lesson');
}

function parseContent(content) {
  if (!content) return `<p>${t('noContent')}</p>`;
  
  // Simple markdown parsing
  let html = content
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  
  // Wrap lists
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  
  return `<p>${html}</p>`;
}

// ============================================================================
// QUIZ
// ============================================================================

function renderQuiz(lesson) {
  if (!lesson.quiz) return;
  
  const container = document.getElementById('quizContainer');
  const results = document.getElementById('quizResults');
  
  container.style.display = 'block';
  results.style.display = 'none';
  
  document.getElementById('quizTitle').textContent = t('testKnowledge');
  document.getElementById('quizProgress').textContent = `1 ${t('question')}`;
  
  const quiz = lesson.quiz;
  
  container.innerHTML = `
    <div class="quiz-question" data-question-index="0">
      <div class="question-number">1</div>
      <div class="question-text">${quiz.question}</div>
      <div class="question-options">
        ${quiz.options.map((option, i) => `
          <div class="option-item" data-option-index="${i}">
            <div class="option-radio"></div>
            <div class="option-text">${option}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="quiz-actions">
      <button class="btn btn-primary" id="btnSubmitQuiz">${t('validateAnswer')}</button>
    </div>
  `;
  
  // Add event listeners
  container.querySelectorAll('.option-item').forEach(item => {
    item.addEventListener('click', () => selectOption(item));
  });
  
  document.getElementById('btnSubmitQuiz').addEventListener('click', submitQuiz);
}

function selectOption(item) {
  const questionEl = item.closest('.quiz-question');
  const questionIndex = questionEl.dataset.questionIndex;
  
  // Deselect all options in this question
  questionEl.querySelectorAll('.option-item').forEach(opt => opt.classList.remove('selected'));
  
  // Select clicked option
  item.classList.add('selected');
  state.currentQuizAnswers[questionIndex] = parseInt(item.dataset.optionIndex);
}

function submitQuiz() {
  const lesson = state.currentLesson;
  if (!lesson || !lesson.quiz) return;
  
  const userAnswer = state.currentQuizAnswers['0'];
  const correctAnswer = lesson.quiz.correctAnswer;
  const isCorrect = userAnswer === correctAnswer;
  
  // Show correct/incorrect
  const container = document.getElementById('quizContainer');
  container.querySelectorAll('.option-item').forEach((item, index) => {
    if (index === correctAnswer) {
      item.classList.add('correct');
    } else if (index === userAnswer && !isCorrect) {
      item.classList.add('incorrect');
    }
  });
  
  // Show results after delay
  setTimeout(() => {
    container.style.display = 'none';
    const results = document.getElementById('quizResults');
    results.style.display = 'block';
    
    const score = isCorrect ? 100 : 0;
    
    document.getElementById('resultsIcon').textContent = isCorrect ? '🎉' : '😔';
    document.getElementById('resultsTitle').textContent = isCorrect ? t('congratulations') : t('notQuite');
    document.getElementById('resultsScore').textContent = isCorrect 
      ? t('correctAnswer') 
      : `${t('theCorrectAnswer')} ${lesson.quiz.options[correctAnswer]}`;
    
    if (isCorrect) {
      markLessonCompleted(lesson.id, score);
    }
  }, 1500);
}

// ============================================================================
// NAVIGATION
// ============================================================================

function updateNavigationButtons() {
  const currentIndex = state.lessons.findIndex(l => l.id === state.currentLesson?.id);
  
  const btnPrev = document.getElementById('btnPrevLesson');
  const btnNext = document.getElementById('btnNextLessonNav');
  const btnComplete = document.getElementById('btnCompleteLesson');
  
  btnPrev.style.visibility = currentIndex > 0 ? 'visible' : 'hidden';
  btnNext.style.visibility = currentIndex < state.lessons.length - 1 ? 'visible' : 'hidden';
  
  const isCompleted = isLessonCompleted(state.currentLesson?.id);
  btnComplete.innerHTML = isCompleted 
    ? `<span>✓ ${t('completed')}</span>` 
    : `<span>${t('markAsCompleted')}</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  btnComplete.classList.toggle('btn-secondary', isCompleted);
  btnComplete.classList.toggle('btn-primary', !isCompleted);
}

function navigatePrev() {
  const currentIndex = state.lessons.findIndex(l => l.id === state.currentLesson?.id);
  if (currentIndex > 0) {
    loadLesson(state.lessons[currentIndex - 1]);
  }
}

function navigateNext() {
  const currentIndex = state.lessons.findIndex(l => l.id === state.currentLesson?.id);
  if (currentIndex < state.lessons.length - 1) {
    loadLesson(state.lessons[currentIndex + 1]);
  }
}

function completeCurrentLesson() {
  if (state.currentLesson) {
    markLessonCompleted(state.currentLesson.id);
    updateNavigationButtons();
    showToast(t('lessonCompleted'), 'success');
  }
}

// ============================================================================
// RATING SYSTEM
// ============================================================================

function showRatingSection(lesson) {
  const ratingSection = document.getElementById('ratingSection');
  const ratingLabel = document.getElementById('ratingLabel');
  const ratingFeedback = document.getElementById('ratingFeedback');
  
  ratingSection.style.display = 'flex';
  ratingLabel.textContent = t('rateLesson');
  ratingFeedback.textContent = '';
  
  // Check if already rated
  const existingRating = getLessonRating(lesson.id);
  updateStarDisplay(existingRating);
  
  if (existingRating > 0) {
    ratingFeedback.textContent = `${t('yourRating')}: ${existingRating}/5`;
  }
}

function getLessonRating(lessonId) {
  const progress = state.progress.find(p => p.lessonId === lessonId);
  return progress?.rating || 0;
}

function setLessonRating(lessonId, rating) {
  const existing = state.progress.find(p => p.lessonId === lessonId);
  if (existing) {
    existing.rating = rating;
  } else {
    state.progress.push({
      lessonId: lessonId,
      completed: false,
      rating: rating
    });
  }
  saveProgress();
  
  document.getElementById('ratingFeedback').textContent = t('thankYouRating');
  setTimeout(() => {
    document.getElementById('ratingFeedback').textContent = `${t('yourRating')}: ${rating}/5`;
  }, 1500);
}

function updateStarDisplay(rating) {
  const stars = document.querySelectorAll('#starRating .star');
  stars.forEach((star, index) => {
    star.classList.toggle('active', index < rating);
  });
}

function initRatingSystem() {
  const starRating = document.getElementById('starRating');
  const stars = starRating.querySelectorAll('.star');
  
  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const rating = parseInt(star.dataset.rating);
      stars.forEach((s, index) => {
        s.classList.toggle('hover', index < rating);
      });
    });
    
    star.addEventListener('mouseleave', () => {
      stars.forEach(s => s.classList.remove('hover'));
    });
    
    star.addEventListener('click', () => {
      const rating = parseInt(star.dataset.rating);
      if (state.currentLesson) {
        setLessonRating(state.currentLesson.id, rating);
        updateStarDisplay(rating);
      }
    });
  });
}

// ============================================================================
// NAME MODAL
// ============================================================================

function checkLearnerName() {
  const savedName = localStorage.getItem('elearning_learner_name');
  if (savedName && savedName.trim().length > 0) {
    state.learnerName = savedName;
    updateUserDisplay();
    return true;
  }
  return false;
}

function showNameModal() {
  document.getElementById('nameModal').classList.add('visible');
  document.getElementById('learnerNameInput').focus();
}

function hideNameModal() {
  document.getElementById('nameModal').classList.remove('visible');
}

function saveLearnerName() {
  const input = document.getElementById('learnerNameInput');
  const name = input.value.trim();
  
  if (name.length < 2) {
    input.focus();
    input.style.borderColor = 'var(--danger)';
    setTimeout(() => input.style.borderColor = '', 1000);
    return;
  }
  
  state.learnerName = name;
  localStorage.setItem('elearning_learner_name', name);
  updateUserDisplay();
  hideNameModal();
}

function updateUserDisplay() {
  const userName = document.getElementById('userName');
  if (state.learnerName) {
    userName.textContent = state.learnerName;
  }
}

// ============================================================================
// CERTIFICATE
// ============================================================================

function showCertificate() {
  if (getProgressPercentage() < 100) return;
  
  document.getElementById('certificateName').textContent = state.learnerName || state.userEmail || 'Apprenant';
  document.getElementById('certificateCourse').textContent = state.currentCourse?.title || 'Formation';
  const dateLocale = state.lang === 'en' ? 'en-US' : 'fr-FR';
  document.getElementById('certificateDate').textContent = `${t('issuedOn')} ${new Date().toLocaleDateString(dateLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })}`;
  
  document.getElementById('certificateModal').classList.add('visible');
}

function closeCertificate() {
  document.getElementById('certificateModal').classList.remove('visible');
}

function downloadCertificate() {
  // Safe certificate generation without document.write
  const certificate = document.getElementById('certificate');
  const printWindow = window.open('', '_blank');
  
  // Create document elements safely
  const doc = printWindow.document;
  const html = doc.createElement('html');
  const head = doc.createElement('head');
  const body = doc.createElement('body');
  
  // Add title
  const title = doc.createElement('title');
  title.textContent = `Certificat - ${state.currentCourse?.title}`;
  head.appendChild(title);
  
  // Add styles safely
  const style = doc.createElement('style');
  style.textContent = `
    body { 
      margin: 0; 
      padding: 20px; 
      font-family: 'Inter', sans-serif; 
      background: white;
    }
    ${document.querySelector('style')?.textContent || ''}
  `;
  head.appendChild(style);
  
  // Clone certificate safely
  const certificateClone = certificate.cloneNode(true);
  body.appendChild(certificateClone);
  
  // Append to document
  html.appendChild(head);
  html.appendChild(body);
  doc.appendChild(html);
  
  // Print
  printWindow.print();
}

// ============================================================================
// UI HELPERS
// ============================================================================

function showWelcomeScreen() {
  document.getElementById('welcomeScreen').style.display = 'flex';
  document.getElementById('videoSection').style.display = 'none';
  document.getElementById('lessonContent').style.display = 'none';
  document.getElementById('quizSection').style.display = 'none';
  document.getElementById('lessonNavigation').style.display = 'none';
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

function updateUserDisplay() {
  const userName = document.getElementById('userName');
  if (state.userEmail) {
    userName.textContent = state.userEmail.split('@')[0] || state.userEmail;
  }
}

function showLoading() {
  document.getElementById('loadingOverlay').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loadingOverlay').classList.add('hidden');
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || '📢'}</span>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Load language preference
  loadLanguage();
  
  // Check if learner name exists, if not show modal
  const hasName = checkLearnerName();
  if (hasName) {
    document.getElementById('userName').textContent = state.learnerName;
  } else {
    setTimeout(showNameModal, 800);
  }
  
  // Name modal events
  document.getElementById('btnStartLearning').addEventListener('click', saveLearnerName);
  document.getElementById('learnerNameInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveLearnerName();
  });
  
  // Language toggle
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
      setLanguage(opt.dataset.lang);
      updateLangToggle();
    });
  });
  
  // Sidebar toggle
  document.getElementById('btnToggleSidebar').addEventListener('click', toggleSidebar);
  
  // Rating system
  initRatingSystem();
  
  // Navigation
  document.getElementById('btnPrevLesson').addEventListener('click', navigatePrev);
  document.getElementById('btnNextLessonNav').addEventListener('click', navigateNext);
  document.getElementById('btnCompleteLesson').addEventListener('click', completeCurrentLesson);
  document.getElementById('btnNextLesson').addEventListener('click', navigateNext);
  document.getElementById('btnRetryQuiz').addEventListener('click', () => {
    if (state.currentLesson) renderQuiz(state.currentLesson);
  });
  
  // Video
  document.getElementById('btnMarkWatched').addEventListener('click', () => {
    if (state.currentLesson) {
      markLessonCompleted(state.currentLesson.id);
      showToast(t('videoWatched'), 'success');
    }
  });
  
  // Certificate
  document.getElementById('btnCertificate').addEventListener('click', showCertificate);
  document.getElementById('closeCertificateModal').addEventListener('click', closeCertificate);
  document.getElementById('certificateModal').querySelector('.modal-overlay').addEventListener('click', closeCertificate);
  document.getElementById('btnDownloadCertificate').addEventListener('click', downloadCertificate);
});
