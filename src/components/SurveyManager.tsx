import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, BarChart3, Eye, Copy, Smartphone, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
  status: 'draft' | 'active' | 'closed';
  createdAt: string;
  responseCount: number;
}

export function SurveyManager() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      const res = await fetch(`${API_BASE}/surveys`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      const data = await res.json();
      if (data.success) {
        setSurveys(data.surveys || []);
      }
    } catch (error) {
      console.error('Failed to load surveys:', error);
      // Offline mode - load from localStorage
      const cached = localStorage.getItem('surveys');
      if (cached) {
        setSurveys(JSON.parse(cached));
      }
    }
  };

  const handleCreateSurvey = async (surveyData: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/surveys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(surveyData)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Survey created successfully!');
        setShowCreateDialog(false);
        loadSurveys();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to create survey:', error);
      toast.error('Failed to create survey');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSurvey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this survey?')) return;

    try {
      const res = await fetch(`${API_BASE}/surveys/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Survey deleted');
        loadSurveys();
      }
    } catch (error) {
      console.error('Failed to delete survey:', error);
      toast.error('Failed to delete survey');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/surveys/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Survey ${status}`);
        loadSurveys();
      }
    } catch (error) {
      console.error('Failed to update survey:', error);
      toast.error('Failed to update survey');
    }
  };

  const loadAnalytics = async (surveyId: string) => {
    try {
      const res = await fetch(`${API_BASE}/surveys/${surveyId}/analytics`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.analytics);
        setShowAnalyticsDialog(true);
      }
    } catch (error) {
      // Silent fail - backend not deployed is expected behavior
      toast.error('Backend not deployed yet - deploy to see analytics');
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios':
        return '🍎';
      case 'android':
        return '🤖';
      case 'web':
        return <Globe className="w-4 h-4" />;
      default:
        return <Smartphone className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Feedback Surveys</h2>
          <p className="text-stone-600 text-sm mt-1">
            Gather direct user feedback across web, iOS, and Android platforms
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Survey
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Survey</DialogTitle>
              <DialogDescription>
                Design a feedback survey to gather insights from your users
              </DialogDescription>
            </DialogHeader>
            <SurveyForm onSubmit={handleCreateSurvey} loading={loading} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Surveys Grid */}
      <div className="grid gap-4">
        {surveys.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="w-12 h-12 mx-auto text-stone-400 mb-4" />
              <p className="text-stone-600">No surveys yet. Create your first survey to start gathering feedback.</p>
            </CardContent>
          </Card>
        ) : (
          surveys.map((survey) => (
            <Card key={survey.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{survey.title}</CardTitle>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(survey.status)}`}>
                        {survey.status}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-stone-500">
                        {getPlatformIcon(survey.targetPlatform)}
                        <span className="capitalize">{survey.targetPlatform}</span>
                      </span>
                    </div>
                    <CardDescription>{survey.description}</CardDescription>
                    <div className="mt-2 text-sm text-stone-600">
                      {survey.questions.length} questions • {survey.responseCount || 0} responses
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSurvey(survey);
                        loadAnalytics(survey.id);
                      }}
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSurvey(survey.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {survey.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(survey.id, 'active')}
                    >
                      Activate Survey
                    </Button>
                  )}
                  {survey.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(survey.id, 'closed')}
                    >
                      Close Survey
                    </Button>
                  )}
                  {survey.status === 'closed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(survey.id, 'active')}
                    >
                      Reopen Survey
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Analytics Dialog */}
      <Dialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSurvey?.title} - Analytics</DialogTitle>
            <DialogDescription>Survey responses and insights</DialogDescription>
          </DialogHeader>
          {analytics && <SurveyAnalytics analytics={analytics} survey={selectedSurvey} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SurveyForm({ onSubmit, loading }: { onSubmit: (data: any) => Promise<void>; loading: boolean }) {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    targetPlatform: 'all',
    status: 'draft'
  });
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: '',
      required: true,
      options: type === 'multiple-choice' ? ['Option 1', 'Option 2'] : undefined
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }
    onSubmit({ ...formData, questions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Internal Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Q1 2026 User Satisfaction Survey"
            required
          />
        </div>

        <div>
          <Label htmlFor="title">Survey Title (shown to users)</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Help Us Improve Vision Studio"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the survey purpose"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="platform">Target Platform</Label>
          <Select value={formData.targetPlatform} onValueChange={(value) => setFormData({ ...formData, targetPlatform: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms (Web, iOS, Android)</SelectItem>
              <SelectItem value="web">Web Only</SelectItem>
              <SelectItem value="ios">iOS App Store Only</SelectItem>
              <SelectItem value="android">Google Play Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base">Questions</Label>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => addQuestion('text')}>
              + Text
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => addQuestion('rating')}>
              + Rating
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => addQuestion('multiple-choice')}>
              + Multiple Choice
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => addQuestion('yes-no')}>
              + Yes/No
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => addQuestion('nps')}>
              + NPS
            </Button>
          </div>
        </div>

        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <Label>Question {index + 1} ({question.type})</Label>
                    <Input
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                      placeholder="Enter your question"
                      className="mt-1"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {question.type === 'multiple-choice' && (
                  <div>
                    <Label className="text-sm">Options</Label>
                    {question.options?.map((option, optIndex) => (
                      <Input
                        key={optIndex}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(question.options || [])];
                          newOptions[optIndex] = e.target.value;
                          updateQuestion(question.id, { options: newOptions });
                        }}
                        placeholder={`Option ${optIndex + 1}`}
                        className="mt-1"
                      />
                    ))}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
                        updateQuestion(question.id, { options: newOptions });
                      }}
                    >
                      + Add Option
                    </Button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`required-${question.id}`}
                    checked={question.required}
                    onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor={`required-${question.id}`} className="cursor-pointer text-sm">
                    Required question
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {questions.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-stone-600">Add questions to your survey using the buttons above</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? 'Creating...' : 'Create Survey'}
        </Button>
      </div>
    </form>
  );
}

function SurveyAnalytics({ analytics, survey }: { analytics: any; survey: Survey | null }) {
  if (!analytics || !survey) return null;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{analytics.totalResponses || 0}</div>
            <div className="text-sm text-stone-600">Total Responses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{analytics.platformBreakdown?.web || 0}</div>
            <div className="text-sm text-stone-600">Web Responses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{analytics.platformBreakdown?.ios || 0}</div>
            <div className="text-sm text-stone-600">iOS Responses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{analytics.platformBreakdown?.android || 0}</div>
            <div className="text-sm text-stone-600">Android Responses</div>
          </CardContent>
        </Card>
      </div>

      {/* Question Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Question Results</h3>
        {survey.questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-base">Q{index + 1}: {question.question}</CardTitle>
              <CardDescription>{question.type}</CardDescription>
            </CardHeader>
            <CardContent>
              {question.type === 'rating' || question.type === 'nps' ? (
                <div>
                  <div className="text-3xl font-bold mb-2">
                    {analytics.questionResults?.[question.id]?.average?.toFixed(1) || 'N/A'}
                  </div>
                  <div className="text-sm text-stone-600">
                    Average Score ({analytics.questionResults?.[question.id]?.count || 0} responses)
                  </div>
                </div>
              ) : question.type === 'multiple-choice' ? (
                <div className="space-y-2">
                  {question.options?.map((option) => {
                    const count = analytics.questionResults?.[question.id]?.options?.[option] || 0;
                    const total = analytics.questionResults?.[question.id]?.count || 0;
                    const percentage = total > 0 ? (count / total * 100).toFixed(0) : 0;
                    return (
                      <div key={option}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{option}</span>
                          <span className="text-stone-600">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-2">
                          <div
                            className="bg-stone-900 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : question.type === 'yes-no' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">
                      {analytics.questionResults?.[question.id]?.yes || 0}
                    </div>
                    <div className="text-sm text-stone-600">Yes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {analytics.questionResults?.[question.id]?.no || 0}
                    </div>
                    <div className="text-sm text-stone-600">No</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {analytics.questionResults?.[question.id]?.responses?.map((response: string, i: number) => (
                    <div key={i} className="p-3 bg-stone-50 rounded text-sm">
                      {response}
                    </div>
                  )) || <p className="text-stone-600 text-sm">No responses yet</p>}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
