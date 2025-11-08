import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FiCheck, FiX } from "react-icons/fi";

const BrandGuidelines = () => {
  const colorPalette = [
    { name: "Primary", hsl: "222.2 47.4% 11.2%", usage: "Main brand color, primary actions" },
    { name: "Secondary", hsl: "210 40% 96.1%", usage: "Secondary actions, backgrounds" },
    { name: "Accent", hsl: "210 40% 96.1%", usage: "Highlights, call-to-actions" },
    { name: "Muted", hsl: "210 40% 96.1%", usage: "Subtle backgrounds, disabled states" },
  ];

  const typographyRules = [
    { element: "H1 - Page Title", style: "text-4xl font-bold", usage: "Main page headings" },
    { element: "H2 - Section Title", style: "text-3xl font-bold", usage: "Section headings" },
    { element: "H3 - Subsection", style: "text-2xl font-bold", usage: "Subsection headings" },
    { element: "Body Text", style: "text-base", usage: "Main content text" },
    { element: "Small Text", style: "text-sm", usage: "Captions, helper text" },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Brand Guidelines</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Panduan lengkap untuk penggunaan logo, color palette, dan typography CV Elka Grafika
          </p>
        </div>

        <div className="space-y-12">
          {/* Logo Usage */}
          <section className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-6">Logo Usage</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Logo */}
              <Card>
                <CardHeader>
                  <CardTitle>Primary Logo</CardTitle>
                  <CardDescription>Logo utama untuk penggunaan umum</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-background border-2 border-border rounded-lg p-8 flex items-center justify-center min-h-[150px]">
                    <span className="text-3xl font-bold text-foreground">Elka Grafika</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheck className="text-green-500" />
                    <span className="text-sm text-muted-foreground">Gunakan pada background terang atau gelap</span>
                  </div>
                </CardContent>
              </Card>

              {/* Logo on Dark */}
              <Card>
                <CardHeader>
                  <CardTitle>Logo on Dark Background</CardTitle>
                  <CardDescription>Versi untuk background gelap</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-foreground rounded-lg p-8 flex items-center justify-center min-h-[150px]">
                    <span className="text-3xl font-bold text-background">Elka Grafika</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheck className="text-green-500" />
                    <span className="text-sm text-muted-foreground">Otomatis menyesuaikan dengan tema</span>
                  </div>
                </CardContent>
              </Card>

              {/* Logo Don'ts */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Logo Don'ts</CardTitle>
                  <CardDescription>Hindari penggunaan yang salah</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="bg-muted rounded-lg p-6 flex items-center justify-center min-h-[100px] opacity-50">
                        <span className="text-xl font-bold text-foreground transform scale-x-150">Elka Grafika</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiX className="text-red-500" />
                        <span className="text-sm text-muted-foreground">Jangan distorsi proporsi</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-muted rounded-lg p-6 flex items-center justify-center min-h-[100px] opacity-50">
                        <span className="text-xl font-bold text-foreground transform rotate-12">Elka Grafika</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiX className="text-red-500" />
                        <span className="text-sm text-muted-foreground">Jangan rotasi logo</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 flex items-center justify-center min-h-[100px] opacity-50">
                        <span className="text-xl font-bold text-white">Elka Grafika</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiX className="text-red-500" />
                        <span className="text-sm text-muted-foreground">Jangan ubah warna</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Color Palette */}
          <section className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-6">Color Palette</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Brand Colors</CardTitle>
                <CardDescription>Warna utama yang digunakan dalam identitas brand</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {colorPalette.map((color, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div 
                          className={`w-20 h-20 rounded-lg shadow-elegant ${
                            color.name === "Primary" ? "bg-primary" :
                            color.name === "Secondary" ? "bg-secondary" :
                            color.name === "Accent" ? "bg-accent" :
                            "bg-muted"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{color.name}</h3>
                          <code className="text-sm text-muted-foreground">{color.hsl}</code>
                          <p className="text-sm text-muted-foreground mt-1">{color.usage}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Color Usage Guidelines</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Gunakan Primary untuk actions utama dan emphasis</li>
                    <li>• Secondary untuk backgrounds dan supporting elements</li>
                    <li>• Accent untuk highlights dan call-to-actions</li>
                    <li>• Muted untuk subtle backgrounds dan disabled states</li>
                    <li>• Semua warna otomatis menyesuaikan dengan tema light/dark</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Typography */}
          <section className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-6">Typography Rules</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Typography Scale</CardTitle>
                <CardDescription>Hierarki tipografi untuk konsistensi visual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {typographyRules.map((rule, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-0">
                      <div className="flex items-baseline justify-between mb-2">
                        <h3 className="font-semibold">{rule.element}</h3>
                        <Badge variant="secondary">{rule.style}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rule.usage}</p>
                      <div className={rule.style}>Sample Text</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Typography Guidelines</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Font Family: System Default (Inter, SF Pro, Segoe UI)</li>
                    <li>• Gunakan font-bold untuk headings (700 weight)</li>
                    <li>• Gunakan font-medium untuk emphasis (500 weight)</li>
                    <li>• Body text menggunakan font-normal (400 weight)</li>
                    <li>• Maintain proper spacing dan hierarchy</li>
                    <li>• Pastikan contrast ratio memenuhi WCAG AA standards</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Spacing & Layout */}
          <section className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-6">Spacing & Layout</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Spacing System</CardTitle>
                <CardDescription>Konsistensi spacing untuk layout yang harmonis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { size: "2", value: "8px" },
                      { size: "4", value: "16px" },
                      { size: "6", value: "24px" },
                      { size: "8", value: "32px" },
                    ].map((space) => (
                      <div key={space.size} className="space-y-2">
                        <div className={`h-12 bg-primary rounded`} style={{ width: space.value }}></div>
                        <p className="text-xs font-medium">space-{space.size}</p>
                        <code className="text-xs text-muted-foreground">{space.value}</code>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Layout Guidelines</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Container max-width: 1400px (container class)</li>
                      <li>• Consistent padding: 2rem pada container</li>
                      <li>• Grid gaps: 4-6 untuk cards, 2-3 untuk inline elements</li>
                      <li>• Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BrandGuidelines;
