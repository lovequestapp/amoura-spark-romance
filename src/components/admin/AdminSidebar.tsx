
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>
      
      <nav className="space-y-2">
        <NavLink 
          to="/admin" 
          end
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded hover:bg-gray-800 ${
              isActive ? 'bg-gray-800' : ''
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/admin/users" 
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded hover:bg-gray-800 ${
              isActive ? 'bg-gray-800' : ''
            }`
          }
        >
          <Users className="w-5 h-5" />
          <span>Users</span>
        </NavLink>
        
        <NavLink 
          to="/admin/content" 
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded hover:bg-gray-800 ${
              isActive ? 'bg-gray-800' : ''
            }`
          }
        >
          <MessageSquare className="w-5 h-5" />
          <span>Content</span>
        </NavLink>
        
        <NavLink 
          to="/admin/settings" 
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded hover:bg-gray-800 ${
              isActive ? 'bg-gray-800' : ''
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="ghost"
          className="w-full text-white hover:bg-gray-800"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
