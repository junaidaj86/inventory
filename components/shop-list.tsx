'use client'
import { Category, Product } from "@/types";
import NoResults from "@/components/ui/no-results";
import ShopCard from "./ui/shop-card";
import Filter from "./filter";
import MobileFilters from "./mobile-filter";
import React, { useState, useEffect } from 'react';

interface ProductListProps {
  title: string;
  storeId: string,
  items: Product[],
  categories: Category[]
}

const ShopList: React.FC<ProductListProps> = async ({
  title,
  storeId,
  items,
  categories
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState<Product[]>(items);
  const [isLoading, setIsLoading] = useState(false);
 
  useEffect(() => {
    setIsLoading(true); // Set loading to true while filtering

    if (selectedCategory) {
      const filteredProducts = items.filter(item => item.category.id === selectedCategory);
      setTimeout(() => {
        setFilteredItems(filteredProducts);
        setIsLoading(false); // Set loading to false when filtering is done
      }, 0); // Using setTimeout to ensure the loading state is set before rendering
    } else {
      // If no category is selected, show all products
      setTimeout(() => {
        setFilteredItems(items);
        setIsLoading(false); // Set loading to false when filtering is done
      }, 0); // Using setTimeout to ensure the loading state is set before rendering
    }
  }, [selectedCategory, items]);
  
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-3xl">{title}</h3>
      <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            <MobileFilters 
            categories={categories} 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            />
            <div className="hidden lg:block">
              <Filter
                valueKey="categoryId" 
                name="Categories" 
                data={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
  
            </div>
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              {filteredItems.length === 0 && <NoResults />}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {filteredItems.map((item) => (
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
          </div>
        </div>
    </div>
   );
}
 
export default ShopList;