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

const Summary = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const summaryRef = useRef(null);



  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price)
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
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
        pdf.save("invoice.pdf");
      }
    }
  }

  return ( 
    <div
      className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 className="text-lg font-medium text-gray-900">
        Order summary
      </h2>
      <div ref={summaryRef} className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
         <Currency value={totalPrice} />
        </div>
      </div>
      <Button onClick={onCheckout} disabled={items.length === 0} className="w-full mt-6">
        Checkout
      </Button>
    </div>
  );
}
 
export default Summary;
