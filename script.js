import { FFmpeg } from 
"https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/+esm";

import { fetchFile } from 
"https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.1/+esm";



const ffmpeg = new FFmpeg();



const videoInput =
document.getElementById("video");


const startBtn =
document.getElementById("start");


const timeSelect =
document.getElementById("time");


const result =
document.getElementById("result");



let loaded = false;



async function loadFFmpeg(){


    if(!loaded){


        result.innerHTML =
        "⏳ Loading FFmpeg...";


        await ffmpeg.load({


            coreURL:
            "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js"


        });


        loaded = true;


    }

}




startBtn.addEventListener(
"click",
async ()=>{


    const file =
    videoInput.files[0];



    if(!file){

        alert(
        "Please select video"
        );

        return;

    }



    await loadFFmpeg();



    result.innerHTML =
    "⏳ Processing Video...";



    const inputName =
    "input.mp4";



    await ffmpeg.writeFile(
        inputName,
        await fetchFile(file)
    );



    const seconds =
    Number(timeSelect.value);




    await ffmpeg.exec([


        "-i",
        inputName,


        "-c",
        "copy",


        "-map",
        "0",


        "-segment_time",
        seconds.toString(),


        "-f",
        "segment",


        "part_%03d.mp4"


    ]);




    result.innerHTML =
    "✅ Complete<br><br>";



    let html = "";



    for(let i=0;i<50;i++){


        let name =
        `part_${String(i).padStart(3,"0")}.mp4`;



        try{


            const data =
            await ffmpeg.readFile(name);



            const blob =
            new Blob(
                [data.buffer],
                {
                    type:"video/mp4"
                }
            );



            const url =
            URL.createObjectURL(blob);



            html += `

            <a href="${url}" download="${name}">
            ⬇ Download ${name}
            </a>

            `;



        }

        catch(e){

            break;

        }


    }



    result.innerHTML += html;



});
