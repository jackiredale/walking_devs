import "./FilterDropdown.css";

//This Defines the list of categories to pull
const CategorieList = [
  'Silent Era',
  'Slasher',
  'Supernatural',
  'Occult',
  'Zombie',
  'Psychological',
  'Body Horror',
  'Folk Horror',
];

function FilterDropdown() {
  return (
    <nav className="FilterDropdown">
      <span className="FilterDropdown-label">Filter →</span>

      <div className="FilterDropdown-tabs">
        <button type="button" className="FilterDropdown-tab is-active">All</button>
        <button type="button" className="FilterDropdown-tab">Silent Era</button>
        <button type="button" className="FilterDropdown-tab">Slasher</button>
        <button type="button" className="FilterDropdown-tab">Supernatural</button>
        <button type="button" className="FilterDropdown-tab">Occult</button>
        <button type="button" className="FilterDropdown-tab">Zombie</button>
        <button type="button" className="FilterDropdown-tab">Psychological</button>
        <button type="button" className="FilterDropdown-tab">Body Horror</button>
        <button type="button" className="FilterDropdown-tab">Folk Horror</button>
      </div>
    </nav>
  );
}

export default FilterDropdown;