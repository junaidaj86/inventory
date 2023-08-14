import Gallery from '@/components/gallery';
import Info from '@/components/info';
import Container from '@/components/ui/container';
import prismadb from "@/lib/prismadb";

export const revalidate = 0;

interface ProductPageProps {
  params: {
    productId: string;
  },
}

const ProductPage: React.FC<ProductPageProps> = async ({ 
  params
 }) => {
  //const product = await getProduct(params.productId);
    const product = await prismadb.product.findFirst({
      where: {
        id: params.productId
      },
      include: {
        category: true,
        size: true,
        color: true,
        images: true,
      },
    })

  

  if (!product) {
    return null;
  }

  const productWithPriceAsNumber = {
    ...product,
    price: Number(product.price),
  };

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Gallery images={product.images} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <Info data={productWithPriceAsNumber} />
            </div>
          </div>
          <hr className="my-10" />
         
        </div>
      </Container>
    </div>  
  )
}

export default ProductPage;
