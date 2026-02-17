import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { EducationItem } from '@/models';

export async function GET() {
  await dbConnect();
  try {
    const items = await EducationItem.find({}).sort({ startDate: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const item = await EducationItem.create(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
