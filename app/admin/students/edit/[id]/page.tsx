"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { getStudentById, updateStudent, getCoursesForDropdown } from "@/action/students.action"

export default function EditStudentPage() {
  const router = useRouter()
  const { id } = useParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [courses, setCourses] = useState<Array<{course_id: string, course_name: string}>>([])
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    category: '',
    domicile: '',
    parent_income: '',
    date_of_birth: '',
    place_of_birth: '',
    admission_date: '',
    mobile: '',
    email: '',
    present_address: '',
    permanent_address: '',
    course_id: ''
  })

  // Load student data and courses
  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentData, coursesData] = await Promise.all([
          getStudentById(id as string),
          getCoursesForDropdown()
        ])

        setCourses(coursesData)
        
        if (studentData) {
          setFormData({
            name: studentData.name,
            gender: studentData.gender || '',
            category: studentData.category || '',
            domicile: studentData.domicile || '',
            parent_income: studentData.parent_income || '',
            date_of_birth: studentData.date_of_birth ? new Date(studentData.date_of_birth).toISOString().split('T')[0] : '',
            place_of_birth: studentData.place_of_birth || '',
            admission_date: studentData.admission_date ? new Date(studentData.admission_date).toISOString().split('T')[0] : '',
            mobile: studentData.mobile || '',
            email: studentData.email || '',
            present_address: studentData.present_address || '',
            permanent_address: studentData.permanent_address || '',
            course_id: studentData.course_id
          })
        }
      } catch (error) {
        console.error('Error loading data:', error)
        toast({
          title: "Error",
          description: "Failed to load student data",
          variant: "destructive",
        })
        router.push('/admin/students')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateStudent(id as string, {
        ...formData,
        date_of_birth: formData.date_of_birth,
        admission_date: formData.admission_date,
        // Convert empty strings to null for optional fields
        gender: formData.gender || null,
        category: formData.category || null,
        domicile: formData.domicile || null,
        parent_income: formData.parent_income || null,
        place_of_birth: formData.place_of_birth || null,
        mobile: formData.mobile || null,
        email: formData.email || null,
        present_address: formData.present_address || null,
        permanent_address: formData.permanent_address || null,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Student updated successfully",
        })
        router.push(`/admin/students/${id}`)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error updating student:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update student",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
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
            <h1 className="text-xl font-bold">Edit Student</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Edit Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input
                        id="date_of_birth"
                        name="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => handleSelectChange('gender', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
                          <SelectItem value="O">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="place_of_birth">Place of Birth</Label>
                    <Input
                      id="place_of_birth"
                      name="place_of_birth"
                      value={formData.place_of_birth}
                      onChange={handleChange}
                      placeholder="Enter place of birth"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="present_address">Present Address</Label>
                    <Textarea
                      id="present_address"
                      name="present_address"
                      value={formData.present_address}
                      onChange={handleChange}
                      placeholder="Enter present address"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="permanent_address">Permanent Address</Label>
                    <Textarea
                      id="permanent_address"
                      name="permanent_address"
                      value={formData.permanent_address}
                      onChange={handleChange}
                      placeholder="Enter permanent address"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Academic Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="course_id">Course</Label>
                    <Select
                      value={formData.course_id}
                      onValueChange={(value) => handleSelectChange('course_id', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.course_id} value={course.course_id}>
                            {course.course_name} ({course.course_id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admission_date">Admission Date</Label>
                    <Input
                      id="admission_date"
                      name="admission_date"
                      type="date"
                      value={formData.admission_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GENERAL">General</SelectItem>
                          <SelectItem value="OBC">OBC</SelectItem>
                          <SelectItem value="SC">SC</SelectItem>
                          <SelectItem value="ST">ST</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="domicile">Domicile</Label>
                      <Input
                        id="domicile"
                        name="domicile"
                        value={formData.domicile}
                        onChange={handleChange}
                        placeholder="Enter domicile"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent_income">Parent Income</Label>
                    <Input
                      id="parent_income"
                      name="parent_income"
                      value={formData.parent_income}
                      onChange={handleChange}
                      placeholder="Enter parent income"
                      type="number"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/students')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Student
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
