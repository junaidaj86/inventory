"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";

import Summary from "./components/summary";
import CartItem from "./components/cart-item";
import { Store } from "@/types";

export const revalidate = 0;

const CartPage = async ({ params }: { params: { storeId: string } }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [store, setStore] = useState<Store | null>(null);
  const cart = useCart();

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(`/api/stores/${params.storeId}`);
        setStore(response.data);
      } catch (error) {
        console.error("Error fetching store:", error);
      } finally {
        setIsMounted(true);
      }
    };

    fetchStore();
  }, [params.storeId]);

  if (!isMounted) {
    return null;
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div>
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          {store && (
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">
                {capitalizeFirstLetter(store.name)}
              </h1>
              {store.address && (
                <p className="text-base">
                  Address: {capitalizeFirstLetter(store.address)}
                </p>
              )}
              {store.GST && (
                <p className="text-base">
                  GST: {capitalizeFirstLetter(store.GST)}
                </p>
              )}
              <p className="text-base mb-4">Date: {currentDate}</p>
            </div>
          )}

          
          {/* Shopping Cart */}
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {cart.items.length === 0 && (
                <p className="text-neutral-500">No items added to cart.</p>
              )}
              <ul>
                {cart.items.map((item) => (
                  <CartItem
                    key={item.id}
                    data={item}
                    storeId={params.storeId}
                  />
                ))}
              </ul>
            </div>
            {/* Summary Component */}
              <Summary
                params={{ storeId: params.storeId }}
                data={cart.items}
              />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
