import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Sparkles, CheckCircle2, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = usePortfolio();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`pointer-events-auto p-4 rounded-xl border-2 border-plum-900 shadow-card flex items-start space-x-3 text-ivory-100 ${
              toast.type === 'bordeaux'
                ? 'bg-bordeaux-800'
                : toast.type === 'info'
                ? 'bg-plum-900'
                : 'bg-plum-900'
            }`}
          >
            <div className="p-1.5 rounded-lg bg-ivory-100/10 text-butter-300">
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="flex-1">
              <h4 className="font-serif font-bold text-sm tracking-tight">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="font-mono text-xs text-ivory-300 mt-0.5 leading-snug">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-ivory-300 hover:text-ivory-100 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
