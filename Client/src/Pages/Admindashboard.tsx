import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Product {
  _id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface ProductForm {
  imageUrl: string;
  heading: string;
  price: string;
}

const Admindashboard = () => {
  const navigate = useNavigate()
  const { name } = useParams<{ name: string }>()

  const [newProduct, setNewProduct] = useState<ProductForm>({
    imageUrl: '',
    heading: '',
    price: ''
  })
  const [products, setProducts] = useState<Product[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const validateUser = async () => {
      try {
        const getproducts = await axios.post(`${import.meta.env.VITE_SERVER_URL}/adminitems/getitems`, { adminname: name }, {
          withCredentials: true
        });
        console.log(getproducts.data);

        if (Array.isArray(getproducts.data)) {
          setProducts(getproducts.data);
        } else if (getproducts.data.items && Array.isArray(getproducts.data.items)) {
          setProducts(getproducts.data.items);
        } else {
          console.error('Invalid products data structure received');
          setProducts([]);
        }

        console.log('Validating user...');
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth`, {
          withCredentials: true
        });

        if (response.data.message !== 'Authorized') return navigate('/adminlogin')
        if (response.data.person === 'admin') {
          return navigate(`/admin/${response.data.name}`);
        } else {
          return navigate(`/user/${response.data.name}`);
        }
      } catch (error) {
        console.error('Token validation failed:', error);
      }
    };
    validateUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });

    if (name === 'imageUrl' && value) {
      setPreviewImage(value);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProduct.imageUrl || !newProduct.heading || !newProduct.price) {
      toast.error('All fields are required');
      return;
    }

    if (isNaN(parseFloat(newProduct.price))) {
      toast.error('Price must be a valid number');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/adminitems/additems`,
        {
          imageurl: newProduct.imageUrl,
          adminname: name,
          name: newProduct.heading,
          price: newProduct.price
        },
        { withCredentials: true }
      );

      if (response.data && response.data.newProduct) {
        setProducts([...products, response.data.newProduct]);
      } else {
        const newProductItem: Product = {
          _id: Date.now().toString(),
          productId: Date.now().toString(),
          name: newProduct.heading,
          price: parseFloat(newProduct.price),
          image: newProduct.imageUrl,
          description: ''
        };
        setProducts([...products, newProductItem]);
      }

      setNewProduct({ imageUrl: '', heading: '', price: '' });
      setPreviewImage(null);

      toast.success('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, <span className="font-semibold text-indigo-600">{name}</span></span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Add New Product</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={newProduct.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/image.jpg"
                />
                {previewImage && (
                  <div className="mt-2 relative">
                    <img
                      src={previewImage}
                      alt="Product preview"
                      className="w-full h-40 object-contain border rounded-md"
                      onError={() => {
                        setPreviewImage(null);
                        toast.error('Invalid image URL');
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="heading" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="heading"
                  name="heading"
                  value={newProduct.heading}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Product Name"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="29.99"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : "Add Product"}
              </button>
            </form>
          </div>

          {/* Product List */}
          <div className="col-span-1 lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md h-full">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Product List</h2>

              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p>No products added yet</p>
                  <p className="text-sm mt-2">Added products will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map((product) => (
                    <div key={product._id || product.productId} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Error';
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 truncate">{product.name}</h3>
                        {product.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-indigo-600 font-bold">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Admindashboard