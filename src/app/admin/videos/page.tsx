import { getFBLiveVideos, subscribeToFbApp } from "@/app/_actions";
import React from "react";
import LiveVideoPicker from "./_components/LiveVideoPicker";

const liveLiveVideoPicker = async () => {
  const subcribe = await subscribeToFbApp("8619440141408007");

  const data = await getFBLiveVideos();
  return <LiveVideoPicker data={data.videos} />;
};

export default liveLiveVideoPicker;
