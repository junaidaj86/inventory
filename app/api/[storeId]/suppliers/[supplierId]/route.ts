import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";


// import statements...

export async function GET(
  req: Request,
  { params }: { params: { supplierId: string } }
) {
  try {
    if (!params.supplierId) {
      return new NextResponse("Supplier id is required", { status: 400 });
    }

    const supplier = await prismadb.supplier.findUnique({
      where: {
        id: params.supplierId,
      },
    });

    if (!supplier) {
      return new NextResponse("Supplier not found", { status: 404 });
    }

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("[SUPPLIER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { supplierId: string } }
) {
  try {
    const session = await getServerSession(options);

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.supplierId) {
      return new NextResponse("Supplier id is required", { status: 400 });
    }

    // Add your logic to check if the user has permission to delete the supplier

    const supplier = await prismadb.supplier.delete({
      where: {
        id: params.supplierId,
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("[SUPPLIER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { supplierId: string } }
) {
  try {
    const session = await getServerSession(options);

    const body = await req.json();
    const { name } = body;

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.supplierId) {
      return new NextResponse("Supplier id is required", { status: 400 });
    }

    // Add your logic to check if the user has permission to update the supplier

    const supplier = await prismadb.supplier.update({
      where: {
        id: params.supplierId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("[SUPPLIER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

