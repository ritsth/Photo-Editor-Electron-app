const filters= document.querySelectorAll('#filter');
const canvas_form= document.querySelector('#canvas-form');
const filename= document.querySelector('#filename');
const img_selector= document.querySelector('#img-selector');


const canvas = document.getElementById('canvas1');
//to acess all the canvas build in methods
const ctx = canvas.getContext('2d');

let scale=1;
const image = new Image();
let blurr,grey=0;

function loadImage(e){

  const file= e.target.files[0];
  path1=file.path;
  // console.log(nativeImage.createFromPath(path).toDataURL());
  image.src=URL.createObjectURL(file);  

  image.onload = function (){
    //size of the image itself
    canvas.width= this.width;
    canvas.height= this.height;
    // canvas.width= 1000;
    // canvas.height= 1000;
    canvas.style.display='block';
    canvas_form.style.display ='block';
    ctx.drawImage(image,0,0);
    
    //getting each pixel (row-col) on the canvas (in our case the whole image)
    const scannedImg = ctx.getImageData(0,0,canvas.width,canvas.height);
    //returns object
    console.log(scannedImg.data);

    const scannedData= scannedImg.data;

    $(filters).on('change input',function(){;
      $("#slider-label").text(this.value);
      console.log(this.name);
      if(this.name == 'blur'){
        blurr = this.value;
      } 
      if(this.name == 'greyscale'){
        grey = this.value;
      } 
      ctx.filter=`blur(${blurr}px) grayscale(${grey}%)`;
      ctx.drawImage(image,0,0);
    });



  }


}

img_selector.addEventListener('change',loadImage);
canvas_form.addEventListener('submit',function(e){
  //for submit form type so it does get reloaded
  e.preventDefault();

  const dataURL=canvas.toDataURL();
  const filename_input = filename.value;
  console.log(filename_input);
  
  ipcRenderer.send('image:save',{
    dataURL,
    filename_input,
  });
}
)



