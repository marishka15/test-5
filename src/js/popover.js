import "../css/styles.css";

export class Popover {
  constructor(element) {
    this.element = element;
    this.popoverElement = null;
    this.isVisible = false;

    this.title = element.getAttribute("data-title") || "";
    this.content = element.getAttribute("data-content") || "";
    this.placement = element.getAttribute("data-placement") || "top";
    this.trigger = element.getAttribute("data-trigger") || "click";

    this.init();
  }

  init() {
    if (!this.title && !this.content) return;

    this.createPopover();

    this.bindEvents();
  }

  createPopover() {
    const popover = document.createElement("div");
    popover.className = `popover ${this.placement}`;
    popover.innerHTML = `
            <div class="arrow"></div>
            <h3 class="popover-header">${this.title}</h3>
            <div class="popover-body">${this.content}</div>
        `;

    document.body.append(popover);
    this.popoverElement = popover;
  }

  bindEvents() {
    if (this.trigger === "click" || !this.trigger) {
      this.element.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggle();
      });
    } else if (this.trigger === "hover") {
      this.element.addEventListener("mouseenter", () => this.show());
      this.element.addEventListener("mouseleave", () => this.hide());
    } else if (this.trigger === "focus") {
      this.element.addEventListener("focus", () => this.show());
      this.element.addEventListener("blur", () => this.hide());
    }

    document.addEventListener("click", (e) => {
      if (
        this.isVisible &&
        !this.popoverElement.contains(e.target) &&
        e.target !== this.element
      ) {
        this.hide();
      }
    });
  }

  show() {
    if (this.isVisible) return;

    this.popoverElement.style.display = "block";
    this.isVisible = true;

    this.positionPopover();
  }

  hide() {
    if (!this.isVisible) return;

    this.popoverElement.style.display = "none";
    this.isVisible = false;
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  positionPopover() {
    const elementRect = this.element.getBoundingClientRect();
    const popoverRect = this.popoverElement.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (this.placement) {
      case "top":
        top = elementRect.top - popoverRect.height - 10;
        left = elementRect.left + elementRect.width / 2 - popoverRect.width / 2;
        break;
      case "right":
        top = elementRect.top + elementRect.height / 2 - popoverRect.height / 2;
        left = elementRect.right + 10;
        break;
      case "bottom":
        top = elementRect.bottom + 10;
        left = elementRect.left + elementRect.width / 2 - popoverRect.width / 2;
        break;
      case "left":
        top = elementRect.top + elementRect.height / 2 - popoverRect.height / 2;
        left = elementRect.left - popoverRect.width - 10;
        break;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 0) left = 0;
    if (left + popoverRect.width > viewportWidth)
      left = viewportWidth - popoverRect.width;
    if (top < 0) top = 0;
    if (top + popoverRect.height > viewportHeight)
      top = viewportHeight - popoverRect.height;

    this.popoverElement.style.top = `${top}px`;
    this.popoverElement.style.left = `${left}px`;
  }
}

export function initPopovers() {
  document.querySelectorAll('[data-toggle="popover"]').forEach((el) => {
    new Popover(el);
  });
}
