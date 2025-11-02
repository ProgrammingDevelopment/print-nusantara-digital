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
    { path: "/international", label: "International" },
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
          <Link to="/" className="flex items-center">
            <span className="text-xl md:text-2xl font-bold text-foreground hover:text-primary transition-smooth">
              Elka Grafika
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-foreground hover:text-primary transition-smooth font-medium text-sm xl:text-base whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 md:space-x-3">
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
              className="h-9 w-9"
            >
              {theme === "light" ? <FiMoon className="h-4 w-4" /> : <FiSun className="h-4 w-4" />}
            </Button>

            {/* Cart */}
            {user && (
              <Button variant="ghost" size="icon" className="relative h-9 w-9" asChild>
                <Link to="/cart">
                  <FiShoppingCart className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
              </Button>
            )}

            {/* Auth Actions */}
            {user ? (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={signOut} 
                title="Sign Out"
                className="h-9 w-9"
              >
                <FiLogOut className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="default" asChild size="sm" className="hidden sm:flex">
                <Link to="/auth">
                  <FiUser className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
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
            className="lg:hidden overflow-hidden bg-card border-t border-border"
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
              
              {/* Mobile Auth Button */}
              {!user && (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-foreground hover:text-primary transition-smooth font-medium sm:hidden"
                >
                  Sign In
                </Link>
              )}
              
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
