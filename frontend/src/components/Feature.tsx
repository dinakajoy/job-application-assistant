import Link from "next/link";
import React from "react";

const Feature = ({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="text-gray-600 mt-2">{description}</p>
      <Link
        href={link}
        className="text-blue-600 hover:underline mt-4 inline-block"
      >
        Learn More →
      </Link>
    </div>
  );
};

export default Feature;
