# Supabase Setup Instructions

This guide will help you set up Supabase for the Peace Pulse Mental Wellness App.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `peace-pulse-wellness`
   - Database Password: (generate a strong password)
   - Region: Choose the closest to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - Project URL
   - Anon (public) key

## 3. Set Up Environment Variables

1. Create a `.env.local` file in your project root
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with your actual values.

## 4. Set Up the Database

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase-schema.sql` from this project
3. Paste it into the SQL Editor
4. Click "Run" to execute the SQL

This will create all the necessary tables and set up Row Level Security (RLS) policies.

## 5. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure the following:
   - Site URL: `http://localhost:8082` (for development)
   - Redirect URLs: Add `http://localhost:8082/**`
   - Email confirmation: Enable if desired
   - Password requirements: Set minimum length to 6

## 6. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:8082`
3. Click the login button in the top-right corner
4. Try creating a new account
5. Test signing in and out

## 7. Database Tables Created

The following tables will be created:

- `habits` - User habit tracking
- `habit_completions` - Daily habit completion records
- `stress_entries` - Stress level tracking
- `todos` - Task management
- `sleep_entries` - Sleep tracking
- `journal_entries` - Journal entries
- `chat_messages` - Chat conversation history

## 8. Security Features

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own data
- All operations are authenticated
- Data is automatically filtered by user ID

## 9. Troubleshooting

### Common Issues:

1. **"Invalid API key" error**: Check your environment variables
2. **"User not authenticated" error**: Make sure you're signed in
3. **Database connection issues**: Verify your Supabase URL and key
4. **RLS policy errors**: Ensure the SQL schema was executed correctly

### Getting Help:

- Check the Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
- Review the console for error messages
- Check the Network tab in browser dev tools for API errors

## 10. Production Deployment

When deploying to production:

1. Update your environment variables with production values
2. Update the Site URL in Supabase Authentication settings
3. Add your production domain to Redirect URLs
4. Consider enabling email confirmation for better security
5. Set up proper CORS policies if needed

## Next Steps

Once Supabase is set up, you can:

- Customize the database schema as needed
- Add additional authentication providers (Google, GitHub, etc.)
- Set up real-time subscriptions for live updates
- Configure backup and monitoring
- Add custom functions and triggers
