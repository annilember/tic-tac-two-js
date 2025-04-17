export class Timer {
    #timer;
    #intervalId;

    constructor() {
        this.#timer = document.createElement("h3");
        this.#timer.classList.add("timer");
    };

    start() {
        this.#timer.innerHTML = "0s";
        let seconds = 0;

        this.#intervalId = setInterval(() => {
            seconds++;
            let h = Math.floor(seconds / 3600);
            let min = Math.floor((seconds % 3600) / 60);
            let s = (seconds % 3600) % 60;
            let time = seconds >= 3600 ? `${h}h ` : "";
            time += seconds >= 60 ? `${min}min ${s}s` : `${s}s`
            this.#timer.innerHTML = time;
        }, 1000);
    }
    
    stop() {
        clearInterval(this.#intervalId);
    }

    get element() {
        return this.#timer;
    }
}
