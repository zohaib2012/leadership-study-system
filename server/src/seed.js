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
    console.log('Super admin created: admin@leadershipstudysystem.pk / admin123');

    const tenantAdmin = await User.create({
      tenant: tenant._id,
      name: 'Institute Admin',
      email: 'admin@demo.com',
      password: 'admin123',
      role: 'ADMIN',
      phone: '+92 305 9079079',
      status: 'ACTIVE',
    });
    console.log('Tenant admin created: admin@demo.com / admin123');

    console.log('\n--- Production Seed Complete ---');
    console.log('  Super Admin: admin@leadershipstudysystem.pk / admin123');
    console.log('  Tenant Admin: admin@demo.com / admin123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
