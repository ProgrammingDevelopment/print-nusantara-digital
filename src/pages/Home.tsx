import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FiPackage, FiUsers, FiAward, FiCheckCircle } from "react-icons/fi";
import heroImage from "@/assets/hero-printing.jpg";
import productsImage from "@/assets/products-showcase.jpg";

export default function Home() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <FiPackage className="w-8 h-8" />,
      title: t("features.inHouse.title"),
      desc: t("features.inHouse.desc"),
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: t("features.expert.title"),
      desc: t("features.expert.desc"),
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: t("features.quality.title"),
      desc: t("features.quality.desc"),
    },
    {
      icon: <FiCheckCircle className="w-8 h-8" />,
      title: t("features.sustainability.title"),
      desc: t("features.sustainability.desc"),
    },
  ];

  const testimonials = [
    { brand: "TikTok", logo: "TT" },
    { brand: "Lazada", logo: "LZ" },
    { brand: "Shopee", logo: "SP" },
    { brand: "Tokopedia", logo: "TP" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            >
              {t("hero.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-8"
            >
              {t("hero.subtitle")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Button asChild variant="hero" size="lg">
                <Link to="/products">{t("hero.cta1")}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">{t("hero.cta2")}</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">{t("features.title")}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-elegant transition-smooth border-border/50">
                  <CardHeader>
                    <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mb-4 text-primary-foreground">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.desc}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6">{t("products.title")}</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Custom printing solutions for every business need. From soft boxes to food packaging,
                we deliver quality that speaks for your brand.
              </p>
              <Button asChild variant="hero">
                <Link to="/products">{t("hero.cta1")}</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl overflow-hidden shadow-elegant"
            >
              <img
                src={productsImage}
                alt="Products showcase"
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">{t("testimonials.title")}</h2>
          </motion.div>

          <div className="flex flex-wrap justify-center items-center gap-8">
            {testimonials.map((client, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="w-32 h-32 bg-card rounded-xl shadow-elegant flex items-center justify-center hover:shadow-glow transition-smooth"
              >
                <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                  {client.logo}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
