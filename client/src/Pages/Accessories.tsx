
import Categorylink from '../Components/Categorylink';
import ProductCard from '../Components/ProductCard';
import { useProductContext } from '../Context/ProductContext';
import Footer from '../Components/Footer';
import Loader from '../Resusebles/Loader';

const Accessories = () => {
  const { products, loading } = useProductContext(); // Get products and loading state from context

  // Filter products where the category is 'accessories'
  const filteredProducts = products.filter(
    (product) => product.category && product.category.toLowerCase() === 'accessories'
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <Categorylink />
      <h1 className="text-2xl  mb-6 text-center  mt-8 font-extralight">Accessories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              imageUrl={product.imageUrl}
              title={product.name}
              currentPrice={parseFloat(product.price)}
              originalPrice={undefined} // Add originalPrice property
              availableSizes={product.availableSizes || []}
              currency="$"
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No products found in this category.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Accessories;
