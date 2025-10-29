import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function JoinUs() {
  const { t } = useTranslation();

  const positions = [
    {
      title: t("joinUs.designer"),
      description: t("joinUs.designerDesc"),
      type: "Full-time",
      location: "Jakarta",
    },
    {
      title: t("joinUs.manager"),
      description: t("joinUs.managerDesc"),
      type: "Full-time",
      location: "Surabaya",
    },
    {
      title: "Sales Executive",
      description: "Drive business growth with our sales team, min. 3 years experience",
      type: "Full-time",
      location: "Bandung",
    },
  ];

  const handleApply = (position: string) => {
    toast.success(`Application started for ${position}!`, {
      description: "Please complete the application form.",
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
          <h1 className="text-5xl font-bold mb-4">{t("joinUs.title")}</h1>
          <p className="text-xl text-muted-foreground">{t("joinUs.subtitle")}</p>
        </motion.div>

        {/* Open Positions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">{t("joinUs.openPositions")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {positions.map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-elegant transition-smooth">
                  <CardHeader>
                    <CardTitle>{position.title}</CardTitle>
                    <CardDescription>{position.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <span className="text-sm font-medium">{position.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <span className="text-sm font-medium">{position.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant="hero"
                      onClick={() => handleApply(position.title)}
                    >
                      {t("joinUs.apply")}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
