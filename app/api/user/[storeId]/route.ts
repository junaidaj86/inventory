import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from "next-auth/next"


export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(options);
    const body = await req.json();

    const { username, password, email, role } = body;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!username) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await prismadb.user.updateMany({
      where: {
        email: session.user.email,
      },
      data: {
        username,
        password,
        role,
        email
      }
    });
  
    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(options);

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await prismadb.user.deleteMany({
      where: {
        email: session.user.email,
      }
    });
  
    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
