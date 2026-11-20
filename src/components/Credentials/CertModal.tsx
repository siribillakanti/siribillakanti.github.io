import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { X, Award, ShieldCheck, CheckCircle2, Calendar, FileText } from 'lucide-react';

export const CertModal: React.FC = () => {
  const { selectedCert, setSelectedCert } = usePortfolio();

  if (!selectedCert) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedCert(null)}
          className="fixed inset-0 bg-plum-950/75 backdrop-blur-sm -z-10"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-ivory-50 border-3 border-plum-900 rounded-card-lg shadow-card-xl p-6 sm:p-8"
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedCert(null)}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-ivory-200 hover:bg-plum-800 hover:text-ivory-100 text-plum-900 border border-plum-900/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Certificate Header Badge */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-butter-300 rounded-2xl border-2 border-plum-900 shadow-card">
              <Award className="w-6 h-6 text-bordeaux-800" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-raspberry-600 font-bold uppercase tracking-wider block">
                VERIFIED CREDENTIAL
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-bordeaux-800 leading-snug">
                {selectedCert.title}
              </h3>
            </div>
          </div>

          <div className="space-y-4 my-6">
            <div className="p-3 bg-ivory-200/80 rounded-xl border border-plum-900/15 flex justify-between items-center text-xs font-mono">
              <div>
                <span className="text-plum-500 block">ISSUED BY:</span>
                <span className="font-bold text-plum-900">{selectedCert.issuer}</span>
              </div>
              <div className="text-right">
                <span className="text-plum-500 block">COMPLETION:</span>
                <span className="font-bold text-plum-900">{selectedCert.date}</span>
              </div>
            </div>

            <div>
              <h4 className="font-mono text-xs font-bold text-plum-700 uppercase tracking-wider mb-2">
                Curriculum Competencies Verified
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedCert.skills.map((s) => (
                  <span
                    key={s}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-ivory-100 border border-plum-900/20 text-plum-900 text-xs font-mono rounded"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-bordeaux-800" />
                    <span>{s}</span>
                  </span>
                ))}
              </div>
            </div>

            {selectedCert.credentialId && (
              <div className="p-2.5 bg-plum-900 text-ivory-100 rounded-lg font-mono text-xs flex justify-between items-center border border-plum-900">
                <span className="text-butter-300">CREDENTIAL ID:</span>
                <span className="font-bold">{selectedCert.credentialId}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-plum-900/15 flex justify-end">
            <button
              onClick={() => setSelectedCert(null)}
              className="px-4 py-2 bg-bordeaux-800 hover:bg-bordeaux-900 text-ivory-100 font-sans font-bold text-xs rounded-xl border-2 border-plum-900 shadow-card"
            >
              Done Reading
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
