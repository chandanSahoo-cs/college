"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

// Types based on Prisma schema
type StudentCreateInput = {
  student_id: string
  name: string
  gender?: string | null
  category?: string | null
  domicile?: string | null
  parent_income?: string | null
  date_of_birth: Date | string
  place_of_birth?: string | null
  admission_date: Date | string
  mobile?: string | null
  email?: string | null
  present_address?: string | null
  permanent_address?: string | null
  course_id: string
}

type StudentUpdateInput = Partial<Omit<StudentCreateInput, 'student_id'>>

// Get all students with pagination
export async function getStudents(page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit
    const [students, total] = await Promise.all([
      prisma.students.findMany({
        skip,
        take: limit,
        include: {
          course: true,
          parents: true,
          qualifications: true
        },
        orderBy: {
          admission_date: 'desc'
        }
      }),
      prisma.students.count()
    ])

    return {
      data: students,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    }
  } catch (error) {
    console.error('Error fetching students:', error)
    throw new Error('Failed to fetch students')
  }
}

// Get a single student by ID
export async function getStudentById(id: string) {
  try {
    const student = await prisma.students.findUnique({
      where: { student_id: id },
      include: {
        course: true,
        parents: true,
        qualifications: true,
        reimbursement: true,
        undertaking: true
      }
    })

    if (!student) {
      throw new Error('Student not found')
    }

    return student
  } catch (error) {
    console.error(`Error fetching student ${id}:`, error)
    throw new Error('Failed to fetch student')
  }
}

// Create a new student
export async function createStudent(data: StudentCreateInput) {
  try {
    // Convert string dates to Date objects if needed
    const studentData = {
      ...data,
      date_of_birth: new Date(data.date_of_birth),
      admission_date: new Date(data.admission_date)
    }

    const student = await prisma.students.create({
      data: studentData
    })

    revalidatePath('/admin/students')
    return { success: true, data: student }
  } catch (error) {
    console.error('Error creating student:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create student' 
    }
  }
}

// Update an existing student
export async function updateStudent(id: string, data: StudentUpdateInput) {
  try {
    // Convert string dates to Date objects if they exist in the update
    const updateData = { ...data }
    
    if (updateData.date_of_birth) {
      updateData.date_of_birth = new Date(updateData.date_of_birth)
    }
    
    if (updateData.admission_date) {
      updateData.admission_date = new Date(updateData.admission_date)
    }

    const student = await prisma.students.update({
      where: { student_id: id },
      data: updateData
    })

    revalidatePath('/admin/students')
    revalidatePath(`/admin/students/${id}`)
    return { success: true, data: student }
  } catch (error) {
    console.error(`Error updating student ${id}:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update student' 
    }
  }
}

// Delete a student
export async function deleteStudent(id: string) {
  try {
    // First, delete related records to avoid foreign key constraints
    await prisma.$transaction([
      prisma.student_educational_qualifications.deleteMany({
        where: { student_id: id }
      }),
      prisma.student_parents.deleteMany({
        where: { student_id: id }
      }),
      prisma.fee_reimbursement.deleteMany({
        where: { student_id: id }
      }),
      prisma.undertakings.deleteMany({
        where: { student_id: id }
      }),
      prisma.students.delete({
        where: { student_id: id }
      })
    ])

    revalidatePath('/admin/students')
    return { success: true }
  } catch (error) {
    console.error(`Error deleting student ${id}:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete student' 
    }
  }
}

// Search students
export async function searchStudents(query: string, page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit
    const searchQuery = `%${query}%`

    // Using raw query for better search performance across multiple fields
    const [students, total] = await Promise.all([
      prisma.$queryRaw`
        SELECT s.*, c.course_name 
        FROM students s
        JOIN courses c ON s.course_id = c.course_id
        WHERE s.student_id ILIKE ${searchQuery}
           OR s.name ILIKE ${searchQuery}
           OR s.email ILIKE ${searchQuery}
           OR s.mobile ILIKE ${searchQuery}
           OR c.course_name ILIKE ${searchQuery}
        ORDER BY s.admission_date DESC
        LIMIT ${limit} OFFSET ${skip}
      ` as Promise<any[]>,
      prisma.$queryRaw`
        SELECT COUNT(*) as count
        FROM students s
        JOIN courses c ON s.course_id = c.course_id
        WHERE s.student_id ILIKE ${searchQuery}
           OR s.name ILIKE ${searchQuery}
           OR s.email ILIKE ${searchQuery}
           OR s.mobile ILIKE ${searchQuery}
           OR c.course_name ILIKE ${searchQuery}
      ` as Promise<{ count: bigint }[]>
    ])

    return {
      data: students,
      total: Number(total[0]?.count || 0),
      totalPages: Math.ceil(Number(total[0]?.count || 0) / limit),
      currentPage: page
    }
  } catch (error) {
    console.error('Error searching students:', error)
    throw new Error('Failed to search students')
  }
}

// Get all courses for dropdowns
export async function getCoursesForDropdown() {
  try {
    const courses = await prisma.courses.findMany({
      select: {
        course_id: true,
        course_name: true
      },
      orderBy: {
        course_name: 'asc'
      }
    })
    return courses
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw new Error('Failed to fetch courses')
  }
}
