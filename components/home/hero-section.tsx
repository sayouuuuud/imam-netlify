import Link from "next/link"
import Image from "next/image"
import { createPublicClient } from "@/lib/supabase/public"
import { BookOpen, PlayCircle, Eye } from "lucide-react"

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
  // Escape special regex characters in underlineText
  const escaped = underlineText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return text.replace(
    new RegExp(`(${escaped})`, "g"),
    '<span class="underline decoration-secondary decoration-2 underline-offset-4">$1</span>',
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
            bookImageUrl = `/api/download?key=${encodeURIComponent(bookData.cover_image_path)}`
          } else {
            bookImageUrl = bookData.cover_image_path
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
    <header className="relative overflow-hidden py-16 lg:py-24 bg-background">
      {/* Smooth gradient blend overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-48 from-surface via-background/30 to-transparent pointer-events-none" />

      {heroData.notice_active && heroData.notice_text && (
        <div className="bg-secondary/10 dark:bg-secondary/20 border-b border-secondary/20 absolute top-0 left-0 right-0 z-20 overflow-hidden h-10 md:h-12 flex items-center" dir="ltr">
          {/* dir="ltr" is essential here for the negative translate animation to work correctly in RTL document */}
          <div className="animate-scroll flex">
            {/* First Set of Content */}
            <div className="flex items-center gap-12 px-6 shrink-0">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`set1-${i}`} className="flex items-center gap-2 text-center">
                  {/* Emoji Removed */}
                  {heroData.notice_link ? (
                    <Link
                      href={heroData.notice_link}
                      className="text-sm md:text-base font-medium text-foreground hover:underline whitespace-nowrap"
                    >
                      {heroData.notice_text}
                    </Link>
                  ) : (
                    <span className="text-sm md:text-base font-medium text-foreground whitespace-nowrap">{heroData.notice_text}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Second Set of Content (Duplicate for Seamless Loop) */}
            <div className="flex items-center gap-12 px-6 shrink-0">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={`set2-${i}`} className="flex items-center gap-2 text-center">
                  {/* Emoji Removed */}
                  {heroData.notice_link ? (
                    <Link
                      href={heroData.notice_link}
                      className="text-sm md:text-base font-medium text-foreground hover:underline whitespace-nowrap"
                    >
                      {heroData.notice_text}
                    </Link>
                  ) : (
                    <span className="text-sm md:text-base font-medium text-foreground whitespace-nowrap">{heroData.notice_text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={heroData.notice_active && heroData.notice_text ? "pt-12" : ""}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-8 lg:gap-12">
            {/* Hadith Content - Right Side on Desktop */}
            <div className="flex-1 text-right space-y-6 lg:space-y-8">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight font-serif font-bold text-foreground"
                dangerouslySetInnerHTML={{
                  __html: parseUnderlinedText(hadithText, heroData.underline_text),
                }}
              />

              {/* Source - from database */}
              <p className="text-sm sm:text-base text-secondary font-medium">
                {heroData.hadith_translation}
              </p>
            </div>

            {/* Featured Book - Left Side on Desktop */}
            <div className="flex-shrink-0 relative group w-full lg:w-auto flex justify-center lg:justify-start">
              <div className="relative">
                {bookImageUrl ? (
                  <div className="relative w-[260px] sm:w-[280px] h-[380px] sm:h-[400px] rounded-2xl overflow-hidden bg-muted shadow-lg">
                    <Image
                      src={bookImageUrl}
                      alt={featuredBook?.title || ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 260px, 280px"
                      priority
                      crossOrigin="anonymous"
                    />
                  </div>
                ) : (
                  <div className="relative bg-gradient-to-br from-primary to-primary-hover w-[260px] sm:w-[280px] h-[380px] sm:h-[400px] rounded-2xl shadow-lg flex flex-col items-center justify-center text-center p-6">
                    <span className="text-secondary text-xs font-medium tracking-widest mb-4 uppercase">
                      {heroData.book_custom_text}
                    </span>
                    <h2 className="text-primary-foreground text-4xl font-serif font-bold mb-1">فقه</h2>
                    <h2 className="text-primary-foreground text-4xl font-serif font-bold mb-4">السنة</h2>
                    <div className="w-12 h-0.5 bg-secondary mb-4"></div>
                    <p className="text-muted text-xs">دراسة منهجية</p>
                  </div>
                )}

                {/* View Book Link */}
                <Link
                  href={featuredBook ? `/books/${featuredBook.id}` : heroData.button_link}
                  className="mt-4 flex items-center justify-center gap-2 text-primary dark:text-secondary font-medium cursor-pointer hover:underline py-2 group/link text-sm"
                >
                  <Eye className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
                  <span>{heroData.book_button_text}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

