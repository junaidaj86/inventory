import { Product } from "@/types";
import prismadb from "@/lib/prismadb";

interface Query {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
}

export const getProduct = async (storeId: string, query: Query) => {
    const products = await prismadb.product.findMany({
      where: {
        storeId,
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

