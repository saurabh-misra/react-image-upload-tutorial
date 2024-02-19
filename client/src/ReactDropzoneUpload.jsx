import { useState } from "react";
import MyDropzone from "./MyDropzone";

export default function ReactDropzoneUpload() {
    const [ photoUploadStatus, setPhotoUploadStatus ] = useState( "idle" );

    async function handleUploadPhoto( selectedPhoto ){
        var formData = new FormData();
        formData.append( "file", selectedPhoto );

        try {
            setPhotoUploadStatus( "loading" );
            await fetch("http://localhost:3000/upload", {
              method: "POST",
              body: formData,
            });
            
            setTimeout( () => setPhotoUploadStatus( "success" ), 3000);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    function resetPhotoUploadStatus(){
        setPhotoUploadStatus( "idle" );
    }

    return (
        <div className="container mt-5">
            <MyDropzone onUploadPhoto={handleUploadPhoto} uploadStatus={photoUploadStatus} resetPhotoUploadStatus={resetPhotoUploadStatus}  />
        </div>
    );
}