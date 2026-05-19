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
    const { user } = useUser()
    const { getToken } = useAuth()
    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})

    // ✅ fetch all products from database (no auth needed — public route)
    const fetchProductData = async () => {
        try {
            const { data } = await axios.get('/api/product/list')  // ✅ removed productsDummyData
            if (data.success) {
                setProducts(data.products)  // ✅ real products from MongoDB
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // ✅ fetch logged in user data from database
    const fetchUserData = async () => {
        try {
            // ✅ check if user is seller from clerk metadata
            if (user?.publicMetadata?.role === 'seller') {
                setIsSeller(true)
            }

            const token = await getToken()
            const { data } = await axios.get('/api/user/data', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                if (data.user) {
                    setUserData(data.user)
                    setCartItems(data.user.cartItems || {}) // ✅ fallback to empty cart
                }
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // ✅ add item to cart and sync with database
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

    // ✅ update cart item quantity or remove if quantity is 0
    const updateCartQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId]; // ✅ remove item from cart
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

    // ✅ get total number of items in cart
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    // ✅ get total price of items in cart
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

    // ✅ fetch user data when user logs in, reset everything on logout
    useEffect(() => {
        if (user) {
            fetchUserData()
        } else {
            setUserData(false)   // ✅ reset on logout
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