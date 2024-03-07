import React, {useState, useEffect} from 'react'


import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Container, Card, Button, Form, Dropdown, ProgressBar, Accordion, Navbar} from 'react-bootstrap';

function NavHeader() {
  return (
    <Navbar>
      <Navbar.Brand href="#home">Goalzilla</Navbar.Brand>
    </Navbar>
  );
}


function LevelListDisplay(){
  // Levels can either be completed in random order or in sequence - make this an attribute
  return (
    <Container>
      <Row>
        <Col><h3>Quests</h3></Col>
      </Row>
      <Row>
        <Col>
          <Accordion>
            <Accordion.Item>
              <Accordion.Header>Placeholder</Accordion.Header>
              <Accordion.Body>
                Some Placeholder Detail
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
      
    </Container>
  )
}


function GoalTrackDisplay({journeyIdx, removeJourney}){
  const [data, setData] = useState([{}])

  useEffect(() => {
    fetch('/journeyDetails?index='+journeyIdx).then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [journeyIdx])
  

  return (
    <Container fluid="sm">
      <Row fluid>
        <Col sm={11}><h1>{data.journeyName}</h1></Col>
        <Col>
          <Dropdown>
            <Dropdown.Toggle></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Edit Details</Dropdown.Item>
              <Dropdown.Item onClick={() => removeJourney(journeyIdx)}>Remove</Dropdown.Item>
              <Dropdown.Item>Set Active</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
                {data.journeyDetail}
            </Card.Body>
          </Card>
        </Col>
        <Col>
        <Card>
          <Card.Body>
            <Card.Title>Quests Completed</Card.Title>
            <Card.Title>{data.questsComplete}/{data.totalQuests}</Card.Title>
          </Card.Body>
        </Card>
        </Col>
      </Row>
      <Row>
        <Col><ProgressBar now={data.progress} label={`${data.progress}%`}/></Col>
      </Row>

      <Row>
        <LevelListDisplay/>
      </Row>
    </Container>
  )

}


function NewGoalForm({addNewGoal}){
  // For editing 
  const [goalName, setGoalName] = useState('')
  const [description, setDescription] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault();
    addNewGoal(goalName, description);
    setGoalName('');
  };
  return (
    <Container className="text-center my-5">
        <Card>
            <Card.Body>
                <Card.Title>New Journey!</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>Journey Name</Form.Label>
                    <Form.Control onChange={(e) => setGoalName(e.target.value)} placeholder="Enter name here"/>
                    <Form.Label>Journey Description</Form.Label>
                    <Form.Control onChange={(e) => setDescription(e.target.value)} placeholder="Enter a quick description here"/>
                  </Form.Group>
                  <br/>
                  <Button variant="light" type="submit">Submit</Button>
                </Form>
            </Card.Body>
        </Card>
    </Container>
  )
}

function App(){
  const [data, setData] = useState([{}])
  const [showNewGoalForm, setShowNewGoalForm] = useState(false)
  const [showGoalTrack, setShowGoalTrack] = useState(false)
  const [goalTrackId, setGoalTrackId] = useState(null)

  useEffect(() => {
    fetch('/goals').then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])

  const toggleGoalForm = () => {
    setShowNewGoalForm((prev) => !prev);
    setShowGoalTrack(false);
  };
  const displayGoalTrack = (index) => {
    setGoalTrackId(index)
    setShowGoalTrack(true);
    setShowNewGoalForm(false);
  };

  const removeJourney = (index) => {
    console.log("removing")
    fetch('/remove_journey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "index": index}),
    }).then((res) => res.text())
    .then((message) => {
      console.log(message);
      // Refresh the list of members after adding a new member
      fetch('/goals')
        .then((res) => res.json())
        .then((data) => {
          setData(data);
        });
    });
    setGoalTrackId(goalTrackId < 0 ? 0 : goalTrackId - 1);
  }

  const addNewGoal = (goalName, description) => {
    // Add new member to the list
    fetch('/add_goal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "name": goalName, "description":description}),
    })
      .then((res) => res.text())
      .then((message) => {
        console.log(message);
        // Refresh the list of members after adding a new member
        fetch('/goals')
          .then((res) => res.json())
          .then((data) => {
            setData(data);
          });
      });
      toggleGoalForm()
  };
  console.log(data.goals?.length)
  return (   
      <Container>
        <NavHeader/>
        <Row>
          <Col sm={3}>
            <Row>
              <Col sm={9}><h3>Journeys</h3></Col>
              <Col><Button variant="light" onClick={toggleGoalForm}>+</Button></Col>
            </Row>
            
            <ListGroup>
              {(typeof data.goals === "undefined") ? (
                  <p>Loading...</p>
                ) : (
                    data.goals.map((name, i) => (
                      <ListGroup.Item key={i} onClick={()=>displayGoalTrack(i)}>{name}</ListGroup.Item>
                    ))
              )}
            </ListGroup>
          </Col>

          <Col>
            {showNewGoalForm && <NewGoalForm addNewGoal={addNewGoal}/>}
            {data.goals?.length > 0 && showGoalTrack && <GoalTrackDisplay journeyIdx={goalTrackId} removeJourney={removeJourney} />}
          </Col>

        </Row>
      </Container>    
    )
}

export default App