import Design from "@/app/homepage1/components/Design";
import Header from "@/app/homepage1/components/Header";
import BlogCarousel from "@/components/BlogCarousel";
import Wrapper from "@/components/Wrapper";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BlogPage = async ({ data }) => {
  // Fetch blogs from the backend
  const blogs = await fetch(`${process.env.BACKEND_URL}/blogs/`, {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": `${process.env.LOCALE_LANGUAGE}`,
    },
  }).then((res) => res.json());

  console.log(data.data.categories, "indiviual");

  return (
    <>
      {/* Top header (secondary variant) */}
      <Header secondary={true} bg={true} />

      {/* Outer container */}
      <div className="md:p-4 p-1 md:mx-12">
        {/* Image + Decorative Line Container */}

        <div className="relative flex flex-col justify-center  w-full md:p-4 p-1">
        <div className="mx-auto">
    <h2 className="text-sm md:mt-14 text-white text-center py-2 px-10 rounded-full bg-secondary border-[1px] border-white">
      {data.data.categories[0].name}
    </h2>
  </div>
          <div className="md:px-4 py-8 mx-auto max-w-7xl">
            <div className="flex justify-center">
              <h1 className="text-lg -mt-6 leading-tight text-primary md:text-4xl font-bold w-full text-center">
                {data.data.title}
              </h1>
            </div>
            <div className="flex justify-center mt-3">
              <p className="text-xs md:text-base text-center flex justify-center max-w-[600px]">
                {data.data.meta_description}
              </p>
            </div>

          </div>
          <div className="mx-auto w-full sm:w-3/4 md:w-[900px]">
  <Image
    src={data.data.featured_image}
    alt="hero"
    width={900}
    height={1000}
    layout="responsive" // Ensures the image scales with its container
    className="relative z-10 rounded-3xl"
    priority
  />
</div>
        </div>

        {/* Blog Content */}

        {/* Divider */}
        <div className="mb-8 h-[1px] w-full text-secondary bg-secondary" />

        {/* Blog HTML content */}
        <div
          className="mx-4 md:mx-10 lg:mx-20"
          dangerouslySetInnerHTML={{ __html: data.data.content }}
        />
      </div>

      {/* Latest Blog Section */}
      <div className="flex justify-center">
        <h1 className="mt-10 mb-10 text-primary text-center flex justify-center text-3xl font-bold">
          Related Articles You May Find Interesting
        </h1>
      </div>
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Wrapper>
          <BlogCarousel data={blogs} />
        </Wrapper>
      </div>
    </>
  );
};

export default BlogPage;
