const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');


function loadImage(e) {
    const file= e.target.files[0];
    console.log(file.path);

    if (!isImg(file)){
        console.log("Please select a Image");
        return;
    }else{
        console.log('sucess')
    }

    form.style.display = 'block';

    // Add original height and width to form using the URL API
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function (){
        widthInput.value = this.width;
        heightInput.value = this.height;
    }

    outputPath.innerText= file.path;

}

//make sure file is an valid image
function isImg(file){
    const acceptingImgTypes = ['image/gif', 'image/jpeg', 'image/png'];
    return file && acceptingImgTypes.includes(file['type']);
}


function ResizeImage(e){
    e.preventDefault();

    console.log(heightInput.value);
}


img.addEventListener('change',loadImage);
form.addEventListener('submit', ResizeImage);