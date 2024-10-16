# The Student Course Management System (SCMS) 
is a web application designed to facilitate course enrollment and management for students and administrators.
Users can view available courses, enroll in them, and track their progress, while administrators have advanced capabilities for managing users and courses.

## Features
- **Homepage**: Displays cards for available courses and user enrollments. Only admins can see the user management card, which allows them to view details about all users on the platform.
- **courses Page**: Accessible to everyone, including users who are not authorized (not logged in), showing a comprehensive list of available courses.
- **enrollments Page**: Restricted to users and admins, allowing them to view their own enrollments and grades. Admins can view and update grades for all users.
- **users Page**: Exclusive to admins, who can manage user accounts (delete, update names, and passwords) if they know the current password.
- **profile Page**: Accessible to logged-in users and admins via the settings in the header. Users can update their names and passwords.
- **404 Page**: Shown when users attempt to access non-existent pages or unauthorized admin pages.

## Tools and Technologies
- **React**: JavaScript library for building user interfaces.
- **MySQL**: Relational database management system for storing user and course data.
- **TypeScript**: Programming language for the web.
- **Node.js**: JavaScript runtime for server-side development.
- **Express**: Web application framework for Node.js.
- **MUI**: A React component library that provides pre-built components for faster development
- **SCSS**: Syntactically Awesome Style Sheets for enhanced styling.
- **Context**: A React feature for managing state globally across components.

## How to Use

# Clone the repository
git clone https://github.com/danieltovbin/SCMS.git
# For the server
cd server
npm install
npm run dev

# For the client
cd client
npm install
npm run dev

## Enjoy exploring the SCMS website!
