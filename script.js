const logBox = document.getElementById("log");


function log(message){

    logBox.innerHTML +=
    "\n" + message;

    console.log(message);

}



try{


log("✅ Button Clicked");



const file = videoInput.files[0];


if(!file){

    log("❌ No Video Selected");

    alert("Select Video First");

    return;

}



log("📁 File : " + file.name);



log("⏳ Loading FFmpeg...");

await loadFFmpeg();



log("✅ FFmpeg Loaded");



log("📥 Reading Video...");



await ffmpeg.writeFile(

"input.mp4",

await fetchFile(file)

);



log("✅ Video Loaded");



let split =
Number(timeSelect.value);



log(
"✂️ Split Time : "
+ split
+ " seconds"
);



log("⚙️ FFmpeg Processing...");



await ffmpeg.exec([

"-i",
"input.mp4",

"-c",
"copy",

"-map",
"0",

"-segment_time",
split.toString(),

"-f",
"segment",

"part_%03d.mp4"

]);



log("🎉 Split Complete");



}

catch(error){


log("❌ ERROR FOUND:");

log(error.message);


console.error(error);


result.innerHTML =
"❌ Error : "+error.message;


}
