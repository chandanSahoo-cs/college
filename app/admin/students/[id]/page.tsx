import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import { getStudentById } from "@/action/students.action"
import { notFound } from "next/navigation"

interface StudentDetailPageProps {
  params: {
    id: string
  }
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const student = await getStudentById(params.id)
  
  if (!student) {
    notFound()
  }

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0c4da2] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/admin/students" className="mr-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Student Details</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/students/edit/${student.student_id}`}>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#0c4da2]">
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          {/* Student Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{student.name}</CardTitle>
              <p className="text-muted-foreground">Student ID: {student.student_id}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p>{formatDate(student.date_of_birth)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p>{student.gender === 'M' ? 'Male' : student.gender === 'F' ? 'Female' : 'Other'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Place of Birth</p>
                    <p>{student.place_of_birth || 'N/A'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p>{student.category || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Domicile</p>
                      <p>{student.domicile || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Parent Income</p>
                    <p>{student.parent_income ? `₹${student.parent_income}` : 'N/A'}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Contact Information</h3>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{student.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mobile</p>
                    <p>{student.mobile || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Present Address</p>
                    <p className="whitespace-pre-line">{student.present_address || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Permanent Address</p>
                    <p className="whitespace-pre-line">{student.permanent_address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium mb-4">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Course</p>
                    <p>{student.course.course_name} ({student.course_id})</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Admission Date</p>
                    <p>{formatDate(student.admission_date)}</p>
                  </div>
                </div>
              </div>

              {/* Parents/Guardians Information */}
              {student.parents && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium mb-4">Parents/Guardians Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Father's Details</h4>
                      <div className="space-y-2 pl-4">
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p>{student.parents.father_name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">Occupation</p>
                        <p>{student.parents.father_occupation || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">Mobile</p>
                        <p>{student.parents.father_mobile || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{student.parents.father_email || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Mother's Details</h4>
                      <div className="space-y-2 pl-4">
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p>{student.parents.mother_name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">Occupation</p>
                        <p>{student.parents.mother_occupation || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">Mobile</p>
                        <p>{student.parents.mother_mobile || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Educational Qualifications */}
              {student.qualifications && student.qualifications.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium mb-4">Educational Qualifications</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Board/University</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage/GPA</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {student.qualifications.map((qual, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{qual.exam_passed}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{qual.board_university}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{qual.year}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {qual.percentage ? `${qual.percentage}%` : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
