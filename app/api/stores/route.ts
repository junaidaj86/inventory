import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { getServerSession } from "next-auth/next"
import { options } from '@/app/api/auth/[...nextauth]/options';

export async function POST(
  req: Request,
) {
  try {
    const body = await req.json();
    const session = await getServerSession(options);
    const { name, GST, address } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    let data = {
      name: body.name,
      GST: body.gst,
      address: body.address
    }
    const store = await prismadb.store.create({
      data
    });
    if (session?.user?.email) {
      const existingUser = await prismadb.user.findFirst({
        where: {
          email: session.user.email,
        },
      });

      if(existingUser){
        await prismadb.user.update({
          where: {
            email: session.user.email,
          },
          data: {
            storeId: store.id,
          },
        });
      }
    }
  
    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
