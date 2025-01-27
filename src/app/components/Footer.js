/** Reference: 
 * https://flowbite.com/docs/components/footer/
 * https://tailwindui.com/components/marketing/sections/footers
 */
"use client";
import Link from "next/link";
import Image from "next/image";

const navigation = [
  { name: "About", href: "#" },
  { name: "Contact us", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/">
            <div className="flex shrink-0 items-center">
              <Image
                alt="WillBee Logo"
                src="/images/logo.png"
                className="h-8 w-auto"
                width={100}
                height={100}
              />
            </div>
          </Link>
          <div className="flex space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  "text-base font-medium text-gray-900 hover:text-indigo-600"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} WillBee. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
