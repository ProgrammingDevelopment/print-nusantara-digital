import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiGlobe, FiTrendingUp, FiUsers, FiPackage } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function International() {
  const { t } = useTranslation();

  const regions = [
    {
      name: "Southeast Asia",
      countries: ["Malaysia", "Singapore", "Thailand", "Vietnam"],
      icon: <FiGlobe className="w-8 h-8" />,
    },
    {
      name: "East Asia",
      countries: ["China", "Japan", "South Korea", "Taiwan"],
      icon: <FiTrendingUp className="w-8 h-8" />,
    },
    {
      name: "Middle East",
      countries: ["UAE", "Saudi Arabia", "Qatar"],
      icon: <FiUsers className="w-8 h-8" />,
    },
    {
      name: "Europe",
      countries: ["Netherlands", "Germany", "United Kingdom"],
      icon: <FiPackage className="w-8 h-8" />,
    },
  ];

  const services = [
    {
      title: "Custom Packaging Solutions",
      description: "Tailored soft boxes and food packaging for international brands",
    },
    {
      title: "Laminating Services",
      description: "Professional laminating for documents and marketing materials",
    },
    {
      title: "Sticker & Label Printing",
      description: "High-quality custom stickers and product labels for global markets",
    },
    {
      title: "Bulk Orders",
      description: "Competitive pricing for large-scale international orders",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">Global Expansion</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expanding from Indonesia to serve international markets with premium printing
            and packaging solutions
          </p>
        </motion.div>

        {/* Regional Expansion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Target Regions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regions.map((region, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-elegant transition-smooth">
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                      {region.icon}
                    </div>
                    <CardTitle>{region.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {region.countries.map((country, idx) => (
                        <li key={idx} className="text-muted-foreground flex items-center">
                          <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                          {country}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">International Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="h-full border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-secondary/30 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Partner With Us</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our global network of partners and bring Indonesian quality printing
            solutions to your market
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild variant="default" size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/products">View Products</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
