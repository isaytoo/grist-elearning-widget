# Grist E-Learning Widget

Un widget Grist puissant pour créer des formations e-learning interactives avec vidéos, quiz et suivi de progression.

![E-Learning Widget](https://img.shields.io/badge/Grist-Widget-blue)
![License](https://img.shields.io/badge/License-Apache%202.0-green)

## ✨ Fonctionnalités

- 🎬 **Lecteur vidéo intégré** - Support YouTube, Vimeo et liens directs
- 📚 **Structure de cours** - Chapitres et leçons organisés
- 📝 **Quiz interactifs** - QCM avec correction automatique
- 📊 **Suivi de progression** - Barre de progression et statut par leçon
- 🏆 **Certificats** - Génération de certificat de réussite
- 🎨 **Interface moderne** - Design responsive et UX friendly
- 🌐 **Multi-utilisateurs** - Progression individuelle par utilisateur

## 📋 Structure des tables Grist

### Option 1 : Table unique (simple)

| Colonne | Type | Description |
|---------|------|-------------|
| Course_Title | Text | Titre du cours |
| Course_Description | Text | Description du cours |
| Chapter_Title | Text | Titre du chapitre |
| Chapter_Order | Integer | Ordre du chapitre |
| Lesson_Title | Text | Titre de la leçon |
| Lesson_Type | Choice | Type: video, text, quiz |
| Lesson_Content | Text | Contenu markdown |
| Lesson_VideoUrl | Text | URL YouTube/Vimeo |
| Lesson_Duration | Integer | Durée en minutes |
| Lesson_Order | Integer | Ordre de la leçon |
| Quiz_Question | Text | Question du quiz |
| Quiz_Options | Text | Options séparées par \| |
| Quiz_CorrectAnswer | Integer | Index de la bonne réponse (0-based) |

### Option 2 : Tables séparées (avancé)

Pour des cours plus complexes, vous pouvez créer des tables séparées :
- `Courses` - Informations sur les cours
- `Chapters` - Chapitres liés aux cours
- `Lessons` - Leçons liées aux chapitres
- `Quizzes` - Questions liées aux leçons

## 🚀 Installation

1. Ouvrez votre document Grist
2. Ajoutez un widget personnalisé
3. Collez l'URL : `https://isaytoo.github.io/grist-elearning-widget/`
4. Configurez le mapping des colonnes

## 📖 Exemple de données

```
Course_Title: Introduction à Grist
Chapter_Title: Les bases
Chapter_Order: 1
Lesson_Title: Créer votre premier document
Lesson_Type: video
Lesson_VideoUrl: https://www.youtube.com/watch?v=XYZ123
Lesson_Duration: 10
Lesson_Order: 1
Lesson_Content: Dans cette leçon, vous apprendrez à créer votre premier document Grist...
Quiz_Question: Quel est le raccourci pour créer une nouvelle ligne ?
Quiz_Options: Ctrl+N|Entrée|Tab|Ctrl+Entrée
Quiz_CorrectAnswer: 1
```

## 🎨 Types de leçons

- **video** - Leçon avec vidéo intégrée
- **text** - Leçon textuelle (markdown supporté)
- **quiz** - Quiz interactif

## 📝 Format du contenu (Markdown)

Le contenu des leçons supporte le markdown :

```markdown
# Titre principal
## Sous-titre

**Texte en gras** et *italique*

- Liste à puces
- Autre élément

> Citation

`code inline`

```code block```

[Lien](https://example.com)
![Image](https://example.com/image.png)
```

## 🔒 Niveau d'accès

Ce widget nécessite un accès **complet** pour :
- Lire les données du cours
- Sauvegarder la progression (localStorage)

## 📄 Licence

Apache License 2.0 - Voir [LICENSE](LICENSE)

## 👤 Auteur

**Said Hamadou (isaytoo)**
- Website: [gristup.fr](https://gristup.fr)
- GitHub: [@isaytoo](https://github.com/isaytoo)
