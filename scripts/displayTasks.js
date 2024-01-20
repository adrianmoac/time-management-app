let interval 
let start = false

export function displayTasks(selectedOption, tasks, getTasks, completedTasks, getCompletedTasks) {
    tasks = getTasks()
    completedTasks = getCompletedTasks()
    window.clearInterval(interval)
    const alarm = new Audio('../audio/alarm.mp3')

    let currentStartTime = new Date()
    for(let i = 0; i < tasks.length; i++) {
        const hours = currentStartTime.getHours().toString().padStart(2, '0');
        const minutes = currentStartTime.getMinutes().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;
        currentStartTime.setMinutes(currentStartTime.getMinutes() + parseInt(tasks[i].remainingTime))
        const endHours = currentStartTime.getHours().toString().padStart(2, '0');
        const endMinutes = currentStartTime.getMinutes().toString().padStart(2, '0');
        const formattedEndTime = `${endHours}:${endMinutes}`;
        if(i === 0) {
            tasks[0] = {
                ...tasks[0],
                startTime: formattedTime,
                finishTime: formattedEndTime
            }
            currentStartTime = new Date(currentStartTime)
        } else {
            tasks[i] = {
                ...tasks[i],
                startTime: tasks[i - 1].finishTime,
                finishTime: formattedEndTime
            }
            currentStartTime = new Date(currentStartTime)
        }
    }
    localStorage.setItem('activeTasks', JSON.stringify(tasks))
    tasks = getTasks()



    if(selectedOption === '.js-active') {
        displayActive(tasks, start, selectedOption)
    } else {
        displayCompleted(completedTasks)
    }
    
    //Submit Task
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('js-complete')) {
            const taskId = event.target.dataset.taskId;
            const toCompletedTasks = tasks.find(task => task.id === taskId);
            const currentStartTime = new Date()
            const hours = currentStartTime.getHours().toString().padStart(2, '0');
            const minutes = currentStartTime.getMinutes().toString().padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;
            toCompletedTasks.finishTime = formattedTime
            completedTasks = [
                ...completedTasks,
                toCompletedTasks
            ];
            tasks = tasks.filter(task => task.id !== taskId);
            localStorage.setItem('activeTasks', JSON.stringify(tasks));
            localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
            tasks = getTasks();
            completedTasks = getCompletedTasks();
            alarm.pause()
            location.reload();
        }
    });
    //Delete Task
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('js-delete')) {
            const taskId = event.target.dataset.deleteId;
            if (selectedOption === '.js-active') {
                tasks = tasks.filter(task => task.id !== taskId);
                localStorage.setItem('activeTasks', JSON.stringify(tasks));
                tasks = getTasks();
            } else {
                completedTasks = completedTasks.filter(task => task.id !== taskId);
                localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
                completedTasks = getCompletedTasks();
            }
            alarm.pause()
            location.reload();
        }
    });
    //Start Pause Task
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('js-start-pause')) {
            start = !start;
            displayActive(tasks, start, selectedOption);
        }
    });

    interval = setInterval(() => {
        updateTime(tasks, getTasks, start, alarm);
        displayActive(tasks, start, selectedOption);
    }, 1000)

    
};

function displayActive(tasks, start, selectedOption) {
    let emptyHTML = ''
    if(selectedOption === '.js-active') {
        if(tasks.length === 0) {
            emptyHTML += `
            <p class="task-title" style="text-align: center;">Parece que no has programado tareas recientemente</p>
            `
        } else {
            tasks.forEach((element, index) => {
                emptyHTML += `
                <div class="task-container">
                    <div class="task-info-container">
                        <p class="task-title">${element.title}</p>
                        <p class="task-time">${element.time} minutos</p>
                    </div>
                    <div class="task-progress-container">
                        <div class="task-times-container">
                            <div class="task-time-info">
                                <p class="time-labels">Hora de inicio</p>
                                <p class="calculated-time">${element.startTime}</p>
                            </div>
                            <div class="task-time-info">
                                <p class="time-labels">Hora de fin</p>
                                <p class="calculated-time">${element.finishTime}</p>
                            </div>
                            <div class="task-time-info">
                                <p class="time-labels">Tiempo restante</p>
                                <p class="calculated-time">${element.remainingTime}</p>
                            </div>
                        </div>
                        <div class="task-actions-container">
                            <button class="task-action-button bi bi-check-lg js-complete" data-task-id=${element.id} ${index !== 0 ? 'disabled' : ''}
                        ></button>
                        <button class="task-action-button ${index === 0 && start ? 'bi-pause-fill': 'bi-play-fill'} js-start-pause" ${index !== 0 ? 'disabled' : ''}></button>
                        <button class="task-action-button bi bi-trash-fill js-delete" data-delete-id=${element.id} 
                        ></button>
                        </div>
                    </div>
                </div>`
            });
        }
        document.querySelector('.tab-content.js-active').innerHTML = emptyHTML

    }


}

function displayCompleted(completedTasks) {
    let emptyHTML = ''
    if(completedTasks.length === 0) {
        emptyHTML += `
        <p class="task-title" style="text-align: center;">Parece que no has completado tareas recientemente</p>
        `
    } else {
        completedTasks.forEach(element => {
            emptyHTML += `
            <div class="task-container">
                <div class="task-info-container">
                    <p class="task-title">${element.title}</p>
                    <p class="task-time">${element.time} minutos</p>
                </div>
                <div class="task-progress-container">
                    <div class="task-times-container">
                        <div class="task-time-info">
                            <p class="time-labels">Hora de inicio</p>
                            <p class="calculated-time">${element.startTime}</p>
                        </div>
                        <div class="task-time-info">
                            <p class="time-labels">Hora de fin</p>
                            <p class="calculated-time">${element.finishTime}</p>
                        </div>
                        <div class="task-time-info">
                            <p class="time-labels">Tiempo restante</p>
                            <p class="calculated-time">${element.remainingTime}</p>
                        </div>
                    </div>
                        <button class="task-action-button bi bi-trash-fill js-delete"
                            data-delete-id=${element.id}
                        ></button>
                </div>
            </div>`
        });
    }

    document.querySelector('.tab-content.js-completed').innerHTML = emptyHTML
}

function updateTime(tasks, getTasks, start, alarm) {
    if (start) {
        time = tasks[0].remainingTime
        const negative = time.indexOf('-')
        const timeArray = time.split(':')
        const minutes = parseInt(timeArray[0])
        const seconds = parseInt(timeArray[1])
        console.log(minutes)
        const totalTime = negative === -1 ? minutes * 60 + seconds : (minutes * 60 + seconds) * - 1
        const resultTime = totalTime - 1
        let toMinutes = Math.trunc(Math.abs(resultTime / 60))
        let toSeconds = Math.abs(resultTime) % 60 
        toMinutes = toMinutes < 10 ? '0' + toMinutes : toMinutes
        toSeconds = toSeconds < 10 ? '0' + toSeconds : toSeconds
        const remainingTime = totalTime > 0 ? `${toMinutes}:${toSeconds}` : `-${toMinutes}:${toSeconds}`
        tasks[0].remainingTime = remainingTime;
        localStorage.setItem('activeTasks', JSON.stringify(tasks));
        tasks = getTasks();
        if(remainingTime === '00:00') {
            alarm.play()
        }
    }
}

