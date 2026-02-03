import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import StyleSelector, { StyleType } from "@/components/StyleSelector";
import UploadZone from "@/components/UploadZone";
import GenerateButton from "@/components/GenerateButton";
import ProductOptions, { ProductType } from "@/components/ProductOptions";
import EmailCapture from "@/components/EmailCapture";
import CheckoutButton from "@/components/CheckoutButton";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import { API_ENDPOINTS } from "@/lib/api";

const Index = () => {
  const [selectedStyle, setSelectedStyle] = useState<StyleType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [email, setEmail] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const styleSectionRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    styleSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGenerate = async () => {
    console.log('🎨 GENERATE BUTTON CLICKED!');
    console.log('Selected style:', selectedStyle);
    console.log('Files:', files);

    if (!selectedStyle || files.length === 0) {
      console.error('❌ Missing style or files!');
      return;
    }

    setIsGenerating(true);
    setGenerationComplete(false);

    try {
      const formData = new FormData();
      formData.append('image', files[0]); // Send the first face image
      formData.append('style', selectedStyle);

      const response = await fetch(API_ENDPOINTS.GENERATE, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();
      console.log('Result:', data);
      console.log('Image URL:', data.url);
      console.log('URL type:', typeof data.url);

      if (data.url) {
        setGeneratedImage(data.url);
        setGenerationComplete(true);
        console.log('✅ Generated image state updated!');
        // Scroll to result or show success toast (optional)
      } else {
        console.error('❌ No URL in response!');
      }


    } catch (error) {
      console.error("Error generating image:", error);
      alert("Something went wrong with the generation. Make sure the backend server (npm run server) is running.");
    } finally {
      setIsGenerating(false);
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const isCheckoutReady =
    selectedStyle !== null &&
    selectedProduct !== null &&
    files.length > 0 &&
    isEmailValid &&
    (selectedStyle !== "custom" || customPrompt.trim().length > 0);

  const canGenerate = selectedStyle !== null && files.length > 0;

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

      {/* Generate Button - Only visual if ready */}
      {canGenerate && !generatedImage && (
        <GenerateButton
          onClick={handleGenerate}
          isLoading={isGenerating}
          disabled={generationComplete}
        />
      )}

      {/* Generated Result Preview */}
      {generatedImage && (
        <section className="py-12">
          <div className="container px-4">
            <div className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/50 relative group">
              <img src={generatedImage} alt="Generated Masterpiece" className="w-full h-auto" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">Your Masterpiece</span>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-xl font-bold text-gradient mb-2">Transformation Complete!</p>
              <p className="text-muted-foreground">Scroll down to choose your product format.</p>
            </div>
          </div>
        </section>
      )}

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
        onContinue={() => { }}
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
        className="fixed bottom-0 left-0 right-0 glass-elevated border-t border-glass-border/50 p-5 z-50"
      >
        <div className="container flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-all ${selectedStyle ? "bg-primary glow-primary" : "bg-muted"}`} />
              <span className="text-sm hidden sm:inline">Style</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-all ${files.length > 0 ? "bg-primary glow-primary" : "bg-muted"}`} />
              <span className="text-sm hidden sm:inline">Photos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-all ${generationComplete ? "bg-primary glow-primary" : "bg-muted"}`} />
              <span className="text-sm hidden sm:inline">Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-all ${selectedProduct ? "bg-primary glow-primary" : "bg-muted"}`} />
              <span className="text-sm hidden sm:inline">Product</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-all ${isEmailValid ? "bg-primary glow-primary" : "bg-muted"}`} />
              <span className="text-sm hidden sm:inline">Email</span>
            </div>
          </div>
          <span className="text-xl font-bold text-gradient">
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
