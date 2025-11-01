import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiSun, FiMoon, FiShoppingCart, FiUser, FiLogOut } from "react-icons/fi";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();

  const navLinks = [
    { path: "/", label: t("nav.home") },
    { path: "/about", label: t("nav.about") },
    { path: "/products", label: t("nav.products") },
    { path: "/contact", label: t("nav.contact") },
    { path: "/join-us", label: t("nav.joinUs") },
  ];

  const languages = [
    { code: "id", label: "ID" },
    { code: "en", label: "EN" },
    { code: "zh", label: "中文" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm transition-smooth">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">PT</span>
            </div>
            <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
              PrintThink
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-foreground hover:text-primary transition-smooth font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <div className="hidden sm:flex items-center space-x-1 bg-secondary rounded-lg p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-smooth ${
                    i18n.language === lang.code
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </Button>

            {/* Cart */}
            {user && (
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link to="/cart">
                  <FiShoppingCart />
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
              </Button>
            )}

            {/* Auth Actions */}
            {user ? (
              <Button variant="ghost" size="icon" onClick={signOut} title="Sign Out">
                <FiLogOut />
              </Button>
            ) : (
              <Button variant="default" asChild size="sm">
                <Link to="/auth">
                  <FiUser className="mr-2" />
                  Sign In
                </Link>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-card border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-foreground hover:text-primary transition-smooth font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`px-3 py-2 rounded text-sm font-medium transition-smooth ${
                      i18n.language === lang.code
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
