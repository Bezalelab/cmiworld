import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva('inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm gap-3 font-medium transition-colors disabled:pointer-events-none disabled:opacity-500', {
  variants: {
    variant: {
      default: 'bg-white text-black hover:bg-white/90',
      outline: 'border border-white text-white hover:bg-white hover:text-black hover:border-transparent',
      outlineDark: 'border border-black text-black hover:bg-black hover:text-white hover:border-transparent',
      dark: 'border border-transparent bg-black text-white uppercase hover:bg-transparent hover:border-black hover:text-black',
    },
    size: {
      default: 'h-10 px-5 md:px-8',
      sm: 'h-10 px-5 py-3',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLElement> {
  className?: string;
  link?: string;
  variant: 'default' | 'outline' | 'outlineDark' | 'dark';
  size?: any;
  external?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ className, variant, external, size, link, ...props }) => {
  const baseClass = twMerge(buttonVariants({ variant, size, className }));
  if (link) {
    const linkElement = external ? <a href={link} className={baseClass} target="_blank" rel="noopener noreferrer" {...props} /> : <a href={link} className={baseClass} {...props} />;
    return linkElement;
  } else {
    return <button aria-label="button" className={baseClass} {...props} />;
  }
};
