import cloths from '../assets/cloths.webp';
import shoes from '../assets/shoes.webp';
import Newarrival from '../assets/Newarrival.webp';
import accesories from '../assets/accesories.png';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Cloths', img: cloths, link: '/cloths' },
  { name: 'Footwear', img: shoes, link: '/footwear' },
  { name: 'Shirts', img: Newarrival, link: '/shirts' },
  { name: 'Accessories', img: accesories, link: '/accessories' },
];

const Categorylink = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 w-full mt-4">
      {categories.map((category) => (
        <Link 
          to={category.link} 
          className="block relative group aspect-[4/3] sm:aspect-[3/4] lg:aspect-[4/3]" 
          key={category.name} 
          aria-label={`View ${category.name}`}>
          {/* Image */}
          <img 
            src={category.img} 
            alt={`Explore ${category.name}`} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            loading="lazy" 
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-lg sm:text-xl font-bold uppercase text-center px-2">{category.name}</span>
            <button className="mt-2 bg-white text-black px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded hover:bg-gray-200 transition-colors">
              Shop Now
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Categorylink;
