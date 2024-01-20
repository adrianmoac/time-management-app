export function displayTasks(selectedOption, tasks, getTasks, completedTasks, getCompletedTasks) {
    let tasksData = []
    let timer = true
    let lastUpdateTime = Date.now(); 
    tasks[0].active = true
    tasks[0].timer = true
    tasksData = []
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    let endTime = ''
    tasks.forEach((element, index) => {
        let rt = parseInt(element.time)
        if(index === 0) {
            rt = Math.trunc(element.remainingTime - 1, 2)
            tasks[0] = {
                ...element,
                remainingTime: rt
            }
            localStorage.setItem('activeTasks', JSON.stringify(tasks))
        }
        currentTime.setMinutes(currentTime.getMinutes() + rt)
        const endHours = currentTime.getHours().toString().padStart(2, '0');
        const endMinutes = currentTime.getMinutes().toString().padStart(2, '0');
        const formattedEndTime = `${endHours}:${endMinutes}`;
        
        tasksData = [
            ...tasksData,
            {
            ...element,
                startTime: index === 0 ? formattedTime : endTime,
                finishTime: formattedEndTime,
                remainingTime: element.remainingTime
            }
        ]
        endTime = formattedEndTime
        console.log(tasksData)
    })
    function updateTime() {
        console.log(selectedOption)
        if(selectedOption === '.js-active') {
            const tasksContainer = document.querySelector('.tasks-container')
            let emptyHTML = ''
            if(tasks.length === 0) {
                emptyHTML += `
                <p class="task-title" style="text-align: center;">Parece que no has programado tareas</p>
                `
            } else {
                if(!timer) {
                    tasks[0].active = true
                    tasks[0].timer = true
                    tasksData = []
                    const currentTime = new Date();
                    const hours = currentTime.getHours().toString().padStart(2, '0');
                    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
                    const formattedTime = `${hours}:${minutes}`;
                    let endTime = ''
                    tasks.forEach((element, index) => {
                        currentTime.setMinutes(currentTime.getMinutes() + parseInt(element.remainingTime))
                        const endHours = currentTime.getHours().toString().padStart(2, '0');
                        const endMinutes = currentTime.getMinutes().toString().padStart(2, '0');
                        const formattedEndTime = `${endHours}:${endMinutes}`;

                        // if(index === 0) {
                        //     const timeSinceLastUpdate = Date.now() - lastUpdateTime;
                        //     if (timeSinceLastUpdate >= 60000) {
                        //         tasks[0] = {
                        //             ...element,
                        //             remainingTime: Math.trunc(element.remainingTime - 1, 2)
                        //         };
                        //         localStorage.setItem('activeTasks', JSON.stringify(tasks));
                        //         lastUpdateTime = Date.now();
                        //     }
                        // }
                        
                        tasksData = [
                            ...tasksData,
                            {
                            ...element,
                                startTime: index === 0 ? formattedTime : endTime,
                                finishTime: formattedEndTime,
                                remainingTime: element.remainingTime
                            }
                        ]
                        endTime = formattedEndTime
                        console.log(tasksData)
                    })
                } else {
                    tasks.forEach((element, index) => {
                        if(index === 0) {
                            const timeSinceLastUpdate = Date.now() - lastUpdateTime;
                            if (timeSinceLastUpdate >= 60000) {
                                tasks[0] = {
                                    ...element,
                                    remainingTime: Math.trunc(element.remainingTime - 1, 2)
                                };
                                tasksData[0] = {
                                    ...tasks[0]
                                }
                                localStorage.setItem('activeTasks', JSON.stringify(tasks));
                                lastUpdateTime = Date.now();
                            }
                        }
                    })
                }
                showTasksTimer()
    }
    function showTasksTimer() {
            tasksData.forEach((element) => {
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
                            ${element.active ? `<button class="task-action-button bi bi-check-lg js-complete"
                            data-task-id=${element.id}
                        ></button>
                        <button class="task-action-button ${timer ? 'bi-pause-fill' : 'bi-play-fill'} js-start-pause"></button>
                        <button class="task-action-button bi bi-trash-fill js-delete"
                            data-delete-id=${element.id}
                        ></button>` : ''}
                        </div>
                    </div>
                </div>`
            });
        }
        tasksContainer.innerHTML = emptyHTML
    } if(selectedOption === '.js-completed') {
        const tasksContainer = document.querySelector('.tasks-container')
        let emptyHTML = ''

        if(completedTasks.length === 0) {
            console.log('completedtask')
            emptyHTML += `
            <p class="task-title" style="text-align: center;">Parece que no has completado tareas recientemente</p>
            `
        }else {
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
        tasksContainer.innerHTML = emptyHTML
    }

    document.querySelectorAll('.js-complete').forEach((button) => {
        button.addEventListener('click', () => {
            const taskId = button.dataset.taskId;
            const ct = tasksData.find(element => element.id === taskId)
            completedTasks = [
                ...completedTasks,
                {
                    ...ct,
                    time: ct.remainingTime
                }
            ]
            tasks = tasks.filter(element => element.id !== taskId)
            localStorage.setItem('activeTasks', JSON.stringify(tasks))
            localStorage.setItem('completedTasks', JSON.stringify(completedTasks))

            tasks = getTasks()
            completedTasks = getCompletedTasks()

            displayTasks(selectedOption, tasks, getTasks, completedTasks, getCompletedTasks)

        });
    })

    document.querySelectorAll('.js-delete').forEach((button) => {
        button.addEventListener('click', () => {
            const taskId = button.dataset.deleteId
            if(selectedOption === '.js-active') {
                tasks = tasks.filter(element => element.id !== taskId)
                localStorage.setItem('activeTasks', JSON.stringify(tasks))
                tasks = getTasks()
            } else {
                completedTasks = completedTasks.filter(element => element.id !== taskId)
                localStorage.setItem('completedTasks', JSON.stringify(completedTasks))
                completedTasks = getCompletedTasks()
            }
            displayTasks(selectedOption, tasks, getTasks, completedTasks, getCompletedTasks)
        })
    })

    document.querySelectorAll('.js-start-pause').forEach((button) => {
        button.addEventListener('click', () => {
            timer = !timer
            updateTime()

        })
    })
    }

    updateTime()

    setInterval(updateTime, 1000); 
}

