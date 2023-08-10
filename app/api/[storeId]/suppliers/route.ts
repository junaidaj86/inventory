import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from "next-auth/next"
 
// import statements...

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(options);

    const body = await req.json();
    console.log("adadsasd"+ JSON.stringify(body, undefined,2));

    const { name } = body;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        users: {
          some: {
            email: session.user.email,
          },
        },
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const supplier = await prismadb.supplier.create({
      data: {
        name: name,
        storeId: params.storeId, // Set the storeId field to connect the Supplier to the Store
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.log('[SUPPLIER_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeWithSuppliers = await prismadb.store.findUnique({
      where: {
        id: params.storeId,
      },
      include: {
        suppliers: true,
      },
    });

    if (!storeWithSuppliers) {
      return new NextResponse("Store not found", { status: 404 });
    }

    return NextResponse.json(storeWithSuppliers.suppliers);
  } catch (error) {
    console.log('[SUPPLIERS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

