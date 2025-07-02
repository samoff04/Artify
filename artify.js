const generateBtn = document.getElementById("generateBtn");
const loader = document.getElementById("loader");
const imageContainer = document.getElementById("image-container");
const downloadBtn = document.getElementById("downloadBtn");

const HUGGING_FACE_API_TOKEN = "Your API Token"; // Place your own API Token

generateBtn.addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value.trim();
  if (!prompt) return alert("Please enter a prompt!");

  loader.style.display = "block";
  imageContainer.innerHTML = "";
  downloadBtn.style.display = "none";

  const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HUGGING_FACE_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: prompt })
  });

  const contentType = response.headers.get("content-type");
  if (!response.ok || !contentType || !contentType.includes("image")) {
    const errorText = await response.text();
    alert("❌ Failed to generate image.\n\nAPI said:\n" + errorText);
    loader.style.display = "none";
    return;
  }

  const blob = await response.blob();

  // Convert blob to base64 for HTTPS-style download
  const reader = new FileReader();
  reader.onloadend = function () {
    const base64data = reader.result;
    const img = document.createElement("img");
    img.src = base64data;
    imageContainer.appendChild(img);

    downloadBtn.href = base64data;
    downloadBtn.style.display = "inline-block";
  };
  reader.readAsDataURL(blob);

  loader.style.display = "none";
});

// Leave popup logic
const leaveBtn = document.getElementById("leaveBtn");
const popupOverlay = document.getElementById("popupOverlay");
const confirmLeave = document.getElementById("confirmLeave");
const cancelLeave = document.getElementById("cancelLeave");

leaveBtn.addEventListener("click", () => {
  popupOverlay.style.display = "flex";
});

cancelLeave.addEventListener("click", () => {
  popupOverlay.style.display = "none";
});

confirmLeave.addEventListener("click", () => {
  popupOverlay.style.display = "none";

  window.open('', '_self');
  window.close();

  // Fallback message
  document.body.innerHTML = `
    <div style="text-align:center; margin-top:20%; font-size:2em; color:white; animation: fadeOut 2s forwards;">
      👋 Thank you for using Artify!
    </div>
  `;

  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    window.location.href = "about:blank";
  }, 2000);
});
