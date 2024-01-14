import Cropper from "cropperjs";

export function cropImages(base64Datas: string[]) {
    const cropImagess:string[] = []

    base64Datas.forEach((base64Data) => {
        const image = new Image();
        image.src = base64Data;
    
        image.onload = function () {
            
            const cropper = new Cropper(image, {
                aspectRatio: 4 / 5,
                viewMode: 1,
                ready() {
                    const croppedCanvas = cropper.getCroppedCanvas();
                    const croppedDataURL = croppedCanvas.toDataURL('image/jpeg'); // Adjust format if needed
                    console.log(croppedDataURL);
                    cropImagess.push(croppedDataURL)
                    
                    cropper.destroy(); // Clean up Cropper instance
                },
            });
        };
    })

    return cropImagess
}

export function cropImage(Imgae: HTMLCanvasElement) {
    let cropImaged:string = ''
    const cropper = new Cropper(Imgae, {
        aspectRatio: 4 / 5,
        viewMode: 1,
        ready() {
            const croppedCanvas = cropper.getCroppedCanvas();
            const croppedDataURL = croppedCanvas.toDataURL('image/png');
            console.log(croppedDataURL);
            cropImaged = croppedDataURL
            cropper.destroy();
        },
    });
    return cropImaged
}