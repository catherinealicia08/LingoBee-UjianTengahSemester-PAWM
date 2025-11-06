import express from 'express';
import { 
  getAssignments, 
  getAssignmentDetails,
  submitAssignment,
  markAsDone,
  addClassComment,
  addPrivateComment,
  getUploadUrl,
  uploadFile,
  upload // ✅ Multer middleware
} from '../controllers/assignmentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// ========================================
// ALL ROUTES REQUIRE AUTHENTICATION
// ========================================
router.use(authenticateToken);

// ========================================
// ASSIGNMENT ROUTES
// ========================================

// Get all assignments for current user
router.get('/', getAssignments);

// Get single assignment details
router.get('/:id', getAssignmentDetails);

// Submit assignment
router.post('/submit', submitAssignment);

// Mark assignment as done (without file)
router.post('/mark-done', markAsDone);

// Add class comment
router.post('/class-comment', addClassComment);

// Add private comment
router.post('/private-comment', addPrivateComment);

// Get upload URL (optional - for client-side upload)
router.post('/upload-url', getUploadUrl);

// ✅ UPLOAD FILE - Multer handles multipart/form-data
router.post('/upload', upload.single('file'), uploadFile);

export default router;