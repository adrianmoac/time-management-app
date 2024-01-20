import {updateTime} from './time.js'
import {addBtn} from './addButton.js'
import { displayTasks } from './displayTasks.js'


let tasks = JSON.parse(localStorage.getItem('activeTasks'))
if (!tasks || tasks.length === 0) {
    localStorage.setItem('activeTasks', JSON.stringify([]))
}
let completedTasks = JSON.parse(localStorage.getItem('completedTasks'))
if (!completedTasks || completedTasks.length === 0) {
    localStorage.setItem('completedTasks', JSON.stringify([]))
}

let selectedOption = '.js-active'
function selectedTab() {
    document.getElementsByName('css-tabs').forEach(element => {
        element.addEventListener('change', () => {
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.style.backgroundColor = '';
                btn.style.color = '';
            });
            selectedOption = '.' + element.id
            selectedTab()   
            displayTasks(selectedOption, tasks, getTasks, completedTasks, getCompletedTasks)

        })


    });

    const tabOption = document.querySelector(selectedOption)
    tabOption.style.backgroundColor = 'rgba(16, 16, 16, 0.19)';
    tabOption.style.color = 'rgb(28, 159, 152)';
    displayTasks(selectedOption, tasks, getTasks, completedTasks, getCompletedTasks)

}

const getTasks = () => {
    return JSON.parse(localStorage.getItem('activeTasks'))
}

const getCompletedTasks = () => {
    return JSON.parse(localStorage.getItem('completedTasks'))
}

addBtn(tasks, getTasks)
updateTime()
selectedTab()
