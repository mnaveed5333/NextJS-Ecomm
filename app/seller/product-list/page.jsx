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
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      setDeletingId(productId);
      const token = await getToken();

      const { data } = await axios.delete('/api/product/delete', {
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
    if (user) {
      fetchSellerProduct();
    }
  }, [user])

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? <Loading /> : (
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">All Products</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
                  <th className="px-4 py-3 font-medium truncate">Price</th>
                  <th className="px-4 py-3 font-medium truncate">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-400">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr key={index} className="border-t border-gray-500/20">
                      <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                        <div className="bg-gray-500/10 rounded p-2">
                          <Image
                            src={product.image[0]}
                            alt="product Image"
                            className="w-16"
                            width={1280}
                            height={720}
                          />
                        </div>
                        <span className="truncate w-full">{product.name}</span>
                      </td>
                      <td className="px-4 py-3 max-sm:hidden">{product.category}</td>
                      <td className="px-4 py-3">${product.offerPrice}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">

                          {/* Visit button */}
                          <button
                            onClick={() => router.push(`/product/${product._id}`)}
                            className="flex items-center justify-center gap-1.5
               min-w-[40px] md:min-w-[100px]
               px-3 md:px-4 py-2
               bg-orange-600 hover:bg-orange-700 active:scale-95
               text-white text-sm font-medium
               rounded-lg transition-all duration-150 whitespace-nowrap"
                          >
                            <span className="hidden md:block">Visit</span>
                            <Image className="h-3.5 w-3.5 flex-shrink-0" src={assets.redirect_icon} alt="redirect_icon" />
                          </button>

                          {/* Delete button — identical width & bg as Visit */}
                          <button
                            onClick={() => deleteProduct(product._id)}
                            disabled={deletingId === product._id}
                            className="flex items-center justify-center gap-1.5
               min-w-[40px] md:min-w-[100px]
               px-3 md:px-4 py-2
               bg-orange-600 hover:bg-orange-700 active:scale-95
               disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
               text-white text-sm font-medium
               rounded-lg transition-all duration-150 whitespace-nowrap"
                          >
                            <span className="hidden md:block">
                              {deletingId === product._id ? 'Deleting...' : 'Delete'}
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0"
                              fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                        </div>
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
