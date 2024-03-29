import { useState, useRef, useEffect } from 'react'

export default function NativeUpload() {
    const [ selectedPhoto, setSelectedPhoto ] = useState( null );
    const [ photoUploadStatus, setPhotoUploadStatus ] = useState( "idle" );
    const previewRef = useRef( null );

    function handlePhotoSelect( event ) {
        // reset photo upload status
        setPhotoUploadStatus( "idle" );

        // reset image preview
        if( previewRef.current ) {
            URL.revokeObjectURL( previewRef.current );
            previewRef.current = null;
        }

        // set the selected photo in state
        setSelectedPhoto( event.target.files[0] );

        // store the preview
        previewRef.current = URL.createObjectURL(event.target.files[0]);
    }

    // upload photo to the server
    async function uploadPhoto(){
        var formData = new FormData();
        formData.append( "file", selectedPhoto );

        try {
            setPhotoUploadStatus( "loading" );

            await fetch("http://localhost:3000/upload", {
              method: "POST",
              body: formData,
            });
            
            // dummy timeout to extend the duration of this operation
            // and properly show the loading indicator. 
            setTimeout( () => setPhotoUploadStatus( "success" ), 1000);
        } catch (error) {
            console.error("Error:", error);
        }
    }
    
    // revoke object URLs on unmount to avoid memory leaks
    useEffect(() => {
        return () => {
            URL.revokeObjectURL( previewRef.current );
            previewRef.current = null;
        }
    }, []);

    const isUploading = photoUploadStatus == "loading";
    const isUploaded = photoUploadStatus == "success";
    const isUploadButtonDisabled = photoUploadStatus == "loading" || !selectedPhoto;

    return (
        <div className="container mt-5">

            {/* FILE INPUT */}
            <input type="file" name="photo" onChange={handlePhotoSelect} className='form-control' />
            <button type="button" onClick={uploadPhoto} className="btn btn-primary mt-2" disabled={isUploadButtonDisabled}>{ photoUploadStatus == "loading" ? "Uploading..." : "Upload"}</button>

            {/* FILE PREVIEW & UPLOAD STATUS */}
            {
                selectedPhoto && (
                    <div className="card d-flex mt-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-start">
                                <img src={previewRef.current} width="200px" className="img-thumbnail" />
                                <div className="p-2 ps-4 d-flex flex-column justify-content-start">
                                    <span className="fs-4">{selectedPhoto.name}</span>
                                    {
                                        isUploading && <span className="text-body-tertiary">⌛Uploading...</span>
                                    }
                                    {
                                        isUploaded && <span className="text-success">✅Uploaded!</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}