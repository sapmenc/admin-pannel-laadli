import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: "/images/img_letsiconscalendarduotone.svg",
      label: "Calendar",
      path: "/calendar"
    },
    {
      icon: "/images/img_qlementineiconsitemsgrid24.svg",
      label: "Products",
      path: "/product"
    }
  ];

  const websitePages = [
    {
      icon: "/images/img_website.svg",
      label: "Home",
      path: "/home-section"
    },
    {
      icon: "/images/img_website.svg",
      label: "Our Story",
      path: "/ourstory-section"
    },
    {
      icon: "/images/img_website.svg",
      label: "Portfolio",
      path: "/portfolio-section"
    },
    {
      icon: "/images/img_website.svg",
      label: "Contact us",
      path: "/contactus-section"
    }
  ];

  return (
    <div className="bg-sidebar-1 rounded-r-md w-[169px] min-h-screen  mt-2 flex flex-col border-r border-white">
      {/* Top Navigation Items */}
      {menuItems.map((item, index) => (
        <div
          key={index}
          className={` rounded-md flex flex-row items-center h-12 px-2 mt-5 cursor-pointer hover:opacity-80 ${
            location.pathname === item.path ? 'bg-sidebar-2' : ''
          }`}
          onClick={() => navigate(item.path)}
        >
          <img 
            src={item.icon} 
            alt={item.label} 
            className="h-6 w-6 mr-4"
          />
          <span className="text-sidebar-1 font-bellefair text-2xl leading-7">
            {item.label}
          </span>
        </div>
      ))}

      {/* Website Pages Section */}
      <div className="mt-8 px-2">
        <h3 className="text-sidebar-1 font-bellefair text-base leading-5 mb-4">
          Website Pages
        </h3>
        
        {websitePages.map((page, index) => (
          <div
            key={index}
            className={`flex flex-row rounded-md items-center h-12 px-2 mt-3 cursor-pointer hover:opacity-80 ${
              location.pathname === page.path ? 'bg-sidebar-2' : ''
            }`}
            onClick={() => navigate(page.path)}
          >
            <img 
              src={page.icon} 
              alt={page.label} 
              className="h-6 w-6 mr-4"
            />
            <span className="text-sidebar-1 font-bellefair text-xl leading-7">
              {page.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;