require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const Tenant = require('./models/Tenant');
const User = require('./models/User');
const SubscriptionPlan = require('./models/SubscriptionPlan');

const seed = async () => {
  try {
    await connectDB();
    await mongoose.connection.db.dropDatabase();
    console.log('Database cleared');

    const plans = await SubscriptionPlan.insertMany([
      { name: 'Basic', price: 5000, studentLimit: 50, features: ['students', 'attendance', 'fees', 'timetable', 'homework'], isActive: true },
      { name: 'Pro', price: 12000, studentLimit: 200, features: ['students', 'attendance', 'fees', 'timetable', 'homework', 'reports', 'communication', 'leave'], isActive: true },
      { name: 'Enterprise', price: 25000, studentLimit: 99999, features: ['students', 'attendance', 'fees', 'timetable', 'homework', 'reports', 'communication', 'leave', 'settings', 'roles', 'backup'], isActive: true },
    ]);
    console.log('Plans seeded:', plans.length);

    const tenant = await Tenant.create({
      name: 'Leadership Study System',
      subdomain: 'demo',
      type: 'BOTH',
      status: 'ACTIVE',
      phone: '+92 305 9079079',
      email: 'info@leadershipstudysystem.pk',
      address: 'Street No.14, Sector F-8/3, Islamabad',
      city: 'Islamabad',
      socialLinks: {
        facebook: 'https://www.facebook.com/mibsconnect',
        instagram: 'https://www.instagram.com/mibs_edu/',
        youtube: 'https://www.youtube.com/@Mibsinstitute',
      },
      plan: plans[1]._id,
    });
    console.log('Demo tenant created');

    const superAdmin = await User.create({
      tenant: tenant._id,
      name: 'Super Admin',
      email: 'admin@leadershipstudysystem.pk',
      password: 'admin123',
      role: 'SUPER_ADMIN',
      phone: '+92 300 1234567',
    });
    console.log('Super admin created: admin@leadershipstudysystem.pk / admin123');

    const tenantAdmin = await User.create({
      tenant: tenant._id,
      name: 'Institute Admin',
      email: 'admin@demo.com',
      password: 'admin123',
      role: 'ADMIN',
      phone: '+92 305 9079079',
    });
    console.log('Tenant admin created: admin@demo.com / admin123');

    const teacher = await User.create({
      tenant: tenant._id,
      name: 'Mr. Muzammil Ameer',
      email: 'teacher@demo.com',
      password: 'teacher123',
      role: 'TEACHER',
      phone: '+92 305 9079079',
    });

    const TeacherModel = require('./models/Teacher');
    await TeacherModel.create({
      tenant: tenant._id,
      user: teacher._id,
      qualification: 'MBA, Cambridge Certified',
      experience: 10,
      specialization: 'Business Studies',
      salary: 80000,
      contractType: 'PERMANENT',
      joinDate: new Date('2020-01-01'),
    });
    console.log('Demo teacher created: teacher@demo.com / teacher123');

    const student = await User.create({
      tenant: tenant._id,
      name: 'Ahmed Khan',
      email: 'student@demo.com',
      password: 'student123',
      role: 'STUDENT',
      phone: '+92 333 1234567',
    });

    const StudentModel = require('./models/Student');
    await StudentModel.create({
      tenant: tenant._id,
      user: student._id,
      registrationNo: 'LSS-AC-1001',
      firstName: 'Ahmed',
      lastName: 'Khan',
      dob: new Date('2008-05-15'),
      gender: 'MALE',
      fatherName: 'Rehman Khan',
      fatherPhone: '+92 333 1234567',
      address: 'F-8, Islamabad',
      city: 'Islamabad',
      type: 'ACADEMY',
      joiningDate: new Date(),
    });
    console.log('Demo student created: student@demo.com / student123');

    console.log('\n--- Seed Complete ---');
    console.log('Login URLs:');
    console.log('  Main site:   http://localhost:3000');
    console.log('  Demo tenant: http://demo.localhost:3000');
    console.log('\nCredentials:');
    console.log('  Super Admin: admin@leadershipstudysystem.pk / admin123');
    console.log('  Admin:       admin@demo.com / admin123');
    console.log('  Teacher:     teacher@demo.com / teacher123');
    console.log('  Student:     student@demo.com / student123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
