# Job Application Assistant

A web app that helps job seekers **analyze job descriptions**, **improve their resumes**, and **generate tailored cover letters** using AI.  
The goal is to make applying for jobs faster, smarter, and less stressful.

---

## Features

### ✅ Job Description Analysis

- Paste any job description.
- AI extracts **key skills** and **responsibilities**.

### ✅ Resume Matching Score

- Upload your resume.
- Get a **match percentage** against the job description.

### ✅ Resume Improvement Suggestions

- AI suggests **specific improvements** to strengthen your resume.

### ✅ Cover Letter Generator

- Automatically generates a **customized cover letter** for the role.

### ✅ Application Email Generator

- Drafts a **professional email** for job applications.

### ✅ Guest Progress Persistence

- Thanks to **IndexedDB**, progress is saved locally — no account needed.
- Reload the page without losing your results.

---

## 🛠 Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), [TailwindCSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Storage:** IndexedDB
- **Backend:** [Express.js](https://expressjs.com/) with TypeScript
- **Testing:** [Jest](https://jestjs.io/) + [Supertest](https://github.com/ladjs/supertest)
- **AI API:** OpenAI GPT-4 (analysis, scoring, suggestions, and generation)

---

## Getting Started

1. Clone the repo:

```bash
git clone https://github.com/dinakajoy/job-application-assistant.git
cd job-application-assistant
```

2. Install dependencies:

```
cd backend
npm install
```

```
cd frontend
npm install
```

3. Set up environment variables. Check `.env-example` files:

```
OPENAI_API_KEY=your_api_key_here
```

4. Run the dev server for both frontend and backend:

```
npm run dev
```

---

## Contributing

Contributions are welcome!
If you would like to suggest a feature or fix, feel free to open an issue or PR.
