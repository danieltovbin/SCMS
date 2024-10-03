import connection from "../config/dbConn";


export const createUsersIfNotExists = () => {
    const query = `
    CREATE TABLE IF NOT EXISTS Users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(10) NOT NULL, 
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
    `;

    connection.query(query, (err, result) => {
        if (err) {
            console.error("Error creating user's table", err)
        } else {
            console.log('Users table created or already exists!')
            insertInitialUsers()
        }
    });

    const insertInitialUsers = () => {
        const query = `
        INSERT INTO Users (username, password)
        SELECT username, password
        FROM (
            SELECT 'Tali' AS username, 'Tali1234' AS password
            UNION ALL
            SELECT 'Dan', 'Dan1234'
            UNION ALL
            SELECT 'Miki', 'Miki1234'
            UNION ALL
            SELECT 'Doli', 'Doli1234'
            UNION ALL
            SELECT 'Bob', 'Bob1234'
        ) AS new_users
        WHERE NOT EXISTS (SELECT 1 FROM Users WHERE username = new_users.username);
        `;
        

        connection.query(query, (err, result) => {
            if (err) {
                console.error('Error inserting users')
            } else {
                console.log('Initial users inserted:', result)
            }
        })
    }
}