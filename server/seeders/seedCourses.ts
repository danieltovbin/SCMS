import connection from "../config/dbConn"

export const createCoursesIfNotExists = () => {
    const createCoursesTable = `
        CREATE TABLE IF NOT EXISTS Courses(
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(10) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
        `;
    
    connection.query(createCoursesTable, (err, result) => {
        if (err) throw err;
        console.log('Courses table created or already exists!')
        insertInitialCourses()
    });
    

    const insertInitialCourses = () => {
        const sql = `
        INSERT INTO Courses (title, description)
        SELECT title, description
        FROM (
            SELECT 'Programming' AS title, 'Learn the basics of programming using JavaScript.' AS description
            UNION ALL
            SELECT 'Math', 'Introduction to basic math concepts.'
            UNION ALL
            SELECT 'Physics', 'Study of matter, motion, and energy.'
            UNION ALL
            SELECT 'Sports', 'Overview of various physical sports activities.'
            UNION ALL
            SELECT 'Biology', 'Study of living organisms, their structure, function, growth, and evolution.'
        ) AS new_courses
        WHERE NOT EXISTS (SELECT 1 FROM Courses WHERE title = new_courses.title);
        `
    
        connection.query(sql, (err, result) => {
            if (err) {
                console.error('Error inserting courses', err);
            } else {
                console.log('Initial courses inserted:', result)
            }
    
        })
    }
}



