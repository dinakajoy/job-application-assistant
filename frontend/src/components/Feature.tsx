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
    <Link href={link}>
      <div className="p-4 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-200 transition">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

export default Feature;
