import React from 'react';
import { Wallet } from 'lucide-react';

export default function TransactionEmptyState() {
    return (
        <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl">
            <span className="h-12 w-12 rounded-xl bg-surface-container-high text-on-surface-variant flex items-center justify-center mx-auto mb-3">
                <Wallet className="h-6 w-6" />
            </span>
            <h3 className="text-base font-bold text-on-surface">No transactions found</h3>
            <p className="text-xs text-on-surface-variant">
                Try adjusting your search term or filter status.
            </p>
        </div>
    );
}
