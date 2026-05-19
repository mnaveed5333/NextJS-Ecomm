'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {
  const { router, getToken, user } = useAppContext()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [removingId, setRemovingId] = useState(null)

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/product/seller-list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const deleteProduct = async (productId) => {
    try {
      setDeletingId(productId);
      setConfirmId(null);

      const token = await getToken();
      const { data } = await axios.delete(`/api/product/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId }
      });

      if (data.success) {
        toast.success("Product deleted");
        setRemovingId(productId);
        setTimeout(() => {
          setProducts(prev => prev.filter(p => p._id !== productId));
          setRemovingId(null);
        }, 400);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    if (user) fetchSellerProduct();
  }, [user])

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOut {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(40px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.85); }
          70%  { transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        .row-item {
          animation: slideIn 0.35s ease both;
        }
        .row-item-removing {
          animation: slideOut 0.4s ease forwards;
        }
        .confirm-pop {
          animation: popIn 0.25s ease both;
        }
        .action-fade {
          animation: fadeUp 0.2s ease both;
        }
      `}</style>

      <div className="flex-1 min-h-screen flex flex-col justify-between bg-orange-50/30">
        {loading ? (
          <Loading />
        ) : (
          <div className="w-full md:p-10 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 tracking-tight">Products</h2>
                <p className="text-xs text-gray-400 mt-0.5">Manage your store listings</p>
              </div>
              <span className="text-xs font-medium text-orange-500 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full">
                {products.length} {products.length === 1 ? 'listing' : 'listings'}
              </span>
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7H4a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1zM16 3H8l-1 4h10l-1-4z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">No products yet</p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <div className="min-w-[920px]">
                  {/* Table Header */}
                  <div className="grid grid-cols-[90px_minmax(0,1fr)_120px_260px] gap-4 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-white/70 border border-gray-100 rounded-2xl mb-3">
                    <div>Image</div>
                    <div>Product</div>
                    <div>Price</div>
                    <div className="text-center">Actions</div>
                  </div>

                  {/* Rows */}
                  <div className="flex flex-col gap-3">
                    {products.map((product, index) => (
                      <div
                        key={product._id}
                        style={{ animationDelay: `${index * 0.05}s` }}
                        className={`row-item grid grid-cols-[90px_minmax(0,1fr)_120px_260px] gap-4 items-center bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 transition-all duration-300
                          ${removingId === product._id ? 'row-item-removing' : ''}
                        `}
                      >
                        {/* Image */}
                        <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden bg-gray-50">
                          <Image
                            src={product.image[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-medium text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                              {product.category}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {product.name}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="text-sm font-semibold text-gray-700">
                          ${product.offerPrice}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-center gap-2">
                          {confirmId === product._id ? (
                            <div className="confirm-pop flex items-center gap-2">
                              <p className="text-xs text-gray-400">Remove this product?</p>
                              <button
                                onClick={() => deleteProduct(product._id)}
                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-all duration-200 active:scale-95"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setConfirmId(null)}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-medium rounded-lg transition-all duration-200 active:scale-95"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <div className="action-fade flex items-center gap-2">
                              <button
                                onClick={() => router.push(`/product/${product._id}`)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-xl transition-all duration-200 active:scale-95"
                              >
                                <span>Visit</span>
                                <Image className="h-3 w-3 brightness-[10]" src={assets.redirect_icon} alt="" />
                              </button>

                              <button
                                onClick={() => setConfirmId(product._id)}
                                disabled={deletingId === product._id}
                                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-400 hover:text-red-500 text-xs font-medium rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {deletingId === product._id ? (
                                  <svg className="animate-spin h-3.5 w-3.5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1H9z" />
                                  </svg>
                                )}
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default ProductList;