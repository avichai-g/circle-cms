"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const publicRoutes = ["/login", "/signup", "/"];

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname() || "";

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token && !publicRoutes.includes(pathname)) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
