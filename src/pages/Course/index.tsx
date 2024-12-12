import React from "react";
import { VideoPlayer } from "./components/VideoPlayer";
import { ListLessons } from "./components/ListLessons";

export default function Course() {
  return (
    <div className="w-full h-full bg-white rounded-2xl flex flex-row">
      <VideoPlayer />
      <ListLessons />
    </div>
  );
}
