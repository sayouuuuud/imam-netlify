"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { Users, Phone, Send, Sparkles } from "lucide-react"

export function NewsletterSection() {
  const [whatsapp, setWhatsapp] = useState("")
  const [telegram, setTelegram] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!whatsapp && !telegram) {
      setMessage("يرجى إدخال رقم الواتساب أو معرف التليجرام (أحدهما على الأقل)")
      setStatus("error")
      return
    }
    setStatus("loading")
    setMessage("")
    try {
      const supabase = createClient()
      const { error } = await supabase.from("subscribers").insert({
        whatsapp_number: whatsapp.trim() || null,
        telegram_username: telegram.trim() || null,
        subscribed_at: new Date().toISOString(),
        active: true,
      })
      if (error) {
        if (error.code === "23505") {
          setMessage("هذا الرقم أو المعرف مسجل بالفعل")
        } else {
          console.error("[v0] Subscription error:", error)
          setMessage("حدث خطأ، يرجى المحاولة مرة أخرى")
        }
        setStatus("error")
        return
      }
      setMessage("تم الاشتراك بنجاح! سيتم إضافتك للجروب قريباً")
      setStatus("success")
      setWhatsapp("")
      setTelegram("")
    } catch (err) {
      console.error("[v0] Subscription catch error:", err)
      setMessage("حدث خطأ، يرجى المحاولة مرة أخرى")
      setStatus("error")
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary-hover relative overflow-hidden">
      {/* Animated geometric pattern */}
      <motion.div
        className="absolute inset-0 opacity-10 pointer-events-none"
        animate={{ backgroundPosition: ["0px 0px", "100px 100px"] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='white' stroke-width='1'%3E%3Cpath d='M50 5 L60 30 L85 25 L75 50 L95 65 L70 70 L75 95 L50 80 L25 95 L30 70 L5 65 L25 50 L15 25 L40 30 Z'/%3E%3Ccircle cx='50' cy='50' r='18'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px",
        }}
        aria-hidden="true"
      />

      {/* Floating decorative stars */}
      <motion.div
        className="absolute top-10 right-[10%] text-secondary/40 hidden md:block pointer-events-none"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 360],
        }}
        transition={{
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 30, repeat: Infinity, ease: "linear" },
        }}
        aria-hidden="true"
      >
        <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-16 left-[10%] text-secondary/30 hidden md:block pointer-events-none"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -360],
        }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
          rotate: { duration: 40, repeat: Infinity, ease: "linear" },
        }}
        aria-hidden="true"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z" />
        </svg>
      </motion.div>

      {/* Glowing orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <motion.div
        className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold mb-6 text-white">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          <span>انضم للمجموعة</span>
        </div>

        {/* Title with decorative dividers */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-12 bg-secondary/50 hidden sm:block" />
          <h2 className="text-3xl md:text-5xl font-bold text-white font-serif">ابق على اطلاع</h2>
          <div className="h-px w-12 bg-secondary/50 hidden sm:block" />
        </div>

        <p className="text-white/80 mb-10 max-w-xl mx-auto text-base lg:text-lg leading-relaxed">
          سجل بياناتك لتتم إضافتك لمجموعة الواتساب أو التليجرام وتصلك الدروس والمقالات والخطب الجديدة فور نشرها.
        </p>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
        >
          <p className="text-white/70 text-sm">أدخل رقم الواتساب أو معرف التليجرام (أحدهما فقط كافٍ)</p>

          {/* WhatsApp Input */}
          <div className="relative group">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-secondary transition-colors">
              <Phone className="w-5 h-5" />
            </span>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="رقم الواتساب (مثال: 01012345678)"
              disabled={status === "loading"}
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/20 focus:border-secondary text-white placeholder-white/50 px-4 py-3.5 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 backdrop-blur-sm disabled:opacity-50 transition-all"
              dir="ltr"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 text-white/40 text-xs">
            <span className="flex-1 h-px bg-white/20" />
            <span className="font-bold">أو</span>
            <span className="flex-1 h-px bg-white/20" />
          </div>

          {/* Telegram Input */}
          <div className="relative group">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-secondary transition-colors">
              <Send className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="معرف التليجرام (مثال: @username)"
              disabled={status === "loading"}
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/20 focus:border-secondary text-white placeholder-white/50 px-4 py-3.5 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 backdrop-blur-sm disabled:opacity-50 transition-all"
              dir="ltr"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="relative w-full bg-secondary hover:bg-secondary-hover text-secondary-foreground font-bold px-6 py-4 rounded-xl transition-all duration-300 disabled:opacity-50 group overflow-hidden shadow-lg hover:shadow-xl hover:shadow-secondary/30"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <span className="relative flex items-center justify-center gap-2">
              {status === "loading" ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                    <path d="M12 2 A10 10 0 0 1 22 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  جاري الاشتراك...
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  اشترك الآن
                </>
              )}
            </span>
          </button>

          {message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm font-medium ${status === "success" ? "text-green-200" : "text-red-200"}`}
            >
              {message}
            </motion.p>
          )}
        </form>

        <p className="text-xs text-white/60 mt-6">نحترم خصوصيتك. لن نشارك بياناتك مع أي طرف ثالث.</p>
      </motion.div>
    </section>
  )
}
