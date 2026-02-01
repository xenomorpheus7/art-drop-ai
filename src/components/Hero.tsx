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
      {/* Background */}
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-neon-cyan/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="container relative z-10 px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">AI-Powered Portraits</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              Turn Yourself{" "}
              <span className="text-gradient">Into Art</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Upload your photos. Choose your style. Get museum-quality AI portraits 
              delivered to your door. Cyberpunk, Renaissance, Anime – any vision, any style.
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
              <Button variant="neon" size="xl">
                View Gallery
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-8 mt-12 justify-center lg:justify-start"
            >
              {[
                { value: "50K+", label: "Portraits Created" },
                { value: "4.9★", label: "Customer Rating" },
                { value: "48h", label: "Delivery Time" },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <p className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden neon-glow">
              <img
                src={heroPortrait}
                alt="AI Generated Portrait Example"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            {/* Floating badges */}
            <motion.div
              className="absolute -bottom-4 -left-4 glass-card rounded-xl p-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <p className="text-sm font-semibold text-primary">Cyberpunk Style</p>
              <p className="text-xs text-muted-foreground">Generated in 2 min</p>
            </motion.div>

            <motion.div
              className="absolute -top-4 -right-4 glass-card rounded-xl p-4"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <p className="text-sm font-semibold text-secondary">Premium Quality</p>
              <p className="text-xs text-muted-foreground">4K Resolution</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
