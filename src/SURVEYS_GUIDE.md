# Feedback Surveys Guide

## Overview

The Feedback Surveys system allows you to gather direct user feedback across web, iOS App Store, and Google Play platforms. This provides qualitative insights to complement your quantitative analytics data.

## Features

### ✅ Multi-Platform Support
- **Web**: Surveys shown to website visitors
- **iOS**: Target iOS App Store users specifically  
- **Android**: Target Google Play Store users specifically
- **All Platforms**: Show surveys across all platforms

### ✅ Survey Types
1. **Text Questions**: Free-form text responses
2. **Rating Questions**: 1-5 star ratings
3. **Multiple Choice**: Select from predefined options
4. **Yes/No Questions**: Simple binary choice
5. **NPS (Net Promoter Score)**: 0-10 likelihood scale

### ✅ Survey Management
- Create, edit, and delete surveys
- Draft, active, and closed status management
- Platform-specific targeting
- Required/optional questions
- Multi-question surveys with progress tracking

### ✅ Analytics & Insights
- **Response Tracking**: Total responses by platform
- **Platform Breakdown**: Web, iOS, Android split
- **Question Analytics**:
  - Average scores for rating/NPS questions
  - Distribution charts for multiple choice
  - Yes/No ratio visualization
  - Text response collection

## How to Use

### Creating a Survey

1. **Navigate to CRM Dashboard**
   - Click "Admin Panel" → "CRM Dashboard"
   - Select the "Surveys" tab

2. **Click "Create Survey"**
   - Enter internal name (for your reference)
   - Add survey title (shown to users)
   - Write a brief description
   - Select target platform

3. **Add Questions**
   - Click question type buttons (Text, Rating, Multiple Choice, Yes/No, NPS)
   - Enter question text
   - Mark as required/optional
   - For multiple choice: add custom options

4. **Save Survey**
   - Survey starts in "Draft" status
   - Activate when ready to show to users

### Managing Surveys

#### Activate a Survey
- Click "Activate Survey" on a draft
- Survey will appear to users after 10 seconds on matching platforms
- Users see the survey once (tracked in localStorage)

#### Close a Survey
- Click "Close Survey" on active surveys
- Stops showing to new users
- Preserves all collected responses

#### View Analytics
- Click the bar chart icon on any survey
- See response counts by platform
- View detailed question-by-question results
- Export insights for reporting

### Platform-Specific Targeting

#### Web Platform
- Shows to all website visitors
- Appears as modal after 10 seconds
- Progress bar and multi-step flow

#### iOS App Store
- Set `targetPlatform: 'ios'`
- User agent detection identifies iOS devices
- Ideal for app-specific feedback

#### Google Play Store
- Set `targetPlatform: 'android'`
- Detects Android devices automatically
- Gather Play Store user insights

#### All Platforms
- Shows to all users regardless of platform
- Best for general feedback surveys
- Maximizes response rate

## Survey Display Behavior

### User Experience
1. **Timing**: Survey appears 10 seconds after page load
2. **Modal Display**: Centered overlay with backdrop
3. **Progress Tracking**: Shows "Question X of Y" with progress bar
4. **Navigation**: Back/Next buttons between questions
5. **Validation**: Required questions must be answered
6. **Completion**: Thank you message on submit

### Response Storage
- Answers stored in Supabase KV table
- Key format: `survey-response:{surveyId}:{responseId}`
- Includes platform, timestamp, and metadata
- Updates survey response count automatically

### Local Tracking
- Completed surveys tracked in localStorage
- Key: `survey-completed-{surveyId}`
- Prevents duplicate responses per device
- Can be cleared for testing

## Analytics Metrics

### Overview Stats
- **Total Responses**: All survey submissions
- **Web Responses**: Desktop/mobile web users
- **iOS Responses**: iPhone/iPad users  
- **Android Responses**: Android device users

### Question-Level Analytics

#### Rating & NPS Questions
- Average score displayed prominently
- Total response count
- Useful for satisfaction metrics

#### Multiple Choice Questions
- Response count per option
- Percentage distribution
- Visual bar chart representation

#### Yes/No Questions
- Count for each option
- Ratio visualization
- Simple A/B insights

#### Text Questions
- Chronological list of all responses
- Scroll view for long lists
- Qualitative feedback collection

## Best Practices

### 1. Question Design
- ✅ Keep questions clear and concise
- ✅ Use 3-5 questions per survey (avoid fatigue)
- ✅ Mix question types for variety
- ❌ Avoid leading or biased questions

### 2. Timing & Frequency
- ✅ Show survey after user interaction (10s delay)
- ✅ One active survey at a time per platform
- ✅ Close surveys after sufficient responses
- ❌ Don't show multiple surveys in quick succession

### 3. Platform Targeting
- ✅ Use platform-specific surveys for app feedback
- ✅ Use "All Platforms" for general satisfaction
- ✅ Compare responses across platforms
- ❌ Don't over-survey any single platform

### 4. Response Analysis
- ✅ Review responses regularly
- ✅ Look for patterns in text responses
- ✅ Act on feedback and close the loop
- ✅ Share insights with your team
- ❌ Don't ignore low scores or negative feedback

## Technical Details

### Data Structure

#### Survey Object
```typescript
{
  id: string;
  name: string;              // Internal name
  title: string;             // Shown to users
  description: string;       // Survey purpose
  questions: Question[];     // Array of questions
  targetPlatform: 'web' | 'ios' | 'android' | 'all';
  status: 'draft' | 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
  responseCount: number;
}
```

#### Question Object
```typescript
{
  id: string;
  type: 'text' | 'rating' | 'multiple-choice' | 'yes-no' | 'nps';
  question: string;
  required: boolean;
  options?: string[];        // For multiple-choice
}
```

#### Response Object
```typescript
{
  id: string;
  surveyId: string;
  answers: Record<string, any>;
  platform: 'web' | 'ios' | 'android';
  metadata: {
    userAgent: string;
    timestamp: string;
  };
}
```

### API Endpoints

- `POST /surveys` - Create survey
- `GET /surveys` - List all surveys
- `GET /surveys/active?platform={platform}` - Get active survey
- `PUT /surveys/:id` - Update survey
- `DELETE /surveys/:id` - Delete survey
- `POST /surveys/:id/responses` - Submit response
- `GET /surveys/:id/analytics` - Get analytics

### Platform Detection
```javascript
const detectPlatform = () => {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'web';
};
```

## Offline Mode

The survey system works in offline mode:
- Surveys load from localStorage cache
- Failed submissions retry on next page load
- Draft surveys saved locally
- Full functionality when Supabase reconnects

## Future Enhancements

### Potential Features
- 📧 Email notifications for new responses
- 📊 Export responses to CSV/Excel
- 🎨 Custom survey themes and branding
- 🔗 Survey links for external distribution
- 📱 Push notification surveys for apps
- 🌍 Multi-language survey support
- 📅 Scheduled survey activation
- 🎯 Advanced targeting (user segments, behavior-based)

## Support

For questions or issues:
1. Check the CRM Dashboard for survey status
2. Review browser console for error messages
3. Verify Supabase backend connectivity
4. Test with different platforms/devices

---

**Created for Vision Studio Furniture E-Commerce Platform**
*Empowering data-driven decisions through direct user feedback*
