import React, { useState, useMemo, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Upload, Shield, Users, ChevronRight, 
  Calendar, Globe, ChevronLeft, Star, Quote
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { websiteInfo } from '../data/website/info';
import { colors } from '../data/colors/theme';
import { useLanguage } from '../contexts/LanguageContext';

// Lazy load components
const LazyImage = lazy(() => import('../components/LazyImage'));

// Import language files statically
import enHome from '../data/text/en/home.json';
import zhHome from '../data/text/zh/home.json';
import jaHome from '../data/text/ja/home.json';
import esHome from '../data/text/es/home.json';

// Create a language map
const languageMap = {
  en: enHome,
  zh: zhHome,
  ja: jaHome,
  es: esHome,
};

// Images array
const images = {
  hero: 'https://assets.tdar.org/images/r4/bg-home.jpg',
  slider: [
    'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22stroke-width%22%3A4%2C%22stroke%22%3A%22%237a1501%22%2C%22stroke-opacity%22%3A0.5%2C%22fill-opacity%22%3A0.15%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B-110.64846066266844%2C32.82611990954123%5D%2C%5B-110.64846066266844%2C32.85809331698177%5D%2C%5B-110.61125924478108%2C32.85809331698177%5D%2C%5B-110.61125924478108%2C32.82611990954123%5D%2C%5B-110.64846066266844%2C32.82611990954123%5D%5D%5D%7D%7D)/auto/410x235?access_token=pk.eyJ1IjoiYWJyaW4iLCJhIjoiNzNlMWRhMDQ1MTBlYzAwMmRiOTRhNzYxMTY2NDY1MTMifQ.ZDirx5xDnYHsAo7kxAI13g',
    'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22stroke-width%22%3A4%2C%22stroke%22%3A%22%237a1501%22%2C%22stroke-opacity%22%3A0.5%2C%22fill-opacity%22%3A0.15%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B32.687539757532264%2C25.89280190702591%5D%2C%5B32.687539757532264%2C25.934113828425843%5D%2C%5B32.71720303681896%2C25.934113828425843%5D%2C%5B32.71720303681896%2C25.89280190702591%5D%2C%5B32.687539757532264%2C25.89280190702591%5D%5D%5D%7D%7D)/auto/410x235?access_token=pk.eyJ1IjoiYWJyaW4iLCJhIjoiNzNlMWRhMDQ1MTBlYzAwMmRiOTRhNzYxMTY2NDY1MTMifQ.ZDirx5xDnYHsAo7kxAI13g',
    'https://core.tdar.org/files/sm/104896'
  ],
  cast: 'https://www.researchgate.net/profile/Nicolau-Duran-Silva/publication/377415408/figure/fig4/AS:11431281217774558@1705392944299/Amount-of-papers-that-fall-under-each-topic-shown-separately-for-each-publication_Q320.jpg',
  worldMap: 'https://www.freevector.com/uploads/vector/preview/90949/vecteezyWorldMapCountryName1FV0223_generated.jpg',
  research: 'https://www.discoverphds.com/wp-content/uploads/elementor/thumbs/What-is-Research-Purpose-of-Research-phul4s3cbwe0xam190dnc4kz3z616ajmfkygodcdqg.png',
  review1: 'https://randomuser.me/api/portraits/women/43.jpg',
  review2: 'https://randomuser.me/api/portraits/men/32.jpg',
  review3: 'https://randomuser.me/api/portraits/women/65.jpg'
};

interface HomeContent {
  page1: { title: string; description: string };
  page2: {
    items: Array<{
      title: string;
      subtitle?: string;
      description: string;
      icon: string;
    }>;
  };
  page3: {
    slides: Array<{
      image: string;
      title: string;
      text: string;
    }>;
  };
  page4: {
    title: string;
    newsItems: Array<{
      date: string;
      title: string;
      author: string;
    }>;
  };
  page5: {
    title: string;
    content: string;
  };
  page6: {
    title: string;
    content: string;
  };
  page7: {
    title: string;
    reviews: Array<{
      name: string;
      role: string;
      quote: string;
      rating: number;
    }>;
  };
}

const iconComponents: Record<string, React.ComponentType<any>> = {
  Search, Upload, Shield, Users, Globe, Calendar, Star, Quote
};

const Home: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get page content directly, default to English
  const pageContent = languageMap[currentLanguage.code as keyof typeof languageMap] || languageMap.en;

  // Auto-rotate slides
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % pageContent.page3.slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [pageContent.page3.slides.length]);

  // Render star ratings
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-300'}`}
      />
    ));
  };

  return (
    <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: colors.backgroundLight }}></div>}>
      <div className="min-h-screen" style={{ backgroundColor: colors.backgroundLight }}>
        {/* Page 1: Hero Section */}
        <section 
          className="relative min-h-[60vh] flex items-center px-4 py-20 overflow-hidden"
          style={{ backgroundColor: colors.primaryColor1 }}
        >
          <motion.div className="absolute inset-0 z-0">
            <LazyImage
              src={images.hero}
              alt="Hero Background"
              placeholder="https://via.placeholder.com/1920x1080?text=Hero+Background"
              className="w-full h-full object-cover opacity-30"
            />
          </motion.div>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-6xl mx-auto text-left px-4"
            style={{ color: colors.backgroundLight }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {pageContent.page1.title.replace('{website.name}', websiteInfo.name)}
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl">
              {websiteInfo.name}
              &nbsp;

              {pageContent.page1.description}
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                to="/signup"
                className="px-6 py-3 rounded-lg font-medium"
                style={{ backgroundColor: colors.backgroundLight, color: colors.primaryColor1 }}
              >
                Start Exploring
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 rounded-lg font-medium border"
                style={{ borderColor: colors.backgroundLight, color: colors.backgroundLight }}
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Page 2: Four Feature Boxes */}
        <section className="py-20 px-4" style={{ backgroundColor: colors.backgroundLight }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pageContent.page2.items.map((item, index) => {
                const IconComponent = iconComponents[item.icon] || null;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="rounded-lg p-6 border hover:shadow-lg transition-shadow"
                    style={{ 
                      borderColor: colors.primaryColor1,
                      backgroundColor: colors.backgroundLight
                    }}
                  >
                    <div className="flex items-start mb-4">
                      {IconComponent && (
                        <IconComponent 
                          className="w-8 h-8 mr-3 mt-1" 
                          style={{ color: colors.primaryColor1 }} 
                        />
                      )}
                      <div>
                        <h3 
                          className="text-xl font-bold"
                          style={{ color: colors.primaryColor1 }}
                        >
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <h4 className="text-sm font-semibold mt-1" style={{ color: colors.textSecondary }}>
                            {item.subtitle}
                          </h4>
                        )}
                      </div>
                    </div>
                    <p style={{ color: colors.textPrimary }}>
                      {item.description}
                    </p>
                    <Link
                      to={`/${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="inline-flex items-center mt-4 text-sm font-medium"
                      style={{ color: colors.primaryColor1 }}
                    >
                      Learn more <ChevronRight className="ml-1 w-4 h-4" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Page 3: Slider Section */}
        <section className="py-20 px-4" style={{ backgroundColor: colors.backgroundDark }}>
          <div className="max-w-6xl mx-auto relative h-96 overflow-hidden rounded-lg">
            {pageContent.page3.slides.map((slide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: index === currentSlide ? 1 : 0,
                  zIndex: index === currentSlide ? 1 : 0
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex"
              >
                <div className="w-1/2 h-full">
                  <LazyImage
                    src={slide.image}
                    alt={slide.title}
                    placeholder="https://via.placeholder.com/600x400?text=Loading"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div 
                  className="w-1/2 p-8 h-full flex items-center"
                  style={{ backgroundColor: colors.backgroundLight }}
                >
                  <div>
                    <h3 
                      className="text-2xl font-bold mb-4"
                      style={{ color: colors.primaryColor1 }}
                    >
                      {slide.title}
                    </h3>
                    <p style={{ color: colors.textPrimary }}>{slide.text}</p>
            
                  </div>
                </div>
              </motion.div>
            ))}
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
              {pageContent.page3.slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 mx-1 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-gray-400'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Page 4: News Section */}
        <section className="py-20 px-4" style={{ backgroundColor: colors.backgroundLight }}>
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-12"
              style={{ color: colors.primaryColor1 }}
            >
              {pageContent.page4.title.replace('{website.name}', websiteInfo.name)}
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {pageContent.page4.newsItems.map((item, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
    style={{ 
      borderColor: colors.primaryColor1,
      backgroundColor: colors.backgroundLight
    }}
  >
    <div className="flex items-center mb-3">
      <Calendar className="w-5 h-5 mr-2" style={{ color: colors.primaryColor1 }} />
      <span style={{ color: colors.textSecondary }}>{item.date}</span>
    </div>
    <h3 
      className="text-xl font-bold mb-2"
      style={{ color: colors.primaryColor1 }}
    >
      {item.title}
    </h3>
    <p style={{ color: colors.textPrimary }}>
      <strong>By {item.author}</strong> — a seasoned archaeologist known for her extensive contributions to fieldwork, research, and digital heritage management.
    </p>
    <p className="mt-2 text-sm leading-relaxed" style={{ color: colors.textPrimary }}>
      {index === 0 && "Rachel Fernandez, with over 15 years of archaeological expertise, introduces our new pricing structure—carefully designed for sustainability, accessibility, and long-term preservation of research data."}
      {index === 1 && "Get to know Dr. Sébastien Plutniak, a pioneer in archaeological informatics. Rachel Fernandez highlights his innovative approach to data integration and collaborative research frameworks."}
      {index === 2 && "A complete overview of the 2023 SAA Conference through Rachel’s expert lens—featuring digital archaeology sessions, preservation tech, and collaborative research milestones."}
      {index === 3 && "Travel back to the 2022 SAA Conference where Rachel shares her takeaways on field digitization, public archaeology, and ethical data handling."}
      {index === 4 && "Explore the results of Rachel’s international survey on digital data practices in archaeology—revealing both gaps and future opportunities in archival systems."}
    </p>
  
   </motion.div>
))}

            </div>
          </div>
        </section>

        {/* Page 5: Featured Collection */}
        <section className="py-20 px-4" style={{ backgroundColor: colors.backgroundDark }}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-xl overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:w-1/3 p-6 flex items-center justify-center bg-gray-100">
                  <LazyImage
                    src={images.cast}
                    alt="CAST Logo"
                    placeholder="https://via.placeholder.com/300x300?text=CAST"
                    className="w-full max-w-xs h-auto"
                  />
                </div>
                <div className="md:w-2/3 p-8">
                  <h2 
                    className="text-2xl font-bold mb-4"
                    style={{ color: colors.primaryColor1 }}
                  >
                    {pageContent.page5.title}
                  </h2>
                  <p style={{ color: colors.textPrimary }}>
                    {pageContent.page5.content}
                  </p>
  
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Page 6: Research Page - Image Right, Text Left */}
        <section className="py-20 px-4" style={{ backgroundColor: colors.backgroundLight }}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="md:w-1/2">
                <h2 
                  className="text-3xl md:text-4xl font-bold mb-6"
                  style={{ color: colors.primaryColor1 }}
                >
                  {pageContent.page6.title}
                </h2>
                <p className="text-lg mb-6" style={{ color: colors.textPrimary }}>
                  {pageContent.page6.content}
                </p>
                <Link
                  to="/blogs"
                  className="inline-flex items-center px-6 py-3 rounded-lg font-medium"
                  style={{ backgroundColor: colors.primaryColor1, color: colors.backgroundLight }}
                >
                  Start Researching
                </Link>
              </div>
              <div className="md:w-1/2 mt-8 md:mt-0">
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <LazyImage
                    src={images.research}
                    alt="Research Image"
                    placeholder="https://via.placeholder.com/600x400?text=Research"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Page 7: Reviews Section */}
        <section className="py-20 px-4" style={{ backgroundColor: colors.backgroundDark }}>
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              style={{ color: colors.backgroundLight }}
            >
              {pageContent.page7.title}
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pageContent.page7.reviews.map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-8 shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <LazyImage
                        src={typeof images[`review${index + 1}` as keyof typeof images] === 'string'
                          ? images[`review${index + 1}` as keyof typeof images] as string
                          : ''}
                        alt={review.name}
                        placeholder="https://via.placeholder.com/100x100?text=Reviewer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold" style={{ color: colors.primaryColor1 }}>{review.name}</h3>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>{review.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {renderStars(review.rating)}
                  </div>
                  <div className="flex items-start">
                    <Quote className="w-5 h-5 mr-2 mt-1 flex-shrink-0" style={{ color: colors.primaryColor1 }} />
                    <p style={{ color: colors.textPrimary }}>{review.quote}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-12">
          
            </div>
          </div>
        </section>

        {/* Page 8: Additional Content Page */}
        <section className="py-20 px-4" style={{ backgroundColor: colors.backgroundLight }}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="md:w-1/2 order-2 md:order-1">
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <LazyImage
                    src={images.worldMap}
                    alt="World Map"
                    placeholder="https://via.placeholder.com/600x400?text=World+Map"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              <div className="md:w-1/2 order-1 md:order-2">
                <h2 
                  className="text-3xl md:text-4xl font-bold mb-6"
                  style={{ color: colors.primaryColor1 }}
                >
                  Global Impact
                </h2>
                <p className="text-lg mb-6" style={{ color: colors.textPrimary }}>
                  {websiteInfo.name} serves researchers from around the world, with data from thousands of archaeological projects. Our users include academic researchers, government agencies, cultural resource management firms, and indigenous communities working to preserve their heritage.
                </p>
                <div className="flex gap-4">
                  <Link
                    to="/signup"
                    className="inline-flex items-center px-6 py-3 rounded-lg font-medium"
                    style={{ backgroundColor: colors.primaryColor1, color: colors.backgroundLight }}
                  >
                    Signup  Now
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-6 py-3 rounded-lg font-medium border"
                    style={{ borderColor: colors.primaryColor1, color: colors.primaryColor1 }}
                  >
                    Login
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Suspense>
  );
};

export default Home;