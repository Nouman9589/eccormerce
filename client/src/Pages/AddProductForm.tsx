import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase/Firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { 
  Package, 
  Eye, 
  Save, 
  X, 
  AlertCircle, 
  ArrowLeft,
  DollarSign,
  Tag,
  FileText,
  Image as ImageIcon,
  Loader2,
  Plus,
  Info
} from "lucide-react";
import { useToast } from "../Components/NotificationSystem";

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: string;
  originalPrice: string;
  imageUrl: string;
  availableSizes: string[];
  stock: string;
  status: 'active' | 'draft' | 'out_of_stock';
  tags: string[];
  sku: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
}

interface ValidationErrors {
  [key: string]: string;
}

const CATEGORIES = [
  { value: 'shirts', label: 'Shirts' },
  { value: 'cloths', label: 'Cloths' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'footwear', label: 'Footwear' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'beauty', label: 'Beauty & Health' }
];

const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '39', '40', '41', '42', '43', '44', '45'];

const AddProductForm = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    category: "",
    price: "",
    originalPrice: "",
    imageUrl: "",
    availableSizes: [],
    stock: "0",
    status: 'active',
    tags: [],
    sku: "",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: ""
    }
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newSize, setNewSize] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();

  // Generate SKU automatically
  const generateSKU = () => {
    const prefix = formData.category.toUpperCase().slice(0, 3);
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `${prefix}-${random}`;
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Product name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (formData.originalPrice && parseFloat(formData.originalPrice) <= parseFloat(formData.price)) {
      newErrors.originalPrice = "Original price must be higher than current price";
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Product image is required";
    } else if (!isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "Please enter a valid image URL";
    }

    if (formData.stock && parseInt(formData.stock) < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if URL is valid
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handle image URL change with validation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, imageUrl: url }));
    setImageError(false);
    
    if (url && isValidUrl(url)) {
      setImageLoading(true);
    }
  };

  // Handle image load
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Handle image error
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Add size
  const addSize = (size: string) => {
    if (!formData.availableSizes.includes(size)) {
      setFormData(prev => ({
        ...prev,
        availableSizes: [...prev.availableSizes, size]
      }));
    }
  };

  // Remove size
  const removeSize = (sizeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      availableSizes: prev.availableSizes.filter(size => size !== sizeToRemove)
    }));
  };

  // Add custom size
  const addCustomSize = () => {
    if (newSize.trim() && !formData.availableSizes.includes(newSize.trim())) {
      addSize(newSize.trim());
      setNewSize("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Validation Error", "Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const productRef = doc(collection(db, "products"));
      const productId = productRef.id;

      const productData = {
        ...formData,
        id: productId,
        price: formData.price,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock) || 0,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: {
          length: formData.dimensions.length ? parseFloat(formData.dimensions.length) : null,
          width: formData.dimensions.width ? parseFloat(formData.dimensions.width) : null,
          height: formData.dimensions.height ? parseFloat(formData.dimensions.height) : null,
        },
        sku: formData.sku || generateSKU(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(productRef, productData);

      toast.success("Success!", "Product added successfully", {
        action: {
          label: "View Product",
          onClick: () => navigate(`/product/${productId}`)
        }
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        originalPrice: "",
        imageUrl: "",
        availableSizes: [],
        stock: "0",
        status: 'active',
        tags: [],
        sku: "",
        weight: "",
        dimensions: { length: "", width: "", height: "" }
      });
      setErrors({});

    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error", "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save as draft
  const handleSaveDraft = async () => {
    const draftData = { ...formData, status: 'draft' as const };
    setFormData(draftData);
    
    // Submit with draft status
    const event = { preventDefault: () => {} } as React.FormEvent;
    await handleSubmit(event);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link
                  to="/dashboard-items"
                  className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Package className="w-8 h-8 text-blue-600 mr-3" />
                    Add New Product
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Create a new product for your store
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {previewMode ? 'Edit Mode' : 'Preview'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!previewMode ? (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="w-5 h-5 text-blue-600 mr-2" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
        </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
          <select
            name="category"
            value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.category ? 'border-red-300' : 'border-gray-300'
                    }`}
          >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Describe your product in detail"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                Pricing & Inventory
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.price ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.price}
                    </p>
                  )}
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price ($) <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.originalPrice ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.originalPrice && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.originalPrice}
                    </p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.stock ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.stock}
                    </p>
                  )}
        </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU <span className="text-gray-400">(auto-generated if empty)</span>
                  </label>
                  <div className="flex">
          <input
            type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="SKU-12345"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, sku: generateSKU() }))}
                      className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 text-gray-600"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg) <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 text-purple-600 mr-2" />
                Product Image
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
            onChange={handleImageChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.imageUrl ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.imageUrl && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.imageUrl}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    Paste the URL of your product image
                  </p>
                </div>

                {/* Image Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="relative">
                    {formData.imageUrl ? (
                      <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                        {imageLoading && (
                          <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                          </div>
                        )}
                        {!imageError ? (
                          <img
                            src={formData.imageUrl}
                            alt="Product preview"
                            className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-red-500">
                            <AlertCircle className="w-8 h-8 mb-2" />
                            <p className="text-sm">Failed to load image</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">Image preview will appear here</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Available Sizes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 text-orange-600 mr-2" />
                Available Sizes
              </h2>
              
              {/* Common Sizes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select from common sizes:
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SIZES.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => addSize(size)}
                      disabled={formData.availableSizes.includes(size)}
                      className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                        formData.availableSizes.includes(size)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Size */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add custom size:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter custom size"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSize())}
                  />
                  <button
                    type="button"
                    onClick={addCustomSize}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Selected Sizes */}
              {formData.availableSizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected sizes:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.availableSizes.map(size => (
                      <span
                        key={size}
                        className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg"
                      >
                        {size}
                        <button
                          type="button"
                          onClick={() => removeSize(size)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 text-green-600 mr-2" />
                Product Tags
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add tags to help customers find your product:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {formData.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current tags:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
          )}
        </div>

            {/* Dimensions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 text-indigo-600 mr-2" />
                Product Dimensions <span className="text-sm font-normal text-gray-500">(optional)</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Length (cm)
                  </label>
                  <input
                    type="number"
                    name="dimensions.length"
                    value={formData.dimensions.length}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width (cm)
                  </label>
                  <input
                    type="number"
                    name="dimensions.width"
                    value={formData.dimensions.width}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="dimensions.height"
                    value={formData.dimensions.height}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Link
                  to="/dashboard-items"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Link>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={loading}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Save as Draft
                </button>
        <button
          type="submit"
          disabled={loading}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add Product
                    </>
                  )}
        </button>
              </div>
            </div>
      </form>
        ) : (
          /* Preview Mode */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Preview</h2>
              <p className="text-gray-600">This is how your product will appear to customers</p>
            </div>

            <div className="max-w-2xl mx-auto">
              {/* Product Image */}
              {formData.imageUrl && (
                <div className="mb-6">
                  <img
                    src={formData.imageUrl}
                    alt={formData.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{formData.name || 'Product Name'}</h3>
                  {formData.category && (
                    <p className="text-blue-600 font-medium">{CATEGORIES.find(c => c.value === formData.category)?.label}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-green-600">
                    ${formData.price || '0.00'}
                  </span>
                  {formData.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      ${formData.originalPrice}
                    </span>
                  )}
                </div>

                <p className="text-gray-700">{formData.description || 'Product description will appear here.'}</p>

                {formData.availableSizes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Available Sizes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.availableSizes.map(size => (
                        <span key={size} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {formData.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-sm text-gray-500">Stock:</span>
                    <span className="ml-2 font-medium">{formData.stock || '0'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      formData.status === 'active' ? 'bg-green-100 text-green-800' :
                      formData.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {formData.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductForm;
