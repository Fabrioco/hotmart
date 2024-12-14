import { SendNotification } from "./components/SendNotification";
import { UploadVideo } from "./components/UploadVideo";

export default function Admin() {
  return (
    <div className="w-full h-full rounded-md flex justify-between items-center flex-wrap gap-5">
      <UploadVideo />
      <SendNotification />
    </div>
  );
}
