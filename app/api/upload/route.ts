import { stat, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dayjs from 'dayjs';
import { addNote } from '@/lib/redis';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  console.log('%c [ file ]-12', 'font-size:13px; background:#ca0bd3; color:#ff4fff;', file)

  if (!file) {
    return NextResponse.json(
      {
        error: 'No file uploaded',
      },
      {
        status: 400,
      }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const relativeUploadDir = `/uploads/${dayjs().format('YY-MM-DD')}`;
  const uploadDir = join(process.cwd(), 'public', relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (e: any) {
    console.log('%c [ e ]-31', 'font-size:13px; background:#8493c5; color:#c8d7ff;', e)
    if (e.code === 'ENOENT') {
      await mkdir(uploadDir, { recursive: true });
    } else {
      return NextResponse.json(
        { error: 'Something went wrong' },
        { status: 500 }
      );
    }
  }

  try {
    const uniqueSuffix = `${Math.random().toString().slice(-6)}`;
    const filename = file.name.replace(/\.[^/.]+$/, "");
    const uniqueFilename = `${filename}-${uniqueSuffix}.${file.name.split('.').pop()}`;
    await writeFile(`${uploadDir}/${uniqueFilename}`, buffer);

    const res = await addNote({
      title: filename,
      content: buffer.toString('utf-8'),
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({
      fileUrl: `${relativeUploadDir}/${uniqueFilename}`,
      uid: res,
    });
  } catch (e: any) {
    console.error('%c [ e ]-61', 'font-size:13px; background:#52a724; color:#96eb68;', e)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
