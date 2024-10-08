import connection from "../../config/dbConn";
import { Request, Response } from 'express';

export const getUsers = async (req:Request, res: Response) => {
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
    const { username, password } = req.body;

    if (!id || !username || !password) {
        return res.status(422).json({ message: 'Missing required fields.'})
    }

    if (!id) {
        return res.status(422).json({ message: 'Missing required field: id.' });
    }

    const sql = 'UPDATE Users SET username = ?, password = ? WHERE id = ?';

    try {
        await new Promise<void>((resolve, reject) => {
            connection.query(sql, [username, password, id], (err) => {
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

    const sql = 'DELETE FROM Users WHERE id = ?';

    try {
        await new Promise<void>((resolve, reject) => {
            connection.query(sql, [id], (err) => {
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