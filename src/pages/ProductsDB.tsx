import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiPackage, FiShoppingCart } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PRODUCT_CATEGORIES, isHttpImageUrl } from "@/constants/products";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { CART_UPDATED_EVENT } from "@/hooks/useCartSummary";
import { buildQueryString, fetchJson } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { formatCurrencyIDR } from "@/lib/format";

type Product = Tables<"products">;

export default function ProductsDB() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryString = buildQueryString({
          category,
          limit: 24,
          offset: 0,
        });
        const response = await fetchJson<Product[]>(`/api/products${queryString}`, {
          signal: controller.signal,
        });

        setProducts(response.data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        toast.error(getErrorMessage(error, "Failed to load products"));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => controller.abort();
  }, [category]);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/auth");
      return;
    }

    try {
      const { data: existingItem, error: existingItemError } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .maybeSingle();

      if (existingItemError) throw existingItemError;

      if (existingItem) {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
        });

        if (error) throw error;
      }

      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add to cart"));
    }
  };

  if (loading) {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("products.title")}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex items-center gap-3 justify-center flex-wrap"
        >
          {PRODUCT_CATEGORIES.map((productCategory) => (
            <Button
              key={productCategory.value}
              variant={category === productCategory.value ? "secondary" : "ghost"}
              onClick={() => setCategory(productCategory.value)}
            >
              {t(productCategory.labelKey)}
            </Button>
          ))}
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-elegant transition-smooth">
                  <CardHeader>
                    {isHttpImageUrl(product.image_url) ? (
                      <div className="w-full h-48 bg-secondary/50 rounded-lg overflow-hidden mb-4">
                        <img
                          src={product.image_url ?? ""}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-secondary/50 rounded-lg flex items-center justify-center mb-4">
                        <FiPackage className="h-16 w-16 text-primary" />
                      </div>
                    )}
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="text-xl font-bold text-primary">
                          {formatCurrencyIDR(product.price)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Stock:</span>
                        <span className={product.stock > 50 ? "text-accent" : "text-destructive"}>
                          {product.stock} units
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <FiShoppingCart className="mr-2" />
                      {product.stock === 0 ? "Out of Stock" : t("products.addToCart")}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
