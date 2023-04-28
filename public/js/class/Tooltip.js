
export class Tooltip {
    constructor(element, message) {
        this.element = element;
        this.message = message;
        this.tooltip = null;
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.element.addEventListener("mouseenter", this.handleMouseEnter);
        this.element.addEventListener("mouseleave", this.handleMouseLeave);
        this.element.addEventListener("mousemove", this.handleMouseMove);
    }

    handleMouseEnter() {
        console.log(this.message.length)
        this.tooltip = document.createElement("div");
        //   this.tooltip.innerHTML = this.message;
        // console.log(this.tooltip.innerHTML)
        // this.tooltip.style.heigth = "80px";
        this.tooltip.classList.add('tool')
        this.tooltip.style.position = "absolute";
        this.tooltip.style.top = "0";
        this.tooltip.style.left = "0";
        this.tooltip.style.backgroundColor = "white";
        this.tooltip.style.color = "black";
        this.tooltip.style.padding = "5px";
        this.tooltip.style.zIndex = 99999
        document.body.appendChild(this.tooltip);
        console.log(this.tooltip)
        this.message.forEach(el => {
            this.tooltipLow = document.createElement("div");
            this.tooltip.appendChild(this.tooltipLow);
            this.tooltipLow.textContent = el
        });

    }

    handleMouseLeave() {
        if (this.tooltip) {
            document.body.removeChild(this.tooltip);
            this.tooltip = null;
        }
    }

    handleMouseMove(event) {
        if (this.tooltip) {
            this.tooltip.style.top = event.pageY + 20 + "px";
            this.tooltip.style.left = event.pageX + 20 + "px";
        }
    }
}

/*
// Example usage
const button = document.querySelector("button");
const tooltip = new Tooltip(button, "Click me");
*/



/*
// Example with dynamic message
const input = document.querySelector("input");
const dynamicTooltip = new Tooltip(input, "");
input.addEventListener("input", () => {
    dynamicTooltip.message = input.value;
});*/