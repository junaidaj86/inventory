import { redirect } from 'next/navigation';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from "next-auth/next"
import prismadb from '@/lib/prismadb';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(options);
  if (!session) {
    redirect('/api/auth/signin');
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId: session.user.email,
    }
  });

  if (store) {
    redirect(`/${store.id}`);
  };

  return (
    <>
      {children}
    </>
  );
};
