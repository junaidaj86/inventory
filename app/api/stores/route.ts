import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from "next-auth/next"

export async function POST(
  req: Request,
) {
  try {
    const session = await getServerSession(options);
    const body = await req.json();

    const { name } = body;

    if (!session) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId: session.user.email,
      }
    });
  
    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
