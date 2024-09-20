import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  try {
    // Sök efter filen i olika möjliga mappar
    const possiblePaths = [
      path.join(process.cwd(), 'app', `${filename}.json`),
      path.join(process.cwd(), 'public', `${filename}.json`),
      path.join(process.cwd(), 'app', 'static', `${filename}.json`),
    ];

    let fileContents;
    for (const filePath of possiblePaths) {
      try {
        fileContents = await fs.readFile(filePath, 'utf8');
        console.log(`File found at: ${filePath}`);
        break;
      } catch (error) {
        console.log(`File not found at: ${filePath}`);
      }
    }

    if (!fileContents) {
      throw new Error('File not found in any of the expected locations');
    }

    const jobs = JSON.parse(fileContents);
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error reading jobs file:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}