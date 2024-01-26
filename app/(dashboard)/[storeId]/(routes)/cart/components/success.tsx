

const Success = ({
  params,
}: {
  params: { storeId: string };
}) => {
 
  return (
    <div
      className="mt-16 rounded-lg px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
      id="printableArea"
    >
      <h2 className="text-lg font-medium text-white-900">Order completed.</h2>
    </div>
  );
};

export default Success;
