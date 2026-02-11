'use client';

import React, { useState, useEffect, useRef } from "react";
import { Share2, User, Mail, MessageSquare, Send } from "lucide-react";
import SocialLinks from "../components/SocialLinks";
import Testimonials from "./Testimonials";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { submitMessage } from "@/lib/public-api";
import { useLanguage } from "@/lib/i18n";

const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  const validateField = (name: string, value: string): string | null => {
    if (name === "email") {
      if (!value.trim()) return "Required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid";
      return null;
    }
    if (!value.trim()) return "Required";
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (touched[name]) {
      const error = validateField(name, value);
      setFormErrors(prev => {
        if (error) return { ...prev, [name]: error };
        const n = { ...prev }; delete n[name]; return n;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFormErrors(prev => {
      if (error) return { ...prev, [name]: error };
      const n = { ...prev }; delete n[name]; return n;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Required";
    if (!formData.email.trim()) errors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid";
    if (!formData.message.trim()) errors.message = "Required";

    const recaptchaToken = recaptchaRef.current?.getValue();
    if (!recaptchaToken) {
      errors.recaptcha = "Required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setIsSubmitting(true);

    Swal.fire({
      title: t('Sending Message...', 'Envoi du message...'),
      html: t('Please wait while we send your message', 'Veuillez patienter pendant l\'envoi de votre message'),
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Save to backend database
      await submitMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        recaptchaToken: recaptchaToken!,
      });

      // Also send via FormSubmit for email notification
      const formSubmitUrl = 'https://formsubmit.co/mariaigs2005@gmail.com';
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('message', formData.message);
      submitData.append('_subject', 'New Message from Portfolio Website');
      submitData.append('_captcha', 'false');
      submitData.append('_template', 'table');

      await axios.post(formSubmitUrl, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).catch(() => {
        // FormSubmit may fail silently - message is already saved to DB
      });

      Swal.fire({
        title: t('Success!', 'Succes !'),
        text: t('Your message has been sent successfully!', 'Votre message a ete envoye avec succes !'),
        icon: 'success',
        confirmButtonColor: '#6366f1',
        timer: 2000,
        timerProgressBar: true
      });

      setFormData({
        name: "",
        email: "",
        message: "",
      });
      setTouched({});
      recaptchaRef.current?.reset();

    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.request && error.request.status === 0) {
        Swal.fire({
          title: t('Success!', 'Succes !'),
          text: t('Your message has been sent successfully!', 'Votre message a ete envoye avec succes !'),
          icon: 'success',
          confirmButtonColor: '#6366f1',
          timer: 2000,
          timerProgressBar: true
        });

        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        Swal.fire({
          title: t('Failed!', 'Echec !'),
          text: t('An error occurred. Please try again later.', 'Une erreur est survenue. Veuillez reessayer plus tard.'),
          icon: 'error',
          confirmButtonColor: '#6366f1'
        });
      }
    } finally {
      setIsSubmitting(false);
      recaptchaRef.current?.reset();
    }
  };

  return (
    <div className="px-[5%] sm:px-[5%] lg:px-[10%] " >
      <div className="text-center lg:mt-[5%] mt-10 mb-4 sm:px-0 px-[5%]">
        <h2
          data-aos="fade-down"
          data-aos-duration="1000"
          className="inline-block text-5xl md:text-6xl lg:text-7xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
        >
          <span
            style={{
              color: "#6366f1",
              backgroundImage:
                "linear-gradient(45deg, #6366f1 10%, #a855f7 93%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("Contact Me", "Contactez-moi")}
          </span>
        </h2>
        <p
          data-aos="fade-up"
          data-aos-duration="1100"
          className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl lg:text-2xl mt-4"
        >
          {t(
            "Have a question? Send me a message, and I'll get back to you soon.",
            "Vous avez une question ? Envoyez-moi un message et je vous repondrai rapidement."
          )}
        </p>
      </div>

      <div
        className="h-auto py-10 flex items-center justify-center 2xl:pr-[3.1%] lg:pr-[3.8%]  md:px-0"
        id="Contact"
      >
        <div className="container px-[1%] grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-[45%_55%] 2xl:grid-cols-[35%_65%] gap-12" >
          <div

            className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-6 py-12 sm:p-12 transform transition-all duration-500 hover:shadow-[#6366f1]/10"
          >
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                  {t("Get in Touch", "Prenez contact")}
                </h2>
                <p className="text-gray-400 text-lg lg:text-xl">
                  {t(
                    "Want to discuss something? Send me a message and let's talk.",
                    "Vous souhaitez discuter ? Envoyez-moi un message et parlons-en."
                  )}
                </p>
              </div>
              <Share2 className="w-12 h-12 text-[#6366f1] opacity-50" />
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6"
            >
              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="relative group"
              >
                <User className="absolute left-5 top-5 w-6 h-6 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder={t("Your Name", "Votre nom")}
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  maxLength={100}
                  className={`w-full p-5 pl-14 text-lg bg-white/10 rounded-xl border ${formErrors.name ? "border-red-500/50" : "border-white/20"} placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 disabled:opacity-50`}
                />
                {formErrors.name && <p className="text-red-400 text-xs mt-1">{t("This field is required", "Ce champ est requis")}</p>}
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="relative group"
              >
                <Mail className="absolute left-5 top-5 w-6 h-6 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder={t("Your Email", "Votre e-mail")}
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  maxLength={254}
                  className={`w-full p-5 pl-14 text-lg bg-white/10 rounded-xl border ${formErrors.email ? "border-red-500/50" : "border-white/20"} placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 disabled:opacity-50`}
                />
                {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email === "Invalid" ? t("Please enter a valid email", "Veuillez entrer un e-mail valide") : t("This field is required", "Ce champ est requis")}</p>}
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="relative group"
              >
                <MessageSquare className="absolute left-5 top-5 w-6 h-6 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                <textarea
                  name="message"
                  placeholder={t("Your Message", "Votre message")}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  maxLength={1000}
                  className={`w-full resize-none p-5 pl-14 text-lg bg-white/10 rounded-xl border ${formErrors.message ? "border-red-500/50" : "border-white/20"} placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 h-[12rem] disabled:opacity-50`}
                />
                {formErrors.message && <p className="text-red-400 text-xs mt-1">{t("This field is required", "Ce champ est requis")}</p>}
              </div>
              <div data-aos="fade-up" data-aos-delay="350">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                  theme="dark"
                  onChange={() => setFormErrors(prev => { const n = { ...prev }; delete n.recaptcha; return n; })}
                />
                {formErrors.recaptcha && <p className="text-red-400 text-xs mt-1">{t("Please complete the reCAPTCHA", "Veuillez completer le reCAPTCHA")}</p>}
              </div>
              <button
                data-aos="fade-up"
                data-aos-delay="400"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white py-5 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6366f1]/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="w-6 h-6" />
                {isSubmitting ? t('Sending...', 'Envoi...') : t('Send Message', 'Envoyer le message')}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-white/10 flex justify-center space-x-6">
              <SocialLinks />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-4 py-4 md:p-12 md:py-10 shadow-2xl transform transition-all duration-500 hover:shadow-[#6366f1]/10">
            <Testimonials />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
