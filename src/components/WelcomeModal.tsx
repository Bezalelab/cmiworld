import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCookies } from 'react-cookie';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';
import { X } from 'lucide-react'

export function WelcomeModal() {
  const [cookies, setCookie] = useCookies(['newUser']);
  const [isOpen, setIsOpen] = useState(!cookies.newUser);

  useEffect(() => {
    if (cookies.newUser) {
      setIsOpen(false);
    }
  }, [cookies]);

  const handleButtonClick = () => {
    setCookie('newUser', 'true', { path: '/', maxAge: 3600 * 24 * 365 }); // кука на 1 год
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
      
        <div className="flex flex-col gap-6 sm:flex-row md:gap-12">
          <div className="md:max-w-[300px]">
            <img src="/welcome-modal.png" alt="welcome" className="h-[160px] sm:h-full w-full rounded-2xl object-cover object-[center_-30px] sm:object-center" />
          </div>
          <div>
            <DialogHeader>
              <span className="text-md font-medium uppercase">08 June, 2024</span>
              <DialogTitle>
                We've updated <br></br> <span className="text-gray-3">our website</span>
              </DialogTitle>
              <DialogDescription>
                We are pleased to announce that our website has been updated. We have strived to make it as visually appealing and user-friendly as possible. If you have any questions, please feel
                free to contact us
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <Button variant="outlineDark" link="/contacts" size="sm" className="w-full sm:w-[115px]" onClick={handleButtonClick}>
                Contact us
              </Button>
              <Button variant="dark" size="sm" className="w-full normal-case outline-none sm:w-[115px]" onClick={handleButtonClick}>
                I like it!
              </Button>
            </div>
          </div>
        </div>
        <DialogClose className='absolute right-4 top-4' onClick={handleButtonClick}>
          <X className="size-6" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
