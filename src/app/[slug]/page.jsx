import React from "react";
import NotFound from "../not-found";
import fetchData, { GetAllCategory, GetSpecificSpecialization } from "@/actions/server";
import Programs from "@/components/Programs";
import Specialization from "@/components/Specialization";
import City from "@/components/City";


// Fetch city, specialization, and program data
async function fetchCityData() {
  return fetchData(`${process.env.BACKEND_URL}/cities`);
}

async function fetchSpecializationCategory() {
  return fetchData(`${process.env.BACKEND_URL}/specializations_categories`);
}

async function fetchSpecializationData() {
  return fetchData(`${process.env.BACKEND_URL}/specializations`);
}

async function fetchProgramData() {
  return fetchData(`${process.env.BACKEND_URL}/programs`);
}

async function fetchCityCourses(slug) {
  return fetchData(`${process.env.BACKEND_URL}/courses/${slug}/cities?per_page=10&page=1`);
}

async function fetchProgramCourses(slug) {
  return fetchData(`${process.env.BACKEND_URL}/courses?program=${slug}&per_page=10&page=1`);
}

async function fetchCategoryData() {
  return fetchData(`${process.env.BACKEND_URL}/categories`);
}

export async function generateMetadata({ params }) {
  const { slug } = params;

  // Fetch details for city, specialization, or program
  const [cityCourses, specializationCourses, programCourses] = await Promise.all([
    fetchCityCourses(slug),
    fetchSpecializationData(),
    fetchProgramCourses(slug),
  ]);

  const data = cityCourses || specializationCourses || programCourses;

  if (!data) {
    return {
      title: "Page Not Found",
      description: "The requested page does not exist.",
    };
  }

  return {
    title: data?.data?.meta_title || "London Crown Institute of Training",
    description: data?.data?.meta_description || "Explore top courses, programs, and specializations.",
    keywords: data?.data?.meta_keywords || "training, courses, programs, specialization",
    alternates: {
      canonical: `https://clinstitute.co.uk/${slug}`,
    },
    openGraph: {
      title: data?.data?.meta_title,
      description: data?.data?.meta_description,
      url: `https://clinstitute.co.uk/${slug}`,
      images: [
        {
          url: data?.data?.image || "https://clinstitute.co.uk/logocrown.webp",
          width: 800,
          height: 600,
          alt: data?.data?.meta_title || "Course Image",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data?.data?.meta_title,
      description: data?.data?.meta_description,
      images: [data?.data?.image || "https://clinstitute.co.uk/logocrown.webp"],
    },
  };
}

// Dynamic Page Component
export default async function Page({ params }) {
  const { slug } = params;

  const [cityData, specializationData, cityCourses, programs, programCourses ,SpecializationCategory , categoryData] =
    await Promise.all([
      fetchCityData(),
      fetchSpecializationData(),
      fetchCityCourses(slug),
      fetchProgramData(),
      fetchProgramCourses(slug),
      fetchSpecializationCategory(),
      fetchCategoryData()
    ]);

    const category = await GetAllCategory().catch(() => []);
    const specialization_courses = await GetSpecificSpecialization(slug).catch(() => []);
    
    const city = cityData?.data?.find((c) => c.slug === slug);
    const specialization = specializationData?.data?.find((s) => s.slug === slug);
    const program = programs?.data?.find((p) => p.slug === slug);

    
    if (!city && !specialization && !program) {
      return <NotFound />;
    }
  
    const data = city || specialization || programCourses;
    const type = city ? "city" : specialization ? "specialization" : "program";

    return (
      <>
        {type === "city" ? (
          <City check_city_courses cities params={slug} data={data} city={cityData} specialization={specializationData} SpecializationCategory={SpecializationCategory} category={categoryData}/>
        ) : type === "specialization" ? (
          <Specialization params={slug} data={data} city={cityData} specialization={specializationData} SpecializationCategory={SpecializationCategory} category={categoryData}/>
        ) : (
          <Programs params={slug} data={data} city={cityData} specialization={specializationData} SpecializationCategory={SpecializationCategory} category={categoryData}/>
      
        )}
      </>
    );
  
}

export async function generateStaticParams() {
  const [cityData, specializationData, programs] = await Promise.all([
    fetchCityData(),
    fetchSpecializationData(),
    fetchProgramData(),
  ]);

  // Ensure data exists before mapping and extract slug properly
  const cityPaths =
    cityData?.data?.map((city) => ({
      slug: String(city.slug), // Convert to string explicitly
    })) || [];

  const specializationPaths =
    specializationData?.data?.map((specialization) => ({
      slug: String(specialization.slug),
    })) || [];

  const programPaths =
    programs?.data?.map((program) => ({
      slug: String(program.slug),
    })) || [];
  return [...cityPaths, ...specializationPaths, ...programPaths];
}
