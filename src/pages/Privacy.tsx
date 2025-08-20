import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, Globe } from 'lucide-react';
import { websiteInfo } from '../data/website/info';
import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../data/colors/theme';

// Import language files statically
import enPrivacy from '../data/text/en/privacy.json';
import zhPrivacy from '../data/text/zh/privacy.json';
import jaPrivacy from '../data/text/ja/privacy.json';
import esPrivacy from '../data/text/es/privacy.json';

// Create a language map
const languageMap = {
  en: enPrivacy,
  zh: zhPrivacy,
  ja: jaPrivacy,
  es: esPrivacy,
};

interface PrivacyContent {
  title: string;
  subtitle: string;
  content: string[];
  sections: {
    title: string;
    content: string;
  }[];
}

const Privacy: React.FC = () => {
  const { currentLanguage } = useLanguage();

  // Get page content directly, default to English
  const pageContent = languageMap[currentLanguage.code as keyof typeof languageMap] || languageMap.en;

  // Section icons
  const sectionIcons = [
    <Shield size={30} className="text-[${colors.primaryColor1}]" />,
    <Lock size={30} className="text-[${colors.primaryColor1}]" />,
    <FileText size={30} className="text-[${colors.primaryColor1}]" />,
    <Globe size={30} className="text-[${colors.primaryColor1}]" />,
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.backgroundLight }}>
      {/* Hero Section */}
      <section 
        className="relative min-h-[50vh] flex items-center justify-center px-6 py-20 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/archaeology-privacy-bg.jpg')`
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

      {/* Privacy Sections */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center mb-20 font-serif"
            style={{ color: colors.textPrimary }}
          >
            Your Privacy Matters
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-16 border relative"
            style={{ 
              borderColor: colors.primaryColor1,
              backgroundImage: `url('/images/stone-texture.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
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
          <div className="space-y-12">
            {pageContent.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative bg-white rounded-2xl shadow-lg p-8 border"
                style={{ 
                  borderColor: colors.primaryColor1,
                  backgroundImage: `url('/images/stone-texture.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                <div className="absolute -top-4 left-6 bg-[${colors.primaryColor1}] rounded-full p-2">
                  {sectionIcons[index]}
                </div>
                <h3 className="text-xl font-semibold font-serif mt-6 mb-4" style={{ color: colors.textPrimary }}>
                  {section.title.replace('{websiteName}', websiteInfo.name)}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                  {section.content.replace('{websiteName}', websiteInfo.name)}
                </p>
              </motion.div>
            ))}
          </div>
          {/* Privacy Commitment Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 bg-white rounded-2xl shadow-lg p-8 border relative"
            style={{ 
              borderColor: colors.primaryColor1,
              backgroundImage: `url('/images/stone-texture.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-base md:text-lg font-medium" style={{ color: colors.textPrimary }}>
                {currentLanguage.code === 'ja'
                  ? 'プライバシーポリシーに同意することで、{websiteName}の安全なサービスを利用できます。'
                  : currentLanguage.code === 'zh'
                  ? '同意我们的隐私政策以安全使用{websiteName}的服务。'
                  : `Agree to our Privacy Policy to securely explore ${websiteInfo.name}'s historical and archaeological resources.`}
              </p>
              <div className="flex space-x-4">
                <button
                  className="px-6 py-2 rounded-lg border font-medium transition-colors hover:bg-[${colors.primaryColor1}20]"
                  style={{ borderColor: colors.primaryColor1, color: colors.primaryColor1 }}
                >
                  {currentLanguage.code === 'ja' ? '詳細' : currentLanguage.code === 'zh' ? '详情' : 'Details'}
                </button>
                <button
                  className="px-6 py-2 rounded-lg text-white font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: colors.primaryColor1 }}
                >
                  {currentLanguage.code === 'ja' ? '同意する' : currentLanguage.code === 'zh' ? '接受' : 'Accept'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;