import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import { generateResumeSuggestions } from "./utils/ai.js";
import pdfExtraction from "pdf-extraction";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for file upload with optimizations
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1, // Only allow 1 file
    fields: 5, // Allow multiple text fields
    fieldSize: 50 * 1024, // 50KB for text fields
    parts: 10 // Allow more parts for file + text fields
  },
  fileFilter: (req, file, cb) => {
    // Pre-filter files to reject non-PDFs immediately
    if (file.mimetype !== 'application/pdf') {
      return cb(null, false);
    }
    cb(null, true);
  }
});

app.get("/", (_req, res) => {
  res.status(200).json({ message: "working" });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    provider: "openrouter",
    model: process.env.AI_MODEL || "deepseek/deepseek-chat-v3-0324:free",
    baseURL: process.env.AI_BASE_URL || "https://openrouter.ai/api/v1",
    hasKey: Boolean(process.env.OPENROUTER_API_KEY),
  });
});

app.post("/save", (req, res) => {
  console.log(req.body?.review);
  res.status(200).json({ id: "ajdashldas" });
});

app.post(
  "/analyze/resume",
  upload.single("resume"),
  async (req, res) => {
    const startTime = Date.now();
    try {
      if (!req.file) {
        res.status(400).json({ message: "No resume file provided" });
        return;
      }

      if (!req.body.jobDescription) {
        res.status(400).json({ message: "Job description is required" });
        return;
      }

      // File type already validated by fileFilter, but double-check for safety
      if (req.file.mimetype !== "application/pdf") {
        res.status(400).json({ message: "Only PDF files are supported" });
        return;
      }

      const memoryBefore = process.memoryUsage().heapUsed / 1024 / 1024;
      console.log(`Processing PDF (${req.file.size} bytes)... Memory: ${memoryBefore.toFixed(2)}MB`);
      
      // Process PDF parsing and AI generation in parallel where possible
      const pdfParseStart = Date.now();
      const pdfData = await pdfExtraction(req.file.buffer);
      const pdfParseTime = Date.now() - pdfParseStart;
      
      const resumeContent = (pdfData.text || "").trim();

      if (!resumeContent) {
        res.status(400).json({ message: "Could not extract text from PDF" });
        return;
      }

      // Truncate content if too long to reduce AI processing time
      const maxContentLength = 8000; // Reasonable limit for AI processing
      const processedContent = resumeContent.length > maxContentLength 
        ? resumeContent.substring(0, maxContentLength) + "..."
        : resumeContent;

      const jobDescription = req.body.jobDescription.trim();
      if (!jobDescription) {
        res.status(400).json({ message: "Job description cannot be empty" });
        return;
      }

      console.log(`Extracted ${resumeContent.length} characters (${pdfParseTime}ms). Processing ${processedContent.length} chars for analysis...`);
      
      const aiStart = Date.now();
      const suggestions = await generateResumeSuggestions(processedContent, jobDescription);
      const aiTime = Date.now() - aiStart;
      const totalTime = Date.now() - startTime;
      
      // Explicitly clear memory references
      req.file.buffer = Buffer.alloc(0); // Clear the buffer
      
      const memoryAfter = process.memoryUsage().heapUsed / 1024 / 1024;
      console.log(`Analysis completed in ${totalTime}ms (PDF: ${pdfParseTime}ms, AI: ${aiTime}ms)`);
      console.log(`Memory: ${memoryBefore.toFixed(2)}MB → ${memoryAfter.toFixed(2)}MB (${(memoryAfter - memoryBefore).toFixed(2)}MB change)`);
      
      res.status(200).json({ 
        message: "Success", 
        suggestions,
        processingTime: `${totalTime}ms`,
        breakdown: {
          pdfParsing: `${pdfParseTime}ms`,
          aiGeneration: `${aiTime}ms`,
          total: `${totalTime}ms`
        }
      });
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`Error processing resume after ${processingTime}ms:`, error);
      const message = error instanceof Error ? error.message : "Error processing resume";
      
      // Clear memory even on error
      if (req.file?.buffer) {
        req.file.buffer = Buffer.alloc(0);
      }
      
      res.status(500).json({ message, processingTime: `${processingTime}ms` });
    } finally {
      // Force garbage collection hint (if available)
      if (global.gc) {
        global.gc();
      }
    }
  }
);

// Multer error handler (e.g., file too large)
app.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Max size is 5MB" });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  return next(err);
});

// General error handler fallback
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
