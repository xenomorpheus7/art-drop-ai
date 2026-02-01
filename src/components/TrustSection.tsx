import { motion } from "framer-motion";
import { Shield, Clock, Palette, Lock, Star, Truck } from "lucide-react";

const features = [
  {
    icon: <Palette className="w-6 h-6" />,
    title: "Museum Quality",
    description: "Professional-grade prints on archival paper that last 100+ years",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Privacy First",
    description: "Your photos are encrypted and deleted within 30 days",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Fast Delivery",
    description: "Digital in minutes, prints delivered in 3-5 business days",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "100% Guarantee",
    description: "Not satisfied? Full refund, no questions asked",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "4.9★ Rating",
    description: "Trusted by 50,000+ happy customers worldwide",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Free Shipping",
    description: "Worldwide delivery included on all print orders",
  },
];

const TrustSection = () => {
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
            Why Choose <span className="text-gradient">Us</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to delivering exceptional quality and service.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
