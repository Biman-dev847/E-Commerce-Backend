import jwt from 'jsonwebtoken';

/**
 A refresh token is authentication token used to renew 
 an expired token for a user in this way avoiding a login every time
 */
export const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' });
};