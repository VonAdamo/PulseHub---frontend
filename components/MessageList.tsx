"use client";

import type { Message } from "@/lib/types";

type MessageListProps = {
  bottomRef: React.RefObject<HTMLDivElement | null>;
  currentUserId?: string | null;
  messages: Message[];
};

export function MessageList({ bottomRef, currentUserId, messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex min-h-full items-center justify-center text-center">
        <div>
          <p className="cyber-heading font-semibold text-[color:var(--foreground)]">No messages yet</p>
          <p className="cyber-copy mt-1 text-sm">Send the first message in #general.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-3">
        {messages.map((message) => (
          <li
            className={`cyber-message border-l-2 p-3 ${
              message.senderId === currentUserId ? "border-l-[color:var(--accent)]" : "border-l-[color:var(--accent-tertiary)]"
            }`}
            key={message.id}
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="cyber-heading text-sm font-semibold text-[color:var(--foreground)]">{message.displayName}</span>
              <span className="cyber-muted text-xs">@{message.username}</span>
              <time className="cyber-muted text-xs" dateTime={message.createdAt}>
                {formatDate(message.createdAt)}
              </time>
            </div>
            <p className="cyber-copy mt-2 whitespace-pre-wrap break-words text-sm leading-6">{message.content}</p>
          </li>
        ))}
      </ul>
      <div ref={bottomRef} />
    </>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}
