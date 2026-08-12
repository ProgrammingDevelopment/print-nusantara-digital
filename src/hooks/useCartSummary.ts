import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const CART_UPDATED_EVENT = "cart:updated";

export function useCartSummary() {
  const { user } = useAuth();
  const [itemCount, setItemCount] = useState(0);

  const fetchSummary = useCallback(async () => {
    if (!user) {
      setItemCount(0);
      return;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select("quantity")
      .eq("user_id", user.id);

    if (error) {
      setItemCount(0);
      return;
    }

    setItemCount((data ?? []).reduce((total, item) => total + item.quantity, 0));
  }, [user]);

  useEffect(() => {
    void fetchSummary();

    window.addEventListener(CART_UPDATED_EVENT, fetchSummary);
    return () => window.removeEventListener(CART_UPDATED_EVENT, fetchSummary);
  }, [fetchSummary]);

  return { itemCount, refresh: fetchSummary };
}
