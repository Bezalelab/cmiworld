import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useState, useEffect } from 'react';
import { ReactSVG } from 'react-svg';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { currentYear } from '@/utils/currentYears';

const menuLinks = [
  { label: 'home', href: '/' },
  { label: 'welcome', href: '/welcome' },
  { label: 'About', href: '/about' },
  { label: 'Vision 2024', href: '/our-vision' },
  { label: 'Statements', href: '/statement' },
  { label: 'Countries', href: '/countries' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact us', href: '/contacts' },
];

const Header = ({ currentPath, countries }: any) => {
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 75);
    };
    setScroll(window.scrollY > 75);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header className={`fixed left-0 z-[100] w-full bg-white py-2 transition-all ${scroll && 'shadow-md'}`}>
      <div className="container flex w-full items-center justify-between md:py-4 xl:gap-8">
        <Sheet>
          <SheetTrigger className="absolute left-8 sm:relative sm:left-0 xl:hidden z-10">
            <ReactSVG src="/burger.svg" />
          </SheetTrigger>
          <SheetContent side="left">
            <ul className="mb-6 flex flex-col gap-6 *:text-sm *:uppercase *:text-black">
              {menuLinks.map((item, index) => (
                <li key={index}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <Button variant="dark" size="sm" link="/donation" className="normal-case">
              Giving online
            </Button>
          </SheetContent>
        </Sheet>
        <nav className="mr-auto hidden justify-end xl:block">
          <ul className="flex gap-6 *:text-sm *:uppercase *:text-black">
            <li className={`${currentPath === '/about/' && 'font-semibold'}`}>
              <a href="/about" className="link-underline">
                about
              </a>
            </li>
            <li className={`${currentPath === '/our-vision/' && 'font-semibold'}`}>
              <a href="/our-vision" className="link-underline">
                vision {currentYear()}
              </a>
            </li>
            <li className={`${currentPath === '/welcome/' && 'font-semibold'}`}>
              <a href="/welcome" className="link-underline">
                welcome
              </a>
            </li>
          </ul>
        </nav>
        <a href="/" className="text-center mx-auto w-[190px] lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <span className={`font-logo text-black transition-all ${scroll ? 'text-[34px] leading-none' : 'text-[48px] leading-[32px]'}`}>cmi</span>
          <p className={`transform text-nowrap pt-[14px] font-display text-[12px] font-medium uppercase leading-none text-gray-3 transition-all ease-in-out ${scroll ? 'hidden' : 'block'}`}>
            Christian Missions International
          </p>
        </a>
        <nav className="hidden xl:block">
          <ul className="flex items-center gap-6 *:text-sm *:uppercase *:text-black">
            <li className={`${currentPath === '/blog/' && 'font-semibold'}`}>
              <a href="/blog" className="link-underline">
                blog
              </a>
            </li>
            <li>
              <HoverCard openDelay={300}>
                <HoverCardTrigger className="group flex cursor-pointer items-center gap-2" asChild>
                  <a href="/countries">
                    countries
                    <span className="size-2.5">
                      <ReactSVG src="/chevron.svg" className="transition-transform group-data-[state=open]:rotate-180" />
                    </span>
                  </a>
                </HoverCardTrigger>
                <HoverCardContent>
                  <SimpleBar style={{ maxHeight: 240 }} autoHide={false} scrollbarMaxSize={100}>
                    <ul>
                      {countries.default.map((item, index) => (
                        <li className="transitions-colors group relative p-3 text-gray-3" key={index}>
                          <a href={`/countries/${item.slug}/`} className="block">
                            {item.title}
                          </a>
                          <span className="absolute left-0 top-0 h-10 w-[3px] bg-gray-3 opacity-0 transition-all group-hover:opacity-100"></span>
                        </li>
                      ))}
                    </ul>
                  </SimpleBar>
                </HoverCardContent>
              </HoverCard>
            </li>
            <li className={`${currentPath === '/contacts/' && 'font-semibold'}`}>
              <a href="/contacts" className="link-underline">
                contact us
              </a>
            </li>
          </ul>
        </nav>
        <Button variant="dark" size="sm" link="/donation" className="hidden lg:flex">
          GIVE NOW
        </Button>
      </div>
    </header>
  );
};

export default Header;
