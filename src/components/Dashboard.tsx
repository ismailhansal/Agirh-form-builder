
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, FileText, Activity, Calendar, Award, AlertCircle, CheckCircle } from 'lucide-react';

interface DashboardProps {
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);

  useEffect(() => {
    // Load mock data
    const mockSurveys = JSON.parse(localStorage.getItem('hrSurveys') || '[]');
    const mockResponses = JSON.parse(localStorage.getItem('hrSurveyResponses') || '[]');
    
    // Add some sample data if none exists
    if (mockSurveys.length === 0) {
      const sampleSurveys = [
        {
          id: '1',
          title: 'Employee Satisfaction Survey',
          description: 'Annual employee satisfaction and engagement survey',
          status: 'published',
          createdAt: '2024-01-15',
          responseCount: 45,
          questions: []
        },
        {
          id: '2',
          title: 'Remote Work Assessment',
          description: 'Assessing the effectiveness of remote work policies',
          status: 'published',
          createdAt: '2024-02-01',
          responseCount: 32,
          questions: []
        },
        {
          id: '3',
          title: 'Training Needs Analysis',
          description: 'Identifying training and development needs',
          status: 'draft',
          createdAt: '2024-02-10',
          responseCount: 0,
          questions: []
        }
      ];
      localStorage.setItem('hrSurveys', JSON.stringify(sampleSurveys));
      setSurveys(sampleSurveys);
    } else {
      setSurveys(mockSurveys);
    }

    // Generate sample response data
    const sampleResponses = generateSampleResponses();
    setResponses(sampleResponses);
  }, []);

  const generateSampleResponses = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const responseData = months.map(month => ({
      month,
      responses: Math.floor(Math.random() * 50) + 20,
      satisfaction: Math.floor(Math.random() * 2) + 4, // 4-5 rating
      engagement: Math.floor(Math.random() * 30) + 70, // 70-100%
    }));

    return responseData;
  };

  const satisfactionData = [
    { name: 'Very Satisfied', value: 35, color: '#10B981' },
    { name: 'Satisfied', value: 28, color: '#3B82F6' },
    { name: 'Neutral', value: 20, color: '#F59E0B' },
    { name: 'Dissatisfied', value: 12, color: '#EF4444' },
    { name: 'Very Dissatisfied', value: 5, color: '#DC2626' },
  ];

  const departmentData = [
    { department: 'Engineering', responses: 25, satisfaction: 4.2 },
    { department: 'Marketing', responses: 18, satisfaction: 4.0 },
    { department: 'Sales', responses: 22, satisfaction: 3.8 },
    { department: 'HR', responses: 12, satisfaction: 4.5 },
    { department: 'Finance', responses: 15, satisfaction: 4.1 },
  ];

  const totalSurveys = surveys.length;
  const activeSurveys = surveys.filter(s => s.status === 'published').length;
  const totalResponses = surveys.reduce((sum, s) => sum + (s.responseCount || 0), 0);
  const averageSatisfaction = 4.1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your HR survey analytics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Surveys"
          value={totalSurveys.toString()}
          icon={FileText}
          color="blue"
          change="+12%"
          changeType="positive"
        />
        <MetricCard
          title="Active Surveys"
          value={activeSurveys.toString()}
          icon={Activity}
          color="green"
          change="+8%"
          changeType="positive"
        />
        <MetricCard
          title="Total Responses"
          value={totalResponses.toString()}
          icon={Users}
          color="purple"
          change="+23%"
          changeType="positive"
        />
        <MetricCard
          title="Avg. Satisfaction"
          value={averageSatisfaction.toFixed(1)}
          icon={Award}
          color="yellow"
          change="+0.3"
          changeType="positive"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={responses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="responses" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Satisfaction Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Satisfaction Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={satisfactionData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {satisfactionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Response Rates</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="responses" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Over Time */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Engagement Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={responses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Surveys */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Surveys</h3>
          <div className="space-y-4">
            {surveys.slice(0, 5).map((survey) => (
              <div key={survey.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{survey.title}</h4>
                  <p className="text-sm text-gray-600">{survey.responseCount || 0} responses</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    survey.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {survey.status}
                  </span>
                  {survey.status === 'published' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex">
                <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800">Response Rate Increasing</p>
                  <p className="text-sm text-blue-600">Survey response rates have increased by 23% this month</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="flex">
                <Award className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">High Satisfaction Scores</p>
                  <p className="text-sm text-green-600">HR department shows highest satisfaction ratings at 4.5/5</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800">Attention Needed</p>
                  <p className="text-sm text-yellow-600">Sales department has lower engagement scores - follow up recommended</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <div className="flex">
                <Calendar className="w-5 h-5 text-purple-500 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-800">Quarterly Review Due</p>
                  <p className="text-sm text-purple-600">Q1 employee satisfaction survey is scheduled for next week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, color, change, changeType }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
  };

  const changeClasses = {
    positive: 'text-green-600 bg-green-100',
    negative: 'text-red-600 bg-red-100',
    neutral: 'text-gray-600 bg-gray-100',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${changeClasses[changeType]}`}>
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-2">from last month</span>
      </div>
    </div>
  );
};

export default Dashboard;
