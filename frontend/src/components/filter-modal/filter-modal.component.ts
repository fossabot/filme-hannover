import html from './filter-modal.component.html?raw';
import css from './filter-modal.component.css?inline';
import CheckableButtonElement from '../checkable-button/checkable-button.component';
import SelectionListElement from '../selection-list/selection-list.component';
import Cinema from '../../models/Cinema';
import Movie from '../../models/Movie';
import { getAllShowTimeTypes, getShowTimeTypeByNumber, getShowTimeTypeLabelString, ShowTimeType } from '../../models/ShowTimeType';
import FilterIcon from '@material-symbols/svg-400/rounded/filter_alt.svg?raw'
import Check from '@material-symbols/svg-400/outlined/check.svg?raw'

const style = new CSSStyleSheet();
style.replaceSync(css);
const template = document.createElement('template');
template.innerHTML = html;

export default class FilterModal extends HTMLElement {
  public Cinemas: Cinema[] = [];
  public Movies: Movie[] = [];

  private SelectedCinemas: Cinema[] = [];
  private SelectedMovies: Movie[] = [];
  private SelectedShowTimeTypes: ShowTimeType[] = [];
  private shadow: ShadowRoot;

  public onFilterChanged?: (cinemas: Cinema[], movies: Movie[], showTimeTypes: ShowTimeType[]) => void;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  handleCinemaSelectionChanged(e: Event) {
    const target = e.target as CheckableButtonElement;
    if (!target.checked) {
      const cinema = this.Cinemas.find(c => c.id === parseInt(target.value));
      if (cinema) {
        this.SelectedCinemas.push(cinema);
      }
    } else {
      this.SelectedCinemas = this.SelectedCinemas.filter(c => c.id !== parseInt(target.value));
    }
  };

  handleShowTimeTypeSelected(e: Event) {
    const target = e.target as CheckableButtonElement;
    const showTimeType = getShowTimeTypeByNumber(parseInt(target.value));
    if (!target.checked) {
      this.SelectedShowTimeTypes.push(showTimeType);
    } else {
      this.SelectedShowTimeTypes = this.SelectedShowTimeTypes.filter(t => t !== showTimeType);
    }
  };

  connectedCallback() {
    this.shadow.appendChild(template.content.cloneNode(true));
    this.shadow.adoptedStyleSheets = [style];
    this.shadow.safeQuerySelector('#filter-edit-icon').innerHTML = FilterIcon;
    this.shadow.safeQuerySelector('#filter-apply-icon').innerHTML = Check;
    this.buildButtonEvents();
    this.SelectedCinemas = this.Cinemas;
    this.SelectedShowTimeTypes = getAllShowTimeTypes();
    const cinemaButtons: CheckableButtonElement[] = this.generateCinemaButtons();
    const showTimeTypeButtons: CheckableButtonElement[] = this.generateShowTimeTypeButtons();

    const movieList = SelectionListElement.BuildElement(this.Movies);
    movieList.onSelectionChanged = (movies: Movie[]) => {
      this.SelectedMovies = movies;
    }
    movieList.slot = 'movie-selection';
    this.append(...showTimeTypeButtons);
    this.append(...cinemaButtons);
    this.append(movieList);
  }

  private updateFilterInfo() {
    const cinemaCount = (this.SelectedCinemas.length === 0 || this.SelectedCinemas.length === this.Cinemas.length) ? 'Alle' : this.SelectedCinemas.length;
    const movieCount = (this.SelectedMovies.length === 0 || this.SelectedMovies.length === this.Movies.length) ? 'alle' : this.SelectedMovies.length;
    const filterInfo = this.shadow.safeQuerySelector('#filter-info');
    let showTimeTypeStringList = this.SelectedShowTimeTypes.map(t => getShowTimeTypeLabelString(t)).sort((a, b) => a.localeCompare(b)).join(', ');
    showTimeTypeStringList = (this.SelectedShowTimeTypes.length === 0 || this.SelectedShowTimeTypes.length == getAllShowTimeTypes().length) ? 'alle Vorführungen' : showTimeTypeStringList;
    const moviePluralSuffix = this.SelectedMovies.length === 1 ? '' : 'e';
    const cinemaPluralSuffix = this.SelectedCinemas.length === 1 ? '' : 's';
    filterInfo.textContent = `Aktueller Filter: ${cinemaCount.toString()} Kino${cinemaPluralSuffix}, ${movieCount.toString()} Film${moviePluralSuffix}, ${showTimeTypeStringList}`;
  }

  private buildButtonEvents() {
    const openFilterDialogButtonEl = this.shadow.safeQuerySelector('#open-filter');
    const applyFilterDialogButtonEl = this.shadow.safeQuerySelector('#apply-filter');
    const dialogEl = this.shadow.safeQuerySelector('#filter-dialog') as HTMLDialogElement;
    this.updateFilterInfo();
    openFilterDialogButtonEl.addEventListener('click', () => {
      dialogEl.showModal();
    });
    applyFilterDialogButtonEl.addEventListener('click', () => {
      if (this.onFilterChanged) {
        this.onFilterChanged(this.SelectedCinemas, this.SelectedMovies, this.SelectedShowTimeTypes);
        this.updateFilterInfo();
      }
      dialogEl.close();
    });
    dialogEl.addEventListener('click', (event: Event) => {
      const rect = dialogEl.getBoundingClientRect();
      const mouseEvent = event as MouseEvent
      const isInDialog = (rect.top <= mouseEvent.clientY && mouseEvent.clientY <= rect.top + rect.height
        && rect.left <= mouseEvent.clientX && mouseEvent.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        dialogEl.close();
      }
    });
  }

  private generateCinemaButtons() {
    const cinemaButtons: CheckableButtonElement[] = [];
    this.Cinemas.forEach(cinema => {
      const cinemaButton = new CheckableButtonElement();
      cinemaButton.slot = 'cinema-selection';
      cinemaButton.setAttribute('label', cinema.displayName);
      cinemaButton.setAttribute('value', cinema.id.toString());
      cinemaButton.setAttribute('color', cinema.color);
      cinemaButton.setAttribute('checked', '');
      cinemaButton.addEventListener('click', this.handleCinemaSelectionChanged.bind(this));
      cinemaButtons.push(cinemaButton);
    });
    return cinemaButtons;
  }

  private generateShowTimeTypeButtons() {
    const showTimeTypeButtons: CheckableButtonElement[] = [];
    const showTimeTypes: ShowTimeType[] = [ShowTimeType.Regular, ShowTimeType.Subtitled, ShowTimeType.OriginalVersion];
    showTimeTypes.forEach(showTimeType => {
      const showTimeTypeButton = new CheckableButtonElement();
      showTimeTypeButton.slot = 'type-selection';
      showTimeTypeButton.setAttribute('label', getShowTimeTypeLabelString(showTimeType));
      showTimeTypeButton.setAttribute('value', showTimeType.valueOf().toString());
      showTimeTypeButton.setAttribute('checked', '');
      showTimeTypeButton.addEventListener('click', this.handleShowTimeTypeSelected.bind(this));
      showTimeTypeButtons.push(showTimeTypeButton);
    });
    return showTimeTypeButtons
  }

  public static BuildElement(Cinemas: Cinema[], Movies: Movie[]): FilterModal {
    const item = new FilterModal();
    item.Cinemas = Cinemas;
    item.Movies = Movies;
    return item;
  }
}

customElements.define('filter-modal', FilterModal);
