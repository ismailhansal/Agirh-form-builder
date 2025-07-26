import React from 'react';
import { Settings, Trash2, GripVertical } from 'lucide-react';
import { Champ } from './FormBuilder';

interface FormFieldEditorProps {
  champ: Champ;
  onUpdateChamp: (champId: string, updates: Partial<Champ>) => void;
  onShowAdvancedOptions: (champId: string) => void;
  onDeleteChamp: (champId: string) => void;
  isDragging?: boolean;
}

const FormFieldEditor: React.FC<FormFieldEditorProps> = ({ 
  champ, 
  onUpdateChamp, 
  onShowAdvancedOptions, 
  onDeleteChamp,
  isDragging 
}) => {
  return (
    <div className={`bg-white border rounded-lg p-3 space-y-3 transition-all ${isDragging ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <GripVertical className="w-4 h-4 text-gray-400 mr-2 cursor-grab" />
          <input
            type="text"
            value={champ.label}
            onChange={(e) => onUpdateChamp(champ.id, { label: e.target.value })}
            className="font-medium bg-transparent border-none outline-none flex-1"
            placeholder="Label du champ"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onShowAdvancedOptions(champ.id)}
            className="text-gray-500 hover:text-gray-700 text-sm p-1"
            title="Plus d'options"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteChamp(champ.id)}
            className="text-red-500 hover:text-red-700 text-sm p-1"
            title="Supprimer le champ"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-400 ml-2">{champ.type}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={champ.placeholder || ''}
          onChange={(e) => onUpdateChamp(champ.id, { placeholder: e.target.value })}
          className="text-sm border border-gray-300 rounded px-2 py-1"
          placeholder="Placeholder"
        />
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            checked={champ.obligatoire}
            onChange={(e) => onUpdateChamp(champ.id, { obligatoire: e.target.checked })}
            className="mr-2"
          />
          Obligatoire
        </label>
      </div>

      {champ.type === 'selection' && champ.options && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Options:</label>
          {champ.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...champ.options!];
                  newOptions[index] = e.target.value;
                  onUpdateChamp(champ.id, { options: newOptions });
                }}
                className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
              />
              {champ.options.length > 1 && (
                <button
                  onClick={() => {
                    const newOptions = champ.options!.filter((_, i) => i !== index);
                    onUpdateChamp(champ.id, { options: newOptions });
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              const newOptions = [...champ.options!, `Option ${champ.options!.length + 1}`];
              onUpdateChamp(champ.id, { options: newOptions });
            }}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Ajouter une option
          </button>
        </div>
      )}

      {champ.type === 'radio' && champ.options && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Options:</label>
          {champ.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...champ.options!];
                  newOptions[index] = e.target.value;
                  onUpdateChamp(champ.id, { options: newOptions });
                }}
                className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
              />
              {champ.options.length > 1 && (
                <button
                  onClick={() => {
                    const newOptions = champ.options!.filter((_, i) => i !== index);
                    onUpdateChamp(champ.id, { options: newOptions });
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              const newOptions = [...champ.options!, `Option ${champ.options!.length + 1}`];
              onUpdateChamp(champ.id, { options: newOptions });
            }}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Ajouter une option
          </button>
        </div>
      )}
    </div>
  );
};

export default FormFieldEditor;