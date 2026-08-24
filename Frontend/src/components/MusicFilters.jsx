import ScrollRow from "./ScrollRow";

const languages = ["All", "Telugu", "Hindi", "Tamil", "Kannada", "Malayalam", "Punjabi"];
const categories = ["All", "Trending", "Love", "Romantic", "Melody", "Party", "Workout", "Chill"];

export default function MusicFilters({ activeLanguage, activeCategory, onLanguageChange, onCategoryChange }) {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5C6370] mb-2 px-1">
          Language
        </p>
        <ScrollRow>
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                activeLanguage === lang
                  ? "bg-[#5FD0B3] text-[#080A0F]"
                  : "bg-[#15171E] text-[#9CA3AF] border border-white/[0.06] hover:border-white/[0.12] hover:text-white"
              }`}
            >
              {lang}
            </button>
          ))}
        </ScrollRow>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5C6370] mb-2 px-1">
          Category
        </p>
        <ScrollRow>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#5FD0B3] text-[#080A0F]"
                  : "bg-[#15171E] text-[#9CA3AF] border border-white/[0.06] hover:border-white/[0.12] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </ScrollRow>
      </div>
    </div>
  );
}
