function showMainMenu() {
    let canvas = createDiv("");
    canvas.id("main-menu");
    canvas.class("menu");
    let playButton = createButton('Play');
    playButton.parent(canvas);
    playButton.mousePressed(() => {
        playGame();
        canvas.remove();
    });

    let scoreButton = createButton('Scores');
    scoreButton.parent(canvas);
    scoreButton.mousePressed(() => {
        showScoreBoard();
        canvas.remove();
    });

    let settingsButton = createButton('Settings');
    settingsButton.parent(canvas);
    settingsButton.mousePressed(() => {
        showSettingsMenu();
        canvas.remove();
    })

    let aboutButton = createButton('About');
    aboutButton.parent(canvas);
    aboutButton.mousePressed(() => {
        showAboutMenu();
        canvas.remove();
    })
}

function showAboutMenu() {
    const canvas = createDiv(`<h4 class="glow">About</h4>`);
    canvas.id("about-menu");
    canvas.class("menu");
    let aboutText = createDiv(`<p>Made with ♥️️ by</p>`);
    aboutText.parent(canvas);
    let aboutList = createDiv(`<ul> 
                                <li>Bogdan Dumitrescu</li>
                                <li>Daniel Jones</li>
                                <li>Tymoteusz Suszczynski</li>
                            </ul>`);
    aboutList.parent(canvas);
    let aboutDetails = createDiv(`<p>University of Bristol, UoBxEWB Game Jam 2020</p>`);
    aboutDetails.parent(canvas);
    let aboutMusic = createDiv(`<p>Music: Ocean Shores</p>`);
    aboutMusic.parent(canvas);

    let backButton = createButton(`Back`);
    backButton.class("back-button");
    backButton.parent(canvas);
    backButton.mousePressed(() => {
        showMainMenu();
        canvas.remove();
    })
    backButton.parent(canvas);
}

function showSettingsMenu() {
    const canvas = createDiv(`<h4 class="glow">Settings</h4>`);
    canvas.id("settings-menu");
    canvas.class("menu");

    let volumeText = createDiv(`<p>Volume</p>`);
    volumeText.parent(canvas);
    volumeText.id('volume');
    volumeSlider.parent(volumeText);
    volumeSlider.show();
    volumeSlider.mousePressed(() =>{
        music.setVolume(volumeSlider.value());
    });

    let darkMode = createCheckbox('Dark Mode', true);
    darkMode.parent(canvas);
    darkMode.id("dark-check");
    darkMode.changed((e) => {
        if (e.target.checked) {                
            document.getElementsByTagName("body")[0].classList.remove('light');
        } else {
            document.getElementsByTagName("body")[0].classList.add('light');
        }
    });

    let backButton = createButton(`Back`);
    backButton.class("back-button");
    backButton.parent(canvas);
    backButton.mousePressed(() => {
        showMainMenu();
        volumeSlider.hide();
        canvas.remove();
    })
    backButton.parent(canvas);
}