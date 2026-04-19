'use client'

import { useState } from 'react';
import { togglePropertyStatus } from '../../admin/properties/actions';
import Link from 'next/link';

interface PropertyActionsProps {
  propertyId: number | string;
  isActive: boolean;
}

export default function PropertyActions({ propertyId, isActive }: PropertyActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await togglePropertyStatus(propertyId, isActive);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Error al cambiar el estado de la propiedad');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Link
          href={`/admin/properties/${propertyId}`}
          title="Editar propiedad"
          className="p-2 rounded-lg text-gray-400 hover:text-mosque hover:bg-hint-of-green/30 transition-all"
        >
          <span className="material-icons text-xl">edit</span>
        </Link>
        
        {isActive ? (
          <button
            onClick={() => setIsModalOpen(true)}
            title="Desactivar propiedad"
            className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-all"
          >
            <span className="material-icons text-xl">visibility_off</span>
          </button>
        ) : (
          <button
            onClick={handleToggle}
            disabled={isToggling}
            title="Activar propiedad"
            className="p-2 rounded-lg text-gray-400 hover:text-mosque hover:bg-hint-of-green/30 transition-all"
          >
            <span className="material-icons text-xl">{isToggling ? 'sync' : 'visibility'}</span>
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                <span className="material-icons text-2xl">warning</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-nordic">¿Desactivar propiedad?</h3>
                <p className="text-sm text-gray-500">
                  La propiedad dejará de ser visible en el sitio público y en los resultados de búsqueda. Podrás volver a activarla en cualquier momento.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isToggling}
              >
                Cancelar
              </button>
              <button
                onClick={handleToggle}
                disabled={isToggling}
                className="px-6 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-lg shadow-orange-600/20 flex items-center gap-2"
              >
                {isToggling ? (
                  <>
                    <span className="material-icons text-sm animate-spin">sync</span>
                    Desactivando...
                  </>
                ) : (
                  'Sí, Desactivar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
