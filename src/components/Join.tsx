import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import SVG from 'react-inlinesvg';
import { useEffect } from 'react';
import emailjs from '@emailjs/browser';
const formSchema = z.object({
  email: z.string().email(),
});

const Join = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    window._ctct_m = '00a2182e38d16bb79f9f5557e6625eec';

    const script = document.createElement('script');
    script.src = 'https://static.ctctcdn.com/js/signup-form-widget/current/signup-form-widget.min.js';
    script.async = true;
    script.id = 'signupScript';

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);



  return (
    <div className="join container my-20 lg:my-30">
      <div className="flex flex-col gap-8 border-b border-t border-black py-20">
        <h2 className="text-center text-2xl uppercase lg:text-3xl"> Receive our e-letter</h2>
        <p className="mx-auto max-w-[456px] text-center text-xs text-black sm:text-sm">
          If you would like to receive out e-letter that we sent out regularly (about every 2 months) about our ministry just give sign up below
        </p>
        <div className="ctct-inline-form" data-form-id="52d7608f-0ed9-47bf-885f-bd2a8393a8ad"></div>
      </div>
      <Toaster />
    </div>
  );
};

export default Join;
