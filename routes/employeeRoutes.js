const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getDashboardStats
} = require('../controllers/employeeController');
const { validateEmployee } = require('../middleware/validationMiddleware');

// Dashboard statistics
router.get('/stats', getDashboardStats);

// Main CRUD routes
router
  .route('/')
  .get(getEmployees)
  .post(validateEmployee, createEmployee);

router
  .route('/:id')
  .get(getEmployeeById)
  .put(validateEmployee, updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
