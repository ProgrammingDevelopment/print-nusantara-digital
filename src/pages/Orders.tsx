import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiArchive, FiShoppingCart } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrencyIDR } from "@/lib/format";

type Product = Tables<"products">;
type OrderItem = Tables<"order_items"> & { products: Product | null };
type OrderHistory = Tables<"orders"> & { order_items: OrderItem[] };

export default function Orders() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders((data ?? []) as OrderHistory[]);
    } catch (error) {
      console.error("Failed to load orders", error);
      setOrders([]);
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

    void fetchOrders();
  }, [authLoading, user, navigate, fetchOrders]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">{t("nav.myOrders")}</h1>
          <p className="text-xl text-muted-foreground">
            Review your order history and track your printing requests.
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <FiArchive className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">No orders yet</h2>
                <p className="mt-2 text-muted-foreground">
                  Browse our catalog and submit your first print order.
                </p>
              </div>
              <Button asChild variant="hero">
                <Link to="/products">{t("hero.cta1")}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="border-border/80">
                <CardHeader>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FiShoppingCart className="inline h-5 w-5 text-primary" />
                        Order #{order.id.slice(0, 8)}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {new Date(order.created_at).toLocaleString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </CardDescription>
                    </div>
                    <div className="rounded-2xl px-4 py-2 text-sm font-semibold text-primary bg-primary/10 self-start">
                      {order.status || "Pending"}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-secondary/50 p-4">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="mt-2 text-xl font-semibold text-primary">
                        {formatCurrencyIDR(order.total_amount)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-secondary/50 p-4">
                      <p className="text-sm text-muted-foreground">Shipping</p>
                      <p className="mt-2 text-sm">{order.shipping_address}</p>
                      <p className="text-sm text-muted-foreground mt-1">{order.shipping_city}</p>
                    </div>
                    <div className="rounded-2xl bg-secondary/50 p-4">
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="mt-2 text-sm">{order.phone}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-border p-4 bg-background">
                      <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="grid gap-3 md:grid-cols-[1fr_auto] items-center">
                            <div>
                              <p className="font-semibold">{item.products?.name ?? "Unknown product"}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.products?.description ?? "No description available."}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{item.quantity}x</p>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrencyIDR(item.price)} each
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
