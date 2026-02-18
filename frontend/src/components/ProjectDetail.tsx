'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, ExternalLink, Github, Code2, Layers, Star,
  ChevronRight, Layout, Globe, Package, Cpu, Code,
} from "lucide-react";
import Swal from 'sweetalert2';
import { useLanguage } from '@/lib/i18n';
import { fetchProject, type Project } from '@/lib/api-client';

const TECH_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  React: Globe,
  Tailwind: Layout,
  Express: Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Code,
  CSS: Code,
  default: Package,
};

const TechBadge = ({ tech }: { tech: string }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];

  return (
    <div className="group relative overflow-hidden px-3.5 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
      <div className="relative flex items-center gap-1.5 md:gap-2">
        <Icon className="w-4 h-4 md:w-4.5 md:h-4.5 text-blue-400 group-hover:text-blue-300 transition-colors" />
        <span className="text-sm md:text-base font-medium text-blue-300/90 group-hover:text-blue-200 transition-colors">
          {tech}
        </span>
      </div>
    </div>
  );
};

const ProjectStats = ({ project, t, featuresCount }: { project: Project; t: (en: string, fr: string) => string; featuresCount: number }) => {
  const techCount = project.technologies?.length || 0;
  const showFeatures = featuresCount > 0;

  return (
    <div className={`grid ${showFeatures ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
      <div className="p-2.5 md:p-3 bg-[#0a0a1a] rounded-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 opacity-50 blur-2xl z-0" />
        <div className="relative z-10 flex items-center space-x-3 bg-white/5 p-2.5 md:p-3 rounded-lg border border-blue-500/20 transition-all duration-300 hover:scale-105 hover:border-blue-500/50 hover:shadow-lg">
          <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 p-2.5 md:p-3 rounded-xl">
            <Code2 className="text-blue-300 w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
          </div>
          <div className="flex-grow">
            <div className="text-xl md:text-2xl font-bold text-white">{techCount}</div>
            <div className="text-xs md:text-sm text-gray-400">{t("Total Technologies", "Technologies totales")}</div>
          </div>
        </div>
      </div>

      {showFeatures && (
        <div className="p-2.5 md:p-3 bg-[#0a0a1a] rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 opacity-50 blur-2xl z-0" />
          <div className="relative z-10 flex items-center space-x-3 bg-white/5 p-2.5 md:p-3 rounded-lg border border-purple-500/20 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 hover:shadow-lg">
            <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 p-2.5 md:p-3 rounded-xl">
              <Layers className="text-purple-300 w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            </div>
            <div className="flex-grow">
              <div className="text-xl md:text-2xl font-bold text-white">{featuresCount}</div>
              <div className="text-xs md:text-sm text-gray-400">{t("Key Features", "Fonctionnalités clés")}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const KeyFeaturesCard = ({ features, t }: { features: string[]; t: (en: string, fr: string) => string }) => {
  if (!features || features.length === 0) return null;

  return (
    <div className="group/features bg-[#0a0a1a] rounded-xl overflow-hidden relative p-4 md:p-5 border border-purple-500/20">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-pink-900/10 opacity-50 blur-2xl z-0" />
      <div className="relative z-10">
        <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 group-hover/features:rotate-12 transition-transform duration-300" />
          {t("Key Features", "Fonctionnalités clés")}
        </h3>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed p-2.5 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] mt-1.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ProjectDetails = () => {
  const { t, l, la } = useLanguage();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState(false);

  const handleGithubClick = (githubLink: string) => {
    if (githubLink === 'Private') {
      Swal.fire({
        icon: 'info',
        title: t('Private Source Code', 'Code source privé'),
        text: t('Sorry, the source code for this project is private.', 'Désolé, le code source de ce projet est privé.'),
        confirmButtonText: t('Understood', 'Compris'),
        confirmButtonColor: '#3085d6',
        background: '#030014',
        color: '#ffffff'
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;

    fetchProject(id)
      .then((res) => setProject(res.data))
      .catch((err) => {
        console.error("Failed to fetch project:", err);
        setError(true);
      });
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-lg md:text-2xl font-bold text-white">{t("Project not found", "Projet introuvable")}</h2>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("Go Back", "Retour")}</span>
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-12 h-12 md:w-16 md:h-16 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <h2 className="text-lg md:text-2xl font-bold text-white">{t("Loading Project...", "Chargement du projet...")}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] px-[3%] md:px-[5%] relative overflow-hidden">
      {/* Background animations */}
      <div className="fixed inset-0">
        <div className="absolute -inset-[10px] opacity-20">
          <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="relative">
        <div className="w-full mx-auto py-8 md:py-16">
          <div className="flex items-center space-x-2 md:space-x-3 mb-8 md:mb-12 animate-fadeIn">
            <button
              onClick={() => router.back()}
              className="group inline-flex items-center space-x-1.5 px-3 md:px-4 py-2 md:py-2.5 bg-white/5 backdrop-blur-xl rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              <span>{t("Back", "Retour")}</span>
            </button>
            <div className="flex items-center space-x-1 md:space-x-1.5 text-sm md:text-base text-white/50">
              <span>{t("Projects", "Projets")}</span>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-white/90 truncate">{l(project.title_en, project.title_fr)}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-10">
            <div className="space-y-6 md:space-y-8 animate-slideInLeft">
              <div className="space-y-4 md:space-y-5">
                <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                  {l(project.title_en, project.title_fr)}
                </h1>
                <div className="relative h-1 w-16 md:w-20">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm" />
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-base md:text-lg text-gray-300/90 leading-relaxed">
                  {l(project.description_en, project.description_fr)}
                </p>
              </div>

              <ProjectStats project={project} t={t} featuresCount={la(project.keyFeatures_en || [], project.keyFeatures_fr || []).length} />

              <div className="flex flex-wrap gap-2 md:gap-3">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center space-x-2 px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600/20 hover:to-purple-600/20 text-blue-300 rounded-xl transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                  >
                    <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-blue-600/10 to-purple-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                    <ExternalLink className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                    <span className="relative font-medium">{t("Live Demo", "Démo en direct")}</span>
                  </a>
                )}

                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center space-x-2 px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20 text-purple-300 rounded-xl transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                    onClick={(e) => !handleGithubClick(project.github) && e.preventDefault()}
                  >
                    <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-purple-600/10 to-pink-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                    <Github className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                    <span className="relative font-medium">Github</span>
                  </a>
                )}
              </div>

              <div className="space-y-3 md:space-y-4">
                <h3 className="text-lg md:text-xl font-semibold text-white/90 mt-[2rem] md:mt-0 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-400" />
                  {t("Technologies Used", "Technologies utilisées")}
                </h3>
                {project.technologies && project.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {project.technologies.map((tech, index) => (
                      <TechBadge key={index} tech={tech} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-gray-400 opacity-50">{t("No technologies added.", "Aucune technologie ajoutée.")}</p>
                )}
              </div>
            </div>

            <div className="space-y-5 md:space-y-6 animate-slideInRight">
              {project.img && (
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src={project.img}
                    alt={l(project.title_en, project.title_fr)}
                    className="w-full object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-300 rounded-2xl" />
                </div>
              )}

              <KeyFeaturesCard features={la(project.keyFeatures_en || [], project.keyFeatures_fr || [])} t={t} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.7s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.7s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetails;
