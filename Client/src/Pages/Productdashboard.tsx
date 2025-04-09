import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

interface Product {
    _id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    description: string;
}

interface CartItem extends Product {
    quantity: number;
}

const Productdashboard = () => {
    const navigate = useNavigate()
    const { name, adminname } = useParams<{ name: string; adminname: string }>()

    const [products, setProducts] = useState<Product[]>([])
    const [cart, setCart] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(true)
    const [showOrderModal, setShowOrderModal] = useState(false)
    const [showCart, setShowCart] = useState(false)
    const [adminInfo, setAdminInfo] = useState<{ name: string, email?: string } | null>(null)

    useEffect(() => {
        const validateAndFetchData = async () => {
            try {

                const authResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth`, {
                    withCredentials: true
                });

                if (authResponse.data.message !== 'Authorized') {
                    navigate('/userlogin');
                    return;
                }

                if (authResponse.data.person === 'admin') {
                    navigate(`/admin/${authResponse.data.name}`);
                    return;
                }

                if (adminname) {
                    try {
                        const adminResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/admin/${adminname}`, {
                            withCredentials: true
                        });
                        setAdminInfo(adminResponse.data.admin || { name: adminname });
                    } catch (error) {
                        console.error('Failed to fetch admin info:', error);
                        setAdminInfo({ name: adminname });
                    }
                }

                const productsResponse = await axios.post(`${import.meta.env.VITE_SERVER_URL}/adminitems/getitems`, { adminname: name }, {
                    withCredentials: true
                });

                if (Array.isArray(productsResponse.data)) {
                    setProducts(productsResponse.data);
                } else if (productsResponse.data.items && Array.isArray(productsResponse.data.items)) {
                    setProducts(productsResponse.data.items);
                } else if (productsResponse.data.products && Array.isArray(productsResponse.data.products)) {
                    setProducts(productsResponse.data.products);
                } else {
                    throw new Error('Invalid products data structure received');
                }

                try {
                    const cartResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/cart/${name}`, {
                        withCredentials: true
                    });
                    if (cartResponse.data && Array.isArray(cartResponse.data.items)) {
                        setCart(cartResponse.data.items);
                    }
                } catch (error) {
                    console.error('Failed to fetch cart:', error);
                }

            } catch (error) {
                console.error('Error in data fetching:', error);
            } finally {
                setLoading(false);
            }
        };

        validateAndFetchData();
    }, [navigate, name, adminname]);

    const addToCart = async (product: Product) => {
        try {

            const existingItemIndex = cart.findIndex(item => item._id === product._id);

            let updatedCart: CartItem[];

            if (existingItemIndex >= 0) {
                updatedCart = [...cart];
                updatedCart[existingItemIndex].quantity += 1;
            } else {
                const newItem = { ...product, quantity: 1 };
                updatedCart = [...cart, newItem];
            }

            setCart(updatedCart);
            setShowCart(true);

            await axios.post(`${import.meta.env.VITE_SERVER_URL}/cart/add`, {
                userId: name,
                productId: product._id,
                quantity: 1
            }, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    const updateCartItemQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            const updatedCart = cart.map(item =>
                item._id === itemId ? { ...item, quantity: newQuantity } : item
            );
            setCart(updatedCart);

            await axios.put(`${import.meta.env.VITE_SERVER_URL}/cart/update`, {
                userId: name,
                productId: itemId,
                quantity: newQuantity
            }, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const removeFromCart = async (itemId: string) => {
        try {

            const updatedCart = cart.filter(item => item._id !== itemId);
            setCart(updatedCart);

            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/cart/remove`, {
                data: {
                    userId: name,
                    productId: itemId
                },
                withCredentials: true
            });
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        }
    };

    const placeOrder = () => {
        try {

            setShowOrderModal(true);
            setShowCart(false);

            axios.post(`${import.meta.env.VITE_SERVER_URL}/orders/create`, {
                userId: name,
                items: cart,
                sellerName: adminname
            }, {
                withCredentials: true
            }).catch(error => {
                console.error('Failed to place order:', error);
            });
        } catch (error) {
            console.error('Failed to place order:', error);
        }
    };

    const startNewOrder = () => {
        setCart([]);
        setShowOrderModal(false);

        axios.delete(`${import.meta.env.VITE_SERVER_URL}/cart/clear`, {
            data: { userId: name },
            withCredentials: true
        }).catch(error => {
            console.error('Failed to clear cart on server:', error);
        });
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const sampleProducts = [
        {
            _id: "1",
            productId: "waffle",
            name: "Waffle with Berries",
            price: 6.50,
            image: "https://images.unsplash.com/photo-1562376552-0d160a2f35b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
            description: "Waffle",
            quantity: 1
        },
        {
            _id: "2",
            productId: "brulee",
            name: "Vanilla Bean Crème Brûlée",
            price: 7.00,
            image: "https://images.unsplash.com/photo-1611611158005-bed21e1ad4ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
            description: "Crème Brûlée",
            quantity: 1
        },
        {
            _id: "3",
            productId: "macaron",
            name: "Macaron Mix of Five",
            price: 8.00,
            image: "https://images.unsplash.com/photo-1558326567-98ae2405596b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1159&q=80",
            description: "Macaron",
            quantity: 1
        },
        {
            _id: "4",
            productId: "tiramisu",
            name: "Classic Tiramisu",
            price: 5.50,
            image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80",
            description: "Tiramisu",
            quantity: 1
        },
        {
            _id: "5",
            productId: "baklava",
            name: "Pistachio Baklava",
            price: 4.00,
            image: "https://images.unsplash.com/photo-1625470420345-549a27bf05e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
            description: "Baklava",
            quantity: 1
        },
        {
            _id: "6",
            productId: "pie",
            name: "Lemon Meringue Pie",
            price: 5.00,
            image: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            description: "Pie",
            quantity: 1
        }
    ];

    const displayProducts = products.length > 0 ? products : sampleProducts;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="w-full max-w-7xl mx-auto mb-8 px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {adminInfo?.name || "Dessert"} Shop
                </h1>
                <button
                    onClick={() => setShowCart(!showCart)}
                    className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-gray-700">Your Cart ({cart.length})</span>
                </button>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {!loading && displayProducts.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="h-48 sm:h-60 overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <div className="text-sm text-gray-500 mb-1">{product.description}</div>
                            <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                            <div className="flex flex-wrap justify-between items-center gap-2">
                                <span className="text-gray-900">${product.price.toFixed(2)}</span>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="flex items-center space-x-2 text-gray-600 border border-gray-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-gray-50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showOrderModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full relative">

                        <button
                            onClick={() => setShowOrderModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-semibold mb-4">Order Confirmed</h2>
                        <p className="text-gray-600 mb-6">We hope you enjoy your food!</p>

                        <div className="space-y-4 mb-6">
                            {cart.map((item) => (
                                <div key={item._id} className="flex items-center space-x-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-12 h-12 object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <span>x{item.quantity}</span>
                                            <span className="mx-1">•</span>
                                            <span>${item.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <span className="text-gray-900 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between text-lg font-semibold mb-6">
                                <span>Order Total</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>

                            <button
                                onClick={startNewOrder}
                                className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition-colors"
                            >
                                Start New Order
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {cart.length > 0 && showCart && !showOrderModal && (
                <div className="fixed right-0 sm:right-4 top-0 sm:top-20 w-full sm:w-96 h-full sm:h-auto bg-white rounded-lg shadow-xl p-4 sm:p-6 z-40 overflow-y-auto sm:overflow-visible max-h-screen sm:max-h-[80vh]">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Your Cart</h2>
                        <button
                            onClick={() => setShowCart(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-4 mb-6 max-h-[calc(100vh-250px)] overflow-y-auto">
                        {cart.map((item) => (
                            <div key={item._id} className="flex items-center space-x-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium truncate">{item.name}</h3>
                                    <div className="flex flex-wrap items-center mt-1 gap-2">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => updateCartItemQuantity(item._id, item.quantity - 1)}
                                                className="text-gray-500 hover:text-gray-700 w-6 h-6 flex items-center justify-center border rounded"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}
                                                className="text-gray-500 hover:text-gray-700 w-6 h-6 flex items-center justify-center border rounded"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-red-500 hover:text-red-600 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                <span className="text-gray-900 whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between font-semibold mb-4">
                            <span>Total</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>

                        <button
                            onClick={placeOrder}
                            className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition-colors"
                        >
                            Confirm Order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Productdashboard