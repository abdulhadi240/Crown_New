import Design from "@/app/homepage1/components/Design";
import AuthFormSignup from "@/components/AuthFormSignup";
import Head from "next/head";
import Image from "next/image";

const Page = () => {
  return (
    <>
    <Head>
      <title>Sign Up - London Crown Institute of Training</title>
      <meta
        name="description"
        content="At Crown London Institute, we're committed to assisting you at every stage. Fill out the form to contact us with any inquiries about our courses or services." />
      <meta property="og:title" content="Sign Up - London Crown Institute of Training" />
      <meta
        property="og:description"
        content="At Crown London Institute, we're committed to assisting you at every stage. Fill out the form to contact us with any inquiries about our courses or services." />
      {/* Add more meta tags as needed */}
    </Head>
      <Design secondary={true} bg={true}></Design>
      <section className="flex justify-center md:mt-10 size-full rounded-3xl max-sm:px-6">
        <Image
          src="/sign.webp"
          alt="signin"
          className="hidden h-[500px] w-[500px] m-20 rounded-3xl md:block"
          height={300} // These values are optional but can help with preloading
          width={300}
        />

        <div className="flex flex-col items-center justify-center gap-3 ">
          <div className="flex justify-center mt-2">
            <Image src="/Logocrown.webp" width={200} height={200} alt="logo" />
          </div>
          <div className="flex justify-center mb-10">
            <AuthFormSignup />
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
