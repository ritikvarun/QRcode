import { Router } from 'express';
import { handleRedirect } from '../controllers/redirect.controller.js';

const router = Router();

// Public dynamic QR code redirect: GET /q/:qrId
router.get('/:qrId', handleRedirect);

export default router;
