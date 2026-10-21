import { findQRByQrId, incrementScanCount } from '../services/store.service.js';

/**
 * Public dynamic redirect handler: GET /q/:qrId
 */
export const handleRedirect = async (req, res, next) => {
  try {
    const { qrId } = req.params;

    if (!qrId) {
      return res.status(400).send('Invalid QR identifier');
    }

    const qr = await findQRByQrId(qrId);

    // 1. QR Code Not Found
    if (!qr) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>QR Code Not Found</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              background-color: #090d16;
              color: #f1f5f9;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              box-sizing: border-box;
            }
            .card {
              max-width: 480px;
              background: #111827;
              border: 1px solid #1f2937;
              border-radius: 16px;
              padding: 36px 32px;
              text-align: center;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
            }
            .icon {
              font-size: 48px;
              margin-bottom: 16px;
            }
            h1 {
              font-size: 22px;
              font-weight: 700;
              margin: 0 0 10px;
              color: #f87171;
            }
            p {
              font-size: 14px;
              color: #94a3b8;
              line-height: 1.6;
              margin: 0 0 24px;
            }
            .code {
              font-family: monospace;
              background: #1e293b;
              padding: 4px 10px;
              border-radius: 6px;
              color: #e2e8f0;
              font-size: 13px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">🔍</div>
            <h1>QR Code Not Found</h1>
            <p>The QR code with ID <span class="code">${qrId}</span> does not exist or has been permanently removed.</p>
          </div>
        </body>
        </html>
      `);
    }

    // 2. QR Code Disabled / Paused
    if (qr.status === 'disabled') {
      return res.status(403).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>QR Code Inactive</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              background-color: #090d16;
              color: #f1f5f9;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              box-sizing: border-box;
            }
            .card {
              max-width: 480px;
              background: #111827;
              border: 1px solid #1f2937;
              border-radius: 16px;
              padding: 36px 32px;
              text-align: center;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
            }
            .icon {
              font-size: 48px;
              margin-bottom: 16px;
            }
            h1 {
              font-size: 22px;
              font-weight: 700;
              margin: 0 0 10px;
              color: #fbbf24;
            }
            p {
              font-size: 14px;
              color: #94a3b8;
              line-height: 1.6;
              margin: 0 0 20px;
            }
            .badge {
              display: inline-block;
              background: rgba(251, 191, 36, 0.15);
              color: #fcd34d;
              border: 1px solid rgba(251, 191, 36, 0.3);
              font-size: 12px;
              font-weight: 600;
              padding: 4px 12px;
              border-radius: 9999px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">⏸️</div>
            <span class="badge">Temporarily Paused</span>
            <h1>QR Code Inactive</h1>
            <p><strong>${qr.title || 'This QR Code'}</strong> is currently paused by its administrator. Please check back later.</p>
          </div>
        </body>
        </html>
      `);
    }

    // 3. QR Code created for book, but destination URL not yet added (Coming Soon)
    if (!qr.destinationUrl || qr.destinationUrl.trim() === '' || qr.destinationUrl === 'coming-soon') {
      // Increment scan count so publisher knows readers are scanning
      incrementScanCount(qrId).catch(() => {});

      return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${qr.title || 'Digital Companion'} - Coming Soon</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              background-color: #090d16;
              color: #f1f5f9;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              box-sizing: border-box;
            }
            .card {
              max-width: 500px;
              background: #111827;
              border: 1px solid #1f2937;
              border-radius: 20px;
              padding: 40px 32px;
              text-align: center;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
            }
            .icon {
              font-size: 50px;
              margin-bottom: 16px;
            }
            .badge {
              display: inline-block;
              background: rgba(99, 102, 241, 0.15);
              color: #818cf8;
              border: 1px solid rgba(99, 102, 241, 0.3);
              font-size: 12px;
              font-weight: 600;
              padding: 4px 14px;
              border-radius: 9999px;
              margin-bottom: 16px;
            }
            h1 {
              font-size: 22px;
              font-weight: 700;
              margin: 0 0 10px;
              color: #ffffff;
            }
            p {
              font-size: 14px;
              color: #94a3b8;
              line-height: 1.6;
              margin: 0 0 20px;
            }
            .info-box {
              background: #0f172a;
              border: 1px solid #1e293b;
              border-radius: 12px;
              padding: 14px;
              font-size: 13px;
              color: #cbd5e1;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">📖</div>
            <span class="badge">Digital Textbook Resource</span>
            <h1>${qr.title}</h1>
            <p>You have scanned the official dynamic QR code printed for this book.</p>
            <div class="info-box">
              ✨ <strong>Content Coming Soon:</strong> The publisher is currently preparing the digital study material and solutions for this book. Please check back shortly!
            </div>
          </div>
        </body>
        </html>
      `);
    }

    // 4. Active with valid destination URL -> Increment scan count asynchronously
    incrementScanCount(qrId).catch((err) => {
      console.error(`Error incrementing scan count for ${qrId}:`, err.message);
    });

    // 5. Redirect to destination URL
    return res.redirect(302, qr.destinationUrl);
  } catch (error) {
    next(error);
  }
};
