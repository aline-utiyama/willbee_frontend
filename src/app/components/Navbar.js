"use client";
import Link from "next/link";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { logout } from "../actions/auth";
import NotificationsTab from "./NotificationsTab.js";
import { useUser } from "../context/UserProvider";

const navigation = [
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { user } = useUser();
  const pathname = usePathname(); // Get the current path
  const showAuthButtons = ["/", "/login", "/signup"].includes(pathname); // Check if we are on a page that should show login/signup
  const router = useRouter();

  const handleLogout = async () => {
    logout(() => {
      router.push("/login"); // Redirect after session is destroyed
    });
  };

  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden"></div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
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
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {showAuthButtons ? (
              <>
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm/6 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-sm/6 font-semibold text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-100"
                  >
                    Signup
                  </Link>
                </div>
              </>
            ) : (
              <>
                <NotificationsTab></NotificationsTab>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-indigo-600 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 focus:outline-hidden">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        src={
                          user?.image_url ||
                          "https://t3.ftcdn.net/jpg/06/33/54/78/360_F_633547842_AugYzexTpMJ9z1YcpTKUBoqBF0CUCk10.jpg"
                        }
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-2 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <MenuItem>
                      <Link
                        href="/goals/list"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                      >
                        My Goals
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                      >
                        My Profile
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                      >
                        Settings
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <div className="block px-4 py-2">
                        <button
                          // className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          onClick={handleLogout}
                        >
                          Sign out
                        </button>
                      </div>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
