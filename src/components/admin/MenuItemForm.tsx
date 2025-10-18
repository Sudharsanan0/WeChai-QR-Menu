import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type MenuItem = Database['public']['Tables']['menu_items']['Row'];

interface MenuItemFormProps {
  editingItem: MenuItem | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const MenuItemForm = ({ editingItem, onSuccess, onCancel }: MenuItemFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "tea",
    image_url: "",
    is_new: false,
    rating: "",
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        price: editingItem.price.toString(),
        description: editingItem.description || "",
        category: editingItem.category,
        image_url: editingItem.image_url || "",
        is_new: editingItem.is_new,
        rating: editingItem.rating?.toString() || "",
      });
    }
  }, [editingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const itemData = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description || null,
      category: formData.category,
      image_url: formData.image_url || null,
      is_new: formData.is_new,
      rating: formData.rating ? parseFloat(formData.rating) : null,
    };

    let error;

    if (editingItem) {
      const result = await supabase
        .from('menu_items')
        .update(itemData)
        .eq('id', editingItem.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('menu_items')
        .insert([itemData]);
      error = result.error;
    }

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Menu item ${editingItem ? 'updated' : 'added'} successfully.`,
      });
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "tea",
        image_url: "",
        is_new: false,
        rating: "",
      });
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingItem ? "Edit Item" : "Add New Item"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Margherita Pizza"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                placeholder="0.00"
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the dish"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tea">☕ Tea</SelectItem>
                <SelectItem value="coffee">☕ Coffee</SelectItem>
                <SelectItem value="milk_varieties">🥛 Milk Varieties</SelectItem>
                <SelectItem value="fresh_juice">🧃 Fresh Juice</SelectItem>
                <SelectItem value="sandwiches">🥪 Sandwiches</SelectItem>
                <SelectItem value="french_fries">🍟 French Fries</SelectItem>
                <SelectItem value="bun_varieties">🍔 Bun Varieties</SelectItem>
                <SelectItem value="momos_varieties">🥟 Momos Varieties</SelectItem>
                <SelectItem value="pasta_varieties">🍝 Pasta Varieties</SelectItem>
                <SelectItem value="masala_pav_bhaji">🍛 Masala Pav Bhaji Varieties</SelectItem>
                <SelectItem value="maggi_varieties">🍜 Maggi Varieties</SelectItem>
                <SelectItem value="milkshake_varieties">🥤 Milkshake Varieties</SelectItem>
                <SelectItem value="signature_dish">⭐ Signature Dish</SelectItem>
                <SelectItem value="new_dish">✨ New Dish</SelectItem>
                <SelectItem value="signature_dish">⭐ Signature Dish</SelectItem>
                <SelectItem value="new_dish">🆕 New Dish</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            {formData.image_url && (
              <div className="mt-2">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-md"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating (0-5)</Label>
            <Input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              placeholder="e.g., 4.5"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_new"
              checked={formData.is_new}
              onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
            />
            <Label htmlFor="is_new">Mark as New Dish</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : editingItem ? "Update Item" : "Add Item"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MenuItemForm;
