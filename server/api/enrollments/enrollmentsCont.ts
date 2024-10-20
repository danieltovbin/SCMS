import { Request, Response } from 'express';
import connection from '../../config/dbConn';
import { Enrollment } from './enrollmentsModel';
import { Course } from '../courses/courseModel';

export const adminEnrollUser = async (req:Request, res:Response) => {
    const { user_name, course_name, grade } = req.body;

    if (!user_name || !course_name) {
        return res.status(400).json({ message: 'Missing required fields: user name or course name' });
    }

    const courseExists = await checkCourseExists(undefined, course_name);
    if (!courseExists) {
        return res.status(404).json({ message: 'Course does not exist.' });
    }

    const gradeValue = (grade !== undefined && grade !== '') ? grade : 0;
    const fetchIdsSql = `
        SELECT u.id AS user_id, c.id AS course_id
        FROM Users u
        JOIN Courses c ON c.title = ?
        WHERE u.username = ?;
    `;

    const sql = `
        INSERT INTO Enrollments (user_id, course_id, grade)
        VALUES (?, ?, ?)
    `;

    try {
        const { user_id, course_id } = await new Promise<{ user_id: number, course_id :number}>((resolve, reject) => {
            connection.query(fetchIdsSql,[course_name, user_name], (err, result) => {
                if (err || (result as Enrollment[]).length === 0) {
                    console.error('Error fetching IDs:', err);
                    return reject(new Error('User or course not found.'))
                }
                resolve(result[0]);
            })
        });

        await new Promise<void>((resolve, reject) => {
            connection.query(sql, [user_id, course_id,gradeValue], (err) => {
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
    const { courseId } = req.body;
    const userId = req.user?.userId;
    const role = req.user?.roles;

    if (!userId || !courseId) {
        return res.status(400).json({ message: 'Missing required fields: userId or courseId.' });
    }

    if (role !== 'admin' && userId !== req.user?.userId) {
        return res.status(403).json({ message: 'Users can only enoll themselves in courses.' });
    }

    const courseExists = await checkCourseExists(courseId, undefined);
    if (!courseExists) {
        return res.status(404).json({ message: 'Course does not exist.' });
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



const checkCourseExists = async (courseId?: number, course_name?: string) => {
    let courseCheckSql: string;
    let params: (number | string)[];

    if (courseId) {
        courseCheckSql = `SELECT * FROM Courses WHERE id = ?`
        params = [courseId]
    } else {
        courseCheckSql = `SELECT * FROM Courses WHERE title = ?`
        params = [course_name]
    }

    try {
        const result: Course[] = await new Promise((resolve, reject) => {
            connection.query(courseCheckSql, params, (err, result) => {
                if (err) {
                    console.error('Error checking course existence', err);
                    return reject(err);
                }
                resolve(result as Course[]);
            });
        });

        return result.length > 0;
    } catch (err) {
        console.error('Error checking course existence:', err);
        throw err;
    }
}



export const getEnrollments = async (req:Request, res: Response) => {
    const role = req.user?.roles;
    const userId = req.user?.userId;

    let sql = `
        SELECT e.id AS enrollmentId, e.grade, u.username, c.title AS courseName
        FROM Enrollments e
        JOIN Users u ON e.user_id = u.id
        JOIN Courses c ON e.course_id = c.id
    `;
    const params:Number[] = [];

    if (role === 'user') {
        sql += ' WHERE user_id = ?';
        params.push(userId)
    }

    try {
        const enrollments:Enrollment[] = await new Promise((resolve, reject) => {
            connection.query(sql,params, (err, result) => {
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
    if (!req.user) {
        return res.status(403).json({ message: "Forbidden" });
    }
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
    const { id } = req.params;

    if (!id ) {
        return res.status(400).json({ message: 'Missing enrollment ID' });
    }

    const checkEnrollmentSql = 'SELECT id FROM Enrollments WHERE id =?';
    const sql = 'DELETE FROM Enrollments WHERE id = ?';

    try {
        const checkEnrollment:Enrollment[] = await new Promise((resolve, reject) => {
            connection.query(checkEnrollmentSql, [id], (err, result) => {
                if (err) {
                    console.error('Error checking if enrollment exists for deletion',err)
                    return reject(err);
                }
                resolve(result as Enrollment[])
            })
        });

        if (checkEnrollment.length === 0) {
            return res.status(404).json({ message: 'Enrollment not found.' });
        }

        await new Promise<void>((resolve, reject) => {
            connection.query(sql, [id], (err) => {
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