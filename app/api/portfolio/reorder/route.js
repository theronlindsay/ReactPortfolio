import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import { PortfolioItem } from '@/models';

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'orderedIds must be a non-empty array' },
        { status: 400 }
      );
    }

    const invalid = orderedIds.some((id) => !mongoose.Types.ObjectId.isValid(id));
    if (invalid) {
      return NextResponse.json({ success: false, error: 'Invalid id in orderedIds' }, { status: 400 });
    }

    await Promise.all(
      orderedIds.map((id, index) =>
        PortfolioItem.updateOne({ _id: id }, { $set: { sortOrder: index } })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
