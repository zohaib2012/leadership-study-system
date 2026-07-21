const express = require('express');
const router = express.Router();
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Tenant = require('../models/Tenant');
const { registerTenant } = require('../controllers/auth.controller');

router.get('/plans', async (req, res) => {
  const plans = await SubscriptionPlan.find({ isActive: true });
  res.json({ success: true, data: plans });
});

router.post('/tenants/register', registerTenant);

router.post('/tenants/check-subdomain', async (req, res) => {
  const { subdomain } = req.body;
  const exists = await Tenant.findOne({ subdomain: subdomain.toLowerCase() });
  res.json({ success: true, data: { available: !exists } });
});

router.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;
  res.json({ success: true, message: 'Message received. We will contact you soon.' });
});

router.get('/blog', async (req, res) => {
  const posts = [
    { id: 1, slug: 'why-choose-igcse', title: 'Why Choose IGCSE for Your Child?', excerpt: 'IGCSE offers a globally recognized curriculum...', date: '2025-01-15' },
    { id: 2, slug: 'alevel-preparation-tips', title: 'A-Level Preparation Tips for Success', excerpt: 'Preparing for A-Levels requires strategy...', date: '2025-02-20' },
    { id: 3, slug: 'online-vs-inperson', title: 'Online vs In-Person Learning: What Works Best?', excerpt: 'Both modes have their advantages...', date: '2025-03-10' },
  ];
  res.json({ success: true, data: posts });
});

router.get('/blog/:slug', async (req, res) => {
  const posts = {
    'why-choose-igcse': { id: 1, slug: 'why-choose-igcse', title: 'Why Choose IGCSE for Your Child?', content: 'Full article content here...', date: '2025-01-15', author: 'LSS Admin' },
    'alevel-preparation-tips': { id: 2, slug: 'alevel-preparation-tips', title: 'A-Level Preparation Tips for Success', content: 'Full article content here...', date: '2025-02-20', author: 'LSS Admin' },
    'online-vs-inperson': { id: 3, slug: 'online-vs-inperson', title: 'Online vs In-Person Learning', content: 'Full article content here...', date: '2025-03-10', author: 'LSS Admin' },
  };
  const post = posts[req.params.slug];
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
  res.json({ success: true, data: post });
});

module.exports = router;
