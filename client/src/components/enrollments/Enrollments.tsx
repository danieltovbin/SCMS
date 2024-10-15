import React, { FC, useContext, useEffect, useState } from 'react'
import { getEnrollments } from '../../api/enrollments';
// import { AuthProvider, useAuthContext } from '../../context/AuthContext';

interface Enrollment {
    id: number;
    userId: number;
    courseId: number;
    grade: number;
}

const Enrollments= () => {
    // const { isAuthenticated, loading} = useAuthContext()
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [error, setError] = useState<string | null>(null);
  
    
    const handleFetch = async () => {
        try {
            const data = await getEnrollments();
            setEnrollments(data.enrollments);
            console.log("data", data, data.enrollments)
        } catch (err) {
            console.error('Error fetching enrollments:', err);
            setError('Failed to fetch enrollments');
        }
    };

    useEffect(() => {
      handleFetch()
    }, []);



  return (
    <div>
      <h2>Enrollments</h2>
      <ul>
        {enrollments.map((enrollment) => (
          <li key={enrollment.id}>
            User ID: {enrollment.userId}, Course ID: {enrollment.courseId}, Grade: {enrollment.grade}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Enrollments