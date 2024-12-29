"use client";

import React, { useEffect, useState } from "react";
import "./live.css";
import { useMessages } from "@/hooks/useMessages";
import { formatReadableDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { respondToFBComment } from "@/app/_actions";

interface LivePickerProps {
  initialData?: string;
}

const LivePicker: React.FC<LivePickerProps> = () => {
  const { getMessages, messages, subscribeToMessages } = useMessages();

  subscribeToMessages();

  useEffect(() => {
    getMessages();
  }, []);
  console.log("messagews", messages);

  const handleSetAsSold = async (commentId: string) => {
    await respondToFBComment(
      commentId,
      "Gracias por tu compra este articulo te lo ganaste tu!"
    );
  };

  return (
    <div className="live-picker max-h-[80vh] overflow-y-auto">
      <h2 className="title">Live Comments</h2>
      <div className="comment-list  ">
        {messages?.map((comment, index) => (
          <div
            key={index}
            className={`comment flex ${
              comment.type === "fake_share" ? "bg-yellow-200" : "bg-white"
            }`}
          >
            <div className="flex flex-col">
              <p className="comment-message">{comment.message}</p>
              <p className="comment-user">- {comment.userName}</p>
              <p className="comment-date">
                {formatReadableDate(comment.createdAt)}
                {comment.facebookCommentId}
              </p>
            </div>
            <div className="actions pl-4">
              <Button
                onClick={(e: any) => handleSetAsSold(comment.facebookCommentId)}
                variant="secondary"
              >
                ...
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivePicker;
