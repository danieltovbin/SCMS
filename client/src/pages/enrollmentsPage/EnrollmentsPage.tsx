import Enrollments from "../../components/enrollments/Enrollments"
import Header from "../../components/header/Header"
import TitleHeader from "../../components/titleHeader/TitleHeader"

function EnrollmentsPage() {
  return (
    <div>
      <Header />
      <TitleHeader title="Enrollment"/>
      <Enrollments />
    </div>
  )
}

export default EnrollmentsPage