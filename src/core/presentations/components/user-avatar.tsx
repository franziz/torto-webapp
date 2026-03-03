function getInitials(fullName: string | null | undefined): string {
  if (!fullName) return "?";
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
} as const;

export function UserAvatar({
  imageUrl,
  fullName,
  size = "sm",
}: {
  imageUrl?: string | null;
  fullName?: string | null;
  size?: "sm" | "md";
}) {
  const classes = sizeClasses[size];

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={fullName ?? "User avatar"}
        referrerPolicy="no-referrer"
        className={`${classes} rounded-full object-cover`}
      />
    );
  }

  return (
    <span className={`${classes} inline-flex items-center justify-center rounded-full bg-primary-300 font-medium text-white`}>
      {getInitials(fullName)}
    </span>
  );
}
