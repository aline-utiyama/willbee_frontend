"use client";
import Link from "next/link";
import {
  Disclosure,
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon, ClipboardIcon, CogIcon, TrophyIcon, HomeIcon, ChatBubbleBottomCenterIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { logout } from "../actions/auth";

export default function Navbar() {
  const pathname = usePathname(); // Get the current path
  const showAuthButtons = ["/", "/login", "/signup"].includes(pathname); // Check if we are on a page that should show login/signup
  const router = useRouter();
  const username = "John Doe"; // Replace with actual username logic

  const handleLogout = async () => {
    logout(() => {
      router.push("/login"); // Redirect after session is destroyed
    });
  };

  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
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
                <button
                  type="button"
                  className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500  focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 focus:outline-hidden"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3 justify-end">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-indigo-600 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 focus:outline-hidden">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="size-8 rounded-full"
                      />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="fixed inset-0 z-10 m-5 bg-white py-2 px-3 rounded-md ring-1 shadow-lg ring-black/5 transition focus:outline-none data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in gap-4 sm:absolute sm:flex sm:flex-col sm:w-96 sm:origin-top-right sm:right-0 sm:inset-auto sm:mt-2 "
                  >
                    <div className="px-2 py-4 flex items-center">
                      <img
                        alt=""
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="size-10 rounded-full"
                      />
                      <p className="ml-3 text-sm text-gray-900 font-semibold">{username}</p>
                    </div>
                    <div className="border-t border-gray-200 gap-4 justify-center items-center">
                      <MenuItem>
                        <button
                          onClick={() => router.push("/")}
                          className="flex items-center px-2 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        >
                          <HomeIcon className="mr-2 h-5 w-5 text-gray-400" />
                          Home
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={() => router.push("/goals/list")}
                          className="flex items-center px-2 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        >
                          <TrophyIcon className="mr-2 h-5 w-5 text-gray-400" />
                          My Goals
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={() => router.push("/goal-plans/list")}
                          className="flex items-center px-2 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        >
                          <ClipboardIcon className="mr-2 h-5 w-5 text-gray-400" />
                          Goal Plans
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={() => router.push("/settings")}
                          className="flex items-center px-2 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        >
                          <CogIcon className="mr-2 h-5 w-5 text-gray-400" />
                          User Settings
                        </button>
                      </MenuItem>
                    </div>
                    <div className="border-t border-gray-200 gap-4 justify-center items-center">
                      <MenuItem>
                        <button
                          onClick={() => router.push("#")}
                          className="flex items-center px-2 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        >
                          <ChatBubbleBottomCenterIcon className="mr-2 h-5 w-5 text-gray-400" />
                          WillBlog
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={() => router.push("#")}
                          className="flex items-center px-2 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                        >
                          <InformationCircleIcon className="mr-2 h-5 w-5 text-gray-400" />
                          Help & Support
                        </button>
                      </MenuItem>
                    </div>
                    <MenuItem>
                      <div className="block px-2 py-2">
                        <button
                          className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
        </div >
      </div >
    </Disclosure >
  );
}
