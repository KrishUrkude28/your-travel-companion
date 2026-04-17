import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

interface Props {
  packageId: string;
  packageTitle: string;
  variant?: "icon" | "full";
  className?: string;
}

const WishlistButton = ({ packageId, packageTitle, variant = "icon", className }: Props) => {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(packageId);

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(packageId, packageTitle); }}
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        className={cn(
          "h-9 w-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-md hover:scale-110 transition-transform",
          className,
        )}
      >
        <Heart className={cn("h-4 w-4", saved ? "fill-destructive text-destructive" : "text-foreground")} />
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant={saved ? "default" : "outline"}
      onClick={() => toggle(packageId, packageTitle)}
      className={className}
    >
      <Heart className={cn("h-4 w-4 mr-2", saved && "fill-current")} />
      {saved ? "Saved to Wishlist" : "Add to Wishlist"}
    </Button>
  );
};

export default WishlistButton;
