import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
  getFeaturedNews,
  getMaterials,
  getDashboardStats,
  getMaterialFilters
} from '../controllers/dashboardController.js';

const router = express.Router();

// Get featured news (public or authenticated)
router.get('/featured-news', authenticateToken, getFeaturedNews);

// Get materials with optional filters
router.get('/materials', authenticateToken, getMaterials);

// Get dashboard stats for current user
router.get('/stats', authenticateToken, getDashboardStats);

// Get material filters (chapters and skills)
router.get('/material-filters', authenticateToken, getMaterialFilters);

export default router;