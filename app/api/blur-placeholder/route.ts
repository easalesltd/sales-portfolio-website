import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('image');

    if (!imagePath) {
      return NextResponse.json({ error: 'Image path is required' }, { status: 400 });
    }

    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const fullPath = path.join(process.cwd(), 'public', cleanPath);

    // Read the image file
    const imageBuffer = await fs.readFile(fullPath);

    // Generate a tiny blurred version (20x20)
    const { data, info } = await sharp(imageBuffer)
      .resize(20, 20, { fit: 'inside' })
      .blur(10)
      .toBuffer({ resolveWithObject: true });

    // Convert to base64
    const base64 = `data:${info.format};base64,${data.toString('base64')}`;

    return NextResponse.json({ blurDataUrl: base64 });
  } catch (error) {
    console.error('Error generating blur placeholder:', error);
    return NextResponse.json({ error: 'Failed to generate blur placeholder' }, { status: 500 });
  }
} 