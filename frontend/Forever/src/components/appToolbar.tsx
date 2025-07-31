import { CommandInput, Command } from "./ui/command";
import DataDialog, { type LabelData } from "./dataDialog";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import { useState } from "react";

const dialogSubmit = (values: any) => {
  console.log(values);
};

const labelDataDict: Record<string, LabelData[]> = {
  Add: [
    {
      title: "Categories",
      type: "tag",
      disabled: false,
    },
    {
      title: "Name",
      type: "string",
      disabled: false,
    },
  ],
  Update: [
    {
      title: "Categories",
      type: "tag",
      disabled: false,
    },
    {
      title: "Name",
      type: "string",
      disabled: false,
    },
  ],
  Delete: [
    {
      title: "Categories",
      type: "tag",
      disabled: true,
    },
    {
      title: "Name",
      type: "string",
      disabled: true,
    },
  ],
};

function AppToolbar() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("add");
  const toggleDialogOpen = (open?: boolean) => {
    setDialogOpen(open !== undefined ? open : !dialogOpen);
  };

  return (
    <div
      className="toolbar flex flex-row h-10"
      style={{ fontFamily: "Roboto" }}
    >
      <Command className="rounded-lg border shadow-xs grow mr-6">
        <CommandInput placeholder="Type a command or search..." />
      </Command>
      <ButtonGroup rounded="large">
        <Button
          variant="outline"
          className="h-10"
          onClick={() => {
            toggleDialogOpen();
            setDialogTitle("Add");
          }}
        >
          <i className="ri-add-circle-fill text-[16px]" />
          Add
        </Button>
        <Button
          variant="outline"
          className="h-10"
          onClick={() => {
            toggleDialogOpen();
            setDialogTitle("Update");
          }}
        >
          <i className="ri-edit-fill text-[16px]" />
          Update
        </Button>
        <Button
          variant="outline"
          className="h-10"
          onClick={() => {
            toggleDialogOpen();
            setDialogTitle("Delete");
          }}
        >
          <i className="ri-delete-bin-fill text-[16px]" />
          Delete
        </Button>
      </ButtonGroup>
      <DataDialog
        title={dialogTitle}
        labelDatas={labelDataDict[dialogTitle]}
        onSubmit={(values) => dialogSubmit(values)}
        dialogOpen={dialogOpen}
        toggleDialogOpen={toggleDialogOpen}
        withSearch={dialogTitle != "Add"}
        icon={
          dialogTitle == "Add"
            ? "ri-add-circle-fill"
            : dialogTitle == "Update"
            ? "ri-edit-fill"
            : "ri-delete-bin-fill"
        }
        buttonDelete={
          dialogTitle == 'Delete'
        }
      />
    </div>
  );
}

export default AppToolbar;
