
export class Tooltip {
    constructor(element, message) {
        console.log(element, message)
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
        const tool = document.querySelectorAll('.tool')
        if (tool) {
            tool.forEach(e => {
                e.remove()
            })
        }
        this.tooltip = document.createElement("div");
        this.tooltip.classList.add('tool')
        this.tooltip.style.position = "absolute";
        this.tooltip.style.top = "0";
        this.tooltip.style.left = "0";
        this.tooltip.style.backgroundColor = "white";
        this.tooltip.style.color = "black";
        this.tooltip.style.padding = "5px";
        this.tooltip.style.zIndex = 99999;
        document.body.appendChild(this.tooltip);
        this.message.forEach(el => {
            this.tooltipLow = document.createElement("div");
            this.tooltip.appendChild(this.tooltipLow);
            this.tooltipLow.textContent = el
        });
    }
    handleMouseLeave() {
        const tool = document.querySelectorAll('.tool')
        if (tool) {
            tool.forEach(e => {
                e.remove()
            })
            this.tooltip = null;
        }
    }
    handleMouseMove(event) {
        if (this.tooltip) {
            this.tooltip.style.top = event.pageY + 20 + "px";
            this.tooltip.style.left = event.pageX + 20 + "px";
        }
    }
    setMessage(message) {
        this.message = message;
        if (this.tooltip) {
            this.tooltip.textContent = message;
        }
    }
}

