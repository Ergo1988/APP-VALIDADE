import React, { useState } from 'react';
import { Trash2, Sparkles, ChefHat, Loader2 } from 'lucide-react';
import { Product, ExpirationStatus } from '../types';
import { getDaysUntilExpiration, getExpirationStatus, formatDate } from '../utils/dateUtils';
import { getUsageSuggestions } from '../services/geminiService';
import ReactMarkdown from 'react-markdown'; // Assuming standard handling, but we will render simple text if pkg missing, actually let's use simple whitespace render to avoid dep issues

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onDelete }) => {
  const [loadingSuggestionId, setLoadingSuggestionId] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{ id: string; text: string } | null>(null);

  const handleGetSuggestion = async (product: Product) => {
    setLoadingSuggestionId(product.id);
    setSuggestion(null);
    const text = await getUsageSuggestions(product);
    setSuggestion({ id: product.id, text });
    setLoadingSuggestionId(null);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="text-gray-400" size={32} />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Nenhum produto cadastrado</h3>
        <p className="text-gray-500 mt-2">Adicione itens para começar a monitorar a validade.</p>
      </div>
    );
  }

  // Sort by expiration date (soonest first)
  const sortedProducts = [...products].sort((a, b) => {
    return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
  });

  return (
    <div className="space-y-4">
      {sortedProducts.map((product) => {
        const daysLeft = getDaysUntilExpiration(product.expirationDate);
        const status = getExpirationStatus(product.expirationDate);

        let statusColor = '';
        let statusText = '';
        let showAiButton = false;

        switch (status) {
          case ExpirationStatus.EXPIRED:
            statusColor = 'bg-red-50 border-red-200 text-red-700';
            statusText = `Venceu há ${Math.abs(daysLeft)} dias`;
            showAiButton = true; // Can ask about disposal or if safe
            break;
          case ExpirationStatus.WARNING:
            statusColor = 'bg-amber-50 border-amber-200 text-amber-700';
            statusText = `Vence em ${daysLeft} dias`;
            showAiButton = true; // Relevant for recipes
            break;
          case ExpirationStatus.GOOD:
            statusColor = 'bg-green-50 border-green-200 text-green-700';
            statusText = `Vence em ${daysLeft} dias`;
            showAiButton = false;
            break;
        }

        return (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Product Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusColor}`}>
                    {statusText}
                  </span>
                </div>
                <div className="text-sm text-gray-500 flex gap-4">
                  <span>{product.category}</span>
                  <span>•</span>
                  <span>{product.quantity} {product.unit}</span>
                  <span>•</span>
                  <span>Validade: {formatDate(product.expirationDate)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {showAiButton && (
                  <button
                    onClick={() => handleGetSuggestion(product)}
                    disabled={loadingSuggestionId === product.id}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                    title="Pedir sugestão de uso à IA"
                  >
                    {loadingSuggestionId === product.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <ChefHat size={18} />
                    )}
                    <span className="hidden sm:inline">Dicas de Uso</span>
                  </button>
                )}
                
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remover produto"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* AI Suggestion Area */}
            {suggestion && suggestion.id === product.id && (
              <div className="bg-indigo-50 px-6 py-4 border-t border-indigo-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                    <Sparkles size={16} /> Sugestão Inteligente
                  </h4>
                  <button 
                    onClick={() => setSuggestion(null)} 
                    className="text-indigo-400 hover:text-indigo-600 text-xs"
                  >
                    Fechar
                  </button>
                </div>
                <div className="text-sm text-indigo-800 whitespace-pre-wrap leading-relaxed">
                  {suggestion.text}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
