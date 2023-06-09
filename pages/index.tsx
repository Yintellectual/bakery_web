import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import Modal from "../components/Modal";
import cloudinary from "../utils/cloudinary";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { Cake, ImageProps, Schema } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import retrieveCakeByPhoto from "../utils/rest/retrieveCakeByPhoto";
import cakeSchema from "../utils/rest/cakeSchema";
import cakeDrawing from "../public/cake.jpg";
import BakeryLogo from "../components/Icons/BakeryLogo";
const Home: NextPage = ({
  images,
  cakeSchema,
}: {
  images: ImageProps[];
  cakeSchema: Schema;
}) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  const [imageProps, setImageProps] = useState(images);

  const handleCakeUpdate = function (cake: Cake) {
    setImageProps(
      imageProps.map((image) => {
        if (image.public_id == cake.photo) {
          return {
            ...image,
            tags: cake.tags.map((tag) => ({ id: tag, text: tag })),
          };
        } else {
          return image;
        }
      })
    );
  };

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head>
        <title>Next.js Conf 2022 Photos</title>
        <meta
          property="og:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
        />
        <meta
          name="twitter:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={imageProps}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
            cakeSchema={cakeSchema}
            handleCakeUpdate={handleCakeUpdate}
          />
        )}
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-5 flex h-[629px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <div className="absolute inset-0  items-center justify-center opacity-20">
              <span className="flex max-h-full max-w-full items-center justify-center">
                <Image src={cakeDrawing} alt="logo"></Image>
              </span>
              <span className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black"></span>
            </div>
            <BakeryLogo />
            <h1 className="mb-4 mt-8 text-base font-bold uppercase tracking-widest">
              2022 Event Photos
            </h1>
            <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
              Our incredible Next.js community got together in San Francisco for
              our first ever in-person conference!
            </p>
            <button
              className="z-10 mt-6 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-4"
              onClick={() => {
                //test()
                testLog(cakeSchema);
              }}
            >
              测试按钮
            </button>
            <a
              className="pointer invisible z-10 mt-6 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-4"
              href="https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-cloudinary&project-name=nextjs-image-gallery&repository-name=with-cloudinary&env=NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET,CLOUDINARY_FOLDER&envDescription=API%20Keys%20from%20Cloudinary%20needed%20to%20run%20this%20application"
              target="_blank"
              rel="noreferrer"
            >
              Clone and Deploy
            </a>
          </div>
          {imageProps.map(({ id, public_id, format, blurDataUrl, tags }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt="Next.js Conf photo"
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gray-800 px-4 py-2 opacity-70">
                <h3 className="text-xl font-bold text-white">{public_id}</h3>
                <p className="mt-2 text-sm text-gray-300">
                  {tags.map((tag) => {
                    return (
                      <span
                        key={"tag_" + tag.text + public_id}
                        className=" mx-1 rounded bg-white px-1 text-sm font-semibold text-black transition  "
                      >
                        {tag.text}
                      </span>
                    );
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Thank you to{" "}
        <a
          href="https://edelsonphotography.com/"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          Josh Edelson
        </a>
        ,{" "}
        <a
          href="https://www.newrevmedia.com/"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          Jenny Morgan
        </a>
        , and{" "}
        <a
          href="https://www.garysextonphotography.com/"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          Gary Sexton
        </a>{" "}
        for the pictures.
      </footer>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute();
  let reducedResults: ImageProps[] = [];

  let i = 0;
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    });
    i++;
  }

  const blurImagePromises = results.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  //TODO: for each picture, use the public_id as key. Search for metadata, display tags if any
  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
    const cake = await retrieveCakeByPhoto(reducedResults[i].public_id);
    if (cake) {
      reducedResults[i].tags = cake.tags.map((tag) => ({ id: tag, text: tag }));
    } else {
      reducedResults[i].tags = [];
    }
  }

  //TODO: fetch cake attributes
  let cake_schema = await cakeSchema();

  return {
    props: {
      images: reducedResults,
      cakeSchema: cake_schema,
    },
  };
}

async function testLog(e) {
  console.log(e);
}
