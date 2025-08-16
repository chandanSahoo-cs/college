'use server'
import prisma from "@/lib/prisma";

interface AddProgrammeProps {
  Prog_ID: string;
  Prog_Name: string;
  Prog_Short_Name: string;
  Regulatory_Body_Name?: string;
  Regulatory_Body_ShortName?: string;
  University_School: string;
  Semester_Annual: string;
  Min_Duration_in_years: number;
  Max_Duration_in_years: number;
}
interface UpdateProgrammeByIdProps {
  Prog_Name?: string;
  Prog_Short_Name?: string;
  Regulatory_Body_Name?: string;
  Regulatory_Body_ShortName?: string;
  University_School?: string;
  Semester_Annual?: number;
  min_duration_in_years?: number;
  max_duration_in_years?: number;
}

export async function addProgramme(data: AddProgrammeProps) {
  try {
    const formattedData = {
      prog_id: data.Prog_ID,
      prog_name: data.Prog_Name,
      prog_short_name: data.Prog_Short_Name,
      regulatory_body_name: data.Regulatory_Body_Name,
      regulatory_body_shortname: data.Regulatory_Body_ShortName,
      university_school: data.University_School,
      semester_annual: Number(data.Semester_Annual), // Convert string to number
      min_duration_in_years: data.Min_Duration_in_years,
      max_duration_in_years: data.Max_Duration_in_years,
    };

    const programm = await prisma.programmes.create({ data: formattedData });
    if (!programm) {
      throw new Error("Failed to create program");
    }
    return programm;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteProgrammeById(prog_id: string) {
  try {
    return await prisma.programmes.delete({
      where: { prog_id },
    });
  } catch (error) {
    console.error("Failed to delete programme",error);
  }
}

export async function getProgrammeById(prog_id: string) {
  try {
    
    const programme = await prisma.programmes.findUnique({
      where: {
        prog_id: prog_id
      },
    });
    return programme

  } catch (error) {
    console.error("Failed to fetch programme details",error);
    return null;
  }
}

export async function getAllProgrammes(){
    try {
        const programmes = await prisma.programmes.findMany();
        if(!programmes){
            throw new Error("Failed to fetch all programme")
        }
        return programmes
    } catch (error) {
        console.error(error)
    }
}


export async function updateProgrammeById(prog_id:string, data: UpdateProgrammeByIdProps){
    try {
        const updatedProgramme = await prisma.programmes.update({
            where:{
                prog_id
            },
            data,
        })
    } catch (error) {
        console.error("Failed to edit programme:",error)
    }
}