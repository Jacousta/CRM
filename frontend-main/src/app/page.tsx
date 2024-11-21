"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "../utils/firebase";

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    try {
      await googleProvider();
      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 px-4 flex-grow">
        <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mb-6">
          <svg
            width="70"
            height="70" 
            viewBox="0 0 70 70"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="50%" 
              y="50%" 
              textAnchor="middle" 
              dominantBaseline="middle" 
              fontFamily="Arial, sans-serif" 
              fontSize="28"
              fill="blue" 
            >
              Xeno
            </text>
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Welcome to Xeno Mini CRM
        </h1>
        <p className="text-lg md:text-xl text-center max-w-2xl">
          A retail-focused CRM powerhouse for effortless Personalisation
        </p>
        <button
          onClick={signInWithGoogle}
          className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all"
        >
          Sign in with Google
        </button>
      </header>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 px-4 flex-grow">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            Why Choose Xeno Mini CRM?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Deep customer understanding
              </h3>
              <p className="text-gray-600">
                Consolidate all customer information into one easy-to-use system for a complete view of your audience for a deeper customer understanding.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Personalised Marketing Campaigns at scale
              </h3>
              <p className="text-gray-600">
                Drive customer engagement and conversions by running hyper-personalized marketing campaigns at scale across popular channels like email.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                User-Friendly Interface
              </h3>
              <p className="text-gray-600">
                Enjoy a clean and intuitive UI designed for simplicity and productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-blue-600 text-white py-16 px-4 text-center flex-grow">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Transform Your Business?
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Sign in with Google to get started and explore the power of Xeno Mini CRM today!
        </p>
        <button
          onClick={signInWithGoogle}
          className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all"
        >
          Get Started
        </button>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="w-100 mx-auto md:flex-row  ">
          <p className="text-center mb-4 md:mb-0">
            © {new Date().getFullYear()} Akhil. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;