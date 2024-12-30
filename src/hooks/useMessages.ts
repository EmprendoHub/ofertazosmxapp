import { supabase } from "@/lib/supabase";
import OpenAI from "openai";
import { useState } from "react";

export const useMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);

  const getMessages = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("postId", postId)
        .order("createdAt", { ascending: true });

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

  const setMessageType = async (id: string, type: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .update({ type })
        .eq("id", id);
      console.log("data", data);

      if (error) {
        console.error("Error updating message type:", error);
      } else {
        console.log("Message type updated successfully:", data);

        // Update local state to reflect the change
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === id ? { ...message, type } : message
          )
        );
      }
    } catch (error) {
      console.error("Error in setMessageType function:", error);
    }
  };

  const getSupabaseFBComments = async (videoId: string) => {
    const video = videoId || "421878677666248_122131066880443689";

    try {
      const { data: commentsData, error } = await supabase
        .from("comments") // Replace with your Supabase table name
        .select("*")
        .eq("postId", video)
        .order("createdAt", { ascending: false });

      if (error) {
        console.error("Error fetching comments from Supabase:", error);
        return { status: 500, error };
      }

      return {
        status: 200,
        commentsData: JSON.stringify(commentsData),
        commentsDataCount: commentsData?.length || 0,
      };
    } catch (error: any) {
      console.error("Error setting up request:", error);
      return { status: 500, error };
    }
  };

  const getMessageIntentWithAi = async (id: string, message: string) => {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPEN_AI_KEY,
      });

      const aiPromptRequest = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `
          Eres un asistente experto en ventas en vivo que ayuda a evaluar la intención de compra de los clientes en un live stream. Tu tarea principal es analizar los mensajes enviados por los clientes en español para determinar si están expresando una intención de compra, y si es así, identificar los detalles clave del mensaje como:
    
          1. Producto mencionado (si corresponde).
          2. Cantidad o precio indicado.
          3. Nombre o referencia personal (si se menciona, por ejemplo, "yo," "mía," "mío").
    
          Ejemplo:
          - Mensaje: "yo camisa negra" -> Respuesta: { intención: "compra", producto: "camisa negra", cantidad: 1 }
          - Mensaje: "mia bolsa 150" -> Respuesta: { intención: "compra", producto: "bolsa", precio: 150 }
          - Mensaje: "solo mirando" -> Respuesta: { intención: "sin compra" }
    
          Si no hay suficiente información para determinar una intención clara o detalles del producto, responde con: { intención: "indeterminada" }.
    
          Sé preciso y utiliza un formato JSON en tus respuestas. Habla siempre en español y mantén la información directa y profesional.
          `,
          },
          {
            role: "user",
            content: message,
          },
        ],
        model: "gpt-3.5-turbo",
      });

      console.log(aiPromptRequest);
      if (aiPromptRequest) {
        const response = {
          role: "assistant",
          content: aiPromptRequest.choices[0].message.content,
        };
        console.log("response", response);

        return {
          status: 200,
          commentsData: JSON.stringify(response),
        };
      }
    } catch (error: any) {
      console.log(error, "errors");
    }
  };

  return {
    messages,
    setMessages,
    getMessages,
    subscribeToMessages,
    setMessageType,
    getSupabaseFBComments,
    getMessageIntentWithAi,
  };
};
