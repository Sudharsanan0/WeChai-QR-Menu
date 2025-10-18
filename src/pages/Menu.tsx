import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import logo from "@/assets/logo.png";
import MenuFooter from "@/components/MenuFooter";

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type RestaurantInfo = Database['public']['Tables']['restaurant_info']['Row'];

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
    fetchRestaurantInfo();

    // Set up realtime subscription for menu items
    const itemsChannel = supabase
      .channel('menu-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_items'
        },
        () => {
          fetchMenuItems();
        }
      )
      .subscribe();

    // Set up realtime subscription for restaurant info
    const infoChannel = supabase
      .channel('restaurant-info-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'restaurant_info'
        },
        () => {
          fetchRestaurantInfo();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(itemsChannel);
      supabase.removeChannel(infoChannel);
    };
  }, []);

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
    setLoading(false);
  };

  const fetchRestaurantInfo = async () => {
    const { data, error } = await supabase
      .from('restaurant_info')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching restaurant info:', error);
    } else {
      setRestaurantInfo(data);
    }
  };

  const filteredItems = menuItems.filter(item => {
    if (activeFilter === "all") return true;
    if (activeFilter === "new") return item.is_new;
    return item.category === activeFilter;
  });

  const filters = [
    { id: "all", label: "All" },
    { id: "tea", label: "☕ Tea" },
    { id: "coffee", label: "☕ Coffee" },
    { id: "milk_varieties", label: "🥛 Milk Varieties" },
    { id: "fresh_juice", label: "🧃 Fresh Juice" },
    { id: "sandwiches", label: "🥪 Sandwiches" },
    { id: "french_fries", label: "🍟 French Fries" },
    { id: "bun_varieties", label: "🍔 Bun Varieties" },
    { id: "momos_varieties", label: "🥟 Momos Varieties" },
    { id: "pasta_varieties", label: "🍝 Pasta Varieties" },
    { id: "masala_pav_bhaji", label: "🍛 Masala Pav Bhaji" },
    { id: "maggi_varieties", label: "🍜 Maggi Varieties" },
    { id: "milkshake_varieties", label: "🥤 Milkshake Varieties" },
    { id: "signature_dish", label: "⭐ Signature Dish" },
    { id: "new", label: "✨ New Dish" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-8 px-4 shadow-md">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-4">
            <img src={logo} alt="Restaurant Logo" className="h-16 w-16 rounded-full object-cover border-2 border-primary-foreground" />
          <div>
            <h1 className="text-4xl font-bold">{restaurantInfo?.name || "Our Restaurant"}</h1>
          </div>
        </div>
      </div>
    </header>

      {/* Filters */}
      <div className="container mx-auto max-w-6xl py-6 px-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.id)}
              className="rounded-full"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="container mx-auto max-w-6xl pb-12 px-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading menu...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {item.image_url && (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    {item.is_new && (
                      <Badge variant="default" className="ml-2">New</Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ₹{Number(item.price).toFixed(2)}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      {item.rating && (
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-semibold">{Number(item.rating).toFixed(1)}</span>
                        </div>
                      )}
                      <Badge variant="outline" className="capitalize text-xs">
                        {item.category.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <MenuFooter restaurantInfo={restaurantInfo} />
    </div>
  );
};

export default Menu;
