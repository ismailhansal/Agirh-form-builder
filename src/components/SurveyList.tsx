
import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Plus, Calendar, Users, Share2, Download, Filter, Search, FileText } from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'hr_manager' | 'employee';
  email: string;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: any[];
  createdAt: string;
  status: 'draft' | 'published' | 'closed';
  responses?: number;
}

interface SurveyListProps {
  user: User;
  onNavigate?: (view: string, surveyId?: string) => void;
}

const SurveyList: React.FC<SurveyListProps> = ({ user, onNavigate }) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [filteredSurveys, setFilteredSurveys] = useState<Survey[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'closed'>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadSurveys();
  }, []);

  useEffect(() => {
    filterSurveys();
  }, [surveys, searchTerm, statusFilter]);

  const loadSurveys = () => {
    const storedSurveys = JSON.parse(localStorage.getItem('hrSurveys') || '[]');
    setSurveys(storedSurveys);
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
    const updatedSurveys = surveys.filter(survey => survey.id !== surveyId);
    setSurveys(updatedSurveys);
    localStorage.setItem('hrSurveys', JSON.stringify(updatedSurveys));
    setShowDeleteModal(false);
    setSurveyToDelete(null);
  };

  const duplicateSurvey = (survey: Survey) => {
    const newSurvey = {
      ...survey,
      id: Date.now().toString(),
      title: `${survey.title} (Copy)`,
      createdAt: new Date().toISOString(),
      status: 'draft' as const
    };
    
    const updatedSurveys = [...surveys, newSurvey];
    setSurveys(updatedSurveys);
    localStorage.setItem('hrSurveys', JSON.stringify(updatedSurveys));
  };

  const handleCreateSurvey = () => {
    if (onNavigate) {
      onNavigate('builder');
    }
  };

  const handleEditSurvey = (surveyId: string) => {
    if (onNavigate) {
      onNavigate('builder', surveyId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const hasPermission = (action: string) => {
    if (user.role === 'admin') return true;
    if (user.role === 'hr_manager' && ['create', 'edit', 'delete'].includes(action)) return true;
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Surveys</h1>
          <p className="text-gray-600 mt-1">Manage and monitor your HR surveys</p>
        </div>
        {hasPermission('create') && (
          <button
            onClick={handleCreateSurvey}
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Survey
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search surveys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="flex items-center px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{survey.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{survey.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(survey.status)}`}>
                  {survey.status}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(survey.createdAt).toLocaleDateString()}
                <Users className="w-4 h-4 ml-4 mr-1" />
                {survey.responses || 0} responses
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  {hasPermission('edit') && (
                    <button 
                      onClick={() => handleEditSurvey(survey.id)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
                {hasPermission('delete') && (
                  <button
                    onClick={() => {
                      setSurveyToDelete(survey.id);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {survey.questions.length} questions
                </span>
                <div className="flex space-x-2">
                  {survey.status === 'published' && (
                    <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      View Results
                    </button>
                  )}
                  {hasPermission('edit') && (
                    <button
                      onClick={() => duplicateSurvey(survey)}
                      className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200"
                    >
                      Duplicate
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
          <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first survey'
            }
          </p>
          {hasPermission('create') && !searchTerm && statusFilter === 'all' && (
            <button
              onClick={handleCreateSurvey}
              className="inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Survey
            </button>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Survey</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this survey? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSurveyToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => surveyToDelete && deleteSurvey(surveyToDelete)}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyList;
