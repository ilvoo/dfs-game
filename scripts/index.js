let game = null;

const forms = document.forms;
const gameSettingsForm = forms.namedItem("gameSettings");

gameSettingsForm.onsubmit = (event) => {
  event.preventDefault();
  game = null;
  
  const fields = event.target.elements;

  const columns = +fields.namedItem("columns").value;
  const rows = +fields.namedItem("columns").value;

  game = new Game(columns, rows);
};
