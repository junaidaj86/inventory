'use client'
import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from "react-hot-toast"

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            // Basic validation
            if (!username || !password) {
                toast.error('Please enter both username and password.');
                return;
            }


            // Attempt to sign in
            const result = await signIn('credentials', {
                redirect: false,
                username,
                password,
            });

            // Check if sign-in was unsuccessful and display error
            if (!result?.error) {
                // Redirect to the desired page after successful login
                router.push('/'); // Replace with your desired route
            } else {
                toast.error('Invalid username or password.');
            }
        } catch (error) {
            // Handle other unexpected errors
            console.error(error);
            toast.error('Something went wrong.');
        }
    };

    return (
         
          <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-12 w-auto"
            src="/ims-logo.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-500">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit} >
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-500">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder='enter your email address'
                  className="block w-full rounded-md border-0 p-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-500">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-white hover:text-primary/90">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder='enter your password'
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 p-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className='flex justify-center'>
              <Button
                type="submit"
                className='w-full'
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
      );
    };

