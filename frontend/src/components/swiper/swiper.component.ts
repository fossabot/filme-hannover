import html from "./swiper.component.html?raw";
import css from "./swiper.component.css?inline";
import noContentHtml from "../no-content/no-content.component.html?raw";
import { ScrollSnapDraggable, ScrollSnapSlider } from "scroll-snap-slider";

const style = new CSSStyleSheet();
style.replaceSync(css);
const template = document.createElement("template");
template.innerHTML = html;
const noResultsElement = document.createElement("div");
noResultsElement.innerHTML = noContentHtml;

export default class Swiper extends HTMLElement {

  private scrollSnapSlider: ScrollSnapSlider | null = null;
  private scrollSnapSliderEl: HTMLElement | null = null;
  private triggeredScrollThreshold = false;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    this.scrollSnapSliderEl = shadow.querySelector(".scroll-snap-slider");
    shadow.appendChild(template.content.cloneNode(true));
    shadow.adoptedStyleSheets = [style];
    if (!this.scrollSnapSliderEl) {
      throw new Error(".scroll-snap-slider element not found");
    }
    this.scrollSnapSlider = new ScrollSnapSlider({
      element: this.scrollSnapSliderEl,
      sizingMethod(slider) {
        if (slider.element.firstElementChild) {
          return slider.element.firstElementChild.clientWidth;
        }
        return 0;
      }
    }).with([
      new ScrollSnapDraggable
    ]);
    this.removeAllSlides();

    // Detect if the user has swiped to the last page and load more data
    this.scrollSnapSliderEl.addEventListener("scroll", () => {
      if (this.triggeredScrollThreshold) {
        return;
      }
      if (this.scrollSnapSliderEl.scrollLeft + this.scrollSnapSliderEl.clientWidth >= (this.scrollSnapSliderEl.scrollWidth / 2)) {
        this.triggeredScrollThreshold = true;
        this.dispatchEvent(new CustomEvent("scroll-threshold-reached", { bubbles: true }));
      }
    });
  }

  disconnectedCallback() { }

  public appendSlide(slide: HTMLElement): void {
    slide.slot = "slides";
    slide.classList.add("scroll-snap-slide");
    this.scrollSnapSliderEl.appendChild(slide);
    this.triggeredScrollThreshold = false;
  }

  public removeAllSlides(): void {
    this.scrollSnapSliderEl.replaceChildren();
  }

  public displayNoResults(): void {
    this.scrollSnapSliderEl.replaceChildren(noResultsElement);
  }

  public replaceSlides(slides: HTMLElement[]): void {
    slides.forEach((slide) => {
      slide.slot = "slides";
      slide.classList.add("scroll-snap-slide");
    });
    this.scrollSnapSliderEl.replaceChildren(...slides);
    this.scrollSnapSlider.slideTo(0);
  }

  public static BuildElement(): Swiper {
    const item = new Swiper();
    return item;
  }
}

customElements.define("swiper-element", Swiper);
