const slider = document.querySelector('#slider'); // selecting id 
const slider_val= document.querySelector('#slider-label');
const img_selector= document.querySelector('#img-selector');


const canvas = document.getElementById('canvas1');
//to acess all the canvas build in methods
const ctx = canvas.getContext('2d');
let scale=1;

const image = new Image();

function loadImage(e){


  const file= e.target.files[0];
  const path=file.path;
  // console.log(nativeImage.createFromPath(path).toDataURL());
  image.src=URL.createObjectURL(file);  

  image.onload = function (){
    //size of the image itself
    canvas.width= this.width;
    canvas.height= this.height;
    // canvas.width= 1000;
    // canvas.height= 1000;
    canvas.style.display='block';
    ctx.drawImage(image,0,0);
    
    //getting each pixel (row-col) on the canvas (in our case the whole image)
    const scannedImg = ctx.getImageData(0,0,canvas.width,canvas.height);
    //returns object
    console.log(scannedImg);

    const scannedData= scannedImg.data;

    $("#slider").on('change input',function(){
      console.log(this.value);
      $("#slider-label").text(this.value);
      scale=this.value;

      //GREY SCALLING
      for (let i=0;i<scannedData.length;i+=4){
      // rgb
        const total= scannedData[i]+ scannedData[i+1]+scannedData[i+2];
        const averageColorValue = total/3;
        scannedData[i] = averageColorValue * scale;
        scannedData[i+1]= averageColorValue * scale;
        scannedData[i+2] = averageColorValue * scale;
      }
      scannedImg.data= scannedData;
      ctx.putImageData(scannedImg,0,0);
    });




  }


}

img_selector.addEventListener('change',loadImage);
// slider.addEventListener('change',function(){

// })



// $(document).ready(function(){
    // $("#slider").on('change input',function(){
    //   console.log(this.value);
    //   $("#slider-label").text(this.value);
    // });

    // $("#img").on('change',function(e){
    //   console.log(e.target.files[0]);
    //   const path = e.target.files[0].path;
    //   console.log(nativeImage.createFromPath(path).toDataURL());

      // const canvas = document.getElementById('canvas1');
      // canvas.width= 800;
      // canvas.height =800;
      // //to acess all the canvas build in methods
      // const ctx = canvas.getContext('2d');
      // const image = new Image();
      // image.src=nativeImage.createFromPath(path).toDataURL();

    //   image.addEventListener('load',function(){

    //     image.drawImage(image,0,0);        
    //   })

  
  //   });
    

  // });



