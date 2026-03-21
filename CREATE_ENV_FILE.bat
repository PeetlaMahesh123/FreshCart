@echo off
echo 🔧 Creating .env file with your Supabase credentials...
echo.

REM Create .env file
(
echo # Supabase Configuration - REPLACE WITH YOUR ACTUAL CREDENTIALS
echo VITE_SUPABASE_URL=https://your-project-id.supabase.co
echo VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
echo.
echo # Site Configuration
echo VITE_SITE_URL=https://peetlamahesh123.github.io/FreshCart
echo.
echo ✅ .env file created successfully!
echo.
echo 📋 Next steps:
echo 1. Replace placeholder values with your actual Supabase credentials
echo 2. Save the file
echo 3. Run: npm run dev
echo.
echo 🌐 Your app will work at: http://localhost:5173/
echo.

pause
