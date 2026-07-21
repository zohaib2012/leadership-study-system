const generateChallanNo = () => {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `CH-${y}${m}-${random}`;
};

const generateReceiptNo = () => {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const random = Math.floor(10000 + Math.random() * 90000);
  return `RCP-${y}-${random}`;
};

const generateRegistrationNo = (type) => {
  const prefix = type === 'ACADEMY' ? 'LSS-AC' : 'LSS-SC';
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
};

const generateSlipNo = () => {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SLP-${y}${m}-${random}`;
};

const getMonthKey = (date = new Date()) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatCurrency = (amount) => {
  return `Rs. ${Number(amount).toLocaleString('en-PK')}`;
};

module.exports = {
  generateChallanNo,
  generateReceiptNo,
  generateRegistrationNo,
  generateSlipNo,
  getMonthKey,
  formatDate,
  formatCurrency,
};
