import React, { Suspense } from "react";
import Details1 from "../components/Details1";
import fetchData, {
  GetSpecialization,
  GetSpecificSpecialization,
} from "@/actions/server";
import NotFound from "@/app/not-found";
import SearchFilters_cities from "@/app/cities/[slug]/components/SearchFilters_cities";
import Design from "@/app/homepage1/components/Design";
import BlogCarousel from "@/components/BlogCarousel";
import Wrapper from "@/components/Wrapper";

// Function to fetch specialization data
async function fetchSpecializationData() {
  const res = await fetch(`${process.env.BACKEND_URL}/specializations`, {
    next: { revalidate: 60 },
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "en",
    },
  });
  return res.json();
}

async function fetchCourses() {
  const courses = await fetch(`${process.env.BACKEND_URL}/courses`, {
    next: { revalidate: 60 },
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "en",
    },
  });
  return courses.json();
}

export async function generateMetadata({ params }) {
  const { course, slug } = params;

  // Fetch course and specialization data
  const [courseData, specializationData] = await Promise.all([
    fetchCourses(),
    fetchSpecializationData(),
  ]);

  // Match data based on the slug or course
  const courses = courseData?.data?.find((c) => c.slug === course);
  const specialization = specializationData?.data?.find(
    (s) => s.slug === course
  );

  // Fallback to 404 if no valid data found
  const data = courses || specialization;
  if (!data) {
    return {
      title: "Page Not Found",
      description: "The requested page does not exist.",
    };
  }

  return {
    title: data.meta_title || "Crown Academy for Training & Development",
    description:
      data.meta_description ||
      "Discover specialized courses and training programs.",
    keywords:
      data.meta_keywords || "courses, specialization, training, programs",
    alternates: {
      canonical: `https://clinstitute.co.uk/${slug}/${course}`,
    },
    openGraph: {
      title: data.meta_title || "Crown Academy for Training & Development",
      description:
        data.meta_description ||
        "Explore top-notch training programs and courses.",
      url: `https://clinstitute.co.uk/${slug}/${course}`,
      images: [
        {
          url: data.image || "/logocrown.webp",
          width: 800,
          height: 600,
          alt: data.meta_title || "Course Image",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data.meta_title || "Crown Academy for Training & Development",
      description:
        data.meta_description ||
        "Explore specialized training programs and courses.",
      images: [data.image || "/logocrown.webp"],
    },
  };
}

const page = async ({ params }) => {
  const { course } = params;
  const { slug } = params;
  // Fetch both city and specialization data
  const [courseData, specializationData] = await Promise.all([
    fetchCourses(),
    fetchSpecializationData(),
  ]);

  const specialization1 = await fetch(
    `${process.env.BACKEND_URL}/specializations`,
    {
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en",
      },
    }
  ).then((res) => res.json());

  const Category1 = await fetch(`${process.env.BACKEND_URL}/categories`, {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "en",
    },
  }).then((res) => res.json());

  const category = await GetSpecialization();

  // Match slug with city or specialization
  const courses = courseData.data.find((c) => c.slug === course);
  const specialization = specializationData.data.find((s) => s.slug === course);

  // If not found, throw a 404
  if (!courses && !specialization) {
    return <NotFound />;
  }

  const data = courses || specialization;
  const type = courses ? "course" : "specialization";

  const course_specialization = await GetSpecificSpecialization(course);
  const blogs = await fetchData(`${process.env.BACKEND_URL}/blogs`);

  return (
    <div>
      {type === "course" ? (
        <>
          <Design
            search
            icon_white
            iamge={"/image_consult.png"}
            center
            input={false}
            image_height={false}
          >
            <h1 className="max-w-3xl mt-5 text-4xl items-center font-semibold text-white md:text-[55px] md:leading-[60px]">
              {data?.title}
            </h1>
          </Design>
          <Suspense fallback={"loading..."}>
            <Details1 course={data} />
          </Suspense>

          <div className="flex justify-center overflow-hidden">
            <h1 className="mt-10 mb-10 text-primary text-center flex justify-center text-2xl font-bold">
              New Articles You May Find Interesting
            </h1>
          </div>
          <div className="flex flex-col overflow-hidden justify-center gap-4 sm:flex-row">
            <Wrapper>
              <BlogCarousel data={blogs} />
            </Wrapper>
          </div>
        </>
      ) : (
        <>
          <Suspense fallback={"loading..."}>
            <SearchFilters_cities
              post={course_specialization}
              search
              params={course}
              specialization={specialization1}
              Category={Category1.data}
            />
          </Suspense>

          <div className="flex justify-center overflow-hidden">
            <h1 className="mt-10 mb-10 text-primary text-center flex justify-center text-2xl font-bold">
              New Articles You May Find Interesting
            </h1>
          </div>
          <div className="flex flex-col overflow-hidden justify-center gap-4 sm:flex-row">
            <Wrapper>
              <BlogCarousel data={blogs} />
            </Wrapper>
          </div>
        </>
      )}
    </div>
  );
};

export default page;

export async function generateStaticParams() {
  const [courseData, specializationData] = await Promise.all([
    fetchCourses(),
    fetchSpecializationData(),
  ]);

  // Ensure data exists before mapping
  const coursePaths =
    courseData?.data?.map((c) => ({
      slug: String(c.slug), // Ensure slug is a string
      course: String(c.slug),
    })) || [];

  const specializationPaths =
    specializationData?.data?.map((s) => ({
      slug: String(s.slug), // Ensure slug is a string
      course: String(s.slug),
    })) || [];

  return [...coursePaths, ...specializationPaths];
}
