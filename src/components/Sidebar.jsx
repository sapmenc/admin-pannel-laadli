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
      path: "/"
    }
  ];

  return (
    <div className="bg-sidebar-1 w-[169px] min-h-screen mt-2 flex flex-col border-r border-white">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className={`flex flex-row items-center h-12 px-2 mt-5 cursor-pointer hover:opacity-80 ${
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
    </div>
  );
};

export default Sidebar;