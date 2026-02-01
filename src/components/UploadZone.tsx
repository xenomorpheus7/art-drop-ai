import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, AlertCircle, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

const MAX_FILES = 5;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const UploadZone = ({ files, onFilesChange }: UploadZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `${file.name}: Only JPG, PNG, WEBP allowed`;
    }
    if (file.size > MAX_SIZE) {
      return `${file.name}: Max size is 10MB`;
    }
    return null;
  };

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    setError(null);
    const fileArray = Array.from(newFiles);
    
    if (files.length + fileArray.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} images allowed`);
      return;
    }

    const validFiles: File[] = [];
    for (const file of fileArray) {
      const errorMsg = validateFile(file);
      if (errorMsg) {
        setError(errorMsg);
        return;
      }
      validFiles.push(file);
    }

    onFilesChange([...files, ...validFiles]);
  }, [files, onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
    setError(null);
  };

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
            Upload Your <span className="text-gradient">Photos</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Upload 1-5 high-quality photos. Front-facing shots with good lighting work best.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "upload-zone p-14 text-center cursor-pointer",
              isDragOver && "drag-over"
            )}
          >
            <input
              type="file"
              multiple
              accept={ACCEPTED_TYPES.join(",")}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <motion.div
                animate={{ scale: isDragOver ? 1.05 : 1 }}
                className="flex flex-col items-center gap-5"
              >
                <motion.div 
                  className="w-20 h-20 rounded-2xl glass-elevated flex items-center justify-center"
                  animate={{ y: isDragOver ? -5 : 0 }}
                >
                  <CloudUpload className={cn(
                    "w-10 h-10 transition-colors",
                    isDragOver ? "text-primary" : "text-muted-foreground"
                  )} />
                </motion.div>
                <div>
                  <p className="font-semibold text-xl">
                    {isDragOver ? "Drop your photos here" : "Drag & drop your photos"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    or click to browse • JPG, PNG, WEBP • Max 10MB
                  </p>
                </div>
                <Button variant="neon" size="lg">
                  Select Files
                </Button>
              </motion.div>
            </label>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-5 p-4 rounded-xl glass-subtle border border-destructive/30 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preview Grid */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-10"
              >
                <div className="flex items-center justify-between mb-5">
                  <p className="font-semibold text-lg">
                    {files.length} of {MAX_FILES} photos uploaded
                  </p>
                  {files.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onFilesChange([])}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove All
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {files.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative aspect-square rounded-xl overflow-hidden group glass-subtle"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeFile(index)}
                          className="rounded-xl"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}

                  {/* Add more slot */}
                  {files.length < MAX_FILES && (
                    <label
                      htmlFor="file-upload"
                      className="aspect-square rounded-xl glass-subtle flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all hover:glow-soft"
                    >
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </label>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default UploadZone;
