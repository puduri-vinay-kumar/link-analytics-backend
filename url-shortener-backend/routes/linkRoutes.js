const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const authMiddleware = require('../middlewares/authMiddleware');
const generateShortId = require('../utils/generateShortId');
const QRCode = require('qrcode');


// Create a short link
router.post('/', authMiddleware, async (req, res) => {
  const { originalUrl, customAlias, expirationDate } = req.body;
  const shortId = customAlias || generateShortId();

  try {
    const newLink = new Link({
      originalUrl,
      shortId,
      customAlias,
      userId: req.userId,
      expirationDate,
    });
    await newLink.save();
    res.status(201).json(newLink);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all links for the user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const links = await Link.find({ userId: req.userId });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Track link click
router.get('/:shortId', async (req, res) => {
  try {
    const link = await Link.findOne({ shortId: req.params.shortId });
    if (!link) return res.status(404).json({ message: 'Link not found' });

    link.clicks += 1;
    link.analytics.push({
      timestamp: new Date(),
      device: req.headers['user-agent'],
      ip: req.ip,
    });

    await link.save();
    res.redirect(link.originalUrl);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/qrcode/:shortId', authMiddleware, async (req, res) => {
    try {
      const { shortId } = req.params;
      const shortUrl = `https://yourdomain.com/${shortId}`;
      const qrImage = await QRCode.toDataURL(shortUrl);
      res.json({ qr: qrImage });
    } catch (err) {
      res.status(500).json({ error: 'QR generation failed' });
    }
  });

module.exports = router;
