
import React from 'react';
import { CreditCardIcon } from '../icons/CreditCardIcon';
import { XIcon } from '../icons/XIcon';

interface BuyCreditsModalProps {
  onClose: () => void;
  onPurchase: (amount: number) => void;
}

const creditPackages = [
  { credits: 50, price: '$4.99' },
  { credits: 100, price: '$8.99', popular: true },
  { credits: 250, price: '$19.99' },
];

const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({ onClose, onPurchase }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <XIcon className="w-6 h-6" />
        </button>
        <div className="text-center">
            <CreditCardIcon className="w-12 h-12 text-green-400 mx-auto mb-2" />
            <h2 className="text-2xl font-bold">Buy Credits</h2>
            <p className="text-gray-400 mt-1">Choose a package to continue creating.</p>
        </div>
        <div className="mt-6 space-y-3">
            {creditPackages.map((pkg) => (
                <button
                    key={pkg.credits}
                    onClick={() => onPurchase(pkg.credits)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors flex justify-between items-center ${pkg.popular ? 'border-purple-500 bg-purple-500/10 hover:bg-purple-500/20' : 'border-gray-700 hover:bg-gray-700'}`}
                >
                    <div>
                        <span className="font-bold text-lg">{pkg.credits} Credits</span>
                        {pkg.popular && <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">POPULAR</span>}
                    </div>
                    <span className="font-semibold text-green-400">{pkg.price}</span>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BuyCreditsModal;
