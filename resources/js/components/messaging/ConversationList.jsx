import React from 'react';
import { MessageSquare, ChevronRight } from 'lucide-react';

import { DEFAULT_CONVERSATIONS } from '../../mockData';

export default function ConversationList({
    conversations = DEFAULT_CONVERSATIONS,
    activeId = 'park-announcements',
    onSelectConversation,
}) {
    return (
        <div className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-4 shadow-sm">
            <div className="flex items-center gap-2 px-2 mb-4">
                <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MessageSquare className="h-4 w-4" />
                </span>
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Conversations</p>
            </div>

            <div className="space-y-2">
                {conversations.length > 0 ? (
                    conversations.map((conv) => {
                        const IconComponent = conv.icon;
                        const isActive = activeId === conv.id;

                        return (
                            <button
                                key={conv.id}
                                type="button"
                                onClick={() => onSelectConversation && onSelectConversation(conv)}
                                className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center justify-between cursor-pointer border focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${isActive
                                    ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20'
                                    : 'bg-surface-container-low/50 border-outline-variant/20 hover:bg-surface-container-low'
                                    }`}
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    {/* Channel Icon */}
                                    <div
                                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${conv.type === 'admin'
                                            ? 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                                            : 'bg-primary/10 text-primary border-primary/20'
                                            }`}
                                    >
                                        <IconComponent className="h-5 w-5" />
                                    </div>

                                    {/* Details */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className="text-sm font-bold text-on-surface truncate">
                                                {conv.title}
                                            </h4>
                                            <span className="text-[10px] font-medium text-on-surface-variant shrink-0">
                                                {conv.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-xs text-on-surface-variant truncate mt-0.5">
                                            {conv.lastMessage}
                                        </p>
                                    </div>
                                </div>

                                {/* Unread Counter Badge or Arrow */}
                                <div className="flex items-center gap-2 shrink-0 ml-3">
                                    {conv.unreadCount > 0 ? (
                                        <span className="h-5 w-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">
                                            {conv.unreadCount}
                                        </span>
                                    ) : (
                                        <ChevronRight className="h-4 w-4 text-outline" />
                                    )}
                                </div>
                            </button>
                        );
                    })
                ) : (
                    <p className="text-center text-xs text-on-surface-variant py-8">
                        No announcements to show right now.
                    </p>
                )}
            </div>
        </div>
    );
}