import "./FilterDropdown.css";
import { useStateContext } from "../contexts/StateContext";

//This Defines the list of categories to pull
// const CategorieList = [
//   'Slasher',
//   'Supernatural',
//   'Occult',
//   'Zombie',
//   'Psychological',
//   'Body Horror',
//   'Folk Horror',
// ];

function FilterDropdown() {
  const { subcategory, setSubcategory, resetFilters } = useStateContext();

  return (
    <nav className="FilterDropdown">
      <span className="FilterDropdown-label">Filter →</span>

      <div className="FilterDropdown-tabs">
        <button type="button" className={`FilterDropdown-tab ${!subcategory ? "is-active" : ""}`} onClick={resetFilters}>All</button>
        <button type="button" className={`FilterDropdown-tab ${subcategory === "Slasher" ? "is-active" : ""}`} onClick={() => setSubcategory("Slasher")}>Slasher</button>
        <button type="button" className={`FilterDropdown-tab ${subcategory === "Supernatural" ? "is-active" : ""}`} onClick={() => setSubcategory("Supernatural")}>Supernatural</button>
        <button type="button" className={`FilterDropdown-tab ${subcategory === "Occult" ? "is-active" : ""}`} onClick={() => setSubcategory("Occult")}>Occult</button>
        <button type="button" className={`FilterDropdown-tab ${subcategory === "Zombie" ? "is-active" : ""}`} onClick={() => setSubcategory("Zombie")}>Zombie</button>
        <button type="button" className={`FilterDropdown-tab ${subcategory === "Psychological" ? "is-active" : ""}`} onClick={() => setSubcategory("Psychological")}>Psychological</button>
        <button type="button" className={`FilterDropdown-tab ${subcategory === "Body Horror" ? "is-active" : ""}`} onClick={() => setSubcategory("Body Horror")}>Body Horror</button>
        <button type="button" className={`FilterDropdown-tab ${subcategory === "Folk Horror" ? "is-active" : ""}`} onClick={() => setSubcategory("Folk Horror")}>Folk Horror</button>
      </div>
    </nav>
  );
}

export default FilterDropdown;