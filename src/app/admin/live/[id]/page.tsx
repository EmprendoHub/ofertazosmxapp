import React from "react";
import LivePicker from "../_components/LivePicker";
import HostComment from "../_components/HostComment";

const winnerPickerPage = async () => {
  return (
    <div className="flex flex-col items-center">
      <LivePicker />
      <HostComment />
    </div>
  );
};

export default winnerPickerPage;
