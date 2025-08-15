import React from "react";
import { NavLink, Outlet ,useNavigate} from "react-router-dom";
import { useLogoutMutation } from "../features/auth/authApi";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const MainLayout: React.FC = () => {
  const [logoutApi] = useLogoutMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async()=>{
    try {
      await logoutApi().unwrap()
    } catch (error) {
      console.error("Logout API error:", error);
    }finally{
      dispatch(logout())
      navigate('/login')
    }
  }
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-6">Time Tracker</h1>
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `p-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `p-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `p-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
            }
          >
            Tasks
          </NavLink>
          <NavLink
            to="/timer"
            className={({ isActive }) =>
              `p-2 rounded hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
            }
          >
            Timer
          </NavLink>
        </nav>
          <button
          onClick={handleLogout}
          className="mt-6 w-full p-2 bg-red-600 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet /> {/* This is where pages render */}
      </main>
    </div>
  );
};

export default MainLayout;
