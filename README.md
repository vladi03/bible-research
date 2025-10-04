# Bible Research Application

A comprehensive Bible study application with Firebase backend API and React frontend, featuring detailed verse analysis, section-based commentaries, and multi-perspective theological insights.

## 🚀 Features

### API Features
- **Research Functions**: Comprehensive verse analysis with original language support
- **Section-based Organization**: Verses grouped by thematic sections with dedicated commentaries
- **Multi-perspective Analysis**: Theological, pastoral, and literal perspectives for each section
- **Original Language Support**: Greek/Hebrew word analysis with definitions and relevance scores
- **Cross-references**: Interconnected Bible verse references
- **AI Commentaries**: Historical theologian perspectives (Spurgeon, Calvin, etc.)

### Frontend Features
- **Responsive Design**: Mobile-first interface for all devices
- **Translation Support**: ESV, NASB, and KJV parallel translations
- **Interactive Elements**: Hover tooltips, expandable sections, and navigation
- **Section Navigation**: Easy jumping between thematic sections
- **Firebase Authentication**: Secure user management

## 📊 API Structure

### Research Endpoint
- **URL**: `POST /research-verse`
- **Response**: Returns verses with section grouping and multi-perspective commentaries
- **Page Count**: Currently returns 10 verses per page (John 1:1-10 in current implementation)
- **Sections**: 2 thematic sections with dedicated theological analysis

### Response Format
```json
{
  "verses": [...], // Array of verse objects with sectionId
  "sectionCommentaries": [...], // Array of section-level commentaries
  "pageNumber": 1,
  "book": "John"
}
```

## 🏗️ Project Structure

```
bible-research/
├── bible-research-api/          # Firebase Cloud Functions API
│   ├── functions/
│   │   ├── research-functions/  # Main research API
│   │   ├── email-functions/     # Email notifications
│   │   └── notification-functions/ # Push notifications
│   └── README.md
├── web/                         # React frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   └── firebase.js         # Firebase configuration
│   └── README.md
├── docs/                        # Documentation
└── lovable-integration-prompt.md # Frontend integration guide
```

## 🚀 Quick Start

### Backend (API)
```bash
cd bible-research-api/functions
npm install
firebase deploy --only functions:research
```

### Frontend (Web)
```bash
cd web
npm install
npm run dev
```

## 📖 Current Data

- **Book**: John (Gospel)
- **Verses**: 1:1-10 (10 verses total)
- **Sections**: 2 thematic groups
  - "The Word Became Flesh" (verses 1-5)
  - "The Testimony of John the Baptist" (verses 6-10)
- **Page Count**: 1 page (expandable for more chapters)

## 🔧 Development

For detailed setup instructions:
- **API Setup**: See `bible-research-api/README.md`
- **Frontend Setup**: See `web/README.md`
- **Lovable Integration**: See `lovable-integration-prompt.md`

## 📱 Lovable Integration

This project is designed for easy integration with Lovable's AI-powered development platform. The `lovable-integration-prompt.md` file contains comprehensive instructions for building the frontend interface with the new section-based API structure.

Key integration points:
- Section-based verse grouping
- Multi-perspective commentary tabs
- Responsive design requirements
- Firebase authentication flow
- API response handling

---

Built with 🙏 for Bible study enthusiasts everywhere! 📖
