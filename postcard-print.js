async function printTrailPostcards(walk, getPlace, button) {
  const sheets = document.getElementById("postcard-print");
  const preview = document.getElementById("postcard-preview");
  button.disabled = true;
  button.textContent = "正在准备明信片…";
  try {
    const cards = await Promise.all(walk.ids.map(async (id, index) => {
      const place = getPlace(id);
      const clue = trailClues[id];
      const image = await loadImage(place.oldPhoto);
      const number = String(index + 1).padStart(2, "0");
      const pair = document.createElement("div");
      pair.innerHTML = `
        <article class="postcard-side postcard-front" aria-label="${place.cn}明信片正面">
          <header><b>姑苏寻影</b><span>GUSU FIELD NOTES · ${walk.number} / ${number}</span></header>
          <figure><figcaption>${place.oldCredit}</figcaption></figure>
          <footer><strong>${place.cn}</strong><span>${walk.name}</span></footer>
        </article>
        <article class="postcard-side postcard-back" aria-label="${place.cn}明信片背面">
          <header><b>姑苏寻影 · 现场手记</b><span>第 ${number} 站 / ${walk.ids.length}</span></header>
          <div class="postcard-back-grid">
            <div><small>${place.cn} · ${clue.type}</small><h2>${clue.title}</h2><p>${clue.prompt}</p>
              <p class="postcard-writing">我对齐的一处 <span></span></p>
              <p class="postcard-writing">今天看到的变化 <span></span></p>
            </div>
            <div class="postcard-scan-guide">
              <b>姑苏<br>寻影</b><p>先抬头对照。打开本站「AR 扫明信片」，对准正面旧照，展开纸上场景。</p>
              <p class="postcard-url">qile2323.github.io/GusuGusu/</p>
            </div>
          </div>
          <footer><span>${walk.area}</span><span>${place.oldCredit}</span></footer>
        </article>`;
      image.alt = place.cn + "历史照片";
      pair.querySelector("figure").prepend(image);
      return [...pair.children];
    }));
    if (!button.isConnected || preview.open) return;
    sheets.replaceChildren(...cards.flat());
    document.getElementById("postcard-preview-title").textContent = walk.name + " · 明信片";
    document.getElementById("postcard-preview-note").textContent = `预览第 1 站的正反面。整套共 ${cards.length} 张明信片。`;
    document.getElementById("postcard-demo").dataset.postcardDemo = walk.ids[0];
    document.getElementById("postcard-preview-pages").replaceChildren(...cards[0].map(side => side.cloneNode(true)));
    preview.showModal();
  } catch {
    document.body.classList.remove("printing-postcards");
    sheets.replaceChildren();
    button.textContent = "准备失败，点此重试";
    return;
  } finally {
    button.disabled = false;
    if (button.textContent !== "准备失败，点此重试") button.textContent = "打印路线明信片";
  }
}

document.getElementById("postcard-print-all").addEventListener("click", () => {
  document.body.classList.add("printing-postcards");
  try {
    window.print();
  } catch {
    document.body.classList.remove("printing-postcards");
  }
});

document.getElementById("postcard-preview").addEventListener("close", () => {
  document.body.classList.remove("printing-postcards");
  document.getElementById("postcard-preview-pages").replaceChildren();
  document.getElementById("postcard-print").replaceChildren();
});

window.addEventListener("afterprint", () => {
  document.body.classList.remove("printing-postcards");
});
