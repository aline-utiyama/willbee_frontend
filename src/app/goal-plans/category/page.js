"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

const GoalPlansCategory = () => {
  //Todo: search query
  const [query, setQuery] = useState("");
  const router = useRouter();
  const categories = [
    {
      name: "Customized Goal",
      image: "/images/Category-icon-custom.png",
      link: "/goals/create",
    },
    {
      name: "AI Goal Builder",
      image: "/images/Category-icon-ai.png",
      link: "/goals/create-with-ai",
    },
    {
      name: "Fitness",
      image: "/images/Category-icon-fitness.png",
      link: "/goal-plans/list",
    },
    {
      name: "Diet",
      image: "/images/Category-icon-diet.png",
      link: "/goal-plans/list",
    },
    {
      name: "Music",
      image: "/images/Category-icon-music.png",
      link: "/goal-plans/list",
    },
    {
      name: "Self-Development",
      image: "/images/Category-icon-selfdev.png",
      link: "/goal-plans/list",
    },
    {
      name: "Career",
      image: "/images/Category-icon-career.png",
      link: "/goal-plans/list",
    },
    {
      name: "Reading",
      image: "/images/Category-icon-reading.png",
      link: "/goal-plans/list",
    },
    {
      name: "Sports",
      image: "/images/Category-icon-sports.png",
      link: "/goal-plans/list",
    },
  ];

  const handleCategoryClick = (link) => {
    router.push(link);
  };

  return (
    <div className="mt-6 md:mx-auto md:w-full md:max-w-lg">
      <div className="px-4">
        <div className="relative w-full my-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-4 pr-10 py-2 text-gray-700 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>
      </div>
      <ul className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-2">
        {categories.map((category) => (
          <li
            key={category.name}
            className="p-4 rounded-lg justify-center items-center text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => handleCategoryClick(category.link)}
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-auto h-32 justify-self-center object-contain mb-2"
            />
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoalPlansCategory;
