import { Container, Navbar} from 'react-bootstrap';
import {QuestDisplay} from './Quest';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Journeys from './Journeys';

function NavHeader() {
  return (
    <Navbar>
      <Navbar.Brand href="/">Goalzilla</Navbar.Brand>
    </Navbar>
  );
}
function App(){
  return (
    <Router>
      <Container>
        <NavHeader/>
        <Routes>
          <Route path='/' element={<Journeys/>}/>
          <Route path="/quest" element={<QuestDisplay/>} />
        </Routes>
      </Container>   
    </Router>
    )
}

export default App