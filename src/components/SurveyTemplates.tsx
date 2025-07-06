
import React from 'react';
import { FileText, Users, Star, Heart, Briefcase, GraduationCap } from 'lucide-react';

interface QuestionType {
  id: string;
  type: 'text' | 'multiple_choice' | 'rating' | 'checkbox' | 'date' | 'number';
  title: string;
  required: boolean;
  options?: string[];
}

interface SurveyTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  questions: Omit<QuestionType, 'id'>[];
}

interface SurveyTemplatesProps {
  onSelectTemplate: (template: SurveyTemplate) => void;
  onClose: () => void;
}

const surveyTemplates: SurveyTemplate[] = [
  {
    id: 'employee-satisfaction',
    name: 'Sondage de satisfaction des employés',
    description: 'Mesurez la satisfaction et l\'engagement global des employés',
    icon: Users,
    category: 'RH',
    questions: [
      {
        type: 'rating',
        title: 'À quel point êtes-vous satisfait de votre poste actuel ?',
        required: true
      },
      {
        type: 'rating',
        title: 'Comment évalueriez-vous votre équilibre vie professionnelle-vie privée ?',
        required: true
      },
      {
        type: 'multiple_choice',
        title: 'Qu\'est-ce qui vous motive le plus au travail ?',
        required: true,
        options: ['Évolution de carrière', 'Reconnaissance', 'Rémunération', 'Environnement de travail', 'Collaboration d\'équipe']
      },
      {
        type: 'text',
        title: 'Quelles améliorations suggéreriez-vous pour le lieu de travail ?',
        required: false
      }
    ]
  },
  {
    id: 'performance-review',
    name: 'Sondage d\'évaluation de performance',
    description: 'Modèle d\'évaluation de performance complet',
    icon: Star,
    category: 'RH',
    questions: [
      {
        type: 'rating',
        title: 'Évaluez votre performance globale ce trimestre',
        required: true
      },
      {
        type: 'checkbox',
        title: 'Quels objectifs avez-vous atteints ce trimestre ?',
        required: true,
        options: ['Objectif 1', 'Objectif 2', 'Objectif 3', 'Objectif 4']
      },
      {
        type: 'text',
        title: 'Quelles ont été vos principales réalisations ?',
        required: true
      },
      {
        type: 'text',
        title: 'Dans quels domaines aimeriez-vous vous améliorer ?',
        required: true
      },
      {
        type: 'rating',
        title: 'Comment évalueriez-vous votre collaboration avec les membres de l\'équipe ?',
        required: true
      }
    ]
  },
  {
    id: 'onboarding-feedback',
    name: 'Intégration des nouveaux employés',
    description: 'Recueillez des commentaires sur l\'expérience d\'intégration',
    icon: GraduationCap,
    category: 'RH',
    questions: [
      {
        type: 'rating',
        title: 'Comment évalueriez-vous votre expérience d\'intégration globale ?',
        required: true
      },
      {
        type: 'multiple_choice',
        title: 'Quelle partie de l\'intégration a été la plus utile ?',
        required: true,
        options: ['Session d\'orientation', 'Matériel de formation', 'Attribution d\'un mentor', 'Présentations d\'équipe', 'Configuration du système']
      },
      {
        type: 'text',
        title: 'Quelles informations manquaient pendant l\'intégration ?',
        required: false
      },
      {
        type: 'rating',
        title: 'À quel point vous sentez-vous préparé pour commencer votre rôle ?',
        required: true
      }
    ]
  },
  {
    id: 'exit-interview',
    name: 'Sondage d\'entretien de départ',
    description: 'Comprendre les raisons du départ des employés',
    icon: Heart,
    category: 'RH',
    questions: [
      {
        type: 'multiple_choice',
        title: 'Quelle est votre principale raison de partir ?',
        required: true,
        options: ['Meilleure opportunité', 'Rémunération', 'Équilibre vie professionnelle-vie privée', 'Problèmes de management', 'Évolution de carrière', 'Autre']
      },
      {
        type: 'rating',
        title: 'Quelle est la probabilité que vous recommandiez cette entreprise comme lieu de travail ?',
        required: true
      },
      {
        type: 'text',
        title: 'Qu\'est-ce que l\'entreprise aurait pu faire pour vous retenir ?',
        required: false
      },
      {
        type: 'rating',
        title: 'Comment évalueriez-vous votre relation avec votre manager direct ?',
        required: true
      }
    ]
  },
  {
    id: 'training-feedback',
    name: 'Retour sur le programme de formation',
    description: 'Évaluez l\'efficacité et la qualité de la formation',
    icon: Briefcase,
    category: 'Formation',
    questions: [
      {
        type: 'rating',
        title: 'Comment évalueriez-vous la qualité globale de la formation ?',
        required: true
      },
      {
        type: 'rating',
        title: 'À quel point le contenu était-il pertinent pour votre travail ?',
        required: true
      },
      {
        type: 'multiple_choice',
        title: 'Quelle a été la partie la plus précieuse de la formation ?',
        required: true,
        options: ['Qualité du contenu', 'Expertise du formateur', 'Exercices pratiques', 'Discussions de groupe', 'Matériel fourni']
      },
      {
        type: 'text',
        title: 'Quels sujets aimeriez-vous voir couverts dans les futures formations ?',
        required: false
      }
    ]
  },
  {
    id: 'customer-satisfaction',
    name: 'Sondage de satisfaction client',
    description: 'Mesurez la satisfaction et la fidélité des clients',
    icon: FileText,
    category: 'Client',
    questions: [
      {
        type: 'rating',
        title: 'À quel point êtes-vous satisfait de notre service ?',
        required: true
      },
      {
        type: 'rating',
        title: 'Quelle est la probabilité que vous nous recommandiez à d\'autres ?',
        required: true
      },
      {
        type: 'multiple_choice',
        title: 'Quel aspect de notre service vous a le plus impressionné ?',
        required: true,
        options: ['Qualité', 'Rapidité', 'Support client', 'Rapport qualité-prix', 'Expérience utilisateur']
      },
      {
        type: 'text',
        title: 'Comment pouvons-nous améliorer notre service ?',
        required: false
      }
    ]
  }
];

const SurveyTemplates: React.FC<SurveyTemplatesProps> = ({ onSelectTemplate, onClose }) => {
  const categories = Array.from(new Set(surveyTemplates.map(t => t.category)));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choisissez un modèle de sondage</h2>
              <p className="text-gray-600 mt-1">Commencez avec un modèle pré-conçu et personnalisez selon vos besoins</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {categories.map(category => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Modèles {category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {surveyTemplates
                  .filter(template => template.category === category)
                  .map(template => {
                    const Icon = template.icon;
                    return (
                      <div
                        key={template.id}
                        onClick={() => onSelectTemplate(template)}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                              {template.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                            <p className="text-xs text-blue-600 mt-2">
                              {template.questions.length} questions incluses
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyTemplates;
