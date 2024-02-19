import { useEffect, useRef, useState } from 'react';
import Dropzone from 'react-dropzone'

export default function MyDropzone({ onUploadPhoto, uploadStatus, resetPhotoUploadStatus }) {
    const [ selectedPhoto, setSelectedPhoto ] = useState( null );
    const [ uploadInvalid, setUploadInvalid ] = useState( false );
    // const [ photoUploadStatus, setPhotoUploadStatus ] = useState( "idle" );
    const previewRef = useRef( null );

    const isUploading = uploadStatus == "loading";
    const isUploaded = uploadStatus == "success";
    const isUploadButtonDisabled = uploadStatus == "loading" || !selectedPhoto;

    // Accept only JPEG and PNG images
    const accept = {
        "image/jpeg": [ ".jpg", ".jpeg" ],
        "image/png": [ ".png" ]
    }

    /*
    `react-dropzone` will inject values for the two input params
    into this handler function.
    If the file is valid, it will be added to the `acceptedFiles` array.
    If the file is invalid, it will be added to the `fileRejections` array.
    */
    function handleDrop( acceptedFiles, fileRejections ) {
        resetPhotoUploadStatus(); 

        if( previewRef.current ) {
            URL.revokeObjectURL( previewRef.current );
            previewRef.current = null;
        }
        
        if ( acceptedFiles.length ) {
            setSelectedPhoto(acceptedFiles[0]);
            setUploadInvalid( false );
            previewRef.current = URL.createObjectURL(acceptedFiles[0]);
        } else if( fileRejections.length ) {
            setSelectedPhoto( null );
            setUploadInvalid( true );
        }
    }

    // revoke object URLs on unmount to avoid memory leaks
    useEffect(() => {
        return () => {
            URL.revokeObjectURL( previewRef.current );
            previewRef.current = null;
        }
    }, []);

    // upload photo to the server
    async function handleUploadClick(){
        onUploadPhoto( selectedPhoto );
    }

    return (
        <Dropzone onDrop={handleDrop} accept={accept} maxFiles="1" >
            {({ getRootProps, getInputProps }) => (
                <div className="mt-4">
                    
                    {/* FILE INPUT */}
                    <div className="border-4" style={{cursor: "pointer", borderStyle: "dashed"}}>
                        <div {...getRootProps({ className: "p-3 link-secondary text-center"})}>
                            <input {...getInputProps()} />
                            <p className="m-0">
                                Drag a photo or click to select&nbsp;it
                            </p>
                            <small className={`${ uploadInvalid ? "text-danger fw-bold" : "text-body-tertiary" }`}>
                                (Please upload a single JPEG or PNG&nbsp;image)
                            </small>
                        </div>
                    </div>

                    <button type="button" onClick={handleUploadClick} className="btn btn-primary mt-2" disabled={isUploadButtonDisabled}>{ uploadStatus == "loading" ? "Uploading..." : "Upload" }</button>

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
            )}
        </Dropzone>
    );
}