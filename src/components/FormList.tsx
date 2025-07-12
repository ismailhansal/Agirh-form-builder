
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, Copy } from 'lucide-react';

interface Formulaire {
  id: string;
  nom: string;
  description: string;
  onglets: any[];
  createdAt: string;
  status: 'brouillon' | 'publie' | 'ferme';
}

interface FormListProps {
  user: any;
  onNavigate: (view: string, formId?: string) => void;
}

const FormList: React.FC<FormListProps> = ({ user, onNavigate }) => {
  const [formulaires, setFormulaires] = useState<Formulaire[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('tous');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    loadFormulaires();
  }, []);

  const loadFormulaires = () => {
    const storedForms = JSON.parse(localStorage.getItem('hrFormulaires') || '[]');
    setFormulaires(storedForms);
  };

  const filteredForms = formulaires.filter(form => {
    const matchesSearch = form.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'tous' || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'brouillon':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Brouillon</span>;
      case 'publie':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Publié</span>;
      case 'ferme':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Fermé</span>;
      default:
        return null;
    }
  };

  const deleteFormulaire = (formId: string) => {
    const updatedForms = formulaires.filter(f => f.id !== formId);
    setFormulaires(updatedForms);
    localStorage.setItem('hrFormulaires', JSON.stringify(updatedForms));
    setShowDeleteModal(null);
  };

  const duplicateFormulaire = (form: Formulaire) => {
    const newForm = {
      ...form,
      id: Date.now().toString(),
      nom: `${form.nom} (Copie)`,
      createdAt: new Date().toISOString(),
      status: 'brouillon' as const
    };
    
    const updatedForms = [...formulaires, newForm];
    setFormulaires(updatedForms);
    localStorage.setItem('hrFormulaires', JSON.stringify(updatedForms));
  };

  const hasPermission = (requiredRole: string) => {
    const roleHierarchy = { admin: 3, hr_manager: 2, employee: 1 };
    const userLevel = roleHierarchy[user.role];
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy];
    return userLevel >= requiredLevel;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Formulaires RH</h1>
          <p className="text-gray-600 mt-1">Gérez vos formulaires de collecte de données</p>
        </div>
        {hasPermission('hr_manager') && (
          <button
            onClick={() => onNavigate('form-builder')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau formulaire
          </button>
        )}
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un formulaire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="tous">Tous les statuts</option>
              <option value="brouillon">Brouillons</option>
              <option value="publie">Publiés</option>
              <option value="ferme">Fermés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{formulaires.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Edit className="w-5 h-5 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Brouillons</p>
              <p className="text-2xl font-bold text-gray-900">
                {formulaires.filter(f => f.status === 'brouillon').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Publiés</p>
              <p className="text-2xl font-bold text-gray-900">
                {formulaires.filter(f => f.status === 'publie').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fermés</p>
              <p className="text-2xl font-bold text-gray-900">
                {formulaires.filter(f => f.status === 'ferme').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des formulaires */}
      <div className="bg-white rounded-lg shadow-sm border">
        {filteredForms.length === 0 ? (
          <div className="text-center py-12">
            <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'tous' ? 'Aucun formulaire trouvé' : 'Aucun formulaire'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'tous' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par créer votre premier formulaire'}
            </p>
            {hasPermission('hr_manager') && (!searchTerm && statusFilter === 'tous') && (
              <button
                onClick={() => onNavigate('form-builder')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer un formulaire
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Nom</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Onglets</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Créé le</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredForms.map((form) => (
                  <tr key={form.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{form.nom}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-600 max-w-xs truncate">
                        {form.description || 'Aucune description'}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(form.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-600">{form.onglets.length} onglet(s)</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-600">
                        {new Date(form.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onNavigate('form-builder', form.id)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => duplicateFormulaire(form)}
                          className="text-green-600 hover:text-green-700 p-1"
                          title="Dupliquer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {hasPermission('hr_manager') && (
                          <button
                            onClick={() => setShowDeleteModal(form.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer ce formulaire ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => deleteFormulaire(showDeleteModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormList;
