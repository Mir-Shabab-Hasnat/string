import { Ribbon } from 'lucide-react';
import React from 'react'

const Logo = ({ size }: { size: number }) => {
  // Map the size to Tailwind CSS size classes
  const getSizeClass = (size: number) => {
    switch (size) {
      case 1:
        return "text-sm h-4 w-4";
      case 2:
        return "text-lg h-6 w-6";
      case 3:
        return "text-xl h-8 w-8";
      case 4:
        return "text-2xl h-9 w-9";
      case 5:
        return "text-3xl h-10 w-10";
      case 6:
        return "text-4xl h-11 w-11";
      case 7:
        return "text-5xl h-12 w-12";
      case 8:
        return "text-6xl h-14 w-14";
      default:
        return "text-5xl h-11 w-11"; // Default to text-5xl and h-11 w-11
    }
  };

  const sizeClass = getSizeClass(size);

  return (
    <a href="/dashboard" className="flex items-center gap-2">
      <Ribbon className={`stroke stroke-indigo-500 stroke-[1.5] mr-4 ${sizeClass.split(' ').slice(1).join(' ')}`} />
      <p
        className={`bg-gradient-to-r from-indigo-400 to-indigo-600 dark:from-indigo-50 dark:to-indigo-300 bg-clip-text font-bold leading-tight tracking-tighter text-transparent ${sizeClass.split(' ')[0]}`}
      >
        Verse
      </p>
    </a>
  );
};

  export const LogoMobile = () => {
    return (
      <a href='/' className='flex items-center gap-2'>
          
          <p className='bg-gradient-to-r from-indigo-400 to-indigo-600 dark:from-indigo-50 dark:to-indigo-300 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent'>
              Verse
          </p>
      </a>
    )
  }
  
  export default Logo;