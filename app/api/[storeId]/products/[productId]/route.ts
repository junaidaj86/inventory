import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from "next-auth/next"

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string, storeId: string } }
) {
  try {
    const session = await getServerSession(options);

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

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

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    // const product = await prismadb.product.delete({
    //   where: {
    //     id: params.productId
    //   },
    // });

    const deletedProduct = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        isDeleted: true,
      },
    });
  
    return NextResponse.json(deletedProduct);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { productId: string, storeId: string } }
) {
  try {
    const session = await getServerSession(options);

    const body = await req.json();
    console.log("body = "+ JSON.stringify(body,undefined,2))

    const { name, price, categoryId, images, colorId, sizeId, isFeatured, isArchived, quantity } = body;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // if (!images || !images.length) {
    //   return new NextResponse("Images are required", { status: 400 });
    // }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!colorId) {
     
    }

    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }
    if (!quantity) {
      return new NextResponse("quantity is required", { status: 400 });
    }

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

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
        quantity,
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
      },
    })
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
