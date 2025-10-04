# Bible Buddy API v2 - Setup Guide

## Prerequisites

- Node.js 22+
- Firebase CLI: `npm install -g firebase-tools`
- A Firebase project with Firestore and Cloud Functions enabled
- A MailerLite account and API key

## 📋 Environment Variables

### Required Environment Variables

Create the following environment variable files or set them in Firebase Functions config:

#### Email Functions Environment Variables
```bash
# MailerLite Configuration
MAILERLITE_API_KEY=your_mailerlite_api_key_here
MAILERLITE_GROUP_ID=your_mailerlite_group_id_here  # Optional: for subscriber management

# Email Settings
FROM_EMAIL=noreply@yourbibleapp.com
FROM_NAME="Bible Buddy"
```

#### Hosting Configuration Variables
```bash
# App Deep Link Configuration
APP_SUCCESS_URL=biblebuddy://biblebuddy.app.link/settings?redirect=premium
APP_CANCEL_URL=biblebuddy://biblebuddy.app.link/study-plans  
APP_DEFAULT_URL=biblebuddy://biblebuddy.app.link/HomePage
APP_FALLBACK_URL=https://www.yourbibleapp.com/
APP_DOWNLOAD_URL=https://biblebuddy.app.link/download
```

### Firebase Project Configuration
```bash
# Firebase Project IDs
FIREBASE_DEV_PROJECT=bible-buddy-dev
FIREBASE_PROD_PROJECT=bible-buddy-prod
```

## 🚀 Installation Steps

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd bible-buddy-api-v2/functions

# Install root dependencies
npm install

# Install function-specific dependencies
cd email-functions && npm install && cd ..
cd notification-functions && npm install && cd ..
```

### 2. Configure Firebase

```bash
# Login to Firebase
firebase login

# Set up project aliases
firebase use --add
# Select your development project and alias it as 'dev'
# Select your production project and alias it as 'prod'

# Set default project
firebase use dev
```

### 3. Set Environment Variables

#### Option A: Using Firebase CLI (Recommended for production)
```bash
# Email function environment variables
firebase functions:config:set mailerlite.api_key="your_mailerlite_api_key"
firebase functions:config:set mailerlite.group_id="your_group_id"
firebase functions:config:set email.from_email="noreply@yourbibleapp.com"
firebase functions:config:set email.from_name="Bible Buddy"

# App configuration
firebase functions:config:set app.success_url="biblebuddy://biblebuddy.app.link/settings?redirect=premium"
firebase functions:config:set app.cancel_url="biblebuddy://biblebuddy.app.link/study-plans"
firebase functions:config:set app.default_url="biblebuddy://biblebuddy.app.link/HomePage"
firebase functions:config:set app.fallback_url="https://www.yourbibleapp.com/"
firebase functions:config:set app.download_url="https://biblebuddy.app.link/download"
```

#### Option B: Using .env files (For local development)
```bash
# Create .env file in email-functions directory
echo "MAILERLITE_API_KEY=your_api_key_here" > email-functions/.env
echo "FROM_EMAIL=noreply@yourbibleapp.com" >> email-functions/.env
echo "FROM_NAME=Bible Buddy" >> email-functions/.env

# Create .env file in notification-functions directory  
echo "FCM_SERVER_KEY=your_fcm_server_key" > notification-functions/.env
```

### 4. Update Hosting Configuration

Edit `hosting/public/index.html` and replace the placeholder URLs with your actual app URLs, or use the environment-based approach shown in the updated file.

### 5. Import Bible Data (Optional)

```bash
# Import Bible study data from JSON files
npm run importBibleData

# Set up Firestore indexes
npm run updateIndexes

# Update existing Bible data (if you have existing data)
npm run bulkUpdateBibleData
```

### 6. Deploy Functions

```bash
# Deploy to development
npm run deploy

# Deploy to production  
firebase use prod
npm run deploy-prod
```

### 7. Deploy Hosting

```bash
# Deploy hosting
firebase deploy --only hosting

# Or deploy everything
firebase deploy
```

## 🔧 MailerLite Setup

### 1. Get MailerLite API Key
1. Login to your MailerLite account
2. Go to Integrations > Developer API
3. Generate a new API key
4. Copy the API key for use in environment variables

### 2. Create Email Groups (Optional)
1. In MailerLite, create groups for different types of subscribers (e.g., "Daily Verse", "Study Plans", "Prayer Reminders")
2. Note the Group ID for use in environment configuration

### 3. Set Up Email Templates
Email templates are now handled programmatically in the code rather than using external template engines.

## 🧪 Testing

### Local Testing
```bash
# Start Firebase emulators
npm run serve

# Test email endpoint
curl -X POST http://localhost:5001/your-project/us-central1/email-sendBibleStudyRecommendation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -d '{"email":"test@example.com","studyData":[],"userPreferences":{}}'
```

### Production Testing
Replace `localhost:5001` with your deployed function URL:
`https://us-central1-your-project.cloudfunctions.net/`

## 📱 App Integration

### Deep Link Testing
Test your app deep links by visiting:
- Success: `https://your-project.web.app/?status=success`
- Cancel: `https://your-project.web.app/?status=cancel` 
- Default: `https://your-project.web.app/`

## 🚨 Troubleshooting

### Common Issues

1. **Functions not deploying**: Check Node.js version (must be 22+)
2. **Environment variables not working**: Ensure they're set correctly with `firebase functions:config:get`
3. **MailerLite API errors**: Verify API key and check MailerLite dashboard for rate limits
4. **Deep links not working**: Ensure your app is configured to handle the URL schemes

### Debug Commands
```bash
# View function logs
firebase functions:log

# Get current config
firebase functions:config:get

# Test local functions
firebase functions:shell
```

## 🔐 Security Notes

- Never commit API keys to version control
- Use different API keys for development and production
- Set up Firestore security rules appropriately
- Enable Firebase App Check for additional security

## 📞 Support

If you encounter issues:
1. Check the Firebase Console for error logs
2. Verify all environment variables are set correctly
3. Ensure MailerLite account is active and has sufficient credits
4. Test deep links with your actual app installation

## 📖 Bible-Specific Configuration

### Data Structure
The Bible Buddy API expects the following data structure:
- **Books**: Bible books with metadata
- **Verses**: Individual verses with references
- **Study Plans**: Structured reading plans
- **Topics**: Categorized study topics
- **Commentary**: Study notes and explanations

### User Preferences
Users can set preferences for:
- Favorite Bible translations
- Preferred study topics
- Reading difficulty level
- Notification frequency
- Study group participation