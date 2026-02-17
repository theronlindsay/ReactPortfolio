import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { EducationItem } from '@/models';

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = await params;
  try {
    const body = await request.json();
    const item = await EducationItem.findByIdAndUpdate(id, body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = await params;
  try {
    const deletedItem = await EducationItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
