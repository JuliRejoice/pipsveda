import { GET_BLOG_DETAILS } from "@/graphql/getBlogData";
import { graphcms } from "@/graphql/graphQlClientServer";
import BlogDetails from "@/modules/blogDetails";
import React from "react";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const GetBlogDetails_Variables = {
    filters: {
      slug: {
        eq: slug,
      },
    },
  };
  const BlogDetail = await graphcms?.request(
    GET_BLOG_DETAILS,
    GetBlogDetails_Variables
  );
  const keywords = BlogDetail?.blogs_connection?.nodes?.[0]?.seo?.keywords
    ?.map((item) => item?.name)
    ?.join(", ");
  const seoData = {
    Title: BlogDetail?.blogs_connection?.nodes?.[0]?.seo?.title || "",
    Description:
      BlogDetail?.blogs_connection?.nodes?.[0]?.seo?.description || "",
    Keywords: keywords || "",
    OG_Img:
      `${process.env.NEXT_PUBLIC_NEXT_GRAPHQL_IMAGE_URL}${BlogDetail?.blogs_connection?.nodes?.[0]?.seo?.image?.url}` ||
      "",
    URL: `${BlogDetail?.blogs_connection?.nodes?.[0]?.seo?.url}/${slug}`,
  };

  return {
    title: seoData?.Title,
    description: seoData?.Description,
    keywords: seoData?.Keywords,
    authors: [{ name: "Five Veda" }],
    openGraph: {
      title: seoData?.Title,
      description: seoData?.Description,
      url: seoData?.URL,
      images: seoData?.OG_Img,
      locale: "en_US",
      siteName: "Five Veda",
      type: "website",
      imageAlt: seoData?.Title,
    },
    twitter: {
      card: "summary_large_image",
      handle: "@PipsVeda",
      site: "@PipsVeda",
      title: seoData?.Title,
      description: seoData?.Description,
      images: seoData?.OG_Img,
      url: seoData?.URL,
      imageAlt: seoData?.Title,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: seoData?.URL,
    },
    publisher: "Five Veda Team",
  };
}

export default async function page({ params }) {
  const { slug } = await params;
  const GetBlogDetails_Variables = {
    filters: {
      slug: {
        eq: slug,
      },
    },
    pagination: {
      limit: 50,
    },
  };

  const BlogDetail = await graphcms?.request(
    GET_BLOG_DETAILS,
    GetBlogDetails_Variables
  );
  const blogDetail = BlogDetail?.blogs_connection?.nodes[0];

  return (
    <div>
      <BlogDetails blogDetail={blogDetail} />
    </div>
  );
}
