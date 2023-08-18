"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();
  const { data: session } = useSession();
  console.log("adsad"+ JSON.stringify(session, undefined,2))
  const isAdmin = session?.user?.role === "admin";
  const routes = [
    {
      href: `/${params.storeId}`,
      label: 'Overview',
      active: pathname === `/${params.storeId}`,
      role: ["admin", "owner"],
    },

    {
      href: `/${params.storeId}/categories`,
      label: 'Categories',
      active: pathname === `/${params.storeId}/categories`,
      role: ["admin"],
    },
    {
      href: `/${params.storeId}/sizes`,
      label: 'Sizes',
      active: pathname === `/${params.storeId}/sizes`,
      role: ["admin"],
    },
    {
      href: `/${params.storeId}/colors`,
      label: 'Colors',
      active: pathname === `/${params.storeId}/colors`,
      role: ["admin"],
    },
    {
      href: `/${params.storeId}/suppliers`,
      label: 'Suppliers',
      active: pathname === `/${params.storeId}/suppliers`,
      role: ["admin"],
    },
    {
      href: `/${params.storeId}/products`,
      label: 'Products',
      active: pathname === `/${params.storeId}/products`,
      role: [ "admin"],
    },
    {
      href: `/${params.storeId}/orders`,
      label: 'Orders',
      active: pathname === `/${params.storeId}/orders`,
      role: ["admin"],
    },
    {
      href: `/${params.storeId}/settings`,
      label: 'Settings',
      active: pathname === `/${params.storeId}/settings`,
      role: ["admin"],
    },
    {
      href: `/${params.storeId}/users`,
      label: 'User',
      active: pathname === `/${params.storeId}/users`,
      role: ["admin"],
    },
    {
      href: `/${params.storeId}/shop`,
      label: 'Shop',
      active: pathname === `/${params.storeId}/shop`,
      role: ["admin", "user"],
    },
  ]

  // Determine if the user has the required role for a specific route
  const hasRequiredRole = (routeRoles: string[]) => {
    if (!session || !session.user) {
      return false;
    }
    return routeRoles.includes(session.user.role);
  };

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        (hasRequiredRole(route.role) || !route.role) && (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
      </Link>
      )
      ))}
    </nav>
  )
};
