import { useEffect, useMemo, useState } from 'react';
import { MessageSquare, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import Conversation from '../../components/messaging/Conversation';
import ConversationList from '../../components/messaging/ConversationList';
import { toast } from '../../components/ui/toast';
import { markChannelRead, sendMessage, useStaffStore } from '../../state/staffStore';
import StaffEmptyState from '../../components/staff/StaffEmptyState';
import StaffPageHeader from '../../components/staff/StaffPageHeader';

const CHANNEL_ICONS = {
    admin: ShieldAlert,
};

export default function StaffMessages() {
    const [sectionRef, isInView] = useInView({ threshold: 0.15, triggerOnce: true });
    const { channels } = useStaffStore();

    // Track selected channel ID
    const [selectedChannelId, setSelectedChannelId] = useState(null);
    // Track mobile view state (whether viewing the active channel detail or the channel list)
    const [showMobileChat, setShowMobileChat] = useState(false);

    const channelList = useMemo(() => {
        return Object.values(channels).map((channel) => ({
            ...channel,
            icon: CHANNEL_ICONS[channel.type] || MessageSquare,
        }));
    }, [channels]);

    // Set default active channel if none is selected yet
    useEffect(() => {
        if (channelList.length > 0 && !selectedChannelId) {
            setSelectedChannelId(channelList[0].id);
        }
    }, [channelList, selectedChannelId]);

    useEffect(() => {
        Object.keys(channels).forEach(markChannelRead);
    }, [channels]);

    const activeChannel = useMemo(() => {
        return channelList.find((c) => c.id === selectedChannelId) || channelList[0];
    }, [channelList, selectedChannelId]);

    const handleSelect = (channel) => {
        setSelectedChannelId(channel.id);
        markChannelRead(channel.id);
        setShowMobileChat(true); // Switch to conversation view on mobile selection
    };

    const handleSend = (message) => {
        if (!activeChannel) return;
        const sent = sendMessage(activeChannel.id, message);
        if (sent) {
            toast.add({
                type: 'success',
                title: 'Message sent',
                description: `Your message was added to ${activeChannel.title}.`,
            });
        }
    };

    return (
        <div ref={sectionRef} className="space-y-4 md:space-y-6">
            <div
                style={{ transitionDelay: '0ms' }}
                className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                    }`}
            >
                <StaffPageHeader
                    eyebrow="Park staff · Group coordination"
                    title="Messages"
                    description="One shared channel for park announcements about trail conditions, safety, and jump-off logistics."
                />
            </div>

            <div
                style={{ transitionDelay: '150ms' }}
                className={`transition-all duration-700 ease-out ${isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                    }`}
            >
                {activeChannel ? (
                    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-4 md:gap-6 min-h-125 h-[calc(100vh-220px)] max-h-200">

                        {/* Conversation List Sidebar */}
                        <div
                            className={`w-full h-full overflow-y-auto ${showMobileChat ? 'hidden md:block' : 'block'
                                }`}
                        >
                            <ConversationList
                                conversations={channelList}
                                activeId={activeChannel.id}
                                onSelectConversation={handleSelect}
                            />
                        </div>

                        {/* Active Conversation Container */}
                        <div
                            className={`min-w-0 h-full flex flex-col ${showMobileChat ? 'flex' : 'hidden md:flex'
                                }`}
                        >
                            {/* Mobile Back Button Header */}
                            <div className="md:hidden pb-3 border-b border-gray-200 dark:border-gray-800 mb-3 flex items-center">
                                <button
                                    onClick={() => setShowMobileChat(false)}
                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Back to channels</span>
                                </button>
                            </div>

                            {/* Conversation View */}
                            <div className="flex-1 min-h-0">
                                <Conversation
                                    title={activeChannel.title}
                                    subtitle={activeChannel.subtitle}
                                    messages={activeChannel.messages}
                                    onSendMessage={handleSend}
                                />
                            </div>
                        </div>

                    </div>
                ) : (
                    <StaffEmptyState
                        icon={MessageSquare}
                        title="No announcements yet"
                        description="Park notices will appear here once the management office posts them."
                    />
                )}
            </div>
        </div>
    );
}