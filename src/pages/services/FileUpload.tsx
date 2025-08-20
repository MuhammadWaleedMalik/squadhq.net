import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Image, Map, Database, Globe, Info, ChevronRight } from 'lucide-react';
import { colors } from '../../data/colors/theme';
import { useLanguage } from '../../contexts/LanguageContext';

// Import all language files statically
import enUpload from '../data/text/en/upload.json';
import jaUpload from '../data/text/ja/upload.json';
import zhUpload from '../data/text/zh/upload.json';
import esUpload from '../data/text/es/upload.json';

// Create a language map
const languageMap = {
  en: enUpload,
  ja: jaUpload,
  zh: zhUpload,
  es: esUpload
};

const FileUpload: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { primaryColor1, primaryColor2, textPrimary, textSecondary, accent } = colors;
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState({
    siteName: '',
    location: '',
    era: '',
    description: '',
    tags: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Get page content based on current language
  const pageContent = languageMap[currentLanguage.code as keyof typeof languageMap] || languageMap.en;

  // File types with icons
  const fileTypes = useMemo(() => {
    return pageContent.fileTypes.map(type => ({
      ...type,
      icon: (
        type.name === 'Documents' ? <FileText size={20} /> :
        type.name === 'Images' ? <Image size={20} /> :
        type.name === 'Maps' ? <Map size={20} /> :
        type.name === 'Datasets' ? <Database size={20} /> : null
      )
    }));
  }, [pageContent]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    setIsUploading(true);
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: colors.backgroundLight }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4" style={{ color: textPrimary }}>
            {pageContent.title}
          </h1>
          <p className="max-w-2xl mx-auto" style={{ color: textSecondary }}>
            {pageContent.subtitle}
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upload Box */}
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              style={{ borderColor: accent }}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload size={48} className="mx-auto mb-4" style={{ color: accent }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: textPrimary }}>
                {pageContent.uploadTitle}
              </h3>
              <p className="mb-4" style={{ color: textSecondary }}>
                {pageContent.uploadDescription}
              </p>
              <button 
                className="px-6 py-2 rounded-md font-medium"
                style={{ backgroundColor: primaryColor1, color: 'white' }}
              >
                {pageContent.uploadButton}
              </button>
              <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                multiple 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff,.geojson,.shp,.csv,.xlsx"
              />
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold" style={{ color: textPrimary }}>
                  {pageContent.selectedFiles} ({selectedFiles.length})
                </h3>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 rounded-md border"
                      style={{ backgroundColor: colors.backgroundLight, borderColor: accent }}
                    >
                      <div className="flex items-center">
                        <FileText size={20} className="mr-3" />
                        <div>
                          <p className="font-medium" style={{ color: textPrimary }}>
                            {file.name}
                          </p>
                          <p className="text-xs" style={{ color: textSecondary }}>
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold" style={{ color: textPrimary }}>
                  {pageContent.uploadProgress}
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ 
                      width: `${uploadProgress}%`,
                      backgroundColor: primaryColor1
                    }}
                  ></div>
                </div>
                <p className="text-sm text-right" style={{ color: textSecondary }}>
                  {uploadProgress}% {pageContent.complete}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Metadata Form */}
          <div className="space-y-8">
            {/* Metadata Form */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: colors.backgroundLight }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: textPrimary }}>
                {pageContent.metadataTitle}
              </h2>
              <p className="text-sm mb-6" style={{ color: textSecondary }}>
                {pageContent.metadataDescription}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: textPrimary }}>
                    {pageContent.formFields.siteName}
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    value={metadata.siteName}
                    onChange={handleMetadataChange}
                    className="w-full p-2 border rounded-md"
                    style={{ backgroundColor: colors.backgroundLight, borderColor: accent }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: textPrimary }}>
                    {pageContent.formFields.location}
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={metadata.location}
                    onChange={handleMetadataChange}
                    className="w-full p-2 border rounded-md"
                    style={{ backgroundColor: colors.backgroundLight, borderColor: accent }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: textPrimary }}>
                    {pageContent.formFields.era}
                  </label>
                  <input
                    type="text"
                    name="era"
                    value={metadata.era}
                    onChange={handleMetadataChange}
                    className="w-full p-2 border rounded-md"
                    style={{ backgroundColor: colors.backgroundLight, borderColor: accent }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: textPrimary }}>
                    {pageContent.formFields.description}
                  </label>
                  <textarea
                    name="description"
                    value={metadata.description}
                    onChange={handleMetadataChange}
                    rows={3}
                    className="w-full p-2 border rounded-md"
                    style={{ backgroundColor: colors.backgroundLight, borderColor: accent }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: textPrimary }}>
                    {pageContent.formFields.tags}
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={metadata.tags}
                    onChange={handleMetadataChange}
                    placeholder={pageContent.formFields.tagsPlaceholder}
                    className="w-full p-2 border rounded-md"
                    style={{ backgroundColor: colors.backgroundLight, borderColor: accent }}
                  />
                </div>

                <button
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0 || isUploading}
                  className={`w-full py-2 px-4 rounded-md font-medium ${selectedFiles.length === 0 || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: primaryColor1, color: 'white' }}
                >
                  {isUploading ? pageContent.uploadingButton : pageContent.submitButton}
                </button>
              </div>
            </div>

            {/* Supported File Types */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: colors.backgroundLight }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: textPrimary }}>
                {pageContent.supportedFilesTitle}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {fileTypes.map((type, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="p-2 rounded-full" style={{ backgroundColor: `${accent}20` }}>
                      {type.icon}
                    </div>
                    <div>
                      <h4 className="font-medium" style={{ color: textPrimary }}>{type.name}</h4>
                      <p className="text-xs" style={{ color: textSecondary }}>{type.formats}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: textPrimary }}>
            {pageContent.howItWorksTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pageContent.steps.map((step, index) => (
              <div 
                key={index} 
                className="p-6 rounded-lg flex flex-col items-center text-center"
                style={{ backgroundColor: colors.backgroundLight }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" 
                  style={{ backgroundColor: `${primaryColor1}20`, color: primaryColor1 }}>
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: textPrimary }}>
                  {step.title}
                </h3>
                <p style={{ color: textSecondary }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: textPrimary }}>
            {pageContent.faqTitle}
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {pageContent.faqs.map((faq, index) => (
              <div 
                key={index} 
                className="p-4 rounded-lg"
                style={{ backgroundColor: colors.backgroundLight }}
              >
                <h3 className="font-semibold flex items-center" style={{ color: textPrimary }}>
                  <Info size={18} className="mr-2" style={{ color: accent }} />
                  {faq.question}
                </h3>
                <p className="mt-2 pl-6 text-sm" style={{ color: textSecondary }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FileUpload;