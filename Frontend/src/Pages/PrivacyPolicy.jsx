import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SECTIONS = [
  {
    title: "Introduction",
    content:
      "Welcome to VibeTune. This Privacy Policy describes how we collect, use, and protect your personal information when you use our application. By accessing or using VibeTune, you agree to the practices described in this policy.",
  },
  {
    title: "Information We Collect",
    content:
      "We collect information that you provide directly to us, including your name, email address, and profile image when you create an account. We also collect usage data such as liked songs, playback history, and interaction patterns within the application to personalize your experience.",
  },
  {
    title: "How We Use Information",
    content:
      "We use the information we collect to operate and improve the application, personalize your music experience, manage your account, communicate with you about updates or support matters, and ensure the security and integrity of our services.",
  },
  {
    title: "Authentication and Account Data",
    content:
      "VibeTune uses secure authentication mechanisms to protect your account. Your password is encrypted and never stored in plain text. Account data such as your name, email, and profile image are stored securely and are used solely for providing and improving the application experience.",
  },
  {
    title: "Cookies and Local Storage",
    content:
      "VibeTune uses browser local storage to maintain your session, persist playback state, and remember your preferences. This data is stored locally on your device and is not transmitted to third parties. You may clear this data at any time through your browser settings.",
  },
  {
    title: "Third-Party Services",
    content:
      "VibeTune integrates with publicly available music data services and third-party APIs for music discovery, metadata, and related functionality. These third-party services have their own privacy policies, and we encourage you to review them. We do not control and are not responsible for the practices of these third-party services.",
  },
  {
    title: "Data Security",
    content:
      "We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee absolute security of your data.",
  },
  {
    title: "User Rights",
    content:
      "You have the right to access, update, or delete your personal information at any time. You can manage your profile information through the application settings. To request account deletion or data removal, please contact our support team.",
  },
  {
    title: "Changes to This Privacy Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy within the application. Your continued use of VibeTune after any changes constitutes acceptance of the updated policy.",
  },
  {
    title: "Contact and Support",
    content:
      "If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at support@vibetune.app.",
  },
];

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-40">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-xl text-[#9CA3AF] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-lg bg-[#5FD0B3]/15 flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-[#5FD0B3]" />
        </div>
        <h1 className="font-display text-xl font-bold text-white">Privacy Policy</h1>
      </div>

      {/* Content */}
      <div className="px-4 max-w-3xl mx-auto">
        {/* Disclaimer Banner */}
        <div
          className="rounded-2xl p-4 mb-6 border border-[#5FD0B3]/20"
          style={{
            background: "linear-gradient(135deg, rgba(95,208,179,0.08), rgba(58,158,133,0.04))",
          }}
        >
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            This application is an independent project created for educational and portfolio
            purposes. It is not affiliated with, endorsed by, sponsored by, or officially
            connected with JioSaavn or any of its parent companies or partners.
          </p>
        </div>

        <p className="text-xs text-[#5C6370] mb-6">Last updated: August 2026</p>

        <div className="space-y-6">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-display font-bold text-white mb-2">
                {section.title}
              </h2>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Intellectual Property Notice */}
        <div className="mt-8 pt-6 border-t border-white/[0.06]">
          <h2 className="text-sm font-display font-bold text-white mb-2">
            Intellectual Property
          </h2>
          <p className="text-sm text-[#9CA3AF] leading-relaxed">
            VibeTune does not claim ownership of any music, artists, albums, audio content,
            artwork, or other third-party intellectual property displayed within the application.
            All music-related content and metadata are sourced through publicly available or
            third-party services. The application respects applicable third-party terms, policies,
            copyrights, and intellectual property rights.
          </p>
        </div>

        {/* Additional Notice */}
        <div className="mt-6 pt-6 border-t border-white/[0.06]">
          <p className="text-xs text-[#5C6370] leading-relaxed">
            This application uses publicly available or third-party music data and services
            through backend integration for music discovery and related functionality. The
            application does not store or claim ownership of the entire music catalog. User data
            stored in MongoDB is limited to account information and application-specific preferences
            such as liked songs.
          </p>
        </div>
      </div>
    </div>
  );
}
