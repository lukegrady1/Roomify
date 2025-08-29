# Supabase Setup Guide for Roomify

This guide will walk you through setting up Supabase for the Roomify application's authentication system.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in/create an account
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `Roomify` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Start with the free tier

## 2. Get Your Project Credentials

After your project is created:

1. Go to **Settings** → **API**
2. Copy these values for your environment variables:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. Environment Variables Setup

Create a `.env.local` file in your `client/` directory:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Important**: 
- Replace the example values with your actual Supabase credentials
- Add `.env.local` to your `.gitignore` to avoid committing secrets
- For production deployment, set these as environment variables in your hosting platform

## 4. Database Schema Setup

Run this SQL in your Supabase **SQL Editor** (Settings → SQL Editor):

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  school_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create other required tables for the app
-- (Add the full schema from your schema.sql file here)
```

## 5. Authentication Settings

### Email Settings
1. Go to **Authentication** → **Settings**
2. Configure these settings:

**Site URL**: 
- Development: `http://localhost:5173`
- Production: `https://yourdomain.com`

**Redirect URLs** (add all these):
- `http://localhost:5173/**`
- `http://localhost:5174/**`
- `http://localhost:5175/**`
- `http://localhost:5176/**` (for different dev ports)
- `https://yourdomain.com/**` (your production domain)

### Email Authentication
1. **Enable Email Provider**: ✅ Enabled
2. **Confirm Email**: ✅ Enabled (recommended for production)
3. **Secure Email Change**: ✅ Enabled
4. **Email OTP**: Configure if you want magic links

### Email Templates (Optional)
You can customize the email templates in **Authentication** → **Email Templates**:
- **Confirm Signup**: Welcome email with confirmation link
- **Reset Password**: Password reset instructions
- **Magic Link**: One-click sign-in email

## 6. OAuth Providers Setup (Optional)

### Google OAuth Setup
1. Go to **Authentication** → **Providers**
2. Enable **Google**
3. Get credentials from [Google Cloud Console](https://console.cloud.google.com/):

**Google Cloud Console Steps:**
1. Create a new project or select existing
2. Enable Google+ API
3. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
4. Set **Application type**: Web application
5. Add **Authorized redirect URIs**:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```

6. Copy **Client ID** and **Client Secret** to Supabase

### Other Providers (GitHub, Discord, etc.)
Similar process for other OAuth providers:
1. Enable in Supabase Dashboard
2. Create OAuth app in provider's developer console
3. Set redirect URI to: `https://your-project-ref.supabase.co/auth/v1/callback`
4. Add credentials to Supabase

## 7. Row Level Security (RLS) Policies

Make sure RLS is enabled and policies are set up for all tables:

```sql
-- Example policies for listings table
CREATE POLICY "Everyone can view published listings" ON public.listings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create listings" ON public.listings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own listings" ON public.listings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" ON public.listings
  FOR DELETE USING (auth.uid() = user_id);
```

## 8. Testing the Setup

1. Start your development server: `npm run dev`
2. Navigate to `/auth`
3. Try these tests:

### Email/Password Test:
1. **Sign Up**: Create a new account
2. **Check Email**: Look for confirmation email (if enabled)
3. **Sign In**: Use the same credentials
4. **Password Reset**: Test the forgot password flow

### Google OAuth Test:
1. Click "Continue with Google"
2. Should redirect to Google login
3. After authentication, should redirect back to `/search`

## 9. Production Deployment

### Environment Variables
Set these in your hosting platform (Vercel, Netlify, etc.):
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Domain Configuration
Update Supabase settings with your production domain:
1. **Site URL**: `https://yourdomain.com`
2. **Redirect URLs**: Add your production URLs

### Security Considerations
1. **Enable RLS** on all tables
2. **Review policies** to ensure proper access control
3. **Enable email confirmation** for production
4. **Set up proper CORS** policies
5. **Monitor usage** in Supabase dashboard

## 10. Troubleshooting

### Common Issues:

**"Invalid login credentials" error:**
- Check if email confirmation is required
- Verify the user exists in Authentication → Users
- Check if the password is correct

**"Invalid redirect URL" error:**
- Add all possible URLs to Redirect URLs in settings
- Include different ports for development
- Make sure URLs end with `/**`

**OAuth not working:**
- Verify OAuth app settings in provider console
- Check redirect URI matches exactly
- Ensure OAuth is enabled in Supabase

**Database connection issues:**
- Check environment variables are set correctly
- Verify Supabase project is active
- Check network connectivity

### Debug Mode
Add this to see detailed auth information in development:
```typescript
// In your app, temporarily add:
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, session);
});
```

## 11. Additional Features (Optional)

### Email Rate Limiting
Configure rate limits in **Authentication** → **Settings** → **Rate Limits**

### Custom SMTP
Set up custom email provider in **Settings** → **Auth** → **SMTP Settings**

### Multi-Factor Authentication
Enable MFA in **Authentication** → **Settings** → **Auth Security**

### Webhook Integration
Set up auth webhooks in **Authentication** → **Settings** → **Webhooks**

---

## Quick Checklist ✅

- [ ] Supabase project created
- [ ] Environment variables set
- [ ] Database schema created
- [ ] RLS policies configured
- [ ] Email provider configured
- [ ] Site URLs set correctly
- [ ] OAuth providers set up (if needed)
- [ ] Authentication tested in development
- [ ] Production deployment configured

---

**Need Help?**
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Discord Community](https://discord.supabase.com/)
- Check the browser console for detailed error messages