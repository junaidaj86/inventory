import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from "next-auth/next"
import { SettingsForm } from "./components/settings-form";

const SettingsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const session = await getServerSession(options);
  if (!session) {
    redirect('/api/auth/signin');
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId: session.user.email,
    }
  });

  if (!store) {
    redirect('/');
  }

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
}

export default SettingsPage;
