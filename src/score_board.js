function showScoreBoard() {
    let canvas = createDiv("Loading...");
    canvas.id("score-board");
    console.log(canvas);
    fetch("https://vibe.danjones.dev/api/getScores")
    .then(response => {
        if (response.status === 200) {
            response.json().then(r => {
                let lis = r.reduce((ans, a) => ans + `<li><span>${a.name}</span><span>${a.score}</span></li>`, "")
                canvas.html(`<h4 class="glow">Scores</h4>
                    <ul>${lis}</ul>
                    <a href="#" id="back">BACK</a>`
                );
            }).catch(e => canvas.html("Error..."));
        } else {
            canvas.html("Error...");
        }
    }).catch(error => canvas.html("Error..."));
}