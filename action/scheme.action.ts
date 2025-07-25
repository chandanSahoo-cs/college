'use server';
import prisma from '@/lib/prisma';

interface AddSchemeProps {
  scheme_id: string;
  course_id: string;
  acad_year: number;
  semester_annual: number;
  min_duration_in_years: number;
  max_duration_in_years: number;
  total_semester_annual: number;
  min_credits: number;
  max_credits: number;
  regulatory_body_name?: string;
  regulatory_body_shortname?: string;
  university_school: string;
}

interface UpdateSchemeByIdProps {
  course_id?: string;
  acad_year?: number;
  semester_annual?: number;
  min_duration_in_years?: number;
  max_duration_in_years?: number;
  total_semester_annual?: number;
  min_credits?: number;
  max_credits?: number;
  regulatory_body_name?: string;
  regulatory_body_shortname?: string;
  university_school?: string;
}

export async function addScheme(data: AddSchemeProps) {
  try {
    const scheme = await prisma.course_scheme.create({
      data: {
        scheme_id: data.scheme_id,
        course_id: data.course_id,
        acad_year: data.acad_year,
        semester_annual: data.semester_annual,
        min_duration_in_years: data.min_duration_in_years,
        max_duration_in_years: data.max_duration_in_years,
        total_semester_annual: data.total_semester_annual,
        min_credits: data.min_credits,
        max_credits: data.max_credits,
        regulatory_body_name: data.regulatory_body_name,
        regulatory_body_shortname: data.regulatory_body_shortname,
        university_school: data.university_school,
      },
    });
    return scheme;
  } catch (error) {
    console.error('Failed to add scheme:', error);
    return null;
  }
}

export async function getSchemeById(scheme_id: string) {
  try {
    const scheme = await prisma.course_scheme.findUnique({
      where: { scheme_id },
    });
    return scheme;
  } catch (error) {
    console.error('Failed to fetch scheme:', error);
    return null;
  }
}

export async function getAllSchemes() {
  try {
    const schemes = await prisma.course_scheme.findMany();
    return schemes;
  } catch (error) {
    console.error('Failed to fetch all schemes:', error);
    return [];
  }
}

export async function updateSchemeById(scheme_id: string, data: UpdateSchemeByIdProps) {
  try {
    const updated = await prisma.course_scheme.update({
      where: { scheme_id },
      data,
    });
    return updated;
  } catch (error) {
    console.error('Failed to update scheme:', error);
    return null;
  }
}

export async function deleteSchemeById(scheme_id: string) {
  try {
    const deleted = await prisma.course_scheme.delete({
      where: { scheme_id },
    });
    return deleted;
  } catch (error) {
    console.error('Failed to delete scheme:', error);
    return null;
  }
}
