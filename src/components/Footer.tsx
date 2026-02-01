import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-14 border-t border-glass-border/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-8"
        >
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gradient mb-1">PortraitAI</h3>
            <p className="text-sm text-muted-foreground">
              Turn yourself into art with AI
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors duration-300">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors duration-300">
              Contact Us
            </a>
            <a href="#" className="hover:text-primary transition-colors duration-300">
              FAQ
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PortraitAI. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
