import React, { useState, useEffect } from 'react';
import { Plus, CalendarClock } from 'lucide-react';
import { Product } from './types';
import { DashboardStats } from './components/DashboardStats';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('validade-control-products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Failed to parse products", e);
      }
    }
  }, []);

  // Save to LocalStorage whenever products change
  useEffect(() => {
    localStorage.setItem('validade-control-products', JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: crypto.randomUUID(),
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este item?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <CalendarClock size={28} strokeWidth={2.5} />
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Validade Control</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Adicionar Produto</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Stats */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Visão Geral</h2>
          <DashboardStats products={products} />
        </section>

        {/* Product List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Seus Produtos</h2>
            {products.length > 0 && (
              <span className="text-sm text-gray-500">{products.length} itens cadastrados</span>
            )}
          </div>
          <ProductList products={products} onDelete={handleDeleteProduct} />
        </section>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <ProductForm 
          onAddProduct={handleAddProduct} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;
