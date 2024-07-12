import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import SVG from 'react-inlinesvg';
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      description: 'Your email has been sent.',
    });
  }

  return (
    <div className="container my-20 lg:my-30 join">
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
                  <button type="submit" className="absolute end-5 top-1/2 -translate-y-1/2" aria-label='submit button'>
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
