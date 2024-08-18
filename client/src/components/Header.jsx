import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  TextInput,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";

import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice";

/**
 * In order to show the active nav we use the useLocation hook to determine the current path from react-router.
 *
 * To update the header content each user after login, we import useSelector from from redux to have access to the currentUser info from the redux store.
 *
 * to implement the dark mood here first we import useDispatch and toggleTheme from the store.
 *
 * To toggle the icons based on the theme mood, we import the theme from the store with useSelector.
 * For the search functionality, we call the useEffect each time the location change by the searchTerm with the useLocation hook
 *
 */

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    // convert the searchTerm to a string:
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="border-b-2">
      <Link
        to={"/"}
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 p-y-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          TobildCode
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="search"
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Link to={"/search"}>
        <Button className="w-12 h-10 hidden lg:hidden" color={"gray"} pill>
          <AiOutlineSearch />
        </Button>
      </Link>

      <div className="flex items-center  md:order-2 gap-4">
        {/* /**Set order to 2 in large screen */}
        <Button
          className="w-8 h-8  mr-1  sm:inline sm:w-12 sm:h-10 "
          color={"gray"}
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </DropdownHeader>
            <Link to={"/dashboard?tab=profilePicture"}>
              <DropdownItem>Profile</DropdownItem>
            </Link>
            <DropdownDivider />
            <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/sign-in"}>
            <Button gradientDuoTone={"purpleToBlue"} outline>
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle className="" />
      </div>
      <Navbar.Collapse>
        {/* change the link to div two <a> can not be a descendant */}
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to={"/"}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to={"/about"}>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to={"/projects"}>Projects</Link>
        </Navbar.Link>
        <Navbar.Link
          active={path === "/search"}
          as={"div"}
          className="sm:hidden"
        >
          <Link to={"/search"}>Search</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
