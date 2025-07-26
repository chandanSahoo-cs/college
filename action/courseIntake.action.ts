"use server";

import prisma from "@/lib/prisma";

interface AddCourseIntakeProps {
  course_id: string;
  acad_year: number;
  intake: number;
}

interface UpdateCourseIntakeProps {
  intake?: number;
}

// CREATE (Add New Course Intake)
export async function addCourseIntake(data: AddCourseIntakeProps) {
  try {
    const newIntake = await prisma.course_intake.create({
      data: {
        course_id: data.course_id,
        acad_year: data.acad_year,
        intake: data.intake,
      },
    });
    return newIntake;
  } catch (error) {
    console.error("Failed to add course intake:", error);
    throw error;
  }
}

// READ (Get Intake by Course ID and Academic Year)
export async function getCourseIntakeById(course_id: string, acad_year: number) {
  try {
    return await prisma.course_intake.findUnique({
      where: {
        course_id_acad_year: {
          course_id,
          acad_year,
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch course intake:", error);
    throw error;
  }
}

// READ (Get All Intakes)
export async function getAllCourseIntakes() {
  try {
    return await prisma.course_intake.findMany({
      include: {
        course: true, // Optional: include related course info
      },
    });
  } catch (error) {
    console.error("Failed to fetch all course intakes:", error);
    throw error;
  }
}

// UPDATE
export async function updateCourseIntake(
  course_id: string,
  acad_year: number,
  data: UpdateCourseIntakeProps
) {
  try {
    const updated = await prisma.course_intake.update({
      where: {
        course_id_acad_year: {
          course_id,
          acad_year,
        },
      },
      data,
    });
    return updated;
  } catch (error) {
    console.error("Failed to update course intake:", error);
    throw error;
  }
}

// DELETE
export async function deleteCourseIntakeById(course_id: string, acad_year: number) {
  try {
    return await prisma.course_intake.delete({
      where: {
        course_id_acad_year: {
          course_id,
          acad_year,
        },
      },
    });
  } catch (error) {
    console.error("Failed to delete course intake:", error);
    throw error;
  }
}
