import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const orderItems  = await req.json();
  console.log("hhhhh"+ JSON.stringify(orderItems, undefined, 2))

  if (!orderItems || orderItems.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

 

  // const products = await prismadb.product.findMany({
  //   where: {
  //     id: {
  //       in: productIds
  //     }
  //   }
  // });

  // const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  // products.forEach((product) => {
  //   line_items.push({
  //     quantity: 1,
  //     price_data: {
  //       currency: 'USD',
  //       product_data: {
  //         name: product.name,
  //       },
  //       unit_amount: product.price.toNumber() * 100
  //     }
  //   });
  // });

  // const order = await prismadb.order.create({
  //   data: {
  //     storeId: params.storeId,
  //     isPaid: false,
  //     orderItems: {
  //       create: orderItems.map((productId: string) => ({
  //         product: {
  //           connect: {
  //             id: productId
  //           }
  //         },
  //         quantity: 1
  //       }))
  //     }
  //   }
  // });

  // const session = await stripe.checkout.sessions.create({
  //   line_items,
  //   mode: 'payment',
  //   billing_address_collection: 'required',
  //   phone_number_collection: {
  //     enabled: true,
  //   },
  //   success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
  //   cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
  //   metadata: {
  //     orderId: order.id
  //   },
  // });

  // return NextResponse.json({ url: "success"}, {
  //   headers: corsHeaders
  // });




  try {
    // Prepare the array of operations for the transaction
    const transactionOperations = [];

    for (const orderItem of orderItems) {
      const { id, quantityInCart } = orderItem;

      // Fetch the product by ID
      const product = await prismadb.product.findUnique({
        where: { id }
      });

      if (!product) {
        return new NextResponse(`Product with ID ${id} not found`, { status: 404 });
      }

      if (product.quantity < quantityInCart) {
        return new NextResponse(`Insufficient stock for product with ID ${id}`, { status: 400 });
      }

      // Add operation to update product quantity
      transactionOperations.push(
        prismadb.product.update({
          where: { id },
          data: { quantity: product.quantity - quantityInCart }
        })
      );
    }

    // Add operation to create the order
    transactionOperations.push(
      prismadb.order.create({
        data: {
          storeId: params.storeId,
          isPaid: false,
          orderItems: {
            create: orderItems.map((orderItem: any) => ({
              product: {
                connect: {
                  id: orderItem.id
                }
              },
              quantity: orderItem.quantityInCart
            }))
          }
        }
      })
    );

    // Execute the transaction
    await prismadb.$transaction(transactionOperations);

    // Respond with success
    return NextResponse.json({ url: "success" }, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Error creating order", { status: 500 });
  }
};
