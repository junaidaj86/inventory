import { redirect } from "next/navigation";

import StoreSwitcher from "@/components/store-switcher";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import prismadb from "@/lib/prismadb";

import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from "next-auth/next"
import { Signout } from "./logout";
import NavbarActions from "./navbar-actions";


  const Navbar = async ({
    params
  }: {
    params: { storeId: string }
  }) => {
  const session = await getServerSession(options);
  if (!session) {
    redirect('/sign-in');
  }

  const stores = await prismadb.store.findMany({
    where: {
      users: {
        some: {
          email: session.user.email,
        },
      },
    }
  });

  return ( 
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <NavbarActions params={{ storeId: params.storeId }}/>
          <Signout />
        </div>
      </div>
    </div>
  );
};
 
export default Navbar;
