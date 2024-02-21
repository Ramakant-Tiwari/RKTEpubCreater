try {
  const url = formElement.querySelector("#url").value;
  const response = await fetch("/generate-epub?url=" + url);
  if (!response.ok) {
    throw new Error("Wrong URL Error. Please Re-enter");
  }
  const epub = await response.text();

  let i = 10;
  while (true) {
    await new Promise(resolve => setTimeout(resolve, i * 1000));
    const response = await fetch("/check-status?epub=" + epub);
    const epubGenerated = await response.text();

    if (epubGenerated) {
      await fetch("/download-epub?epub=" + epub);
      document.querySelector("#loader-container .disabled").classList.remove("disabled");
      window.location.href = "/";
      break;
    }

    i += 10;
  }
} catch (error) {
  alert(error);
}