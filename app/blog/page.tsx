"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg text-center"
      >
        <BookOpen className="w-16 h-16 mx-auto text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground mb-6">
          Our blog is currently under construction. We're preparing insightful articles about personal finance, budgeting tips, and CurioPay updates. Stay tuned for valuable content coming soon!
        </p>
        <Link href="/">
          <Button className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
} 