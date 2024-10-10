enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

export interface User {
    id: number;
    username: string;
    password: string;
    created_at: Date;
    roles: UserRole[]
}