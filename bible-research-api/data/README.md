# Bible Buddy Data Structure

This directory contains the data files for the Bible Buddy API. The structure is designed to support Bible study recommendations, verse management, and user preferences.

## Data Files

### Core Bible Data
- `books.json` - List of Bible books with metadata
- `verses.json` - Bible verses with references and text
- `topics.json` - Study topics and categories
- `translations.json` - Supported Bible translations

### Study Materials
- `study-plans.json` - Structured reading plans
- `commentary.json` - Study notes and explanations
- `questions.json` - Discussion questions for study groups

### User Preferences
- `preference-categories.json` - Available user preference options
- `notification-types.json` - Types of notifications available

## Sample Data Structure

### Books
```json
{
  "books": [
    {
      "id": "genesis",
      "name": "Genesis",
      "testament": "old",
      "order": 1,
      "chapters": 50,
      "category": "law"
    }
  ]
}
```

### Verses
```json
{
  "verses": [
    {
      "id": "john-3-16",
      "book": "john",
      "chapter": 3,
      "verse": 16,
      "text": "For God so loved the world that he gave his one and only Son...",
      "translation": "NIV",
      "topics": ["love", "salvation", "faith"]
    }
  ]
}
```

### Study Plans
```json
{
  "studyPlans": [
    {
      "id": "faith-foundations",
      "title": "Faith Foundations",
      "description": "A 30-day journey through key verses about faith",
      "duration": 30,
      "difficulty": "beginner",
      "verses": ["hebrews-11-1", "romans-10-17"],
      "topics": ["faith", "trust", "belief"]
    }
  ]
}
```

## Import Scripts

Use the following scripts to import data:
- `npm run importBibleData` - Import all Bible data
- `npm run bulkUpdateBibleData` - Update existing records