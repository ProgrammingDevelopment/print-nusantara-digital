import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { CART_UPDATED_EVENT } from "@/hooks/useCartSummary";
import { getErrorMessage } from "@/lib/errors";
import { formatCurrencyIDR } from "@/lib/format";

type Product = Tables<"products">;
type CartItem = Tables<"cart_items"> & {
  products: Product | null;
};

export default function Cart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [shipping, setShipping] = useState({
    phone: "",
    address: "",
    city: "",
  });

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.products?.price ?? 0) * item.quantity,
        0,
      ),
    [items],
  );

  const fetchCart = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*, products(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems((data ?? []) as CartItem[]);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load cart"));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/auth");
      return;
    }

    void fetchCart();
  }, [authLoading, user, navigate, fetchCart]);

  const notifyCartUpdated = () => {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  };

  const updateQuantity = async (item: CartItem, quantity: number) => {
    if (quantity < 1) return;

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", item.id);

      if (error) throw error;
      setItems((current) =>
        current.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity } : cartItem,
        ),
      );
      notifyCartUpdated();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update cart"));
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

      if (error) throw error;
      setItems((current) => current.filter((item) => item.id !== itemId));
      notifyCartUpdated();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to remove item"));
    }
  };

  const checkout = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user || items.length === 0) return;

    setCheckingOut(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: total,
          phone: shipping.phone,
          shipping_address: shipping.address,
          shipping_city: shipping.city,
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      const orderItems = items
        .filter((item) => item.products)
        .map((item) => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.products!.price,
        }));

      const { error: orderItemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (orderItemsError) throw orderItemsError;

      const { error: clearCartError } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (clearCartError) throw clearCartError;

      setItems([]);
      setShipping({ phone: "", address: "", city: "" });
      notifyCartUpdated();
      toast.success("Checkout created successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to checkout"));
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{t("cart.title")}</h1>
          <p className="text-muted-foreground">
            Review your print order before creating a checkout request.
          </p>
        </motion.div>

        {items.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <FiShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{t("cart.empty")}</h2>
                <p className="mt-2 text-muted-foreground">
                  Add packaging or printing products to start an order.
                </p>
              </div>
              <Button asChild variant="hero">
                <Link to="/products">{t("cart.continueShopping")}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {item.products?.name ?? "Unavailable product"}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.products?.description ?? "This product is no longer available."}
                      </p>
                      <p className="mt-3 font-semibold text-primary">
                        {formatCurrencyIDR(item.products?.price ?? 0)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <FiMinus />
                      </Button>
                      <span className="w-10 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <FiPlus />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle>{t("cart.checkout")}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={checkout} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <span className="text-muted-foreground">{t("cart.total")}</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrencyIDR(total)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">WhatsApp</Label>
                    <Input
                      id="phone"
                      value={shipping.phone}
                      onChange={(event) =>
                        setShipping({ ...shipping, phone: event.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Shipping Address</Label>
                    <Input
                      id="address"
                      value={shipping.address}
                      onChange={(event) =>
                        setShipping({ ...shipping, address: event.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shipping.city}
                      onChange={(event) =>
                        setShipping({ ...shipping, city: event.target.value })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    variant="hero"
                    disabled={checkingOut || total === 0}
                  >
                    {checkingOut ? "Creating checkout..." : t("cart.checkout")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
