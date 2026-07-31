import "./FilterDropdown.css";
import { useStateContext } from "../contexts/StateContext";

//This Defines the list of categories to pull
const CategorieList = [
  'Slasher',
  'Supernatural',
  'Occult',
  'Zombie',
  'Psychological',
  'Body Horror',
  'Folk Horror',
];

function FilterDropdown() {
  const { subcategory, setSubcategory } = useStateContext();

  return (
    <nav className="FilterDropdown">
      <span className="FilterDropdown-label">Filter →</span>

      <div className="FilterDropdown-tabs">
        <button type="button" className="FilterDropdown-tab is-active" onClick={() => setSubcategory("")}>All</button>
        <button type="button" className="FilterDropdown-tab" onClick={() => setSubcategory("Slasher")}>Slasher</button>
        <button type="button" className="FilterDropdown-tab" onClick={() => setSubcategory("Supernatural")}>Supernatural</button>
        <button type="button" className="FilterDropdown-tab" onClick={() => setSubcategory("Occult")}>Occult</button>
        <button type="button" className="FilterDropdown-tab" onClick={() => setSubcategory("Zombie")}>Zombie</button>
        <button type="button" className="FilterDropdown-tab" onClick={() => setSubcategory("Psychological")}>Psychological</button>
        <button type="button" className="FilterDropdown-tab" onClick={() => setSubcategory("Body Horror")}>Body Horror</button>
        <button type="button" className="FilterDropdown-tab" onClick={() => setSubcategory("Folk Horror")}>Folk Horror</button>
      </div>
    </nav>
  );
}

export default FilterDropdown;