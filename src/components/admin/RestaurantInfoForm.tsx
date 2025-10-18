import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type RestaurantInfo = Database['public']['Tables']['restaurant_info']['Row'];

const RestaurantInfoForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    timing: "",
    address: "",
    contact_number: "",
    whatsapp_number: "",
    google_maps_link: "",
  });

  useEffect(() => {
    fetchRestaurantInfo();
  }, []);

  const fetchRestaurantInfo = async () => {
    const { data, error } = await supabase
      .from('restaurant_info')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching restaurant info:', error);
    } else if (data) {
      setRestaurantId(data.id);
      setFormData({
        name: data.name || "",
        about: data.about || "",
        timing: data.timing || "",
        address: data.address || "",
        contact_number: data.contact_number || "",
        whatsapp_number: data.whatsapp_number || "",
        google_maps_link: data.google_maps_link || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const infoData = {
      name: formData.name,
      about: formData.about || null,
      timing: formData.timing || null,
      address: formData.address || null,
      contact_number: formData.contact_number || null,
      whatsapp_number: formData.whatsapp_number || null,
      google_maps_link: formData.google_maps_link || null,
    };

    const { error } = await supabase
      .from('restaurant_info')
      .update(infoData)
      .eq('id', restaurantId!);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Restaurant information updated successfully.",
      });
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Restaurant Information</CardTitle>
        <CardDescription>
          Update your restaurant details that will be displayed on the public menu page
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Restaurant Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., The Food Place"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              placeholder="Tell customers about your restaurant"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timing">Hours</Label>
            <Input
              id="timing"
              value={formData.timing}
              onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
              placeholder="e.g., Mon-Sun: 10:00 AM - 10:00 PM"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g., 123 Main Street, City"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_number">Contact Number</Label>
            <Input
              id="contact_number"
              value={formData.contact_number}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
              placeholder="e.g., (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
            <Input
              id="whatsapp_number"
              value={formData.whatsapp_number}
              onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
              placeholder="e.g., +1234567890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="google_maps_link">Google Maps Link</Label>
            <Input
              id="google_maps_link"
              type="url"
              value={formData.google_maps_link}
              onChange={(e) => setFormData({ ...formData, google_maps_link: e.target.value })}
              placeholder="https://maps.google.com/..."
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RestaurantInfoForm;
