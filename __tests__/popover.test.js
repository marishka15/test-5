import { Popover } from "../src/js/popover";

describe("Popover widget", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="container">
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="popover"
          data-title="Popover title"
          data-content="And here's some amazing content. It's very engaging. Right?"
          data-placement="top"
        >
          Click to toggle popover
        </button>
      </div>
    `;
  });

  test("should show popover on toggle", () => {
    const button = document.querySelector('[data-toggle="popover"]');

    button.getBoundingClientRect = jest.fn(() => ({
      left: 100,
      top: 200,
      width: 160,
      height: 40,
      right: 260,
      bottom: 240,
    }));

    const popover = new Popover(button);

    popover.popoverElement.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      right: 200,
      bottom: 100,
    }));

    popover.toggle();

    const popoverEl = document.querySelector(".popover");

    expect(popoverEl).not.toBeNull();
    expect(popoverEl.querySelector(".popover-header").textContent).toBe(
      "Popover title",
    );
    expect(popoverEl.querySelector(".popover-body").textContent).toBe(
      "And here's some amazing content. It's very engaging. Right?",
    );
    expect(popoverEl.style.display).toBe("block");
    expect(popoverEl.style.left).toBe("80px");
    expect(popoverEl.style.top).toBe("90px");
  });

  test("should hide popover on second toggle", () => {
    const button = document.querySelector('[data-toggle="popover"]');

    button.getBoundingClientRect = jest.fn(() => ({
      left: 100,
      top: 200,
      width: 160,
      height: 40,
      right: 260,
      bottom: 240,
    }));

    const popover = new Popover(button);

    popover.popoverElement.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      right: 200,
      bottom: 100,
    }));

    popover.toggle();
    popover.toggle();

    const popoverEl = document.querySelector(".popover");

    expect(popoverEl).not.toBeNull();
    expect(popoverEl.style.display).toBe("none");
  });
});
