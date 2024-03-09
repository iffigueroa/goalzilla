import React, {useState, useEffect} from 'react'
import { Row, Col, ListGroup, Alert, Container, Card, Button, Form, Dropdown, ProgressBar} from 'react-bootstrap';

import { useNavigate } from 'react-router-dom'

import { QuestForm } from './Quest'

function QuestDisplay({handleQuestAdded, journeyIdx}){
  const [showQuestForm, setShowQuestForm] = useState(false)
  const [questData, setQuestData] = useState([{}])
  const navigate = useNavigate()
  useEffect(() => {
    fetch('/quest_preview?journeyIdx='+journeyIdx).then(
      res => res.json()
    ).then(
      data => {
        setQuestData(data.quests)        
        console.log(questData)
      }
    )
  }, [journeyIdx])

  const removeQuest = (i) => {
    console.log("Remove Quest"+i)
    fetch('/remove_quest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "journeyIdx": journeyIdx, "questIdx": i}),
    })
      .then((res) => res.text())
      .then((message) => {
        console.log(message);
        fetch('/quest_preview?journeyIdx='+journeyIdx).then(
          res => res.json()
        ).then(
            data => {
              setQuestData(data.quests)        
            }
          )
      });
  }

  const addQuest = (name, description) => {
    fetch('/add_quest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "journeyIdx": journeyIdx, "name": name, "description":description}),
    })
      .then((res) => res.text())
      .then((message) => {
        console.log(message);
        fetch('/quest_preview?journeyIdx='+journeyIdx).then(
          res => res.json()
        ).then(
            data => {
              setQuestData(data.quests)  
              
            }
          )
      })
      toggleQuestForm()
      handleQuestAdded()
  };
    const toggleQuestForm = () => {
        setShowQuestForm((prev) => !prev);
    };
  const navigateToQuest = (journeyIdx, questIdx) =>{
    navigate('/quest', { state: {journeyIdx, questIdx}});
  };

  return (
    <Container fluid>
      <Row>
        <Col sm={10}><h3>Quests</h3></Col>
        <Col><Button className='float-right' variant='light' onClick={toggleQuestForm}>{showQuestForm ? '-' : '+'}</Button></Col>
      </Row>
      {showQuestForm &&  <Row><QuestForm addQuest={addQuest}/></Row>}
      <Row>
        {(questData.length === 0) ? (
            <Alert variant='light'>
              No quests available. Add some to get started.
            </Alert>
          ) : (
              questData.map((q, i) => (
                <Col sm={4} key={i} className="py-2">
                  <Card className="h-100">
                    {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                    <Card.Body>
                      <Button size="sm" className="float-right" variant='light' onClick={()=>removeQuest(i)}>X</Button>
                      <Card.Title>{q.name}</Card.Title> 
                      <Card.Text>{q.description}</Card.Text>
                      
                    </Card.Body>
                    <Card.Footer><Button onClick={()=>navigateToQuest(journeyIdx, i)}>Start Quest</Button></Card.Footer>
                  </Card>
                </Col>
              ))
        )}
      </Row>
    </Container>
  )
}

function JourneyDisplay({journeyIdx, removeJourney}){
  const [data, setData] = useState([{}])
  const [questsAdded, setQuestsAdded] = useState(0)

  const handleQuestAdded = () => {
    setQuestsAdded(questsAdded+1)
  }
  useEffect(() => {
    fetch('/journeyDetails?index='+journeyIdx).then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [journeyIdx, questsAdded])

  return (
    <Container fluid="sm">
      <Row >
        <Col sm={11}><h1>{data.journeyName}</h1></Col>
        <Col>
          <Dropdown>
            <Dropdown.Toggle variant="light"></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item disabled>Edit Details</Dropdown.Item>
              <Dropdown.Item onClick={() => removeJourney(journeyIdx)}>Remove</Dropdown.Item>
              <Dropdown.Item disabled>Set Active</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row><Col><hr/></Col></Row>
      <Row className="d-flex align-items-stretch">        
        <Col sm ={8}>
          <Card className="h-100">
            <Card.Body>
                {data.journeyDetail}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>Quests Completed</Card.Title>
              <Card.Title>{data.questsComplete}/{data.totalQuests}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row><Col className='m-2'><h5>Overall Progress</h5></Col></Row>
      <Row className="p-2">
        <Col><ProgressBar now={data.progress} label={`${data.progress}%`}/></Col>
      </Row>
      <Row><Col><hr/></Col></Row>
      <Row>
        <QuestDisplay handleQuestAdded={handleQuestAdded} journeyIdx={journeyIdx}/>
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

function Journeys(){
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
            {data.goals?.length > 0 && showGoalTrack && <JourneyDisplay journeyIdx={goalTrackId} removeJourney={removeJourney} />}
            </Col>
        </Row>
      </Container>   
    )
}

export default Journeys