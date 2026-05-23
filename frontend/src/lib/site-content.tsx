"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import {
  getProfile,
  getContact,
  type ProfileData,
  type ContactData,
} from "@/lib/public-api";

const emptyProfile: ProfileData = {
  id: "default",
  fullName: "",
  shortName: "",
  siteUrl: "",
  profileImage: "",
  heroBadge_en: "",
  heroBadge_fr: "",
  heroTitleLine1_en: "",
  heroTitleLine1_fr: "",
  heroTitleLine2_en: "",
  heroTitleLine2_fr: "",
  heroDescription_en: "",
  heroDescription_fr: "",
  typingWords_en: [],
  typingWords_fr: [],
  techStack: [],
  bio_en: "",
  bio_fr: "",
  quote_en: "",
  quote_fr: "",
  experienceSince: null,
  metaTitle: "",
  metaDescription: "",
};

const emptyContact: ContactData = {
  email: "",
  phone: "",
  location: "",
  github: "",
  linkedin: "",
};

interface SiteContentContextType {
  profile: ProfileData;
  contact: ContactData;
  loading: boolean;
}

const SiteContentContext = createContext<SiteContentContextType>({
  profile: emptyProfile,
  contact: emptyContact,
  loading: true,
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [contact, setContact] = useState<ContactData>(emptyContact);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([getProfile(), getContact()]).then(
      ([profileRes, contactRes]) => {
        if (cancelled) return;
        if (profileRes.status === "fulfilled") {
          setProfile({ ...emptyProfile, ...profileRes.value.data });
        }
        if (contactRes.status === "fulfilled") {
          setContact({ ...emptyContact, ...contactRes.value.data });
        }
        setLoading(false);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ profile, contact, loading }),
    [profile, contact, loading]
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}

export function useProfile() {
  return useContext(SiteContentContext).profile;
}

export function useContact() {
  return useContext(SiteContentContext).contact;
}
