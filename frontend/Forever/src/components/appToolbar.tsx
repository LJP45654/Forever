<<<<<<< HEAD
import { CommandInput, Command } from "./ui/command";
import DataDialog, { type LabelData } from "./dataDialog";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import { useState } from "react";
=======
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import { useState } from "react";
import { HomeAddDialog } from "./dialog/addDialog";
import AppSearchBar from "./appSearchBar";
import DeleteDialog from "./dialog/deleteDialog";
import UpdateDialog from "./dialog/updateDialog";
>>>>>>> origin/frontend

const dialogSubmit = (values: any) => {
  console.log(values);
};
<<<<<<< HEAD

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
=======

function AppToolbar() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSearchSelect = (value: string) => {
    console.log("Selected search item:", value);
>>>>>>> origin/frontend
  };

  return (
    <div
      className="toolbar flex flex-row h-10"
      style={{ fontFamily: "Roboto" }}
    >
<<<<<<< HEAD
      <Command className="rounded-lg border shadow-xs grow mr-6">
        <CommandInput placeholder="Type a command or search..." />
      </Command>
=======
      <div className="pr-6 grow">
      <AppSearchBar onSelect={handleSearchSelect} />
      </div>
>>>>>>> origin/frontend
      <ButtonGroup rounded="large">
        <Button
          variant="outline"
          className="h-10"
<<<<<<< HEAD
          onClick={() => {
            toggleDialogOpen();
            setDialogTitle("Add");
          }}
=======
          onClick={() => setAddDialogOpen(true)}
>>>>>>> origin/frontend
        >
          <i className="ri-add-circle-fill text-[16px]" />
          Add
        </Button>
        <Button
          variant="outline"
          className="h-10"
<<<<<<< HEAD
          onClick={() => {
            toggleDialogOpen();
            setDialogTitle("Update");
          }}
=======
          onClick={() => setUpdateDialogOpen(true)}
>>>>>>> origin/frontend
        >
          <i className="ri-edit-fill text-[16px]" />
          Update
        </Button>
        <Button
          variant="outline"
          className="h-10"
<<<<<<< HEAD
          onClick={() => {
            toggleDialogOpen();
            setDialogTitle("Delete");
          }}
=======
          onClick={() => setDeleteDialogOpen(true)}
>>>>>>> origin/frontend
        >
          <i className="ri-delete-bin-fill text-[16px]" />
          Delete
        </Button>
      </ButtonGroup>
<<<<<<< HEAD
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
=======
      <HomeAddDialog
        open={addDialogOpen}
        onOpenChange={() => setAddDialogOpen(false)}
        onSubmit={(values) => dialogSubmit(values)}
      />
      <UpdateDialog
        title='Update'
        open={updateDialogOpen}
        onOpenChange={() => setUpdateDialogOpen(false)}
        onUpdate={(values) => dialogSubmit(values)}
      />
      <DeleteDialog
        title='Delete'
        open={deleteDialogOpen}
        onOpenChange={() => setDeleteDialogOpen(false)}
        onDelete={(values) => dialogSubmit(values)}
>>>>>>> origin/frontend
      />
    </div>
  );
}

export default AppToolbar;
