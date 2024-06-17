import html from './day-list.component.html?inline';
import css from './day-list.component.css?inline';
import { EventData } from "../../models/EventData";
import EventItem from '../event-item/event-item.component';
import { SlotSpanFactory } from '../component-helpers';

const style = new CSSStyleSheet();
style.replaceSync(css);
const template = document.createElement('template');
template.innerHTML = html;

export default class DayListElement extends HTMLElement {

  static get observedAttributes() {
    return ['date'];
  }

  public EventData: EventData[] = [];

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
    shadow.adoptedStyleSheets = [style];
  }

  connectedCallback() {
    const header = this.shadowRoot?.querySelector('.header') as HTMLElement;
    if (header) {
      header.textContent = this.getAttribute('date') || '';
    }
  }

  static BuildElement(date: Date, events: EventData[]) {
    const isToday = new Date().toDateString() === date.toDateString();
    const dateString = date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const item = new DayListElement();
    item.setAttribute('date', dateString);
    item.EventData = events;
    if (isToday) {
      item.classList.add('today');
    }
    let eventCumulativeDuration = 0;
    events.forEach(element => {
      const eventItem = EventItem.BuildElement(element);
      eventItem.slot = 'body';
      item.appendChild(eventItem);
      const runtime = element.runtime ?? 120;
      eventCumulativeDuration = +runtime;
    });
    const eventHours = eventCumulativeDuration / 60;
    const footerText = `${events.length} Vorführungen, ca. ${eventHours.toString()} h`;
    const footerSpan = SlotSpanFactory(footerText, 'footer');
    footerSpan.slot = 'footer';
    item.appendChild(footerSpan);

    return item;
  }
}

customElements.define('day-list', DayListElement);
