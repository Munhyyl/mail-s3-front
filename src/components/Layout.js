import Head from "next/head";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";

export default function Layout({ children, title = "File Storage System" }) {
  const [year, setYear] = useState("2025");

  useEffect(() => {
    // Клиент талд л он өөрчлөгдөнө
    setYear(new Date().getFullYear().toString());
  }, []);
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="File storage system with AWS S3" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <header className="bg-blue-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">
                File Storage
              </Link>

              <nav>
                <ul className="flex space-x-6">
                  <li>
                    <Link href="/" className="hover:text-blue-200 transition">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/files"
                      className="hover:text-blue-200 transition"
                    >
                      Files
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/emails"
                      className="hover:text-blue-200 transition"
                    >
                      Emails
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; {year} File Storage System. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
