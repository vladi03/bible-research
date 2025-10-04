# Lovable Integration Prompt: Bible Research Verses API

## Project Overview
You are building a Bible Research application that integrates with a Firebase Functions API to display comprehensive verse data. The API returns detailed biblical study information including translations, original words, cross-references, and AI commentaries.

## API Integration Details

### Base URL
```
https://us-central1-ai-bible-buddy-dev.cloudfunctions.net/
```

### Available Endpoints



#### 2. Verses Endpoint (Main)
- **URL**: `POST /research-verse`
- **Purpose**: Retrieve comprehensive verse data
- **Request Body**:
```json
{
  "book": "John",
  "pageNumber": 1
}
```

### API Response Structure
The `/research-verse` endpoint returns:
```json
{
  "verses": [
    {
      "sectionId": "1",
      "context": [{
        "body": "The Gospel of John opens with a profound theological statement...",
        "contextType": "setting",
        "title": "The Eternal Word"
      }],
      "parallelTranslations": {
        "esv": "In the beginning was the Word, and the Word was with God, and the Word was God.",
        "nasb": "In the beginning was the Word, and the Word was with God, and the Word was God.",
        "kjv": "In the beginning was the Word, and the Word was with God, and the Word was God."
      },
      "verseCitation": "John 1:1",
      "book": "John",
      "chapter": "1",
      "verse": "1",
      "originalWords": [{
        "id": "G1722",
        "originalWord": "ἐν",
        "definitionSort": "in, on, at, by, with",
        "relevanceScore": 9,
        "whyRelevant": "This preposition establishes the temporal context of the Word's existence."
      }],
      "verseCrossRef": [
        "Genesis 1:1",
        "1 John 1:1",
        "Revelation 19:13"
      ],
      "aiCommentaries": [{
        "name": "Voice of Spurgeon",
        "title": "The Eternal Word",
        "comment": "Here we have the most sublime statement of Christ's deity and eternal existence..."
      }, {
        "name": "Voice of Calvin",
        "title": "The Divine Logos",
        "comment": "John declares that the Word was God, establishing the full divinity of Christ..."
      }]
    }
    // ... more verses (currently returns 10 verses from John 1:1-10)
  ],
  "sectionCommentaries": [
    {
      "id": 1,
      "title": "The Word Became Flesh",
      "versesInTheGroup": [
        "John 1:1",
        "John 1:2",
        "John 1:3",
        "John 1:4",
        "John 1:5"
      ],
      "theologicalPerspective": "Theologically, this prologue affirms Jesus' full divinity and humanity. As the eternal Word made flesh, Jesus reveals God's glory and offers saving grace, making it possible for all who believe in Him to become children of God.",
      "pastoralPerspective": "This truth offers comfort and hope: God personally came to us in Christ. Believers can be assured that through Jesus, the Light has overcome darkness and we are welcomed into God's family as children of God.",
      "literalPerspective": "This passage narrates how Jesus, the Word, existed with God and as God from the beginning, and then became flesh to live among us. The Word is the source of life and light for humanity, full of grace and truth, giving those who receive Him the right to become God's children."
    },
    {
      "id": 2,
      "title": "The Testimony of John the Baptist",
      "versesInTheGroup": [
        "John 1:6",
        "John 1:7",
        "John 1:8",
        "John 1:9",
        "John 1:10"
      ],
      "theologicalPerspective": "Theologically, John the Baptist's role is clarified: he is not the Messiah or Elijah reborn, but the one preparing the way for the Lord as prophesied. John emphasizes the supremacy of Christ over himself, pointing out that he is unworthy even to untie the straps of the coming One's sandals.",
      "pastoralPerspective": "Pastorally, this passage models humility and faithful witness. John directs attention away from himself to Jesus, encouraging us to do likewise by pointing others to Christ rather than seeking our own honor.",
      "literalPerspective": "Literally, John the Baptist is introduced as a man sent from God to bear witness to the true light. He came to testify about the light so that all might believe through him, but he was not the light himself. The true light was coming into the world to enlighten every person, yet the world did not recognize Him."
    }
  ],
  "pageNumber": 1,
  "book": "John",
  "pageCount":10
}
```

## UI Requirements

### 1. Section Grouping
The API now includes `sectionId` for each verse and `sectionCommentaries` for grouped analysis:
- **Group verses by sectionId** to create logical sections
- **Display section commentaries** with theological, pastoral, and literal perspectives
- **Section headers** showing the group title (e.g., "The Word Became Flesh")
- **Section-level commentary tabs** for different perspectives

### 2. Main Verse Display Component
Create a component that displays:
- **Section Header** (when starting a new section)
- **Verse Citation** (e.g., "John 1:1")
- **Multiple Translations** in tabs or accordion (ESV, NASB, KJV)
- **Context Section** with title and body text
- **Original Words** with Greek/Hebrew text, definitions, and relevance scores
- **Cross References** as clickable links
- **AI Commentaries** from different theologians

### 3. Navigation & Controls
- **Book Selection**: Dropdown or search to select Bible books
- **Page Navigation**: Previous/Next buttons for pagination
- **Section Navigation**: Jump between different sections within a page
- **Loading States**: Show loading spinners during API calls
- **Error Handling**: Display user-friendly error messages

### 4. Interactive Features
- **Translation Toggle**: Allow users to switch between ESV, NASB, KJV
- **Section Commentary Tabs**: Switch between theological, pastoral, and literal perspectives
- **Original Words Tooltips**: Hover or click to show definitions
- **Cross-Reference Navigation**: Click to navigate to referenced verses
- **Commentary Expansion**: Collapsible sections for different commentators
- **Section Grouping**: Visual separation between different verse groups

### 5. Responsive Design
- **Mobile-First**: Ensure the interface works well on all screen sizes
- **Typography**: Use readable fonts for Bible text and commentary
- **Color Scheme**: Choose colors that enhance readability for long-form text

## Implementation Guidelines

### API Integration
```javascript
// Example API call
const fetchVerses = async (book, pageNumber) => {
  try {
    const response = await fetch('https://your-firebase-project.cloudfunctions.net/research/verse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        book: book,
        pageNumber: pageNumber
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch verses');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

### State Management
- Use React state or a state management library to handle:
  - Current book selection
  - Current page number
  - Current section (for section navigation)
  - Loading states
  - Error states
  - Selected translation
  - Selected section commentary perspective (theological, pastoral, literal)
  - Expanded commentary sections

### Component Structure Suggestion
```
App
├── Header (with book selector)
├── SectionContainer
│   ├── SectionHeader (section title and commentary tabs)
│   ├── SectionCommentary (theological, pastoral, literal perspectives)
│   └── VerseContainer
│       ├── VerseHeader (citation, book, chapter, verse)
│       ├── TranslationTabs (ESV, NASB, KJV)
│       ├── ContextSection
│       ├── OriginalWordsSection
│       ├── CrossReferencesSection
│       └── CommentariesSection
├── NavigationControls (Previous/Next)
└── LoadingSpinner/ErrorMessage
```

## Styling Recommendations

### Typography
- **Bible Text**: Use a serif font (e.g., Georgia, Times New Roman) for readability
- **Commentary**: Use a clean sans-serif font
- **Original Words**: Use a monospace font for Greek/Hebrew text

### Layout
- **Two-Column Layout**: Main content on left, cross-references/commentaries on right
- **Card-Based Design**: Each verse in its own card for better organization
- **Accordion Sections**: For commentaries and original words to save space

### Colors
- **Primary**: Deep blue or burgundy for headers
- **Secondary**: Gold or warm gray for accents
- **Text**: Dark gray (#333) for main text, lighter gray for secondary text
- **Background**: Off-white (#fafafa) for main background

## Error Handling
- **Network Errors**: Show "Unable to connect to server" message
- **API Errors**: Display "Failed to load verses" with retry button
- **Empty Results**: Show "No verses found" message
- **Loading States**: Display skeleton loaders or spinners

## Accessibility
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Screen Reader Support**: Use proper ARIA labels and semantic HTML
- **High Contrast**: Ensure sufficient color contrast for text readability
- **Focus Indicators**: Clear focus states for interactive elements

## Testing Considerations
- **API Mocking**: Create mock data for development and testing
- **Error Scenarios**: Test network failures, invalid responses, and empty data
- **Responsive Testing**: Test on various screen sizes
- **Performance**: Ensure smooth scrolling and fast loading

## Future Enhancements
- **Search Functionality**: Search within verses and commentaries
- **Bookmarking**: Save favorite verses
- **Sharing**: Share verses on social media
- **Offline Support**: Cache verses for offline reading
- **Audio**: Text-to-speech for verses
- **Notes**: User annotations and personal notes

## Current Data Available
The API currently returns 10 verses from John 1:1-10 with complete data including:
- **Sectioned verses** with `sectionId` for grouping (2 sections: "The Word Became Flesh" and "The Testimony of John the Baptist")
- **Section commentaries** with theological, pastoral, and literal perspectives for each group
- Context information for each verse
- Three Bible translations (ESV, NASB, KJV)
- Original Greek words with definitions
- Cross-references to other Bible passages
- AI-generated commentaries from Spurgeon and Calvin

## Key Features to Implement
1. **Section-based organization** - Group verses by their `sectionId`
2. **Section commentary tabs** - Allow users to switch between theological, pastoral, and literal perspectives
3. **Visual section separation** - Clear boundaries between different verse groups
4. **Section navigation** - Easy jumping between sections within a page

Build a beautiful, functional interface that makes this rich biblical data accessible and engaging for users!
