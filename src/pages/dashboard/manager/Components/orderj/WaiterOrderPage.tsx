import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Plus, Minus, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';

import VariantSelectorModal from './VariantSelectorModal'; 
import type { Product, ProductVariant } from '../products/types/productTypes';
import { productService } from '../products/service/productService';
import { orderApi } from './orderApi';
import { $api } from '@/services/api';
import { OrderStatusEnum, type Order, type OrdersResponse } from './orderTypes';

interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  image: string | null;
}

const WaiterOrderPage: React.FC = () => {
  const { tableId, orderId } = useParams<{ tableId: string; orderId?: string }>();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      if (typeof window !== 'undefined' && tableId) {
        const savedCart = localStorage.getItem(`waiter_cart_${tableId}`);
        return savedCart ? JSON.parse(savedCart) : [];
      }
    } catch (error) {
      console.error('LocalStorage xatosi:', error);
    }
    return [];
  });
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(orderId || null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSynced, setIsSynced] = useState<boolean>(false); // ✅ Backendga yuborilganmi

  useEffect(() => {
    if (tableId && cart.length > 0) {
      localStorage.setItem(`waiter_cart_${tableId}`, JSON.stringify(cart));
    }
  }, [cart, tableId]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await productService.getAll({ page: 1, limit: 100, isAvailable: true });
        setProducts(response.items || []);
      } catch (error) {
        console.error("Menyu xatosi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Product kartochkaga bosilganda - variant tanlash oynasi ochiladi
  const handleAddClick = (product: Product) => {
    setSelectedProduct(product);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // ✅ Savatdagi item ustiga bosilganda - variant tanlash oynasi ochiladi
  const handleEditClick = (item: CartItem) => {
    const product = products.find(p => p.id === item.productId);
    if (product) {
      setSelectedProduct(product);
      setEditingItem(item);
      setIsModalOpen(true);
    }
  };

  // ✅ Modal orqali variant tanlanganda
  const handleVariantConfirm = (variant: ProductVariant, quantity: number) => {
    if (!selectedProduct) return;

    if (editingItem) {
      // Tahrirlash rejimi
      setCart(prev => {
        const filtered = prev.filter(item => item.variantId !== editingItem.variantId);
        const existingNewVariant = filtered.find(item => item.variantId === variant.id);
        
        if (existingNewVariant) {
          return filtered.map(item => 
            item.variantId === variant.id 
              ? { ...item, quantity: item.quantity + quantity } 
              : item
          );
        } else {
          return [...filtered, {
            variantId: variant.id,
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            variantName: variant.name,
            price: variant.price,
            quantity: quantity,
            image: selectedProduct.imageUrl
          }];
        }
      });
    } else {
      // Yangi qo'shish
      setCart(prev => {
        const existing = prev.find(item => item.variantId === variant.id);
        if (existing) {
          return prev.map(item => 
            item.variantId === variant.id 
              ? { ...item, quantity: item.quantity + quantity } 
              : item
          );
        }
        return [...prev, {
          variantId: variant.id,
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          variantName: variant.name,
          price: variant.price,
          quantity: quantity,
          image: selectedProduct.imageUrl
        }];
      });
    }
    
    setIsSynced(false); // ✅ Yangi mahsulot qo'shildi - backendga qayta yuborish kerak
  };

  // ✅ Savatdagi itemning "+" tugmasi - variant tanlamasdan qo'shadi
  const handleQuickAdd = (item: CartItem) => {
    setCart(prev => {
      return prev.map(cartItem => 
        cartItem.variantId === item.variantId 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      );
    });
    setIsSynced(false); // ✅ Backendga qayta yuborish kerak
  };

  // ✅ Savatdagi itemning "-" tugmasi
  const removeFromCart = (variantId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.variantId === variantId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => 
          item.variantId === variantId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item.variantId !== variantId);
    });
    setIsSynced(false); // ✅ Backendga qayta yuborish kerak
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // ✅ Tasdiqlash - backendga yuborish LEKIN savatni tozalamaslik
  const handleCheckout = async () => {
    if (cart.length === 0 || !tableId) return;
    
    setIsSubmitting(true);
    try {
      let orderId = currentOrderId;

      if (!orderId) {
        try {
          const newOrder = await orderApi.create({ tableId });
          orderId = newOrder.id;
          setCurrentOrderId(orderId);
          localStorage.setItem(`waiter_order_${tableId}`, orderId);
        } catch (createError: any) {
          if (createError?.response?.status === 409) {
            const { data } = await $api.get<OrdersResponse>('/orders', {
              params: { limit: 1000 }
            });
            
            const existingOrder = data.items.find(
              (o: Order) => o.tableId === tableId && o.status === OrderStatusEnum.OPEN
            );
            
            if (existingOrder) {
              orderId = existingOrder.id;
              setCurrentOrderId(orderId);
            } else {
              alert("Stol band, lekin ochiq buyurtma topilmadi.");
              setIsSubmitting(false);
              return;
            }
          } else {
            const message = createError?.response?.data?.message || 'Buyurtma yaratishda xatolik';
            alert(message);
            setIsSubmitting(false);
            return;
          }
        }
      }

      // Barcha mahsulotlarni backendga yuborish
      for (const item of cart) {
        await orderApi.addItem(orderId, {
          variantId: item.variantId,
          quantity: item.quantity
        });
      }

      // ✅ Savatni tozalamaslik - mijozlar hali o'tiribdi
      // localStorage.removeItem(\`waiter_cart_${tableId}\`); 
      
      setIsSynced(true); // ✅ Backendga yuborildi
      alert('Buyurtma muvaffaqiyatli yuborildi! Mijozlar yana buyurtma qo\'shishlari mumkin.');
      
      // ✅ Sahifada qolish - backga o'tmaslik
      // navigate('/waiter'); 
      
    } catch (error: any) {
      console.error("Buyurtma xatosi:", error);
      const message = error?.response?.data?.message || 'Buyurtma yuborishda xatolik';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-red-600 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="bg-white p-4 shadow-sm border-b z-10 shrink-0">
          <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
                   <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Menyu</h2>
                  <p className="text-xs text-gray-500">Stol #{tableId}</p>
                </div>
             </div>
          </div>
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Taom qidirish..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20">
            {filteredProducts.map(product => {
              const displayPrice = product.variants?.[0]?.price || 0;
              return (
                <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col items-center text-center group border border-transparent hover:border-red-100">
                  <div className="w-20 h-20 mb-3 flex items-center justify-center bg-gray-100 rounded-full overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">️</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 h-5">{product.name}</h3>
                  <p className="text-red-600 font-bold mb-3 text-sm">{displayPrice.toLocaleString()} so'm</p>
                  <button 
                    onClick={() => handleAddClick(product)}
                    className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Plus size={16} /> Qo'shish
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full sm:w-96 bg-white border-l shadow-xl flex flex-col h-full absolute sm:relative right-0 top-0 z-20 translate-x-full sm:translate-x-0 transition-transform duration-300">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
            <ShoppingCart className="text-red-600" size={20} /> Buyurtma
          </h3>
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">
            {cart.reduce((acc, i) => acc + i.quantity, 0)} ta
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-0">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-10 flex flex-col items-center">
              <ShoppingCart size={48} className="mb-2 opacity-20" />
              <p className="text-sm">Savat bo'sh</p>
            </div>
          ) : (
            cart.map(item => (
              <div 
                key={item.variantId} 
                className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100 group"
              >
                <div 
                  onClick={() => handleEditClick(item)}
                  className="flex items-center gap-3 overflow-hidden cursor-pointer flex-1"
                >
                   <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                     {item.image ? (
                       <img src={item.image} className="w-full h-full object-cover" />
                     ) : (
                       <span>🍽️</span>
                     )}
                   </div>
                   <div className="min-w-0">
                     <p className="font-medium text-sm text-gray-800 truncate">{item.productName}</p>
                     <p className="text-xs text-gray-500 truncate">{item.variantName}</p>
                   </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <div 
                    className="flex items-center bg-white rounded-lg border px-1 py-1 shadow-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button 
                      onClick={() => removeFromCart(item.variantId)} 
                      className="p-1 hover:text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Minus size={14}/>
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuickAdd(item)} 
                      className="p-1 hover:text-green-600 hover:bg-green-50 rounded transition"
                    >
                      <Plus size={14}/>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 shrink-0">
          <div className="flex justify-between mb-4 text-lg font-bold text-gray-900">
            <span>Jami:</span>
            <span>{totalAmount.toLocaleString()} so'm</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isSubmitting}
            className="w-full py-3.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition active:scale-[0.98]"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <CheckCircle size={20} />
            )}
            {isSubmitting ? 'Yuborilmoqda...' : 'Tasdiqlash'}
          </button>
          
          {isSynced && (
            <p className="text-xs text-green-600 text-center mt-2 font-medium">
              ✅ Buyurtma yuborildi. Mijozlar yana qo'shishlari mumkin.
            </p>
          )}
        </div>
      </div>

      {selectedProduct && (
        <VariantSelectorModal 
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleVariantConfirm}
          initialVariantId={editingItem?.variantId}
          initialQuantity={editingItem?.quantity}
        />
      )}
    </div>
  );
};

export default WaiterOrderPage;