import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Compass, Globe } from 'lucide-react';
import { websiteInfo } from '../data/website/info';
import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../data/colors/theme';

// Import language files statically
import enAbout from '../data/text/en/about.json';
import zhAbout from '../data/text/zh/about.json';
import jaAbout from '../data/text/ja/about.json';
import esAbout from '../data/text/es/about.json';

// Create a language map
const languageMap = {
  en: enAbout,
  zh: zhAbout,
  ja: jaAbout,
  es: esAbout,
};

interface AboutContent {
  title: string;
  subtitle: string;
  content: string[];
  sections: {
    title: string;
    content: string;
  }[];
}

const AboutUs: React.FC = () => {
  const { currentLanguage } = useLanguage();

  // Get page content directly, default to English
  const pageContent = languageMap[currentLanguage.code as keyof typeof languageMap] || languageMap.en;

  // Section icons
  const sectionIcons = [
    <Users size={30} className="text-[${colors.primaryColor1}]" />,
    <BookOpen size={30} className="text-[${colors.primaryColor1}]" />,
    <Compass size={30} className="text-[${colors.primaryColor1}]" />,
    <Globe size={30} className="text-[${colors.primaryColor1}]" />,
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.backgroundLight }}>
      {/* Hero Section */}
      <section 
        className="relative min-h-[50vh] flex items-center justify-center px-6 py-20 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/archaeology-excavation-bg.jpg')`
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="text-center max-w-5xl mx-auto"
        >
          <h1
            className="text-4xl md:text-6xl font-extrabold text-white mb-5 tracking-tight font-serif"
            style={{ textShadow: '2px 2px 10px rgba(0, 0, 0, 0.9)' }}
            aria-label={pageContent.title.replace('{websiteName}', websiteInfo.name)}
          >
            {pageContent.title.replace('{websiteName}', websiteInfo.name)}
          </h1>
          <p
            className="text-lg md:text-xl text-gray-100 font-medium max-w-3xl mx-auto"
            style={{ textShadow: '1px 1px 5px rgba(0, 0, 0, 0.7)' }}
          >
            {pageContent.subtitle.replace('{websiteName}', websiteInfo.name)}
          </p>
        </motion.div>
      </section>

      {/* About Sections - Excavation Layered Style */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-16 border relative"
            style={{ 
              borderColor: colors.primaryColor1,
              backgroundImage: `url('/images/sand-texture.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.85)'
            }}
          >
            {pageContent.content.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="text-base mb-5 leading-relaxed"
                style={{ color: colors.textSecondary }}
              >
                {paragraph.replace('{websiteName}', websiteInfo.name)}
              </motion.p>
            ))}
          </motion.div>
          <div className="space-y-16">
            {pageContent.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                className="relative bg-white rounded-2xl shadow-xl p-8 border"
                style={{ 
                  borderColor: colors.primaryColor1,
                  backgroundImage: `url('/images/sand-texture.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  transform: `translateX(${index % 2 === 0 ? '-10px' : '10px'})`
                }}
              >
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[${colors.primaryColor1}] rounded-full p-3 shadow-md">
                  {sectionIcons[index]}
                </div>
                <h3 className="text-xl font-semibold font-serif mt-8 mb-4 text-center" style={{ color: colors.textPrimary }}>
                  {section.title.replace('{websiteName}', websiteInfo.name)}
                </h3>
                <p className="text-sm leading-relaxed text-center" style={{ color: colors.textSecondary }}>
                  {section.content.replace('{websiteName}', websiteInfo.name)}
                </p>
              </motion.div>
            ))}
          </div>
          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 bg-white rounded-2xl shadow-xl p-8 border relative"
            style={{ 
              borderColor: colors.primaryColor1,
              backgroundImage: `url('/images/sand-texture.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.85)'
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-base md:text-lg font-medium text-center" style={{ color: colors.textPrimary }}>
                {currentLanguage.code === 'ja'
                  ? 'のコミュニティに参加して、歴史と考古学の世界を一緒に探求しましょう。'
                  : currentLanguage.code === 'zh'
                  ? '加入 社区，与我们一起探索历史与考古的世界。'
                  : `Join the ${websiteInfo.name} community to explore the world of history and archaeology together.`}
              </p>
     
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;