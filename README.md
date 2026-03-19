# Shubham AptiMaster - Elite Govt Exam Prep

Shubham AptiMaster is a high-stakes competitive exam preparation application designed for Indian Government Exams like SSC CGL, Bank PO, UPSC CSAT, and Railways.

## Features

- **Dynamic Question Generation**: Powered by Gemini AI, questions are generated on-the-fly, ensuring no repetition.
- **Indian Exam Context**: Scenarios, names, and currency are tailored for Indian competitive exams.
- **Systematic Topic Rotation**: Covers the entire syllabus by rotating topics across different attempts.
- **Dual-Method Solutions**: Every arithmetic problem includes both a Traditional Method and a "Shubham Shortcut" trick.
- **Real-time Analytics**: Track your performance, accuracy, and time management.
- **Thinking Section**: Elite cognitive questions to strengthen analytical power for UPSC/State PSC aspirants.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI**: Google Gemini API (@google/genai)
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18+)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd shubham-aptimaster
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

This app is optimized for deployment on platforms like GitHub Pages or Vercel. Ensure your Gemini API key is configured in your deployment environment's secrets.

## License

MIT
