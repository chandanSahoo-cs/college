"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type Course = {
  course_id: string;
  course_name: string;
  course_short_name: string;
  prog_id: string;
  semester_annual: number;
  min_duration_in_years: number;
  max_duration_in_years: number;
  total_semester_annual: number;
  programme?: {
    prog_name: string;
  };
};

// Get all courses with optional filtering
export async function getAllCourses({
  search,
  filterBy,
  page = 1,
  limit = 10,
}: {
  search?: string;
  filterBy?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ courses: Course[]; total: number }> {
  try {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      if (filterBy) {
        switch (filterBy) {
          case 'course_id':
            where.course_id = { contains: search, mode: 'insensitive' };
            break;
          case 'course_name':
            where.course_name = { contains: search, mode: 'insensitive' };
            break;
          case 'course_short_name':
            where.course_short_name = { contains: search, mode: 'insensitive' };
            break;
          case 'prog_id':
            where.prog_id = { contains: search, mode: 'insensitive' };
            break;
          case 'semester_annual':
            where.semester_annual = parseInt(search) || 0;
            break;
          case 'min_duration_in_years':
            where.min_duration_in_years = parseInt(search) || 0;
            break;
          case 'max_duration_in_years':
            where.max_duration_in_years = parseInt(search) || 0;
            break;
        }
      } else {
        where.OR = [
          { course_id: { contains: search, mode: 'insensitive' } },
          { course_name: { contains: search, mode: 'insensitive' } },
          { course_short_name: { contains: search, mode: 'insensitive' } },
          { prog_id: { contains: search, mode: 'insensitive' } },
        ];
      }
    }

    const [courses, total] = await Promise.all([
      prisma.courses.findMany({
        where,
        include: {
          programme: {
            select: {
              prog_name: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          course_id: 'asc',
        },
      }),
      prisma.courses.count({ where }),
    ]);

    return { courses, total };
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw new Error('Failed to fetch courses');
  }
}

// Get a single course by ID
export async function getCourseById(id: string): Promise<Course | null> {
  try {
    const course = await prisma.courses.findUnique({
      where: { course_id: id },
      include: {
        programme: {
          select: {
            prog_name: true,
          },
        },
      },
    });
    return course;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw new Error('Failed to fetch course');
  }
}

// Create a new course
export async function createCourse(data: Course): Promise<Course> {
  try {
    const course = await prisma.courses.create({
      data: {
        course_id: data.course_id,  // Now we can access course_id
        course_name: data.course_name,
        course_short_name: data.course_short_name,
        prog_id: data.prog_id,
        semester_annual: data.semester_annual,
        min_duration_in_years: data.min_duration_in_years,
        max_duration_in_years: data.max_duration_in_years,
        total_semester_annual: data.total_semester_annual,
      },
    });
    
    revalidatePath('/admin/courses');
    return course;
  } catch (error) {
    console.error('Error creating course:', error);
    throw new Error('Failed to create course');
  }
}

// Update an existing course
export async function updateCourse(
  id: string,
  data: Partial<Omit<Course, 'course_id'>>
): Promise<Course> {
  try {
    const course = await prisma.courses.update({
      where: { course_id: id },
      data: {
        course_name: data.course_name,
        course_short_name: data.course_short_name,
        prog_id: data.prog_id,
        semester_annual: data.semester_annual,
        min_duration_in_years: data.min_duration_in_years,
        max_duration_in_years: data.max_duration_in_years,
        total_semester_annual: data.total_semester_annual,
      },
    });
    
    revalidatePath('/admin/courses');
    revalidatePath(`/admin/courses/${id}/edit`);
    return course;
  } catch (error) {
    console.error('Error updating course:', error);
    throw new Error('Failed to update course');
  }
}

// Delete a course
export async function deleteCourseById(id: string): Promise<void> {
  try {
    await prisma.courses.delete({
      where: { course_id: id },
    });
    
    revalidatePath('/admin/courses');
  } catch (error) {
    console.error('Error deleting course:', error);
    throw new Error('Failed to delete course');
  }
}

// Get all programmes for dropdowns
export async function getAllProgrammes() {
  try {
    const programmes = await prisma.programmes.findMany({
      select: {
        prog_id: true,
        prog_name: true,
      },
      orderBy: {
        prog_name: 'asc',
      },
    });
    return programmes;
  } catch (error) {
    console.error('Error fetching programmes:', error);
    throw new Error('Failed to fetch programmes');
  }
}
