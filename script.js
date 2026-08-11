const fileInput = document.getElementById("file");
const splitTime = document.getElementById("splitTime");
const startBtn = document.getElementById("startBtn");
const result = document.getElementById("result");


startBtn.addEventListener("click", async ()=>{


    if(!fileInput.files[0]){

        alert("Please select a video file!");

        return;

    }



    const formData = new FormData();



    formData.append(
        "video",
        fileInput.files[0]
    );



    formData.append(
        "splitTime",
        splitTime.value
    );



    result.innerHTML =
    "⏳ Processing Video... Please wait";



    startBtn.disabled = true;



    try{


        const response = await fetch(
            "/upload",
            {

                method:"POST",

                body:formData

            }
        );



        const data = await response.json();



        if(data.error){


            result.innerHTML =
            "❌ "+data.error;


            startBtn.disabled = false;

            return;

        }





        let html = "";



        html += "✅ Complete!<br><br>";



        html += "🎬 Download Parts<br>";



        data.files.forEach((file)=>{


            html += `

            <a href="/downloads/${data.zip.replace(".zip","")}/${file}" download>

            ⬇ ${file}

            </a>

            `;


        });




        html += `

        <br>

        <a href="${data.zip}" download>

        📦 Download All ZIP

        </a>

        `;



        result.innerHTML = html;



    }


    catch(error){


        console.log(error);


        result.innerHTML =
        "❌ Server Error";


    }



    startBtn.disabled = false;



});
