# Resume Optimizer

A web application that helps you tailor your resume to a specific job description using AI-powered analysis and suggestions.

## Overview

Resume Optimizer is a full-stack web application designed to help job seekers improve their resumes. Users can upload their resume in PDF format and provide a job description for a position they are interested in. The application then uses an AI model to analyze the resume against the job description and provides actionable suggestions to improve the resume's content and increase the chances of landing an interview.

## Features

-   **📄 PDF Resume Upload**: Easily upload your resume using a drag-and-drop interface.
-   **📝 Job Description Input**: Paste the job description you're targeting.
-   **🤖 AI-Powered Analysis**: Get intelligent suggestions on how to improve your resume based on the job description.
-   **💡 Actionable Insights**: Receive specific feedback to make your resume stand out.
-   **📱 Responsive Design**: Works on both desktop and mobile devices.
-   **🚀 Fast and Efficient**: Built with a modern tech stack for a smooth user experience.

## How It Works

1.  **Upload**: The user uploads their resume (PDF) and pastes a job description into the respective fields on the frontend.
2.  **Analyze**: The frontend sends the resume and job description to the backend.
3.  **Process**: The backend server extracts the text from the PDF resume.
4.  **AI Suggestions**: The extracted resume text and the job description are sent to an AI model, which generates suggestions for improvement.
5.  **Display**: The AI-generated suggestions are sent back to the frontend and displayed to the user in a clear and readable format.

## Tech Stack

### Frontend

-   **React**: A JavaScript library for building user interfaces.
-   **Vite**: A fast build tool and development server for modern web projects.
-   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
-   **Lucide React**: A library of beautiful and consistent icons.
-   **Axios**: A promise-based HTTP client for making API requests.
-   **React Markdown**: A component to render Markdown as React components.

### Backend

-   **Node.js**: A JavaScript runtime environment for building server-side applications.
-   **Express.js**: A web application framework for Node.js.
-   **Multer**: A middleware for handling `multipart/form-data`, used for file uploads.
-   **pdf-extraction**: A library for extracting text content from PDF files.
-   **Axios**: Used to communicate with the external AI service.
-   **dotenv**: A module to load environment variables from a `.env` file.

## Installation and Setup

### Prerequisites

-   Node.js (v14 or higher)
-   npm (or yarn)
-   An API key from an AI provider that is compatible with the OpenRouter API format.

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file by copying the example:
    ```bash
    cp .env.example .env
    ```
4.  Open the `.env` file and add your AI provider's API key:
    ```
    OPENROUTER_API_KEY=your-api-key-here
    ```
5.  Start the backend server:
    ```bash
    npm start
    ```

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file by copying the example:
    ```bash
    cp .env.example .env
    ```
4.  Open the `.env` file and specify the backend URL:
    ```
    VITE_BACKEND_URL=http://localhost:3001
    ```
5.  Start the frontend development server:
    ```bash
    npm run dev
    ```

## Usage

1.  Open your web browser and navigate to the frontend URL (e.g., `http://localhost:5173`).
2.  Drag and drop your PDF resume onto the upload area, or click to select a file.
3.  Paste the job description for the role you are applying for into the text area.
4.  Click the "Analyze Resume" button.
5.  Review the AI-generated suggestions to improve your resume.

## API Documentation

The backend exposes the following API endpoints:

-   `GET /`: A simple endpoint to check if the server is running.
-   `GET /health`: Provides the status of the server and the AI service connection.
-   `POST /analyze/resume`: The main endpoint for analyzing a resume.

**Request (multipart/form-data):**

-   `resume`: The user's resume file (PDF).
-   `jobDescription`: The job description text.

**Response (JSON):**

```json
{
  "message": "Success",
  "suggestions": "AI-generated suggestions for the resume..."
}
```

## Author

This project was created by **shivamsbh**.

-   **LinkedIn**: [shivam-saurabh-b5bb22279](https://www.linkedin.com/in/shivam-saurabh-b5bb22279/)
-   **GitHub**: [shivamsbh](https://github.com/shivamsbh)
