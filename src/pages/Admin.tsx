import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, ExternalLink, Settings, QrCode as QrCodeIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RestaurantInfoForm from "@/components/admin/RestaurantInfoForm";
import QRCodeGenerator from "@/components/admin/QRCodeGenerator";
import CategoryView from "@/components/admin/CategoryView";
import type { Database } from "@/integrations/supabase/types";

type MenuItem = Database['public']['Tables']['menu_items']['Row'];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    checkAuth();
    fetchMenuItems();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
    setLoading(false);
  };

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching menu items:', error);
    } else {
      setMenuItems(data || []);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting item",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Item deleted",
        description: "Menu item has been removed.",
      });
      fetchMenuItems();
    }
  };

  const handleFormSuccess = () => {
    fetchMenuItems();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-2xl">
                👨‍🍳
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">Restaurant Admin</h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.open("/menu", "_blank")}
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Menu
              </Button>
              <Button 
                variant="ghost"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="qrcode">
              <QrCodeIcon className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">QR Code</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="mt-0">
            <CategoryView
              menuItems={menuItems}
              onEdit={() => {}}
              onDelete={handleDelete}
              onFormSuccess={handleFormSuccess}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="max-w-2xl">
              <RestaurantInfoForm />
            </div>
          </TabsContent>

          <TabsContent value="qrcode" className="mt-6">
            <div className="max-w-2xl">
              <QRCodeGenerator />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
