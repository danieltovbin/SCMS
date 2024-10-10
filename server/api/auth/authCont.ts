import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import connection from '../../config/dbConn';
import { User } from '../users/usersModel';
import jwt from 'jsonwebtoken';

export const register = async (req:Request, res:Response) => {
    const { username,password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Missing required fields: username or password' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match '});
    }
    
    const checkUserExistsSql  = `SELECT * FROM Users WHERE username = ?`;
    const insertUserSql = `INSERT INTO Users (username, password, roles) VALUES (?, ?, ?)`;
    const role = 'user';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const existingUser:User[] = await new Promise((resolve, reject) => {
            connection.query(checkUserExistsSql , [username], (err, result) => {
                if (err) {
                    console.error('Error during checking existing user')
                    return reject()
                }
                resolve(result as User[]);
            });
        }) 
          
        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'Username already exists'});
        }

        const result = await new Promise((resolve,reject) => {
            connection.query(insertUserSql, [username, hashedPassword, role], (err, result) => {
                if (err) {
                    console.error('Error during user registration');
                    return reject(err);
                }
                resolve(result);
            });
        });

        //@ts-ignore
        const userId = result.insertId;
        return res.status(201).json({ message: 'User created successfully!', userId});
    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ error: err.message });
    }
};



export const login = async (req:Request, res:Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username or password fields cannot be empty!'});
    }

    const checkUserExistsSql = `SELECT * FROM Users WHERE username = ?`;

    try {
        const existingUser: User[] = await new Promise((resolve, reject) => {
            connection.query(checkUserExistsSql, [username], (err, result) => {
                if (err) {
                    console.error('Error during user lookup');
                    return reject(err);
                }
                resolve(result as User[]);
            });
        });
        
        if (existingUser.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials'})
        }

        const passwordMatch = await bcrypt.compare(password, existingUser[0].password);
    
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Password does not match'})
        }

        const accessToken = generateAccessToken(existingUser[0].id, existingUser[0].roles);
        const refreshToken = generateRefreshToken(existingUser[0].id);

        const updateRefreshTokenSql = `UPDATE Users SET refreshToken = ? WHERE id = ?`;
        await new Promise((resolve,reject) => {
            connection.query(updateRefreshTokenSql, [refreshToken, existingUser[0].id], (err) => {
                if (err) {
                    console.error('Error storing refresh token');
                    return reject(err);
                }
                resolve(true);
            });
        });

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000});
        return res.status(200).json({
            message: 'Login successful',
            userId: existingUser[0].id,
            username: existingUser[0].username,
            access_token: accessToken,
        });
        
    } catch (err) {
        console.error('Error during login', err)
        return res.status(500).json({ error: err.message });
    }
}



const generateAccessToken = (userId: number, roles: string[]) => {
    return jwt.sign({ userId, roles }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN });
};



const generateRefreshToken = (userId: number) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN})
}



export const logout = async (req:Request, res:Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    try {
        const deleteTokenSql = `UPDATE Users SET refreshToken = NULL WHERE refreshToken = ?`;
        await new Promise((resolve, reject) => {
            connection.query(deleteTokenSql, [refreshToken], (err) => {
                if (err) {
                    console.error('Error clearing refresh token');
                    return reject(err);
                }
                resolve(true);
            });
        });

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: 'true'});
        return res.sendStatus(204);
    } catch (err) {
        console.error('Error during logout:', err);
        return res.status(500).json({ error: err.message });
    }
};