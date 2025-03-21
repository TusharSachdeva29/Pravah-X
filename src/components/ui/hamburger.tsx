 
import { cn } from "@/lib/utils";
import { motion, MotionConfig } from "framer-motion";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const hamburgerVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        red: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        green: "bg-green-500 text-green-500-foreground hover:bg-green-500/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        transparent: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "size-10",
        sm: "size-8",
        lg: "size-12",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const hamburgerLineVariants = cva("", {
  variants: {
    variant: {
      default: "bg-white",
      red: "bg-white",
      green: "bg-white",
      outline: "bg-primary",
      transparent: "bg-primary",
      secondary: "bg-primary",
      link: "bg-primary",
    },
    size: {
      default: "w-6 h-0.5",
      sm: "w-4 h-0.5",
      lg: "w-8 h-0.5",
      icon: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface HamburgerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof hamburgerVariants> {
  asChild?: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Hamburger = React.forwardRef<HTMLButtonElement, HamburgerProps>(
  ({ open, setOpen, className, size, variant, ...props }, ref) => {
    return (
      <MotionConfig transition={{ duration: 0.5, ease: "easeInOut" }}>
        <motion.button
          initial={false}
          onClick={() => setOpen((state) => !state)}
          className={cn(
            "relative",
            className,
            hamburgerVariants({ size, variant })
          )}
          animate={open ? "open" : "closed"}
          ref={ref}
          {...(props as any)}
        >
          <motion.span
            className={cn("absolute", hamburgerLineVariants({ size, variant }))}
            style={{ left: "50%", top: "35%", x: "-50%", y: "-50%" }}
            variants={{
              open: {
                rotate: ["0deg", "0deg", "45deg"],
                top: ["35%", "50%", "50%"],
              },
              closed: {
                rotate: ["45deg", "0deg", "0deg"],
                top: ["50%", "50%", "35%"],
              },
            }}
          />
          <motion.span
            className={cn("absolute", hamburgerLineVariants({ size, variant }))}
            style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
            variants={{
              open: {
                rotate: ["0deg", "0deg", "45deg"],
              },
              closed: {
                rotate: ["45deg", "0deg", "0deg"],
              },
            }}
          />

          <motion.span
            className={cn("absolute", hamburgerLineVariants({ size, variant }))}
            style={{ left: "50%", top: "65%", x: "-50%", y: "-50%" }}
            variants={{
              open: {
                rotate: ["0deg", "0deg", "-45deg"],
                top: ["65%", "50%", "50%"],
              },
              closed: {
                rotate: ["-45deg", "0deg", "0deg"],
                top: ["50%", "50%", "65%"],
              },
            }}
          />
        </motion.button>
      </MotionConfig>
    );
  }
);

Hamburger.displayName = "Hamburger";

export { Hamburger };

