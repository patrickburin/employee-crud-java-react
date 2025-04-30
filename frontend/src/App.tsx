import Table from "./Table";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <Table />
      <ToastContainer />
    </>
  );
}

export default App;
