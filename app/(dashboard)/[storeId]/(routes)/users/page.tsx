import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { UserColumn } from "./components/columns"
import { UserClient } from "./components/client";

const UserPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const users = await prismadb.user.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedColors: UserColumn[] = users.map((item) => ({
    id: item.id,
    name: item.username,
    email: item.email,
    role: item.role,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UserClient data={formattedColors} />
      </div>
    </div>
  );
};

export default UserPage;
