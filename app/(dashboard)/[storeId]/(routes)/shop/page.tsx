
import ShopList from "@/components/shop-list";
import Container from "@/components/ui/container";
import prismadb from "@/lib/prismadb";
import { Color } from "@/types";
export const revalidate = 0;
import Filter from "@/components/filter";
import MobileFilters from "@/components/mobile-filter";


const HomePage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
      isDeleted: false
    },
    include: {
      category: true,
      size: true,
      color: true,
      images: true,
    },
  })

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId
    }
  })

  // Convert the price property to number in each product
const productsWithPriceAsNumber = products.map(product => ({
  ...product,
  price: Number(product.price), // Convert Decimal to number
}));


  return (
    <Container>
      <div className="space-y-10 pb-10">
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ShopList title="Products" storeId={params.storeId} items={productsWithPriceAsNumber} categories={categories}/>
        </div>
      </div>
    </Container>
  )
};

export default HomePage;