import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Utensils, QrCode, Settings, Menu as MenuIcon } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Utensils className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            QR Code Menu
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Modern digital menu solution for your restaurant. Manage your menu easily and let customers scan to view.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              onClick={() => navigate("/menu")}
              className="text-lg h-14 px-8"
            >
              <MenuIcon className="w-5 h-5 mr-2" />
              View Menu
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg h-14 px-8"
            >
              <Settings className="w-5 h-5 mr-2" />
              Admin Login
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <MenuIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Menu Management</h3>
            <p className="text-muted-foreground">
              Add, edit, and organize your menu items with a simple admin interface.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">QR Code Access</h3>
            <p className="text-muted-foreground">
              Generate and download QR codes for customers to scan and view your menu instantly.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Utensils className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
            <p className="text-muted-foreground">
              Changes to your menu appear instantly on the customer view without any delay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
