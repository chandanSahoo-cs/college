"use server";

import prisma from "@/lib/prisma";

interface AddSubjectProps {
  paper_id: string;
  scheme_id: string;
  paper_code: string;
  paper_name: string;
  credits: number;
  type: number;
  exam: number;
  mode: number;
  paper_group?: string;
  paper_sub_group?: string;
  kind: number;
  minor_max_marks: number;
  major_max_marks: number;
  total_max_marks: number;
  pass_marks: number;
}

interface UpdateSubjectByIdProps {
  paper_code?: string;
  paper_name?: string;
  credits?: number;
  type?: number;
  exam?: number;
  mode?: number;
  paper_group?: string;
  paper_sub_group?: string;
  kind?: number;
  minor_max_marks?: number;
  major_max_marks?: number;
  total_max_marks?: number;
  pass_marks?: number;
}

export async function addSubject(data: AddSubjectProps) {
  try {
    const subject = await prisma.subject_master.create({ data });
    if (!subject) {
      throw new Error("Failed to create subject");
    }
    return subject;
  } catch (error) {
    console.error("Error adding subject:", error);
  }
}

export async function deleteSubjectById(paper_id: string, scheme_id: string) {
  try {
    return await prisma.subject_master.delete({
      where: {
        paper_id_scheme_id: {
          paper_id,
          scheme_id,
        },
      },
    });
  } catch (error) {
    console.error("Failed to delete subject:", error);
  }
}

export async function getSubjectById(paper_id: string, scheme_id: string) {
  try {
    return await prisma.subject_master.findUnique({
      where: {
        paper_id_scheme_id: {
          paper_id,
          scheme_id,
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch subject:", error);
    return null;
  }
}

export async function getAllSubjects() {
  try {
    const subjects = await prisma.subject_master.findMany();
    if (!subjects) {
      throw new Error("Failed to fetch subjects");
    }
    return subjects;
  } catch (error) {
    console.error("Error getting subjects:", error);
  }
}

export async function updateSubjectById(
  paper_id: string,
  scheme_id: string,
  data: UpdateSubjectByIdProps
) {
  try {
    const updatedSubject = await prisma.subject_master.update({
      where: {
        paper_id_scheme_id: {
          paper_id,
          scheme_id,
        },
      },
      data,
    });
    return updatedSubject;
  } catch (error) {
    console.error("Failed to update subject:", error);
  }
}
