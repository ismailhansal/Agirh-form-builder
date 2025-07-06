
import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, GripVertical, Trash2, Eye, Save, Type, List, Star, CheckSquare, Calendar, Hash, ArrowLeft, FileText } from 'lucide-react';
import SurveyTemplates from './SurveyTemplates';

interface QuestionType {
  id: string;
  type: 'text' | 'multiple_choice' | 'rating' | 'checkbox' | 'date' | 'number';
  title: string;
  required: boolean;
  options?: string[];
}

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: QuestionType[];
  createdAt: string;
  status: 'draft' | 'published' | 'closed';
}

interface SurveyBuilderProps {
  user: any;
  editingSurveyId?: string;
  onNavigate?: (view: string) => void;
}

const SurveyBuilder: React.FC<SurveyBuilderProps> = ({ user, editingSurveyId, onNavigate }) => {
  const [survey, setSurvey] = useState<Survey>({
    id: Date.now().toString(),
    title: 'Nouveau sondage',
    description: '',
    questions: [],
    createdAt: new Date().toISOString(),
    status: 'draft'
  });

  const [showPreview, setShowPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const dragCounter = useRef(0);

  // Load existing survey if editing
  useEffect(() => {
    if (editingSurveyId) {
      const storedSurveys = JSON.parse(localStorage.getItem('hrSurveys') || '[]');
      const existingSurvey = storedSurveys.find((s: Survey) => s.id === editingSurveyId);
      if (existingSurvey) {
        setSurvey(existingSurvey);
      }
    }
  }, [editingSurveyId]);

  const questionTypes = [
    { type: 'text', icon: Type, label: 'Saisie de texte', description: 'Texte sur une ligne' },
    { type: 'multiple_choice', icon: List, label: 'Choix multiple', description: 'Boutons radio' },
    { type: 'rating', icon: Star, label: 'Échelle de notation', description: 'Notation 1-5 étoiles' },
    { type: 'checkbox', icon: CheckSquare, label: 'Cases à cocher', description: 'Sélections multiples' },
    { type: 'date', icon: Calendar, label: 'Date', description: 'Sélecteur de date' },
    { type: 'number', icon: Hash, label: 'Nombre', description: 'Saisie numérique' },
  ];

  const handleSelectTemplate = (template: any) => {
    const questionsWithIds = template.questions.map((q: any) => ({
      ...q,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }));

    setSurvey(prev => ({
      ...prev,
      title: template.name,
      description: template.description,
      questions: questionsWithIds
    }));

    setShowTemplates(false);
  };

  const addQuestion = (type: string) => {
    const newQuestion: QuestionType = {
      id: Date.now().toString(),
      type: type as any,
      title: `Nouvelle question ${type.replace('_', ' ')}`,
      required: false,
      options: ['multiple_choice', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : undefined
    };

    setSurvey(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<QuestionType>) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  const deleteQuestion = (questionId: string) => {
    setSurvey(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(survey.questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSurvey(prev => ({ ...prev, questions: items }));
  };

  const saveSurvey = () => {
    const existingSurveys = JSON.parse(localStorage.getItem('hrSurveys') || '[]');
    const updatedSurveys = existingSurveys.filter((s: Survey) => s.id !== survey.id);
    updatedSurveys.push(survey);
    localStorage.setItem('hrSurveys', JSON.stringify(updatedSurveys));
    alert('Sondage sauvegardé avec succès !');
  };

  const publishSurvey = () => {
    const updatedSurvey = { ...survey, status: 'published' as const };
    setSurvey(updatedSurvey);
    
    const existingSurveys = JSON.parse(localStorage.getItem('hrSurveys') || '[]');
    const updatedSurveys = existingSurveys.filter((s: Survey) => s.id !== survey.id);
    updatedSurveys.push(updatedSurvey);
    localStorage.setItem('hrSurveys', JSON.stringify(updatedSurveys));
    alert('Sondage publié avec succès !');
  };

  const handleBackToSurveys = () => {
    if (onNavigate) {
      onNavigate('surveys');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToSurveys}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux sondages
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {editingSurveyId ? 'Modifier le sondage' : 'Créateur de sondages'}
            </h1>
            <p className="text-gray-600 mt-1">Créez et personnalisez vos sondages RH</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center px-4 py-2 text-purple-700 bg-purple-100 border border-purple-300 rounded-lg hover:bg-purple-200 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            Utiliser un modèle
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Modifier' : 'Aperçu'}
          </button>
          <button
            onClick={saveSurvey}
            className="flex items-center px-4 py-2 text-blue-700 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder brouillon
          </button>
          <button
            onClick={publishSurvey}
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Publier le sondage
          </button>
        </div>
      </div>

      {showPreview ? (
        <SurveyPreview survey={survey} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Types Palette */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Types de questions</h3>
              <div className="space-y-2">
                {questionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.type}
                      onClick={() => addQuestion(type.type)}
                      className="w-full flex items-center p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                      <Icon className="w-5 h-5 text-gray-600 mr-3 group-hover:text-blue-600" />
                      <div>
                        <div className="font-medium text-sm text-gray-900">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Survey Builder */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Survey Header */}
              <div className="p-6 border-b">
                <input
                  type="text"
                  value={survey.title}
                  onChange={(e) => setSurvey(prev => ({ ...prev, title: e.target.value }))}
                  className="text-2xl font-bold text-gray-900 border-none outline-none w-full bg-transparent"
                  placeholder="Titre du sondage"
                />
                <textarea
                  value={survey.description}
                  onChange={(e) => setSurvey(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-2 text-gray-600 border-none outline-none w-full bg-transparent resize-none"
                  placeholder="Description du sondage (optionnel)"
                  rows={2}
                />
              </div>

              {/* Questions */}
              <div className="p-6">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="questions">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {survey.questions.map((question, index) => (
                          <Draggable key={question.id} draggableId={question.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`border rounded-lg p-4 bg-white ${
                                  snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                                } transition-shadow`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div {...provided.dragHandleProps} className="mt-2">
                                    <GripVertical className="w-5 h-5 text-gray-400" />
                                  </div>
                                  <div className="flex-1">
                                    <QuestionEditor
                                      question={question}
                                      onUpdate={(updates) => updateQuestion(question.id, updates)}
                                      onDelete={() => deleteQuestion(question.id)}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {survey.questions.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="mb-2">Aucune question pour le moment. Commencez par :</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowTemplates(true)}
                        className="block mx-auto text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Utiliser un modèle
                      </button>
                      <p className="text-gray-400">ou</p>
                      <p>Ajouter des questions depuis le panneau de gauche</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Survey Templates Modal */}
      {showTemplates && (
        <SurveyTemplates
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
};

const QuestionEditor: React.FC<{
  question: QuestionType;
  onUpdate: (updates: Partial<QuestionType>) => void;
  onDelete: () => void;
}> = ({ question, onUpdate, onDelete }) => {
  const addOption = () => {
    const newOption = `Option ${(question.options?.length || 0) + 1}`;
    onUpdate({ options: [...(question.options || []), newOption] });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = question.options?.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'text': return 'Question texte';
      case 'multiple_choice': return 'Question choix multiple';
      case 'rating': return 'Question notation';
      case 'checkbox': return 'Question cases à cocher';
      case 'date': return 'Question date';
      case 'number': return 'Question nombre';
      default: return 'Question';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={question.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="text-lg font-medium text-gray-900 border-none outline-none bg-transparent flex-1"
          placeholder="Titre de la question"
        />
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 p-1 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {(question.type === 'multiple_choice' || question.type === 'checkbox') && (
        <div className="space-y-2">
          {question.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              {question.type === 'multiple_choice' ? (
                <input type="radio" disabled className="text-blue-600" />
              ) : (
                <input type="checkbox" disabled className="text-blue-600" />
              )}
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
              />
              <button
                onClick={() => removeOption(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Supprimer
              </button>
            </div>
          ))}
          <button
            onClick={addOption}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            + Ajouter une option
          </button>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="mr-2 text-blue-600"
          />
          <span className="text-sm text-gray-600">Obligatoire</span>
        </label>
        <span className="text-xs text-gray-400">
          {getQuestionTypeLabel(question.type)}
        </span>
      </div>
    </div>
  );
};

const SurveyPreview: React.FC<{ survey: Survey }> = ({ survey }) => {
  const [responses, setResponses] = useState<Record<string, any>>({});

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
        {survey.description && (
          <p className="mt-2 text-gray-600">{survey.description}</p>
        )}
      </div>

      <div className="p-6 space-y-6">
        {survey.questions.map((question) => (
          <div key={question.id} className="space-y-3">
            <div className="flex items-center">
              <h3 className="text-lg font-medium text-gray-900">{question.title}</h3>
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </div>

            {question.type === 'text' && (
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Votre réponse"
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
              />
            )}

            {question.type === 'number' && (
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Votre réponse"
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
              />
            )}

            {question.type === 'date' && (
              <input
                type="date"
                className="border border-gray-300 rounded-lg px-3 py-2"
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
              />
            )}

            {question.type === 'multiple_choice' && (
              <div className="space-y-2">
                {question.options?.map((option, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      className="mr-3 text-blue-600"
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'checkbox' && (
              <div className="space-y-2">
                {question.options?.map((option, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      value={option}
                      className="mr-3 text-blue-600"
                      onChange={(e) => {
                        const currentValues = responses[question.id] || [];
                        if (e.target.checked) {
                          handleResponseChange(question.id, [...currentValues, option]);
                        } else {
                          handleResponseChange(question.id, currentValues.filter((v: string) => v !== option));
                        }
                      }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'rating' && (
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleResponseChange(question.id, rating)}
                    className={`p-2 rounded ${
                      responses[question.id] === rating
                        ? 'text-yellow-500'
                        : 'text-gray-300 hover:text-yellow-400'
                    } transition-colors`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="pt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Envoyer le sondage
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyBuilder;
