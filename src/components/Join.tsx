import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import SVG from 'react-inlinesvg';
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

  async function onSubmit(values: z.infer<typeof formSchema>, e) {
    
  }

  return (
    <div className="join container my-20 lg:my-30">
      <div className="flex flex-col gap-8 border-b border-t border-black py-20">
        <h2 className="text-center text-2xl uppercase lg:text-3xl"> Receive our e-letter</h2>
        <p className="mx-auto max-w-[456px] text-center text-xs text-black sm:text-sm">
           If you would like to receive out e-letter that we sent out regularly (about every 2 months)  about our ministry just give sign up below
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full max-w-[387px]">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <button type="submit" className="absolute end-5 top-1/2 -translate-y-1/2" aria-label="submit button">
                    <SVG src="/arrow-long.svg" />
                  </button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <Toaster />
    </div>
  );
};

export default Join;
