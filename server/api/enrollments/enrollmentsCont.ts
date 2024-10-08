import { Request, Response } from 'express';
import connection from '../../config/dbConn';

export const adminEnrollUser = async (req:Request, res: Response) => {
    const { userId, courseId, grade } = req.body;

    if (!userId || !courseId) {
        return res.status(400).json({ message: 'Missing required fields: userId or courseId' });
    }

    const gradeValue = grade !== undefined ? grade : 0;

    const sql = `
        INSERT INTO Enrollments (user_id, course_id, grade)
        VALUES (?, ?, ?)
    `;

    try {
        await new Promise<void>((resolve, reject) => {
            connection.query(sql, [userId, courseId,gradeValue], (err) => {
                if (err) {
                    console.error('Error enrolling user by admin:', err);
                    return reject(err);
                }
                resolve();
            });
        });

        res.status(201).json({ message: 'User enrolled successfully.' });
    } catch (err) {
        console.error('Error enrolling user by admin:', err);
        res.status(500).json({ message: 'Error enrolling user', error: err.message});
    }
};



export const enrollUser = async (req: Request, res: Response) => {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
        return res.status(400).json({ message: 'Missing required fields: userId or courseId.' });
    }

    const sql = 'INSERT INTO Enrollments (user_id, course_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE grade = NULL;';

    try {
        await new Promise<void>((resolve, reject) => {
            connection.query(sql, [userId, courseId], (err) => {
                if (err) {
                    console.error('Error enrolling user', err);
                    return reject(err);
                }
                resolve();
            });
        });

        res.status(201).json({ message: 'User enrolled successfully.' });
    } catch (err) {
        console.error('Error enrolling user:', err);
        res.status(500).json({ message: 'Error enrolling user', error: err.message });
    }
};



export const getEnrollments = async (req:Request, res: Response) => {
    const sql = 'SELECT * FROM Enrollments';

    try {
        const enrollments:Enrollment[] = await new Promise((resolve, reject) => {
            connection.query(sql, (err, result) => {
                if (err) {
                    console.error('Error fetching enrollments:', err);
                    return reject(err);
                }
                resolve(result as Enrollment[]);
            });
        });

        res.status(200).json({ ok: true, enrollments });
    } catch (err) {
        console.error('Error fetching enrollments:', err);
        res.status(500).json({ message: 'Error fetching enrollments', error: err.message });
    }
};



export const updateUserGrade = async (req:Request, res:Response) => {
    const { id } = req.params;
    const { grade } = req.body;

    if (grade === undefined) {
        return res.status(400).json({ message: 'Missing required fields: grade.' });
    }

    if (!id) {
        return res.status(400).json({ message: 'Missing user for updating grade.' });
    }

    const sql = `
       UPDATE Enrollments
       SET grade = ?
       WHERE id = ?;
    `;

    try {
        await new Promise<void>((resolve,reject) => {
            connection.query(sql, [grade, id], (err) => {
                if (err) {
                    console.error('Error updating user grade:', err)
                    return reject(err);
                }
                resolve();
            })
        });

        res.status(200).json({ message: 'Grade updated successfully.' });
    } catch (err) {
        console.error('Error updating grade', err)
        res.status(500).json({ message: 'Error updating grade', error: err.message });
    }
}



export const deleteEnrollment = async (req:Request, res: Response) => {
    const { userId, courseId } = req.params;

    if (!userId || !courseId ) {
        return res.status(400).json({ message: 'Missing user ID or course ID' });
    }

    const sql = 'DELETE FROM Enrollments WHERE user_id = ? AND course_id = ?';

    try {
        await new Promise<void>((resolve, reject) => {
            connection.query(sql, [userId, courseId], (err) => {
                if(err) {
                    console.error('Error deleting enrollment:', err)
                    return reject(err);
                }
                resolve();
            });
        });

        res.sendStatus(204);
    } catch (err) {
        console.error('Error deleting enrollment:', err);
        res.status(500).json({ message: 'Error deleting enrollment', error: err.message });
    };
}