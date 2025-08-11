import "./App.css";
import { useState, useCallback } from "react";
import { Upload, FileText, Loader2, Share2, RotateCcw, Sparkles, Target, Zap, Linkedin, Github } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const BACKENDURL = import.meta.env.VITE_BACKEND_URL;

  const handleFileUpload = useCallback((uploadedFile) => {
    if (uploadedFile.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    if (uploadedFile.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File size must be less than 10MB.");
      return;
    }
    setFile(uploadedFile);
    setError("");
    setSuggestions("");
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragActive(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileUpload(droppedFile);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFileUpload(selectedFile);
      }
    },
    [handleFileUpload]
  );

  async function handleAnalyzeResume() {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    const base = (BACKENDURL || "").replace(/\/+$/, "");
    const url = base + "/analyze/resume";

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let message = "Failed to analyze resume";
        try {
          const err = await response.json();
          if (err?.message) message = err.message;
        } catch (_) {
          // ignore parse errors
        }
        throw new Error(message);
      }

      const data = await response.json();
      
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      } else {
        throw new Error("No suggestions received from server");
      }
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setError(error?.message || "Failed to analyze resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const resetApp = () => {
    setFile(null);
    setJobDescription("");
    setSuggestions("");
    setError("");
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Resume Analysis Results',
          text: suggestions,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(suggestions);
      }
    } else {
      navigator.clipboard.writeText(suggestions);
    }
  };

  if (suggestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-google-gray-50 to-google-gray-100">
        {/* Header */}
        <header className="bg-white shadow-google sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-google-blue to-google-green rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-google font-semibold text-google-gray-900">
                  Resume Optimizer
                </h1>
              </div>
              <div className="flex items-center space-x-2 text-google-gray-600">
                <span className="w-2 h-2 bg-google-green rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Analysis Complete</span>
              </div>
            </div>
          </div>
        </header>

        {/* Results Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-fade-in">
            {/* Results Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-google-red to-google-yellow rounded-full mb-4 animate-bounce-gentle">
                <span className="text-2xl">🔥</span>
              </div>
              <h2 className="text-4xl font-google font-bold text-google-gray-900 mb-2">
                Your Resume Review
              </h2>
              <p className="text-google-gray-600 text-lg">
                Here's what our AI thinks about your resume
              </p>
            </div>

            {/* Results Card */}
            <div className="card-google p-8 mb-8">
              <div className="prose prose-lg max-w-none">
                <div className="bg-gradient-to-r from-google-blue-light to-google-gray-50 rounded-xl p-6 border-l-4 border-google-blue">
                  <div className="text-google-gray-800 leading-relaxed">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({children}) => <h1 className="text-2xl font-bold text-google-gray-900 mb-4 mt-6 flex items-center"><Target className="w-6 h-6 mr-2 text-google-blue" />{children}</h1>,
                        h2: ({children}) => <h2 className="text-xl font-semibold text-google-gray-900 mb-3 mt-6 flex items-center"><Zap className="w-5 h-5 mr-2 text-google-yellow" />{children}</h2>,
                        h3: ({children}) => <h3 className="text-lg font-medium text-google-gray-900 mb-2 mt-4">{children}</h3>,
                        h4: ({children}) => <h4 className="text-base font-medium text-google-gray-900 mb-2 mt-3">{children}</h4>,
                        p: ({children}) => <p className="mb-4 text-google-gray-700 leading-relaxed">{children}</p>,
                        ul: ({children}) => <ul className="list-none mb-4 space-y-2">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-2 text-google-gray-700">{children}</ol>,
                        li: ({children}) => <li className="text-google-gray-700 flex items-start"><span className="text-google-blue mr-2 mt-1 flex-shrink-0">•</span><span className="flex-1">{children}</span></li>,
                        strong: ({children}) => <strong className="font-semibold text-google-gray-900 bg-yellow-100 px-1 rounded">{children}</strong>,
                        em: ({children}) => <em className="italic text-google-blue">{children}</em>,
                        blockquote: ({children}) => <blockquote className="border-l-4 border-google-yellow bg-google-gray-50 p-4 my-4 italic">{children}</blockquote>,
                        code: ({children}) => <code className="bg-google-gray-100 text-google-gray-800 px-2 py-1 rounded text-sm font-mono">{children}</code>,
                        pre: ({children}) => <pre className="bg-google-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                        table: ({children}) => (
                          <div className="overflow-x-auto mb-6">
                            <table className="min-w-full bg-white border border-google-gray-300 rounded-lg shadow-sm">
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({children}) => <thead className="bg-google-gray-50">{children}</thead>,
                        tbody: ({children}) => <tbody className="divide-y divide-google-gray-200">{children}</tbody>,
                        tr: ({children}) => <tr className="hover:bg-google-gray-50 transition-colors">{children}</tr>,
                        th: ({children}) => <th className="px-4 py-3 text-left text-xs font-medium text-google-gray-700 uppercase tracking-wider border-b border-google-gray-300">{children}</th>,
                        td: ({children}) => <td className="px-4 py-3 text-sm text-google-gray-700 border-b border-google-gray-200">{children}</td>,
                        hr: () => <hr className="my-6 border-google-gray-300" />,
                        a: ({href, children}) => <a href={href} className="text-google-blue hover:text-google-blue-dark underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                      }}
                    >
                      {suggestions}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetApp}
                className="btn-secondary text-lg px-8 py-4 group"
              >
                <RotateCcw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                Try Another Resume
              </button>
              <button
                onClick={shareResults}
                className="btn-primary text-lg px-8 py-4 group"
              >
                <Share2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Share Results
              </button>
            </div>
          </div>
        </main>
        
        {/* Footer Banner */}
        <footer className="bg-white border-t border-google-gray-200 py-6 mt-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-3">
              <a 
                href="https://www.linkedin.com/in/shivam-saurabh-b5bb22279/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </a>
              
              <a 
                href="https://github.com/shivamsbh/resume-review" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
            </div>
            
            <p className="text-google-gray-600 text-sm">
              Made by <span className="font-semibold text-google-gray-800">shivamsbh</span> with ❤️
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-google-gray-50 to-google-gray-100">
      {/* Header */}
      <header className="bg-white shadow-google">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-google-blue to-google-green rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-google font-semibold text-google-gray-900">
                Resume Optimizer
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-fade-in">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-google font-bold text-google-gray-900 mb-4">
              Optimize your resume for
              <span className="bg-gradient-to-r from-google-blue to-google-green bg-clip-text text-transparent"> success</span>
            </h2>
            <p className="text-xl text-google-gray-600 max-w-2xl mx-auto leading-relaxed">
              Upload your resume and job description to get AI-powered suggestions. 
              Improve your skills and increase your chances of landing the job.
            </p>
          </div>

          {/* Upload Section */}
          <div className="card-google p-8 mb-8 animate-slide-up">
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer group ${
                dragActive 
                  ? 'border-google-blue bg-google-blue-light scale-105 shadow-google-lg' 
                  : file 
                    ? 'border-google-green bg-green-50' 
                    : 'border-google-gray-300 hover:border-google-blue hover:bg-google-blue-light hover:shadow-google-lg'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <div className="space-y-6">
                <div className={`transition-all duration-300 ${dragActive ? 'animate-bounce-gentle scale-110' : 'group-hover:scale-110'}`}>
                  {file ? (
                    <div className="w-16 h-16 bg-google-green rounded-full flex items-center justify-center mx-auto">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                  ) : dragActive ? (
                    <div className="w-16 h-16 bg-google-blue rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-white animate-bounce" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-google-gray-200 group-hover:bg-google-blue rounded-full flex items-center justify-center mx-auto transition-colors duration-300">
                      <Upload className="w-8 h-8 text-google-gray-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-google font-medium text-google-gray-900 mb-2">
                    {file ? file.name : dragActive ? 'Drop it here!' : 'Upload your resume'}
                  </h3>
                  <p className="text-google-gray-600 mb-2">
                    {file ? 'Ready to analyze!' : 'Drag and drop your PDF here, or click to browse'}
                  </p>
                  <p className="text-sm text-google-gray-500">
                    PDF files only • Max 10MB
                  </p>
                </div>
              </div>
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-up">
                <div className="flex items-center">
                  <span className="text-red-500 text-xl mr-3">⚠️</span>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

          </div>

          {/* Job Description Section */}
          <div className="card-google p-8 mb-8 animate-slide-up">
            <h3 className="text-2xl font-google font-medium text-google-gray-900 mb-4">
              Job Description
            </h3>
            <p className="text-google-gray-600 mb-4">
              Paste the job description you're applying for to get targeted suggestions.
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-40 p-4 border border-google-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue focus:border-transparent resize-none text-google-gray-900"
              rows={6}
            />
          </div>

          {/* Analyze Button */}
          {file && jobDescription && (
            <div className="text-center animate-slide-up">
              <button
                onClick={handleAnalyzeResume}
                disabled={isLoading}
                className={`btn-primary text-lg px-8 py-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing your resume...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Analyze Resume</span>
                  </div>
                )}
              </button>
            </div>
          )}
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { 
                icon: <Sparkles className="w-8 h-8 text-google-blue" />, 
                title: 'AI-Powered Analysis', 
                desc: 'Advanced AI thoroughly analyzes your resume content and structure' 
              },
              { 
                icon: <Zap className="w-8 h-8 text-google-yellow" />, 
                title: 'Instant Results', 
                desc: 'Get comprehensive feedback in seconds, not days' 
              },
              { 
                icon: <Target className="w-8 h-8 text-google-green" />, 
                title: 'Actionable Insights', 
                desc: 'Receive specific, actionable suggestions to improve your CV' 
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="card-google p-6 text-center animate-fade-in hover:scale-105 transition-transform duration-300" 
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-lg font-google font-semibold text-google-gray-900 mb-2">{feature.title}</h3>
                <p className="text-google-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-google-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <a 
                href="https://www.linkedin.com/in/shivam-saurabh-b5bb22279/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </a>
              
              <a 
                href="https://github.com/shivamsbh/resume-review" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
            </div>
            
            <p className="text-google-gray-600">
              Made by <span className="font-semibold text-google-gray-800">shivamsbh</span> with ❤️ • Get honest feedback to improve your career prospects
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
