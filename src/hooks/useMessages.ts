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

  return {
    messages,
    setMessages,
    getMessages,
  };
};
