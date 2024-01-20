export function addBtn(tasks, getTasks) {
  let modal = document.querySelector('.modal')
  let openBtn = document.querySelector('.add-task-button')
  openBtn.addEventListener('click', () => {
    modal.style.display = "block"
    document.getElementById('title').focus()
  });


  window.addEventListener('click', (event) => {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  })

  const handleSubmit = (event) => {
    const id = "id" + Math.random().toString(16).slice(2)
    const title = document.getElementById('title')
    const time = document.getElementById('time')
    const parsedTime = `${time.value}:00`
      const updateTask = [
        ...tasks,
        {
          id: id,
          title: title.value,
          time: time.value,
          remainingTime: parsedTime,
        }
      ]
      localStorage.setItem('activeTasks', JSON.stringify(updateTask))
      tasks = getTasks()
      modal.style.display = 'none';
      title.value = '';
      time.value = '';
      location.reload(); 
      event.preventDefault()
  }
  let form = document.getElementById('modal'); 
  form.addEventListener('submit', handleSubmit, true);

}