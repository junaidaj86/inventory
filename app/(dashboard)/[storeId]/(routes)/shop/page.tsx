
import ShopList from "@/components/shop-list";
import Container from "@/components/ui/container";
import prismadb from "@/lib/prismadb";
export const revalidate = 0;


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

  // Convert the price property to number in each product
const productsWithPriceAsNumber = products.map(product => ({
  ...product,
  price: Number(product.price), // Convert Decimal to number
}));

  console.log("products = "+ JSON.stringify(products, undefined, 2))
  return (
    <Container>
      <div className="space-y-10 pb-10">
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ShopList title="Featured Products" storeId={params.storeId} items={productsWithPriceAsNumber} />
        </div>
      </div>
    </Container>
  )
};

export default HomePage;