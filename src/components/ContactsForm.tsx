import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Input } from './ui/input';

const contactsItems = [
  { id: 'first_name', label: 'First Name' },
  { id: 'last_name', label: 'Last Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone number' },
  { id: 'message', label: 'Message' },
] as const;

const formSchema = z.object({
  first_name: z.string().min(1, 'First Name is required'),
  last_name: z.string().min(1, 'Last Name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone: z.string().regex(/^\+?\d*$/, 'Invalid phone number'),
  message: z.string().max(300, { message: 'The message cannot contain more than 300 characters' }).min(1, 'Message is required'),
});

const ContactsForm = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      description: 'Your email has been sent.',
    });
  }

  const onNumberOnlyChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const isBackspaceOrDelete = event.key === 'Backspace' || event.key === 'Delete';
    const isSelectionKey = (event.ctrlKey || event.metaKey) && (event.key === 'a' || event.key === 'c' || event.key === 'x');
    const isPlusSign = event.key === '+' || event.key === '=';
    const isValid = new RegExp('[0-9+]').test(event.key);
    if (!isValid && !isBackspaceOrDelete && !isSelectionKey && !isPlusSign) {
      event.preventDefault();
      return;
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-10 max-w-[820px]">
          <div className="mb-10 grid gap-x-5 gap-y-12 sm:grid-cols-2">
            {contactsItems.map((item) => (
              <div key={item.id} className={`${item.id === 'message' && 'sm:col-span-2'}`}>
                <FormField
                  control={form.control}
                  name={item.id}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        {item.id !== 'message' ? (
                          <>
                            <Input
                              onKeyDown={item.id === 'phone' ? onNumberOnlyChange : undefined}
                              {...field}
                              id={item.id}
                              placeholder={item.label}
                              className={`!rounded-none border-x-0 border-b border-gray-2 !placeholder-gray-2 focus:!border-black focus:!placeholder-black ${fieldState.invalid && '!border-[#FF9292] placeholder:!text-[#FF9292]'} border-t-0 p-0 placeholder:uppercase`}
                            />
                          </>
                        ) : (
                          <AutosizeTextarea
                            {...field}
                            placeholder="MESSAGE"
                            className={`focus:!border-black  focus:!placeholder-black !rounded-none ${fieldState.invalid && 'placeholder-![#FF9292] border-[#FF9292]'}`}
                          />
                        )}
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
          <Button type="submit" variant="outlineDark" className="px-10">
            Send
          </Button>
        </form>
      </Form>

      <Toaster />
    </div>
  );
};

export default ContactsForm;
