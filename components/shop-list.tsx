
import { Product } from "@/types";
import NoResults from "@/components/ui/no-results";
import ShopCard from "./ui/shop-card";

interface ProductListProps {
  title: string;
  storeId: string,
  items: Product[]
}

const ShopList: React.FC<ProductListProps> = ({
  title,
  storeId,
  items
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-3xl">{title}</h3>
      {items.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <ShopCard
          storeId={storeId}
          key={item.id}
          data={item}
          disabled={item.quantity === 0} // Disable card if quantity is 0
          soldOut={item.quantity === 0}   // Label as "Sold Out" if quantity is 0
        />
        ))}
      </div>
    </div>
   );
}
 
export default ShopList;