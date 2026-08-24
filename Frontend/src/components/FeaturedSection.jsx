import { motion as Motion } from "framer-motion";
import { TrendingUp, Music, Mic2 } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Trending Hits",
    description: "Discover the hottest tracks taking over the charts right now.",
    gradient: "from-brand-500 to-accent-500",
    iconBg: "from-brand-500/20 to-brand-600/20",
  },
  {
    icon: Music,
    title: "Mood Playlists",
    description: "Curated collections for every emotion and moment in your day.",
    gradient: "from-pink-500 to-amber-500",
    iconBg: "from-pink-500/20 to-amber-500/20",
  },
  {
    icon: Mic2,
    title: "Artist Spotlight",
    description: "Deep dives into your favorite artists and their musical journeys.",
    gradient: "from-violet-500 to-rose-500",
    iconBg: "from-violet-500/20 to-rose-500/20",
  },
];

const FeatureCard = ({ icon, title, description, gradient, iconBg, index }) => {
  const Icon = icon;
  return (
    <Motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl bg-surface-900/60 backdrop-blur-xl border border-surface-700/50 p-8 hover:border-surface-600/50 hover:shadow-2xl hover:shadow-brand-500/5 transition-all duration-300"
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${iconBg} border border-white/5 mb-6`}>
        <Icon className="w-6 h-6 text-brand-400" />
      </div>

      <h3 className="font-display text-xl font-semibold text-text-primary mb-3">
        {title}
      </h3>

      <p className="text-text-secondary text-sm leading-relaxed mb-6">
        {description}
      </p>

      <div className={`h-0.5 w-12 rounded-full bg-gradient-to-r ${gradient} group-hover:w-full transition-all duration-500`} />
    </Motion.article>
  );
};

const FeaturedSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Featured{" "}
            <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
              Experiences
            </span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Explore curated music experiences designed to elevate your listening journey
          </p>
        </Motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
