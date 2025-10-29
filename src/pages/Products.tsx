import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FiShoppingCart } from "react-icons/fi";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  image: string;
}

export default function Products() {
  const { t } = useTranslation();
  const [category, setCategory] = useState("all");
  const [quantity, setQuantity] = useState(100);
  const [size, setSize] = useState("medium");

  const products: Product[] = [
    {
      id: 1,
      name: "Premium Soft Box",
      category: "softBox",
      price: 50000,
      description: "High-quality soft boxes for retail packaging",
      stock: 150,
      image: "📦",
    },
    {
      id: 2,
      name: "Food Box Classic",
      category: "foodBox",
      price: 35000,
      description: "Eco-friendly food packaging boxes",
      stock: 200,
      image: "🍱",
    },
    {
      id: 3,
      name: "Custom Soft Box",
      category: "softBox",
      price: 75000,
      description: "Fully customizable soft boxes with premium finish",
      stock: 80,
      image: "🎁",
    },
    {
      id: 4,
      name: "Food Box Premium",
      category: "foodBox",
      price: 45000,
      description: "Premium food boxes with custom branding",
      stock: 120,
      image: "🍔",
    },
  ];

  const filteredProducts = category === "all" 
    ? products 
    : products.filter(p => p.category === category);

  const calculatePrice = () => {
    const basePrice = 1000;
    const sizeMultiplier = size === "small" ? 0.8 : size === "medium" ? 1 : 1.3;
    return Math.round(basePrice * quantity * sizeMultiplier);
  };

  const handleAddToCart = (product: Product) => {
    toast.success(`${product.name} added to cart!`, {
      description: `IDR ${product.price.toLocaleString('id-ID')}`,
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">{t("products.title")}</h1>
        </motion.div>

        {/* Calculator Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="border-primary/20 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl">{t("products.calculator")}</CardTitle>
              <CardDescription>Get instant price estimates for your custom orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="quantity">{t("products.quantity")}</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">{t("products.size")}</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("products.estimate")}</Label>
                  <div className="h-10 flex items-center">
                    <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                      IDR {calculatePrice().toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 flex items-center gap-4"
        >
          <Label>{t("products.category")}:</Label>
          <div className="flex gap-2">
            <Button
              variant={category === "all" ? "default" : "outline"}
              onClick={() => setCategory("all")}
            >
              {t("products.all")}
            </Button>
            <Button
              variant={category === "softBox" ? "default" : "outline"}
              onClick={() => setCategory("softBox")}
            >
              {t("products.softBox")}
            </Button>
            <Button
              variant={category === "foodBox" ? "default" : "outline"}
              onClick={() => setCategory("foodBox")}
            >
              {t("products.foodBox")}
            </Button>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-elegant transition-smooth">
                <CardHeader>
                  <div className="w-full h-48 bg-secondary/50 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-6xl">{product.image}</span>
                  </div>
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
                  >
                    <FiShoppingCart className="mr-2" />
                    {t("products.addToCart")}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
