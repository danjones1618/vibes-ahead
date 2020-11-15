function showScoreBoard() {
    const canvas = createDiv("");
    canvas.id("score-board");
    canvas.class("menu");
    fetch("https://vibes.danjones.dev/api/getScores")
    .then(response => {
        if (response.status === 200) {
            response.json().then(r => {
                let lis = r.reduce((ans, a) => ans + `<li><span>${a.name}</span><span>${a.score}</span></li>`, "")
                canvas.html(`<h4 class="glow">Scores</h4><ul>${lis}</ul>`);
                const backBtn = createButton("back");
                backBtn.class("back-button");
                backBtn.mousePressed(() => {
                    showMainMenu();
                    canvas.remove();
                });
                backBtn.parent(canvas);
            }).catch(e => canvas.html("Error..."));
        } else {
            canvas.html("Error...");
        }
    }).catch(error => canvas.html("Error..."));
}

function showSubmitScore(score) {
    const canvas = createDiv(`<h4 class="glow">${score}</h4>`);
    canvas.id("send-score");
    canvas.class("menu");
    const inputContainer = createDiv("");

    inputContainer.id("inp-container");
    inputContainer.parent(canvas);

    const maxChars = 3;
    let inputs = [];
    for (let i = 0; i < maxChars; i++) {
        const inp = createInput("", "text");
        inp.class("letter-inp");
        inp.parent(inputContainer);
        inp.attribute('maxlength','1');
        inp.attribute('size','1');
        inputs.push(inp);
    }

    const submitButton = createButton("submit");
    submitButton.parent(canvas);
    submitButton.class("back-button");
    submitButton.mousePressed(() => {
        const name = inputs.reduce((ans, x) => ans + x.value(), "");
        /*if (name.length !== maxChars){
            alert("You must have a 3 character name");
            return;
        }*/

        fetch("https://vibes.danjones.dev/api/saveScore", {
            method: 'POST',
            headers: {
                'Accept': 'Application/JSON',
                'Content-Type': 'Application/JSON;charset=UTF-8',
            },
            body: JSON.stringify({
                name: name,
                score: score,
            }),
        }).then(response => {
            if (response.status === 200) {
                showMainMenu();
                canvas.remove();
            } else alert("Error: try again");
        }).catch(error => alert("Error: try again"));
    });

    for (let i = 0; i < maxChars; i++) {
        if (i === maxChars - 1)
           inputs[i].elt.onkeypress = (e) => e.code === "Enter" ? null : submitButton.elt.focus(); 
        else
            inputs[i].elt.onkeypress = (e) => e.code === "Enter" ? null : inputs[i+1].elt.focus();

        if ( i > 0)
            inputs[i].elt.onkeydown = (e) =>
                e.code === "Backspace"
                ? inputs[i-1].elt.focus()
                : null;
    }

    const menuButton = createButton("main menu");
    menuButton.parent(canvas);
    menuButton.class("back-button");
    menuButton.mousePressed(() => {
        showMainMenu();
        canvas.remove();
    });

    inputs[0].elt.focus();
}