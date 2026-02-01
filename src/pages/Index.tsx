import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import StyleSelector, { StyleType } from "@/components/StyleSelector";
import UploadZone from "@/components/UploadZone";
import ProductOptions, { ProductType } from "@/components/ProductOptions";
import EmailCapture from "@/components/EmailCapture";
import CheckoutButton from "@/components/CheckoutButton";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [selectedStyle, setSelectedStyle] = useState<StyleType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [email, setEmail] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  const styleSectionRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    styleSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const isCheckoutReady =
    selectedStyle !== null &&
    selectedProduct !== null &&
    files.length > 0 &&
    isEmailValid &&
    (selectedStyle !== "custom" || customPrompt.trim().length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero onStart={handleStart} />

      {/* Style Selector */}
      <div ref={styleSectionRef}>
        <StyleSelector
          selectedStyle={selectedStyle}
          onSelect={setSelectedStyle}
        />
      </div>

      {/* Upload Zone */}
      <UploadZone files={files} onFilesChange={setFiles} />

      {/* Product Options */}
      <ProductOptions
        selectedProduct={selectedProduct}
        onSelect={setSelectedProduct}
      />

      {/* Email Capture */}
      <EmailCapture
        email={email}
        customPrompt={customPrompt}
        showCustomPrompt={selectedStyle === "custom"}
        onEmailChange={setEmail}
        onCustomPromptChange={setCustomPrompt}
        onContinue={() => {}}
        isValid={isEmailValid && (selectedStyle !== "custom" || customPrompt.trim().length > 0)}
      />

      {/* Checkout Button */}
      <CheckoutButton
        style={selectedStyle}
        product={selectedProduct}
        email={email}
        files={files}
        customPrompt={customPrompt}
        disabled={!isCheckoutReady}
      />

      {/* Trust Section */}
      <TrustSection />

      {/* Footer */}
      <Footer />

      {/* Floating Progress Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: isCheckoutReady ? 0 : 100 }}
        className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border p-4 z-50"
      >
        <div className="container flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${selectedStyle ? "bg-primary" : "bg-muted"}`} />
              <span className="text-sm hidden sm:inline">Style</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${files.length > 0 ? "bg-primary" : "bg-muted"}`} />
              <span className="text-sm hidden sm:inline">Photos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${selectedProduct ? "bg-primary" : "bg-muted"}`} />
              <span className="text-sm hidden sm:inline">Product</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isEmailValid ? "bg-primary" : "bg-muted"}`} />
              <span className="text-sm hidden sm:inline">Email</span>
            </div>
          </div>
          <span className="text-lg font-bold text-gradient">
            {selectedProduct === "digital" && "€19"}
            {selectedProduct === "poster" && "€39"}
            {selectedProduct === "framed" && "€79"}
            {!selectedProduct && "€0"}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
