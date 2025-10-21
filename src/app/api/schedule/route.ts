import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import { Day } from "@/lib/models";

export async function GET() {
  await connectMongoDB();
  const days = await Day.find({});
  return NextResponse.json(days);
}
