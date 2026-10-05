const VALID_DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Sales',
  'Finance',
  'Design',
  'Operations'
];

const VALID_STATUSES = ['Active', 'Inactive', 'On Leave'];

const validateEmployee = (req, res, next) => {
  const { firstName, lastName, email, phone, department, position, salary, status } = req.body;
  const errors = [];

  // If method is POST or if fields are provided in PUT
  const isPost = req.method === 'POST';

  if (isPost || firstName !== undefined) {
    if (!firstName || !firstName.trim()) {
      errors.push('First name is required');
    }
  }

  if (isPost || lastName !== undefined) {
    if (!lastName || !lastName.trim()) {
      errors.push('Last name is required');
    }
  }

  if (isPost || email !== undefined) {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || !email.trim()) {
      errors.push('Email is required');
    } else if (!emailRegex.test(email.trim())) {
      errors.push('Invalid email address format');
    }
  }

  if (isPost || phone !== undefined) {
    if (!phone || !phone.trim()) {
      errors.push('Phone number is required');
    }
  }

  if (isPost || department !== undefined) {
    if (!department || !VALID_DEPARTMENTS.includes(department)) {
      errors.push(`Department must be one of: ${VALID_DEPARTMENTS.join(', ')}`);
    }
  }

  if (isPost || position !== undefined) {
    if (!position || !position.trim()) {
      errors.push('Position is required');
    }
  }

  if (isPost || salary !== undefined) {
    if (salary === undefined || salary === null || isNaN(Number(salary)) || Number(salary) < 0) {
      errors.push('Salary must be a positive number');
    }
  }

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.join(', '),
      errors
    });
  }

  next();
};

module.exports = {
  validateEmployee,
  VALID_DEPARTMENTS,
  VALID_STATUSES
};
