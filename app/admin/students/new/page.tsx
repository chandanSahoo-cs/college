"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { createStudent, getCoursesForDropdown } from "@/action/students.action"

interface Course {
  course_id: string
  course_name: string
}

interface FormData {
  student_id: string
  name: string
  email: string
  mobile: string
  gender: string
  category: string
  domicile: string
  parent_income: string
  date_of_birth: string
  place_of_birth: string
  admission_date: string
  present_address: string
  permanent_address: string
  course_id: string
}

export default function NewStudentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  
  // Fetch courses on component mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await getCoursesForDropdown()
        setCourses(coursesData)
      } catch (error) {
        console.error('Error loading courses:', error)
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingCourses(false)
      }
    }
    
    loadCourses()
  }, [toast])

  const [formData, setFormData] = useState<FormData>({
    student_id: '',
    name: '',
    email: '',
    mobile: '',
    gender: '',
    category: '',
    domicile: '',
    parent_income: '',
    date_of_birth: '',
    place_of_birth: '',
    admission_date: new Date().toISOString().split('T')[0],
    present_address: '',
    permanent_address: '',
    course_id: ''
  })

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.course_id) {
      toast({
        title: "Error",
        description: "Please select a course",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const result = await createStudent(formData)
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Student ${formData.name} created successfully!`,
        })
        router.push('/admin/students')
      } else {
        throw new Error(result.error || 'Failed to create student')
      }
    } catch (error) {
      console.error('Error creating student:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create student',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
            <h1 className="text-xl font-bold">Add New Student</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student ID */}
                <div className="space-y-2">
                  <Label htmlFor="student_id">Student ID*</Label>
                  <Input
                    id="student_id"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name*</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email*</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number*</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label>Gender*</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange('gender', value)}
                    disabled={isLoading}
                    required
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

                {/* Course */}
                <div className="space-y-2">
                  <Label>Course*</Label>
                  <Select
                    value={formData.course_id}
                    onValueChange={(value) => handleSelectChange('course_id', value)}
                    disabled={isLoading || isLoadingCourses}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingCourses ? "Loading courses..." : "Select course"} />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.course_id} value={course.course_id}>
                          {course.course_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth*</Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Admission Date */}
                <div className="space-y-2">
                  <Label htmlFor="admission_date">Admission Date*</Label>
                  <Input
                    id="admission_date"
                    name="admission_date"
                    type="date"
                    value={formData.admission_date}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="present_address">Present Address</Label>
                    <Textarea
                      id="present_address"
                      name="present_address"
                      value={formData.present_address}
                      onChange={handleChange}
                      disabled={isLoading}
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
                      disabled={isLoading}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/students')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading || isLoadingCourses}>
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Student
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
