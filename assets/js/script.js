const venue = document.querySelector("#venue");
const nameConf = document.querySelector("#name");
const tagline = document.querySelector("#tagline");


document.addEventListener("DOMContentLoaded", async (_) => {
    resp = await fetch("/intro");
    const intro = await resp.json()
    venue.innerText = intro.venue;
    nameConf.innerText = intro.name;
    tagline.innerText = intro.tagline;
})