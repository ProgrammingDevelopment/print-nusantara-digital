const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `Kamu adalah asisten virtual CV Elka Grafika, perusahaan percetakan offset & digital di Indonesia (Jakarta, Tangerang, Sunter).
Layanan: soft box, food box, kemasan custom, cetak offset & digital untuk UMKM dan brand.
Jawab singkat, ramah, dan profesional. Gunakan bahasa yang sama dengan pengguna (Indonesia/English/中文).
Untuk permintaan harga, minta detail: jenis produk, ukuran, bahan, dan jumlah, lalu arahkan ke halaman /contact untuk penawaran resmi.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("MISTRAL_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "MISTRAL_API_KEY belum dikonfigurasi" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages harus berupa array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const trimmed = messages
      .filter((m: { role?: string; content?: string }) => m && typeof m.content === "string")
      .slice(-20)
      .map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content.slice(0, 4000),
      }));

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-medium-latest",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...trimmed],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Mistral error", response.status, detail);
      const message =
        response.status === 429
          ? "Terlalu banyak permintaan, coba lagi sebentar lagi."
          : response.status === 401
            ? "API key Mistral tidak valid."
            : "Layanan chat sedang bermasalah.";
      return new Response(JSON.stringify({ error: message }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("chat function error", error);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan tak terduga." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
