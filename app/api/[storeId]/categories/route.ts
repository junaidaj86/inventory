import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from "next-auth/next"
 
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(options);

    const body = await req.json();
    
    const { name } = body;
    console.log("2"+ name)
    if (!session) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    console.log("3"+ session)
    console.log("4"+ params.storeId)

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    console.log("5"+ params.storeId)

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        users: {
          some: {
            email: session.user.email,
          },
        },
      }
    });
    console.log("6"+ params.storeId)

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }
    console.log("7"+ params.storeId)

    const category = await prismadb.category.create({
      data: {
        name,
        storeId: params.storeId,
      }
    });
    console.log("8"+ params.storeId)
  
    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORIES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId
      }
    });
  
    return NextResponse.json(categories);
  } catch (error) {
    console.log('[CATEGORIES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
