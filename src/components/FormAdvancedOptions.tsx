import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Champ, Formulaire } from './FormBuilder';

interface FormAdvancedOptionsProps {
  champId: string;
  formulaire: Formulaire;
  onClose: () => void;
  onUpdateChamp: (champId: string, updates: Partial<Champ>) => void;
}

const FormAdvancedOptions: React.FC<FormAdvancedOptionsProps> = ({ 
  champId, 
  formulaire, 
  onClose, 
  onUpdateChamp 
}) => {
  const champ = formulaire.onglets
    .flatMap(o => o.colonnes)
    .flatMap(c => c.groupes)
    .flatMap(g => g.champs)
    .find(c => c.id === champId);

  const [localChamp, setLocalChamp] = useState(champ);

  if (!champ || !localChamp) return null;

  const handleSave = () => {
    onUpdateChamp(champId, localChamp);
    onClose();
  };

  const updateLocalChamp = (updates: Partial<Champ>) => {
    setLocalChamp(prev => prev ? { ...prev, ...updates } : prev);
  };

  const updateContraintes = (updates: Partial<Champ['contraintes']>) => {
    setLocalChamp(prev => prev ? {
      ...prev,
      contraintes: { ...prev.contraintes, ...updates }
    } : prev);
  };

  const updateConfiguration = (updates: Partial<Champ['configuration']>) => {
    setLocalChamp(prev => prev ? {
      ...prev,
      configuration: { ...prev.configuration, ...updates }
    } : prev);
  };

  const updateDataSource = (updates: Partial<Champ['dataSource']>) => {
    setLocalChamp(prev => prev ? {
      ...prev,
      dataSource: { ...prev.dataSource, ...updates }
    } : prev);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium">Plus d'options - {localChamp.label}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Configuration de base */}
          <div className="border-b pb-4">
            <h4 className="text-lg font-medium mb-3">Configuration de base</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source de table
                </label>
                <input
                  type="text"
                  value={localChamp.configuration?.tableSource || ''}
                  onChange={(e) => updateConfiguration({ tableSource: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="ex: employees"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Colonne
                </label>
                <input
                  type="text"
                  value={localChamp.configuration?.column || ''}
                  onChange={(e) => updateConfiguration({ column: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="ex: first_name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Masque de saisie
                </label>
                <input
                  type="text"
                  value={localChamp.configuration?.inputMask || ''}
                  onChange={(e) => updateConfiguration({ inputMask: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="ex: dd/mm/yyyy, (000) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Largeur du champ
                </label>
                <input
                  type="text"
                  value={localChamp.configuration?.fieldWidth || ''}
                  onChange={(e) => updateConfiguration({ fieldWidth: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="ex: 100%, 200px"
                />
              </div>
            </div>
          </div>

          {/* Configuration pour les listes */}
          {(localChamp.type === 'selection' || localChamp.type === 'radio') && (
            <div className="border-b pb-4">
              <h4 className="text-lg font-medium mb-3">Configuration des listes</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Table de référence
                  </label>
                  <input
                    type="text"
                    value={localChamp.configuration?.referenceTable || ''}
                    onChange={(e) => updateConfiguration({ referenceTable: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="ex: departments"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code, Label
                  </label>
                  <input
                    type="text"
                    value={localChamp.configuration?.codeLabel || ''}
                    onChange={(e) => updateConfiguration({ codeLabel: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="ex: id, name"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordre d'affichage
                  </label>
                  <input
                    type="text"
                    value={localChamp.configuration?.displayOrder || ''}
                    onChange={(e) => updateConfiguration({ displayOrder: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="ex: name ASC, created_at DESC"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Métadonnées additionnelles */}
          <div className="border-b pb-4">
            <h4 className="text-lg font-medium mb-3">Métadonnées</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  InfoBulle (Tooltip)
                </label>
                <textarea
                  value={localChamp.configuration?.tooltip || ''}
                  onChange={(e) => updateConfiguration({ tooltip: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={2}
                  placeholder="Texte d'aide pour l'utilisateur"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label complet
                </label>
                <textarea
                  value={localChamp.configuration?.fullLabel || ''}
                  onChange={(e) => updateConfiguration({ fullLabel: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={2}
                  placeholder="Description complète du champ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code langue
                </label>
                <select
                  value={localChamp.configuration?.languageCode || 'fr'}
                  onChange={(e) => updateConfiguration({ languageCode: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="ar">Arabe</option>
                  <option value="es">Espagnol</option>
                </select>
              </div>
            </div>
          </div>

          {/* Configuration de la source de données */}
          <div className="border-b pb-4">
            <h4 className="text-lg font-medium mb-3">Source de données</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={localChamp.dataSource?.type || 'Constant'}
                  onChange={(e) => updateDataSource({ type: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="Constant">Constant</option>
                  <option value="Function">Fonction</option>
                  <option value="Query">Requête</option>
                  <option value="API">API</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valeur
                </label>
                <textarea
                  value={localChamp.dataSource?.value || ''}
                  onChange={(e) => updateDataSource({ value: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={2}
                  placeholder="Valeur, fonction ou requête"
                />
              </div>
            </div>
          </div>

          {/* Contraintes */}
          <div>
            <h4 className="text-lg font-medium mb-3">Contraintes</h4>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localChamp.contraintes.clePrimaire}
                  onChange={(e) => updateContraintes({ clePrimaire: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">Clé primaire</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localChamp.contraintes.cleEtrangere}
                  onChange={(e) => updateContraintes({ cleEtrangere: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">Clé étrangère</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={localChamp.contraintes.visible}
                  onChange={(e) => updateContraintes({ visible: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">Visible</span>
              </label>

              {localChamp.type === 'texte' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taille maximale
                  </label>
                  <input
                    type="number"
                    value={localChamp.contraintes.tailleMax || 255}
                    onChange={(e) => updateContraintes({ tailleMax: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de donnée
                </label>
                <select
                  value={localChamp.type}
                  onChange={(e) => updateLocalChamp({ type: e.target.value as any })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="texte">Texte</option>
                  <option value="nombre">Nombre</option>
                  <option value="date">Date</option>
                  <option value="booleen">Booléen</option>
                  <option value="email">Email</option>
                  <option value="telephone">Téléphone</option>
                  <option value="selection">Sélection</option>
                  <option value="radio">Radio</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormAdvancedOptions;