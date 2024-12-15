import { Discount } from "./components/Discount";
import { SendNotification } from "./components/SendNotification";
import { SettingsCourse } from "./components/SettingsCourse";
import { UploadVideo } from "./components/UploadVideo";

export default function Admin() {
  return (
    <div className="w-full h-full rounded-md flex flex-col justify-between items-center flex-wrap gap-5">
      <UploadVideo />
      <SendNotification />
      <Discount />
      <SettingsCourse />
    </div>
  );
}
