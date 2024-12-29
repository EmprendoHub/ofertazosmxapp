"use client";

import React, { useEffect, useState } from "react";
import "./live.css";
import { useMessages } from "@/hooks/useMessages";

interface Comment {
  message: string;
  userName: string;
}

interface LivePickerProps {
  initialData?: string;
}

const LivePicker: React.FC<LivePickerProps> = ({ initialData }) => {
  const data = JSON.parse(initialData || "[]");
  const [comments, setComments] = useState<Comment[]>(data);
  const { getMessages, messages } = useMessages();
  console.log("messges", messages);
  useEffect(() => {
    getMessages();
  }, []);

  return (
    <div className="live-picker max-h-[80vh] overflow-y-auto">
      <h2 className="title">Live Comments</h2>
      <div className="comment-list  ">
        {messages?.map((comment, index) => (
          <div key={index} className="comment">
            <p className="comment-message">{comment.message}</p>
            <p className="comment-user">- {comment.userName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivePicker;
