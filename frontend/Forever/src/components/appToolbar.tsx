import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import { useState } from "react";
import { HomeAddDialog } from "./dialog/addDialog";
import AppSearchBar from "./appSearchBar";
import DeleteDialog from "./dialog/deleteDialog";
import UpdateDialog from "./dialog/updateDialog";

const dialogSubmit = (values: any) => {
  console.log(values);
};

function AppToolbar() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSearchSelect = (value: string) => {
    console.log("Selected search item:", value);
  };

  return (
    <div
      className="toolbar flex flex-row h-10"
      style={{ fontFamily: "Roboto" }}
    >
      <AppSearchBar onSelect={handleSearchSelect} />
      <ButtonGroup rounded="large">
        <Button
          variant="outline"
          className="h-10"
          onClick={() => setAddDialogOpen(true)}
        >
          <i className="ri-add-circle-fill text-[16px]" />
          Add
        </Button>
        <Button
          variant="outline"
          className="h-10"
          onClick={() => setUpdateDialogOpen(true)}
        >
          <i className="ri-edit-fill text-[16px]" />
          Update
        </Button>
        <Button
          variant="outline"
          className="h-10"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <i className="ri-delete-bin-fill text-[16px]" />
          Delete
        </Button>
      </ButtonGroup>
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
      />
    </div>
  );
}

export default AppToolbar;
