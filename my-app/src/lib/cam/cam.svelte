<script lang="ts">
    import { onMount } from "svelte";

    import {cropImages, cropImage} from "$lib/cam/imgCut"


    let videoSource: HTMLVideoElement;
    let canvasElement: HTMLCanvasElement;
    let videoStream: MediaStream;
    let capturedImage: string | null = null;

    let capturedImages: string[] = []

    let captureTime = 0

    let captureTimeShow = true

    let size = true;

    let canvasShow = true;
    let camShow = true;

    let guideTextShow = true;

    let startBtnShow = false;

    let imgs = true;

    const obtenerVideoCamara = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoStream = stream;
            videoSource.srcObject = stream;
            videoSource.play();
        } catch (error) {
            console.log(error);
        }
    };

    async function captureImage() {
        if (videoStream) {
            const context = canvasElement.getContext('2d') as CanvasRenderingContext2D;

            canvasElement.width = videoSource.videoWidth;
            canvasElement.height = videoSource.videoHeight;

            // const targetAspectRatio = 4 / 5;
            // const { videoWidth, videoHeight } = videoSource;

            // const sourceWidth = Math.min(videoWidth, videoHeight * targetAspectRatio);
            // const sourceHeight = sourceWidth / targetAspectRatio;

            // const xOffset = (videoWidth - sourceWidth) / 2;
            // const yOffset = (videoHeight - sourceHeight) / 2;

            // canvasElement.width = sourceWidth;
            // canvasElement.height = sourceHeight;

            // context.drawImage(
            //     videoSource,
            //     xOffset,
            //     yOffset,
            //     sourceWidth,
            //     sourceHeight,
            //     0,
            //     0,
            //     canvasElement.width,
            //     canvasElement.height
            // );

            
            context.drawImage(videoSource, 0, 0);
            const cropImaged = await cropImage(canvasElement)
            console.log(cropImaged);
            
            const image = new Image();
            image.src = cropImaged;
            context.drawImage(image, 0, 0);

            // capturedImage = canvasElement.toDataURL('image/png');
            capturedImages.push(cropImaged)
        }
    }

    function timeCapture(){
        let captime = 0
        captureTime = captime

        camShow = false
        captureTimeShow = false

        captime++
        let setInt = setInterval(() => {
            captureTime = captime
            if (captime == 3){
                captureImage()
                clearInterval(setInt)
                camShow = true
                canvasShow = false
                setTimeout(() => {
                    captureTimeShow = true
                }, 1 * 1000)
            } 
            captime++
        }, 1 * 1000)
    }

    function mainStart(){
        let time = 0
        startBtnShow = true
        guideTextShow = false
        let Interval = setInterval(async () => {
            time++
            if (time == 3){
                guideTextShow = true
                timeCapture()
            } else if (time == 9){
                canvasShow = true
                captureTimeShow = false
                timeCapture()
            } else if (time == 15){
                canvasShow = true
                captureTimeShow = false
                timeCapture()
            // } else if (time == 21){
            //     canvasShow = true
            //     captureTimeShow = false
            //     timeCapture()
            // } else if (time == 23){
            } else if (time == 21){
                clearInterval(Interval)
                canvasShow = false
                mergeImages()
            }
        }, 1 * 1000)
    }

    function restart(){
        capturedImages = []
        canvasShow = true
        startBtnShow = false
    }

    async function mergeImages() {
        const context = canvasElement.getContext('2d') as CanvasRenderingContext2D;
        canvasElement.width = videoSource.videoWidth;
        canvasElement.height = videoSource.videoHeight;

        // capturedImages 배열을 순회하며 각 이미지를 가져와서 캔버스에 그립니다.
        
        capturedImages = await cropImages(capturedImages)
        

        capturedImages.forEach((imageData, index) => {
            const image = new Image();
            image.src = imageData;

            // 필요에 따라 위치와 크기를 조정하세요
            context.drawImage(image, 0, 0);

            // 이미지 사이에 간격을 두려면 separation 값을 조정하세요
            // const separation = 10;
            // context.translate(image.width + separation, 0);
        });
    }

	onMount(() => {
		obtenerVideoCamara()
	})
</script>

<style>
	.canvasShow, .camShow, .guideTextShow, .startBtnShow, .captureTimeShow, .imgs {
        display: none;
    }

    .size{
        width: 70vh;
    }
</style>
<div class="size" class:camShow>
	<div style="padding-bottom: 125%; position: relative;" >
		<video bind:this={videoSource} style="object-fit: cover; width: 100%; height: 100%; position: absolute; top: 0; left: 0;"></video>
	</div>
</div>
<canvas bind:this={canvasElement} class:canvasShow class="size"></canvas>

<button on:click={mainStart} type="button" class:startBtnShow class="text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-9xl px-20 py-10 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">촬영시작하기</button>
<div class="text-center text-9xl" class:guideTextShow >3초 간격으로 <br>4장의 사진이 찍히니 <br> 포즈를 취해주세요.</div>

<div class="absolute text-9xl text-white" class:captureTimeShow >{captureTime}</div>

<button on:click={restart}  class=" absolute bottom-0 right-0">restart</button>