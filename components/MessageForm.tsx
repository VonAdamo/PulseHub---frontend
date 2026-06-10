"use client";

import { FormEvent, useState } from "react";

type MessageFormProps = {
  isSending: boolean;
  onSendMessage: (content: string) => Promise<boolean>;
};

export function MessageForm({ isSending, onSendMessage }: MessageFormProps) {
  const [content, setContent] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return;
    }

    const wasSent = await onSendMessage(trimmedContent);

    if (wasSent) {
      setContent("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
      <input
        className="cyber-input min-w-0 flex-1"
        onChange={(event) => setContent(event.target.value)}
        placeholder='Try "hej bot"'
        value={content}
      />
      <button
        className="cyber-button w-full md:w-auto"
        disabled={isSending || !content.trim()}
        type="submit"
      >
        {isSending ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
