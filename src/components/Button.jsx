export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const baseClasses =
    "font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2";

  const variants = {
    primary: "bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black",
    outline:
      "bg-white text-black border border-black hover:bg-black/5 dark:bg-black/20 dark:text-white dark:border-white",
    ghost: "hover:opacity-80",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
