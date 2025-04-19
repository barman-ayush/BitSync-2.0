import { Fragment, useState } from "react";
import { Button } from "./ui/button";
import { FolderPlusIcon, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const AddFile = () => {
  // State for folder creation
  const [folderName, setFolderName] = useState("");
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);

  // State for file upload
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);


  //Hanlde Folder Submit
  const handleFolderSubmit = (e : any) => {
    const fileName = e.target.value;
    // check in the same folder , whether there is a same folder name as current filename or not
    


  }

  // Handle file selection
  const handleFileChange = (e : any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  // Reset form states when dialogs close
  const resetFolderForm = () => {
    setFolderName("");
  };

  const resetFileForm = () => {
    setFileName("");
    setSelectedFile(null);
  };

  return (
    <Fragment>
      <div className="button-container">
        {/* Create Folder Dialog */}
        <Dialog open={folderDialogOpen} onOpenChange={(open) => {
          setFolderDialogOpen(open);
          if (!open) resetFolderForm();
        }}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0 hover:cursor-pointer mx-2"
              onClick={() => setFolderDialogOpen(true)}
            >
              <FolderPlusIcon className="h-4 w-4 mr-2" />
              Create Folder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="folderName" className="text-right">
                  Name
                </Label>
                <Input
                  id="folderName"
                  placeholder="Enter folder name"
                  className="col-span-3"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() => {
                  // Here you'll add the folder creation logic later
                  console.log("Creating folder:", folderName);
                  setFolderDialogOpen(false);
                }}
                disabled={!folderName.trim()}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Upload File Dialog */}
        <Dialog open={fileDialogOpen} onOpenChange={(open) => {
          setFileDialogOpen(open);
          if (!open) resetFileForm();
        }}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0 hover:cursor-pointer mx-2"
              onClick={() => setFileDialogOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fileName" className="text-right">
                  Name
                </Label>
                <Input
                  id="fileName"
                  placeholder="File name"
                  className="col-span-3"
                  value={fileName}
                  onChange={handleFolderSubmit}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fileUpload" className="text-right">
                  File
                </Label>
                <div className="col-span-3">
                  <Input
                    id="fileUpload"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={selectedFile ? selectedFile.name : "No file selected"}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {document.getElementById("fileUpload")!.click()}}
                    >
                      Browse
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={() => {
                  // Here you'll add the file upload logic later
                  console.log("Uploading file:", selectedFile, "with name:", fileName);
                  setFileDialogOpen(false);
                }}
                disabled={!selectedFile || !fileName.trim()}
              >
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Fragment>
  );
};

export default AddFile;