import React, {useState, useEffect} from 'react'


import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Container, Card, Button, Form} from 'react-bootstrap';


function NewGoalForm({addNewGoal}){
  const [goalName, setGoalName] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault();
    addNewGoal(goalName);
    setGoalName('');
  };
  return (
    <Container className="text-center my-5">
        <Card>
            <Card.Body>
                <Card.Title>Add a New Goal</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>Goal Name</Form.Label>
                    <Form.Control onChange={(e) => setGoalName(e.target.value)} placeholder="Enter name here"/>
                  </Form.Group>
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
  const test = () => {
    console.log("HELLOOOOO")
  }
  const toggleGoalForm = () => {
    setShowNewGoalForm((prev) => !prev);
  };

  const addNewGoal = (goalName) => {
    // Add new member to the list
    fetch('/add_goal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "name": goalName }),
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

  return (
    <div>
      <h1>Goalzilla</h1>
      
      <Container>
        
        <Row>
          <Col xs={4} className='bg'>
          <Row>
          <Col xs={9} className='bg'><h2>Goals List</h2></Col>
          <Col xs={1} className='bg'><Button variant="light" onClick={toggleGoalForm}>New</Button></Col>
          
          </Row>
          
          <ListGroup>
            {(typeof data.goals === "undefined") ? (
                <p>Loading...</p>
              ) : (
                  data.goals.map((name, i) => (
                    <ListGroup.Item key={i} onClick={test}>{name}</ListGroup.Item>
                  ))
            )}
            </ListGroup>
          </Col>
          <Col>
          {showNewGoalForm && <NewGoalForm addNewGoal={addNewGoal}/>}
          </Col>
        </Row>
      </Container>
      
      
      
    </div>
  )
}

export default App