import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowDown } from "lucide-react";
import heroPortrait from "@/assets/hero-portrait.jpg";

interface HeroProps {
  onStart: () => void;
}

const Hero = ({ onStart }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute inset-0 bg-dots opacity-30" />
      
      {/* Floating glass orbs */}
      <motion.div
        className="absolute top-20 left-[10%] w-80 h-80 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(200 100% 65% / 0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(280 80% 70% / 0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ 
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.5, 0.3],
          y: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container relative z-10 px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-subtle mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">AI-Powered Portraits</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
            >
              Turn Yourself{" "}
              <span className="text-gradient">Into Art</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Upload your photos. Choose your style. Get museum-quality AI portraits 
              delivered to your door.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button 
                variant="hero" 
                size="xl" 
                onClick={onStart}
                className="group"
              >
                Create Your Portrait
                <ArrowDown className="w-5 h-5 transition-transform group-hover:translate-y-1" />
              </Button>
              <Button variant="glass" size="xl">
                View Gallery
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-10 mt-14 justify-center lg:justify-start"
            >
              {[
                { value: "50K+", label: "Portraits Created" },
                { value: "4.9★", label: "Customer Rating" },
                { value: "48h", label: "Delivery Time" },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <p className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-elevated">
              <img
                src={heroPortrait}
                alt="AI Generated Portrait Example"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>

            {/* Floating badges */}
            <motion.div
              className="absolute -bottom-6 -left-6 glass-elevated rounded-2xl p-5"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-sm font-semibold text-primary">Cyberpunk Style</p>
              <p className="text-xs text-muted-foreground mt-0.5">Generated in 2 min</p>
            </motion.div>

            <motion.div
              className="absolute -top-6 -right-6 glass-elevated rounded-2xl p-5"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-sm font-semibold text-secondary">Premium Quality</p>
              <p className="text-xs text-muted-foreground mt-0.5">4K Resolution</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
