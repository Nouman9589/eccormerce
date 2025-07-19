import { useEffect, useState } from "react";
import { db } from "../firebase/Firebase";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  price: string;
  createdAt: { seconds: number };
}

const DashboardItems = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Fetch products from Firestore and listen to real-time updates
  const fetchProducts = () => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (querySnapshot) => {
        const productsList: Product[] = [];
        querySnapshot.forEach((doc) => {
          const productData = doc.data() as Product;
          productsList.push({ ...productData, id: doc.id });
        });
        setProducts(productsList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching products:", error);
        alert("Failed to load products.");
        setLoading(false);
      }
    );

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  };

  // Delete product
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  // Edit product
  const handleEdit = (product: Product) => {
    setEditProduct(product);
  };

  // Update product in Firestore
  const handleUpdate = async () => {
    if (!editProduct) return;
    try {
      const productRef = doc(db, "products", editProduct.id);
      await updateDoc(productRef, {
        name: editProduct.name,
        description: editProduct.description,
        category: editProduct.category,
        imageUrl: editProduct.imageUrl,
        price: editProduct.price,
      });
      alert("Product updated successfully!");
      setEditProduct(null); // Reset the edit state
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Product Dashboard</h1>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center text-xl">No Products Available</div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 shadow-md rounded-md hover:shadow-lg transition-all"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-700 mb-2">{product.description}</p>
                <p className="text-blue-500 mb-2">Category: {product.category}</p>
                <p className="text-green-500 font-semibold mb-2">Price: ${product.price}</p>
                {/* Display Product ID */}
                <p className="text-sm text-gray-500">ID: {product.id}</p>
                <p className="text-sm text-gray-500">
                  Added on: {new Date(product.createdAt.seconds * 1000).toLocaleDateString()}
                </p>

                <div className="flex justify-between mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            {/* Display Product ID in Edit Modal */}
            <p className="text-sm text-gray-500 mb-2">Editing Product ID: {editProduct.id}</p>
            <input
              type="text"
              value={editProduct.name}
              onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <textarea
              value={editProduct.description}
              onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={editProduct.category}
              onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={editProduct.price}
              onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              placeholder="Price"
            />
            <input
              type="text"
              value={editProduct.imageUrl}
              onChange={(e) => setEditProduct({ ...editProduct, imageUrl: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              placeholder="Image URL"
            />
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setEditProduct(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardItems;
