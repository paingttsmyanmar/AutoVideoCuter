const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const archiver = require("archiver");
const { v4: uuidv4 } = require("uuid");


const app = express();

const PORT = 3000;


// Folder Setup

const uploadFolder = "uploads";
const downloadFolder = "downloads";


if(!fs.existsSync(uploadFolder)){
    fs.mkdirSync(uploadFolder);
}


if(!fs.existsSync(downloadFolder)){
    fs.mkdirSync(downloadFolder);
}


// Static Files

app.use(express.static("./"));

app.use(
"/downloads",
express.static(downloadFolder)
);


// Upload Setup

const storage = multer.diskStorage({

    destination:(req,file,cb)=>{
        cb(null,uploadFolder);
    },


    filename:(req,file,cb)=>{

        cb(
            null,
            Date.now()+"_"+file.originalname
        );

    }

});


const upload = multer({
    storage:storage
});



// Upload + Split API


app.post(
"/upload",
upload.single("video"),
(req,res)=>{


    const videoFile = req.file.path;


    const splitTime = req.body.splitTime || 600;


    const id = uuidv4();


    const outputFolder =
    path.join(downloadFolder,id);



    if(!fs.existsSync(outputFolder)){
        fs.mkdirSync(outputFolder);
    }



    const outputName =
    path.join(
        outputFolder,
        "part_%03d.mp4"
    );



    const command = `ffmpeg -i "${videoFile}" -c copy -map 0 -segment_time ${splitTime} -f segment "${outputName}"`;



    exec(command,(error)=>{


        if(error){

            console.log(error);

            return res.json({
                error:"FFmpeg Error"
            });

        }



        // Create ZIP

        const zipName =
        id+".zip";


        const zipPath =
        path.join(
            downloadFolder,
            zipName
        );



        const output =
        fs.createWriteStream(zipPath);



        const archive =
        archiver("zip",{
            zlib:{
                level:9
            }
        });



        output.on(
            "close",
            ()=>{


                const files =
                fs.readdirSync(outputFolder);



                res.json({

                    files:files,

                    zip:
                    "/downloads/"+zipName

                });


            }
        );



        archive.pipe(output);



        archive.directory(
            outputFolder,
            false
        );


        archive.finalize();



    });



});




// Start Server

app.listen(
PORT,
()=>{
console.log(
`Server Running : http://localhost:${PORT}`
);
}
);
