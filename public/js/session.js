/*route for song location

  "/song/upload/test/:song_name"

*/

function initSong(){
  
  var song_name = "testname";
  
  var fd = new FormData();
  fd.append('acorn', blob, song_name + ".ogg");
  fetch("/song/upload/"+song_name, 
  {
    method: 'get',
    body: fd
  });

}