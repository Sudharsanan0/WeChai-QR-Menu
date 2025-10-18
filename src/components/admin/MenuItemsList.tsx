import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Database } from "@/integrations/supabase/types";

type MenuItem = Database['public']['Tables']['menu_items']['Row'];

const getCategoryIcon = (category: string): string => {
  const categoryIcons: Record<string, string> = {
    tea: "☕",
    coffee: "☕",
    milk_varieties: "🥛",
    fresh_juice: "🧃",
    sandwiches: "🥪",
    french_fries: "🍟",
    bun_varieties: "🍔",
    momos_varieties: "🥟",
    pasta_varieties: "🍝",
    masala_pav_bhaji: "🍛",
    maggi_varieties: "🍜",
    milkshake_varieties: "🥤",
    signature_dish: "⭐",
    new_dish: "✨",
  };
  return categoryIcons[category] || "🍽️";
};

interface MenuItemsListProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

const MenuItemsList = ({ items, onEdit, onDelete }: MenuItemsListProps) => {
  if (items.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No menu items yet. Add your first item to get started!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Menu Items ({items.length})</h2>
      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="flex gap-4 p-4">
              {/* Category Icon Badge */}
              <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-3xl">
                {getCategoryIcon(item.category)}
              </div>
              
              {/* Item Image */}
              {item.image_url && (
                <div className="w-24 sm:w-32 h-24 sm:h-32 flex-shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                    <p className="text-2xl font-bold text-primary">
                      ₹{Number(item.price).toFixed(2)}
                    </p>
                    {item.rating && (
                      <div className="flex items-center gap-1 text-sm mt-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-semibold">{Number(item.rating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{item.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(item.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="capitalize">
                    {item.category.replace(/_/g, ' ')}
                  </Badge>
                  {item.is_new && <Badge>New</Badge>}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuItemsList;
