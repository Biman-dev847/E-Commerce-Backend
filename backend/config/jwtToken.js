import jwt from 'jsonwebtoken';

/**
 Generate a token for users which will be use to verify a user identity  
 and allows him to access different services of the app 
*/
export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
};