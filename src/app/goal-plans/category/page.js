"use client"
import Link from "next/link";

const GoalPlansCategory = () => {
  const categories = [
    { name: "Customized Goal", image: "/images/Category-icon-custom.png", link: "/goals/create" },
    { name: "AI Goal Builder", image: "/images/Category-icon-ai.png", link: "/goals/create-with-ai" },
    { name: "Fitness", image: "/images/Category-icon-fitness.png", link: "/goal-plans/list" },
    { name: "Diet", image: "/images/Category-icon-diet.png", link: "/goal-plans/list" },
    { name: "Music", image: "/images/Category-icon-music.png", link: "/goal-plans/list" },
    { name: "Self-Development", image: "/images/Category-icon-selfdev.png", link: "/goal-plans/list" },
    { name: "Career", image: "/images/Category-icon-career.png", link: "/goal-plans/list" },
    { name: "Reading", image: "/images/Category-icon-reading.png", link: "/goal-plans/list" },
    { name: "Sports", image: "/images/Category-icon-sports.png", link: "/goal-plans/list" },
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Goal Plans Category</h1>
      <ul className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-2">
        {categories.map((category) => (
          <Link href={category.link} key={category.name}>
            <li
              className="p-4 rounded-lg justify-center items-center text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <img src={category.image} alt={category.name} className="w-auto h-32 justify-self-center object-contain mb-2" />
              {category.name}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default GoalPlansCategory;
