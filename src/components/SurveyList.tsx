
import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Plus, Calendar, Users, Share2, Download, Filter, Search, FileText } from 'lucide-react';

interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
  responseCount?: number;
  questions: any[];
}

const SurveyList: React.FC<{ user: any }> = ({ user }) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [filteredSurveys, setFilteredSurveys] = useState<Survey[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'closed'>('all');
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [showResponses, setShowResponses] = useState(false);

  useEffect(() => {
    loadSurveys();
  }, []);

  useEffect(() => {
    filterSurveys();
  }, [surveys, searchTerm, statusFilter]);

  const loadSurveys = () => {
    const storedSurveys = JSON.parse(localStorage.getItem('hrSurveys') || '[]');
    
    // Add sample surveys if none exist
    if (storedSurveys.length === 0) {
      const sampleSurveys: Survey[] = [
        {
          id: '1',
          title: 'Employee Satisfaction Survey Q1 2024',
          description: 'Quarterly employee satisfaction and engagement assessment',
          status: 'published',
          createdAt: '2024-01-15',
          responseCount: 45,
          questions: []
        },
        {
          id: '2',
          title: 'Remote Work Effectiveness Study',
          description: 'Evaluating the impact and effectiveness of our remote work policies',
          status: 'published',
          createdAt: '2024-02-01',
          responseCount: 32,
          questions: []
        },
        {
          id: '3',
          title: 'Training & Development Needs Assessment',
          description: 'Identifying skill gaps and training requirements across departments',
          status: 'draft',
          createdAt: '2024-02-10',
          responseCount: 0,
          questions: []
        },
        {
          id: '4',
          title: 'Workplace Culture & Values Survey',
          description: 'Understanding how well our company values align with employee experience',
          status: 'published',
          createdAt: '2024-01-28',
          responseCount: 28,
          questions: []
        },
        {
          id: '5',
          title: 'Exit Interview Feedback Form',
          description: 'Collecting insights from departing employees',
          status: 'closed',
          createdAt: '2023-12-15',
          responseCount: 12,
          questions: []
        }
      ];
      
      localStorage.setItem('hrSurveys', JSON.stringify(sampleSurveys));
      setSurveys(sampleSurveys);
    } else {
      setSurveys(storedSurveys);
    }
  };

  const filterSurveys = () => {
    let filtered = surveys;

    if (searchTerm) {
      filtered = filtered.filter(survey =>
        survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(survey => survey.status === statusFilter);
    }

    setFilteredSurveys(filtered);
  };

  const deleteSurvey = (surveyId: string) => {
    if (confirm('Are you sure you want to delete this survey?')) {
      const updatedSurveys = surveys.filter(s => s.id !== surveyId);
      setSurveys(updatedSurveys);
      localStorage.setItem('hrSurveys', JSON.stringify(updatedSurveys));
    }
  };

  const duplicateSurvey = (survey: Survey) => {
    const duplicatedSurvey: Survey = {
      ...survey,
      id: Date.now().toString(),
      title: `${survey.title} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      responseCount: 0
    };

    const updatedSurveys = [...surveys, duplicatedSurvey];
    setSurveys(updatedSurveys);
    localStorage.setItem('hrSurveys', JSON.stringify(updatedSurveys));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canEdit = (survey: Survey) => {
    return user.role === 'admin' || user.role === 'hr_manager';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Surveys</h1>
          <p className="text-gray-600 mt-1">Manage and monitor your HR surveys</p>
        </div>
        {canEdit({ status: 'draft' } as Survey) && (
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Create Survey
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search surveys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="w-4 h-4 text-gray-400 mr-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Survey Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurveys.map((survey) => (
          <div key={survey.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {survey.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {survey.description}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(survey.status)}`}>
                  {survey.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(survey.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {survey.responseCount || 0} responses
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedSurvey(survey);
                      setShowResponses(true);
                    }}
                    className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  
                  {canEdit(survey) && (
                    <button className="flex items-center px-3 py-1 text-gray-600 hover:bg-gray-50 rounded transition-colors">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  )}
                </div>

                <div className="flex space-x-1">
                  {survey.status === 'published' && (
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => duplicateSurvey(survey)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                    title="Duplicate survey"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {canEdit(survey) && (
                    <button
                      onClick={() => deleteSurvey(survey.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSurveys.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first survey.'}
          </p>
          {canEdit({ status: 'draft' } as Survey) && !searchTerm && statusFilter === 'all' && (
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Survey
            </button>
          )}
        </div>
      )}

      {/* Survey Response Modal */}
      {showResponses && selectedSurvey && (
        <SurveyResponseModal
          survey={selectedSurvey}
          onClose={() => {
            setShowResponses(false);
            setSelectedSurvey(null);
          }}
        />
      )}
    </div>
  );
};

const SurveyResponseModal: React.FC<{
  survey: Survey;
  onClose: () => void;
}> = ({ survey, onClose }) => {
  // Mock response data
  const mockResponses = [
    {
      id: '1',
      respondentName: 'Anonymous Employee #1',
      submittedAt: '2024-02-15T10:30:00Z',
      department: 'Engineering',
      responses: {
        satisfaction: 4,
        workLifeBalance: 3,
        management: 5,
        feedback: 'Overall satisfied with the work environment and team collaboration.'
      }
    },
    {
      id: '2',
      respondentName: 'Anonymous Employee #2',
      submittedAt: '2024-02-14T14:22:00Z',
      department: 'Marketing',
      responses: {
        satisfaction: 5,
        workLifeBalance: 4,
        management: 4,
        feedback: 'Great company culture and opportunities for growth.'
      }
    },
    {
      id: '3',
      respondentName: 'Anonymous Employee #3',
      submittedAt: '2024-02-13T09:15:00Z',
      department: 'Sales',
      responses: {
        satisfaction: 3,
        workLifeBalance: 2,
        management: 3,
        feedback: 'Need better work-life balance and clearer communication from management.'
      }
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{survey.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{survey.responseCount || 0} responses collected</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {mockResponses.map((response) => (
              <div key={response.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900">{response.respondentName}</span>
                  <div className="text-sm text-gray-500">
                    <span className="mr-4">{response.department}</span>
                    {new Date(response.submittedAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{response.responses.satisfaction}/5</div>
                    <div className="text-xs text-gray-600">Overall Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{response.responses.workLifeBalance}/5</div>
                    <div className="text-xs text-gray-600">Work-Life Balance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{response.responses.management}/5</div>
                    <div className="text-xs text-gray-600">Management</div>
                  </div>
                </div>

                {response.responses.feedback && (
                  <div className="mt-3 p-3 bg-white rounded border-l-4 border-blue-500">
                    <p className="text-sm text-gray-700">{response.responses.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Responses
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyList;
