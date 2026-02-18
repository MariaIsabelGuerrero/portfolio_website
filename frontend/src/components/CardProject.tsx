'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  const { t } = useLanguage();

  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      e.preventDefault();
      alert(t("Live demo link is not available", "Le lien de la démo en direct n'est pas disponible"));
    }
  };

  const handleDetails = (e) => {
    if (!id) {
      e.preventDefault();
      alert(t("Project details are not available", "Les détails du projet ne sont pas disponibles"));
    }
  };


  return (
    <div className="group relative w-full">

      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-purple-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>

        <div className="relative p-4 z-10">
          <div className="relative overflow-hidden rounded-lg aspect-[16/10]">
            <img
              src={Img}
              alt={Title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="mt-3 space-y-2">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {Title}
            </h3>

            <p className="text-gray-300/80 text-xs leading-relaxed line-clamp-2">
              {Description}
            </p>

            <div className="pt-2 flex items-center justify-between">
              {ProjectLink ? (
                <a
                href={ProjectLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLiveDemo}
                  className="inline-flex items-center space-x-1.5 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  <span className="text-sm font-medium">{t("Live Demo", "Démo en direct")}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-gray-500 text-xs">{t("Demo Not Available", "Démo non disponible")}</span>
              )}

              {id ? (
                <Link
                  href={`/project/${id}`}
                  onClick={handleDetails}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <span className="text-sm font-medium">{t("Details", "Détails")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="text-gray-500 text-xs">{t("Details Not Available", "Détails non disponibles")}</span>
              )}
            </div>
          </div>

          <div className="absolute inset-0 border border-white/0 group-hover:border-purple-500/50 rounded-xl transition-colors duration-300 -z-50"></div>
        </div>
      </div>
    </div>
  );
};

export default CardProject;
