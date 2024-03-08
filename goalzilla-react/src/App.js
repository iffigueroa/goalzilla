import React, {useState, useEffect} from 'react'


import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Alert, Container, Card, Button, Form, Dropdown, ProgressBar, Navbar} from 'react-bootstrap';

function NavHeader() {
  return (
    <Navbar>
      <Navbar.Brand href="#home">Goalzilla</Navbar.Brand>
    </Navbar>
  );
}

function LevelListDisplay(){
  // const questData = ["test", 'Test', 'test']
  const questData = ["test", 'Test', 'test', "test", 'Test', 'test']
  // const questData = null

  // Levels can either be completed in random order or in sequence - make this an attribute
  return (
    <Container fluid>
      <Row>
        <Col sm={10}><h3>Quests</h3></Col>
        <Col><Button disabled variant='light'>New</Button></Col>
      </Row>
      <Row>
        {(questData === null) ? (
            <Alert variant='light'>
              No quests available. Add some to get started.
            </Alert>
          ) : (
              questData.map((name, i) => (
                <Col sm={4} key={i} className="py-2">
                  <Card >
                    {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                    <Card.Body>
                      <Card.Title>{name}</Card.Title>
                      <Card.Text>
                        Some quick example text to build on the card title and make up the
                        bulk of the card's content.
                      </Card.Text>
                      <Button variant="primary">Start Quest</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
        )}
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
      <Row >
        <Col sm={11}><h1>{data.journeyName}</h1></Col>
        <Col>
          <Dropdown>
            <Dropdown.Toggle></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item disabled>Edit Details</Dropdown.Item>
              <Dropdown.Item onClick={() => removeJourney(journeyIdx)}>Remove</Dropdown.Item>
              <Dropdown.Item disabled>Set Active</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row><Col><hr/></Col></Row>
      <Row>        
        <Col sm ={8}>
          <Card>
            <Card.Body>
                {data.journeyDetail}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body className="text-center">
              <Card.Title>Quests Completed</Card.Title>
              <Card.Title>{data.questsComplete}/{data.totalQuests}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row><Col><h5>Overall Progress</h5></Col></Row>
      <Row className="p-2">
        <Col><ProgressBar now={data.progress} label={`${data.progress}%`}/></Col>
      </Row>
      <Row><Col><hr/></Col></Row>
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