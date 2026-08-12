import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalAlert } from "@/components/ModalAlert";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";

type ProfileRecord = Tables<"profiles">;

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Partial<ProfileRecord>>({
    full_name: "",
    phone: "",
    address: "",
    city: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ open: false, title: "", message: "" });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }

    void fetchProfile();
  }, [authLoading, user, navigate]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone, address, city")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      setProfile(data ?? {});
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load profile");
      setAlert({ open: true, title: "Error", message });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
        })
        .eq("id", user.id);

      if (error) throw error;
      setAlert({ open: true, title: "Saved", message: "Your profile was updated successfully." });
    } catch (error) {
      setAlert({
        open: true,
        title: "Unable to update profile",
        message: getErrorMessage(error, "Failed to save profile"),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("profile.title")}</h1>
          <p className="text-muted-foreground">{t("profile.subtitle")}</p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>{t("profile.details")}</CardTitle>
            <CardDescription>{t("profile.updateDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">{t("profile.fullName")}</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name ?? ""}
                    onChange={(event) => setProfile({ ...profile, full_name: event.target.value })}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("profile.phone")}</Label>
                  <Input
                    id="phone"
                    value={profile.phone ?? ""}
                    onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{t("profile.address")}</Label>
                <Input
                  id="address"
                  value={profile.address ?? ""}
                  onChange={(event) => setProfile({ ...profile, address: event.target.value })}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">{t("profile.city")}</Label>
                <Input
                  id="city"
                  value={profile.city ?? ""}
                  onChange={(event) => setProfile({ ...profile, city: event.target.value })}
                  disabled={loading}
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="hero" disabled={saving || loading}>
                  {saving ? t("profile.saving") : t("profile.save")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <ModalAlert
        open={alert.open}
        title={alert.title}
        description={alert.message}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </div>
  );
}
