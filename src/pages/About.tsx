import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  const { t } = useTranslation();

  const team = [
    { name: "Bernadus Leomitro", role: "CEO", avatar: "👨‍💼" },
    { name: "Ahmad", role: "Design Lead", avatar: "👨‍🎨" },
    { name: "Via", role: "Staff Design", avatar: "👩‍🎨" },
    { name: "Nur", role: "Quality Control", avatar: "👩‍🔬" },
    { name: "Ira", role: "Staff Quality Control", avatar: "👩‍🔬" },
    { name: "Opet", role: "Staff Quality Control", avatar: "👨‍🔬" },
    { name: "Yani", role: "Admin", avatar: "👩‍💼" },
    { name: "Fitri", role: "Accounting", avatar: "👩‍💻" },
    { name: "Mina", role: "PIC Office", avatar: "👨‍💼" },
    { name: "Siman", role: "PIC Office", avatar: "👨‍💼" },
    { name: "Amir", role: "PIC Office", avatar: "👨‍💼" },
    { name: "Adit", role: "PIC Produksi", avatar: "👨‍🏭" },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">{t("about.title")}</h1>
          <p className="text-xl text-muted-foreground">{t("about.subtitle")}</p>
        </motion.div>

        {/* History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-3xl">{t("about.history")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("about.historyText")}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vision Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="text-3xl">{t("about.vision")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("about.visionText")}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">{t("about.team")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="text-center hover:shadow-elegant transition-smooth">
                  <CardHeader>
                    <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4 text-5xl">
                      {member.avatar}
                    </div>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
