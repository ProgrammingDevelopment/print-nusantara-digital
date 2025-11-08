import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ThemeProvider";
import { FiSun, FiMoon, FiCheck, FiX, FiInfo } from "react-icons/fi";

const StyleGuide = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"buttons" | "cards" | "typography" | "colors">("buttons");

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Style Guide</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Koleksi komponen visual dengan dukungan tema light dan dark mode
          </p>
          
          {/* Theme Toggle */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="text-sm text-muted-foreground">Current Theme:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="gap-2"
            >
              {theme === "light" ? (
                <>
                  <FiSun className="h-4 w-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <FiMoon className="h-4 w-4" />
                  Dark Mode
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {["buttons", "cards", "typography", "colors"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab as any)}
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* Buttons Section */}
          {activeTab === "buttons" && (
            <div className="animate-fade-in space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Button Variants</CardTitle>
                  <CardDescription>Semua varian button yang tersedia dengan efek hover</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Default Buttons</h3>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="default">Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link</Button>
                      <Button variant="hero">Hero</Button>
                      <Button variant="accent">Accent</Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Button Sizes</h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                      <Button size="icon"><FiCheck /></Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground">With Icons</h3>
                    <div className="flex flex-wrap gap-3">
                      <Button><FiCheck /> Success</Button>
                      <Button variant="destructive"><FiX /> Cancel</Button>
                      <Button variant="outline"><FiInfo /> Info</Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground">States</h3>
                    <div className="flex flex-wrap gap-3">
                      <Button disabled>Disabled</Button>
                      <Button variant="outline" disabled>Disabled Outline</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Cards Section */}
          {activeTab === "cards" && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover-scale">
                  <CardHeader>
                    <CardTitle>Basic Card</CardTitle>
                    <CardDescription>Card dengan header dan konten dasar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Ini adalah contoh card dengan styling default yang menyesuaikan tema.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-scale border-primary">
                  <CardHeader>
                    <CardTitle className="text-primary">Highlighted Card</CardTitle>
                    <CardDescription>Card dengan border primary</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge>Featured</Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Card ini menggunakan border primary untuk emphasis.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-scale bg-muted">
                  <CardHeader>
                    <CardTitle>Muted Card</CardTitle>
                    <CardDescription>Card dengan background muted</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Card dengan background muted untuk kontras lebih lembut.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Typography Section */}
          {activeTab === "typography" && (
            <div className="animate-fade-in space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Typography Scale</CardTitle>
                  <CardDescription>Hierarki tipografi yang digunakan dalam aplikasi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Heading 1</h1>
                    <code className="text-sm text-muted-foreground">text-4xl font-bold</code>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Heading 2</h2>
                    <code className="text-sm text-muted-foreground">text-3xl font-bold</code>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Heading 3</h3>
                    <code className="text-sm text-muted-foreground">text-2xl font-bold</code>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Heading 4</h4>
                    <code className="text-sm text-muted-foreground">text-xl font-bold</code>
                  </div>
                  <div>
                    <p className="text-base mb-2">Body Text - Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    <code className="text-sm text-muted-foreground">text-base</code>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Small Text - Lorem ipsum dolor sit amet.</p>
                    <code className="text-sm text-muted-foreground">text-sm text-muted-foreground</code>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Colors Section */}
          {activeTab === "colors" && (
            <div className="animate-fade-in space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Color Palette</CardTitle>
                  <CardDescription>Sistem warna yang menyesuaikan dengan tema light/dark</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Primary Colors */}
                  <div>
                    <h3 className="text-sm font-semibold mb-4">Primary Colors</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="h-20 rounded-lg bg-primary shadow-elegant"></div>
                        <p className="text-xs font-medium">Primary</p>
                        <code className="text-xs text-muted-foreground">bg-primary</code>
                      </div>
                      <div className="space-y-2">
                        <div className="h-20 rounded-lg bg-secondary shadow-elegant"></div>
                        <p className="text-xs font-medium">Secondary</p>
                        <code className="text-xs text-muted-foreground">bg-secondary</code>
                      </div>
                      <div className="space-y-2">
                        <div className="h-20 rounded-lg bg-accent shadow-elegant"></div>
                        <p className="text-xs font-medium">Accent</p>
                        <code className="text-xs text-muted-foreground">bg-accent</code>
                      </div>
                      <div className="space-y-2">
                        <div className="h-20 rounded-lg bg-muted shadow-elegant"></div>
                        <p className="text-xs font-medium">Muted</p>
                        <code className="text-xs text-muted-foreground">bg-muted</code>
                      </div>
                    </div>
                  </div>

                  {/* Background Colors */}
                  <div>
                    <h3 className="text-sm font-semibold mb-4">Background & Text</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="h-20 rounded-lg bg-background border border-border shadow-sm"></div>
                        <p className="text-xs font-medium">Background</p>
                        <code className="text-xs text-muted-foreground">bg-background</code>
                      </div>
                      <div className="space-y-2">
                        <div className="h-20 rounded-lg bg-foreground shadow-elegant"></div>
                        <p className="text-xs font-medium">Foreground</p>
                        <code className="text-xs text-muted-foreground">bg-foreground</code>
                      </div>
                      <div className="space-y-2">
                        <div className="h-20 rounded-lg bg-card border border-border shadow-sm"></div>
                        <p className="text-xs font-medium">Card</p>
                        <code className="text-xs text-muted-foreground">bg-card</code>
                      </div>
                    </div>
                  </div>

                  {/* Semantic Colors */}
                  <div>
                    <h3 className="text-sm font-semibold mb-4">Semantic Colors</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="h-20 rounded-lg bg-destructive shadow-elegant"></div>
                        <p className="text-xs font-medium">Destructive</p>
                        <code className="text-xs text-muted-foreground">bg-destructive</code>
                      </div>
                      <div className="space-y-2">
                        <div className="h-20 rounded-lg border border-border shadow-sm"></div>
                        <p className="text-xs font-medium">Border</p>
                        <code className="text-xs text-muted-foreground">border-border</code>
                      </div>
                      <div className="space-y-2">
                        <div className="h-20 rounded-lg border-2 border-ring shadow-sm"></div>
                        <p className="text-xs font-medium">Ring</p>
                        <code className="text-xs text-muted-foreground">border-ring</code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StyleGuide;
