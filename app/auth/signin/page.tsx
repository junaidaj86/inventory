'use client'
import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            // Basic validation
            if (!username || !password) {
                setError('Please enter both username and password.');
                return;
            }

            // Clear previous error
            setError(null);

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
                setError('Invalid username or password.');
            }
        } catch (error) {
            // Handle other unexpected errors
            setError('Something went wrong. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className="bg-gray-900 text-white p-8 max-w-md mx-auto mt-20 rounded-md shadow-md flex flex-col justify-center">
          <form onSubmit={handleSubmit} >
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              />
            </div>
            {/* Display error message */}
            {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
            >
              Sign In
            </button>
          </form>
        </div>
      );
    };

