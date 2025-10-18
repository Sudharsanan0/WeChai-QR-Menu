import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  icon: string;
  name: string;
  count: number;
  onClick: () => void;
}

const CategoryCard = ({ icon, name, count, onClick }: CategoryCardProps) => {
  return (
    <Card 
      className="p-6 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] bg-card"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{icon}</span>
          <h3 className="font-semibold text-base md:text-lg">{name}</h3>
        </div>
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <span className="font-semibold text-foreground">{count}</span>
        </div>
      </div>
    </Card>
  );
};

export default CategoryCard;
