"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createMessage, getMessages } from "@/lib/api";
import type { Message } from "@/lib/types";
import { MessageForm } from "@/components/MessageForm";
import { MessageList } from "@/components/MessageList";

const DEFAULT_CHANNEL = "general";
const BOT_REFRESH_DELAY_MS = 1200;
const POLLING_INTERVAL_MS = 5000;

type RefreshOptions = {
  showRefreshing?: boolean;
};

type ChatViewProps = {
  currentUserId?: string | null;
};

export function ChatView({ currentUserId }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isRefreshInFlightRef = useRef(false);
  const botRefreshTimeoutRef = useRef<number | null>(null);

  const refreshMessages = useCallback(async ({ showRefreshing = false }: RefreshOptions = {}) => {
    if (isRefreshInFlightRef.current) {
      return;
    }

    isRefreshInFlightRef.current = true;

    try {
      setError(null);

      if (showRefreshing) {
        setIsRefreshing(true);
      }

      const nextMessages = await getMessages(DEFAULT_CHANNEL);
      setMessages(nextMessages);
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "Could not load messages.");
    } finally {
      setIsLoading(false);

      if (showRefreshing) {
        setIsRefreshing(false);
      }

      isRefreshInFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    refreshMessages();
  }, [refreshMessages]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      refreshMessages();
    }, POLLING_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);

      if (botRefreshTimeoutRef.current !== null) {
        window.clearTimeout(botRefreshTimeoutRef.current);
      }
    };
  }, [refreshMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  async function handleSendMessage(content: string) {
    setIsSending(true);
    setError(null);

    try {
      await createMessage({
        channel: DEFAULT_CHANNEL,
        content,
      });

      await refreshMessages({ showRefreshing: true });

      botRefreshTimeoutRef.current = window.setTimeout(() => {
        refreshMessages();
        botRefreshTimeoutRef.current = null;
      }, BOT_REFRESH_DELAY_MS);

      return true;
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "Could not send message.");
      return false;
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="cyber-shell space-y-4 p-4 md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="cyber-kicker">Channel locked</p>
          <h2 className="cyber-heading mt-2 text-xl font-semibold text-[color:var(--foreground)]">
            #{DEFAULT_CHANNEL}
          </h2>
          <p className="cyber-copy mt-1 text-sm">Messages are loaded from the BFF.</p>
        </div>

        <button
          className="cyber-button cyber-button-tertiary"
          disabled={isRefreshing}
          onClick={() => refreshMessages({ showRefreshing: true })}
          type="button"
        >
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error ? <p className="cyber-card border-[color:var(--destructive)] p-3 text-sm text-[color:var(--destructive)]">{error}</p> : null}

      <div className="cyber-terminal h-96 overflow-y-auto p-3">
        {isLoading ? (
          <ChatLoadingState />
        ) : (
          <MessageList bottomRef={bottomRef} currentUserId={currentUserId} messages={messages} />
        )}
      </div>

      <MessageForm isSending={isSending} onSendMessage={handleSendMessage} />
    </section>
  );
}

function ChatLoadingState() {
  return (
    <div className="space-y-3">
      <p className="cyber-copy text-sm">Loading messages...</p>
      <div className="cyber-card p-3">
        <div className="h-4 w-36 bg-[color:rgba(0,212,255,0.18)]" />
        <div className="mt-3 h-4 w-56 bg-[color:rgba(0,255,136,0.16)]" />
      </div>
      <div className="cyber-card p-3">
        <div className="h-4 w-28 bg-[color:rgba(255,0,255,0.18)]" />
        <div className="mt-3 h-4 w-44 bg-[color:rgba(0,212,255,0.16)]" />
      </div>
    </div>
  );
}
