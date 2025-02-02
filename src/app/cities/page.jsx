import React from "react";
import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import Link from "next/link";
import HeaderSection from "@/components/HeaderSection";
import Design from "../homepage1/components/Design";
import CourseListing from "@/components/ItemList";
import CityListing from "@/components/CityCourseList";


// --------- GENERATE METADATA FUNCTION ---------
export async function generateMetadata() {
  const data = await fetch(`${process.env.BACKEND_URL}/cities`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": `${process.env.LOCALE_LANGUAGE}`,

    },
    revalidate: 100,
  });

  const res = await data.json();

  const metaData = res?.data?.[0] || {};

  return {
    title: metaData.meta_title || "British Academy for Training & Development",
    description:
      metaData.meta_description ||
      "Explore courses offered by city at British Academy for Training & Development.",
    keywords: metaData.meta_keywords || "training, courses, cities, education",
    alternates: {
      canonical: `https://clinstitute.co.uk/cities`,
    },
    openGraph: {
      title: metaData.meta_title || "British Academy for Training & Development",
      description:
        metaData.meta_description ||
        "Explore courses offered by city at British Academy for Training & Development.",
      url: `https://clinstitute.co.uk/cities`,
      images: [
        {
          url: metaData.image || "/logobat.webp",
          width: 800,
          height: 600,
          alt: metaData.meta_title || "British Academy Image",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaData.meta_title || "British Academy for Training & Development",
      description:
        metaData.meta_description ||
        "Explore courses offered by city at British Academy for Training & Development.",
      images: [metaData.image || "/logobat.webp"],
    },
  };
}


const Page = async () => {
  const data = await fetch(`${process.env.BACKEND_URL}/cities`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": `${process.env.LOCALE_LANGUAGE}`,

    },
    revalidate: 100,
  });

  const res = await data.json();
  console.log(res);


  
  return (
    <>
      <Design
        icon_white
        iamge={"/image_consult.png"}
        center
        input={false}
        image_height={false}
        search_height={true}
      >
       <h2 className="text-5xl max-w-xl font-bold text-white dark:text-white">
            Courses Offered By  <span className="text-secondary">Location</span>
          </h2>
      </Design>
      <div className="container p-4 mx-auto">
        {/* Search Bar (Visible on Mobile Only) */}
        <div className="flex items-center pl-2 mb-8 rounded-lg lg:hidden border-primary bg-primary">
          <IoIosSearch size={25} color="white" />
          <input
            type="text"
            placeholder="Search City"
            className="w-full p-2 text-white border rounded-md placeholder:text-white border-primary bg-primary focus:outline-none focus:ring-primary"
          />
        </div>

        {/* Courses Grid */}
        <div className="flex justify-center ">
            <div className="mt-6">
              <CityListing cities={res.data}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
