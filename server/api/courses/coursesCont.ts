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



export const updateCourse = async (req:Request, res:Response) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if(!id) {
        return res.status(400).json({ message: 'Missing user ID for updating course' });
    }

    if (!title || !description) {
        return res.status(400).json({ message: 'Missing fields: title or description '});
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

    const sql = 'DELETE FROM Courses WHERE id = ?';

    try {
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