import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import CategoryCard from "./CategoryCard";
import MenuItemsList from "./MenuItemsList";
import MenuItemForm from "./MenuItemForm";

type MenuItem = Database['public']['Tables']['menu_items']['Row'];

interface CategoryViewProps {
  menuItems: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onFormSuccess: () => void;
}

const CATEGORIES = [
  { id: "new_dish", name: "Newly Launched", icon: "✨" },
  { id: "signature_dish", name: "Signatures", icon: "⭐" },
  { id: "tea", name: "Tea", icon: "☕" },
  { id: "coffee", name: "Coffee", icon: "☕" },
  { id: "milk_varieties", name: "Milk Varieties", icon: "🥛" },
  { id: "fresh_juice", name: "Fresh Juice", icon: "🧃" },
  { id: "sandwiches", name: "Sandwiches", icon: "🥪" },
  { id: "french_fries", name: "French Fries", icon: "🍟" },
  { id: "bun_varieties", name: "Bun Varieties", icon: "🍔" },
  { id: "momos_varieties", name: "Momos Varieties", icon: "🥟" },
  { id: "pasta_varieties", name: "Pasta Varieties", icon: "🍝" },
  { id: "masala_pav_bhaji", name: "Masala Pav Bhaji Varieties", icon: "🍛" },
  { id: "maggi_varieties", name: "Maggi Varieties", icon: "🍜" },
  { id: "milkshake_varieties", name: "Milkshake Varieties", icon: "🥤" },
];

const CategoryView = ({ menuItems, onEdit, onDelete, onFormSuccess }: CategoryViewProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    menuItems.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
      if (item.is_new) {
        counts["new_dish"] = (counts["new_dish"] || 0) + 1;
      }
    });
    return counts;
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return [];
    if (selectedCategory === "new_dish") {
      return menuItems.filter((item) => item.is_new);
    }
    return menuItems.filter((item) => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setShowForm(true);
    onEdit(item);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    onFormSuccess();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setShowForm(false);
    setEditingItem(null);
  };

  if (selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          )}
        </div>

        {showForm ? (
          <MenuItemForm
            editingItem={editingItem}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        ) : (
          <MenuItemsList
            items={filteredItems}
            onEdit={handleEdit}
            onDelete={onDelete}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Menu Management</h2>
          <p className="text-muted-foreground mt-1">Select a category to view and manage items</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          className="bg-primary hover:bg-primary/90"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <MenuItemForm
            editingItem={editingItem}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            icon={category.icon}
            name={category.name}
            count={categoryCounts[category.id] || 0}
            onClick={() => setSelectedCategory(category.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryView;
