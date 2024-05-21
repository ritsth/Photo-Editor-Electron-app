// const slider = document.querySelector('#slider'); // selecting id 
// const slider_val= document.querySelector('#slider-label');

// function sliderChanged(e) {
//   console.log(e.target.value);
//   slider_val.innerHTML = e.target.value;
// }

// slider.addEventListener('change', sliderChanged);
$(document).ready(function(){
    $("#slider").on('change input',function(){
      console.log(this.value);
      $("#slider-label").text(this.value);
    });

    $("#img").on('change',function(e){
      console.log(e.target.files[0]);
      const path = e.target.files[0].path;
      $("#img-canvas").value(e.target.files[0]);
    });

    ipcRenderer.on('s', () =>{
      console.log('Image resized sucessfully');
  });

  });