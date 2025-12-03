# Interactive E-Book Reader

A modern, interactive web-based book reader built with Next.js, featuring quiz assessments, user progress tracking, and full-text search capabilities.

## Features

### 📚 Interactive Reading Experience
- Clean, responsive interface with dark mode support
- Collapsible navigation panels
- MathJax support for mathematical formulas
- Smooth animations and transitions

### 🧪 MCQ Testing System
- 30 multiple-choice questions per chapter
- Instant scoring and feedback
- Show/Hide answers functionality
- Progress tracking for logged-in users

### 📊 Learning Dashboard
- Track quiz performance across chapters
- View overall statistics and average scores
- Get personalized recommendations based on mistakes
- Visual progress indicators

### 🔍 Full-Text Search
- Search across all chapters
- Context-aware results with snippets
- Heading and content matching
- Click to navigate to results

### 👤 User Authentication
- Google Sign-In integration
- Admin and user roles
- Personalized progress tracking

### 🐍 Python Code Executor (Pyodide)
- Run Python code directly in the browser
- Interactive code editor in right panel
- Perfect for learning and experimentation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Python Runtime**: Pyodide

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Firebase project setup

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd E-Book-main
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a \`.env\` file in the root directory with your Firebase credentials:
\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

The easiest way to deploy is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=your-repo-url)

Or manually:
\`\`\`bash
npm run build
vercel --prod
\`\`\`

Make sure to add your environment variables in the Vercel dashboard.

## Project Structure

\`\`\`
├── public/
│   └── content/          # HTML chapter files
├── src/
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   │   ├── Layout/
│   │   ├── Modals/
│   │   └── Panels/
│   ├── contexts/        # React contexts (Auth)
│   ├── data/           # Quiz data
│   ├── lib/            # Utilities and services
│   └── store/          # Zustand store
└── ...config files
\`\`\`

## Usage

### Adding Content
1. Sign in as an admin user
2. Click your profile → "Add Content"
3. Upload HTML chapter files or create content using the rich text editor

### Customizing Quizzes
Edit \`src/data/quizData.js\` to add or modify quiz questions for each chapter.

### Modifying Chapters
Update the chapter list in \`src/lib/searchService.js\` to match your content.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
