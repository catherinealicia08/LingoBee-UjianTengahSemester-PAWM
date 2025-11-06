import express from 'express';
import {
  getSections,
  getCompletedNodes,
  getQuestions,
  completeNode
  // ✅ REMOVED updateHearts import
} from '../controllers/practiceController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all sections with nodes
router.get('/sections', authenticateToken, getSections);

// Get completed nodes for current user
router.get('/completed', authenticateToken, getCompletedNodes);

// Get questions for specific node
router.get('/questions/:sectionId/:nodeId', authenticateToken, getQuestions);

// Mark node as completed
router.post('/complete', authenticateToken, completeNode);

// ✅ REMOVED hearts route
// router.put('/hearts', authenticateToken, updateHearts);

export default router;