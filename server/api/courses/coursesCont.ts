import connection from "../../config/dbConn";
import { Request, Response } from 'express';
import { Course } from "./courseModel";

export const getCourses = async (req: Request, res:Response) => {
    try {
        const courses:Course[] = await new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Courses';
            connection.query(sql, (err, result) => {
                if (err) {
                    console.error('Error in getting courses', err);
                    return reject(err);
                }
                resolve(result as Course[]);
            });
        });

        res.status(200).json({ ok: true, courses });
    } catch (err) {
        console.error('Error in getting courses', err);
        res.status(500).json({ message: 'Error in fetching courses', error: err.message })
    }
};



export const createCourse = async (req:Request, res:Response) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    const courseTitleExists = await checkCourseTitleExists(title);
    if (courseTitleExists) {
        return res.status(409).json({ message: 'A course with the same title already exists.' });
    }

    const sql = 'INSERT INTO Courses (title, description) VALUES (?, ?)';

    try {
        const result:Course[] = await new Promise((resolve, reject) => {
            connection.query(sql, [title, description], (err, result) => {
                if (err) {
                    console.error('Error creating course:', err);
                    return reject(err);
                }
                resolve(result as Course[]);
            });
        });

        //@ts-ignore
        res.status(201).json({ message: 'Course created successfully.', courseId: result.insertId });
    } catch (err) {
        console.error('Error creating course:', err);
        res.status(500).json({ message: 'Error in creating course', error: err.message});
    }
;}



const checkCourseTitleExists = async (title: string, courseId?: number) => {
    let courseTitleCheckSql: string;
    let params: (string | number)[];

    if (courseId) {
        courseTitleCheckSql = `SELECT title FROM Courses WHERE title = ? AND id != ?`;
        params = [title, courseId];
    } else {
        courseTitleCheckSql = `SELECT title FROM Courses WHERE title = ?`;
        params = [title];
    }

    try {
        const result: Course[] = await new Promise((resolve, reject) => {
            connection.query(courseTitleCheckSql, params, (err, result) => {
                if (err) {
                    console.error('Error checking course title existence', err);
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
};



export const updateCourse = async (req:Request, res:Response) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if(!id) {
        return res.status(400).json({ message: 'Missing user ID for updating course' });
    }

    if (!title || !description) {
        return res.status(400).json({ message: 'Missing fields: title or description '});
    }

    const courseTitleExists = await checkCourseTitleExists(title, Number(id));
    if (courseTitleExists) {
        return res.status(409).json({ message: 'A course with the same title already exists.' });
    }

    const sql = `UPDATE Courses SET title = ?, description = ? WHERE id = ?`;

    try {
        const result:Course[] = await new Promise((resolve, reject) => {
            connection.query(sql, [title,description, id], (err, result) => {
                if (err) {
                    console.error('Error updating course', err);
                    return reject(err);
                }
                resolve(result as Course[]); 
            });
        });

        //@ts-ignore
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        //@ts-ignore
        res.status(200).json({ message: 'Course updated.' });
    } catch (err) {
        console.error('Error updating course', err);
        res.status(500).json({ message: 'Error in updating course',error: err.message});
    }
};



export const deleteCourse =  async (req:Request, res:Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Missing course ID for deleting course.' });
    }

    const checkCourseSql = `SELECT id FROM Courses WHERE id = ?`
    const sql = 'DELETE FROM Courses WHERE id = ?';

    try {
        const checkCourse:Course[] = await new Promise((resolve, reject) => {
            connection.query(checkCourseSql, [id], (err, result) =>{
                if (err) {
                    console.error('Error checking if course exists for deletion',err)
                    return reject(err);
                }
                resolve(result as Course[])
            });
        });

        if (checkCourse.length === 0){
            return res.status(404).json({ message: 'Course not found.' });
        }

        await new Promise<void>((resolve,reject) => {
            connection.query(sql, [id], (err)=> {
                if(err) {
                    console.error('Error deleting course',err);
                    return reject(err);
                }
                resolve();
            });
        });

        res.sendStatus(204);
    } catch (err) {
        console.error('Error deleting course',err);
        res.status(500).json({ message: 'Error in deleting course', error: err.message });
    }
};