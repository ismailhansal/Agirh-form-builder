import React, { useState } from 'react';
import { Eye, Layout } from 'lucide-react';
import { Formulaire, Groupe } from './FormBuilder';

interface FormPreviewProps {
  formulaire: Formulaire;
  activeOnglet: number;
  isDragging: boolean;
}

const FormPreview: React.FC<FormPreviewProps> = ({ formulaire, activeOnglet, isDragging }) => {
  const [responses, setResponses] = useState<Record<string, any>>({});

  const handleResponseChange = (champId: string, value: any) => {
    setResponses(prev => ({ ...prev, [champId]: value }));
  };

  const currentOnglet = formulaire.onglets[activeOnglet];

  return (
    <div className={`bg-white rounded-lg shadow-sm border transition-all ${isDragging ? 'ring-2 ring-blue-300' : ''}`}>
      <div className="p-4 border-b bg-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Aperçu en temps réel</h3>
        </div>
      </div>

      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900">{formulaire.nom}</h1>
        {formulaire.description && (
          <p className="mt-2 text-gray-600">{formulaire.description}</p>
        )}
      </div>

      {/* Onglets dans l'aperçu */}
      <div className="border-b">
        <div className="flex overflow-x-auto">
          {formulaire.onglets.map((onglet, index) => (
            <div
              key={onglet.id}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeOnglet === index
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {onglet.titre}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        {currentOnglet.colonnes[0].groupes.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Layout className="w-12 h-12 mx-auto mb-4" />
            <p>Ajoutez des groupes pour voir l'aperçu</p>
          </div>
        ) : (
          <div className="space-y-6">
            <GroupesPreview 
              groupes={currentOnglet.colonnes[0].groupes} 
              onResponseChange={handleResponseChange}
              responses={responses}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour l'aperçu des groupes avec gestion de la largeur
const GroupesPreview: React.FC<{
  groupes: Groupe[];
  onResponseChange: (champId: string, value: any) => void;
  responses: Record<string, any>;
}> = ({ groupes, onResponseChange, responses }) => {
  
  // Organiser les groupes par rangées selon leur largeur
  const organiseGroupes = () => {
    const rows: Groupe[][] = [];
    let currentRow: Groupe[] = [];
    let currentRowWidth = 0;

    groupes.forEach(groupe => {
      const groupeWidth = groupe.largeur === 'pleine' ? 100 : 50;
      
      if (currentRowWidth + groupeWidth > 100) {
        if (currentRow.length > 0) {
          rows.push(currentRow);
        }
        currentRow = [groupe];
        currentRowWidth = groupeWidth;
      } else {
        currentRow.push(groupe);
        currentRowWidth += groupeWidth;
      }
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  };

  const rows = organiseGroupes();

  return (
    <div className="space-y-4">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {row.map(groupe => (
            <div 
              key={groupe.id} 
              className={`border rounded-lg p-4 ${
                groupe.largeur === 'pleine' ? 'flex-1' : 'flex-1 max-w-[calc(50%-0.5rem)]'
              }`}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">{groupe.titre}</h3>
              <div className="space-y-4">
                {groupe.champs.filter(c => c.contraintes.visible).map((champ) => (
                  <div key={champ.id} className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <label className="text-sm font-medium text-gray-700 min-w-0 w-32 flex-shrink-0">
                        {champ.label}
                        {champ.obligatoire && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      <div className="flex-1">
                        {champ.type === 'texte' && (
                          <input
                            type="text"
                            placeholder={champ.placeholder}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            onChange={(e) => onResponseChange(champ.id, e.target.value)}
                            value={responses[champ.id] || ''}
                            style={{ width: champ.configuration?.fieldWidth || '100%' }}
                          />
                        )}

                        {champ.type === 'nombre' && (
                          <input
                            type="number"
                            placeholder={champ.placeholder}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            onChange={(e) => onResponseChange(champ.id, e.target.value)}
                            value={responses[champ.id] || ''}
                            style={{ width: champ.configuration?.fieldWidth || '100%' }}
                          />
                        )}

                        {champ.type === 'date' && (
                          <input
                            type="date"
                            className="border border-gray-300 rounded-lg px-3 py-2"
                            onChange={(e) => onResponseChange(champ.id, e.target.value)}
                            value={responses[champ.id] || ''}
                            style={{ width: champ.configuration?.fieldWidth || 'auto' }}
                          />
                        )}

                        {champ.type === 'booleen' && (
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="mr-3"
                              onChange={(e) => onResponseChange(champ.id, e.target.checked)}
                              checked={responses[champ.id] || false}
                            />
                            <span className="text-sm">{champ.placeholder || 'Cocher si applicable'}</span>
                          </label>
                        )}

                        {champ.type === 'email' && (
                          <input
                            type="email"
                            placeholder={champ.placeholder}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            onChange={(e) => onResponseChange(champ.id, e.target.value)}
                            value={responses[champ.id] || ''}
                            style={{ width: champ.configuration?.fieldWidth || '100%' }}
                          />
                        )}

                        {champ.type === 'telephone' && (
                          <input
                            type="tel"
                            placeholder={champ.placeholder}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            onChange={(e) => onResponseChange(champ.id, e.target.value)}
                            value={responses[champ.id] || ''}
                            style={{ width: champ.configuration?.fieldWidth || '100%' }}
                          />
                        )}

                        {champ.type === 'selection' && champ.options && (
                          <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                            onChange={(e) => onResponseChange(champ.id, e.target.value)}
                            value={responses[champ.id] || ''}
                            style={{ width: champ.configuration?.fieldWidth || '100%' }}
                          >
                            <option value="">Sélectionner...</option>
                            {champ.options.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </select>
                        )}

                        {champ.type === 'radio' && champ.options && (
                          <div className="flex flex-wrap gap-4">
                            {champ.options.map((option, index) => (
                              <label key={index} className="flex items-center">
                                <input
                                  type="radio"
                                  name={champ.id}
                                  value={option}
                                  className="mr-2"
                                  onChange={(e) => onResponseChange(champ.id, e.target.value)}
                                  checked={responses[champ.id] === option}
                                />
                                <span className="text-sm">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {champ.configuration?.tooltip && (
                      <p className="text-xs text-gray-500 ml-35">{champ.configuration.tooltip}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FormPreview;