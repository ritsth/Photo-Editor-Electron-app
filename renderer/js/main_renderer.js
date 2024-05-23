const slider = document.querySelector('#slider'); // selecting id 
const slider_val= document.querySelector('#slider-label');
const img_selector= document.querySelector('#img-selector');
const Save = document.getElementById('save');


const canvas = document.getElementById('canvas1');
//to acess all the canvas build in methods
const ctx = canvas.getContext('2d');
let scale=1;
let path1;
const image = new Image();

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
    ctx.drawImage(image,0,0);
    
    //getting each pixel (row-col) on the canvas (in our case the whole image)
    const scannedImg = ctx.getImageData(0,0,canvas.width,canvas.height);
    //returns object
    console.log(scannedImg.data);

    const scannedData= scannedImg.data;

    $("#slider").on('change input',function(){
      console.log(this.value);
      $("#slider-label").text(this.value);
      let pre_value=0;

      if(this.value > pre_value ){
        scale=1;        
      }else if(this.value < pre_value){
        scale=-1;
      }else if(this.value ==0){
        scale =0;
      }
      pre_value=this.value;

      //GREY SCALLING
      for (let i=0;i<scannedData.length;i+=4){
      // rgb
        const total= scannedData[i]+ scannedData[i+1]+scannedData[i+2];
        const averageColorValue = total/3;
        scannedData[i] = averageColorValue + scale;
        scannedData[i+1]= averageColorValue + scale;
        scannedData[i+2] = averageColorValue + scale;
      }
      scannedImg.data= scannedData;

      ctx.putImageData(scannedImg,0,0);

      // ctx.filter=`blur(${scale}px)`;
      // ctx.drawImage(image,0,0);
    });




  }


}

img_selector.addEventListener('change',loadImage);

// Save.addEventListener('click',function(){
//   const url=ctx.getImageData(0,0,canvas.width,canvas.height).data;
//   console.log(url);
//   console.log(path1);
//   // image.src=url;
//   const width=10;
//   const height=10;
  
//   ipcRenderer.send('image:resiz',{
//     url,
//     path1,
//     height,
// });
// })



