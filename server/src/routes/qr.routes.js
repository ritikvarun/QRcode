import { Router } from 'express';
import {
  createQRCode,
  getQRCodes,
  getDashboardStats,
  getQRCodeById,
  updateQRCode,
  toggleQRCodeStatus,
  deleteQRCode,
  downloadQRCode,
} from '../controllers/qr.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all QR routes with JWT authentication
router.use(protect);

router.route('/')
  .post(createQRCode)
  .get(getQRCodes);

router.get('/stats', getDashboardStats);
router.get('/:id/download', downloadQRCode);
router.patch('/:id/status', toggleQRCodeStatus);

router.route('/:id')
  .get(getQRCodeById)
  .put(updateQRCode)
  .patch(updateQRCode)
  .delete(deleteQRCode);

export default router;
