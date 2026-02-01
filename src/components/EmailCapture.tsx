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
    <section className="py-20 bg-muted/20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Almost <span className="text-gradient">There!</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Enter your email to receive your portrait and order updates.
          </p>

          <div className="space-y-4">
            <div className="relative">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                onBlur={() => setTouched(true)}
                className={cn(
                  "h-14 text-lg text-center bg-card border-border",
                  touched && !isEmailValid && "border-destructive"
                )}
              />
              {touched && !isEmailValid && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center justify-center gap-2 text-destructive text-sm"
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
                  className="min-h-[120px] bg-card border-border resize-none"
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

            <p className="text-xs text-muted-foreground">
              Your email is secure. We'll only use it for order updates.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EmailCapture;
