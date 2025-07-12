
import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, GripVertical, Trash2, Eye, Save, Type, List, CheckSquare, Calendar, Hash, ArrowLeft, Settings, Columns, Layout } from 'lucide-react';

interface Contrainte {
  clePrimaire: boolean;
  cleEtrangere: boolean;
  visible: boolean;
  tailleMax?: number;
}

interface Champ {
  id: string;
  label: string;
  type: 'texte' | 'nombre' | 'date' | 'booleen' | 'email' | 'telephone' | 'selection';
  obligatoire: boolean;
  placeholder?: string;
  options?: string[];
  contraintes: Contrainte;
}

interface Groupe {
  id: string;
  titre: string;
  largeur: 'pleine' | 'demi';
  champs: Champ[];
}

interface Colonne {
  id: string;
  groupes: Groupe[];
}

interface Onglet {
  id: string;
  titre: string;
  colonnes: Colonne[];
}

interface Formulaire {
  id: string;
  nom: string;
  description: string;
  onglets: Onglet[];
  createdAt: string;
  status: 'brouillon' | 'publie' | 'ferme';
}

interface FormBuilderProps {
  user: any;
  editingFormId?: string;
  onNavigate?: (view: string) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ user, editingFormId, onNavigate }) => {
  const [formulaire, setFormulaire] = useState<Formulaire>({
    id: Date.now().toString(),
    nom: 'Nouveau formulaire',
    description: '',
    onglets: [{
      id: 'onglet-1',
      titre: 'Onglet principal',
      colonnes: [{
        id: 'colonne-1',
        groupes: []
      }]
    }],
    createdAt: new Date().toISOString(),
    status: 'brouillon'
  });

  const [activeOnglet, setActiveOnglet] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<string | null>(null);

  const champTypes = [
    { type: 'texte', icon: Type, label: 'Texte', description: 'Saisie de texte' },
    { type: 'nombre', icon: Hash, label: 'Nombre', description: 'Saisie numérique' },
    { type: 'date', icon: Calendar, label: 'Date', description: 'Sélecteur de date' },
    { type: 'booleen', icon: CheckSquare, label: 'Booléen', description: 'Case à cocher' },
    { type: 'email', icon: Type, label: 'Email', description: 'Adresse email' },
    { type: 'telephone', icon: Type, label: 'Téléphone', description: 'Numéro de téléphone' },
    { type: 'selection', icon: List, label: 'Sélection', description: 'Liste déroulante' },
  ];

  const addOnglet = () => {
    const newOnglet: Onglet = {
      id: `onglet-${Date.now()}`,
      titre: `Nouvel onglet ${formulaire.onglets.length + 1}`,
      colonnes: [{
        id: `colonne-${Date.now()}`,
        groupes: []
      }]
    };

    setFormulaire(prev => ({
      ...prev,
      onglets: [...prev.onglets, newOnglet]
    }));
  };

  const addGroupe = (ongletIndex: number, colonneIndex: number) => {
    const newGroupe: Groupe = {
      id: `groupe-${Date.now()}`,
      titre: 'Nouveau groupe',
      largeur: 'pleine',
      champs: []
    };

    setFormulaire(prev => {
      const newOnglets = [...prev.onglets];
      newOnglets[ongletIndex].colonnes[colonneIndex].groupes.push(newGroupe);
      return { ...prev, onglets: newOnglets };
    });
  };

  const addChamp = (type: string, groupeId: string) => {
    const newChamp: Champ = {
      id: `champ-${Date.now()}`,
      label: `Nouveau champ ${type}`,
      type: type as any,
      obligatoire: false,
      placeholder: '',
      options: type === 'selection' ? ['Option 1', 'Option 2'] : undefined,
      contraintes: {
        clePrimaire: false,
        cleEtrangere: false,
        visible: true,
        tailleMax: type === 'texte' ? 255 : undefined
      }
    };

    setFormulaire(prev => {
      const newOnglets = prev.onglets.map(onglet => ({
        ...onglet,
        colonnes: onglet.colonnes.map(colonne => ({
          ...colonne,
          groupes: colonne.groupes.map(groupe => 
            groupe.id === groupeId 
              ? { ...groupe, champs: [...groupe.champs, newChamp] }
              : groupe
          )
        }))
      }));
      return { ...prev, onglets: newOnglets };
    });
  };

  const updateChamp = (champId: string, updates: Partial<Champ>) => {
    setFormulaire(prev => {
      const newOnglets = prev.onglets.map(onglet => ({
        ...onglet,
        colonnes: onglet.colonnes.map(colonne => ({
          ...colonne,
          groupes: colonne.groupes.map(groupe => ({
            ...groupe,
            champs: groupe.champs.map(champ =>
              champ.id === champId ? { ...champ, ...updates } : champ
            )
          }))
        }))
      }));
      return { ...prev, onglets: newOnglets };
    });
  };

  const updateGroupe = (groupeId: string, updates: Partial<Groupe>) => {
    setFormulaire(prev => {
      const newOnglets = prev.onglets.map(onglet => ({
        ...onglet,
        colonnes: onglet.colonnes.map(colonne => ({
          ...colonne,
          groupes: colonne.groupes.map(groupe =>
            groupe.id === groupeId ? { ...groupe, ...updates } : groupe
          )
        }))
      }));
      return { ...prev, onglets: newOnglets };
    });
  };

  const saveFormulaire = () => {
    const existingForms = JSON.parse(localStorage.getItem('hrFormulaires') || '[]');
    const updatedForms = existingForms.filter((f: Formulaire) => f.id !== formulaire.id);
    updatedForms.push(formulaire);
    localStorage.setItem('hrFormulaires', JSON.stringify(updatedForms));
    alert('Formulaire sauvegardé avec succès !');
  };

  const generateJSON = () => {
    const jsonStructure = {
      formulaire: {
        nom: formulaire.nom,
        description: formulaire.description,
        onglets: formulaire.onglets.map(onglet => ({
          titre: onglet.titre,
          colonnes: onglet.colonnes.map(colonne => ({
            groupes: colonne.groupes.map(groupe => ({
              titre: groupe.titre,
              largeur: groupe.largeur,
              champs: groupe.champs.map(champ => ({
                label: champ.label,
                type: champ.type,
                obligatoire: champ.obligatoire,
                placeholder: champ.placeholder,
                options: champ.options,
                contraintes: champ.contraintes
              }))
            }))
          }))
        }))
      }
    };

    console.log('Structure JSON générée:', JSON.stringify(jsonStructure, null, 2));
    navigator.clipboard.writeText(JSON.stringify(jsonStructure, null, 2));
    alert('Structure JSON copiée dans le presse-papier !');
  };

  const handleBackToForms = () => {
    if (onNavigate) {
      onNavigate('forms');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToForms}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux formulaires
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {editingFormId ? 'Modifier le formulaire' : 'Créateur de formulaires'}
            </h1>
            <p className="text-gray-600 mt-1">Créez et personnalisez vos formulaires RH</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={generateJSON}
            className="flex items-center px-4 py-2 text-green-700 bg-green-100 border border-green-300 rounded-lg hover:bg-green-200 transition-colors"
          >
            Générer JSON
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Modifier' : 'Aperçu'}
          </button>
          <button
            onClick={saveFormulaire}
            className="flex items-center px-4 py-2 text-blue-700 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder brouillon
          </button>
        </div>
      </div>

      {showPreview ? (
        <FormPreview formulaire={formulaire} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Palette des types de champs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Types de champs</h3>
              <div className="space-y-2">
                {champTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.type}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('champType', type.type);
                      }}
                      className="flex items-center p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group cursor-grab active:cursor-grabbing"
                    >
                      <Icon className="w-5 h-5 text-gray-600 mr-3 group-hover:text-blue-600" />
                      <div>
                        <div className="font-medium text-sm text-gray-900">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Constructeur de formulaire */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* En-tête du formulaire */}
              <div className="p-6 border-b">
                <input
                  type="text"
                  value={formulaire.nom}
                  onChange={(e) => setFormulaire(prev => ({ ...prev, nom: e.target.value }))}
                  className="text-2xl font-bold text-gray-900 border-none outline-none w-full bg-transparent"
                  placeholder="Nom du formulaire"
                />
                <textarea
                  value={formulaire.description}
                  onChange={(e) => setFormulaire(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-2 text-gray-600 border-none outline-none w-full bg-transparent resize-none"
                  placeholder="Description du formulaire (optionnel)"
                  rows={2}
                />
              </div>

              {/* Onglets */}
              <div className="border-b">
                <div className="flex overflow-x-auto">
                  {formulaire.onglets.map((onglet, index) => (
                    <button
                      key={onglet.id}
                      onClick={() => setActiveOnglet(index)}
                      className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                        activeOnglet === index
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <input
                        type="text"
                        value={onglet.titre}
                        onChange={(e) => {
                          e.stopPropagation();
                          const newOnglets = [...formulaire.onglets];
                          newOnglets[index].titre = e.target.value;
                          setFormulaire(prev => ({ ...prev, onglets: newOnglets }));
                        }}
                        className="bg-transparent border-none outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </button>
                  ))}
                  <button
                    onClick={addOnglet}
                    className="px-4 py-3 text-sm text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contenu de l'onglet actif */}
              <div className="p-6">
                <OngletEditor
                  onglet={formulaire.onglets[activeOnglet]}
                  onAddGroupe={() => addGroupe(activeOnglet, 0)}
                  onAddChamp={addChamp}
                  onUpdateChamp={updateChamp}
                  onUpdateGroupe={updateGroupe}
                  onShowAdvancedOptions={setShowAdvancedOptions}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour les options avancées */}
      {showAdvancedOptions && (
        <AdvancedOptionsModal
          champId={showAdvancedOptions}
          formulaire={formulaire}
          onClose={() => setShowAdvancedOptions(null)}
          onUpdateChamp={updateChamp}
        />
      )}
    </div>
  );
};

// Composant pour éditer un onglet
const OngletEditor: React.FC<{
  onglet: Onglet;
  onAddGroupe: () => void;
  onAddChamp: (type: string, groupeId: string) => void;
  onUpdateChamp: (champId: string, updates: Partial<Champ>) => void;
  onUpdateGroupe: (groupeId: string, updates: Partial<Groupe>) => void;
  onShowAdvancedOptions: (champId: string) => void;
}> = ({ onglet, onAddGroupe, onAddChamp, onUpdateChamp, onUpdateGroupe, onShowAdvancedOptions }) => {
  
  const handleDrop = (e: React.DragEvent, groupeId: string) => {
    e.preventDefault();
    const champType = e.dataTransfer.getData('champType');
    if (champType) {
      onAddChamp(champType, groupeId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (onglet.colonnes[0].groupes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Layout className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="mb-4">Aucun groupe pour le moment</p>
        <button
          onClick={onAddGroupe}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ajouter un groupe
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Groupes</h3>
        <button
          onClick={onAddGroupe}
          className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          Ajouter un groupe
        </button>
      </div>

      <div className="space-y-4">
        {onglet.colonnes[0].groupes.map((groupe) => (
          <GroupeEditor
            key={groupe.id}
            groupe={groupe}
            onUpdateGroupe={onUpdateGroupe}
            onUpdateChamp={onUpdateChamp}
            onShowAdvancedOptions={onShowAdvancedOptions}
            onDrop={(e) => handleDrop(e, groupe.id)}
            onDragOver={handleDragOver}
          />
        ))}
      </div>
    </div>
  );
};

// Composant pour éditer un groupe
const GroupeEditor: React.FC<{
  groupe: Groupe;
  onUpdateGroupe: (groupeId: string, updates: Partial<Groupe>) => void;
  onUpdateChamp: (champId: string, updates: Partial<Champ>) => void;
  onShowAdvancedOptions: (champId: string) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
}> = ({ groupe, onUpdateGroupe, onUpdateChamp, onShowAdvancedOptions, onDrop, onDragOver }) => {
  
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={groupe.titre}
          onChange={(e) => onUpdateGroupe(groupe.id, { titre: e.target.value })}
          className="text-lg font-medium bg-transparent border-none outline-none"
        />
        <div className="flex items-center space-x-2">
          <select
            value={groupe.largeur}
            onChange={(e) => onUpdateGroupe(groupe.id, { largeur: e.target.value as 'pleine' | 'demi' })}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="pleine">Pleine largeur</option>
            <option value="demi">Demi largeur</option>
          </select>
        </div>
      </div>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="min-h-24 border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3"
      >
        {groupe.champs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Type className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Glissez un type de champ ici</p>
          </div>
        ) : (
          groupe.champs.map((champ) => (
            <ChampEditor
              key={champ.id}
              champ={champ}
              onUpdateChamp={onUpdateChamp}
              onShowAdvancedOptions={onShowAdvancedOptions}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Composant pour éditer un champ
const ChampEditor: React.FC<{
  champ: Champ;
  onUpdateChamp: (champId: string, updates: Partial<Champ>) => void;
  onShowAdvancedOptions: (champId: string) => void;
}> = ({ champ, onUpdateChamp, onShowAdvancedOptions }) => {
  
  return (
    <div className="bg-white border rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={champ.label}
          onChange={(e) => onUpdateChamp(champ.id, { label: e.target.value })}
          className="font-medium bg-transparent border-none outline-none flex-1"
          placeholder="Label du champ"
        />
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onShowAdvancedOptions(champ.id)}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            <Settings className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-400">{champ.type}</span>
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
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...champ.options!];
                newOptions[index] = e.target.value;
                onUpdateChamp(champ.id, { options: newOptions });
              }}
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Modal pour les options avancées
const AdvancedOptionsModal: React.FC<{
  champId: string;
  formulaire: Formulaire;
  onClose: () => void;
  onUpdateChamp: (champId: string, updates: Partial<Champ>) => void;
}> = ({ champId, formulaire, onClose, onUpdateChamp }) => {
  
  const champ = formulaire.onglets
    .flatMap(o => o.colonnes)
    .flatMap(c => c.groupes)
    .flatMap(g => g.champs)
    .find(c => c.id === champId);

  if (!champ) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Options avancées - {champ.label}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={champ.contraintes.clePrimaire}
                onChange={(e) => onUpdateChamp(champId, {
                  contraintes: { ...champ.contraintes, clePrimaire: e.target.checked }
                })}
                className="mr-2"
              />
              <span className="text-sm">Clé primaire</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={champ.contraintes.cleEtrangere}
                onChange={(e) => onUpdateChamp(champId, {
                  contraintes: { ...champ.contraintes, cleEtrangere: e.target.checked }
                })}
                className="mr-2"
              />
              <span className="text-sm">Clé étrangère</span>
            </label>
          </div>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={champ.contraintes.visible}
              onChange={(e) => onUpdateChamp(champId, {
                contraintes: { ...champ.contraintes, visible: e.target.checked }
              })}
              className="mr-2"
            />
            <span className="text-sm">Visible</span>
          </label>

          {champ.type === 'texte' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taille maximale
              </label>
              <input
                type="number"
                value={champ.contraintes.tailleMax || 255}
                onChange={(e) => onUpdateChamp(champId, {
                  contraintes: { ...champ.contraintes, tailleMax: parseInt(e.target.value) }
                })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de donnée
            </label>
            <select
              value={champ.type}
              onChange={(e) => onUpdateChamp(champId, { type: e.target.value as any })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="texte">Texte</option>
              <option value="nombre">Nombre</option>
              <option value="date">Date</option>
              <option value="booleen">Booléen</option>
              <option value="email">Email</option>
              <option value="telephone">Téléphone</option>
              <option value="selection">Sélection</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant d'aperçu du formulaire
const FormPreview: React.FC<{ formulaire: Formulaire }> = ({ formulaire }) => {
  const [activeOnglet, setActiveOnglet] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const handleResponseChange = (champId: string, value: any) => {
    setResponses(prev => ({ ...prev, [champId]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border">
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
            <button
              key={onglet.id}
              onClick={() => setActiveOnglet(index)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeOnglet === index
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {onglet.titre}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {formulaire.onglets[activeOnglet].colonnes[0].groupes.map((groupe) => (
            <div key={groupe.id} className="border rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{groupe.titre}</h3>
              <div className="space-y-4">
                {groupe.champs.filter(c => c.contraintes.visible).map((champ) => (
                  <div key={champ.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {champ.label}
                      {champ.obligatoire && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {champ.type === 'texte' && (
                      <input
                        type="text"
                        placeholder={champ.placeholder}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        onChange={(e) => handleResponseChange(champ.id, e.target.value)}
                      />
                    )}

                    {champ.type === 'nombre' && (
                      <input
                        type="number"
                        placeholder={champ.placeholder}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        onChange={(e) => handleResponseChange(champ.id, e.target.value)}
                      />
                    )}

                    {champ.type === 'date' && (
                      <input
                        type="date"
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        onChange={(e) => handleResponseChange(champ.id, e.target.value)}
                      />
                    )}

                    {champ.type === 'booleen' && (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3"
                          onChange={(e) => handleResponseChange(champ.id, e.target.checked)}
                        />
                        <span className="text-sm">{champ.placeholder || 'Cocher si applicable'}</span>
                      </label>
                    )}

                    {champ.type === 'email' && (
                      <input
                        type="email"
                        placeholder={champ.placeholder}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        onChange={(e) => handleResponseChange(champ.id, e.target.value)}
                      />
                    )}

                    {champ.type === 'telephone' && (
                      <input
                        type="tel"
                        placeholder={champ.placeholder}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        onChange={(e) => handleResponseChange(champ.id, e.target.value)}
                      />
                    )}

                    {champ.type === 'selection' && champ.options && (
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        onChange={(e) => handleResponseChange(champ.id, e.target.value)}
                      >
                        <option value="">Sélectionner...</option>
                        {champ.options.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Envoyer le formulaire
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
