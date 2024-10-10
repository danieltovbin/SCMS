import connection from "../config/dbConn";

export const createEnrollmentsIfNotExists = () => {
    const createEnrollmentsTable = `
        CREATE TABLE IF NOT EXISTS Enrollments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        grade DECIMAL(5,2),
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES Courses(id) ON DELETE CASCADE,
        UNIQUE (user_id, course_id)
        );
    `;

    connection.query(createEnrollmentsTable, (err, result) => {
        if (err) throw err;
        console.log('Enrollments table created or already exists!')
        insertInitialEnrollments();
    });


    const insertInitialEnrollments = () => {
        const sql = `
        INSERT INTO Enrollments (user_id, course_id, grade)
        SELECT u.id AS user_id, c.id AS course_id, NULL AS grade
        FROM Users u
        INNER JOIN Courses AS c ON c.title = CASE
             WHEN u.username = 'Tali' THEN 'Programming'
             WHEN u.username = 'Dan' THEN 'Math'
             WHEN u.username = 'Miki' THEN 'Physics'
             WHEN u.username = 'Doli' THEN 'Sports'
             WHEN u.username = 'Bob' THEN 'Biology'
           END
        WHERE NOT EXISTS (
          SELECT 1 FROM Enrollments
          WHERE Enrollments.user_id = u.id
          AND Enrollments.course_id = c.id
        );
        `;
    
        connection.query(sql, (err, result) => {
            if (err) {
                console.error('Error inserting enrollments', err);
            } else {
                console.log('Initial enrollments inserted:', result);
            }
    
        })
    };
};


