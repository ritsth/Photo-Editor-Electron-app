const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');


function loadImage(e) {
    const file= e.target.files[0];

    if (!isImg(file)){
        alertError("Please select a Image");
        return;
    }else{
        alertSucess('sucess');
    }

    //displaying the hidden form
    form.style.display = 'block';

    // Add original height and width to form using the URL API
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function (){
        widthInput.value = this.width;
        heightInput.value = this.height;
    }
    console.log(os.homedir());

    outputPath.innerText= path.join(os.homedir(),'Downloads','Resized_img');

}

//send data to main
function sendImage(e){
    //for submit form type so it does get reloaded
    e.preventDefault();

    const width = widthInput.value;
    const height = heightInput.value;
    const imgpath = img.files[0].path;

    if(!img.files[0]){
        alertError('please upload image');
        return;
    }
    if (width === '' || height === ''){
        alertError('Input height and width please');
        return;
    }

    //Send to main using ipcrenderer
    //ipcRenderer.send('#event_name'
    ipcRenderer.send('image:resize',{
        imgpath,
        width,
        height,
    });

    console.log("img send");

    //Catch the image:done event
    ipcRenderer.on('image:Resized', () =>{
        alertSucess('Image resized sucessfully');
    });


}

//make sure file is an valid image
function isImg(file){
    const acceptingImgTypes = ['image/gif', 'image/jpeg', 'image/png'];
    return file && acceptingImgTypes.includes(file['type']);
}

function alertError(message){
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: 'red',
            color: "white",
        }
    })
}

function alertSucess(message){
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: 'green',
            color: "white",
        }
    })
}



img.addEventListener('change',loadImage);
form.addEventListener('submit', sendImage);