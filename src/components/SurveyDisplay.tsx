import { useState, useEffect } from 'react';
import { X, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { API_BASE, publicAnonKey } from '../utils/supabase/client';

interface Question {
  id: string;
  type: 'text' | 'rating' | 'multiple-choice' | 'yes-no' | 'nps';
  question: string;
  required: boolean;
  options?: string[];
}

interface Survey {
  id: string;
  name: string;
  title: string;
  description: string;
  questions: Question[];
  targetPlatform: 'web' | 'ios' | 'android' | 'all';
  status: 'active';
}

export function SurveyDisplay() {
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedbackButton, setShowFeedbackButton] = useState(true);

  useEffect(() => {
    loadActiveSurvey();
  }, []);

  const loadActiveSurvey = async (autoShow = true) => {
    try {
      // Detect platform
      const platform = detectPlatform();
      
      const res = await fetch(`${API_BASE}/surveys/active?platform=${platform}`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      
      const data = await res.json();
      if (data.success && data.survey) {
        const survey = data.survey;
        
        // Check if already completed
        const completedKey = `survey-completed-${survey.id}`;
        if (localStorage.getItem(completedKey)) {
          setShowFeedbackButton(false);
          return;
        }
        
        setActiveSurvey(survey);
        
        // Only auto-show if autoShow is true
        if (autoShow) {
          // Show survey after 10 seconds
          setTimeout(() => {
            setIsVisible(true);
          }, 10000);
        }
      }
    } catch (error) {
      console.error('Failed to load survey:', error);
    }
  };

  const detectPlatform = (): string => {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
    if (/Android/.test(ua)) return 'android';
    return 'web';
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNext = () => {
    const currentQuestion = activeSurvey?.questions[currentQuestionIndex];
    if (currentQuestion?.required && !answers[currentQuestion.id]) {
      toast.error('Please answer this question to continue');
      return;
    }

    if (activeSurvey && currentQuestionIndex < activeSurvey.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!activeSurvey) return;

    setIsSubmitting(true);
    try {
      const platform = detectPlatform();
      const res = await fetch(`${API_BASE}/surveys/${activeSurvey.id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          answers,
          platform,
          metadata: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem(`survey-completed-${activeSurvey.id}`, 'true');
        toast.success('Thank you for your feedback!');
        setShowFeedbackButton(false);
        handleClose();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to submit survey:', error);
      toast.error('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentQuestionIndex(0);
      setAnswers({});
    }, 300);
  };

  const handleOpenSurvey = () => {
    if (activeSurvey) {
      setIsVisible(true);
    } else {
      loadActiveSurvey(false).then(() => {
        setTimeout(() => setIsVisible(true), 100);
      });
    }
  };

  const currentQuestion = activeSurvey?.questions[currentQuestionIndex];
  const progress = activeSurvey ? ((currentQuestionIndex + 1) / activeSurvey.questions.length) * 100 : 0;

  return (
    <>
      {/* Floating Feedback Button */}
      {showFeedbackButton && !isVisible && (
        <button
          onClick={handleOpenSurvey}
          className="fixed left-0 top-1/2 -translate-y-1/2 bg-stone-900 text-white px-4 py-6 rounded-r-lg shadow-lg hover:bg-stone-800 transition-all z-40 group"
          style={{ writingMode: 'vertical-rl' }}
        >
          <span className="flex items-center gap-2 font-medium">
            <span>📋</span>
            <span>Feedback</span>
          </span>
        </button>
      )}

      {/* Survey Modal */}
      {activeSurvey && isVisible && currentQuestion && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
            onClick={handleClose}
          />
          
          {/* Survey Form - Centered */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div 
              className="pointer-events-auto transition-all duration-300 transform w-full max-w-2xl"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: `scale(${isVisible ? 1 : 0.95})`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{activeSurvey.title}</CardTitle>
                      {activeSurvey.description && (
                        <CardDescription className="mt-2">{activeSurvey.description}</CardDescription>
                      )}
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-1 rounded-full hover:bg-black/10 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-stone-600 mb-2">
                      <span>Question {currentQuestionIndex + 1} of {activeSurvey.questions.length}</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2">
                      <div
                        className="bg-stone-900 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Question */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      {currentQuestion.question}
                      {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
                    </h3>

                    {/* Question Input Based on Type */}
                    {currentQuestion.type === 'text' && (
                      <Textarea
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                        placeholder="Type your answer here..."
                        rows={4}
                        className="w-full"
                      />
                    )}

                    {currentQuestion.type === 'rating' && (
                      <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => handleAnswer(currentQuestion.id, rating)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              answers[currentQuestion.id] === rating
                                ? 'border-stone-900 bg-stone-900 text-white'
                                : 'border-stone-300 hover:border-stone-400'
                            }`}
                          >
                            <Star className={`w-6 h-6 ${answers[currentQuestion.id] === rating ? 'fill-white' : ''}`} />
                          </button>
                        ))}
                      </div>
                    )}

                    {currentQuestion.type === 'nps' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-stone-600 mb-2">
                          <span>Not at all likely</span>
                          <span>Extremely likely</span>
                        </div>
                        <div className="grid grid-cols-11 gap-1">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                            <button
                              key={score}
                              onClick={() => handleAnswer(currentQuestion.id, score)}
                              className={`p-3 rounded text-sm font-medium transition-all ${
                                answers[currentQuestion.id] === score
                                  ? 'bg-stone-900 text-white'
                                  : 'bg-stone-100 hover:bg-stone-200'
                              }`}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentQuestion.type === 'yes-no' && (
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => handleAnswer(currentQuestion.id, 'yes')}
                          className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                            answers[currentQuestion.id] === 'yes'
                              ? 'border-stone-900 bg-stone-900 text-white'
                              : 'border-stone-300 hover:border-stone-400'
                          }`}
                        >
                          <ThumbsUp className="w-5 h-5" />
                          Yes
                        </button>
                        <button
                          onClick={() => handleAnswer(currentQuestion.id, 'no')}
                          className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                            answers[currentQuestion.id] === 'no'
                              ? 'border-stone-900 bg-stone-900 text-white'
                              : 'border-stone-300 hover:border-stone-400'
                          }`}
                        >
                          <ThumbsDown className="w-5 h-5" />
                          No
                        </button>
                      </div>
                    )}

                    {currentQuestion.type === 'multiple-choice' && (
                      <div className="space-y-2">
                        {currentQuestion.options?.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleAnswer(currentQuestion.id, option)}
                            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                              answers[currentQuestion.id] === option
                                ? 'border-stone-900 bg-stone-900 text-white'
                                : 'border-stone-300 hover:border-stone-400'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 pt-4">
                    {currentQuestionIndex > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        className="flex-1"
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {currentQuestionIndex === activeSurvey.questions.length - 1
                        ? (isSubmitting ? 'Submitting...' : 'Submit')
                        : 'Next'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </>
  );
}
