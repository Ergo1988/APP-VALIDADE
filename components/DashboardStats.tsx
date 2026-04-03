import React from 'react';
import { Package, AlertTriangle, AlertOctagon, CheckCircle } from 'lucide-react';
import { Product, ExpirationStatus } from '../types';
import { getExpirationStatus } from '../utils/dateUtils';

interface DashboardStatsProps {
  products: Product[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ products }) => {
  const stats = products.reduce(
    (acc, product) => {
      const status = getExpirationStatus(product.expirationDate);
      acc.total++;
      if (status === ExpirationStatus.EXPIRED) acc.expired++;
      if (status === ExpirationStatus.WARNING) acc.warning++;
      if (status === ExpirationStatus.GOOD) acc.good++;
      return acc;
    },
    { total: 0, expired: 0, warning: 0, good: 0 }
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
          <Package size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Total de Itens</p>
          <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
        <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
          <AlertOctagon size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Vencidos</p>
          <h3 className="text-2xl font-bold text-gray-800">{stats.expired}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
        <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
          <AlertTriangle size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Atenção (29 dias)</p>
          <h3 className="text-2xl font-bold text-gray-800">{stats.warning}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
          <CheckCircle size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Na Validade</p>
          <h3 className="text-2xl font-bold text-gray-800">{stats.good}</h3>
        </div>
      </div>
    </div>
  );
};
