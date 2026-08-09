require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const Tenant = require('./models/Tenant');
const User = require('./models/User');

const seed = async () => {
  try {
    await connectDB();
    await mongoose.connection.db.dropDatabase();
    console.log('Database cleared');

    const tenant = await Tenant.create({
      name: 'Leadership Study System',
      subdomain: 'demo',
      type: 'BOTH',
      status: 'ACTIVE',
      phone: '+92 305 9079079',
      email: 'meetceo@lsseducation.com',
      address: 'Street No.14, Sector F-8/3, Islamabad',
      city: 'Islamabad',
      socialLinks: {
        facebook: 'https://www.facebook.com/mibsconnect',
        instagram: 'https://www.instagram.com/mibs_edu/',
        youtube: 'https://www.youtube.com/@Mibsinstitute',
      },
    });
    console.log('Tenant created');

    const superAdmin = await User.create({
      tenant: tenant._id,
      name: 'Super Admin',
      email: 'admin@leadershipstudysystem.pk',
      password: 'admin123',
      role: 'SUPER_ADMIN',
      phone: '+92 300 1234567',
      status: 'ACTIVE',
    });
    console.log('Super Admin: admin@leadershipstudysystem.pk / admin123');

    const tenantAdmin = await User.create({
      tenant: tenant._id,
      name: 'Institute Admin',
      email: 'admin@demo.com',
      password: 'admin123',
      role: 'ADMIN',
      phone: '+92 305 9079079',
      status: 'ACTIVE',
    });
    console.log('Admin: admin@demo.com / admin123');

    const teacher = await User.create({
      tenant: tenant._id,
      name: 'Mr. Muzammil Ameer',
      email: 'teacher@demo.com',
      password: 'teacher123',
      role: 'TEACHER',
      phone: '+92 305 9079079',
      status: 'ACTIVE',
    });

    const Teacher = require('./models/Teacher');
    await Teacher.create({
      tenant: tenant._id,
      user: teacher._id,
      qualification: 'MBA, Cambridge Certified',
      experience: 10,
      specialization: 'Business Studies',
      contractType: 'PERMANENT',
      type: 'SCHOOL',
      status: 'ACTIVE',
    });
    console.log('Teacher: teacher@demo.com / teacher123');

    const student = await User.create({
      tenant: tenant._id,
      name: 'Ahmed Khan',
      email: 'student@demo.com',
      password: 'student123',
      role: 'STUDENT',
      phone: '+92 333 1234567',
      status: 'ACTIVE',
    });

    const Student = require('./models/Student');
    await Student.create({
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
      status: 'ACTIVE',
    });
    console.log('Student: student@demo.com / student123');

    console.log('\n--- Seed Complete ---');
    console.log('Credentials:');
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
