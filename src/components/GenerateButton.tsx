import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const GenerateButton = ({ onClick, isLoading, disabled }: GenerateButtonProps) => {
  return (
    <section className="py-8">
      <div className="container px-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="xl"
            variant="hero"
            onClick={onClick}
            disabled={disabled || isLoading}
            className="text-xl px-12 py-8 rounded-full shadow-glow animate-pulse-slow"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                Generating Masterpiece...
              </>
            ) : (
              <>
                <Sparkles className="mr-3 h-6 w-6" />
                GENERATE ARTWORK
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default GenerateButton;
