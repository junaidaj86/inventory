"use client";

import axios from "axios";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import {Button} from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Product } from "@/types";
import ReactToPrint from "react-to-print";


const Summary = async ({
  params,
  data,
  ref // Add ref as a prop
}: {
  params: { storeId: string },
  data: Product[];
  ref: React.RefObject<HTMLDivElement>; // Define ref as a prop
}) => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const summaryRef = useRef(null);



  const totalPrice = items.reduce((total, item) => {
    const product = data.find((p) => p.id === item.id);
    if (product && item.quantityInCart != null) {
      total += product.price * item.quantityInCart;
    }
    return total;
  }, 0);

  const onCheckout = async () => {
    const response = await axios.post(`/api/${params.storeId}/checkout`, items);

    if (response.status === 200) {
      toast.success('Payment completed.');
      removeAll();
  
      // Generate the invoice in PDF format
      if (summaryRef.current) {
        const canvas = await html2canvas(summaryRef.current);
        const imgData = canvas.toDataURL("image/png");
  
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = 2480;
        const pdfHeight = 3508;
        
        pdf.addImage(imgData, "PNG", 10, 10, 50, 50);
        pdf.save("invoice.pdf");
      }
    }
  }

  return ( 
    <div
      className="mt-16 rounded-lg px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 className="text-lg font-medium text-white-900">
        Order summary
      </h2>
      <div ref={summaryRef} className="mt-6 space-y-4">
        {data.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between border-t border-white-200 pt-4"
          >
            <div className="text-base font-medium text-white-900">{product.name}</div>
            <div className="flex space-x-4">
              <div>
                {product.quantityInCart !== undefined ? `${product.quantityInCart} x` : ""}
              </div>
              <Currency value={product.price} />
              <div>=</div>
              {product.quantityInCart !== undefined ? (
                <Currency value={product.quantityInCart * product.price} />
              ) : (
                <span>N/A</span>
              )}
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-white-200 pt-4">
          <div className="text-base font-medium text-white-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>

      <ReactToPrint
        bodyClass="print-agreement"
        content={() => summaryRef.current}
        trigger={() => (
          <Button onClick={onCheckout} disabled={items.length === 0} className="w-full mt-6">
          Checkout
        </Button>
         )}
       />
      
    </div>
  );
}
 
export default Summary;