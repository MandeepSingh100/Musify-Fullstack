import React from "react";
import Sidebar from "./Sidebar";
import Nabar from "./Navbar";
import Player from "./Player";

const Layout = ({ children }) => {
    return (
        <div className="h-screen">
            <div className="h-[90%] flex">
                <Sidebar />
                <div className="w-full m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0" >
                    <Nabar />
                    {children}
                </div>
            </div>
            <Player />
        </div>
    );
};

export default Layout;