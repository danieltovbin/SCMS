import connection from "../../config/dbConn";
import { Request, Response } from 'express';
import { User } from "./usersModel";
import bcrypt from 'bcrypt';

export const getUsers = async (req:Request, res:Response) => {
    try {
        const users = await new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Users';
            connection.query(sql, (err, result) => {
                if (err) {
                    console.error('Error in fetchig users:', err);
                    return reject(err);
                }
               resolve(result);
            });
        });

        res.status(200).json({ ok: true, users });
    } catch (err) {
        console.error('Error in getting users', err)
        res.status(500).json({ message: 'Error in fetching users', error: err.message});
    }
};



export const updateUser = async (req:Request, res:Response) => {
    const { id } = req.params;
    const { username, currentPassword, newPassword } = req.body;
    const role = req.user?.roles;
    const tokenUserId = req.user?.userId;

    if (!username || !currentPassword || !newPassword) {
        return res.status(422).json({ message: 'Missing required fields.' })
    }

    if (!id) {
        return res.status(422).json({ message: 'Missing required field: id.' });
    }

    if (role === 'user' && Number(id) !== tokenUserId) {
        return res.status(403).json({ message: 'Users can only update their own information.' });
    }

    
    try {
        const passwordSql = `SELECT password FROM Users WHERE id = ?`
        const users:User[] = await new Promise((resolve,reject) => {
            connection.query(passwordSql, [id], (err, result) => {
                if (err) {
                    console.error('Error fetching password');
                    return reject(err);
                }
                const userResult = result as User[];

                if (userResult.length === 0) {
                    return reject(new Error('User not found'))
                }
                resolve(userResult);
            });
        });

        const user = users[0];
        const passwordMatches = await bcrypt .compare(currentPassword, user.password);
        if (!passwordMatches) {
            return res.status(403).json({ message: 'Current password is incorrect.' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        if (newPassword === currentPassword) {
            return res.status(400).json({ message: 'New password cannot be the same as the current password. No changes made.' })
        }

        const sql = 'UPDATE Users SET username = ?, password = ? WHERE id = ?';
        await new Promise<void>((resolve, reject) => {
            connection.query(sql, [username, hashedNewPassword, id], (err) => {
                if (err) {
                    console.error('Error updating user:', err)
                    return reject(err);
                }
                resolve();
            })
        });

        res.status(200).json({ message: 'User updated successfully. '});
    } catch (err) {
        console.error('Error updating user', err)
        res.status(500).json({ message: 'Error updating user', error: err.message});
    }
};



export const deleteUser = async (req:Request, res:Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(422).json({ message: 'Missing user ID.' });
    }

    const checkUserSql  = `SELECT id FROM Users WHERE id = ?`;
    const deleteUserSql  = 'DELETE FROM Users WHERE id = ?';

    try {
        const userExists: User[] = await new Promise((resolve,reject)=>{
            connection.query(checkUserSql , [id], (err, result) => {
                if (err) {
                    console.error('Error checking if user exists for deletion', err)
                    return reject(err)            
                }
                
                resolve(result as User[]);
            });
        });

        if (userExists.length === 0) {
            return res.status(404).json({ message: 'User not found.' })
        }

        await new Promise<void>((resolve, reject) => {
            connection.query(deleteUserSql , [id], (err) => {
                if (err) {
                    console.error('Error in deleting a user', err)
                    return reject(err);
                }
                resolve();
            });
        });

        res.sendStatus(204);
    } catch (err) {
        console.error('Error deleting user', err)
        res.status(500).json({ message: 'Error deleting user', error: err.message});
    }
};