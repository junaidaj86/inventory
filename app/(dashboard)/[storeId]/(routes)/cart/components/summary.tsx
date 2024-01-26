import axios from "axios";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { FaTag } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import { Product } from "@/types";

const Summary = ({
  params,
  data,
}: {
  params: { storeId: string };
  data: Product[];
}) => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const [itemDiscounts, setItemDiscounts] = useState<{ [key: string]: number }>(
    {}
  );
  const [orderDiscount, setOrderDiscount] = useState<number>(0);
  const [showDiscountModal, setShowDiscountModal] = useState<{
    [key: string]: boolean;
  }>({});

  const calculateItemPrice = (product: Product): number => {
    const discountPercentage = itemDiscounts[product.id] || 0;
    const discount = (discountPercentage / 100) * product.price; // Convert percentage to value
    return (product.price - discount) * (product.quantityInCart || 0);
  };

  const calculateTotalPrice = (): number => {
    return (
      items.reduce((total, item) => {
        const product = data.find((p) => p.id === item.id);
        if (product && item.quantityInCart != null) {
          total += calculateItemPrice(product);
        }
        return total;
      }, 0) - orderDiscount
    );
  };

  const printDiv = (divId: string): void => {
    const printContents = document.getElementById(divId)?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents !== undefined) {
      document.body.innerHTML = printContents;

      window.print();

      document.body.innerHTML = originalContents;
    } else {
      console.error(`Element with ID ${divId} not found.`);
    }
  };

  const onCheckout = async (printableDiv: string) => {
    printDiv(printableDiv);
    const discountedItems = items.map((item) => {
      const product = data.find((p) => p.id === item.id);
      const discount = itemDiscounts[item.id] || 0;
      return {
        ...item,
        price: product ? product.price - discount : 0,
        discount: discount,
      };
    });

    const response = await axios.post(
      `/api/${params.storeId}/checkout`,
      discountedItems
    );

    if (response.status === 200) {
      toast.success("Transaction completed.");
      removeAll();
      window.location.reload();
    }
  };

  return (
    <div
      className="mt-16 rounded-lg px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
      id="printableArea"
    >
      <h2 className="text-lg font-medium text-white-900">Order summary</h2>
      <div  className="mt-6 space-y-4">
        {data.map((product) => (
          <div
            key={product.id}
            className="relative border-t border-white-200 pt-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-base font-medium text-white-900">
                {product.name}
              </div>
              <div className="flex space-x-4 items-center">
                <div>
                  {product.quantityInCart !== undefined
                    ? `${product.quantityInCart} x`
                    : ""}
                </div>
                <Currency value={product.price} />
                <div>=</div>
                {product.quantityInCart !== undefined ? (
                  <Currency value={calculateItemPrice(product)} />
                ) : (
                  <span>N/A</span>
                )}
                <div>
                  <FaTag
                    onClick={() =>
                      setShowDiscountModal((prev) => ({
                        ...prev,
                        [product.id]: true,
                      }))
                    }
                    className="cursor-pointer text-blue-500 ml-2"
                  />
                </div>
              </div>
            </div>
            {showDiscountModal[product.id] && (
              <div className="absolute bg-white p-4 border rounded-md mt-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Discount:
                </label>
                <input
                  type="number"
                  min="0"
                  value={itemDiscounts[product.id] || ""}
                  onChange={(e) => {
                    const discount = parseFloat(e.target.value) || 0;
                    setItemDiscounts((prev) => ({
                      ...prev,
                      [product.id]: discount,
                    }));
                  }}
                  className="border rounded-md p-2 w-full"
                />
                <button
                  className="mt-2 bg-blue-500 text-white p-2 rounded-md"
                  onClick={() =>
                    setShowDiscountModal((prev) => ({
                      ...prev,
                      [product.id]: false,
                    }))
                  }
                >
                  Apply
                </button>
              </div>
            )}
            {itemDiscounts[product.id] && (
              <div className="flex flex-row gap-20">
                <div className="text-sm text-gray-500 mt-2">Discount value:</div>
                <div className="text-sm text-gray-500 mt-2">
                  {itemDiscounts[product.id]}%
                </div>
              </div>
            )}
          </div>
        ))}
        <div >
          {orderDiscount > 0 && (
            <div className="flex flex-row gap-20">
              <div className="text-sm text-gray-500 mt-2">
                Total Discount:
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {orderDiscount}%
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-white-200 pt-4">
          <div className="text-base font-medium text-white-900">
            Order total
          </div>
          <Currency value={calculateTotalPrice()} />
          <div>
            <FaTag
              onClick={() =>
                setShowDiscountModal((prev) => ({ ...prev, order: true }))
              }
              className="cursor-pointer text-blue-500 ml-2"
            />
          </div>
          {showDiscountModal.order && (
            <div className="absolute bg-white p-4 border rounded-md mt-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Order Discount:
              </label>
              <input
                type="number"
                min="0"
                value={orderDiscount || ""}
                onChange={(e) => {
                  const discount = parseFloat(e.target.value) || 0;
                  setOrderDiscount(discount);
                }}
                className="border rounded-md p-2 w-full"
              />
              <button
                className="mt-2 bg-blue-500 text-white p-2 rounded-md"
                onClick={() =>
                  setShowDiscountModal((prev) => ({ ...prev, order: false }))
                }
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={() => onCheckout("printableArea")}
        disabled={items.length === 0}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
