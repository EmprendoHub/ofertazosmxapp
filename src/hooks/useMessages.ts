import { supabase } from "@/lib/supabase";
import { useState } from "react";

export const useMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);

  const getMessages = async () => {
    try {
      const { data, error } = await supabase.from("messages").select("*");

      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.log("error getting messages", error);
    }
  };

  const subscribeToMessages = async () => {
    supabase
      .channel("messages-followup")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload: any) => {
          setMessages([...messages, payload.new]);
        }
      )
      .subscribe();
  };

  return {
    messages,
    setMessages,
    getMessages,
    subscribeToMessages,
  };
};
