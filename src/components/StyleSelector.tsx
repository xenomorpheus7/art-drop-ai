import { motion } from "framer-motion";
import { Check, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

import styleFuturistic from "@/assets/style-futuristic.jpg";
import styleCowboy from "@/assets/style-cowboy.jpg";
import styleAnime from "@/assets/style-anime.jpg";
import styleRenaissance from "@/assets/style-renaissance.jpg";
import styleNoir from "@/assets/style-noir.jpg";
import styleCyberpunk from "@/assets/style-cyberpunk.jpg";

export type StyleType = "futuristic" | "cowboy" | "anime" | "renaissance" | "noir" | "cyberpunk" | "custom";

interface StyleSelectorProps {
  selectedStyle: StyleType | null;
  onSelect: (style: StyleType) => void;
}

const styles: { id: StyleType; name: string; description: string; image: string }[] = [
  {
    id: "futuristic",
    name: "Futuristic",
    description: "Sci-fi & holographic",
    image: styleFuturistic,
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Neon & dystopian",
    image: styleCyberpunk,
  },
  {
    id: "cowboy",
    name: "Cowboy",
    description: "Wild west vibes",
    image: styleCowboy,
  },
  {
    id: "anime",
    name: "Anime",
    description: "Japanese animation",
    image: styleAnime,
  },
  {
    id: "renaissance",
    name: "Renaissance",
    description: "Classical oil painting",
    image: styleRenaissance,
  },
  {
    id: "noir",
    name: "Film Noir",
    description: "B&W dramatic",
    image: styleNoir,
  },
];

const StyleSelector = ({ selectedStyle, onSelect }: StyleSelectorProps) => {
  return (
    <section className="py-24">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Choose Your <span className="text-gradient">Style</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Select the artistic style for your portrait. Each style is crafted by our AI 
            to create stunning, museum-quality artwork.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {styles.map((style, index) => (
            <motion.button
              key={style.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(style.id)}
              className={cn(
                "relative group rounded-2xl overflow-hidden aspect-square transition-all duration-500",
                selectedStyle === style.id
                  ? "ring-2 ring-primary glow-primary"
                  : "ring-1 ring-glass-border/50 hover:ring-primary/40"
              )}
            >
              <img
                src={style.image}
                alt={style.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Glass overlay */}
              <div className={cn(
                "absolute inset-0 transition-all duration-500",
                selectedStyle === style.id
                  ? "bg-primary/20 backdrop-blur-[2px]"
                  : "bg-gradient-to-t from-background/80 via-background/20 to-transparent"
              )} />

              {/* Selected check */}
              {selectedStyle === style.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg"
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}

              {/* Label with glass effect */}
              <div className="absolute bottom-0 left-0 right-0 p-4 backdrop-blur-md bg-background/30">
                <p className="font-semibold text-sm text-foreground">{style.name}</p>
                <p className="text-xs text-muted-foreground">{style.description}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Custom style option */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSelect("custom")}
          className={cn(
            "mt-8 w-full p-6 rounded-2xl transition-all duration-500 text-center",
            selectedStyle === "custom"
              ? "glass-elevated glow-primary ring-2 ring-primary"
              : "glass-card hover:ring-1 hover:ring-primary/40"
          )}
        >
          <div className="flex items-center justify-center gap-3">
            <Wand2 className={cn(
              "w-5 h-5 transition-colors",
              selectedStyle === "custom" ? "text-primary" : "text-muted-foreground"
            )} />
            <div className="text-left">
              <p className="font-semibold">Custom Style</p>
              <p className="text-sm text-muted-foreground">Describe your unique vision</p>
            </div>
          </div>
        </motion.button>
      </div>
    </section>
  );
};

export default StyleSelector;
