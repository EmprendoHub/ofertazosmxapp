// NewContentPage.tsx (Server Component)

import React from "react";
import InnerTemplate from "../_components/InnerTemplate";
import { TEMPLATE } from "../../_components/TemplateListSection";
import Templates from "@/app/(dashdata)/Templates";

interface PROPS {
  params: {
    "template-slug": string;
  };
}

export const getAIContent = async (formData: string, pageSlug: string) => {
  const selectedTemplate: TEMPLATE | undefined = Templates?.find(
    (item) => item.slug === pageSlug
  );

  if (!selectedTemplate) {
    throw new Error(`Template with slug "${pageSlug}" not found`);
  }

  const selectedPrompt = selectedTemplate.aiPromt;

  const finalAiPrompt = formData + ", " + selectedPrompt;

  const response = await fetch("/api/generate-content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ finalAiPrompt }),
  });

  const data = await response.json();

  return data;
};

const NewContentPage = ({ params }: PROPS) => {
  const pageSlug = params["template-slug"];

  return <InnerTemplate pageSlug={pageSlug} />;
};

export default NewContentPage;
