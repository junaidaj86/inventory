"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";

import {Button} from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Color, Size, Category } from "@/types";

interface FilterProps {
  data: (Size | Color | Category)[];
  name: string;
  valueKey: string;
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
};

const Filter: React.FC<FilterProps> = ({
  data,
  name,
  valueKey,
  selectedCategory,
  onSelectCategory,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedValue = searchParams.get(valueKey);
  
  const onClick = (id: string) => {
    if (selectedCategory === id) {
      onSelectCategory(null);
    } else {
      onSelectCategory(id);
    }
  };
  return ( 
    <div className="mb-8">
      <h3 className="text-lg font-semibold">
        {name}
      </h3>
      <hr className="my-4" />
      <div className="flex flex-wrap gap-2">
        {data.map((filter) => (
          <div key={filter.id} className="flex items-center">
            <Button
              className={cn(
                'rounded-md text-sm text-gray-800 p-2 bg-white border border-gray-300',
                selectedValue === filter.id && 'bg-black text-white'
              )}
              onClick={() => onClick(filter.id)}
            >
              {filter.name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;