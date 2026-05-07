import Link from "next/link"
import { createPublicClient } from "@/lib/supabase/public"
import { BookOpen, PlayCircle, Eye, Sparkles } from "lucide-react"
import { HeroBookImage } from "./hero-book-image"
import { HeroDecorations } from "./hero-decorations"

interface HeroData {
  hadith_text: string | null
  hadith_translation: string | null
  hadith_explanation: string | null
  hadith_button_text: string | null
  hadith_button_link: string | null
  book_custom_text: string | null
  book_button_text: string | null
  button_link: string | null
  notice_text: string | null
  notice_link: string | null
  notice_active: boolean | null
  important_notice: string | null
  important_notice_link: string | null
  show_important_notice: boolean | null
  featured_book_id: string | null
  underline_text: string | null
}

interface FeaturedBook {
  id: string
  title: string
  cover_image_path: string | null
  author: string | null
}

interface HeroSectionProps {
  data: HeroData | null
}

function parseUnderlinedText(text: string, underlineText: string | null): string {
  if (!underlineText || !underlineText.trim()) return text
  const escaped = underlineText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return text.replace(
    new RegExp(`(${escaped})`, "g"),
    '<span class="relative inline-block"><span class="relative z-10">$1</span><span class="absolute inset-x-0 bottom-1 h-3 bg-secondary/30 -z-0 rounded-sm"></span></span>',
  )
}

export async function HeroSection({ data }: HeroSectionProps) {
  const supabase = createPublicClient()

  let featuredBook: FeaturedBook | null = null
  let bookImageUrl: string | null = null

  if (data?.featured_book_id && data.featured_book_id !== "none") {
    try {
      const { data: bookData, error } = await supabase
        .from("books")
        .select("id, title, cover_image_path, author")
        .eq("id", data.featured_book_id)
        .single()

      if (!error && bookData) {
        featuredBook = bookData
        if (bookData.cover_image_path) {
          if (bookData.cover_image_path.startsWith("uploads/")) {
            bookImageUrl = `https://f005.backblazeb2.com/file/sheikh-sayed-public/${bookData.cover_image_path}`
          } else if (bookData.cover_image_path.startsWith("http")) {
            bookImageUrl = bookData.cover_image_path
          } else {
            bookImageUrl = `https://f005.backblazeb2.com/file/sheikh-sayed-public/${bookData.cover_image_path}`
          }
        }
      }
    } catch (err) {
      console.error("خطأ في جلب الكتاب:", err)
    }
  }

  const heroData = {
    hadith_text: data?.hadith_text || "من سلك طريقاً يلتمس فيه علماً سهل الله له به طريقاً إلى الجنة",
    hadith_translation: data?.hadith_translation || "رواه مسلم",
    hadith_explanation:
      data?.hadith_explanation ||
      "حديث عظيم يبين فضل طلب العلم والسعي في تحصيله، وأن الله يسهل لطالب العلم طريقه إلى الجنة",
    hadith_button_text: data?.hadith_button_text || "اقرأ المزيد",
    hadith_button_link: data?.hadith_button_link || "/articles",
    book_custom_text: data?.book_custom_text || "أحدث إصدارات الشيخ",
    book_button_text: data?.book_button_text || "تصفح الكتب",
    button_link: data?.button_link || "/books",
    notice_text: data?.important_notice || data?.notice_text || null,
    notice_link: data?.important_notice_link || data?.notice_link || null,
    notice_active: data?.show_important_notice ?? data?.notice_active ?? false,
    underline_text: data?.underline_text || null,
  }

  const hadithText = heroData.hadith_text?.trim() || ""

  return (
    <header className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-background via-background to-surface/50">
      {/* Decorative Background Elements */}
      <HeroDecorations />

      {/* Smooth gradient blend overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-surface via-background/30 to-transparent pointer-events-none z-[1]" />

      {/* Notice Marquee */}
      {heroData.notice_active && heroData.notice_text && (
        <div
          className="bg-secondary/10 dark:bg-secondary/20 border-b border-secondary/20 absolute top-0 left-0 right-0 z-20 overflow-hidden h-10 md:h-12 flex items-center"
          dir="ltr"
        >
          <div className="animate-scroll flex">
            <div className="flex items-center gap-12 px-6 shrink-0">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`set1-${i}`} className="flex items-center gap-2 text-center">
                  {heroData.notice_link ? (
                    <Link
                      href={heroData.notice_link}
                      className="text-sm md:text-base font-medium text-foreground hover:underline whitespace-nowrap"
                    >
                      {heroData.notice_text}
                    </Link>
                  ) : (
                    <span className="text-sm md:text-base font-medium text-foreground whitespace-nowrap">
                      {heroData.notice_text}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-12 px-6 shrink-0">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={`set2-${i}`} className="flex items-center gap-2 text-center">
                  {heroData.notice_link ? (
                    <Link
                      href={heroData.notice_link}
                      className="text-sm md:text-base font-medium text-foreground hover:underline whitespace-nowrap"
                    >
                      {heroData.notice_text}
                    </Link>
                  ) : (
                    <span className="text-sm md:text-base font-medium text-foreground whitespace-nowrap">
                      {heroData.notice_text}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={heroData.notice_active && heroData.notice_text ? "pt-12" : ""}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            {/* Content */}
            <div className="flex-1 text-center lg:text-right space-y-6 lg:space-y-8 animate-fade-in">
              {/* Animated Badge with shimmer */}
              <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-secondary/30 shadow-sm relative overflow-hidden group">
                <span className="relative w-2 h-2 rounded-full bg-secondary">
                  <span className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-75"></span>
                </span>
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span className="text-sm text-secondary font-medium">حديث اليوم</span>
                {/* Shimmer effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
              </div>

              {/* Hadith Text with decorative quotes */}
              <div className="relative">
                {/* Opening quote */}
                <span
                  className="absolute -top-4 -right-2 text-6xl text-secondary/30 font-serif select-none pointer-events-none hidden lg:block"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <h1
                  className={`leading-relaxed font-medium text-foreground font-serif w-full ${
                    hadithText.length > 200
                      ? "text-xl sm:text-2xl lg:text-3xl"
                      : hadithText.length > 100
                        ? "text-2xl sm:text-3xl lg:text-4xl"
                        : "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: parseUnderlinedText(hadithText, heroData.underline_text),
                  }}
                />
              </div>

              {/* Description */}
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto lg:mx-0 animate-fade-in-delayed">
                {heroData.hadith_explanation}
              </p>

              {/* Source */}
              <div className="flex items-center justify-center lg:justify-start gap-3 animate-fade-in-delayed-2">
                <div className="h-px w-8 bg-secondary/40" />
                <p className="text-sm text-secondary font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                  </svg>
                  {heroData.hadith_translation}
                </p>
                <div className="h-px w-8 bg-secondary/40" />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in-delayed-3">
                <Link
                  href={heroData.hadith_button_link}
                  className="relative flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3.5 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 text-lg font-medium group overflow-hidden"
                >
                  {/* Shine effect */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <BookOpen className="w-5 h-5 group-hover:scale-110 group-hover:rotate-3 transition-transform" />
                  <span className="relative">{heroData.hadith_button_text}</span>
                </Link>
                <Link
                  href="/dars"
                  className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border text-card-foreground px-8 py-3.5 rounded-xl hover:bg-accent hover:border-secondary/50 transition-all duration-300 shadow-sm hover:shadow-md text-lg font-medium group"
                >
                  <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  استمع للدرس
                </Link>
              </div>
            </div>

            {/* Featured Book - Enhanced with floating effect */}
            <div className="flex-shrink-0 relative group animate-fade-in-delayed-2">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-primary/20 opacity-50 blur-3xl rounded-full transform scale-90 group-hover:scale-110 transition duration-700"></div>

              {/* Decorative corner stars */}
              <div className="absolute -top-6 -right-6 text-secondary/40 animate-bounce-slow z-10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z" />
                </svg>
              </div>
              <div
                className="absolute -bottom-4 -left-4 text-secondary/30 animate-bounce-slow z-10"
                style={{ animationDelay: "1s" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z" />
                </svg>
              </div>

              <div className="relative bg-card/90 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border border-border group-hover:border-secondary/40 transition-all duration-500 group-hover:-translate-y-2">
                {/* Decorative top label */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground text-xs font-bold px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                  ✦ مميّز ✦
                </div>

                {bookImageUrl ? (
                  <HeroBookImage
                    imageUrl={bookImageUrl}
                    title={featuredBook?.title || ""}
                    customText={heroData.book_custom_text}
                  />
                ) : (
                  <div className="relative bg-gradient-to-br from-primary to-primary-hover w-[280px] sm:w-[320px] h-[400px] sm:h-[460px] rounded-xl shadow-inner flex flex-col items-center justify-center text-center p-8 border-[8px] border-primary-hover/50">
                    <div className="absolute inset-4 border border-secondary/30 rounded-lg pointer-events-none"></div>
                    <div className="absolute inset-6 border border-secondary/20 rounded pointer-events-none"></div>

                    <span className="text-secondary text-xs font-medium tracking-widest mb-4 uppercase">
                      {heroData.book_custom_text}
                    </span>
                    <h2 className="text-primary-foreground text-4xl sm:text-5xl font-serif font-bold mb-1">فقه</h2>
                    <h2 className="text-primary-foreground text-4xl sm:text-5xl font-serif font-bold mb-6">السنة</h2>
                    <div className="w-16 h-0.5 bg-secondary mb-6"></div>
                    <p className="text-muted text-sm">دراسة منهجية</p>

                    <div className="absolute left-0 top-4 bottom-4 w-4 bg-gradient-to-r from-black/20 to-transparent rounded-l-lg"></div>
                  </div>
                )}

                {/* View Book Link */}
                <Link
                  href={featuredBook ? `/books/${featuredBook.id}` : heroData.button_link}
                  className="mt-4 flex items-center justify-center gap-2 text-primary dark:text-secondary font-medium cursor-pointer hover:gap-3 py-2 group/link transition-all"
                >
                  <Eye className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
                  <span className="text-sm">{heroData.book_button_text}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
