import { getPostDBComments } from "@/app/_actions";
import React from "react";
import LivePicker from "../_components/LivePicker";
import HostComment from "../_components/HostComment";

const winnerPickerPage = async ({ params }: { params: any }) => {
  const data: any = await getPostDBComments(params.id);

  return (
    <div className="flex flex-col items-center">
      <LivePicker initialData={data.commentsData} />
      <HostComment />
    </div>
  );
};

export default winnerPickerPage;
