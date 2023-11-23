import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin',
    email: 'admin@example.com',
    mobile: '0123456789',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    mobile: '1111111111',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
];

export default users;
