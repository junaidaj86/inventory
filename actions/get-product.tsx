import { Product } from "@/types";
import prismadb from "@/lib/prismadb";

export const getProduct = async (productId: string) => {
    const products = await prismadb.product.findFirst({
      where: {
        id: productId,
      },
      include: {
        category: true, // Include related category
        size: true, // Include related size
        color: true, // Include related color
        images: true, // Include related images
        supplier: true, // Include related supplier
        // Add more related fields as needed
      },
    });
  
    return products;
  };

export default getProduct;

