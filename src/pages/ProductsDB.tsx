import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { FiShoppingCart } from "react-icons/fi";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

export default function ProductsDB() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/auth");
      return;
    }

    try {
      // Check if item already in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .maybeSingle();

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id);

        if (error) throw error;
      } else {
        // Add new item
        const { error } = await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity: 1,
          });

        if (error) throw error;
      }

      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
      toast.error("Failed to add to cart");
    }
  };

  const filteredProducts = category === "all" 
    ? products 
    : products.filter(p => p.category === category);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
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
          <h1 className="text-5xl font-bold mb-4">{t("products.title")}</h1>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex items-center gap-4 justify-center flex-wrap"
        >
          <Button
            variant={category === "all" ? "default" : "outline"}
            onClick={() => setCategory("all")}
          >
            All Products
          </Button>
          <Button
            variant={category === "softBox" ? "default" : "outline"}
            onClick={() => setCategory("softBox")}
          >
            Soft Boxes
          </Button>
          <Button
            variant={category === "foodBox" ? "default" : "outline"}
            onClick={() => setCategory("foodBox")}
          >
            Food Boxes
          </Button>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-elegant transition-smooth">
                  <CardHeader>
                    {product.image_url ? (
                      <div className="w-full h-48 bg-secondary/50 rounded-lg overflow-hidden mb-4">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-secondary/50 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-6xl">📦</span>
                      </div>
                    )}
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
                          IDR {product.price.toLocaleString('id-ID')}
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
                      variant="default"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <FiShoppingCart className="mr-2" />
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
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
