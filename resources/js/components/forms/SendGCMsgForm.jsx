import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function SendGCMsgForm({
    trailName = 'Masaraga Summit Trail',
    onSendMessage
}) {
    const [inputText, setInputText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        if (onSendMessage) {
            onSendMessage(inputText.trim());
        }

        setInputText('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
                type="text"
                placeholder={`Message group for ${trailName}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-surface-container-lowest border border-outline-variant/40 rounded-full px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-outline"
            />

            <Button
                type="submit"
                size="icon"
                disabled={!inputText.trim()}
                className="rounded-full shrink-0 cursor-pointer disabled:opacity-40"
            >
                <Send className="h-4 w-4" />
            </Button>
        </form>
    );
}