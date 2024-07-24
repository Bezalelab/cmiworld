import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { ReactSVG } from 'react-svg';

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

  async function onSubmit(values: z.infer<typeof formSchema>, e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('https://cmiauto.bezalelstudio.co/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_address: values.email }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: "You've successfully subscribed to our newsletter!",
        });
        form.reset();
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to subscribe. Please try again later.',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="join container my-20 lg:my-30">
      <div className="flex flex-col gap-8 border-b border-t border-black py-20">
        <h2 className="text-center text-2xl uppercase lg:text-3xl">RECEIVE OUR NEWSLETTER</h2>
        <p className="mx-auto max-w-[456px] text-center text-xs text-black sm:text-sm">Join us every week, from wherever you are in the world, to connect with Jesus and community</p>
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
                    <ReactSVG src="/arrow-long.svg" />
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
