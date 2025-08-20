import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, BookOpen, Compass, Layers, Search, Send, ThumbsUp, User, ChevronDown, ChevronUp } from 'lucide-react';
import { colors } from '../../data/colors/theme';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGroq } from '../../hooks/useGroq'; // Import the useGroq hook

// Import all language files statically
import enQA from '../data/text/en/qa.json';
import jaQA from '../data/text/ja/qa.json';
import zhQA from '../data/text/zh/qa.json';
import esQA from '../data/text/es/qa.json';

// Create a language map
const languageMap = {
  en: enQA,
  ja: jaQA,
  zh: zhQA,
  es: esQA
};

type Question = {
  id: string;
  title: string;
  body: string;
  author: string;
  date: string;
  tags: string[];
  upvotes: number;
  answers: Answer[];
  expanded?: boolean;
};

type Answer = {
  id: string;
  body: string;
  author: string;
  date: string;
  upvotes: number;
  isExpert: boolean;
};

const AskQuestion: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { primaryColor1, primaryColor2, textPrimary, textSecondary, accent } = colors;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    body: '',
    tags: ''
  });
  const [newAnswer, setNewAnswer] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use the useGroq hook
  const { fetchGroqResponse, response, loading, error } = useGroq();

  // Get page content based on current language
  const pageContent = languageMap[currentLanguage.code as keyof typeof languageMap] || languageMap.en;

  // Categories with icons
  const categories = useMemo(() => {
    return pageContent.categories.map(cat => ({
      ...cat,
      icon: (
        cat.name === 'Archaeology' ? <Layers size={20} /> :
        cat.name === 'Geology' ? <Compass size={20} /> :
        cat.name === 'Dating Methods' ? <BookOpen size={20} /> : null
      )
    }));
  }, [pageContent]);

  // Sample questions data - in a real app, this would come from an API
  useEffect(() => {
    const sampleQuestions: Question[] = [
      {
        id: '1',
        title: pageContent.sampleQuestions[0].title,
        body: pageContent.sampleQuestions[0].body,
        author: 'Researcher123',
        date: '2023-05-15',
        tags: ['stratigraphy', 'dating'],
        upvotes: 24,
        answers: [
          {
            id: '1-1',
            body: pageContent.sampleQuestions[0].answers[0],
            author: 'GeoExpert',
            date: '2023-05-16',
            upvotes: 15,
            isExpert: true
          }
        ]
      },
      {
        id: '2',
        title: pageContent.sampleQuestions[1].title,
        body: pageContent.sampleQuestions[1].body,
        author: 'FieldArchaeologist',
        date: '2023-06-02',
        tags: ['pottery', 'classification'],
        upvotes: 18,
        answers: []
      },
      {
        id: '3',
        title: pageContent.sampleQuestions[2].title,
        body: pageContent.sampleQuestions[2].body,
        author: 'GeoStudent',
        date: '2023-06-10',
        tags: ['minerals', 'identification'],
        upvotes: 7,
        answers: [
          {
            id: '3-1',
            body: pageContent.sampleQuestions[2].answers[0],
            author: 'Mineralogist',
            date: '2023-06-11',
            upvotes: 9,
            isExpert: true
          },
          {
            id: '3-2',
            body: pageContent.sampleQuestions[2].answers[1],
            author: 'RockCollector',
            date: '2023-06-12',
            upvotes: 3,
            isExpert: false
          }
        ]
      }
    ];
    setQuestions(sampleQuestions);
  }, [pageContent]);

  // Effect to automatically add AI response when available
  useEffect(() => {
    if (response && !loading) {
      // Find the most recent question without an AI answer
      const recentQuestion = questions.find(q => 
        q.answers.length === 0 || !q.answers.some(a => a.author === 'AI Assistant')
      );
      
      if (recentQuestion) {
        const updatedQuestions = questions.map(q => {
          if (q.id === recentQuestion.id) {
            const aiAnswer: Answer = {
              id: `${q.id}-ai-${Date.now()}`,
              body: response,
              author: 'AI Assistant',
              date: new Date().toISOString().split('T')[0],
              upvotes: 0,
              isExpert: true
            };
            return { 
              ...q, 
              answers: [...q.answers, aiAnswer],
              expanded: true 
            };
          }
          return q;
        });
        setQuestions(updatedQuestions);
      }
    }
  }, [response, loading, questions]);

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQ: Question = {
      id: Date.now().toString(),
      title: newQuestion.title,
      body: newQuestion.body,
      author: 'CurrentUser',
      date: new Date().toISOString().split('T')[0],
      tags: newQuestion.tags.split(',').map(tag => tag.trim()),
      upvotes: 0,
      answers: [],
      expanded: true
    };
    setQuestions([newQ, ...questions]);
    setNewQuestion({ title: '', body: '', tags: '' });
    
    // Automatically generate AI response for the new question
    fetchGroqResponse(
      "Provide a helpful and informative answer to this question about sports:",
      `${newQuestion.title}: ${newQuestion.body}`
    );
  };

  const handleAnswerSubmit = (questionId: string, e: React.FormEvent) => {
    e.preventDefault();
    const answerText = newAnswer[questionId];
    if (!answerText) return;

    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        const newA: Answer = {
          id: `${questionId}-${Date.now()}`,
          body: answerText,
          author: 'CurrentUser',
          date: new Date().toISOString().split('T')[0],
          upvotes: 0,
          isExpert: false
        };
        return { ...q, answers: [...q.answers, newA] };
      }
      return q;
    });

    setQuestions(updatedQuestions);
    setNewAnswer({ ...newAnswer, [questionId]: '' });
  };

  const toggleExpand = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, expanded: !q.expanded } : q
    ));
  };

  const upvoteQuestion = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
    ));
  };

  const upvoteAnswer = (questionId: string, answerId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const updatedAnswers = q.answers.map(a => 
          a.id === answerId ? { ...a, upvotes: a.upvotes + 1 } : a
        );
        return { ...q, answers: updatedAnswers };
      }
      return q;
    }));
  };

  const getAIAnswer = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      fetchGroqResponse(
        "Provide a helpful and informative answer to this sports-related question:",
        `${question.title}: ${question.body}`
      );
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         q.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'recent') return matchesSearch;
    if (activeTab === 'unanswered') return matchesSearch && q.answers.length === 0;
    if (activeTab === 'popular') return matchesSearch && q.upvotes > 10;
    return matchesSearch;
  });

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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-lg sticky top-4" style={{ backgroundColor: colors.backgroundLight }}>
              <h2 className="text-xl font-semibold mb-6" style={{ color: textPrimary }}>
                {pageContent.categoriesTitle}
              </h2>
              <ul className="space-y-3">
                {categories.map((category, index) => (
                  <li key={index}>
                    <button className="flex items-center w-full p-3 rounded-md hover:bg-opacity-20 transition-colors group"
                      style={{ 
                        backgroundColor: `${accent}${activeTab === category.id ? '20' : '00'}`,
                        color: activeTab === category.id ? primaryColor1 : textPrimary
                      }}
                      onClick={() => setActiveTab(category.id)}
                    >
                      <span className="mr-3">{category.icon}</span>
                      {category.name}
                      <span className="ml-auto text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: `${accent}20`,
                          color: textPrimary
                        }}
                      >
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Ask Question Form */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: colors.backgroundLight }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: textPrimary }}>
                {pageContent.askQuestionTitle}
              </h2>
              <form onSubmit={handleQuestionSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder={pageContent.formFields.title}
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                    className="w-full p-3 border rounded-md"
                    style={{ backgroundColor: colors.backgroundLight, borderColor: accent }}
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder={pageContent.formFields.body}
                    value={newQuestion.body}
                    onChange={(e) => setNewQuestion({...newQuestion, body: e.target.value})}
                    rows={4}
                    className="w-full p-3 border rounded-md"
                    style={{ backgroundColor: colors.backgroundLight, borderColor: accent }}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder={pageContent.formFields.tags}
                    value={newQuestion.tags}
                    onChange={(e) => setNewQuestion({...newQuestion, tags: e.target.value})}
                    className="w-full p-3 border rounded-md"
                    style={{ backgroundColor: colors.backgroundLight, borderColor: accent }}
                  />
                  <p className="text-xs mt-1" style={{ color: textSecondary }}>
                    {pageContent.formFields.tagsHint}
                  </p>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md font-medium flex items-center"
                  style={{ backgroundColor: primaryColor1, color: 'white' }}
                >
                  <Send size={18} className="mr-2" />
                  {pageContent.submitQuestion}
                </button>
              </form>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-grow max-w-2xl">
                <Search size={18} className="absolute left-3 top-3" style={{ color: textSecondary }} />
                <input
                  type="text"
                  placeholder={pageContent.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                  style={{ backgroundColor: colors.backgroundLight, borderColor: accent }}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('recent')}
                  className={`px-4 py-2 text-sm rounded-md ${activeTab === 'recent' ? 'font-medium' : ''}`}
                  style={{ 
                    backgroundColor: activeTab === 'recent' ? `${primaryColor1}20` : `${accent}10`,
                    color: activeTab === 'recent' ? primaryColor1 : textPrimary
                  }}
                >
                  {pageContent.filters.recent}
                </button>
                <button
                  onClick={() => setActiveTab('unanswered')}
                  className={`px-4 py-2 text-sm rounded-md ${activeTab === 'unanswered' ? 'font-medium' : ''}`}
                  style={{ 
                    backgroundColor: activeTab === 'unanswered' ? `${primaryColor1}20` : `${accent}10`,
                    color: activeTab === 'unanswered' ? primaryColor1 : textPrimary
                  }}
                >
                  {pageContent.filters.unanswered}
                </button>
                <button
                  onClick={() => setActiveTab('popular')}
                  className={`px-4 py-2 text-sm rounded-md ${activeTab === 'popular' ? 'font-medium' : ''}`}
                  style={{ 
                    backgroundColor: activeTab === 'popular' ? `${primaryColor1}20` : `${accent}10`,
                    color: activeTab === 'popular' ? primaryColor1 : textPrimary
                  }}
                >
                  {pageContent.filters.popular}
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => (
                  <div 
                    key={question.id} 
                    className="p-6 rounded-lg"
                    style={{ backgroundColor: colors.backgroundLight }}
                  >
                    <div className="flex items-start">
                      {/* Votes */}
                      <div className="flex flex-col items-center mr-4">
                        <button 
                          onClick={() => upvoteQuestion(question.id)}
                          className="p-2 rounded-full hover:bg-opacity-20 transition-colors"
                          style={{ color: textPrimary }}
                        >
                          <ThumbsUp size={20} />
                        </button>
                        <span className="font-medium mt-1" style={{ color: textPrimary }}>
                          {question.upvotes}
                        </span>
                      </div>
                      
                      {/* Question Content */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold mb-2" style={{ color: textPrimary }}>
                            {question.title}
                          </h3>
                          <button 
                            onClick={() => toggleExpand(question.id)}
                            className="ml-4 p-1 rounded-full hover:bg-opacity-20 transition-colors"
                            style={{ color: textPrimary }}
                          >
                            {question.expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </div>
                        
                        <p className={`mb-3 ${question.expanded ? '' : 'line-clamp-2'}`} style={{ color: textSecondary }}>
                          {question.body}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {question.tags.map((tag, index) => (
                            <span 
                              key={index} 
                              className="text-xs px-2 py-1 rounded-full"
                              style={{ backgroundColor: `${accent}20`, color: textPrimary }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center text-sm mb-4" style={{ color: textSecondary }}>
                          <User size={14} className="mr-1" />
                          {question.author} • {question.date} • 
                          <span className="ml-1">
                            {question.answers.length} {question.answers.length === 1 ? pageContent.answer : pageContent.answers}
                          </span>
                        </div>

                        {/* AI Answer Button for unanswered questions */}
                        {question.answers.length === 0 && (
                          <div className="mb-4">
                            <button
                              onClick={() => getAIAnswer(question.id)}
                              disabled={loading}
                              className="px-4 py-2 text-sm rounded-md flex items-center"
                              style={{ 
                                backgroundColor: loading ? `${primaryColor1}50` : primaryColor1, 
                                color: 'white' 
                              }}
                            >
                              {loading ? pageContent.loadingAI : pageContent.getAIAnswer}
                            </button>
                          </div>
                        )}

                        {/* Answers Section */}
                        {question.expanded && (
                          <div className="mt-6 space-y-6">
                            {question.answers.length > 0 ? (
                              question.answers.map((answer) => (
                                <div key={answer.id} className="pl-6 border-l-2" style={{ borderColor: accent }}>
                                  <div className="flex items-start">
                                    {/* Answer Votes */}
                                    <div className="flex flex-col items-center mr-4">
                                      <button 
                                        onClick={() => upvoteAnswer(question.id, answer.id)}
                                        className="p-2 rounded-full hover:bg-opacity-20 transition-colors"
                                        style={{ color: textPrimary }}
                                      >
                                        <ThumbsUp size={16} />
                                      </button>
                                      <span className="text-xs mt-1" style={{ color: textPrimary }}>
                                        {answer.upvotes}
                                      </span>
                                    </div>
                                    
                                    {/* Answer Content */}
                                    <div>
                                      <div className="flex items-center mb-2">
                                        <span className="font-medium mr-2" style={{ color: textPrimary }}>
                                          {answer.author}
                                        </span>
                                        {answer.isExpert && (
                                          <span className="text-xs px-2 py-0.5 rounded-full"
                                            style={{ backgroundColor: `${primaryColor1}20`, color: primaryColor1 }}
                                          >
                                            {answer.author === 'AI Assistant' ? pageContent.aiAssistant : pageContent.expert}
                                          </span>
                                        )}
                                        <span className="text-xs ml-2" style={{ color: textSecondary }}>
                                          {answer.date}
                                        </span>
                                      </div>
                                      <p style={{ color: textSecondary }}>{answer.body}</p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-center py-4" style={{ color: textSecondary }}>
                                {pageContent.noAnswers}
                              </p>
                            )}

                            {/* Add Answer Form */}
                            <form 
                              onSubmit={(e) => handleAnswerSubmit(question.id, e)}
                              className="mt-4"
                            >
                              <textarea
                                placeholder={pageContent.addAnswerPlaceholder}
                                value={newAnswer[question.id] || ''}
                                onChange={(e) => setNewAnswer({...newAnswer, [question.id]: e.target.value})}
                                rows={3}
                                className="w-full p-3 border rounded-md"
                                style={{ backgroundColor: colors.backgroundLight, borderColor: accent }}
                              />
                              <div className="flex justify-end mt-2">
                                <button
                                  type="submit"
                                  className="px-4 py-2 text-sm rounded-md flex items-center"
                                  style={{ backgroundColor: primaryColor1, color: 'white' }}
                                >
                                  <Send size={16} className="mr-2" />
                                  {pageContent.postAnswer}
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12" style={{ color: textSecondary }}>
                  <MessageSquare size={48} className="mx-auto mb-4" style={{ color: accent }} />
                  <h3 className="text-xl font-medium mb-2" style={{ color: textPrimary }}>
                    {pageContent.noQuestionsTitle}
                  </h3>
                  <p>{pageContent.noQuestionsDescription}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AskQuestion;