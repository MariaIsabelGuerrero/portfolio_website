'use client';

import { useEffect, useMemo } from "react";
import {
  Linkedin,
  Github,
  ExternalLink,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useLanguage } from "@/lib/i18n";
import { useContact, useProfile } from "@/lib/site-content";

const SocialLinks = () => {
  const { t } = useLanguage();
  const contact = useContact();
  const profile = useProfile();

  const githubHandle = useMemo(() => {
    if (!contact.github) return "";
    try {
      const url = new URL(contact.github);
      const handle = url.pathname.split("/").filter(Boolean)[0];
      return handle ? `@${handle}` : "";
    } catch {
      return "";
    }
  }, [contact.github]);

  const shortName = profile.shortName || profile.fullName.split(" ")[0] || "";

  const socialLinks = useMemo(
    () =>
      [
        contact.linkedin && {
          name: "LinkedIn",
          displayName: t("Let's Connect", "Connectons-nous"),
          subText: t("on LinkedIn", "sur LinkedIn"),
          icon: Linkedin,
          url: contact.linkedin,
          color: "#0A66C2",
          gradient: "from-[#0A66C2] to-[#0077B5]",
        },
        contact.github && {
          name: "GitHub",
          displayName: "Github",
          subText: githubHandle || (shortName ? `@${shortName}` : ""),
          icon: Github,
          url: contact.github,
          color: "#ffffff",
          gradient: "from-[#333] to-[#24292e]",
        },
      ].filter(Boolean) as Array<{
        name: string;
        displayName: string;
        subText: string;
        icon: typeof Linkedin;
        url: string;
        color: string;
        gradient: string;
      }>,
    [contact.linkedin, contact.github, githubHandle, shortName, t]
  );

  useEffect(() => {
    AOS.init({
      offset: 10,
    });
  }, []);

  if (socialLinks.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 py-8 backdrop-blur-xl">
      <h3
        className="text-xl font-semibold text-white mb-6 flex items-center gap-2"
        data-aos="fade-down"
      >
        <span className="inline-block w-8 h-1 bg-indigo-500 rounded-full"></span>
        {t("Connect With Me", "Restons en contact")}
      </h3>

      <div className="flex flex-col gap-4">
        {socialLinks.map((link, index) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between p-4 rounded-lg
                       bg-white/5 border border-white/10 overflow-hidden
                       hover:border-white/20 transition-all duration-500"
            data-aos="fade-up"
            data-aos-delay={100 + index * 100}
          >
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                         bg-gradient-to-r ${link.gradient}`}
            />

            <div className="relative flex items-center gap-4">
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute inset-0 opacity-20 rounded-md transition-all duration-500
                                 group-hover:scale-110 group-hover:opacity-30"
                  style={{ backgroundColor: link.color }}
                />
                <div className="relative p-2 rounded-md">
                  <link.icon
                    className="w-6 h-6 transition-all duration-500 group-hover:scale-105"
                    style={{ color: link.color }}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-lg font-bold pt-[0.2rem] text-gray-200 tracking-tight leading-none group-hover:text-white transition-colors duration-300">
                  {link.displayName}
                </span>
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {link.subText}
                </span>
              </div>
            </div>

            <ExternalLink
              className="relative w-5 h-5 text-gray-500 group-hover:text-white
                         opacity-0 group-hover:opacity-100 transition-all duration-300
                         transform group-hover:translate-x-0 -translate-x-1"
            />

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                                 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;
