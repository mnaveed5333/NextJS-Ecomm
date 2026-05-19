'use client'
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
    const { user, isLoaded } = useUser()       // ✅ add isLoaded
    const { getToken, isSignedIn } = useAuth() // ✅ add isSignedIn
    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})

    const fetchProductData = async () => {
        try {
            const { data } = await axios.get('/api/product/list')
            if (data.success) {
                setProducts(data.products)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserData = async () => {
        try {
            if (user?.publicMetadata?.role === 'seller') {
                setIsSeller(true)
            }

            const token = await getToken()

            // ✅ stop if token not ready
            if (!token) return;

            const { data } = await axios.get('/api/user/data', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                if (data.user) {
                    setUserData(data.user)
                    setCartItems(data.user.cartItems || {})
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
        cartData[itemId] = (cartData[itemId] || 0) + 1;
        setCartItems(cartData);
        toast.success("Items Added to Cart")
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
            if (itemInfo && cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    // ✅ fetch products on app load
    useEffect(() => {
        fetchProductData()
    }, [])

    // ✅ wait for Clerk to fully load before fetching user data
    useEffect(() => {
        if (!isLoaded) return; // ✅ wait until Clerk is ready

        if (isSignedIn && user) {
            fetchUserData()
        } else {
            setUserData(false)
            setIsSeller(false)
            setCartItems({})
        }
    }, [isLoaded, isSignedIn, user]) // ✅ depend on all three

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