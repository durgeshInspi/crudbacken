const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const connectDB = require('../config/db');

const sampleEmployees = [
  {
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.connor@cyberdyne.io',
    phone: '+1 (555) 234-5678',
    department: 'Engineering',
    position: 'Principal DevOps Architect',
    salary: 145000,
    status: 'Active',
    dateOfJoining: new Date('2022-03-15')
  },
  {
    firstName: 'David',
    lastName: 'Chen',
    email: 'david.chen@enterprise.org',
    phone: '+1 (555) 876-5432',
    department: 'Engineering',
    position: 'Full Stack Staff Engineer',
    salary: 132000,
    status: 'Active',
    dateOfJoining: new Date('2022-07-01')
  },
  {
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena.rostova@designworks.com',
    phone: '+1 (555) 345-6789',
    department: 'Design',
    position: 'Lead UX/UI Designer',
    salary: 115000,
    status: 'Active',
    dateOfJoining: new Date('2023-01-10')
  },
  {
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.vance@talenthub.net',
    phone: '+1 (555) 456-7890',
    department: 'Human Resources',
    position: 'HR Director',
    salary: 108000,
    status: 'Active',
    dateOfJoining: new Date('2021-11-20')
  },
  {
    firstName: 'Jessica',
    lastName: 'Alvarez',
    email: 'jessica.alvarez@growthlead.com',
    phone: '+1 (555) 567-8901',
    department: 'Marketing',
    position: 'VP of Global Marketing',
    salary: 138000,
    status: 'Active',
    dateOfJoining: new Date('2022-09-05')
  },
  {
    firstName: 'Liam',
    lastName: 'Patel',
    email: 'liam.patel@finanalytics.co',
    phone: '+1 (555) 678-9012',
    department: 'Finance',
    position: 'Senior Financial Analyst',
    salary: 102000,
    status: 'On Leave',
    dateOfJoining: new Date('2023-04-18')
  },
  {
    firstName: 'Olivia',
    lastName: 'Taylor',
    email: 'olivia.taylor@salesforcepro.com',
    phone: '+1 (555) 789-0123',
    department: 'Sales',
    position: 'Enterprise Account Executive',
    salary: 120000,
    status: 'Active',
    dateOfJoining: new Date('2023-08-22')
  },
  {
    firstName: 'Nathan',
    lastName: 'Brooks',
    email: 'nathan.brooks@operationshub.org',
    phone: '+1 (555) 890-1234',
    department: 'Operations',
    position: 'Operations Manager',
    salary: 95000,
    status: 'Inactive',
    dateOfJoining: new Date('2021-06-30')
  }
];

const seedData = async () => {
  try {
    await connectDB();
    await Employee.deleteMany();
    await Employee.insertMany(sampleEmployees);
    console.log('Sample employees seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
