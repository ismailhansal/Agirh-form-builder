
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import SurveyBuilder from '../components/SurveyBuilder';
import FormBuilder from '../components/FormBuilder';
import Dashboard from '../components/Dashboard';
import SurveyList from '../components/SurveyList';
import FormList from '../components/FormList';
import Login from '../components/Login';
import { Users, BarChart3, FileText, Settings, LogOut, FormInput } from 'lucide-react';

// Mock user context
interface User {
  id: string;
  name: string;
  role: 'admin' | 'hr_manager' | 'employee';
  email: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [editingSurveyId, setEditingSurveyId] = useState<string | undefined>(undefined);
  const [editingFormId, setEditingFormId] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('hrSurveyUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('hrSurveyUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hrSurveyUser');
    setCurrentView('dashboard');
  };

  const handleNavigate = (view: string, itemId?: string) => {
    setCurrentView(view);
    if (view === 'builder') {
      setEditingSurveyId(itemId);
      setEditingFormId(undefined);
    } else if (view === 'form-builder') {
      setEditingFormId(itemId);
      setEditingSurveyId(undefined);
    } else {
      setEditingSurveyId(undefined);
      setEditingFormId(undefined);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const hasPermission = (requiredRole: string) => {
    const roleHierarchy = { admin: 3, hr_manager: 2, employee: 1 };
    const userLevel = roleHierarchy[user.role];
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy];
    return userLevel >= requiredLevel;
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'hr_manager': return 'Responsable RH';
      case 'employee': return 'Employé';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">AGIRH</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Bienvenue, <span className="font-medium">{user.name}</span>
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {getRoleLabel(user.role)}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Tableau de bord
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('surveys')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentView === 'surveys'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-5 h-5 mr-3" />
                  Sondages
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('forms')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentView === 'forms'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FormInput className="w-5 h-5 mr-3" />
                  Formulaires
                </button>
              </li>
              {hasPermission('hr_manager') && (
                <>
                  <li>
                    <button
                      onClick={() => handleNavigate('builder')}
                      className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentView === 'builder'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Settings className="w-5 h-5 mr-3" />
                      Créateur de sondages
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigate('form-builder')}
                      className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentView === 'form-builder'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FormInput className="w-5 h-5 mr-3" />
                      Créateur de formulaires
                    </button>
                  </li>
                </>
              )}
              {hasPermission('admin') && (
                <li>
                  <button
                    onClick={() => handleNavigate('users')}
                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentView === 'users'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Users className="w-5 h-5 mr-3" />
                    Gestion des utilisateurs
                  </button>
                </li>
              )}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {currentView === 'dashboard' && <Dashboard user={user} />}
          {currentView === 'surveys' && <SurveyList user={user} onNavigate={handleNavigate} />}
          {currentView === 'forms' && <FormList user={user} onNavigate={handleNavigate} />}
          {currentView === 'builder' && hasPermission('hr_manager') && (
            <SurveyBuilder user={user} editingSurveyId={editingSurveyId} onNavigate={handleNavigate} />
          )}
          {currentView === 'form-builder' && hasPermission('hr_manager') && (
            <FormBuilder user={user} editingFormId={editingFormId} onNavigate={handleNavigate} />
          )}
          {currentView === 'users' && hasPermission('admin') && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des utilisateurs</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">La fonctionnalité de gestion des utilisateurs sera implémentée ici.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
