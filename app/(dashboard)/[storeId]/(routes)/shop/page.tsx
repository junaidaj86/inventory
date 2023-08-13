
import ProductList from "@/components/product-list";
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
      storeId: params.storeId
    },
    include: {
      category: true,
      size: true,
      color: true,
      images: true,
    },
  })

  console.log("products = "+ JSON.stringify(products, undefined, 2))
  return (
    <Container>
      <div className="space-y-10 pb-10">
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ShopList title="Featured Products" storeId={params.storeId} items={products} />
        </div>
      </div>
    </Container>
  )
};

export default HomePage;