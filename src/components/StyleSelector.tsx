import { motion } from "framer-motion";
import { Check } from "lucide-react";
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
    <section className="py-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="text-gradient">Style</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the artistic style for your portrait. Each style is crafted by our AI 
            to create stunning, museum-quality artwork.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {styles.map((style, index) => (
            <motion.button
              key={style.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(style.id)}
              className={cn(
                "relative group rounded-xl overflow-hidden aspect-square transition-all duration-300",
                selectedStyle === style.id
                  ? "ring-2 ring-primary neon-glow"
                  : "ring-1 ring-border hover:ring-primary/50"
              )}
            >
              <img
                src={style.image}
                alt={style.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className={cn(
                "absolute inset-0 transition-all duration-300",
                selectedStyle === style.id
                  ? "bg-primary/30"
                  : "bg-gradient-to-t from-background/90 via-background/20 to-transparent"
              )} />

              {/* Selected check */}
              {selectedStyle === style.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("custom")}
          className={cn(
            "mt-6 w-full p-4 rounded-xl border-2 border-dashed transition-all duration-300 text-center",
            selectedStyle === "custom"
              ? "border-primary bg-primary/10 neon-glow"
              : "border-muted-foreground/30 hover:border-primary/50"
          )}
        >
          <p className="font-semibold">Custom Style</p>
          <p className="text-sm text-muted-foreground">Describe your unique vision</p>
        </motion.button>
      </div>
    </section>
  );
};

export default StyleSelector;
