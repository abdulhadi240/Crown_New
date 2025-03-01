import Image from "next/image";
import React from "react";
import Design from "./homepage1/components/Design";

// Define metadata for the page
export const metadata = {
  title: '404 Page Not Found',
  description: 'Oops! The page you are looking for does not exist.',
  robots: 'noindex, follow',
};

export default function NotFound() {
  return (
    <main>
      <Design secondary/>
      <div className="flex items-center justify-center mt-20">
        <Image src={'/404.webp'} width={500} height={500} alt="404 - Page Not Found" />
      </div>
    </main>
  );
};


