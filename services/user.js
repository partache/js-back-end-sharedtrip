const User = require('../models/User');
const { hash, compare } = require('bcrypt');

//we can register users, find Users, log Users functionalities

//TODO add all fields required by the exam
async function register(email, password, gender) {
    const existing = await getUserByEmail(email);

    if (existing) {
        throw new Error('Email is taken');
    }

    const hashedPassword = await hash(password, 10);

    const user = new User({
        email,
        hashedPassword,
        gender
    });

    await user.save();

    return user;
}
//controller will use the user in the session after reg

async function login(email, password) {
    const user = await getUserByEmail(email);
    
    if (!user) {
        throw new Error('Incorrect email or password');
    }

    const hasMatch = await compare(password, user.hashedPassword);
  
    if (!hasMatch) {
        throw new Error('Incorrect email or password');
    }

    return user;
}

//TODO identify user by given identifier email or username used to login
async function getUserByEmail(email) {
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    return user;
}

//controller will verify if the passwords match, here come only the data that should be kept in db

module.exports = {
    register, 
    login
}