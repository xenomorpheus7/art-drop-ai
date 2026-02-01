import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface EmailCaptureProps {
  email: string;
  customPrompt: string;
  showCustomPrompt: boolean;
  onEmailChange: (email: string) => void;
  onCustomPromptChange: (prompt: string) => void;
  onContinue: () => void;
  isValid: boolean;
}

const EmailCapture = ({
  email,
  customPrompt,
  showCustomPrompt,
  onEmailChange,
  onCustomPromptChange,
  onContinue,
  isValid,
}: EmailCaptureProps) => {
  const [touched, setTouched] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  const handleContinue = () => {
    setTouched(true);
    if (isEmailValid) {
      onContinue();
    }
  };

  return (
    <section className="py-24">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <div className="glass-elevated rounded-3xl p-10 text-center">
            <div className="w-18 h-18 rounded-2xl glass-subtle flex items-center justify-center mx-auto mb-8">
              <Mail className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Almost <span className="text-gradient">There!</span>
            </h2>
            <p className="text-muted-foreground mb-10 text-lg">
              Enter your email to receive your portrait and order updates.
            </p>

            <div className="space-y-5">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  onBlur={() => setTouched(true)}
                  className={cn(
                    "h-14 text-lg text-center glass-subtle border-glass-border/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all",
                    touched && !isEmailValid && "border-destructive ring-destructive/20"
                  )}
                />
                {touched && !isEmailValid && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 flex items-center justify-center gap-2 text-destructive text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Please enter a valid email address
                  </motion.div>
                )}
              </div>

              {showCustomPrompt && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <Textarea
                    placeholder="Describe your custom style vision... (e.g., 'Steampunk inventor in a Victorian workshop with brass goggles and gears')"
                    value={customPrompt}
                    onChange={(e) => onCustomPromptChange(e.target.value)}
                    className="min-h-[140px] glass-subtle border-glass-border/50 rounded-xl resize-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </motion.div>
              )}

              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={handleContinue}
                disabled={!isValid}
              >
                Continue to Payment
              </Button>

              <p className="text-xs text-muted-foreground pt-2">
                Your email is secure. We'll only use it for order updates.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EmailCapture;
