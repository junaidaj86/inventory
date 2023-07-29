import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { SupplierColumn } from "./components/columns"
import { SuppliersClient } from "./components/client";

const SuppliersPage = async ({
    params
  }: {
    params: { storeId: string }
  }) => {
    const suppliers = await prismadb.supplier.findMany({
      where: {
        storeId: params.storeId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  
    const formattedCategories: SupplierColumn[] = suppliers.map((item) => ({
      id: item.id,
      name: item.name,
      createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    }));
  
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <SuppliersClient data={formattedCategories} />
        </div>
      </div>
    );
  };
  
  export default SuppliersPage;