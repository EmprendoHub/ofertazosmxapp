import React from "react";
import LivePicker from "../_components/LivePicker";
import HostComment from "../_components/HostComment";

const winnerPickerPage = async ({ params }: { params: any }) => {
  return (
    <div className="flex flex-col items-center">
      <LivePicker postId={params.id} />
      <HostComment />
    </div>
  );
};

export default winnerPickerPage;
