import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Youtube, Linkedin, ChevronRight } from 'lucide-react';
import { websiteInfo } from '../../data/website/info';
import { colors } from '../../data/colors/theme';
import { useLanguage } from '../../contexts/LanguageContext';

// Import partner logos (replace with your actual image paths)


// Import all language files statically
import enFooter from './en/footer.json';
import jaFooter from './ja/footer.json';
import zhFooter from './zh/footer.json';
import esFooter from './es/footer.json';

// Create a language map
const languageMap = {
  en: enFooter,
  ja: jaFooter,
  zh: zhFooter,
  es: esFooter
};

const Footer: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { primaryColor1, primaryColor2, textPrimary, textSecondary, accent } = colors;

  // Get page content directly from languageMap, default to English if not found
  const pageContent = languageMap[currentLanguage.code as keyof typeof languageMap] || languageMap.en;

  // Memoize social links to avoid recomputing on every render
  const socialLinks = useMemo(() => {
    return pageContent.social.links.map(social => ({
      ...social,
      icon: (
        social.name === 'Facebook' ? <Facebook size={20} /> :
        social.name === 'Twitter' ? <Twitter size={20} /> :
        social.name === 'Youtube' ? <Youtube size={20} /> :
        social.name === 'LinkedIn' ? <Linkedin size={20} /> : null
      ),
      link: social.link === 'd' ? websiteInfo[social.name.toLowerCase() as keyof typeof websiteInfo] || '#' : social.link
    }));
  }, [pageContent]);

  // Partner images data
  const partners = [
    { img: "https://assets.tdar.org/images/logos/Mellon.png", alt: "Partner 1" },
    { img: "https://assets.tdar.org/images/logos/aia.png", alt: "Partner 2" },
    { img: "https://assets.tdar.org/images/logos/neh_logo_stckd.jpg", alt: "Partner 3" },
    { img: "https://assets.tdar.org/images/logos/asu_veritcal.png", alt: "Partner 4" }
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
      style={{ backgroundColor: colors.backgroundLight  ,borderColor : "red" }}
    >

      <div className="max-w-7xl mx-auto border-[4px] border-red-600 px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src={websiteInfo.logo} 
                alt={websiteInfo.name} 
                className="h-10 mr-2"
              />
              <h2 className="text-2xl font-bold" style={{ color: textPrimary }}>
                {websiteInfo.name}
              </h2>
            </div>
            <p className="text-sm" style={{ color: textSecondary }}>
              {websiteInfo.slogan}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-opacity-20 hover:bg-black transition-colors"
                  style={{ color: textPrimary }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {pageContent.sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: textPrimary }}>
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.path} 
                      className="flex items-center text-sm hover:underline transition-colors group"
                      style={{ color: textSecondary }}
                    >
                      <ChevronRight size={14} className="mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trusted Partners Section */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-center mb-6 uppercase tracking-wider" style={{ color: textPrimary }}>
            Trusted By Industry Leaders
          </h4>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {partners.map((partner, index) => (
              <img 
                key={index} 
                src={partner.img} 
                alt={partner.alt} 
                className="h-12 object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>

        {/* Copyright and Legal Links */}
        <div className="border-t pt-8" style={{ borderColor: accent }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs mb-4 md:mb-0" style={{ color: textSecondary }}>
              {pageContent.copyright.text} {new Date().getFullYear()} {websiteInfo.name}. All Rights Reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/privacy" 
                className="text-xs hover:underline transition-colors"
                style={{ color: textSecondary }}
              >
                {pageContent.copyright.privacy}
              </Link>
              <Link 
                to="/cookies" 
                className="text-xs hover:underline transition-colors"
                style={{ color: textSecondary }}
              >
                {pageContent.copyright.cookies}
              </Link>
              <Link 
                to="/terms" 
                className="text-xs hover:underline transition-colors"
                style={{ color: textSecondary }}
              >
                {pageContent.copyright.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;