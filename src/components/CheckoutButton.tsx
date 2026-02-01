import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Loader2, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StyleType } from "./StyleSelector";
import { ProductType } from "./ProductOptions";
import { toast } from "@/hooks/use-toast";

interface CheckoutButtonProps {
  style: StyleType | null;
  product: ProductType | null;
  email: string;
  files: File[];
  customPrompt: string;
  disabled: boolean;
}

const PRODUCT_PRICES: Record<ProductType, number> = {
  digital: 19,
  poster: 39,
  framed: 79,
};

const CheckoutButton = ({
  style,
  product,
  email,
  files,
  customPrompt,
  disabled,
}: CheckoutButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!style || !product || !email || files.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please complete all steps before checkout.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In production, this would call your Stripe checkout endpoint
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          style,
          product,
          email,
          customPrompt: style === "custom" ? customPrompt : undefined,
          fileCount: files.length,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const price = product ? PRODUCT_PRICES[product] : 0;

  return (
    <section className="py-24">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto text-center"
        >
          <div className="glass-elevated rounded-3xl p-10">
            <div className="w-18 h-18 rounded-2xl glass-subtle flex items-center justify-center mx-auto mb-8">
              <CreditCard className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Order Summary</h2>
            
            <div className="my-8 py-6 border-t border-b border-glass-border/50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-muted-foreground">Style</span>
                <span className="font-medium capitalize">{style || "Not selected"}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-muted-foreground">Product</span>
                <span className="font-medium capitalize">{product || "Not selected"}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-muted-foreground">Photos</span>
                <span className="font-medium">{files.length} uploaded</span>
              </div>
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-glass-border/50">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-4xl font-bold text-gradient">€{price}</span>
              </div>
            </div>

            <Button
              variant="hero"
              size="xl"
              className="w-full mb-5"
              onClick={handleCheckout}
              disabled={disabled || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Pay €{price} Securely
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Secured by Stripe. 256-bit SSL encryption.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CheckoutButton;
