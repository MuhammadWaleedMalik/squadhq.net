import React from 'react';
import { motion } from 'framer-motion';
import { Book, MapPin, Clock, Layers } from 'lucide-react';
import { websiteInfo } from '../data/website/info';
import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../data/colors/theme';

// Import language files statically
import enBlogs from '../data/text/en/blogs.json';
import zhBlogs from '../data/text/zh/blogs.json';
import jaBlogs from '../data/text/ja/blogs.json';
import esBlogs from '../data/text/es/blogs.json';

// Create a language map
const languageMap = {
  en: enBlogs,
  zh: zhBlogs,
  ja: jaBlogs,
  es: esBlogs,
};

interface BlogContent {
  title: string;
  subtitle: string;
  blogs: {
    id: number;
    title: string;
    content: string[];
    date: string;
    location: string;
  }[];
}

const Blogs: React.FC = () => {
  const { currentLanguage } = useLanguage();

  // Get page content directly, default to English
  const pageContent = languageMap[currentLanguage.code as keyof typeof languageMap] || languageMap.en;

  // Blog icons
  const blogIcons = [
    <Book size={28} className="text-[${colors.primaryColor1}]" />,
    <MapPin size={28} className="text-[${colors.primaryColor1}]" />,
    <Clock size={28} className="text-[${colors.primaryColor1}]" />,
    <Layers size={28} className="text-[${colors.primaryColor1}]" />,
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.backgroundLight }}>
      {/* Hero Section */}
      <section 
        className="relative min-h-[50vh] flex items-center justify-center px-6 py-20 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/archaeology-blog-bg.jpg')`
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="text-center max-w-5xl mx-auto"
        >
          <h1
            className="text-4xl md:text-6xl font-extrabold text-white mb-5 tracking-tight"
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

      {/* Blog Posts Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center mb-20"
            style={{ color: colors.textPrimary }}
          >
            Explore Our Historical Insights
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pageContent.blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative bg-white rounded-2xl shadow-lg p-6 border overflow-hidden group"
                style={{ borderColor: colors.primaryColor1 }}
              >
                <div className="absolute inset-0 bg-[${colors.primaryColor1}] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="flex items-center space-x-3 mb-4">
                  {blogIcons[index % blogIcons.length]}
                  <h3 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
                    {blog.title.replace('{websiteName}', websiteInfo.name)}
                  </h3>
                </div>
                <div className="space-y-3">
                  {blog.content.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-sm leading-relaxed"
                      style={{ color: colors.textSecondary }}
                    >
                      {paragraph.replace('{websiteName}', websiteInfo.name)}
                    </p>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm" style={{ color: colors.textSecondary }}>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} />
                    <span>{blog.date ?? ''}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <span>{blog.location ?? ''}</span>
                  </div>
                </div>
         
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;