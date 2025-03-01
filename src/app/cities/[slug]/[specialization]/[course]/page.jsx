import React, { Suspense } from "react";
import fetchData, { GetSpecialization } from "@/actions/server";
import BlogPage from "@/app/blogs-details/components/BlogPage";
import Head from "next/head";
import Design from "@/app/homepage1/components/Design";
import Details1 from "@/app/[slug]/components/Details1";
import BlogCarousel from "@/components/BlogCarousel";
import Wrapper from "@/components/Wrapper";

export const dynamic = "force-dynamic";

async function fetchCourseData() {
  return fetchData(`${process.env.BACKEND_URL}/courses`);
}

async function fetchBlogData() {
  return fetchData(`${process.env.BACKEND_URL}/blogs?per_page=5&page=1`);
}

async function fetchCourseDetail(slug) {
  return fetchData(`${process.env.BACKEND_URL}/courses/${slug}`);
}

async function fetchBlogDetail(slug) {
  return fetchData(`${process.env.BACKEND_URL}/blogs/${slug}`);
}

// --------- GENERATE METADATA FUNCTION ---------
export async function generateMetadata({ params }) {
  const { course } = params;
  const { slug } = params;
  const { specialization } = params;

  // Fetch course or blog details based on slug
  const [courseData, blogData] = await Promise.all([
    fetchCourseDetail(course),
    fetchBlogDetail(course),
  ]);

  const data = courseData || blogData;
  console.log(data, "data");
  if (!data) {
    return {
      title: "Page Not Found",
      description: "The requested page does not exist.",
    };
  }

  return {
    title: data?.data?.meta_title || "Crown Academy for Training & Development",
    description:
      data?.data?.meta_description || "Explore top courses and blogs",
    keywords:
      data?.data?.meta_keywords || "training, courses, blogs, development",
    alternates: {
      canonical: `https://clinstitute.co.uk/${slug}/${specialization}/${course}`,
    },
    openGraph: {
      title: data?.data?.meta_title,
      description: data?.data?.meta_description,
      url: `https://clinstitute.co.uk/${slug}/${specialization}/${course}`,
      images: [
        {
          url: data?.data?.image || "https://clinstitute.co.uk/Logocrown.webp",
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
      images: [data?.data?.image || "https://clinstitute.co.uk/Logocrown.webp"],
    },
  };
}

const page = async ({ params }) => {
  const { course } = params;

  const [course1, blog, courseData, blogData] = await Promise.all([
    fetchCourseData(),
    fetchBlogData(),
    fetchCourseDetail(course),
    fetchBlogDetail(course),
  ]);

  const courses = course1?.data?.find((c) => c.slug === course);
  const blogs = blog?.data?.find((s) => s.slug === course);

  const course_carasoul = await fetchData(`${process.env.BACKEND_URL}/courses`);

  const data = courseData || blogData;
  const type = courses ? "courses" : "blogs";

  const category = await GetSpecialization();

  return (
    <>
      <Head>
        <title>
          {data?.data?.meta_title ||
            "London Crown Institute of Training"}
        </title>
        <meta
          name="title"
          content={
            data?.data?.meta_title ||
            "London Crown Institute of Training"
          }
        />
        <meta
          name="description"
          content={
            data?.data?.meta_description ||
            "London Crown Institute of Training"
          }
        />
        <meta
          name="keywords"
          content={
            data?.data?.meta_keywords ||
            "London Crown Institute of Training"
          }
        />
        <meta
          name="author"
          content={
            data?.data?.meta_author ||
            "London Crown Institute of Training"
          }
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={data?.data?.meta_title} />
        <meta
          property="og:description"
          content={data?.data?.meta_description}
        />
        <meta
          property="og:image"
          content={data?.data?.image || "https://clinstitute.co.uk/Logocrown.webp"}
        />
        <meta
          property="og:url"
          content={data?.data?.meta_url || `https://clinstitute.co.uk/cities`}
        />
        <meta
          property="og:site_name"
          content={
            data?.data?.site_name ||
            "London Crown Institute of Training"
          }
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data?.data?.meta_title} />
        <meta
          name="twitter:description"
          content={data?.data?.meta_description}
        />
        <meta
          name="twitter:image"
          content={data?.data?.image || "/Logocrown.webp"}
        />
        <meta
          name="twitter:site"
          content={data?.data?.twitter_site || "@yourTwitterHandle"}
        />
        <link rel="canonical" href={`https://clinstitute.co.uk/cities`} />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name:
                data?.data?.meta_title ||
                "London Crown Institute of Training",
              description:
                data?.data?.meta_description ||
                "London Crown Institute of Training",
              url: data?.data?.meta_url || `https://clinstitute.co.uk/cities`,
              image: data?.data?.image || "https://clinstitute.co.uk/Logocrown.webp",
              author: {
                "@type": "Person",
                name:
                  data?.meta_author ||
                  "London Crown Institute of Training",
              },
            }),
          }}
        />
      </Head>
      {type === "courses" ? (
        <>
          <Design
            icon_white
            iamge={"/image_consult.png"}
            center
            search
            input={false}
            image_height={false}
          >
            <h1 className="max-w-3xl mt-5 text-4xl items-center font-semibold text-white md:text-[55px] md:leading-[60px]">
              {data?.data.title
                .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
                .split(" ") // Split the string into an array of words
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ) // Capitalize the first letter of each word
                .join(" ")}
            </h1>
          </Design>
          <Suspense fallback={"loading..."}>
            <Details1 course={data.data} />
          </Suspense>

          <div className="flex justify-center overflow-hidden">
            <h1 className="mt-10 mb-10 text-primary text-center flex justify-center text-2xl font-bold">
              New Articles You May Find Interesting
            </h1>
          </div>
          <div className="flex flex-col overflow-hidden justify-center gap-4 sm:flex-row">
            <Wrapper>
              <BlogCarousel data={blog} />
            </Wrapper>
          </div>
        </>
      ) : (
        <div>
          <BlogPage data={data} />
        </div>
      )}
    </>
  );
};

export default page;

export async function generateStaticParams() {
  const [course, blog] = await Promise.all([
    fetchCourseData(),
    fetchBlogData(),
  ]);

  const courses = course?.data?.map((course) => ({ slug: course.slug })) || [];
  const blogs = blog?.data?.map((blog) => ({ slug: blog.slug })) || [];

  return [...courses, ...blogs];
}
