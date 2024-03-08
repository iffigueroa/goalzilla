import React, {useState, useEffect} from 'react'
import { Row, Col, ListGroup, Container, Card, Button, Dropdown, ProgressBar, Navbar} from 'react-bootstrap';

import { useParams } from 'react-router-dom'



function QuestDisplay(){
    const {journeyIdx, questIdx} = useParams();

    const data = {'quests': ['hu', 'jo', 'sdifl'], 'tasks': ['Task One', 'Task Two', 'Task Three']}
    const questName = "Fake Quest"
    const questDescription = "Fake Quest description this is really interesting"
    return (   
        <Container>
            <Row>
                <Col sm={3} >
                    <Row className='p-2'>
                        <Card className="w-100">
                            <Card.Body>
                                <Card.Title>Journey Name</Card.Title>
                                Description
                                <hr/>
                                <ProgressBar  className='p-2' now={0} label={`${0}%`}/>
                            </Card.Body>
                        </Card>
                    </Row>
                    <Row className='p-2'><h3>Quests</h3></Row>
                    <Row className='p-2'>
                        <ListGroup className="w-100">
                            {data.quests.map((name, i) => (
                                <ListGroup.Item key={i} >{name}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Row>
                </Col>
                <Col sm={9}>
                    <Row>
                        <Col><h1 className='p-2'>{questName}</h1></Col>
                        <Col>
                            <Dropdown className="float-right p-1">
                                <Dropdown.Toggle variant="light"></Dropdown.Toggle>
                                <Dropdown.Menu>
                                <Dropdown.Item disabled onClick={() => console.log("Edit Details")}>Edit Details</Dropdown.Item>
                                <Dropdown.Item disabled onClick={() => console.log("Remove")}>Remove</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                        <Card>
                            <Card.Body>
                                {questDescription}
                            </Card.Body>
                        </Card>
                    <hr/>
                    <Row>
                        <Col sm={11}><h3 className='p-2'>Task List</h3></Col>
                        <Col><Button variant="light" className="float-right" onClick={()=>console.log("Adding New Task")}>+</Button></Col>
                    </Row>
                    <ListGroup>
                        {(typeof data.tasks === "undefined") ? (
                            <p>Loading...</p>
                            ) : (
                                data.tasks.map((name, i) => (
                                <ListGroup.Item key={i} onClick={()=>console.log(i)}>{name}</ListGroup.Item>
                            ))
                        )}
                    </ListGroup>
                    
                </Col>
            </Row>

        </Container>    
      )
  }
  
  export default QuestDisplay