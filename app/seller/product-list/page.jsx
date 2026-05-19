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
        toast.success("Product deleted successfully");
        setProducts(prev => prev.filter(p => p._id !== productId));
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
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? <Loading /> : (
        <div className="w-full md:p-10 p-4">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-lg font-medium text-gray-800">All Products</h2>
            <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="max-w-4xl w-full rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
            <table className="table-fixed w-full">

              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="w-2/3 md:w-2/5 px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">Product</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider truncate max-sm:hidden">Category</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">Price</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16">
                      <div className="flex flex-col items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
                        </svg>
                        <p className="text-gray-400 text-sm">No products found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50/70 transition-colors duration-150 group"
                    >
                      {/* Product */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="shrink-0 w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                            <Image
                              src={product.image[0]}
                              alt="product"
                              className="w-full h-full object-cover"
                              width={56}
                              height={56}
                            />
                          </div>
                          <span className="truncate text-sm font-medium text-gray-700">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5 max-sm:hidden">
                        <span className="inline-block text-xs font-medium text-orange-700 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-gray-800">
                          ${product.offerPrice}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        {confirmId === product._id ? (
                          /* Inline confirm UI — replaces buttons momentarily */
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 max-md:hidden">Sure?</span>
                            <button
                              onClick={() => deleteProduct(product._id)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-lg transition-colors"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {/* Visit */}
                            <button
                              onClick={() => router.push(`/product/${product._id}`)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-lg transition-colors max-sm:hidden"
                            >
                              <span>Visit</span>
                              <Image className="h-3 w-3" src={assets.redirect_icon} alt="" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setConfirmId(product._id)}
                              disabled={deletingId === product._id}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              {deletingId === product._id ? (
                                <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                </svg>
                              ) : (
                                <>
                                  <span className="hidden md:block">Delete</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1H9z" />
                                  </svg>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;