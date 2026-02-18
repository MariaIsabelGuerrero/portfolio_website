import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

/**
 * Client-side auth guard hook.
 * Checks if the current user has an active session with ADMIN role.
 * Redirects to /admin/login if not authenticated or not authorized.
 * Only checks once on mount — sidebar navigation won't re-trigger loading.
 */
export function useAdminAccess() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Check if session exists
        const session = await authClient.getSession();
        if (!session.data?.session) {
          router.push("/admin/login");
          setLoading(false);
          return;
        }

        // Try to get role from session user object
        const user = session.data.user as { role?: string } | undefined;
        let role: string | null = user?.role || null;

        // If no role in session, extract from JWT token payload
        if (!role) {
          try {
            const tokenResult = await authClient.token();
            const token = tokenResult.data?.token;
            if (token) {
              const parts = token.split(".");
              if (parts.length === 3) {
                const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
                const padded = base64.padEnd(
                  base64.length + ((4 - (base64.length % 4)) % 4),
                  "="
                );
                const payload = JSON.parse(atob(padded));
                role = payload.role || null;
              }
            }
          } catch {
            // Token extraction failed
          }
        }

        // Verify ADMIN role
        if (role?.toUpperCase() !== "ADMIN") {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        setAuthorized(true);
        setLoading(false);
      } catch {
        router.push("/admin/login");
        setLoading(false);
      }
    };

    checkAccess();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { authorized, loading };
}
