import React, { useState } from "react";
import { db } from "../firebase/Firebase";
import { collection, doc, setDoc } from "firebase/firestore";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
  });
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle input field changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, category: e.target.value });
  };

  // Handle image URL change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.value || null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.description ||
      !formData.category ||
      !formData.price ||
      !image
    ) {
      alert("Please fill all fields and provide an image URL.");
      return;
    }

    setLoading(true);
    try {
      // Generate a unique ID
      const productRef = doc(collection(db, "products"));
      const productId = productRef.id;

      // Save product details to Firestore
      await setDoc(productRef, {
        ...formData,
        price: parseFloat(formData.price), // Ensure price is stored as a number
        imageUrl: image,
        id: productId, // Add the ID to the product data
        createdAt: new Date(),
      });

      alert("Product added successfully!");
      setFormData({ name: "", description: "", category: "", price: "" });
      setImage(null);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Add a New Product</h1>
      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Product Category */}
        <div className="mb-4">
          <select
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="shoes">Shoes</option>
            <option value="shirts">Shirts</option>
            <option value="accessories">Accessories</option>
            <option value="cloth">Cloth</option>
          </select>
        </div>

        {/* Product Price */}
        <div className="mb-4">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <input
            type="text"
            value={image || ""}
            onChange={handleImageChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Image URL"
            required
          />
          {image && (
            <img
              src={image}
              alt="Preview"
              className="mt-3 w-full h-40 object-cover rounded-md border border-gray-200"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-all"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
