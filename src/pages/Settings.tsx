
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 flex items-center border-b">
        <button 
          onClick={() => navigate('/profile')}
          className="flex items-center"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back
        </button>
        <h1 className="text-lg font-medium mx-auto">Settings</h1>
      </div>
      
      <div className="p-6 space-y-8">
        <section>
          <h2 className="text-lg font-medium mb-4">Discovery Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <Select defaultValue="current">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Location</SelectItem>
                  <SelectItem value="custom">Set Custom Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Distance
                </label>
                <span className="text-sm text-gray-500">25 miles</span>
              </div>
              <Slider
                defaultValue={[25]}
                max={100}
                step={1}
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Age Range
                </label>
                <span className="text-sm text-gray-500">24 - 35</span>
              </div>
              <Slider
                defaultValue={[24, 35]}
                min={18}
                max={70}
                step={1}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Show Me
              </label>
              <Select defaultValue="women">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="everyone">Everyone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-lg font-medium mb-4">App Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications</p>
                <p className="text-sm text-gray-500">Push, email, and in-app</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show online status</p>
                <p className="text-sm text-gray-500">Let others know when you're active</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Read receipts</p>
                <p className="text-sm text-gray-500">Show when you've read messages</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show my distance</p>
                <p className="text-sm text-gray-500">Display how far away you are</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Incognito mode</p>
                <p className="text-sm text-gray-500">Only show your profile to people you like</p>
              </div>
              <Switch />
            </div>
          </div>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-lg font-medium mb-4">Account</h2>
          
          <div className="space-y-4">
            <button className="block w-full text-left py-2 text-amoura-deep-pink">
              Upgrade to Premium
            </button>
            <button className="block w-full text-left py-2 text-gray-700">
              Email and Phone
            </button>
            <button className="block w-full text-left py-2 text-gray-700">
              Privacy Policy
            </button>
            <button className="block w-full text-left py-2 text-gray-700">
              Terms of Service
            </button>
            <button className="block w-full text-left py-2 text-gray-700">
              Help & Support
            </button>
            <button className="block w-full text-left py-2 text-red-500">
              Log Out
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
