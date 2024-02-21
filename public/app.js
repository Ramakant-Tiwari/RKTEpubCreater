window.addEventListener("DOMContentLoaded", async function () {
  try {
    let downloadBtn;
    const url = document.querySelector(".message").dataset.url;
    const loader = document.querySelector("#loader-container .loader");
    const response = await fetch("/generate-epub", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
      }),
    });
    if (!response.ok) {
      throw new Error("Wrong URL Error. Please Re-enter");
    }
    const result = await response.json();
    const epub = result.epub;
    let i = 10;
    while (true) {
      loader.classList.remove("disabled");
      await new Promise((resolve) => setTimeout(resolve, i * 1000));
      const response = await fetch("/check-status", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          epub: epub,
        }),
      });
      const res = await response.json();
      const epubGenerated = res.generated;
      if (epubGenerated) {
        loader.classList.add("disabled");
        downloadBtn = document.querySelector("#loader-container button");
        downloadBtn.classList.remove("disabled");
        break;
      }

      i += 10;
    }

    downloadBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      const response = await fetch("/download-epub", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          epub: epub,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to download EPUB file");
      }

      const blob = await response.blob();

      const link = document.createElement("a");
      link.style.display = "block";
      link.href = window.URL.createObjectURL(blob);
      link.download = result.file;
      document.body.appendChild(link);
      link.click();
      alert("Downloaded");
    });
  } catch (error) {
    alert(error);
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 60*1000));
    window.location.href="/";
  }
});
