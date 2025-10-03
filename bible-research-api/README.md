# Bible Buddy API v2

A Firebase Cloud Functions-based API for managing Bible study recommendations, email notifications, and push notifications. Built with a modular microservices architecture for scalability and maintainability.

## 📖 Features

- **Email Functions**: Personalized Bible study recommendation emails using MailerLite
- **Notification Functions**: Push notifications via Firebase Cloud Messaging (FCM)
- **Data Import Scripts**: Tools for importing Bible verses, study materials, and category data
- **Firestore Integration**: Automated database operations and triggers
- **Modern Architecture**: ES6 modules, Node.js 22, Firebase v6
- **No Template Dependencies**: Built-in HTML email generation without external templating engines

## 🚀 Quick Start

**For detailed setup instructions, see [SETUP.md](./SETUP.md)**

```bash
# 1. Install dependencies
cd bible-buddy-api-v2/functions
npm install && cd email-functions && npm install && cd ../notification-functions && npm install

# 2. Configure Firebase
firebase login
firebase use --add

# 3. Set environment variables (see SETUP.md for details)
firebase functions:config:set mailerlite.api_key="your_api_key"

# 4. Deploy
npm run deploy
```

## 📁 Project Structure

```
bible-buddy-api-v2/
├── functions/
│   ├── email-functions/           # Email notification service
│   │   ├── lib/                   # Shared utilities
│   │   ├── watchHandlers/         # Firestore triggers
│   │   └── package.json
│   ├── notification-functions/    # Push notification service
│   │   ├── lib/                   # Shared utilities
│   │   ├── watchHandlers/         # Firestore triggers
│   │   └── package.json
│   ├── scripts/                   # Data management utilities
│   ├── package.json               # Root dependencies
│   ├── firebase.json              # Firebase configuration
│   └── .firebaserc                # Project configuration
├── hosting/                       # App redirect hosting
│   ├── public/
│   │   ├── index.html             # App deep link redirects
│   │   └── 404.html               # Error page
│   └── firebase.json
├── data/                          # Bible study data files
├── SETUP.md                       # Detailed setup guide
└── README.md
```

## 📧 Email Functions

### Available Endpoints

- `POST /email-sendBibleStudyRecommendation` - Send personalized Bible study recommendations
- `POST /email-sendWelcomeEmail` - Send welcome email to new users
- `POST /email-sendDailyVerse` - Send daily Bible verse
- `POST /email-test` - Test email functionality

### Email Templates

Email templates are generated programmatically with inline HTML (no external templating engine required):

- **Bible Study Recommendations**: Personalized study suggestions with verses and commentary
- **Welcome Emails**: Onboarding emails for new users
- **Daily Verses**: Featured daily Bible verse notifications
- **Prayer Reminders**: Scheduled prayer reminder emails
- **Generic**: Flexible template for custom messages

### Usage Example

```javascript
// Send Bible study recommendation
const response = await fetch('/email-sendBibleStudyRecommendation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + userIdToken
  },
  body: JSON.stringify({
    email: 'user@example.com',
    studyData: [
      {
        title: 'Faith and Trust',
        book: 'Hebrews',
        chapter: 11,
        verses: [1, 6],
        commentary: 'Understanding faith through biblical examples',
        studyQuestions: [
          'What does faith mean in your daily life?',
          'How can we strengthen our trust in God?'
        ]
      }
    ],
    userPreferences: {
      favoriteBooks: ['Psalms', 'Proverbs'],
      studyLevel: 'intermediate',
      topics: ['faith', 'prayer', 'wisdom']
    }
  })
});
```

## 🔔 Notification Functions

### Notification Types

- `bible_study_recommendation` - New Bible study recommendations
- `daily_verse` - Daily Bible verse
- `prayer_reminder` - Scheduled prayer reminders
- `study_group_update` - Study group notifications
- `reading_plan_progress` - Reading plan milestones

## 📱 App Deep Links

The hosting service provides app deep link redirects with configurable URLs:

- **Success**: `?status=success` - Redirects to app success page
- **Cancel**: `?status=cancel` - Redirects to app cancel page  
- **Default**: No parameters - Redirects to app home page

Configure your app URLs in `hosting/public/index.html` or use environment variables as described in [SETUP.md](./SETUP.md).

## 🔧 MailerLite Integration

This project uses MailerLite as the email service provider instead of other services like SendGrid or Resend:

### Benefits of MailerLite
- **Reliable Delivery**: High deliverability rates
- **Cost Effective**: Generous free tier and affordable pricing
- **Easy Setup**: Simple API integration
- **Analytics**: Built-in email tracking and analytics
- **Subscriber Management**: Optional subscriber list management

### Required Configuration
- MailerLite API key
- From email address (must be verified in MailerLite)
- From name for email sender

## 🚀 Deployment

### Deploy All Functions

```bash
cd functions
npm run deploy-prod  # Deploy to production
npm run deploy       # Deploy to development
```

### Deploy Specific Functions

```bash
npm run deploy-email        # Email functions only
npm run deploy-notification # Notification functions only
```

## 📊 Scripts

### Available Scripts

- `npm run importBibleData` - Import Bible study data from JSON files
- `npm run bulkUpdateBibleData` - Update existing Bible study records
- `npm run updateIndexes` - Display required Firestore indexes

## 🔐 Security & Configuration

- Environment variables for API keys and configuration
- Firebase Authentication required for all endpoints
- Firestore security rules (configure separately)
- CORS enabled for web app integration

## 📈 Monitoring

Monitor your functions in the [Firebase Console](https://console.firebase.google.com/):
- Function logs and performance
- Firestore operations and usage
- Error tracking and debugging

## 🆘 Support

For detailed setup instructions, environment configuration, and troubleshooting, see [SETUP.md](./SETUP.md).

Common issues:
1. Check environment variables are set correctly
2. Verify MailerLite API key and account status
3. Ensure Firebase project permissions are correct
4. Test deep links with your actual app

---

Built with 🙏 for Bible study enthusiasts everywhere! 📖