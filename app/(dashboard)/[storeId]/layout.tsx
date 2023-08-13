import { redirect } from 'next/navigation';
import Navbar from '@/components/navbar'
import prismadb from '@/lib/prismadb';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from "next-auth/next"

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { storeId: string }
}) {
  const session = await getServerSession(options);
  if (!session) {
    redirect('/api/auth/signin');
  }

  const store = await prismadb.store.findFirst({ 
    where: {
      id: params.storeId,
      users: {
        some: {
          email: session.user.email,
        },
      },
    }
   });

  if (!store) {
    redirect('/');
  };

  return (
    <>
      <Navbar params={{ storeId: params.storeId }}/>
      {children}
    </>
  );
};
