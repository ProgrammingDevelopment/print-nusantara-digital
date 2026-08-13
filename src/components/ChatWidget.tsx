import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING: ChatMessage = {
  role: "assistant",
  content: "Halo! Saya asisten Elka Grafika. Ada yang bisa saya bantu soal kebutuhan cetak Anda?",
};

export const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("chat", {
        body: { messages: next.map(({ role, content }) => ({ role, content })) },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setMessages([...next, { role: "assistant", content: data.reply || "..." }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengirim pesan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-border bg-card shadow-elegant flex flex-col overflow-hidden"
            role="dialog"
            aria-label="Chat asisten Elka Grafika"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="font-semibold text-foreground text-sm">Asisten Elka Grafika</p>
                <p className="text-xs text-muted-foreground">Biasanya membalas seketika</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)} aria-label="Tutup chat">
                <FiX className="h-4 w-4" />
              </Button>
            </div>

            <div ref={scrollRef} className="h-80 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    message.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {loading && (
                <div className="bg-secondary text-muted-foreground rounded-xl px-3 py-2 text-sm w-fit">
                  Mengetik…
                </div>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <div className="border-t border-border p-3 flex items-end gap-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder="Tulis pesan…"
                rows={1}
                className="min-h-[40px] max-h-28 resize-none"
              />
              <Button size="icon" onClick={() => void send()} disabled={loading || !input.trim()} aria-label="Kirim pesan">
                <FiSend className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Tutup chat" : "Buka chat"}
        className="fixed bottom-6 left-4 z-50 h-14 w-14 rounded-full shadow-elegant"
      >
        {open ? <FiX className="h-6 w-6" /> : <FiMessageCircle className="h-6 w-6" />}
      </Button>
    </>
  );
};
