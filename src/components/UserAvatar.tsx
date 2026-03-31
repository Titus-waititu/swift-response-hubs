import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/stores/authStore";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: User | null;
  profileImage?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function UserAvatar({
  user,
  profileImage,
  className,
  size = "md",
}: UserAvatarProps) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase()
    : "U";

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {profileImage && <AvatarImage src={profileImage} alt={user?.name} />}
      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white font-semibold text-sm">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
