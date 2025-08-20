import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scroll, HelpCircle } from 'lucide-react';
import { websiteInfo } from '../data/website/info';
import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../data/colors/theme';

// Import language files statically
import enFAQs from '../data/text/en/faqs.json';
import zhFAQs from '../data/text/zh/faqs.json';
import jaFAQs from '../data/text/ja/faqs.json';
import esFAQs from '../data/text/es/faqs.json';

// Create a language map
const languageMap = {
  en: enFAQs,
  zh: zhFAQs,
  ja: jaFAQs,
  es: esFAQs,
};

interface FAQContent {
  title: string;
  subtitle: string;
  faqs: {
    id: number;
    question: string;
    answer: string;
  }[];
}

const FAQs: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Get page content directly, default to English
  const pageContent = languageMap[currentLanguage.code as keyof typeof languageMap] || languageMap.en;

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.backgroundLight }}>
      {/* Hero Section */}
      <section 
        className="relative min-h-[50vh] flex items-center justify-center px-6 py-20 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/archaeology-parchment-bg.jpg')`
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

      {/* FAQs Section - Masonry Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center mb-20 font-serif"
            style={{ color: colors.textPrimary }}
          >
            Unearth Answers to Your Questions
          </motion.h2>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {'faqs' in pageContent && Array.isArray(pageContent.faqs) && pageContent.faqs.map((faq: { id: number; question: string; answer: string }, index: number) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="break-inside-avoid mb-6 bg-white rounded-lg shadow-lg border p-6 relative group"
                style={{ 
                  borderColor: colors.primaryColor1,
                  backgroundImage: `url('/images/parchment-texture.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-start space-x-4 mb-4">
                  <Scroll size={28} className="text-[${colors.primaryColor1}] flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold font-serif" style={{ color: colors.textPrimary }}>
                      {faq.question.replace('{websiteName}', websiteInfo.name)}
                    </h3>
                  </div>
                </div>
                <motion.div
                  animate={{ 
                    opacity: hoveredIndex === index ? 1 : 0.5,
                    y: hoveredIndex === index ? 0 : 5
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-sm leading-relaxed"
                  style={{ color: colors.textSecondary }}
                >
                  {faq.answer.replace('{websiteName}', websiteInfo.name)}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQs;