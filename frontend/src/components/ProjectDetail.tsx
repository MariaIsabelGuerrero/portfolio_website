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
    <div className="group relative overflow-hidden px-5 py-3 md:px-6 md:py-3.5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
      <div className="relative flex items-center gap-2 md:gap-2.5">
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
        <span className="text-base md:text-lg font-medium text-blue-300/90 group-hover:text-blue-200 transition-colors">
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
    <div className={`grid ${showFeatures ? 'grid-cols-2' : 'grid-cols-1'} gap-3 md:gap-4`}>
      <div className="p-3 md:p-4 bg-[#0a0a1a] rounded-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 opacity-50 blur-2xl z-0" />
        <div className="relative z-10 flex items-center space-x-3 md:space-x-4 bg-white/5 p-3 md:p-4 rounded-lg border border-blue-500/20 transition-all duration-300 hover:scale-105 hover:border-blue-500/50 hover:shadow-lg">
          <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 p-3 md:p-4 rounded-xl">
            <Code2 className="text-blue-300 w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
          </div>
          <div className="flex-grow">
            <div className="text-2xl md:text-4xl font-bold text-white">{techCount}</div>
            <div className="text-sm md:text-base text-gray-400">{t("Total Technologies", "Technologies totales")}</div>
          </div>
        </div>
      </div>

      {showFeatures && (
        <div className="p-3 md:p-4 bg-[#0a0a1a] rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 opacity-50 blur-2xl z-0" />
          <div className="relative z-10 flex items-center space-x-3 md:space-x-4 bg-white/5 p-3 md:p-4 rounded-lg border border-purple-500/20 transition-all duration-300 hover:scale-105 hover:border-purple-500/50 hover:shadow-lg">
            <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 p-3 md:p-4 rounded-xl">
              <Layers className="text-purple-300 w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
            </div>
            <div className="flex-grow">
              <div className="text-2xl md:text-4xl font-bold text-white">{featuresCount}</div>
              <div className="text-sm md:text-base text-gray-400">{t("Key Features", "Fonctionnalités clés")}</div>
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
    <div className="group/features bg-[#0a0a1a] rounded-xl overflow-hidden relative p-5 md:p-6 border border-purple-500/20">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-pink-900/10 opacity-50 blur-2xl z-0" />
      <div className="relative z-10">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-5 flex items-center gap-3">
          <Star className="w-6 h-6 md:w-7 md:h-7 text-yellow-400 group-hover/features:rotate-12 transition-transform duration-300" />
          {t("Key Features", "Fonctionnalités clés")}
        </h3>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-300 text-lg md:text-xl leading-relaxed p-3 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300">
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] mt-2 flex-shrink-0" />
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
        <div className="text-center space-y-6">
          <h2 className="text-xl md:text-3xl font-bold text-white">{t("Project not found", "Projet introuvable")}</h2>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white/5 backdrop-blur-xl rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
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
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-white">{t("Loading Project...", "Chargement du projet...")}</h2>
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
          <div className="flex items-center space-x-2 md:space-x-4 mb-10 md:mb-16 animate-fadeIn">
            <button
              onClick={() => router.back()}
              className="group inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-6 py-2.5 md:py-3 bg-white/5 backdrop-blur-xl rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 text-xl md:text-2xl"
            >
              <ArrowLeft className="w-6 h-6 md:w-7 md:h-7 group-hover:-translate-x-1 transition-transform" />
              <span>{t("Back", "Retour")}</span>
            </button>
            <div className="flex items-center space-x-1 md:space-x-2 text-xl md:text-2xl text-white/50">
              <span>{t("Projects", "Projets")}</span>
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
              <span className="text-white/90 truncate">{l(project.title_en, project.title_fr)}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
            <div className="space-y-8 md:space-y-12 animate-slideInLeft">
              <div className="space-y-6 md:space-y-8">
                <h1 className="text-5xl md:text-8xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                  {l(project.title_en, project.title_fr)}
                </h1>
                <div className="relative h-1 w-20 md:w-28">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm" />
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-2xl md:text-4xl text-gray-300/90 leading-relaxed">
                  {l(project.description_en, project.description_fr)}
                </p>
              </div>

              <ProjectStats project={project} t={t} featuresCount={la(project.keyFeatures_en || [], project.keyFeatures_fr || []).length} />

              <div className="flex flex-wrap gap-3 md:gap-4">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center space-x-2.5 md:space-x-3 px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600/20 hover:to-purple-600/20 text-blue-300 rounded-xl transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 backdrop-blur-xl overflow-hidden text-xl md:text-2xl"
                  >
                    <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-blue-600/10 to-purple-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                    <ExternalLink className="relative w-7 h-7 md:w-8 md:h-8 group-hover:rotate-12 transition-transform" />
                    <span className="relative font-medium">{t("Live Demo", "Démo en direct")}</span>
                  </a>
                )}

                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center space-x-2.5 md:space-x-3 px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20 text-purple-300 rounded-xl transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40 backdrop-blur-xl overflow-hidden text-xl md:text-2xl"
                    onClick={(e) => !handleGithubClick(project.github) && e.preventDefault()}
                  >
                    <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-purple-600/10 to-pink-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                    <Github className="relative w-7 h-7 md:w-8 md:h-8 group-hover:rotate-12 transition-transform" />
                    <span className="relative font-medium">Github</span>
                  </a>
                )}
              </div>

              <div className="space-y-4 md:space-y-6">
                <h3 className="text-2xl md:text-3xl font-semibold text-white/90 mt-[3rem] md:mt-0 flex items-center gap-2 md:gap-3">
                  <Code2 className="w-6 h-6 md:w-7 md:h-7 text-blue-400" />
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

            <div className="space-y-6 md:space-y-10 animate-slideInRight">
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
