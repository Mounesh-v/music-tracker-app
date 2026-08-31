import { useState } from "react";
import {
  ArrowLeft,
  HelpCircle,
  User,
  Music,
  Library,
  Download,
  Search,
  Play,
  Heart,
  Pause,
  AlertTriangle,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  {
    icon: User,
    title: "Account",
    items: [
      {
        q: "How do I create an account?",
        a: "Tap the Sign Up button on the login screen, enter your name, email address, and a secure password, then follow the on-screen instructions to complete registration.",
      },
      {
        q: "I can't log in to my account.",
        a: "Verify that your email and password are correct. If you've forgotten your password, use the password reset option on the login page. If the issue persists, contact our support team.",
      },
      {
        q: "How do I update my profile information?",
        a: "Navigate to the Profile page and tap Edit Profile. From there you can update your name, bio, and profile image.",
      },
      {
        q: "How do I change my password?",
        a: "Go to Profile, open account settings, and select Change Password. You will need to enter your current password before setting a new one.",
      },
    ],
  },
  {
    icon: Music,
    title: "Music & Playback",
    items: [
      {
        q: "How do I search for a song?",
        a: "Tap the Search icon in the navigation bar and enter the song name, artist, or album. Results will appear as you type.",
      },
      {
        q: "How do I play and pause music?",
        a: "Tap any song to start playback. Use the play/pause button in the music player at the bottom of the screen to control playback.",
      },
      {
        q: "How do I use the music player?",
        a: "Tap the mini player bar at the bottom to open the full player. From there you can seek, adjust volume, toggle shuffle and repeat, skip forward or go back.",
      },
      {
        q: "Why is a song not playing?",
        a: "This may be due to network connectivity issues or the song's preview URL being unavailable. Check your internet connection and try a different song.",
      },
      {
        q: "Why is audio buffering?",
        a: "Buffering usually occurs due to a slow or unstable internet connection. Try switching to a faster network or lowering the audio quality if available.",
      },
    ],
  },
  {
    icon: Library,
    title: "Library",
    items: [
      {
        q: "How do I like a song?",
        a: "Tap the heart icon on any song in the player, search results, or song list to add it to your Liked Songs.",
      },
      {
        q: "How do I access my liked songs?",
        a: "Go to Your Library and tap the Liked Songs playlist, or navigate to the Playlists tab in the library.",
      },
      {
        q: "How do I manage my library?",
        a: "Use the Library tabs (Liked Songs, Playlists) to browse and manage your collection. Tap any item to view its details.",
      },
    ],
  },
  {
    icon: Download,
    title: "Downloads",
    items: [
      {
        q: "How do I download songs?",
        a: "Tap the download icon on any song to save it for offline listening. Downloaded songs will appear in the Downloads section of your library.",
      },
      {
        q: "Why can't I download a song?",
        a: "Download availability depends on licensing and the source of the audio. Some songs may not support offline download.",
      },
    ],
  },
];

const FAQ = [
  {
    q: "How do I search for a song?",
    a: "Use the Search tab in the navigation bar. You can search by song name, artist, or album title.",
  },
  {
    q: "How do I add a song to Liked Songs?",
    a: "Tap the heart icon on any song. The icon will fill with color to confirm the song has been added to your Liked Songs.",
  },
  {
    q: "Why is a song not playing?",
    a: "Check your internet connection. If the issue persists, the song's audio source may be temporarily unavailable. Try playing a different song.",
  },
  {
    q: "Why is audio buffering?",
    a: "Buffering is typically caused by a slow or unstable connection. Try moving to a stronger Wi-Fi or mobile data signal.",
  },
  {
    q: "How can I update my profile?",
    a: "Go to the Profile page and tap Edit Profile to update your name, bio, and profile image.",
  },
  {
    q: "How can I report an issue?",
    a: "Contact our support team at support@vibetune.app with a description of the issue and any relevant screenshots.",
  },
];

function AccordionItem({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.04] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors text-left"
      >
        <span className="text-sm font-medium text-white">{item.q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[#5C6370] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#5C6370] flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-3.5">
          <p className="text-sm text-[#9CA3AF] leading-relaxed">{item.a}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpSupport() {
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
          <HelpCircle className="w-4 h-4 text-[#5FD0B3]" />
        </div>
        <h1 className="font-display text-xl font-bold text-white">
          Help & Support
        </h1>
      </div>

      {/* Content */}
      <div className="px-4 max-w-3xl mx-auto">
        {/* Categories */}
        <div className="space-y-5 mb-8">
          {CATEGORIES.map((category) => (
            <div key={category.title}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#5FD0B3]/15 flex items-center justify-center flex-shrink-0">
                  <category.icon className="w-4 h-4 text-[#5FD0B3]" />
                </div>
                <h2 className="text-sm font-display font-bold text-white">
                  {category.title}
                </h2>
              </div>
              <div
                className="rounded-2xl border border-white/[0.06] overflow-hidden"
                style={{ background: "#11131A" }}
              >
                {category.items.map((item) => (
                  <AccordionItem key={item.q} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#5FD0B3]/15 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-[#5FD0B3]" />
            </div>
            <h2 className="text-sm font-display font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div
            className="rounded-2xl border border-white/[0.06] overflow-hidden"
            style={{ background: "#11131A" }}
          >
            {FAQ.map((item) => (
              <AccordionItem key={item.q} item={item} />
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#5FD0B3]/15 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-[#5FD0B3]" />
            </div>
            <h2 className="text-sm font-display font-bold text-white">
              Contact Support
            </h2>
          </div>
          <div
            className="rounded-2xl border border-white/[0.06] p-5"
            style={{ background: "#11131A" }}
          >
            <p className="text-sm text-[#9CA3AF] leading-relaxed mb-4">
              Can&apos;t find what you&apos;re looking for? Our support team is
              here to help.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1A2129] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#5C6370]" />
                </div>
                <div>
                  <p className="text-xs text-[#5C6370]">Email</p>
                  <p className="text-sm text-white">mouneshv696@gmail.com</p>
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                window.open(
                  "https://mail.google.com/mail/?view=cm&fs=1&to=mouneshv696@gmail.com&su=Music%20App%20Support",
                  "_blank",
                )
              }
              className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold border border-[#5FD0B3]/30 text-[#5FD0B3] hover:bg-[#5FD0B3]/10 transition-all"
            >
              Send us an email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
