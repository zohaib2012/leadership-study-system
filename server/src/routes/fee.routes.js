const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const feeController = require('../controllers/fee.controller');

router.use(protect);

router.get('/structures', authorize('ADMIN', 'SUB_ADMIN', 'ACCOUNTANT'), feeController.getFeeStructures);
router.post('/structures', authorize('ADMIN', 'SUB_ADMIN'), feeController.createFeeStructure);
router.put('/structures/:id', authorize('ADMIN', 'SUB_ADMIN'), feeController.updateFeeStructure);
router.delete('/structures/:id', authorize('ADMIN', 'SUB_ADMIN'), feeController.deleteFeeStructure);
router.post('/challans/generate', authorize('ADMIN', 'SUB_ADMIN', 'ACCOUNTANT'), feeController.generateChallans);
router.get('/challans', authorize('ADMIN', 'SUB_ADMIN', 'ACCOUNTANT'), feeController.getChallans);
router.get('/challans/pending', authorize('ADMIN', 'SUB_ADMIN', 'ACCOUNTANT'), feeController.getPendingChallans);
router.post('/payments', authorize('ADMIN', 'SUB_ADMIN', 'ACCOUNTANT'), feeController.recordPayment);
router.get('/payments', authorize('ADMIN', 'SUB_ADMIN', 'ACCOUNTANT'), feeController.getPayments);
router.get('/ledger/:studentId', authorize('ADMIN', 'SUB_ADMIN', 'ACCOUNTANT', 'STUDENT', 'PARENT'), feeController.getFeeLedger);
router.get('/dashboard', authorize('ADMIN', 'SUB_ADMIN', 'ACCOUNTANT'), feeController.getFeeDashboard);
router.get('/discounts', authorize('ADMIN', 'SUB_ADMIN'), feeController.getDiscounts);
router.post('/discounts', authorize('ADMIN', 'SUB_ADMIN'), feeController.createDiscount);
router.delete('/discounts/:id', authorize('ADMIN', 'SUB_ADMIN'), feeController.deleteDiscount);

module.exports = router;
