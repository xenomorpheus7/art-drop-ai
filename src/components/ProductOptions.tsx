import { motion } from "framer-motion";
import { Check, Download, Frame, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProductType = "digital" | "poster" | "framed";

interface ProductOptionsProps {
  selectedProduct: ProductType | null;
  onSelect: (product: ProductType) => void;
}

const products: {
  id: ProductType;
  name: string;
  price: number;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}[] = [
  {
    id: "digital",
    name: "Digital Download",
    price: 19,
    description: "High-resolution digital file",
    icon: <Download className="w-6 h-6" />,
    features: [
      "4K Resolution (4096x4096)",
      "PNG & JPG formats",
      "Instant delivery",
      "Print-ready quality",
    ],
  },
  {
    id: "poster",
    name: "Premium Poster",
    price: 39,
    description: "Museum-quality print",
    icon: <Frame className="w-6 h-6" />,
    popular: true,
    features: [
      "Everything in Digital",
      "Premium matte paper",
      "Multiple sizes (A4, A3, A2)",
      "Free worldwide shipping",
    ],
  },
  {
    id: "framed",
    name: "Framed Art",
    price: 79,
    description: "Gallery-ready masterpiece",
    icon: <Truck className="w-6 h-6" />,
    features: [
      "Everything in Poster",
      "Solid wood frame",
      "Museum glass protection",
      "Ready to hang",
    ],
  },
];

const ProductOptions = ({ selectedProduct, onSelect }: ProductOptionsProps) => {
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
            Choose Your <span className="text-gradient">Product</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Select how you'd like to receive your AI portrait masterpiece.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {products.map((product, index) => (
            <motion.button
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(product.id)}
              className={cn(
                "relative p-7 rounded-2xl text-left transition-all duration-500",
                selectedProduct === product.id
                  ? "glass-elevated glow-primary ring-2 ring-primary"
                  : "glass-card hover:ring-1 hover:ring-primary/40",
                product.popular && selectedProduct !== product.id && "ring-1 ring-secondary/50"
              )}
            >
              {/* Popular badge */}
              {product.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-secondary to-accent text-secondary-foreground text-xs font-bold rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              )}

              {/* Selected indicator */}
              {selectedProduct === product.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-5 right-5 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg"
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl glass-subtle flex items-center justify-center text-primary mb-5">
                {product.icon}
              </div>

              {/* Name & Price */}
              <h3 className="text-xl font-bold mb-1">{product.name}</h3>
              <p className="text-muted-foreground text-sm mb-5">{product.description}</p>
              
              <div className="mb-7">
                <span className="text-4xl font-bold text-gradient">€{product.price}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductOptions;
