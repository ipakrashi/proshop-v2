import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('1234', 10),
        isAdmin: true,
    },
    {
        name: 'Indranil',
        email: 'indranil@gmail.com',
        password: bcrypt.hashSync('1234', 10),
        isAdmin: false,
    },
    {
        name: 'Sujata',
        email: 'sujata@gmail.com',
        password: bcrypt.hashSync('1234', 10),
        isAdmin: false,
    },
]
export default users
