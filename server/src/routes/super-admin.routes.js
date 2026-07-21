const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const superAdminController = require('../controllers/super-admin.controller');

router.use(protect);
router.use(authorize('SUPER_ADMIN'));

router.get('/dashboard', superAdminController.getDashboard);
router.get('/tenants', superAdminController.getTenants);
router.get('/tenants/:id', superAdminController.getTenant);
router.put('/tenants/:id', superAdminController.updateTenant);
router.patch('/tenants/:id/status', superAdminController.updateTenantStatus);
router.post('/tenants/:id/login-as', superAdminController.loginAsTenant);
router.get('/plans', superAdminController.getPlans);
router.post('/plans', superAdminController.createPlan);
router.put('/plans/:id', superAdminController.updatePlan);
router.delete('/plans/:id', superAdminController.deletePlan);
router.get('/subscriptions', superAdminController.getSubscriptions);
router.get('/reports/revenue', superAdminController.getRevenueReport);
router.get('/logs', superAdminController.getGlobalLogs);

module.exports = router;
