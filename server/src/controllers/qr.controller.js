import {
  generateShortId,
  normalizeUrl,
  generateQrDataUrl,
  generateQrBuffer,
} from '../utils/qrHelper.js';
import {
  createQR,
  findQRById,
  findQRByQrId,
  listQRs,
  updateQR,
  deleteQR,
  getStats,
} from '../services/store.service.js';

/**
 * Create a new dynamic QR code
 */
export const createQRCode = async (req, res, next) => {
  try {
    const { title, destinationUrl, folder, addLater } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required (e.g. Book Name or Chapter Name)',
      });
    }

    // If destinationUrl is provided, normalize it. If addLater is checked, allow empty URL
    let normalizedDest = '';
    if (destinationUrl && destinationUrl.trim()) {
      normalizedDest = normalizeUrl(destinationUrl.trim());
    } else if (!addLater) {
      return res.status(400).json({
        success: false,
        message: 'Destination URL is required (or select "Add Destination URL Later")',
      });
    }

    // Generate unique short ID
    let qrId;
    let collision = true;
    let attempts = 0;

    while (collision && attempts < 5) {
      qrId = generateShortId(6);
      const existing = await findQRByQrId(qrId);
      if (!existing) {
        collision = false;
      }
      attempts++;
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const shortUrl = `${baseUrl}/q/${qrId}`;

    // Generate permanent QR Code data URL encoding the shortUrl
    const qrDataUrl = await generateQrDataUrl(shortUrl);

    const newQR = await createQR({
      qrId,
      title: title.trim(),
      destinationUrl: normalizedDest,
      shortUrl,
      folder: (folder && folder.trim()) || 'No Folder',
      status: 'active',
      scanCount: 0,
      qrDataUrl,
      createdBy: req.user?._id || req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: 'Dynamic QR code generated successfully',
      data: newQR,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * List all QR codes with search and filter
 */
export const getQRCodes = async (req, res, next) => {
  try {
    const { search, status, folder } = req.query;
    const qrs = await listQRs({ search, status, folder });

    res.status(200).json({
      success: true,
      count: qrs.length,
      data: qrs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get dashboard overview metrics
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await getStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single QR code by ID
 */
export const getQRCodeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const qr = await findQRById(id);

    if (!qr) {
      return res.status(404).json({
        success: false,
        message: 'QR code not found',
      });
    }

    res.status(200).json({
      success: true,
      data: qr,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update QR code (Title, Destination URL, Folder)
 * CRITICAL: destinationUrl is updated while qrId and shortUrl remain constant!
 */
export const updateQRCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, destinationUrl, folder } = req.body;

    const qr = await findQRById(id);
    if (!qr) {
      return res.status(404).json({
        success: false,
        message: 'QR code not found',
      });
    }

    const updates = {};
    if (title && title.trim()) updates.title = title.trim();
    if (folder !== undefined) updates.folder = folder.trim() || 'No Folder';
    if (destinationUrl !== undefined) {
      updates.destinationUrl = destinationUrl.trim() ? normalizeUrl(destinationUrl) : '';
    }

    // Update in store
    const updatedQR = await updateQR(id, updates);

    res.status(200).json({
      success: true,
      message: 'Destination URL updated successfully without altering the printed QR image',
      data: updatedQR,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle active / disabled status
 */
export const toggleQRCodeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const qr = await findQRById(id);

    if (!qr) {
      return res.status(404).json({
        success: false,
        message: 'QR code not found',
      });
    }

    const newStatus = qr.status === 'active' ? 'disabled' : 'active';
    const updated = await updateQR(id, { status: newStatus });

    res.status(200).json({
      success: true,
      message: `QR code ${newStatus === 'active' ? 'enabled' : 'disabled'} successfully`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a QR code
 */
export const deleteQRCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const qr = await findQRById(id);

    if (!qr) {
      return res.status(404).json({
        success: false,
        message: 'QR code not found',
      });
    }

    await deleteQR(id);

    res.status(200).json({
      success: true,
      message: 'QR code deleted permanently',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Download PNG image of the QR code
 */
export const downloadQRCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const qr = await findQRById(id);

    if (!qr) {
      return res.status(404).json({
        success: false,
        message: 'QR code not found',
      });
    }

    const buffer = await generateQrBuffer(qr.shortUrl);
    const filename = `qr-${qr.qrId}-${(qr.title || 'code').replace(/[^a-z0-9_-]/gi, '_')}.png`;

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};
