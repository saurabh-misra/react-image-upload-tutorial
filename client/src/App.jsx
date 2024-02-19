import { useState } from "react";
import NativeUpload from "./NativeUpload";
import ReactDropzoneUpload from "./ReactDropzoneUpload";

export default function App() {
    const [ uploadType, setUploadType ] = useState( <NativeUpload /> );

    function handleNavLinkClick( event ){
        const uploadType = event.target.getAttribute( "data-upload-type" ); 
        if( uploadType == "native" ) {
            setUploadType( <NativeUpload /> );
        } else { // "react-dropzone"
            setUploadType( <ReactDropzoneUpload /> );
        }
    }

    return (
        <>
            <nav className={`sticky-top navbar navbar-expand-lg bg-body-tertiary`}>
                <div className="container">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <button className="nav-link" onClick={handleNavLinkClick} data-upload-type="native">
                                Native Upload
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" onClick={handleNavLinkClick} data-upload-type="react-dropzone">
                                React Dropzone Upload
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>

            { uploadType }
        </>
    );
}