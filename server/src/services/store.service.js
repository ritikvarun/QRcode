import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import QR from '../models/QR.js';

// In-memory fallback stores (used seamlessly when MongoDB Atlas is pending connection)
const memUsers = new Map();
const memQRs = new Map();

const isDBConnected = () => mongoose.connection.readyState === 1;

/**
 * Seed initial Admin user if no admin exists
 */
export const seedAdminIfEmpty = async () => {
  const primaryEmail = (process.env.ADMIN_INITIAL_EMAIL || 'ritikvarun64@gamil.com').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Ritik@1234';

  const emailsToSeed = [primaryEmail];
  if (primaryEmail === 'ritikvarun64@gamil.com') {
    emailsToSeed.push('ritikvarun64@gmail.com');
  }

  if (isDBConnected()) {
    for (const email of emailsToSeed) {
      try {
        const existing = await User.findOne({ email });
        if (!existing) {
          await User.create({
            name: 'Ritik Varun',
            email,
            password: adminPassword,
            role: 'admin',
          });
          console.log(`👤 [Admin Seeded in MongoDB] Email: ${email}`);
        } else {
          existing.password = adminPassword;
          await existing.save();
        }
      } catch (err) {
        console.error('Error seeding admin in MongoDB:', err.message);
      }
    }
  } else {
    // In-memory seed (always update/set so new password takes effect immediately)
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    for (const email of emailsToSeed) {
      const user = {
        _id: 'admin_mem_' + email.replace(/[^a-z0-9]/gi, ''),
        name: 'Ritik Varun',
        email,
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memUsers.set(email, user);
      console.log(`👤 [Admin Ready in Memory Fallback] Email: ${email} (password: ${adminPassword})`);
    }
  }
};

/**
 * User Store Methods
 */
export const findUserByEmail = async (email) => {
  const normalized = email.toLowerCase().trim();
  if (isDBConnected()) {
    return User.findOne({ email: normalized });
  }
  return memUsers.get(normalized) || null;
};

export const findUserById = async (id) => {
  if (isDBConnected()) {
    return User.findById(id).select('-password');
  }
  for (const user of memUsers.values()) {
    if (user._id.toString() === id.toString()) {
      const { password, ...userWithoutPass } = user;
      return userWithoutPass;
    }
  }
  return null;
};

/**
 * QR Store Methods
 */
export const createQR = async (qrData) => {
  if (isDBConnected()) {
    const qr = await QR.create(qrData);
    return qr.toObject();
  }

  const id = 'qr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const now = new Date();
  const newQR = {
    _id: id,
    ...qrData,
    scanCount: 0,
    lastScannedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  memQRs.set(newQR.qrId, newQR);
  return newQR;
};

export const findQRByQrId = async (qrId) => {
  if (isDBConnected()) {
    return QR.findOne({ qrId });
  }
  return memQRs.get(qrId) || null;
};

export const findQRById = async (id) => {
  if (isDBConnected()) {
    return QR.findById(id);
  }
  for (const qr of memQRs.values()) {
    if (qr._id.toString() === id.toString()) {
      return qr;
    }
  }
  return null;
};

export const listQRs = async ({ search = '', status = '', folder = '' } = {}) => {
  if (isDBConnected()) {
    const query = {};
    if (status) query.status = status;
    if (folder) query.folder = folder;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { destinationUrl: { $regex: search, $options: 'i' } },
        { qrId: { $regex: search, $options: 'i' } },
        { folder: { $regex: search, $options: 'i' } },
      ];
    }
    const qrs = await QR.find(query).sort({ createdAt: -1 });
    return qrs;
  }

  let list = Array.from(memQRs.values());

  if (status) {
    list = list.filter((item) => item.status === status);
  }
  if (folder) {
    list = list.filter((item) => item.folder?.toLowerCase() === folder.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (item) =>
        item.title?.toLowerCase().includes(s) ||
        item.destinationUrl?.toLowerCase().includes(s) ||
        item.qrId?.toLowerCase().includes(s) ||
        item.folder?.toLowerCase().includes(s)
    );
  }

  // Sort descending by createdAt
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return list;
};

export const updateQR = async (id, updateFields) => {
  if (isDBConnected()) {
    // Changing destinationUrl must NEVER change qrId or shortUrl
    delete updateFields.qrId;
    delete updateFields.shortUrl;
    return QR.findByIdAndUpdate(id, { ...updateFields, updatedAt: new Date() }, { new: true });
  }

  for (const [key, qr] of memQRs.entries()) {
    if (qr._id.toString() === id.toString()) {
      delete updateFields.qrId;
      delete updateFields.shortUrl;
      const updated = {
        ...qr,
        ...updateFields,
        updatedAt: new Date(),
      };
      memQRs.set(key, updated);
      return updated;
    }
  }
  return null;
};

export const deleteQR = async (id) => {
  if (isDBConnected()) {
    return QR.findByIdAndDelete(id);
  }

  for (const [key, qr] of memQRs.entries()) {
    if (qr._id.toString() === id.toString()) {
      memQRs.delete(key);
      return qr;
    }
  }
  return null;
};

export const incrementScanCount = async (qrId) => {
  const now = new Date();
  if (isDBConnected()) {
    return QR.findOneAndUpdate(
      { qrId },
      {
        $inc: { scanCount: 1 },
        $set: { lastScannedAt: now },
      },
      { new: true }
    );
  }

  const qr = memQRs.get(qrId);
  if (qr) {
    qr.scanCount = (qr.scanCount || 0) + 1;
    qr.lastScannedAt = now;
    memQRs.set(qrId, qr);
    return qr;
  }
  return null;
};

export const getStats = async () => {
  if (isDBConnected()) {
    const totalQRs = await QR.countDocuments();
    const activeQRs = await QR.countDocuments({ status: 'active' });
    const disabledQRs = await QR.countDocuments({ status: 'disabled' });
    const scansResult = await QR.aggregate([
      { $group: { _id: null, totalScans: { $sum: '$scanCount' } } },
    ]);
    const totalScans = scansResult[0]?.totalScans || 0;

    return {
      totalQRs,
      activeQRs,
      disabledQRs,
      totalScans,
    };
  }

  const all = Array.from(memQRs.values());
  const totalQRs = all.length;
  const activeQRs = all.filter((q) => q.status === 'active').length;
  const disabledQRs = all.filter((q) => q.status === 'disabled').length;
  const totalScans = all.reduce((sum, q) => sum + (q.scanCount || 0), 0);

  return {
    totalQRs,
    activeQRs,
    disabledQRs,
    totalScans,
  };
};
