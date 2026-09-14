"use client";
import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-ink/40"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
                className={cn(
                  "fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-paper shadow-lift"
                )}
              >
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <Dialog.Title className="font-display text-lg font-semibold text-ink">
                    {title}
                  </Dialog.Title>
                  <Dialog.Close className="rounded-full p-1.5 text-muted hover:bg-sand hover:text-ink">
                    <X size={18} />
                  </Dialog.Close>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
