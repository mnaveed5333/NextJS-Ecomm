'use client'
import { productsDummyData } from "@/assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()
    const { user } = useUser()
    const { getToken } = useAuth()
    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false)  // ✅ false not true
    const [cartItems, setCartItems] = useState({})

    const fetchProductData = async () => {
        try {
            setProducts(productsDummyData)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserData = async () => {
        try {
            if (user?.publicMetadata?.role === 'seller') {  // ✅ optional chaining
                setIsSeller(true)
            }

            const token = await getToken()
            const { data } = await axios.get('/api/user/data', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                if (data.user) {                            // ✅ null check
                    setUserData(data.user)
                    setCartItems(data.user.cartItems || {}) // ✅ fallback
                }
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = (cartData[itemId] || 0) + 1;    // ✅ cleaner increment
        setCartItems(cartData);

        try {
            const token = await getToken()
            await axios.post('/api/cart/update',
                { cartItems: cartData },
                { headers: { Authorization: `Bearer ${token}` } }
            )
        } catch (error) {
            toast.error(error.message)
        }
    }

    const updateCartQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)

        try {
            const token = await getToken()
            await axios.post('/api/cart/update',
                { cartItems: cartData },
                { headers: { Authorization: `Bearer ${token}` } }
            )
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (itemInfo && cartItems[items] > 0) {         // ✅ null check for itemInfo
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        if (user) {
            fetchUserData()
        } else {
            setUserData(false)      // ✅ reset on logout
            setIsSeller(false)
            setCartItems({})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const value = {
        user, getToken,
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}