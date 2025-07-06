
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
    name: 'Employee Satisfaction Survey',
    description: 'Measure overall employee satisfaction and engagement',
    icon: Users,
    category: 'HR',
    questions: [
      {
        type: 'rating',
        title: 'How satisfied are you with your current role?',
        required: true
      },
      {
        type: 'rating',
        title: 'How would you rate your work-life balance?',
        required: true
      },
      {
        type: 'multiple_choice',
        title: 'What motivates you most at work?',
        required: true,
        options: ['Career growth', 'Recognition', 'Compensation', 'Work environment', 'Team collaboration']
      },
      {
        type: 'text',
        title: 'What improvements would you suggest for the workplace?',
        required: false
      }
    ]
  },
  {
    id: 'performance-review',
    name: 'Performance Review Survey',
    description: 'Comprehensive performance evaluation template',
    icon: Star,
    category: 'HR',
    questions: [
      {
        type: 'rating',
        title: 'Rate your overall performance this quarter',
        required: true
      },
      {
        type: 'checkbox',
        title: 'Which goals did you achieve this quarter?',
        required: true,
        options: ['Goal 1', 'Goal 2', 'Goal 3', 'Goal 4']
      },
      {
        type: 'text',
        title: 'What were your main accomplishments?',
        required: true
      },
      {
        type: 'text',
        title: 'What areas would you like to improve?',
        required: true
      },
      {
        type: 'rating',
        title: 'How would you rate your collaboration with team members?',
        required: true
      }
    ]
  },
  {
    id: 'onboarding-feedback',
    name: 'New Employee Onboarding',
    description: 'Gather feedback on the onboarding experience',
    icon: GraduationCap,
    category: 'HR',
    questions: [
      {
        type: 'rating',
        title: 'How would you rate your overall onboarding experience?',
        required: true
      },
      {
        type: 'multiple_choice',
        title: 'Which part of onboarding was most helpful?',
        required: true,
        options: ['Orientation session', 'Training materials', 'Mentor assignment', 'Team introductions', 'System setup']
      },
      {
        type: 'text',
        title: 'What information was missing during onboarding?',
        required: false
      },
      {
        type: 'rating',
        title: 'How prepared do you feel to start your role?',
        required: true
      }
    ]
  },
  {
    id: 'exit-interview',
    name: 'Exit Interview Survey',
    description: 'Understand reasons for employee departure',
    icon: Heart,
    category: 'HR',
    questions: [
      {
        type: 'multiple_choice',
        title: 'What is your primary reason for leaving?',
        required: true,
        options: ['Better opportunity', 'Compensation', 'Work-life balance', 'Management issues', 'Career growth', 'Other']
      },
      {
        type: 'rating',
        title: 'How likely are you to recommend this company as a place to work?',
        required: true
      },
      {
        type: 'text',
        title: 'What could the company have done to retain you?',
        required: false
      },
      {
        type: 'rating',
        title: 'How would you rate your relationship with your direct manager?',
        required: true
      }
    ]
  },
  {
    id: 'training-feedback',
    name: 'Training Program Feedback',
    description: 'Evaluate training effectiveness and quality',
    icon: Briefcase,
    category: 'Training',
    questions: [
      {
        type: 'rating',
        title: 'How would you rate the overall quality of the training?',
        required: true
      },
      {
        type: 'rating',
        title: 'How relevant was the content to your job?',
        required: true
      },
      {
        type: 'multiple_choice',
        title: 'What was the most valuable part of the training?',
        required: true,
        options: ['Content quality', 'Instructor expertise', 'Hands-on exercises', 'Group discussions', 'Materials provided']
      },
      {
        type: 'text',
        title: 'What topics would you like to see covered in future training?',
        required: false
      }
    ]
  },
  {
    id: 'customer-satisfaction',
    name: 'Customer Satisfaction Survey',
    description: 'Measure customer satisfaction and loyalty',
    icon: FileText,
    category: 'Customer',
    questions: [
      {
        type: 'rating',
        title: 'How satisfied are you with our service?',
        required: true
      },
      {
        type: 'rating',
        title: 'How likely are you to recommend us to others?',
        required: true
      },
      {
        type: 'multiple_choice',
        title: 'What aspect of our service impressed you most?',
        required: true,
        options: ['Quality', 'Speed', 'Customer support', 'Value for money', 'User experience']
      },
      {
        type: 'text',
        title: 'How can we improve our service?',
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
              <h2 className="text-2xl font-bold text-gray-900">Choose a Survey Template</h2>
              <p className="text-gray-600 mt-1">Start with a pre-built template and customize as needed</p>
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{category} Templates</h3>
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
                              {template.questions.length} questions included
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
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyTemplates;
