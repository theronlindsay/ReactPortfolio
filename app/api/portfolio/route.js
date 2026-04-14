import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { PortfolioItem } from '@/models';

async function migrateLegacySortOrder() {
  const total = await PortfolioItem.countDocuments();
  if (total === 0) return;
  const missingSort = await PortfolioItem.countDocuments({ sortOrder: { $exists: false } });
  if (missingSort === total) {
    const sorted = await PortfolioItem.find({}).sort({ createdAt: -1 });
    await Promise.all(
      sorted.map((doc, i) => PortfolioItem.updateOne({ _id: doc._id }, { $set: { sortOrder: i } }))
    );
  }
}

export async function GET() {
  await dbConnect();
  try {
    await migrateLegacySortOrder();
    const items = await PortfolioItem.find({}).sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const maxDoc = await PortfolioItem.findOne().sort({ sortOrder: -1 }).select('sortOrder').lean();
    const nextOrder = (typeof maxDoc?.sortOrder === 'number' ? maxDoc.sortOrder : -1) + 1;
    const item = await PortfolioItem.create({ ...body, sortOrder: nextOrder });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
