import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  UserCheck,
  LogOut,
  Search,
  Building2,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { CommandPalette } from "../common/CommandPalette";

export const AppLayout: React.FC = () => {
  const { user, logout, hasRole } = useAuth();

  const [isCmdKOpen, setIsCmdKOpen] = useState(false);


  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: ["Admin", "Sales", "Warehouse", "Accounts"],
    },
    {
      label: "Customers",
      path: "/customers",
      icon: Users,
      roles: ["Admin", "Sales", "Accounts"],
    },
    {
      label: "Products & Stock",
      path: "/products",
      icon: Package,
      roles: ["Admin", "Sales", "Warehouse", "Accounts"],
    },
    {
      label: "Delivery Challans",
      path: "/challans",
      icon: FileText,
      roles: ["Admin", "Sales", "Warehouse", "Accounts"],
    },
    {
      label: "User Management",
      path: "/settings/users",
      icon: UserCheck,
      roles: ["Admin"],
    },
  ];


  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">

      {/* SIDEBAR */}
      <aside
        className="
        w-64 
        bg-gradient-to-b 
        from-indigo-700 
        to-purple-700 
        text-white 
        flex 
        flex-col 
        justify-between 
        p-4 
        shadow-xl
        "
      >

        <div>

          {/* BRAND */}
          <div className="
          flex items-center gap-3 
          px-2 py-4 
          border-b border-white/20
          mb-6
          ">

            <div
              className="
              w-10 h-10 
              rounded-xl 
              bg-white 
              text-indigo-700
              flex 
              items-center 
              justify-center
              font-bold
              text-xl
              shadow
              "
            >
              ERP
            </div>


            <div>

              <h1 className="
              font-bold 
              text-lg
              ">
                CoreCRM
              </h1>

              <p className="
              text-xs 
              text-indigo-100
              ">
                Operations Portal
              </p>

            </div>

          </div>



          {/* NAVIGATION */}

          <nav className="space-y-2">

            {
              navItems
              .filter((item)=>hasRole(...item.roles))
              .map((item)=>{

                const Icon=item.icon;

                return (

                  <NavLink
                    key={item.path}
                    to={item.path}

                    className={({isActive})=>

                    `
                    flex 
                    items-center 
                    gap-3 
                    px-3 
                    py-2.5
                    rounded-lg
                    text-sm
                    transition-all

                    ${
                      isActive
                      ?
                      "bg-white text-indigo-700 shadow-md font-semibold"
                      :
                      "text-indigo-100 hover:bg-white/20 hover:text-white"
                    }

                    `
                    }

                  >

                    <Icon className="w-5 h-5"/>

                    <span>
                      {item.label}
                    </span>


                  </NavLink>

                )

              })
            }


          </nav>


        </div>



        {/* USER CARD */}

        <div className="
        border-t 
        border-white/20 
        pt-4
        ">


          <div className="
          flex 
          items-center 
          justify-between
          bg-white/10
          rounded-lg
          p-3
          ">


            <div>

              <p className="
              text-sm
              font-semibold
              ">
                {user?.name}
              </p>


              <span
              className="
              inline-block
              mt-1
              text-xs
              bg-white
              text-indigo-700
              px-2
              py-1
              rounded
              "
              >

                {user?.role}

              </span>


            </div>



            <button
            onClick={()=>logout()}
            className="
            p-2
            rounded-lg
            hover:bg-red-500/20
            hover:text-red-200
            transition
            "
            >

              <LogOut className="w-5 h-5"/>


            </button>



          </div>


        </div>


      </aside>





      {/* RIGHT SIDE */}

      <div className="
      flex-1 
      flex 
      flex-col
      ">


        {/* HEADER */}

        <header
        className="
        h-16
        bg-white
        border-b
        flex
        items-center
        justify-between
        px-6
        shadow-sm
        "
        >


          <button
          onClick={()=>setIsCmdKOpen(true)}
          className="
          flex
          items-center
          gap-3
          px-4
          py-2
          rounded-lg
          bg-gray-100
          hover:bg-indigo-50
          border
          text-gray-600
          text-sm
          transition
          "
          >

            <Search className="w-4 h-4"/>

            <span>
              Search...
            </span>


            <kbd
            className="
            px-2
            py-1
            bg-white
            border
            rounded
            text-xs
            "
            >
              Ctrl K
            </kbd>


          </button>



          <div
          className="
          flex
          items-center
          gap-2
          text-sm
          text-gray-500
          "
          >

            <Building2 
            className="
            text-indigo-600
            w-5
            h-5
            "
            />

            Wholesale Enterprise Portal

          </div>



        </header>





        {/* PAGE CONTENT */}

        <main
        className="
        flex-1
        p-6
        overflow-y-auto
        bg-gray-50
        "
        >

          <Outlet/>

        </main>



      </div>




      <CommandPalette
      isOpen={isCmdKOpen}
      onClose={()=>setIsCmdKOpen(false)}
      />



    </div>
  );
};