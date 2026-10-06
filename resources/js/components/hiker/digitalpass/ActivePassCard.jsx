import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Download, Eye, ChevronRight } from 'lucide-react';
import HikerTicketPass from '@/components/features/HikerTicketPass';
import DigitalPassDownloadModal from './DigitalPassDownloadModal';
import { StatusPill } from './helpers.jsx';

export default function ActivePassCard({ pass }) {
    const navigate = useNavigate();
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);

    return (
        <>
            <div className="p-2">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase">
                            {pass.transactionId}
                        </span>
                        <StatusPill status={pass.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="min-h-11 gap-1.5 cursor-pointer"
                            onClick={() => setIsDownloadOpen(true)}
                        >
                            <Download className="h-3.5 w-3.5" />
                            Download Pass Image
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="min-h-11 gap-1.5 cursor-pointer text-primary hover:text-primary"
                            onClick={() => navigate('/hiker/transactions')}
                        >
                            <Eye className="h-3.5 w-3.5" />
                            View Booking
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
                <div className="relative z-10 w-full flex justify-center items-center overflow-hidden py-1">
                    <div className="transform origin-top scale-[0.68] min-[380px]:scale-[0.72] min-[480px]:scale-[0.80] sm:scale-[0.90] lg:scale-100 transition-transform duration-200 -mb-27.5 min-[380px]:-mb-20 min-[480px]:-mb-12.5 sm:-mb-6.25 lg:mb-0">
                        <HikerTicketPass currentPass={pass} />
                    </div>
                </div>
            </div>
            <DigitalPassDownloadModal
                isOpen={isDownloadOpen}
                passes={[pass]}
                onClose={() => setIsDownloadOpen(false)}
                title="Download digital pass"
            />
        </>
    );
}
