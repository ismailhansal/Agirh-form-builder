import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, FileText, TrendingUp, Clock, Eye, Download } from 'lucide-react';

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

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [stats, setStats] = useState({
    totalSurveys: 0,
    activeSurveys: 0,
    totalResponses: 0,
    avgResponseRate: 0
  });

  useEffect(() => {
    // Load surveys from localStorage
    const storedSurveys = JSON.parse(localStorage.getItem('hrSurveys') || '[]');
    setSurveys(storedSurveys);

    // Calculate stats
    const totalSurveys = storedSurveys.length;
    const activeSurveys = storedSurveys.filter((s: Survey) => s.status === 'published').length;
    const totalResponses = storedSurveys.reduce((sum: number, s: Survey) => sum + (s.responses || 0), 0);
    const avgResponseRate = totalSurveys > 0 ? Math.round((totalResponses / totalSurveys) * 100) / 100 : 0;

    setStats({
      totalSurveys,
      activeSurveys,
      totalResponses,
      avgResponseRate
    });
  }, []);

  // Sample data for charts - translated
  const surveyData = [
    { name: 'Satisfaction employés', responses: 45, completion: 78 },
    { name: 'Évaluation performance', responses: 32, completion: 65 },
    { name: 'Retour formation', responses: 28, completion: 85 },
    { name: 'Entretien de départ', responses: 12, completion: 92 }
  ];

  const statusData = [
    { name: 'Publié', value: stats.activeSurveys, color: '#10B981' },
    { name: 'Brouillon', value: stats.totalSurveys - stats.activeSurveys, color: '#F59E0B' }
  ];

  const responseData = [
    { month: 'Jan', responses: 65 },
    { month: 'Fév', responses: 78 },
    { month: 'Mar', responses: 82 },
    { month: 'Avr', responses: 95 },
    { month: 'Mai', responses: 87 },
    { month: 'Juin', responses: 102 }
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'publié';
      case 'draft': return 'brouillon';
      case 'closed': return 'fermé';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Bon retour, {user.name}</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Exporter le rapport
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total sondages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSurveys}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sondages actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeSurveys}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total réponses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalResponses}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux de réponse moy.</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgResponseRate}%</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Survey Responses Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Réponses aux sondages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={surveyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="responses" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Survey Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut des sondages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-4">
            {statusData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Response Trend */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendance des réponses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={responseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="responses" stroke="#10B981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Surveys */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Sondages récents</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Voir tout
          </button>
        </div>
        <div className="space-y-4">
          {surveys.slice(0, 5).map((survey) => (
            <div key={survey.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{survey.title}</h4>
                <p className="text-sm text-gray-600">
                  Créé le {new Date(survey.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  survey.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : survey.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {getStatusText(survey.status)}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
