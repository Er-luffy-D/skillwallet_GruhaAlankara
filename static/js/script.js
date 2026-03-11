const video = document.getElementById("cameraFeed");
const canvas = document.getElementById("captureCanvas");
const captureBtn = document.getElementById("captureBtn");
const messageBox = document.getElementById("cameraMessage");

// Only run camera logic on the create-design page
if (video && captureBtn) {
	let stream;

	async function startCamera() {
		const constraints = {
			video: {
				width: { ideal: 1280 },
				height: { ideal: 720 },
				facingMode: { ideal: "environment" },
			},
		};

		try {
			stream = await navigator.mediaDevices.getUserMedia(constraints);

			video.srcObject = stream;

			video.play();

			if (messageBox) messageBox.innerText = "Camera ready";
		} catch (error) {
			handleCameraError(error);
		}
	}

	function handleCameraError(error) {
		console.error(error);

		let message = "";

		switch (error.name) {
			case "NotAllowedError":
				message = "Camera permission denied. Please allow camera access.";
				break;

			case "NotFoundError":
				message = "No camera device found on this system.";
				break;

			case "NotReadableError":
				message = "Camera is already in use by another application.";
				break;

			default:
				message = "Unable to access camera. Please check browser settings.";
		}

		if (messageBox) messageBox.innerText = message;
	}

	function capturePhoto() {
		const context = canvas.getContext("2d");

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		canvas.toBlob(
			function (blob) {
				console.log("Image captured", blob);

				const imageURL = URL.createObjectURL(blob);

				const img = document.createElement("img");
				img.src = imageURL;
				img.style.width = "200px";

				document.body.appendChild(img);
			},
			"image/jpeg",
			0.95,
		);
	}

	captureBtn.addEventListener("click", capturePhoto);

	window.addEventListener("load", startCamera);
}
