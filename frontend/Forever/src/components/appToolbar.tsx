import { CommandInput, Command } from "./ui/command";
import DataDialog from "./dataDialog";

function AppToolbar() {
  return (
    <div
      className="toolbar flex flex-row gap-6 h-10"
      style={{ fontFamily: "Roboto" }}
    >
      <Command className="rounded-lg border shadow-xs grow">
        <CommandInput placeholder="Type a command or search..." />
      </Command>
      <div className="button-group flex h-10">
        <DataDialog
          title="Add"
          trigger="Add"
          icon="ri-add-circle-fill text-[16px]"
        />
        <DataDialog
          title="Update"
          trigger="Update"
          icon="ri-edit-fill text-[16px]"
        />
        <DataDialog
          title="Delete"
          trigger="Delete"
          icon="ri-delete-bin-fill text-[16px]"
        />
      </div>
    </div>
  );
}

export default AppToolbar;
