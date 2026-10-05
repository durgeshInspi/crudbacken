const Employee = require('../models/Employee');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Create new employee
// @route   POST /api/employees
// @access  Public
const createEmployee = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      salary,
      dateOfJoining,
      status
    } = req.body;

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email: email.toLowerCase().trim() });
    if (existingEmployee) {
      return errorResponse(res, 400, 'An employee with this email already exists');
    }

    const employee = await Employee.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      department,
      position: position.trim(),
      salary: Number(salary),
      dateOfJoining: dateOfJoining || Date.now(),
      status: status || 'Active'
    });

    return successResponse(res, 201, 'Employee created successfully', employee);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all employees with pagination, search & filters
// @route   GET /api/employees
// @access  Public
const getEmployees = async (req, res, next) => {
  try {
    const {
      search,
      department,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // Search query across firstName, lastName, email, position
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { position: searchRegex }
      ];
    }

    // Filter by department
    if (department && department !== 'All') {
      query.department = department;
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Sorting
    const sort = {};
    const validSortFields = ['firstName', 'lastName', 'email', 'department', 'position', 'salary', 'dateOfJoining', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sort[sortField] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const [total, employees] = await Promise.all([
      Employee.countDocuments(query),
      Employee.find(query).sort(sort).skip(skip).limit(limitNum)
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return successResponse(res, 200, 'Employees retrieved successfully', employees, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Public
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return errorResponse(res, 404, 'Employee not found');
    }

    return successResponse(res, 200, 'Employee details retrieved successfully', employee);
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee by ID
// @route   PUT /api/employees/:id
// @access  Public
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return errorResponse(res, 404, 'Employee not found');
    }

    // If email is being changed, verify uniqueness
    if (email && email.toLowerCase().trim() !== employee.email) {
      const emailExists = await Employee.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: id }
      });
      if (emailExists) {
        return errorResponse(res, 400, 'An employee with this email already exists');
      }
    }

    // Update fields
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    return successResponse(res, 200, 'Employee updated successfully', updatedEmployee);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee by ID
// @route   DELETE /api/employees/:id
// @access  Public
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return errorResponse(res, 404, 'Employee not found');
    }

    return successResponse(res, 200, 'Employee deleted successfully', { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics & statistics
// @route   GET /api/employees/stats
// @access  Public
const getDashboardStats = async (req, res, next) => {
  try {
    const [total, active, inactive, onLeave, salaryStats, deptDistribution, recentEmployees] =
      await Promise.all([
        Employee.countDocuments(),
        Employee.countDocuments({ status: 'Active' }),
        Employee.countDocuments({ status: 'Inactive' }),
        Employee.countDocuments({ status: 'On Leave' }),
        Employee.aggregate([
          {
            $group: {
              _id: null,
              avgSalary: { $avg: '$salary' },
              totalSalary: { $sum: '$salary' },
              minSalary: { $min: '$salary' },
              maxSalary: { $max: '$salary' }
            }
          }
        ]),
        Employee.aggregate([
          {
            $group: {
              _id: '$department',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ]),
        Employee.find().sort({ createdAt: -1 }).limit(5)
      ]);

    const stats = {
      totalEmployees: total,
      activeEmployees: active,
      inactiveEmployees: inactive,
      onLeaveEmployees: onLeave,
      averageSalary: salaryStats.length > 0 ? Math.round(salaryStats[0].avgSalary) : 0,
      totalPayroll: salaryStats.length > 0 ? salaryStats[0].totalSalary : 0,
      minSalary: salaryStats.length > 0 ? salaryStats[0].minSalary : 0,
      maxSalary: salaryStats.length > 0 ? salaryStats[0].maxSalary : 0,
      departmentDistribution: deptDistribution.map((d) => ({
        department: d._id,
        count: d.count
      })),
      recentEmployees
    };

    return successResponse(res, 200, 'Dashboard statistics retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getDashboardStats
};
