// imports
const express = require( 'express' ),
  multer = require( "multer" ),
  { getFilename } = require( "./utils" );
  cors = require( "cors" );

// global variables, constants and defaults
const PORT = 3000,
  FILE_UPLOADS_DIR = "./uploads",
  MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB in bytes
  MAX_UPLOAD_SIZE_IN_MB = `${ MAX_UPLOAD_SIZE / 1024 / 1024 }MB`;
const app = express();

app.use( cors() );

// configure multer to save images to disk.
const fileStorageEngine = multer.diskStorage({
  
  // configure the destination directory 
  destination: ( req, file, callback ) => {
    callback( null, FILE_UPLOADS_DIR );
  },

  // configure the destination filename
  filename: ( req, file, callback ) => {
    callback( null, getFilename( file.mimetype ) );
  }

});

// configure multer to handle single file uploads
const uploadSingleFile = multer({
  
  // use the configured file storage option
  storage: fileStorageEngine,

  // skip any files that do not meet the validation criteria
  fileFilter: ( req, file, callback ) => {
    
    if ( file.mimetype !== "image/png" && file.mimetype !== "image/jpeg" ) {
      
      // Store a flag to denote that this file is invalid.
      // Unlike `res.locals`, `req.locals` is not really 
      // a standard express object but we use it here
      // for convenience to pass data to the route handler.
      req.locals = { invalidFileFormat: true };

      // reject this file
      callback( null, false );
    }

    // accept this file
    callback( null, true );

  },

  // configure a max limit on the uploaded file size
  limits: { fileSize: MAX_UPLOAD_SIZE }

}).single( "file" );

app.post( "/upload", ( req, res ) => {
  
  // `uploadSingleFile` is a middleware but we use it here 
  // inside the route handler because we want to handle errors.
  uploadSingleFile( req, res, err => {
    
    // if uploaded file size is too large or if its format is invalid
    // then respond with a 400 Bad Request HTTP status code.
    if( err instanceof multer.MulterError 
      || ( req.locals && req.locals.invalidFileFormat )
      ) {
        return res.status( 400 ).json({ 
          status: "error", 
          message: `Invalid file format. Please upload a JPEG or PNG image not greater than ${MAX_UPLOAD_SIZE_IN_MB} in size.` 
      });
    }

    // handle any other generic error
    else if ( err ) {
      return res.status( 500 ).json({ 
        status: "error", 
        message: "Something went wrong while uploading the image.", 
        detail: err 
      });
    }

    res.json({ status: "success" });
    
  });
});

app.listen( PORT, () => console.log( `👂API Server listening on port ${PORT}` ));