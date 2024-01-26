import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(options);
    const body = await req.json();

    const { name, gst, address } = body;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    let data = {
      name: body.name,
      GST: body.gst,
      address: body.address
    }
    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        users: {
          some: {
            email: session.user.email,
          },
        },
      },
      data,
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

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

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        users: {
          some: {
            email: session.user.email,
          },
        },
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(options);

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        users: {
          some: {
            email: session.user.email,
          },
        },
      },
    });

    if (!store) {
      return new NextResponse("Store not found or unauthorized", {
        status: 404,
      });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
