import connection from "../config/dbConn";
import bcrypt from 'bcrypt';

export const createUsersIfNotExists = () => {
    const createUsersTable = `
    CREATE TABLE IF NOT EXISTS Users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(10) NOT NULL UNIQUE, 
    password VARCHAR(255) NOT NULL,
    roles ENUM('admin', 'user') NOT NULL,
    refreshToken VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
    `;
   
    connection.query(createUsersTable, (err, result) => {
        if (err) {
            console.error("Error creating user's table", err)
        } else {
            console.log('Users table created or already exists!')
            insertInitialUsers()
        }
    });
    }

    const insertInitialUsers = async () => {
        const users = [
            { username: 'Tali', password: 'Tali1234' },
            { username: 'Dan', password: 'Dan1234' },
            { username: 'Miki', password: 'Miki1234' },
            { username: 'Doli', password: 'Doli1234' },
            { username: 'Bob', password: 'Bob1234' },
        ];

        for(const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);

            const sql = `
              INSERT INTO Users (username,password, roles)
              SELECT ?, ?, 'user'
              WHERE NOT EXISTS (SELECT 1 FROM Users WHERE username = ?);
            `;

            connection.query(sql, [user.username, hashedPassword, user.username], (err, result) => {
                if (err) {
                    console.error(`Error inserting user ${user.username}`, err)
                } else {
                    console.log(`User ${user.username} inserted successfully.`)
                }
            })
        }
};