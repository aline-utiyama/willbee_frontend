"use client"
import Link from "next/link";

const GoalPlansCategory = () => {
  const categories = [
    { name: "Customized Goal", image: "/images/Category-icon-custom.png" },
    { name: "AI Goal Builder", image: "/images/Category-icon-ai.png" },
    { name: "Fitness", image: "/images/Category-icon-fitness.png" },
    { name: "Diet", image: "/images/Category-icon-diet.png" },
    { name: "Music", image: "/images/Category-icon-music.png" },
    { name: "Self-Development", image: "/images/Category-icon-selfdev.png" },
    { name: "Career", image: "/images/Category-icon-career.png" },
    { name: "Reading", image: "/images/Category-icon-reading.png" },
    { name: "Sports", image: "/images/Category-icon-sports.png" },
  ];


  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Goal Plans Category</h1>
      <ul>
        <Link href="/goal-plans/list" className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-2" >
          {categories.map((category) => (
            <li
              key={category.name}
              className="p-4 rounded-lg justify-center items-center text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <img src={category.image} alt={category.name} className="w-auto h-32 justify-self-center object-contain mb-2" />
              {category.name}
            </li>
          ))}
        </Link>
      </ul>
    </div>
  );
};

export default GoalPlansCategory;
