import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

function TableToolbar() {
    return (
        <div className="flex items-center justify-between p-4 bg-white border-b">
            <ButtonGroup orientation="horizontal">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <i className="ri-add-circle-fill text-[20px]"></i>ADD
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Item</DialogTitle>
                            <DialogDescription>
                                Fill in the details to add a new item.
                            </DialogDescription>
                        </DialogHeader>
                        {/* Add your form or content here */}
                        <div className="mt-4">
                            {Object.entries({
                                name: "text",
                                value: "number",
                                description: "text",
                            }).map(([key, type]) => (
                                <input
                                    key={key}
                                    type={type}
                                    placeholder={`Item ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                    className="border p-2 w-full mt-2"
                                />
                            ))}
                            <input
                                type="number"
                                placeholder="Item Value"
                                className="border p-2 w-full mt-2"
                            />
                            <Button className="mt-2">Submit</Button>
                        </div>
                    </DialogContent>
                </Dialog>
                <Button variant="outline">
                    <i className="ri-edit-fill text-[20px]"></i>UPDATA
                </Button>
                <Button variant="outline">
                    <i className="ri-delete-bin-fill text-[20px]"></i>DELETE
                </Button>
            </ButtonGroup>
        </div>
    );
}
export default TableToolbar;