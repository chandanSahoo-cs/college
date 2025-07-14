import { writeFile, readFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

interface Programme {
  prog_id: string;
  prog_name: string;
  prog_short_name: string;
  regulatory_body_name?: string;
  regulatory_body_shortname?: string;
  university_school: string;
  semester_annual: string;
  min_duration_in_years: number;
  max_duration_in_years: number;
}

const DATA_FILE = './data/programmes.json';

// Initialize the data file if it doesn't exist
async function initializeDataFile() {
  try {
    await readFile(DATA_FILE);
  } catch (error) {
    await writeFile(DATA_FILE, JSON.stringify({ programmes: [] }));
  }
}

export async function addProgramme(data: Omit<Programme, 'prog_id'>): Promise<Programme> {
  await initializeDataFile();
  const fileContent = await readFile(DATA_FILE, 'utf-8');
  const { programmes } = JSON.parse(fileContent);

  const newProgramme: Programme = {
    prog_id: uuidv4().substring(0, 10), // Generate a 10-character ID
    ...data,
  };

  programmes.push(newProgramme);
  await writeFile(DATA_FILE, JSON.stringify({ programmes }, null, 2));
  return newProgramme;
}

export async function getProgrammeById(prog_id: string): Promise<Programme | null> {
  await initializeDataFile();
  const fileContent = await readFile(DATA_FILE, 'utf-8');
  const { programmes } = JSON.parse(fileContent);
  return programmes.find(p => p.prog_id === prog_id) || null;
}

export async function getAllProgrammes(): Promise<Programme[]> {
  await initializeDataFile();
  const fileContent = await readFile(DATA_FILE, 'utf-8');
  const { programmes } = JSON.parse(fileContent);
  return programmes;
}

export async function updateProgrammeById(prog_id: string, data: Partial<Programme>): Promise<Programme | null> {
  await initializeDataFile();
  const fileContent = await readFile(DATA_FILE, 'utf-8');
  const { programmes } = JSON.parse(fileContent);

  const index = programmes.findIndex(p => p.prog_id === prog_id);
  if (index === -1) return null;

  programmes[index] = {
    ...programmes[index],
    ...data,
  };

  await writeFile(DATA_FILE, JSON.stringify({ programmes }, null, 2));
  return programmes[index];
}

export async function deleteProgrammeById(prog_id: string): Promise<boolean> {
  await initializeDataFile();
  const fileContent = await readFile(DATA_FILE, 'utf-8');
  const { programmes } = JSON.parse(fileContent);

  const index = programmes.findIndex(p => p.prog_id === prog_id);
  if (index === -1) return false;

  programmes.splice(index, 1);
  await writeFile(DATA_FILE, JSON.stringify({ programmes }, null, 2));
  return true;
}
