import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type RestaurantInfo = Database['public']['Tables']['restaurant_info']['Row'];

interface MenuFooterProps {
  restaurantInfo: RestaurantInfo | null;
}

const MenuFooter = ({ restaurantInfo }: MenuFooterProps) => {
  if (!restaurantInfo) return null;

  return (
    <footer className="bg-muted/30 border-t mt-12">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">About Us & Contact</h2>
        
        {/* About Us Section */}
        {restaurantInfo.about && (
          <div className="mb-8 pb-8 border-b">
            <h3 className="text-xl font-semibold mb-3">About Us</h3>
            <p className="text-muted-foreground leading-relaxed">
              {restaurantInfo.about}
            </p>
          </div>
        )}

        {/* Contact Information and Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              {restaurantInfo.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">{restaurantInfo.address}</p>
                </div>
              )}
              {restaurantInfo.contact_number && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-muted-foreground">{restaurantInfo.contact_number}</p>
                </div>
              )}
              {restaurantInfo.timing && (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-muted-foreground">{restaurantInfo.timing}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {restaurantInfo.whatsapp_number && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a
                    href={`https://wa.me/${restaurantInfo.whatsapp_number.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp Us
                  </a>
                </Button>
              )}
              {restaurantInfo.google_maps_link && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a
                    href={restaurantInfo.google_maps_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    View on Maps
                  </a>
                </Button>
              )}
              {restaurantInfo.contact_number && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a href={`tel:${restaurantInfo.contact_number.replace(/\D/g, '')}`}>
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MenuFooter;
