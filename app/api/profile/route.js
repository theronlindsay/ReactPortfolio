import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Profile } from '@/models';

export async function GET() {
  await dbConnect();
  try {
    let profile = await Profile.findOne({});
    if (!profile) {
      // Return empty default to avoid null checks on frontend
      return NextResponse.json({ success: true, data: { aboutText: '', socialLinks: [] } });
    }
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    // Upsert: update if exists, insert if not
    const profile = await Profile.findOneAndUpdate({}, body, {
      returnDocument: 'after',
      upsert: true,
      runValidators: true,
    });
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
