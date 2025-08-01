import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, GripVertical, Trash2, Eye, Save, Type, List, CheckSquare, Calendar, Hash, ArrowLeft, Settings, Columns, Layout, Radio } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import FormFieldEditor from './FormFieldEditor';
import FormAdvancedOptions from './FormAdvancedOptions';
import FormPreview from './FormPreview';

interface Contrainte {
  clePrimaire: boolean;
  cleEtrangere: boolean;
  visible: boolean;
  tailleMax?: number;
}

interface Configuration {
  tableSource?: string;
  column?: string;
  inputMask?: string;
  fieldWidth?: string;
  referenceTable?: string;
  codeLabel?: string;
  displayOrder?: string;
  tooltip?: string;
  fullLabel?: string;
  languageCode?: string;
}

interface DataSource {
  type?: string;
  value?: string;
}

export interface Champ {
  id: string;
  label: string;
  type: 'texte' | 'nombre' | 'date' | 'booleen' | 'email' | 'telephone' | 'selection' | 'radio';
  obligatoire: boolean;
  placeholder?: string;
  options?: string[];
  contraintes: Contrainte;
  configuration?: Configuration;
  dataSource?: DataSource;
}

export interface Groupe {
  id: string;
  titre: string;
  largeur: 'pleine' | 'demi';
  champs: Champ[];
}

export interface Colonne {
  id: string;
  groupes: Groupe[];
}

export interface Onglet {
  id: string;
  titre: string;
  colonnes: Colonne[];
}

export interface Formulaire {
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
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const champTypes = [
    { type: 'texte', icon: Type, label: 'Texte', description: 'Saisie de texte' },
    { type: 'nombre', icon: Hash, label: 'Nombre', description: 'Saisie numérique' },
    { type: 'date', icon: Calendar, label: 'Date', description: 'Sélecteur de date' },
    { type: 'booleen', icon: CheckSquare, label: 'Booléen', description: 'Case à cocher' },
    { type: 'email', icon: Type, label: 'Email', description: 'Adresse email' },
    { type: 'telephone', icon: Type, label: 'Téléphone', description: 'Numéro de téléphone' },
    { type: 'selection', icon: List, label: 'Sélection', description: 'Liste déroulante' },
    { type: 'radio', icon: Radio, label: 'Radio', description: 'Boutons radio multiples' },
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
      options: (type === 'selection' || type === 'radio') ? ['Option 1', 'Option 2'] : undefined,
      contraintes: {
        clePrimaire: false,
        cleEtrangere: false,
        visible: true,
        tailleMax: type === 'texte' ? 255 : undefined
      },
      configuration: {
        fieldWidth: '100%',
        languageCode: 'fr'
      },
      dataSource: {
        type: 'Constant',
        value: ''
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

  const deleteChamp = (champId: string) => {
    setFormulaire(prev => {
      const newOnglets = prev.onglets.map(onglet => ({
        ...onglet,
        colonnes: onglet.colonnes.map(colonne => ({
          ...colonne,
          groupes: colonne.groupes.map(groupe => ({
            ...groupe,
            champs: groupe.champs.filter(champ => champ.id !== champId)
          }))
        }))
      }));
      return { ...prev, onglets: newOnglets };
    });
  };

  const reorderChamps = (groupeId: string, startIndex: number, endIndex: number) => {
    setFormulaire(prev => {
      const newOnglets = prev.onglets.map(onglet => ({
        ...onglet,
        colonnes: onglet.colonnes.map(colonne => ({
          ...colonne,
          groupes: colonne.groupes.map(groupe => {
            if (groupe.id === groupeId) {
              const newChamps = Array.from(groupe.champs);
              const [reorderedChamp] = newChamps.splice(startIndex, 1);
              newChamps.splice(endIndex, 0, reorderedChamp);
              return { ...groupe, champs: newChamps };
            }
            return groupe;
          })
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
                contraintes: champ.contraintes,
                configuration: champ.configuration,
                dataSource: champ.dataSource
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

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    
    if (!destination) return;
    
    if (type === 'champ') {
      const groupeId = source.droppableId;
      reorderChamps(groupeId, source.index, destination.index);
    }
    
    setIsDragging(false);
  };

  const handleBackToForms = () => {
    if (onNavigate) {
      onNavigate('forms');
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEndForPalette = () => {
    setIsDragging(false);
  };

  return (
    <div className="h-screen flex flex-col max-w-full">
      <div className="flex justify-between items-center mb-6 px-6 pt-6">
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
            onClick={saveFormulaire}
            className="flex items-center px-4 py-2 text-blue-700 bg-blue-100 border border-green-300 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder brouillon
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Palette des types de champs */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
            <div className="bg-white rounded-lg shadow-sm border p-4 h-full">
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
                        handleDragStart();
                      }}
                      onDragEnd={handleDragEndForPalette}
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
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Constructeur de formulaire */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
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
              <div className="p-6 flex-1 overflow-auto">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <OngletEditor
                    onglet={formulaire.onglets[activeOnglet]}
                    onAddGroupe={() => addGroupe(activeOnglet, 0)}
                    onAddChamp={addChamp}
                    onUpdateChamp={updateChamp}
                    onDeleteChamp={deleteChamp}
                    onUpdateGroupe={updateGroupe}
                    onShowAdvancedOptions={setShowAdvancedOptions}
                    onReorderChamps={reorderChamps}
                    isDragging={isDragging}
                  />
                </DragDropContext>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Aperçu en temps réel */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="bg-gray-50 rounded-lg border h-full overflow-auto">
              <FormPreview 
                formulaire={formulaire} 
                activeOnglet={activeOnglet}
                isDragging={isDragging}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Modal pour les options avancées */}
      {showAdvancedOptions && (
        <FormAdvancedOptions
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
  onDeleteChamp: (champId: string) => void;
  onUpdateGroupe: (groupeId: string, updates: Partial<Groupe>) => void;
  onShowAdvancedOptions: (champId: string) => void;
  onReorderChamps: (groupeId: string, startIndex: number, endIndex: number) => void;
  isDragging: boolean;
}> = ({ 
  onglet, 
  onAddGroupe, 
  onAddChamp, 
  onUpdateChamp, 
  onDeleteChamp,
  onUpdateGroupe, 
  onShowAdvancedOptions, 
  onReorderChamps,
  isDragging 
}) => {
  
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
            onDeleteChamp={onDeleteChamp}
            onShowAdvancedOptions={onShowAdvancedOptions}
            onDrop={(e) => handleDrop(e, groupe.id)}
            onDragOver={handleDragOver}
            isDragging={isDragging}
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
  onDeleteChamp: (champId: string) => void;
  onShowAdvancedOptions: (champId: string) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  isDragging: boolean;
}> = ({ 
  groupe, 
  onUpdateGroupe, 
  onUpdateChamp, 
  onDeleteChamp,
  onShowAdvancedOptions, 
  onDrop, 
  onDragOver, 
  isDragging 
}) => {
  
  return (
    <div className={`border rounded-lg p-4 bg-gray-50 transition-all ${isDragging ? 'ring-2 ring-blue-300' : ''}`}>
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
        className={`min-h-24 border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        }`}
      >
        {groupe.champs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Type className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Glissez un type de champ ici</p>
          </div>
        ) : (
          <Droppable droppableId={groupe.id} type="champ">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {groupe.champs.map((champ, index) => (
                  <Draggable key={champ.id} draggableId={champ.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <FormFieldEditor
                          champ={champ}
                          onUpdateChamp={onUpdateChamp}
                          onDeleteChamp={onDeleteChamp}
                          onShowAdvancedOptions={onShowAdvancedOptions}
                          isDragging={snapshot.isDragging}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;