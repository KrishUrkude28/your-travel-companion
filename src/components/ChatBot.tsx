import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";

import { generateGroqCompletion } from "@/utils/aiClient";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = [
  "Best time to visit Goa?",
  "Budget trip to Manali?",
  "Visa for Bali from India?",
  "Hidden gems in Kerala?",
];

const SYSTEM_PROMPT = `You are TravelSathi — a friendly, expert Indian travel assistant.
Always format your answers in clean, well-structured, easy-to-read Markdown:
- When sharing budgets, comparison rates, or packing lists, use clean GFM Markdown tables with headers (| Column 1 | Column 2 |). Make sure each row is separated by a new line.
- Break responses into clear, labeled sections with emojis (e.g., 📊 Budget Snapshot, 🏞️ Must-Visit Spots, 🍲 Food & Cafés, 💡 Pro Tips, 🚗 How to Reach).
- Use bullet points (- or *) with bold keywords (**Place / Activity**: Description).
- Keep descriptions concise, informative, and easily scannable (1-2 sentences per point).
- Avoid long unbroken paragraphs or dense walls of text.
- Highlight best seasons, estimated budgets, or important travel tips clearly.`;

/**
 * Normalizes markdown text so joined table rows or pipe formatting
 * are converted into proper newline-separated GFM table rows.
 */
function normalizeMarkdown(text: string): string {
  if (!text) return "";
  return text
    .replace(/\|\s*\|\s*/g, "|\n| ")
    .replace(/(^|\n)(\|[^\n]+\|)\s+(\|[^\n]+\|)/g, "$1$2\n$3");
}

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm **TravelSathi AI** 🌏\n\nAsk me anything about travel — destinations, budgets, itineraries, hidden gems, or visa requirements!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading]);

  const sendMessage = async (text?: string) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput("");
    const updatedHistory: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(updatedHistory);
    setLoading(true);

    try {
      const reply = await generateGroqCompletion({
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          ...updatedHistory.map((m) => ({ role: m.role, content: m.content })),
        ],
        temperature: 0.7,
        max_tokens: 800,
      });

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      console.error("ChatBot error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err.message || "Connection issue 😔 Please check your connection or API key and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-elevated flex items-center justify-center transition-shadow hover:shadow-2xl"
        aria-label="Open Travel Assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse ring-2 ring-background" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-36 sm:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] max-h-[75vh] bg-background rounded-2xl shadow-elevated border border-border flex flex-col overflow-hidden backdrop-blur-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm leading-none">TravelSathi AI</p>
                    <Sparkles className="h-3 w-3 text-accent" />
                  </div>
                  <p className="text-[10px] text-white/80 flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                    Online · Powered by AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-primary-foreground/90 transition-colors"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      msg.role === "assistant"
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-accent/15 text-accent border border-accent/20"
                    }`}
                  >
                    {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div
                    className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl leading-relaxed text-sm ${
                      msg.role === "assistant"
                        ? "bg-muted/70 text-foreground border border-border/60 rounded-tl-none shadow-sm"
                        : "bg-primary text-primary-foreground rounded-tr-none shadow-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="space-y-2 text-xs sm:text-sm">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => (
                              <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                            ),
                            h1: ({ children }) => (
                              <h1 className="font-bold text-sm sm:text-base mt-2 mb-1 text-foreground border-b border-border/50 pb-1">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="font-bold text-xs sm:text-sm mt-2 mb-1 text-foreground">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="font-semibold text-xs sm:text-sm mt-2 mb-1 text-foreground">
                                {children}
                              </h3>
                            ),
                            ul: ({ children }) => (
                              <ul className="my-1.5 list-disc pl-4 space-y-1.5 text-foreground/90">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="my-1.5 list-decimal pl-4 space-y-1.5 text-foreground/90">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="leading-snug">{children}</li>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-foreground underline-offset-2">
                                {children}
                              </strong>
                            ),
                            hr: () => <hr className="my-2 border-border/60" />,
                            table: ({ children }) => (
                              <div className="overflow-x-auto my-2.5 rounded-xl border border-border/70 shadow-sm bg-background/60">
                                <table className="w-full text-left text-xs border-collapse divide-y divide-border/60">
                                  {children}
                                </table>
                              </div>
                            ),
                            thead: ({ children }) => (
                              <thead className="bg-primary/10 text-foreground font-semibold">
                                {children}
                              </thead>
                            ),
                            tbody: ({ children }) => (
                              <tbody className="divide-y divide-border/40 text-muted-foreground">
                                {children}
                              </tbody>
                            ),
                            tr: ({ children }) => (
                              <tr className="hover:bg-accent/5 transition-colors">
                                {children}
                              </tr>
                            ),
                            th: ({ children }) => (
                              <th className="px-3 py-2 font-semibold text-foreground text-xs whitespace-nowrap">
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className="px-3 py-2 text-xs leading-snug">
                                {children}
                              </td>
                            ),
                            code: ({ children }) => (
                              <code className="bg-background/80 px-1 py-0.5 rounded text-[11px] font-mono text-primary">
                                {children}
                              </code>
                            ),
                          }}
                        >
                          {normalizeMarkdown(msg.content)}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    )}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted/70 border border-border/60 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggested questions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/30 transition-all font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2 p-3 border-t border-border/80 bg-background/50 shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Ask anything about travel..."
                className="flex-1 bg-muted/70 rounded-xl px-3.5 py-2 text-sm outline-none text-foreground placeholder:text-muted-foreground border border-transparent focus:border-primary/40 transition-colors"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                size="sm"
                className="rounded-xl px-3.5 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;

