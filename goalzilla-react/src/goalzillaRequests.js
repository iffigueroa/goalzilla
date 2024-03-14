

export function getJourneyDetails({journeyIdx, setData}){
    fetch('/journeyDetails?journeyIdx='+journeyIdx).then(
    res => res.json()
    ).then(
        data => {
            setData(data)
        }
    ).catch(error => {
        console.error('Error fetching journey details:', error);
    });
}

export function getQuestDetails({journeyIdx, questIdx, setData}){
    fetch('/questDetails?journeyIdx='+journeyIdx+'&questIdx='+questIdx).then(
        res => res.json()
    ).then(
        data => {
            setData(data)
        }
    )
}

export function postAddQuest({journeyIdx,name,description}){
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
    })
}

export function postRemoveQuest({journeyIdx, questIdx}){
    fetch('/remove_quest', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "journeyIdx": journeyIdx, "questIdx": questIdx}),
    })
    .then((res) => res.text())
    .then((message) => {
        console.log(message);
    });
}

export function postTaskCompletion({journeyIdx, questIdx, taskIdx}){
    fetch('/add_task_completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "journeyIdx": journeyIdx, "questIdx":questIdx, "taskIdx": taskIdx}),
      })
        .then((res) => res.text())
        .then((message) =>{
            console.log(message)
        })
}


export function postAddTask({journeyIdx, questIdx, taskName}){
    fetch('/add_task', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "journeyIdx": journeyIdx, "questIdx": questIdx, 'taskName': taskName}),
    })
        .then((res) => res.text())
        .then((message) => {
            console.log(message);
            
        })
}


export function postRemoveTask({journeyIdx, questIdx, taskIdx}){
    fetch('/remove_task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "journeyIdx": journeyIdx, "questIdx": questIdx, "taskIdx": taskIdx }),
    })
    .then((res) => res.text())
    .then((message) => {
        console.log(message);
    });
}


export function getTaskDetails({journeyIdx, questIdx, taskIdx, setData}){
    const params = { journeyIdx, questIdx, taskIdx };
    const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
    const url = `/getTaskDetails?${queryString}`;

    fetch(url).then(
        res => res.json()
    ).then(
        data => {
            setData(data)
        }
    )
}

export function getQuestPreview({journeyIdx, setData}){
    fetch('/quest_preview?journeyIdx='+journeyIdx).then(
        res => res.json()
      ).then(
            data => {
                setData(data.quests)        
            }
        )
}

export function getJourneys({setData}){
    fetch('/goals').then(
    res => res.json()
    ).then(
        data => {
            setData(data)
        }
    )
}


export function postRemoveJourney({journeyIdx}){
    fetch('/remove_journey', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "index": journeyIdx}),
    }).then((res) => res.text())
    .then((message) => {
        console.log("Remove Journey: "+message);
    });
}


export function postAddJourney({name, description}){
    fetch('/add_goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "name": name, "description":description}),
    })
    .then((res) => res.text())
    .then((message) => {
        console.log("add goal: "+message);
    });
}