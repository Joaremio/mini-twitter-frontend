import { forwardRef, InputHTMLAttributes, ElementType } from "react";
import { FieldError } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ElementType;
  error?: FieldError;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, error, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium text-foreground/70 ml-1">
          {label}
        </label>

        <div className="relative group">
          <input
            ref={ref}
            className={`w-full border bg-card rounded-xl p-3 pr-10 outline-none transition-all text-foreground placeholder:text-gray-400
              ${
                error
                  ? "border-red-500 focus:ring-2 focus:ring-red-500/10"
                  : "border-border focus:border-twitter focus:ring-2 focus:ring-twitter/10"
              }`}
            {...rest}
          />

          {Icon && (
            <Icon
              size={18}
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors
              ${error ? "text-red-500" : "text-gray-400 group-focus-within:text-twitter dark:group-focus-within:text-white"}
            `}
            />
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 ml-1 font-medium">
            {error.message}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
