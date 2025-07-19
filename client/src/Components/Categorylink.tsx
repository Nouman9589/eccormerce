import cloths from '../assets/cloths.webp';
import shoes from '../assets/shoes.webp';
import Newarrival from '../assets/Newarrival.webp';
import accesories from '../assets/accesories.png';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Cloths', img: cloths, link: '/Cloths' },
  { name: 'Footwear', img: shoes, link: '/FootWear' },
  { name: 'Shirts', img: Newarrival, link: '/Shirts' },
  { name: 'Accessories', img: accesories, link: '/accessories' },
];

const Categorylink = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 w-full mt-4">
      {categories.map((category) => (
        <Link 
          to={category.link} 
          className="block relative group" 
          key={category.name} 
          aria-label={`View ${category.name}`}>
          {/* Image */}
          <img 
            src={category.img} 
            alt={`Explore ${category.name}`} 
            className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105" 
            loading="lazy" 
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xl font-bold uppercase">{category.name}</span>
            <button className="mt-2 bg-white text-black px-4 py-2 text-sm rounded hover:bg-gray-200">
              Shop Now
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Categorylink;
