/**
 * Setup script to create .env file for Gemini API key
 * Run: node setup-env.js
 */

const fs = require('fs');
const path = require('path');

const envContent = `# Google Gemini AI API Key
# Get your free API key from: https://aistudio.google.com/app/apikey
# Replace 'your_gemini_api_key_here' with your actual API key

VITE_GEMINI_API_KEY=your_gemini_api_key_here
`;

const envPath = path.join(__dirname, '.env');

try {
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists!');
    console.log('   If you want to recreate it, delete the existing .env file first.');
    process.exit(0);
  }

  // Create .env file
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ .env file created successfully!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Open .env file in the project root');
  console.log('   2. Replace "your_gemini_api_key_here" with your actual Gemini API key');
  console.log('   3. Get your API key from: https://aistudio.google.com/app/apikey');
  console.log('   4. Restart your development server (npm run dev)');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
}
